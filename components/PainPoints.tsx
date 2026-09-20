import { XCircle, CheckCircle, AlertTriangle, BatteryCharging, DollarSign, WifiOff } from 'lucide-react';

export function PainPoints() {
  return (
    <section className="py-16 px-4 sm:px-6 bg-slate-50 border-y border-slate-200 text-slate-800">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-rose-600 uppercase bg-rose-100 border border-rose-200 px-3 py-1 rounded-full">
            Apakah Toko Anda Sering Mengalami Ini?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-3 tracking-tight">
            Jangan Biarkan Keuntungan Toko Habis Terbakar Hal Sepele
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Banyak pengusaha UMKM lelah bukan karena capek melayani pembeli, tapi karena sistem kasir dan pembukuan yang bikin frustrasi.
          </p>
        </div>

        {/* 3 Pain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Biaya Langganan Mencekik
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Aplikasi kasir lain minta Rp 150.000 – Rp 300.000 tiap bulan. Setahun sudah habis <strong className="text-rose-600">Rp 2,4 s/d Rp 3,6 Juta</strong> hanya untuk sewa aplikasi!
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <WifiOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Kasir Macet Saat Sinyal Hilang
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Toko lagi ramai antrean pembeli, tiba-tiba aplikasi kasir online *loading* muter-muter karena WiFi ngadat atau paket data habis. Pembeli kabur!
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Lembur Rekap Nota Manual
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Jualan seharian capek, malamnya masih harus lembur 2 jam hitung kertas nota pakai kalkulator. Giliran ada bon tercecer, pembukuan selisih jutaan.
            </p>
          </div>
        </div>

        {/* The Solution Box */}
        <div className="bg-gradient-to-br from-[#183630] to-[#122a25] rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-emerald-400 text-xs sm:text-sm font-extrabold uppercase tracking-widest bg-emerald-950/80 px-4 py-1 rounded-full border border-emerald-500/30">
              Solusi Cerdas Pengusaha Modern
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-4 mb-3">
              POS OFFLINE: Sekali Beli, Beres Selamanya!
            </h3>
            <p className="text-sm sm:text-base text-emerald-100/80 mb-8 leading-relaxed">
              Tanpa server luar, tanpa internet, tanpa biaya langganan bulanan. Seluruh data transaksi, omset, dan katalog produk Anda tersimpan 100% aman di smartphone Anda sendiri.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-white">Modal Aman & Untung Utuh</p>
                  <p className="text-xs text-emerald-200/70 mt-0.5">Tidak ada potongan komisi sepeser pun per transaksi penjualan Anda.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-white">Transaksi Kilat 1 Detik</p>
                  <p className="text-xs text-emerald-200/70 mt-0.5">Printer Bluetooth langsung bunyi dan mengeluarkan struk tanpa jeda loading.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
