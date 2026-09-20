'use client';

import { useState } from 'react';
import {
  Printer,
  Tag,
  ScanBarcode,
  Utensils,
  BarChart3,
  Lock,
  Scale,
  ShieldCheck,
  WifiOff,
  Percent,
} from 'lucide-react';

export function FeatureGrid() {
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>('58mm');

  return (
    <section id="fitur" className="py-20 px-4 sm:px-6 bg-white text-slate-900 border-b border-slate-200 scroll-mt-10">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Fitur Lengkap yang Dibutuhkan Usaha Anda
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            Setiap fitur dibangun dengan fokus kepraktisan kasir di lapangan tanpa kerumitan yang membingungkan.
          </p>
        </div>

        {/* Asymmetric Bento Grid with Rhythm and Background Diversity */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Tile 1: Interactive Thermal Printer 58mm & 80mm (Col span 7) */}
          <div className="md:col-span-7 bg-[#f6f9f8] border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Printer className="w-5 h-5" />
                </span>
                {/* Interactive Paper Width Toggle */}
                <div className="inline-flex p-1 bg-slate-200/70 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPaperWidth('58mm')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      paperWidth === '58mm' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    58mm (Mini)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperWidth('80mm')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      paperWidth === '80mm' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    80mm (Desktop)
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                Cetak Struk Thermal 58mm & 80mm
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Pilih ukuran kertas sesuai printer Bluetooth Anda. Kertas struk keluar otomatis dalam 1 detik lengkap dengan logo toko, rincian produk, diskon, dan ucapan terima kasih.
              </p>
            </div>

            {/* Simulated Receipt Preview */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 font-mono text-[11px] text-slate-700 max-w-sm shadow-xs self-start w-full">
              <div className="text-center pb-2 border-b border-dashed border-slate-300">
                <p className="font-bold text-slate-900">TOKO BERKAH JAYA</p>
                <p className="text-[10px] text-slate-500">Jl. Merdeka No. 12 • POS OFFLINE</p>
              </div>
              <div className="py-2 space-y-1">
                <div className="flex justify-between">
                  <span>1x Kopi Susu Gula Aren</span>
                  <span>15.000</span>
                </div>
                <div className="flex justify-between text-slate-400 line-through text-[10px]">
                  <span>(Harga Normal: Rp 18.000)</span>
                  <span>-3.000</span>
                </div>
                <div className="flex justify-between font-bold border-t border-dashed border-slate-300 pt-1 text-slate-900">
                  <span>TOTAL TUNAI</span>
                  <span>Rp 15.000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tile 2: 100% Offline / Airplane Mode (Col span 5, Forest Background) */}
          <div className="md:col-span-5 bg-[#183630] text-white border border-[#234d44] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4">
                <WifiOff className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5">
                100% Mandiri Tanpa Internet
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Database tersimpan lokal di smartphone via SQLite. HP masuk Mode Pesawat atau saat mati lampu, kasir tetap melayani pembeli tanpa kendala.
              </p>
            </div>

            <div className="bg-emerald-950/70 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Offline Database Engine Ready</span>
            </div>
          </div>

          {/* Tile 3: Diskon Bertingkat & Promo Coret (Col span 4) */}
          <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Diskon Promo & Harga Coret</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Buat program obral dengan badge PROMO merah otomatis di kasir, serta potongan diskon keranjang (% atau nominal Rp).
              </p>
            </div>
            <div className="bg-red-50/60 border border-red-200/70 rounded-lg p-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-500 line-through">Rp 20.000</span>
              <span className="font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded text-[10px]">
                PROMO -25%
              </span>
              <span className="font-extrabold text-slate-900">Rp 15.000</span>
            </div>
          </div>

          {/* Tile 4: Laporan Laba Bersih & HPP Modal (Col span 4) */}
          <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Laba Bersih & HPP Otomatis</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Ketahui keuntungan bersih harian dan modal yang keluar tanpa kalkulator. Ekspor pembukuan ke Excel/CSV kapan saja.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Omset Penjualan:</span>
                <span className="font-bold text-slate-900">Rp 1.450.000</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-bold border-t border-slate-200 pt-1">
                <span>Laba Bersih Riil:</span>
                <span>+ Rp 580.000 (40%)</span>
              </div>
            </div>
          </div>

          {/* Tile 5: Sistem Meja, Grosir & Keamanan PIN (Col span 4) */}
          <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">PIN Karyawan & Sistem Meja</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Kunci riwayat hapus nota dengan PIN pemilik. Mendukung nomor meja Open Bill kafe, harga grosir bertingkat, dan timbangan kg.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="px-2 py-1 bg-slate-100 rounded">Open Bill</span>
              <span className="px-2 py-1 bg-slate-100 rounded">Harga Grosir</span>
              <span className="px-2 py-1 bg-slate-100 rounded">PIN 6-Digit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
