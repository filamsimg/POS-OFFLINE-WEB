import { AlertTriangle, DollarSign, WifiOff, CheckCircle } from 'lucide-react';

export function PainPoints() {
  return (
    <section className="py-16 px-4 sm:px-6 bg-[#f8faf9] border-b border-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mb-10 text-left sm:text-center sm:mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Masalah Nyata yang Sering Menghambat Toko Anda
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            Mengapa ribuan pedagang mulai meninggalkan sistem kasir konvensional dan aplikasi langganan online.
          </p>
        </div>

        {/* 3 Grounded Pain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Sewa Bulanan Menguras Modal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Aplikasi lain membebani biaya Rp 150.000–300.000/bulan. Setahun habis Rp 2,4 s/d 3,6 juta hanya untuk sewa aplikasi.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <WifiOff className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Macet Saat Sinyal Lemah</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Saat toko sedang ramai antrean, kasir online loading karena kuota habis atau server down. Pembeli tertahan dan mengeluh.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Lembur Rekap Nota Kertas</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tutup toko masih harus menghitung tumpukan kertas bon manual pakai kalkulator. Bon hilang bikin pembukuan selisih.
            </p>
          </div>
        </div>

        {/* Crisp Contrasting Solution Banner */}
        <div className="bg-[#183630] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold mb-1">
              Solusi POS OFFLINE
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Satu Kali Bayar, Untung 100% Milik Anda
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bekerja mandiri tanpa server luar. Transaksi kilat 1 detik, cetak struk instan, dan pembukuan laba beres otomatis.
            </p>
          </div>
          <a
            href="#checkout"
            className="shrink-0 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-transform active:scale-[0.98]"
          >
            PILIH PAKET SEKARANG
          </a>
        </div>
      </div>
    </section>
  );
}
