/**
 * Mayar.id Webhook Handler
 *
 * Mayar.id POSTs to this endpoint when a payment status changes.
 * Events handled:
 *  - payment.success → mark order paid, send email, fire Meta Pixel server event
 *
 * Endpoint: POST /api/webhook/mayar
 *
 * Configure this URL in: Mayar.id Dashboard → Settings → Webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyMayarSignature } from '@/lib/mayar';
import { getOrderByMayarId, updateOrderPaymentStatus, markEmailSent } from '@/lib/db';
import { sendPurchaseConfirmationEmail } from '@/lib/email';
import { ADMIN_CONTACTS } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // ── Read raw body for signature verification ───────────────────────────────
  const rawBody = await req.text();

  // ── Verify Mayar.id Signature ──────────────────────────────────────────────
  const signature = req.headers.get('x-mayar-signature') ?? '';
  const isValid   = verifyMayarSignature(rawBody, signature);
  if (!isValid) {
    console.warn('[Webhook/Mayar] Invalid signature — request rejected.');
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
  }

  // ── Parse Payload ───────────────────────────────────────────────────────────
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const event  = (payload.event  ?? payload.type)  as string | undefined;
  const status = (payload.status)                  as string | undefined;
  const data   = (payload.data   ?? payload)       as Record<string, unknown>;

  console.log(`[Webhook/Mayar] Event: ${event ?? 'unknown'} | Status: ${status ?? 'unknown'}`);

  // ── Handle payment.success ──────────────────────────────────────────────────
  const isPaid =
    event === 'payment.success' ||
    event === 'payment_success'  ||
    status === 'paid'             ||
    (data?.status as string) === 'paid';

  if (!isPaid) {
    // Acknowledge non-payment events silently
    return NextResponse.json({ received: true });
  }

  // Extract Mayar payment ID from the webhook payload
  const mayarPaymentId =
    (data?.id as string) ??
    (data?.paymentLinkId as string) ??
    (data?.payment_link_id as string) ??
    (data?.payment_id as string) ??
    (payload?.id as string);

  if (!mayarPaymentId) {
    console.error('[Webhook/Mayar] Could not extract payment ID from payload:', payload);
    return NextResponse.json({ error: 'Missing payment ID.' }, { status: 400 });
  }


  // ── Fetch order from DB ─────────────────────────────────────────────────────
  const order = await getOrderByMayarId(mayarPaymentId);
  if (!order) {
    console.error(`[Webhook/Mayar] Order not found for mayarPaymentId: ${mayarPaymentId}`);
    // Return 200 to stop Mayar from retrying — we log but don't fail
    return NextResponse.json({ received: true });
  }

  if (order.paymentStatus === 'paid') {
    // Idempotency: already processed
    return NextResponse.json({ received: true });
  }

  // ── Mark order as paid ──────────────────────────────────────────────────────
  await updateOrderPaymentStatus(order.id, 'paid');

  // ── Send confirmation email ─────────────────────────────────────────────────
  if (order.customerEmail) {
    const adminContact = ADMIN_CONTACTS.find((c) => c.id === 'filamsi') ?? ADMIN_CONTACTS[0]; // Technical admin for activation
    const emailResult  = await sendPurchaseConfirmationEmail({
      to:            order.customerEmail,
      customerName:  order.customerName,
      storeName:     order.storeName,
      orderId:       order.id,
      amount:        order.amount,
      adminWaNumber: adminContact.waNumber,
    });

    if (emailResult.success) {
      await markEmailSent(order.id);
      console.log(`[Webhook/Mayar] Email sent to ${order.customerEmail} for order ${order.id}`);
    } else {
      console.error(`[Webhook/Mayar] Email failed for order ${order.id}:`, emailResult.error);
    }
  } else {
    console.warn(`[Webhook/Mayar] Order ${order.id} has no customer email — skipping email.`);
  }

  return NextResponse.json({ received: true });
}

// Mayar.id sometimes sends a GET request to validate the webhook URL
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'POS OFFLINE webhook is active.' });
}
