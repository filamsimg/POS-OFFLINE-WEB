import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

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
  icons: {
    icon:    [{ url: '/favicon.png', sizes: '32x32', type: 'image/png' }],
    shortcut: '/favicon.png',
    apple:   '/icon.png',
  },
  openGraph: {
    title:       'POS OFFLINE – Kasir Android Sekali Bayar, Aktif Seumur Hidup',
    description: '100% Offline. Tanpa Biaya Bulanan. Cetak struk Bluetooth, scan barcode, laporan laba otomatis. Lisensi permanen Rp 149.000.',
    url:         siteUrl || '/',
    siteName:    'POS OFFLINE',
    images: [{ url: '/hero-mockup.jpg', width: 1280, height: 720, alt: 'Aplikasi Kasir POS OFFLINE di Android' }],
    locale:      'id_ID',
    type:        'website',
  },
};

// ─── Meta Pixel Component ─────────────────────────────────────────────────────

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {/* Meta Pixel: only rendered when NEXT_PUBLIC_META_PIXEL_ID is set */}
        {META_PIXEL_ID && (
          <>
            <Script
              id="meta-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s){
                    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)
                  }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${META_PIXEL_ID}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}

        {children}
      </body>
    </html>
  );
}
