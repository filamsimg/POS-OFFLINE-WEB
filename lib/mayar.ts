/**
 * Mayar.id API Client
 *
 * Docs: https://docs.mayar.id
 * All requests use Bearer token authentication.
 */

function getMayarBaseUrl(): string {
  if (process.env.MAYAR_API_URL) return process.env.MAYAR_API_URL;
  // If explicitly set in .env
  if (process.env.MAYAR_ENV === 'production') {
    return 'https://api.mayar.id/hl/v1';
  }
  if (process.env.MAYAR_ENV === 'sandbox') {
    return 'https://api.mayar.io/hl/v1';
  }
  // In development, default to sandbox unless explicitly configured
  const key = process.env.MAYAR_API_KEY ?? '';
  if (key.includes('sandbox') || process.env.NODE_ENV !== 'production') {
    return 'https://api.mayar.io/hl/v1';
  }
  return 'https://api.mayar.id/hl/v1';
}

function getApiKey(): string {
  const key = process.env.MAYAR_API_KEY;
  if (!key || key.startsWith('mayar_live_xxx') || key.startsWith('mayar_sandbox_xxx')) {
    throw new Error('[Mayar] MAYAR_API_KEY is not configured.');
  }
  return key;
}

function getHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${getApiKey()}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

export interface CreateMayarPaymentParams {
  orderId:       string;
  amount:        number;
  customerName:  string;
  customerEmail: string;
  customerPhone: string;
  description:   string;
  /** URL to redirect after successful payment */
  successUrl:    string;
}

export interface MayarPaymentResult {
  paymentId:  string;
  paymentUrl: string;
  expiredAt?: string;
}

/**
 * Creates a payment link (Transaksi Pembayaran) via Mayar.id API.
 * Returns the payment ID and URL to redirect the customer.
 */
export async function createMayarPayment(
  params: CreateMayarPaymentParams
): Promise<MayarPaymentResult> {
  const { orderId, amount, customerName, customerEmail, customerPhone, description, successUrl } =
    params;

  // Format payload sesuai spesifikasi resmi Mayar.id API v1
  const body = {
    name:        description,
    amount,
    mobile:      customerPhone,
    email:       customerEmail,
    redirectUrl: successUrl,
    description: `Order ID: ${orderId} - ${customerName}`,
  };

  const res = await fetch(`${getMayarBaseUrl()}/payment/create`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok || json.statusCode !== 200) {
    const errMsg = json?.messages ?? json?.message ?? res.statusText ?? 'Gagal membuat payment link Mayar.id.';
    console.error('[Mayar] createPayment error:', errMsg);
    throw new Error(errMsg);
  }

  return {
    paymentId:  json.data?.id ?? json.data?.paymentLinkId ?? json.data?.transactionId,
    paymentUrl: json.data?.link ?? json.data?.paymentLink ?? json.data?.payment_link,
    expiredAt:  json.data?.expiredAt ?? json.data?.expired_at,
  };
}

/**
 * Verifies a Mayar.id webhook signature.
 * Mayar.id sends an X-Mayar-Signature header (HMAC-SHA256 of the raw body).
 *
 * Call this inside your webhook route before processing any data.
 */
export function verifyMayarSignature(
  rawBody: string,
  receivedSignature: string
): boolean {
  const secret = process.env.MAYAR_WEBHOOK_SECRET?.trim();
  if (!secret || secret.startsWith('mayar_webhook_secret_xxx')) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[Mayar] CRITICAL: MAYAR_WEBHOOK_SECRET belum dikonfigurasi di environment production. Webhook ditolak demi keamanan.');
      return false;
    }
    // Only in local development fallback
    console.warn('[Mayar] MAYAR_WEBHOOK_SECRET not configured — skipping signature check (dev only).');
    return true;
  }

  try {
    // Use Node.js crypto (available in Next.js API routes)
    const crypto = require('crypto') as typeof import('crypto');
    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const bufExpected = Buffer.from(expected);
    const bufReceived = Buffer.from(receivedSignature || '');

    if (bufExpected.length !== bufReceived.length) {
      return false;
    }

    return crypto.timingSafeEqual(bufExpected, bufReceived);
  } catch {
    return false;
  }
}

export interface MayarInvoiceStatus {
  id: string;
  status: string; // 'paid' | 'unpaid' | etc.
  amount: number;
  transactionId?: string;
  paymentUrl?: string;
}

/**
 * Actively checks the status of an invoice / payment from Mayar.id API.
 * Uses fallback between /invoice/{id} and /payment/{id} endpoints.
 */
export async function checkMayarInvoiceStatus(
  paymentOrInvoiceId: string
): Promise<MayarInvoiceStatus | null> {
  const baseUrl = getMayarBaseUrl();
  const headers = getHeaders();

  // 1. Try /invoice/{id} endpoint first
  try {
    const res = await fetch(`${baseUrl}/invoice/${paymentOrInvoiceId}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.statusCode === 200 && json?.data) {
        return {
          id: json.data.id,
          status: String(json.data.status ?? '').toLowerCase(),
          amount: Number(json.data.amount ?? 0),
          transactionId: json.data.transactionId ?? json.data.transactions?.[0]?.id,
          paymentUrl: json.data.paymentUrl,
        };
      }
    }
  } catch (e) {
    console.warn('[Mayar] GET /invoice check error:', e);
  }

  // 2. Fallback: try /payment/{id} endpoint
  try {
    const res = await fetch(`${baseUrl}/payment/${paymentOrInvoiceId}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.statusCode === 200 && json?.data) {
        return {
          id: json.data.id,
          status: String(json.data.status ?? '').toLowerCase(),
          amount: Number(json.data.amount ?? 0),
          transactionId: json.data.transactionId ?? json.data.transactions?.[0]?.id,
          paymentUrl: json.data.linkUrl ?? json.data.linkPayment,
        };
      }
    }
  } catch (e) {
    console.warn('[Mayar] GET /payment check error:', e);
  }

  return null;
}

