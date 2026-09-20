import { Check, X } from 'lucide-react';

const COMPARISON_ROWS = [
  {
    feature: 'Biaya Aplikasi',
    saas: 'Rp 150.000 – Rp 300.000 / Bulan (Rutin)',
    posOffline: 'Hanya 1x Bayar (Mulai Rp 149.000) Selamanya',
  },
  {
    feature: 'Ketergantungan Internet',
    saas: 'Wajib Online (Loading saat sinyal lemah)',
    posOffline: '100% Offline (Bisa Mode Pesawat)',
  },
  {
    feature: 'Privasi Data Toko',
    saas: 'Tersimpan di server cloud penyedia',
    posOffline: '100% di Smartphone Anda Sendiri',
  },
  {
    feature: 'Masa Berlaku Lisensi',
    saas: 'Terkunci jika telat bayar tagihan',
    posOffline: 'Aktif Permanen Tanpa Kedaluwarsa',
  },
  {
    feature: 'Potongan Komisi',
    saas: '0.7% s/d 1.5% per transaksi QRIS/kartu',
    posOffline: '0% Potongan (Semua hasil penjualan utuh)',
  },
];

export function ComparisonTable() {
  return (
    <section className="py-16 px-4 sm:px-6 bg-[#f8faf9] border-b border-slate-200">
      <div className="max-w-4xl mx-auto">
        <div className="max-w-xl mb-10 text-left sm:text-center sm:mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Perbandingan POS OFFLINE vs Kasir Sewa
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
            Perbedaan mendasar antara aplikasi kasir sewa bulanan dengan lisensi permanen sekali bayar.
          </p>
        </div>

        {/* Crisp Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-900 text-white font-bold text-xs py-3 px-4 sm:px-6">
            <div className="col-span-5 sm:col-span-4">Kriteria</div>
            <div className="col-span-3 sm:col-span-4 text-slate-400">Kasir Sewa Bulanan</div>
            <div className="col-span-4 text-emerald-400">POS OFFLINE</div>
          </div>

          <div className="divide-y divide-slate-100">
            {COMPARISON_ROWS.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 py-3 px-4 sm:px-6 items-center text-xs hover:bg-slate-50 transition-colors"
              >
                <div className="col-span-5 sm:col-span-4 font-semibold text-slate-800 pr-2">
                  {row.feature}
                </div>
                <div className="col-span-3 sm:col-span-4 text-slate-500 flex items-start gap-1 pr-2">
                  <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span className="hidden sm:inline">{row.saas}</span>
                </div>
                <div className="col-span-4 font-bold text-emerald-800 flex items-start gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
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
