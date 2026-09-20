import Image from 'next/image';
import { ArrowDown, Check, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-[#112420] text-white pt-12 sm:pt-16 pb-16 px-4 sm:px-6 border-b border-[#1f423b]">
      <div className="max-w-6xl mx-auto">
        {/* Split Layout: Left Content, Right Asset */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 text-left">
            {/* 1. Eyebrow */}
            <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold tracking-wider uppercase mb-4 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Beli Putus • Sekali Bayar Seumur Hidup</span>
            </div>

            {/* 2. Headline: max 2 lines desktop */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white mb-4">
              Mesin Kasir Android. <br />
              <span className="text-emerald-400">100% Offline Tanpa Biaya Bulanan.</span>
            </h1>

            {/* 3. Subtext: exactly 18 words (disciplined under 20 words) */}
            <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed max-w-[50ch]">
              Cetak struk Bluetooth instan, scan barcode, dan kelola keuntungan toko dari smartphone Anda tanpa biaya bulanan seumur hidup.
            </p>

            {/* 4. CTAs: 1 primary + 1 secondary */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
              <a
                href="#checkout"
                className="inline-flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm sm:text-base px-7 py-3.5 rounded-xl transition-transform active:scale-[0.98] shadow-md shadow-emerald-950/40"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>AMBIL PROMO BELI PUTUS</span>
              </a>
              <a
                href="#fitur"
                className="inline-flex items-center justify-center gap-1.5 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors"
              >
                <span>Lihat Fitur Lengkap</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Micro proof row under hero */}
            <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Tanpa Kuota
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Printer 58 & 80mm
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Garansi Seumur Hidup
              </span>
            </div>
          </div>

          {/* Right Column: Authentic Product Photography */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 bg-slate-950 shadow-2xl group">
              <Image
                src="/hero-mockup.jpg"
                alt="Aplikasi Kasir POS OFFLINE di smartphone Android dengan printer thermal Bluetooth mini"
                width={1280}
                height={720}
                priority
                className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-500"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4 sm:p-5 flex items-center justify-between text-xs text-slate-300">
                <span className="font-mono text-emerald-400 text-[11px]">POS OFFLINE v1.0 • Android Native</span>
                <span className="text-[11px] text-slate-400">Kompatibel 50+ Merk Printer Thermal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
