'use client';

import { ArrowRight } from 'lucide-react';

export function StickyMobileCta() {
  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-40 shadow-2xl flex items-center justify-between gap-3">
      <div>
        <p className="text-[10px] text-slate-500 font-medium line-through">Rp 350.000</p>
        <div className="flex items-baseline gap-1">
          <p className="text-base font-extrabold text-slate-900">Rp 149.000</p>
          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">SEKALI BAYAR</span>
        </div>
      </div>

      <a
        href="#checkout"
        className="bg-[#10B981] hover:bg-[#059669] text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 active:scale-[0.98] transition-all shrink-0"
      >
        <span>Beli Sekarang</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
