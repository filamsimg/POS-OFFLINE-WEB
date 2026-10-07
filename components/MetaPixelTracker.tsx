'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/fpixel';

/**
 * MetaPixelTracker
 * Automatically fires 'PageView' on client-side route transitions in Next.js App Router.
 */
export function MetaPixelTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Avoid double firing on the very first SSR mount since layout.tsx inline script already fires it
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    trackPageView();
  }, [pathname]);

  return null;
}
