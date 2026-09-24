import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createOrder } from '@/lib/db';
import { createMayarPayment } from '@/lib/mayar';
import { PACKAGES, Order } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
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

    const pkg       = PACKAGES['software_only'];
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const successUrl = `${siteUrl}/order/${orderId}`;

    // ── Create Mayar.id Payment Link ─────────────────────────────────────────
    let mayarPaymentId:  string | undefined;
    let mayarPaymentUrl: string | undefined;

    try {
      const mayarResult = await createMayarPayment({
        orderId,
        amount:        pkg.price,
        customerName:  customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        description:   `Lisensi POS OFFLINE Permanen – ${storeName?.trim() ?? customerName.trim()}`,
        successUrl,
      });
      mayarPaymentId  = mayarResult.paymentId;
      mayarPaymentUrl = mayarResult.paymentUrl;
    } catch (mayarErr) {
      console.warn('[Checkout] Mayar.id not available, saving order without payment URL:', mayarErr);
      // Continue without Mayar if not configured yet (dev mode)
    }

    // ── Persist Order ────────────────────────────────────────────────────────
    const order: Order = {
      id:             orderId,
      customerName:   customerName.trim(),
      customerPhone:  customerPhone.trim(),
      customerEmail:  customerEmail.trim(),
      storeName:      storeName?.trim()      ?? undefined,
      businessType:   businessType?.trim()   ?? undefined,
      packageType:    'software_only',
      amount:         pkg.price,
      paymentMethod:  'mayar',
      paymentStatus:  'pending',
      mayarPaymentId,
      mayarPaymentUrl,
      notes:          notes?.trim() ?? undefined,
      createdAt:      new Date().toISOString(),
    };

    await createOrder(order);

    // ── Response ─────────────────────────────────────────────────────────────
    if (mayarPaymentUrl) {
      return NextResponse.json({ redirectUrl: mayarPaymentUrl });
    }

    // Fallback when Mayar not configured: redirect to order status page
    return NextResponse.json({ redirectUrl: successUrl });
  } catch (err) {
    console.error('[Checkout] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
