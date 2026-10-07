/**
 * Midtrans Snap API Client
 * Official docs: https://docs.midtrans.com/reference/snap-transactions
 * Status API: https://docs.midtrans.com/reference/get-transaction-status
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

export interface MidtransStatusResult {
  isPaid: boolean;
  status: 'paid' | 'pending' | 'cancelled' | 'unknown';
  rawStatus?: string;
  paymentType?: string;
  transactionTime?: string;
}

function getMidtransConfig() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim() || '';
  const isSandboxKey = serverKey.startsWith('SB-');
  const isExplicitProd = process.env.MIDTRANS_IS_PRODUCTION === 'true';
  const isProduction =
    !isSandboxKey &&
    (isExplicitProd || (process.env.NODE_ENV === 'production' && process.env.MIDTRANS_IS_PRODUCTION !== 'false'));

  return {
    serverKey,
    isProduction,
    snapBaseUrl: isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions',
    apiBaseUrl: isProduction
      ? 'https://api.midtrans.com/v2'
      : 'https://api.sandbox.midtrans.com/v2',
  };
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
  const { serverKey, snapBaseUrl } = getMidtransConfig();
  if (!serverKey) {
    throw new Error('MIDTRANS_SERVER_KEY is not configured in environment variables.');
  }

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

  const res = await fetch(snapBaseUrl, {
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
  const { serverKey } = getMidtransConfig();
  if (!serverKey || !receivedSignature) return false;

  const expectedSignature = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex');

  // Constant-time comparison to prevent timing attacks
  const expectedBuf = Buffer.from(expectedSignature.toLowerCase(), 'utf8');
  const receivedBuf = Buffer.from(receivedSignature.trim().toLowerCase(), 'utf8');

  if (expectedBuf.length !== receivedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

export async function getMidtransTransactionStatus(
  orderId: string
): Promise<MidtransStatusResult | null> {
  const { serverKey, apiBaseUrl } = getMidtransConfig();
  if (!serverKey || !orderId) return null;

  try {
    const authHeader = `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`;
    const res = await fetch(`${apiBaseUrl}/${encodeURIComponent(orderId)}/status`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: authHeader,
      },
      cache: 'no-store',
    });

    if (res.status === 404) {
      return { isPaid: false, status: 'pending', rawStatus: 'not_found' };
    }

    if (!res.ok) {
      console.warn(`[Midtrans] Status check returned HTTP ${res.status} for order ${orderId}`);
      return null;
    }

    const data = await res.json();
    const transactionStatus = String(data.transaction_status || '').toLowerCase();
    const fraudStatus = String(data.fraud_status || '').toLowerCase();

    let isPaid = false;
    let status: 'paid' | 'pending' | 'cancelled' | 'unknown' = 'unknown';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        isPaid = true;
        status = 'paid';
      } else {
        status = 'pending';
      }
    } else if (transactionStatus === 'settlement') {
      isPaid = true;
      status = 'paid';
    } else if (transactionStatus === 'pending') {
      status = 'pending';
    } else if (
      transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire'
    ) {
      status = 'cancelled';
    }

    return {
      isPaid,
      status,
      rawStatus: transactionStatus,
      paymentType: data.payment_type,
      transactionTime: data.transaction_time,
    };
  } catch (err) {
    console.error(`[Midtrans] Error checking status for order ${orderId}:`, err);
    return null;
  }
}
