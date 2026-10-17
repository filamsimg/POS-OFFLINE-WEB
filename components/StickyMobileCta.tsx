'use client';

export function StickyMobileCta() {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#141414]/95 backdrop-blur-md border-t border-white/10 shadow-2xl flex items-center justify-between gap-3">
      <div>
        <span className="text-[10px] text-zinc-400 block font-mono">SEKALI BAYAR • LIFETIME</span>
        <span className="font-mono font-bold text-base text-white">Rp 299.000</span>
      </div>
      <a
        href="#checkout-manusiawi"
        className="bg-[#C8F53B] hover:bg-[#BCEB28] text-[#141414] font-bold text-xs px-4 py-3 rounded-xl transition shadow flex items-center gap-1.5"
      >
        <span>Ambil Lisensi</span>
        <span className="font-mono text-xs">→</span>
      </a>
    </div>
  );
}
