import type { Metadata, Viewport } from 'next';
import { MetaPixelTracker } from '@/components/MetaPixelTracker';
import { PACKAGES, CURRENT_APP_VERSION } from '@/lib/types';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#141414',
};

// ─── Metadata ────────────────────────────────────────────────────────────────

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
).replace(/\/+$/, '');

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: 'POS OFFLINE – Kasir Android Lisensi Permanen, Sekali Bayar Seumur Hidup',
  description:
    'Aplikasi kasir Android 100% offline tanpa biaya bulanan. Cetak struk Bluetooth thermal, scan barcode, laporan laba otomatis. Beli sekali, aktif seumur hidup.',
  keywords: [
    'aplikasi kasir offline',
    'pos offline android',
    'kasir android tanpa langganan',
    'kasir lisensi permanen',
    'aplikasi kasir tanpa internet',
    'cetak struk bluetooth',
    'kasir umkm indonesia',
    'software kasir toko',
  ],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon:    [{ url: '/favicon.png', sizes: '32x32', type: 'image/png' }],
    shortcut: '/favicon.png',
    apple:   '/icon.png',
  },
  openGraph: {
    title:       'POS OFFLINE – Kasir Android Sekali Bayar, Aktif Seumur Hidup',
    description: `100% Offline. Tanpa Biaya Bulanan. Cetak struk Bluetooth, scan barcode, laporan laba otomatis, multi-currency. Lisensi permanen Rp ${PACKAGES.software_only.price.toLocaleString('id-ID')}.`,
    url:         siteUrl || '/',
    siteName:    'POS OFFLINE',
    images: [{ url: '/hero-mockup.jpg', width: 1280, height: 720, alt: 'Aplikasi Kasir POS OFFLINE di Android' }],
    locale:      'id_ID',
    type:        'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'POS OFFLINE – Kasir Android Sekali Bayar, Aktif Seumur Hidup',
    description: `100% Offline. Tanpa Biaya Bulanan. Cetak struk Bluetooth, scan barcode, laporan laba otomatis. Lisensi permanen Rp ${PACKAGES.software_only.price.toLocaleString('id-ID')}.`,
    images: ['/hero-mockup.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// ─── Meta Pixel Component ─────────────────────────────────────────────────────

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${siteUrl || 'https://www.posoffline.xyz'}#software`,
        name: 'POS OFFLINE',
        operatingSystem: 'Android 5.0 and up',
        applicationCategory: 'BusinessApplication',
        softwareVersion: CURRENT_APP_VERSION,
        description:
          'Aplikasi kasir Android 100% offline tanpa biaya langganan bulanan. Cetak struk Bluetooth thermal, scan barcode kamera, manajemen stok, dan laporan laba otomatis.',
        offers: {
          '@type': 'Offer',
          price: String(PACKAGES.software_only.price),
          priceCurrency: 'IDR',
          priceValidUntil: '2027-12-31',
          availability: 'https://schema.org/InStock',
          url: siteUrl || 'https://www.posoffline.xyz',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '165',
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl || 'https://www.posoffline.xyz'}#organization`,
        name: 'POS OFFLINE',
        url: siteUrl || 'https://www.posoffline.xyz',
        logo: `${siteUrl || 'https://www.posoffline.xyz'}/icon.png`,
      },
    ],
  };

  return (
    <html lang="id">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />

        {/* Favicon & App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        {/* Schema Markup (JSON-LD) for Google Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Meta Pixel Base Code: placed in <head> as requested by Meta */}
        {META_PIXEL_ID && (
          <script
            id="meta-pixel-base"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
      </head>
      <body>
        {META_PIXEL_ID && (
          <>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
            <MetaPixelTracker />
          </>
        )}

        {children}
      </body>
    </html>
  );
}
