'use client';

import { PACKAGES } from '@/lib/types';

export function PainPoints() {
  const priceFormatted = 'Rp ' + PACKAGES.software_only.price.toLocaleString('id-ID');

  return (
    <section id="masalah-solusi" className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Carbon Header Block */}
        <div className="lg:col-span-4 bg-[#141414] text-white rounded-[28px] p-5 sm:p-7 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#C8F53B] block mb-3 font-semibold">
              MASALAH & SOLUSI NYATA
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold leading-tight mb-4">
              Kenapa UMKM Pindah ke POS OFFLINE?
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Setiap rupiah hasil kerja keras Anda seharusnya menjadi modal stok barang, bukan habis untuk membayar tagihan langganan aplikasi setiap bulan.
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
            <div>
              <div className="font-mono font-bold text-2xl text-[#C8F53B]">Rp 1,48 Juta</div>
              <div className="text-xs text-zinc-400">Penghematan riil di tahun pertama</div>
            </div>
            <a
              href="#kalkulator-hemat"
              className="w-11 h-11 rounded-full bg-[#C8F53B] text-[#141414] flex items-center justify-center font-bold hover:scale-105 transition"
              title="Hitung Hematnya"
            >
              ↓
            </a>
          </div>
        </div>

        {/* Right 4 Stacked Soft Cloud Gray Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          <div className="bg-[#F3F4F6] rounded-[28px] p-5 sm:p-6 flex flex-col justify-between border border-zinc-200/60">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100/80 px-2.5 py-1 rounded-full mb-3">
                <span>✗ Cara Lama: Bayar bulanan walau toko sepi</span>
              </div>
              <h3 className="font-display font-bold text-lg text-[#141414] mb-2 leading-snug">
                Sekali Bayar {priceFormatted}, Bebas Tagihan Selamanya
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Tidak ada biaya perpanjangan tahunan, tidak ada potong komisi transaksi, dan kasir Anda tidak akan pernah dikunci paksa karena telat bayar langganan.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between text-xs font-mono text-zinc-500 font-semibold">
              <span>STATUS LISENSI</span>
              <span className="text-[#141414] font-bold">✓ PERMANEN SEUMUR HIDUP</span>
            </div>
          </div>

          <div className="bg-[#F3F4F6] rounded-[28px] p-6 flex flex-col justify-between border border-zinc-200/60">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100/80 px-2.5 py-1 rounded-full mb-3">
                <span>✗ Cara Lama: Internet mati, kasir ikut macet</span>
              </div>
              <h3 className="font-display font-bold text-lg text-[#141414] mb-2 leading-snug">
                100% Bekerja Offline Tanpa Kuota & Sinyal
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Lokasi toko di dalam pasar atau sinyal sering hilang? Seluruh transaksi, scan barcode kamera, dan cetak struk tetap berjalan kencang tanpa hambatan.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between text-xs font-mono text-zinc-500 font-semibold">
              <span>KONEKSI SERVER</span>
              <span className="text-[#141414] font-bold">✓ LOKAL DI MEMORI HP</span>
            </div>
          </div>

          <div className="bg-[#F3F4F6] rounded-[28px] p-6 flex flex-col justify-between border border-zinc-200/60">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100/80 px-2.5 py-1 rounded-full mb-3">
                <span>✗ Cara Lama: Tulis nota manual & salah hitung</span>
              </div>
              <h3 className="font-display font-bold text-lg text-[#141414] mb-2 leading-snug">
                Cetak Struk Bluetooth 58/80mm dalam 2 Detik
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Terkoneksi langsung ke 50+ merk printer thermal Bluetooth. Cetak struk rapi lengkap dengan logo toko, rincian belanja, dan total transaksi dalam 2 detik.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between text-xs font-mono text-zinc-500 font-semibold">
              <span>KECEPATAN CETAK</span>
              <span className="text-[#141414] font-bold">✓ 2 DETIK RAPI</span>
            </div>
          </div>

          <div className="bg-[#F3F4F6] rounded-[28px] p-6 flex flex-col justify-between border border-zinc-200/60">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full mb-3">
                <span>★ Fitur Baru: Pengeluaran Toko, Bahan Baku &amp; Multi-Currency</span>
              </div>
              <h3 className="font-display font-bold text-lg text-[#141414] mb-2 leading-snug">
                Laba Bersih Riil, Biaya Toko & Expired Date
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Catat pengeluaran listrik/sewa, monitor bahan baku yang hampir kedaluwarsa, dan nikmati fleksibilitas multi-currency untuk transaksi lebih luas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between text-xs font-mono text-zinc-500 font-semibold">
              <span>KONTROL BISNIS</span>
              <span className="text-[#141414] font-bold">✓ LABA RIIL & MEMBERSHIP</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
