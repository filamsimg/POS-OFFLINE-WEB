'use client';

import Image from 'next/image';

export function OfferingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[#141414]/95 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">

        {/* Brand Logo & Name */}
        <a href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/icon.png"
            alt="POS OFFLINE Logo"
            width={34}
            height={34}
            className="rounded-lg shadow-sm"
            priority
          />
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm sm:text-base text-white tracking-tight leading-none">
              POS OFFLINE
            </span>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline leading-tight mt-0.5">
              100% Offline • Sekali Bayar
            </span>
          </div>
        </a>

        {/* Quick Nav Anchors to scroll down page */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400">
          <a href="#masalah-solusi" className="hover:text-white transition">Solusi</a>
          <a href="#alur-kerja" className="hover:text-white transition">Fitur Layar</a>
          <a href="#program-usaha" className="hover:text-white transition">Paket Usaha</a>
          <a href="#kalkulator-hemat" className="hover:text-white transition">Simulasi Hemat</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </nav>

        {/* Primary CTA */}
        <a
          href="#checkout"
          className="inline-flex items-center gap-1.5 bg-[#C8F53B] hover:bg-[#BCEB28] text-[#141414] text-xs sm:text-sm font-bold px-4 py-2 sm:py-2.5 rounded-full transition shadow-sm shrink-0"
        >
          <span>Ambil Lisensi</span>
          <span className="font-mono text-xs">→</span>
        </a>

      </div>
    </header>
  );
}
