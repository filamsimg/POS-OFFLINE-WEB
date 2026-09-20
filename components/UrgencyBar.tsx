'use client';

import { ArrowRight, ShieldCheck } from 'lucide-react';

export function UrgencyBar() {
  return (
    <aside aria-label="Pengumuman Penawaran" className="bg-[#0b1714] text-emerald-100 border-b border-emerald-950/80 text-xs py-2 px-4 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Offline
          </span>
          <span className="text-slate-300 text-xs hidden sm:inline">
            Aplikasi kasir Android lisensi permanen tanpa biaya bulanan. Promo rilis mulai <strong>Rp 149.000</strong>.
          </span>
          <span className="text-slate-300 text-xs sm:hidden">
            Promo rilis lisensi permanen mulai <strong>Rp 149.000</strong>
          </span>
        </div>

        <a
          href="#checkout"
          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold text-xs transition-colors shrink-0 underline-offset-4 hover:underline"
        >
          <span>Pilih Paket</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
}
