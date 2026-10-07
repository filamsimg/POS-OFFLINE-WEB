'use client';

import { useEffect } from 'react';
import { trackViewContent } from '@/lib/fpixel';
import { PACKAGES } from '@/lib/types';

/**
 * PixelViewContent
 * Automatically triggers Meta Pixel 'ViewContent' when visitor lands on the homepage / landing page.
 */
export function PixelViewContent() {
  useEffect(() => {
    const pkg = PACKAGES['software_only'];
    trackViewContent({
      content_name: 'Lisensi Software POS OFFLINE Permanen',
      content_category: 'Software Kasir Android',
      content_ids: ['POS_OFFLINE_LIFETIME'],
      content_type: 'product',
      value: pkg.price,
      currency: 'IDR',
    });
  }, []);

  return null;
}
