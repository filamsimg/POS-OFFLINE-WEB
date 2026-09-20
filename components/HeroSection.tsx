import { ShieldCheck, Zap, Printer, ArrowDown, CheckCircle2 } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#183630] via-[#1b3d36] to-[#0f2420] text-white pt-10 pb-16 px-4 sm:px-6">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Aplikasi Kasir Android Non-Play Store • Beli Putus 1x Bayar</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white mb-5">
          Capek Bayar Kasir Ratusan Ribu Tiap Bulan? <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-green-400">
            Beralih ke POS OFFLINE
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-emerald-100/80 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Aplikasi kasir pintar untuk HP & Tablet Android. <strong className="text-white font-semibold">100% jalan tanpa internet</strong>, cetak struk Bluetooth otomatis, scan barcode, dan kelola laporan laba bersih tanpa biaya bulanan selamanya!
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <a
            href="#checkout"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base sm:text-lg px-8 py-4 rounded-xl shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Zap className="w-5 h-5 fill-slate-950" />
            <span>AMBIL PROMO BELI PUTUS (RP 149.000)</span>
          </a>
          <a
            href="#fitur"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm sm:text-base px-6 py-4 rounded-xl backdrop-blur transition-all"
          >
            <span>Pelajari Fitur Lengkap</span>
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>

        {/* Quick Highlights Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 max-w-3xl mx-auto text-xs sm:text-sm text-emerald-200/90 mb-12">
          <div className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 py-2.5 px-3 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Tanpa Kuota</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 py-2.5 px-3 rounded-lg">
            <Printer className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Struk 58mm & 80mm</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 py-2.5 px-3 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sekali Beli Aktif 1x</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 py-2.5 px-3 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ganti HP Data Aman</span>
          </div>
        </div>

        {/* Video / Visual Mockup Container */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/30 bg-slate-900/90 shadow-2xl p-2 sm:p-4 max-w-3xl mx-auto backdrop-blur-xl">
          <div className="rounded-xl overflow-hidden bg-slate-950 aspect-video relative flex flex-col items-center justify-center text-center p-6 border border-white/10">
            {/* Header simulated bar */}
            <div className="absolute top-0 inset-x-0 h-9 bg-slate-900/90 border-b border-white/10 flex items-center px-4 gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-[11px] text-slate-400 font-mono ml-2">POS OFFLINE - Mode Kasir Cepat</span>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-3">
                <Printer className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Simulasi Kasir & Cetak Struk Instan
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-4">
                HP masuk mode pesawat (tanpa WiFi & tanpa kuota) ➔ Input pesanan ➔ Klik Bayar ➔ Struk thermal keluar otomatis dalam 1 detik!
              </p>
              <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs px-3 py-1.5 rounded-full font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Teruji di 50+ Merk Printer Bluetooth Mini Thermal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
