import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createOrder } from '@/lib/db';
import { createMidtransSnapTransaction } from '@/lib/midtrans';
import { PACKAGES, Order } from '@/lib/types';

export const runtime = 'nodejs';

// ── In-Memory IP Rate Limiter (Max 6 requests per 5 minutes per IP) ───────────
const ipRateMap = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: NextRequest) {
  try {
    // ── Client IP & Rate Limiting ───────────────────────────────────────────
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous';

    const now = Date.now();
    const windowMs = 5 * 60 * 1000; // 5 minutes
    const maxRequests = 6; // max 6 submissions per 5 minutes

    // Prune stale cache entries
    if (ipRateMap.size > 200) {
      for (const [ip, entry] of ipRateMap.entries()) {
        if (now > entry.resetAt) ipRateMap.delete(ip);
      }
    }

    const currentRate = ipRateMap.get(clientIp);
    if (currentRate && now < currentRate.resetAt) {
      if (currentRate.count >= maxRequests) {
        return NextResponse.json(
          { error: 'Terlalu banyak permintaan checkout. Silakan tunggu beberapa menit.' },
          { status: 429 }
        );
      }
      currentRate.count++;
    } else {
      ipRateMap.set(clientIp, { count: 1, resetAt: now + windowMs });
    }

    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      storeName,
      businessType,
      notes,
    } = body;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!customerName?.trim()) {
      return NextResponse.json({ error: 'Nama lengkap wajib diisi.' }, { status: 400 });
    }
    if (!customerPhone?.trim() || customerPhone.trim().length < 9) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp tidak valid. Contoh: 081234567890.' },
        { status: 400 }
      );
    }
    if (!customerEmail?.trim() || !customerEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Alamat email wajib diisi untuk pengiriman link APK.' },
        { status: 400 }
      );
    }

    // ── Pre-flight Server Key Check (Anti-Bypass & Anti-Ghost Order) ────────
    const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
    const isDev = process.env.NODE_ENV !== 'production';

    if (!serverKey || serverKey.includes('xxxxxxxx') || serverKey.length < 8) {
      console.error('[Checkout] MIDTRANS_SERVER_KEY is missing or unconfigured.');
      return NextResponse.json(
        {
          error: isDev
            ? 'DEV NOTICE: MIDTRANS_SERVER_KEY belum diisi di environment (.env). Silakan isi kredensial Midtrans Server Key Anda di .env.'
            : 'Layanan pembayaran instan sedang dalam pemeliharaan berkala. Mohon maaf atas ketidaknyamanannya. Silakan hubungi admin kami via WhatsApp untuk transaksi langsung atau coba beberapa saat lagi.',
          contactAdmin: !isDev,
        },
        { status: 503 }
      );
    }

    // Server-Authoritative Price: User cannot tamper with amount
    const pkg = PACKAGES['software_only'];
    const orderId = uuidv4();

    // Dynamic Site URL (zero hardcoding, handles custom domains, Vercel preview, and local dev)
    const siteUrl = (
      process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
      req.nextUrl.origin
    ).replace(/\/+$/, '');

    const successUrl = `${siteUrl}/order/${orderId}`;

    // ── Create Midtrans Snap Transaction ─────────────────────────────────────
    let snapResult;
    try {
      snapResult = await createMidtransSnapTransaction({
        orderId,
        amount:        pkg.price,
        customerName:  customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        productName:   `Lisensi POS OFFLINE – ${storeName?.trim() ?? customerName.trim()}`,
        successUrl,
      });
    } catch (midtransErr) {
      console.error('[Checkout] Midtrans Snap API Error:', midtransErr);
      const devMsg =
        midtransErr instanceof Error
          ? midtransErr.message
          : 'Gagal menghubungi server Midtrans. Periksa kembali kredensial Server Key Anda.';
      return NextResponse.json(
        {
          error: isDev
            ? `DEV NOTICE: Gagal membuat transaksi Midtrans: ${devMsg}`
            : 'Layanan pembayaran instan sedang mengalami gangguan sementara. Silakan hubungi admin kami via WhatsApp untuk bantuan pemesanan atau coba beberapa saat lagi.',
          contactAdmin: !isDev,
        },
        { status: 502 }
      );
    }

    // ── Persist Order Only When Snap Session Successfully Created ────────────
    const order: Order = {
      id:                    orderId,
      customerName:          customerName.trim(),
      customerPhone:         customerPhone.trim(),
      customerEmail:         customerEmail.trim(),
      storeName:             storeName?.trim()      ?? undefined,
      businessType:          businessType?.trim()   ?? undefined,
      packageType:           'software_only',
      amount:                pkg.price,
      paymentMethod:         'midtrans',
      paymentStatus:         'pending',
      midtransPaymentToken:  snapResult.token,
      midtransRedirectUrl:   snapResult.redirectUrl,
      notes:                 notes?.trim() ?? undefined,
      createdAt:             new Date().toISOString(),
    };

    await createOrder(order);

    // ── Response ─────────────────────────────────────────────────────────────
    const clientKey =
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.trim() ||
      process.env.MIDTRANS_CLIENT_KEY?.trim() ||
      '';

    return NextResponse.json({
      orderId,
      snapToken: snapResult.token,
      redirectUrl: snapResult.redirectUrl,
      clientKey,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan pada server. Silakan coba lagi.';
    console.error('[Checkout] Unexpected error:', err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
