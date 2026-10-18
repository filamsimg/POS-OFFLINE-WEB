import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createOrder, getRecentPendingOrderByPhone } from '@/lib/db';
import { createMidtransSnapTransaction, isMidtransConfigured } from '@/lib/midtrans';
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
      paymentMethod = 'gopay',
      notes,
      forceNew,
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

    // ── Anti-Spam & Resume Active Pending Order ─────────────────────────────
    // Jangan kunci pesanan jika:
    // 1. User eksplisit meminta pesanan baru (forceNew === true)
    // 2. Nama customer berbeda (misal: "filamsi" vs "filamsi mabda")
    // 3. Nama toko berbeda
    const existingPendingOrder = !forceNew
      ? await getRecentPendingOrderByPhone(customerPhone.trim(), 2)
      : null;

    const isSameCustomer =
      existingPendingOrder &&
      existingPendingOrder.customerName.trim().toLowerCase() === customerName.trim().toLowerCase() &&
      (!storeName?.trim() ||
        !existingPendingOrder.storeName ||
        existingPendingOrder.storeName.trim().toLowerCase() === storeName.trim().toLowerCase());

    if (existingPendingOrder && isSameCustomer) {
      console.log(`[Checkout] Resuming active pending order ${existingPendingOrder.id} for phone ${customerPhone.trim()}`);
      const clientKey =
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.trim() ||
        process.env.MIDTRANS_CLIENT_KEY?.trim() ||
        '';

      return NextResponse.json({
        orderId:        existingPendingOrder.id,
        snapToken:      existingPendingOrder.midtransPaymentToken,
        redirectUrl:    existingPendingOrder.midtransRedirectUrl,
        clientKey:      existingPendingOrder.midtransPaymentToken ? clientKey : '',
        manualTransfer: !existingPendingOrder.midtransPaymentToken,
        resumed:        true,
      });
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

    // ── Filter Midtrans Payment Methods Based on User Selection ─────────────
    let enabledPayments: string[] | undefined = undefined;
    if (paymentMethod === 'qris') {
      enabledPayments = ['other_qris', 'gopay', 'shopeepay'];
    } else if (paymentMethod === 'gopay') {
      enabledPayments = ['gopay'];
    } else if (paymentMethod === 'bca') {
      enabledPayments = ['bca_va'];
    } else if (paymentMethod === 'mandiri') {
      enabledPayments = ['echannel', 'mandiri_va'];
    } else if (paymentMethod === 'bri') {
      enabledPayments = ['bri_va'];
    } else if (paymentMethod === 'bni') {
      enabledPayments = ['bni_va'];
    } else if (paymentMethod === 'bsi') {
      enabledPayments = ['bsi_va'];
    } else if (paymentMethod === 'permata') {
      enabledPayments = ['permata_va'];
    }

    const hasValidMidtrans = isMidtransConfigured();
    const isManual = paymentMethod === 'manual' || !hasValidMidtrans;

    let snapResult = null;
    if (!isManual) {
      try {
        snapResult = await createMidtransSnapTransaction({
          orderId,
          amount:        pkg.price,
          customerName:  customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          productName:   `Lisensi POS OFFLINE – ${storeName?.trim() ?? customerName.trim()}`,
          successUrl,
          enabledPayments,
        });
      } catch (midtransErr) {
        console.warn('[Checkout] Midtrans Snap API error, falling back to manual order:', midtransErr);
      }
    }

    const finalPaymentMethod = snapResult ? 'midtrans' : 'manual_transfer';

    // ── Persist Order to DB ──────────────────────────────────────────────────
    const order: Order = {
      id:                    orderId,
      customerName:          customerName.trim(),
      customerPhone:         customerPhone.trim(),
      customerEmail:         customerEmail.trim(),
      storeName:             storeName?.trim()      ?? undefined,
      businessType:          businessType?.trim()   ?? undefined,
      packageType:           'software_only',
      amount:                pkg.price,
      paymentMethod:         finalPaymentMethod,
      paymentStatus:         'pending',
      midtransPaymentToken:  snapResult?.token,
      midtransRedirectUrl:   snapResult?.redirectUrl,
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
      snapToken: snapResult?.token,
      redirectUrl: snapResult?.redirectUrl,
      clientKey: snapResult ? clientKey : '',
      manualTransfer: !snapResult,
      selectedMethod: paymentMethod,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan pada server. Silakan coba lagi.';
    console.error('[Checkout] Unexpected error:', err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
