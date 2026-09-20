import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pos-offline.vercel.app'),
  title: "POS OFFLINE - Aplikasi Kasir Android Lisensi Permanen Tanpa Langganan",
  description:
    "Aplikasi kasir pintar untuk HP & Tablet Android 100% offline tanpa internet dan tanpa biaya bulanan. Cetak struk Bluetooth thermal, scan barcode, dan laporan laba bersih otomatis.",
  keywords: [
    "aplikasi kasir offline",
    "pos offline",
    "kasir android tanpa langganan",
    "kasir lisensi permanen",
    "aplikasi kasir tanpa internet",
    "cetak struk bluetooth",
    "kasir umkm",
  ],
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: "POS OFFLINE - Aplikasi Kasir Android Lisensi Sekali Bayar Seumur Hidup",
    description: "100% Offline Tanpa Biaya Bulanan. Cetak struk Bluetooth thermal instan dan kelola pembukuan toko Anda.",
    url: "https://pos-offline.vercel.app",
    siteName: "POS OFFLINE",
    images: [
      {
        url: "/hero-mockup.jpg",
        width: 1280,
        height: 720,
        alt: "POS OFFLINE Android Cashier App",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
