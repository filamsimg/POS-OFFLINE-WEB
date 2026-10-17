'use client';

import { useState } from 'react';

export function ComparisonTable() {
  const [years, setYears] = useState<number>(1);

  const months = years * 12;
  const saasMonthly = 149000;
  const saasCost = months * saasMonthly;
  const posOfflineCost = 299000;
  const totalSaved = saasCost - posOfflineCost;

  return (
    <section id="kalkulator-hemat" className="mb-10 sm:mb-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: Interactive Savings Calculator */}
        <div className="lg:col-span-5 bg-[#F3F4F6] rounded-[28px] p-5 sm:p-8 flex flex-col justify-between border border-zinc-200/70 shadow-sm">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-2 font-semibold">
              SIMULASI PENGHEMATAN TOKO
            </span>
            <h3 className="font-display font-bold text-2xl text-[#141414] mb-2 leading-snug">
              Hitung Uang Modal yang Diselamatkan
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 mb-5 leading-relaxed">
              Kasir langganan rata-rata mengenakan <strong>Rp 149.000/bulan</strong>. Geser durasi usaha Anda untuk melihat uang yang terselamatkan:
            </p>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200 mb-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="yearSlider" className="text-xs font-bold uppercase text-zinc-600">
                  Durasi Pemakaian Toko:
                </label>
                <span className="font-mono font-bold text-xs text-[#141414] bg-[#C8F53B] px-3 py-1 rounded-full">
                  {years} Tahun ({months} Bulan)
                </span>
              </div>
              <input
                id="yearSlider"
                type="range"
                min="1"
                max="3"
                step="1"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value, 10))}
                className="w-full accent-[#141414] cursor-pointer my-2"
              />
              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span>1 Tahun</span>
                <span>2 Tahun</span>
                <span>3 Tahun</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-50 text-red-900 border border-red-100">
                <span>Biaya Kasir Langganan:</span>
                <span className="font-mono font-bold">Rp {saasCost.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141414] text-white">
                <span>POS OFFLINE (Sekali Bayar):</span>
                <span className="font-mono font-bold text-[#C8F53B]">Rp 299.000</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs text-zinc-500 block font-semibold">Total Uang Toko yang Dihemat:</span>
              <span className="font-mono font-bold text-2xl sm:text-3xl text-emerald-700">
                Rp {totalSaved.toLocaleString('id-ID')}
              </span>
            </div>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full">
              Bisa Buat Tambah Stok!
            </span>
          </div>
        </div>

        {/* Right: Clean Comparison Table with Guaranteed Mobile Scroll */}
        <div className="lg:col-span-7 bg-[#141414] text-white rounded-[28px] p-5 sm:p-8 flex flex-col justify-between border border-white/10 shadow-sm">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-display font-bold text-xl sm:text-2xl leading-snug text-white">
                  Perbandingan Jujur: POS OFFLINE vs Langganan
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Hemat 83% di tahun pertama (Rp 1,48 Juta) dibanding langganan bulanan.
                </p>
              </div>
              <span className="self-start sm:self-auto text-xs font-mono text-[#C8F53B] bg-white/10 px-3 py-1 rounded-full font-bold shrink-0">
                Hemat 83%+
              </span>
            </div>

            {/* Mobile swipe hint */}
            <div className="sm:hidden text-[11px] font-mono text-zinc-400 mb-2 flex items-center gap-1.5">
              <span>← Geser tabel ke kanan untuk melihat rincian →</span>
            </div>

            {/* Scroll Container */}
            <div className="overflow-x-auto -mx-1 sm:mx-0 pb-2">
              <table className="min-w-[480px] w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/15 text-zinc-400 font-mono text-xs">
                    <th className="py-3 pr-3 font-semibold">Fitur & Kebutuhan</th>
                    <th className="py-3 px-3 text-[#C8F53B] font-bold">POS OFFLINE</th>
                    <th className="py-3 pl-3 text-zinc-400 font-semibold">Kasir Langganan (SaaS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="py-3.5 pr-3 font-medium">Biaya Bulan ke-2 s/d Seterusnya</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-[#C8F53B]">✓ Rp 0 (Bebas Biaya Selamanya)</td>
                    <td className="py-3.5 pl-3 text-zinc-400">Wajib bayar tiap bulan</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-3 font-medium">100% Offline Tanpa Sinyal</td>
                    <td className="py-3.5 px-3 font-semibold text-white">✓ Jalan Terus di Memori HP</td>
                    <td className="py-3.5 pl-3 text-zinc-400">Kasir macet / terhambat</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-3 font-medium">Multi-Currency (Mata Uang Asing)</td>
                    <td className="py-3.5 px-3 font-semibold text-white">✓ Sudah Termasuk (IDR, USD, dll)</td>
                    <td className="py-3.5 pl-3 text-zinc-400">Khusus paket enterprise mahal</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-3 font-medium">Bahan Baku & Peringatan Expired</td>
                    <td className="py-3.5 px-3 font-semibold text-white">✓ Pantau Stok & Peringatan Dini</td>
                    <td className="py-3.5 pl-3 text-zinc-400">Add-on berbayar tambahan</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-3 font-medium">Catat Pengeluaran Toko (Expense)</td>
                    <td className="py-3.5 px-3 font-semibold text-white">✓ Hitung Laba Bersih Riil Otomatis</td>
                    <td className="py-3.5 pl-3 text-zinc-400">Modul akuntansi terpisah</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-3 font-medium">Import Massal Produk via Excel</td>
                    <td className="py-3.5 px-3 font-semibold text-white">✓ Template 10 Detik Siap Pakai</td>
                    <td className="py-3.5 pl-3 text-zinc-400">Harus paket mahal</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-3 font-medium">Dukungan & Setup Awal</td>
                    <td className="py-3.5 px-3 font-semibold text-white">✓ Chat WA Langsung Tim Resmi</td>
                    <td className="py-3.5 pl-3 text-zinc-400">Antre tiket bot email</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 text-[11px] text-zinc-400">
            * Perhitungan berdasarkan rata-rata biaya langganan aplikasi kasir SaaS populer di Indonesia (Rp 149.000/bln).
          </div>
        </div>

      </div>
    </section>
  );
}
