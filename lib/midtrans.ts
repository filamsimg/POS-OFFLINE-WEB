/**
 * Midtrans Snap API Client
 * Official docs: https://docs.midtrans.com/reference/snap-transactions
 */

import crypto from 'crypto';

export interface CreateSnapTransactionParams {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName?: string;
  successUrl?: string;
}

export interface SnapTransactionResult {
  token: string;
  redirectUrl: string;
}

export async function createMidtransSnapTransaction({
  orderId,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  productName = 'Lisensi Software POS OFFLINE Permanen',
  successUrl,
}: CreateSnapTransactionParams): Promise<SnapTransactionResult> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
  if (!serverKey) {
    throw new Error('MIDTRANS_SERVER_KEY is not configured in environment variables.');
  }

  const isProduction =
    process.env.MIDTRANS_IS_PRODUCTION === 'true' ||
    (process.env.NODE_ENV === 'production' && process.env.MIDTRANS_IS_PRODUCTION !== 'false');

  const baseUrl = isProduction
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

  const authHeader = `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`;

  const payload = {
    transaction_details: {
      order_id: orderId,
      gross_amount: Math.round(amount),
    },
    item_details: [
      {
        id: 'POS_OFFLINE_LIFETIME',
        price: Math.round(amount),
        quantity: 1,
        name: productName.slice(0, 50),
      },
    ],
    customer_details: {
      first_name: customerName,
      email: customerEmail,
      phone: customerPhone,
    },
    callbacks: successUrl ? { finish: successUrl } : undefined,
  };

  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data.token) {
    const errorMsg =
      Array.isArray(data.error_messages) && data.error_messages.length > 0
        ? data.error_messages.join(', ')
        : data.message || `Midtrans API Error (status ${res.status})`;
    throw new Error(errorMsg);
  }

  return {
    token: data.token,
    redirectUrl: data.redirect_url,
  };
}

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  receivedSignature: string
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim() || '';
  if (!serverKey || !receivedSignature) return false;

  const expectedSignature = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex');

  return expectedSignature.toLowerCase() === receivedSignature.trim().toLowerCase();
}
