'use client';

import { Zap } from 'lucide-react';

export function StickyMobileCta() {
  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-40 shadow-2xl flex items-center justify-between gap-3">
      <div>
        <p className="text-[10px] text-slate-500 font-medium line-through">Rp 350.000</p>
        <div className="flex items-baseline gap-1">
          <p className="text-base font-black text-emerald-800">Rp 149.000</p>
          <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1 rounded">HEMAT 60%</span>
        </div>
      </div>

      <a
        href="#checkout"
        className="bg-gradient-to-r from-emerald-600 to-teal-600 active:scale-95 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-transform shrink-0"
      >
        <Zap className="w-3.5 h-3.5 fill-white" />
        <span>BELI SEKARANG</span>
      </a>
    </div>
  );
}
