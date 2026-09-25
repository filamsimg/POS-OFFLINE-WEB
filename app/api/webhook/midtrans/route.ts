/**
 * Midtrans Webhook / HTTP Notification Handler
 * Official docs: https://docs.midtrans.com/reference/handling-notifications
 *
 * Endpoint: POST /api/webhook/midtrans
 * Configure this URL in: Midtrans Dashboard -> Settings -> Configuration -> Payment Notification URL
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyMidtransSignature } from '@/lib/midtrans';
import { getOrderById, updateOrderPaymentStatus, markEmailSent } from '@/lib/db';
import { sendPurchaseConfirmationEmail } from '@/lib/email';
import { ADMIN_CONTACTS } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const orderId = body.order_id;
    const statusCode = body.status_code;
    const grossAmount = body.gross_amount;
    const signatureKey = body.signature_key;
    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

    if (!orderId || !statusCode || !grossAmount || !signatureKey) {
      return NextResponse.json({ error: 'Missing required notification fields.' }, { status: 400 });
    }

    const isValid = verifyMidtransSignature(orderId, statusCode, grossAmount, signatureKey);
    if (!isValid) {
      console.warn(`[Webhook/Midtrans] Invalid signature for order: ${orderId}`);
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      console.warn(`[Webhook/Midtrans] Order not found for orderId: ${orderId}`);
      return NextResponse.json({ received: true });
    }

    let isPaid = false;
    let isCancelled = false;

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        isPaid = true;
      }
    } else if (transactionStatus === 'settlement') {
      isPaid = true;
    } else if (
      transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire'
    ) {
      isCancelled = true;
    }

    if (isPaid) {
      if (order.paymentStatus !== 'paid') {
        await updateOrderPaymentStatus(order.id, 'paid');

        if (order.customerEmail) {
          try {
            const adminContact = ADMIN_CONTACTS.find((c) => c.id === 'filamsi') ?? ADMIN_CONTACTS[0];
            const emailResult = await sendPurchaseConfirmationEmail({
              to:            order.customerEmail,
              customerName:  order.customerName,
              storeName:     order.storeName,
              orderId:       order.id,
              amount:        order.amount,
              adminWaNumber: adminContact.waNumber,
            });
            if (emailResult.success) {
              await markEmailSent(order.id);
            }
          } catch (emailErr) {
            console.error('[Webhook/Midtrans] Email send error:', emailErr);
          }
        }
      }
    } else if (isCancelled) {
      await updateOrderPaymentStatus(order.id, 'cancelled');
    }

    return NextResponse.json({ status: 'success' });
  } catch (err) {
    console.error('[Webhook/Midtrans] Notification processing error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
