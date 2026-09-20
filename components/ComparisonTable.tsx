import { Check, X } from 'lucide-react';

const COMPARISON_ROWS = [
  {
    feature: 'Biaya Aplikasi',
    saas: 'Rp 150.000 – Rp 300.000 / Bulan (Membengkak tiap tahun)',
    posOffline: 'Hanya 1x Bayar (Mulai Rp 149.000) Seumur Hidup',
    isWinner: true,
  },
  {
    feature: 'Ketergantungan Internet',
    saas: 'Wajib Online (Macet & muter-muter saat sinyal hilang)',
    posOffline: '100% Offline (Tetap ngebut walau Mode Pesawat)',
    isWinner: true,
  },
  {
    feature: 'Keamanan & Privasi Data Toko',
    saas: 'Disimpan di server cloud luar (Rentan bocor / diintip)',
    posOffline: '100% Tersimpan di Memori HP Anda Sendiri',
    isWinner: true,
  },
  {
    feature: 'Masa Berlaku Aplikasi',
    saas: 'Terkunci & hangus jika telat bayar tagihan bulanan',
    posOffline: 'Aktif Permanen Tanpa Kedaluwarsa Selamanya',
    isWinner: true,
  },
  {
    feature: 'Dukungan Printer Bluetooth',
    saas: 'Sering dibatasi tipe printer mahal tertentu',
    posOffline: 'Mendukung semua printer thermal 58mm & 80mm standar',
    isWinner: true,
  },
  {
    feature: 'Potongan Komisi Penjualan',
    saas: 'Ada yang memotong 0.7% s/d 1.5% per transaksi',
    posOffline: '0% Potongan (Semua keuntungan masuk kantong Anda)',
    isWinner: true,
  },
];

export function ComparisonTable() {
  return (
    <section className="py-16 px-4 sm:px-6 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-emerald-800 uppercase bg-emerald-100/60 border border-emerald-200 px-3 py-1 rounded-full">
            Bandingkan & Buktikan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4 mb-2 tracking-tight">
            Mengapa POS OFFLINE Pilihan Paling Cerdas?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Lihat perbandingan langsung antara aplikasi kasir sewa bulanan dengan POS OFFLINE beli putus.
          </p>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-900 text-white font-bold text-xs sm:text-sm py-4 px-4 sm:px-6">
            <div className="col-span-5 sm:col-span-4">Fitur & Aspek</div>
            <div className="col-span-3 sm:col-span-4 text-slate-400">Kasir Sewa Bulanan</div>
            <div className="col-span-4 text-emerald-400 flex items-center justify-end sm:justify-start gap-1">
              <span>POS OFFLINE</span>
              <span className="hidden sm:inline text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded">
                REKOMENDASI
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {COMPARISON_ROWS.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 py-3.5 px-4 sm:px-6 items-center text-xs sm:text-sm hover:bg-slate-50/80 transition-colors"
              >
                <div className="col-span-5 sm:col-span-4 font-semibold text-slate-900 pr-2">
                  {row.feature}
                </div>
                <div className="col-span-3 sm:col-span-4 text-slate-500 flex items-start gap-1.5 pr-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="hidden sm:inline">{row.saas}</span>
                </div>
                <div className="col-span-4 font-bold text-emerald-800 flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{row.posOffline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
