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
  enabledPayments?: string[];
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
    preferenceBaseUrl: isProduction
      ? 'https://app.midtrans.com/snap/v3/merchant-preferences'
      : 'https://app.sandbox.midtrans.com/snap/v3/merchant-preferences',
  };
}

export function isMidtransConfigured(): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim() || '';
  if (!serverKey) return false;
  if (
    serverKey.includes('masukkan_server_key') ||
    serverKey.includes('xxxxxxxx') ||
    serverKey.length < 12
  ) {
    return false;
  }
  return true;
}

export async function createMidtransSnapTransaction({
  orderId,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  productName = 'Lisensi Software POS OFFLINE Permanen',
  successUrl,
  enabledPayments,
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
    enabled_payments: enabledPayments && enabledPayments.length > 0 ? enabledPayments : undefined,
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

export interface PaymentOptionItem {
  id: string;
  name: string;
  desc: string;
  tag: string;
  isPopular?: boolean;
  midtransChannels: string[];
}

interface MidtransPreferenceResponse {
  merchant_id?: string;
  payment_channels?: Array<{
    name: string;
    enabled: boolean;
  }>;
}

// In-Memory cache (15 minutes TTL) to prevent rate-limiting Midtrans API
let cachedPaymentChannels: {
  channels: string[];
  expiresAt: number;
} | null = null;

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 mins

/**
 * Fetch raw active channel names from Midtrans Snap Preference API
 */
export async function getMidtransActiveChannels(): Promise<string[]> {
  const now = Date.now();
  if (cachedPaymentChannels && now < cachedPaymentChannels.expiresAt) {
    return cachedPaymentChannels.channels;
  }

  const { serverKey, preferenceBaseUrl } = getMidtransConfig();
  if (!serverKey || !isMidtransConfigured()) {
    return [];
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`;
    const res = await fetch(preferenceBaseUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: authHeader,
      },
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      console.warn(`[Midtrans] Preference API returned HTTP ${res.status}`);
      return cachedPaymentChannels ? cachedPaymentChannels.channels : [];
    }

    const data = (await res.json()) as MidtransPreferenceResponse;
    const channels = (data.payment_channels || [])
      .filter((c) => c.enabled)
      .map((c) => c.name.toLowerCase());

    cachedPaymentChannels = {
      channels,
      expiresAt: now + CACHE_TTL_MS,
    };

    return channels;
  } catch (err) {
    console.error('[Midtrans] Error fetching merchant preferences:', err);
    return cachedPaymentChannels ? cachedPaymentChannels.channels : [];
  }
}

/**
 * Build dynamic, customer-facing payment options based on what is genuinely active in Midtrans
 */
export async function getDynamicPaymentOptions(): Promise<PaymentOptionItem[]> {
  const activeChannels = await getMidtransActiveChannels();
  const channelSet = new Set(activeChannels);

  const options: PaymentOptionItem[] = [];

  const hasQris =
    channelSet.has('qris') || channelSet.has('other_qris') || channelSet.has('gopay_qris');
  const hasGoPay = channelSet.has('gopay');
  const hasMandiri = channelSet.has('echannel') || channelSet.has('mandiri_va');
  const hasBri = channelSet.has('bri_va');
  const hasBni = channelSet.has('bni_va');
  const hasBsi = channelSet.has('bsi_va') || channelSet.has('b_s_i_va');
  const hasBca = channelSet.has('bca_va');
  const hasPermata = channelSet.has('permata_va');

  // 1. QRIS (If active in Midtrans)
  if (hasQris) {
    options.push({
      id: 'qris',
      name: 'QRIS',
      desc: 'Scan Semua E-Wallet & Bank',
      tag: 'Instan',
      isPopular: true,
      midtransChannels: ['other_qris', 'gopay', 'shopeepay'],
    });
  }

  // 2. GoPay E-Wallet
  if (hasGoPay) {
    options.push({
      id: 'gopay',
      name: 'GoPay',
      desc: 'E-Wallet',
      tag: 'Otomatis',
      isPopular: !hasQris,
      midtransChannels: ['gopay'],
    });
  }

  // 3. Bank Mandiri
  if (hasMandiri) {
    options.push({
      id: 'mandiri',
      name: 'Bank Mandiri',
      desc: 'Virtual Account',
      tag: 'Otomatis',
      midtransChannels: ['echannel', 'mandiri_va'],
    });
  }

  // 4. Bank BRI
  if (hasBri) {
    options.push({
      id: 'bri',
      name: 'Bank BRI',
      desc: 'Virtual Account',
      tag: 'Otomatis',
      midtransChannels: ['bri_va'],
    });
  }

  // 5. Bank BNI
  if (hasBni) {
    options.push({
      id: 'bni',
      name: 'Bank BNI',
      desc: 'Virtual Account',
      tag: 'Otomatis',
      midtransChannels: ['bni_va'],
    });
  }

  // 6. Bank BSI
  if (hasBsi) {
    options.push({
      id: 'bsi',
      name: 'Bank BSI',
      desc: 'Virtual Account',
      tag: 'Otomatis',
      midtransChannels: ['bsi_va'],
    });
  }

  // 7. Bank BCA (Only when approved by Midtrans)
  if (hasBca) {
    options.push({
      id: 'bca',
      name: 'Bank BCA',
      desc: 'Virtual Account',
      tag: 'Otomatis',
      midtransChannels: ['bca_va'],
    });
  }

  // 8. Bank Permata
  if (hasPermata) {
    options.push({
      id: 'permata',
      name: 'Bank Permata',
      desc: 'Virtual Account',
      tag: 'Otomatis',
      midtransChannels: ['permata_va'],
    });
  }

  // Emergency Fallback: If Midtrans is configured but preference API returned nothing
  if (options.length === 0 && isMidtransConfigured()) {
    options.push(
      {
        id: 'gopay',
        name: 'GoPay',
        desc: 'E-Wallet',
        tag: 'Otomatis',
        isPopular: true,
        midtransChannels: ['gopay'],
      },
      {
        id: 'mandiri',
        name: 'Bank Mandiri',
        desc: 'Virtual Account',
        tag: 'Otomatis',
        midtransChannels: ['echannel'],
      },
      {
        id: 'bri',
        name: 'Bank BRI',
        desc: 'Virtual Account',
        tag: 'Otomatis',
        midtransChannels: ['bri_va'],
      },
      {
        id: 'bni',
        name: 'Bank BNI',
        desc: 'Virtual Account',
        tag: 'Otomatis',
        midtransChannels: ['bni_va'],
      }
    );
  }

  return options;
}
