'use client';

import { PACKAGES } from '@/lib/types';

export function StickyMobileCta() {
  const priceFormatted = 'Rp ' + PACKAGES.software_only.price.toLocaleString('id-ID');

  return (
    <div
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pt-2.5 pb-[max(10px,env(safe-area-inset-bottom))] bg-[#141414]/95 backdrop-blur-md border-t border-white/10 shadow-2xl flex items-center justify-between gap-3"
    >
      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-400 font-mono tracking-tight leading-none mb-0.5">SEKALI BAYAR • LIFETIME</span>
        <span className="font-mono font-bold text-base text-white leading-tight">{priceFormatted}</span>
      </div>
      <a
        href="#checkout"
        className="bg-[#C8F53B] hover:bg-[#BCEB28] text-[#141414] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 shrink-0"
      >
        <span>Ambil Lisensi</span>
        <span className="font-mono text-xs">→</span>
      </a>
    </div>
  );
}
