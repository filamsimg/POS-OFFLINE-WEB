'use client';

import {
  OfferingHeader,
  HeroSection,
  PainPoints,
  AppPreviewSection,
  PackagesSection,
  ComparisonTable,
  SocialProof,
  CheckoutForm,
  FaqSection,
  StickyMobileCta,
  FloatingWhatsApp,
  PixelViewContent,
} from '@/components/landing';

export default function Home() {
  return (
    <main className="min-h-screen pb-32 sm:pb-24 selection:bg-[#C8F53B] selection:text-[#141414] bg-[#F8FAFC] overflow-x-hidden w-full max-w-full">
      {/* Meta Pixel ViewContent Trigger */}
      <PixelViewContent />

      {/* Sticky Minimal Header */}
      <OfferingHeader />

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-14">
        {/* 1. Hero Section: Volt Lime Bento + Clean Live App Interface Showcase */}
        <HeroSection />

        {/* 2. Masalah & Solusi Nyata */}
        <PainPoints />

        {/* 3. Etalase Antarmuka 12 Layar Asli */}
        <AppPreviewSection />

        {/* 4. Paket Usaha & Dedicated Custom Offering Card */}
        <PackagesSection />

        {/* 5. Kalkulator Penghematan Jujur & Tabel Perbandingan */}
        <ComparisonTable />

        {/* 6. Cerita Pemilik Usaha & Cek Kecocokan Perangkat Android */}
        <SocialProof />

        {/* 7. Formulir Pemesanan & Pembayaran Instan */}
        <CheckoutForm />

        {/* 8. FAQ Interaktif & Footer Resmi */}
        <FaqSection />
      </div>

      {/* Floating Helpers */}
      <StickyMobileCta />
      <FloatingWhatsApp />
    </main>
  );
}
