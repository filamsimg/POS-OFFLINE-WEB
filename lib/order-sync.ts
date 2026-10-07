import { Order, ADMIN_CONTACTS } from '@/lib/types';
import { getOrderById, updateOrderPaymentStatus, markEmailSent } from '@/lib/db';
import { getMidtransTransactionStatus } from '@/lib/midtrans';
import { sendPurchaseConfirmationEmail } from '@/lib/email';

export interface SyncOrderResult {
  order: Order | null;
  updated: boolean;
  status: 'paid' | 'pending' | 'cancelled' | 'unknown';
}

/**
 * Actively synchronizes an order's payment status with Midtrans API.
 *
 * This dual-path verification ensures that:
 * 1. Even if webhooks fail or cannot reach localhost/development environments,
 *    the order status will auto-update when the user visits or polls /order/[id].
 * 2. If the user completes payment via Midtrans Snap (QRIS, VA, CC), license activation unlocks immediately.
 * 3. Idempotency is strictly preserved: confirmation emails and DB updates are only executed once.
 */
export async function syncOrderPaymentStatus(
  orderOrId: string | Order
): Promise<SyncOrderResult> {
  let order: Order | null = null;
  if (typeof orderOrId === 'string') {
    order = await getOrderById(orderOrId);
  } else {
    order = orderOrId;
  }

  if (!order) {
    return { order: null, updated: false, status: 'unknown' };
  }

  // Already marked paid in database
  if (order.paymentStatus === 'paid') {
    return { order, updated: false, status: 'paid' };
  }

  try {
    const midtransStatus = await getMidtransTransactionStatus(order.id);
    if (!midtransStatus) {
      return { order, updated: false, status: order.paymentStatus };
    }

    if (midtransStatus.isPaid) {
      // 1. Mark order paid in DB
      await updateOrderPaymentStatus(order.id, 'paid');
      order.paymentStatus = 'paid';

      // 2. Trigger customer confirmation email if not sent yet
      if (order.customerEmail && !order.emailSentAt) {
        try {
          const adminContact = ADMIN_CONTACTS.find((c) => c.id === 'filamsi') ?? ADMIN_CONTACTS[0];
          const emailRes = await sendPurchaseConfirmationEmail({
            to:            order.customerEmail,
            customerName:  order.customerName,
            storeName:     order.storeName,
            orderId:       order.id,
            amount:        order.amount,
            adminWaNumber: adminContact.waNumber,
          });

          if (emailRes.success) {
            await markEmailSent(order.id);
            order.emailSentAt = new Date().toISOString();
            console.log(`[OrderSync] Confirmation email sent for order ${order.id}`);
          } else {
            console.warn(`[OrderSync] Email sending failed for order ${order.id}:`, emailRes.error);
          }
        } catch (emailErr) {
          console.error(`[OrderSync] Email exception for order ${order.id}:`, emailErr);
        }
      }

      return { order, updated: true, status: 'paid' };
    }

    if (midtransStatus.status === 'cancelled') {
      await updateOrderPaymentStatus(order.id, 'cancelled');
      order.paymentStatus = 'cancelled';
      return { order, updated: true, status: 'cancelled' };
    }

    return { order, updated: false, status: order.paymentStatus };
  } catch (err) {
    console.error(`[OrderSync] Error reconciling order ${order.id}:`, err);
    return { order, updated: false, status: order.paymentStatus };
  }
}
