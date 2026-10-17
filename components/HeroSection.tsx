'use client';

import { useState } from 'react';
import Image from 'next/image';

export function HeroSection() {
  const [activeView, setActiveView] = useState<'tablet' | 'struk'>('tablet');

  return (
    <section className="mb-10 sm:mb-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
        
        {/* 
          1. DEMO & APP SHOWCASE (On mobile: order-1 (TOP), On desktop: order-2 (RIGHT))
          Features: Realistic Android POS Tablet Hardware Frame + Live Floating Thermal Receipt + Interactive Mode Switcher
        */}
        <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col gap-4">
          
          {/* Main Showcase Bento Card */}
          <div className="bg-[#141414] text-white rounded-[28px] p-5 sm:p-6 relative overflow-hidden flex-1 flex flex-col justify-between shadow-xl border border-white/10">
            
            {/* Top Device Bar */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/icon.png"
                  alt="POS OFFLINE Logo"
                  width={26}
                  height={26}
                  className="rounded-lg shadow-xs"
                />
                <span className="text-xs font-mono font-bold text-white tracking-wide">
                  POS OFFLINE v2.4
                </span>
              </div>

              {/* Status Chips */}
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-[#C8F53B] text-[#141414] font-bold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#141414] animate-pulse"></span>
                  100% OFFLINE
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-mono bg-white/10 text-zinc-300 font-semibold px-2 py-1 rounded-full">
                  BLUETOOTH 58/80MM
                </span>
              </div>
            </div>

            {/* View Switcher Tabs: Tablet POS vs Struk Kasir */}
            <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl mb-3 border border-white/5">
              <button
                type="button"
                onClick={() => setActiveView('tablet')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeView === 'tablet'
                    ? 'bg-[#C8F53B] text-[#141414] shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                📱 Layar Kasir Android
              </button>
              <button
                type="button"
                onClick={() => setActiveView('struk')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeView === 'struk'
                    ? 'bg-[#C8F53B] text-[#141414] shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🧾 Cetak Struk 2 Detik
              </button>
            </div>

            {/* High-End Realistic Hardware Frame */}
            <div className="relative my-1 rounded-2xl overflow-hidden bg-black p-2 border border-white/20 shadow-2xl">
              
              {/* Tablet Camera Bezel */}
              <div className="flex items-center justify-center pb-1.5">
                <div className="w-2 h-2 rounded-full bg-zinc-700 ring-2 ring-zinc-800"></div>
              </div>

              {/* Screen Viewport */}
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-zinc-950 border border-white/10">
                {activeView === 'tablet' ? (
                  <Image
                    src="/preview-apps/preview-tablet-kasir.webp"
                    alt="Antarmuka Tablet Kasir Android POS OFFLINE"
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    className="object-cover object-top"
                    priority
                  />
                ) : (
                  <Image
                    src="/preview-apps/preview-struk-kasir.webp"
                    alt="Pratinjau Cetak Struk Thermal Bluetooth POS OFFLINE"
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    className="object-contain bg-zinc-900"
                    priority
                  />
                )}

                {/* Subtle glass reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none"></div>

                {/* Live Floating Receipt Card Badge (Gives Tangible Impact) */}
                <div className="absolute bottom-2 right-2 bg-white text-[#141414] rounded-xl p-2.5 shadow-2xl border border-zinc-200 text-left max-w-[190px] backdrop-blur-md">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-zinc-500 pb-1 border-b border-zinc-200">
                    <span>STRUK #1084</span>
                    <span className="text-emerald-700 font-bold">LUNAS ✓</span>
                  </div>
                  <div className="text-[11px] font-bold text-[#141414] mt-1 leading-tight truncate">
                    2x Kopi Susu Aren
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono mt-0.5">
                    <span className="text-zinc-500">Bayar: 50.000</span>
                    <span className="font-bold text-emerald-800">Kembali: 14rb</span>
                  </div>
                  <div className="text-[9px] font-mono text-zinc-400 mt-1">
                    ⚡ Cetak Bluetooth 2 Detik
                  </div>
                </div>
              </div>

              {/* Device Status Bar */}
              <div className="flex items-center justify-between pt-2 px-1 text-[10px] font-mono text-zinc-400">
                <span>Database Lokal di HP</span>
                <span className="text-[#C8F53B]">● Siap Transaksi</span>
              </div>
            </div>

            {/* Quick Impact Highlights below device */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-xs">
              <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                <span className="text-[#C8F53B] font-mono font-bold block text-[11px]">ANTREAN RAMAI</span>
                <span className="text-zinc-300 font-medium">Hitung kembalian uang pas</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                <span className="text-[#C8F53B] font-mono font-bold block text-[11px]">SINYAL LELET/MATI</span>
                <span className="text-zinc-300 font-medium">Jalan terus tanpa internet</span>
              </div>
            </div>
          </div>

          {/* Transparent Honest Price Pill */}
          <div className="bg-[#F3F4F6] rounded-[28px] p-5 flex items-center justify-between gap-4 border border-zinc-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-mono">
                  DISKON 54%
                </span>
                <span className="text-xs text-zinc-600 font-semibold">Harga Promo Toko</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 font-medium">
                Cukup 1x bayar, tidak ada iuran bulanan selamanya.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-zinc-400 line-through font-mono block">Rp 650.000</span>
              <span className="font-mono font-bold text-2xl text-[#141414]">Rp 299.000</span>
            </div>
          </div>

        </div>

        {/* 
          2. IMPACT-DRIVEN HEADLINE & COPYWRITING (On mobile: order-2 (BELOW DEMO), On desktop: order-1 (LEFT))
          Delivers High Emotional & Financial Impact
        */}
        <div className="order-2 lg:order-1 lg:col-span-7 bg-[#C8F53B] rounded-[28px] p-6 sm:p-9 sm:py-10 flex flex-col justify-between relative overflow-hidden text-[#141414] shadow-sm">
          <div>
            {/* Real After-Impact Badge */}
            <div className="inline-flex items-center gap-2 bg-[#141414]/10 text-[#141414] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
              <span className="w-2 h-2 rounded-full bg-[#141414] animate-pulse"></span>
              Bebas Tagihan Bulanan • Modal Usaha Utuh Milik Anda
            </div>

            {/* High-Impact Headline */}
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-[44px] leading-[1.12] mb-5 tracking-tight text-[#141414]">
              Stop Bayar Sewa Aplikasi Tiap Bulan. Miliki Kasir Toko Sendiri Selamanya.
            </h1>

            {/* High-Impact Transformation Story Copy */}
            <p className="text-[#141414]/90 text-sm sm:text-base leading-relaxed mb-4 max-w-xl font-medium">
              Tak ada lagi kasir macet karena internet putus. Tak ada lagi rasa cemas tagihan langganan bulanan yang diam-diam menggerus laba toko Anda.
            </p>

            <p className="text-[#141414]/85 text-xs sm:text-sm leading-relaxed mb-7 max-w-xl">
              Cukup bayar satu kali <strong className="font-mono underline decoration-[#141414]/40 font-bold">Rp 299.000</strong>, aplikasi kasir langsung aktif di HP atau Tablet Android Anda. Transaksi beres dalam hitungan detik, cetak struk Bluetooth secepat kilat, dan setiap tutup toko Anda langsung tahu persis berapa rupiah laba bersih riil yang masuk hari ini.
            </p>
          </div>

          <div>
            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <a
                href="#checkout-manusiawi"
                className="bg-[#141414] text-white hover:bg-zinc-800 font-bold px-6 py-4 rounded-xl text-sm sm:text-base inline-flex items-center gap-3 transition shadow-lg group"
              >
                <span>Beli Lisensi Sekarang (Rp 299.000)</span>
                <span className="text-[#C8F53B] font-mono transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#alur-kerja"
                className="bg-white/80 hover:bg-white text-[#141414] font-bold px-5 py-4 rounded-xl text-sm sm:text-base transition border border-[#141414]/15"
              >
                Lihat 12 Layar Aplikasi
              </a>
            </div>

            {/* 3 Real After-Effects Impact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#141414]/15 text-xs font-bold text-[#141414]">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#141414] text-[#C8F53B] inline-flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">✓</span>
                <div>
                  <span className="block font-bold">Antrean Beres 2 Detik</span>
                  <span className="text-[11px] font-medium text-[#141414]/75">Uang pas & struk kilat</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#141414] text-[#C8F53B] inline-flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">✓</span>
                <div>
                  <span className="block font-bold">100% Anti Macet</span>
                  <span className="text-[11px] font-medium text-[#141414]/75">Jalan terus tanpa internet</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#141414] text-[#C8F53B] inline-flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">✓</span>
                <div>
                  <span className="block font-bold">Laba Otomatis Rekap</span>
                  <span className="text-[11px] font-medium text-[#141414]/75">Hitung untung saat tutup</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
