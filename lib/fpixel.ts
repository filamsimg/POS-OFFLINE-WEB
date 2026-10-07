/**
 * Meta Pixel (Facebook & Instagram Ads) Tracking Utility
 * Official Documentation: https://developers.facebook.com/docs/meta-pixel/reference
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// 1. PageView: Triggered on page loads & Next.js route changes
export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.fbq && FB_PIXEL_ID) {
    window.fbq('track', 'PageView');
  }
};

// 2. ViewContent: Triggered when visitor views product / pricing details on Landing Page
export const trackViewContent = (params?: {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
}) => {
  if (typeof window !== 'undefined' && window.fbq && FB_PIXEL_ID) {
    window.fbq('track', 'ViewContent', {
      content_name: params?.content_name ?? 'Lisensi Software POS OFFLINE Permanen',
      content_category: params?.content_category ?? 'Software Kasir Android',
      content_ids: params?.content_ids ?? ['POS_OFFLINE_LIFETIME'],
      content_type: params?.content_type ?? 'product',
      value: params?.value ?? 149000,
      currency: params?.currency ?? 'IDR',
    });
  }
};

// 3. InitiateCheckout: Triggered when visitor fills order form & clicks 'Lanjut ke Pembayaran'
export const trackInitiateCheckout = (params?: {
  content_name?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
  num_items?: number;
}) => {
  if (typeof window !== 'undefined' && window.fbq && FB_PIXEL_ID) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: params?.content_name ?? 'Lisensi Software POS OFFLINE Permanen',
      content_ids: params?.content_ids ?? ['POS_OFFLINE_LIFETIME'],
      content_type: 'product',
      value: params?.value ?? 149000,
      currency: params?.currency ?? 'IDR',
      num_items: params?.num_items ?? 1,
    });
  }
};

// 4. Purchase: Triggered ONLY when payment status is officially 'paid' (LUNAS)
export const trackPurchase = (params: {
  order_id: string;
  value: number;
  currency?: string;
  content_name?: string;
  content_ids?: string[];
}) => {
  if (typeof window !== 'undefined' && window.fbq && FB_PIXEL_ID) {
    window.fbq('track', 'Purchase', {
      content_name: params.content_name ?? 'Lisensi Software POS OFFLINE Permanen',
      content_type: 'product',
      content_ids: params.content_ids ?? ['POS_OFFLINE_LIFETIME'],
      value: Math.round(params.value),
      currency: params.currency ?? 'IDR',
      order_id: params.order_id,
    });
  }
};
