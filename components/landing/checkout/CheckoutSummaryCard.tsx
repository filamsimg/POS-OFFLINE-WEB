'use client';

import { PACKAGES } from '@/lib/types';

export function CheckoutSummaryCard() {
  const pkg = PACKAGES['software_only'];

  return (
    <div className="lg:col-span-5 bg-[#141414] text-white rounded-[24px] p-5 sm:p-7 border border-white/10 shadow-md">
      <div className="inline-block bg-[#C8F53B] text-[#141414] text-xs font-mono font-bold px-3 py-1 rounded-full mb-4">
        DISKON 54% • LISENSI PERMANEN
      </div>
      <h3 className="font-display font-bold text-2xl mb-1 leading-snug">
        Paket Lengkap POS OFFLINE
      </h3>
      <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
        Satu kali pembayaran untuk ketenangan usaha bertahun-tahun.
      </p>

      <div className="flex items-baseline gap-3 pb-5 mb-5 border-b border-white/10">
        <span className="font-mono font-bold text-3xl sm:text-4xl text-[#C8F53B]">
          Rp {pkg.price.toLocaleString('id-ID')}
        </span>
        <span className="font-mono text-sm text-zinc-500 line-through">
          Rp {pkg.originalPrice.toLocaleString('id-ID')}
        </span>
        <span className="text-xs text-zinc-300">/ Sekali Bayar</span>
      </div>

      <ul className="space-y-3 text-xs sm:text-[13px] text-zinc-200 mb-6">
        <li className="flex items-center gap-2.5">
          <span className="text-[#C8F53B] font-bold">✓</span> File APK POS OFFLINE Full Version Resmi
        </li>
        <li className="flex items-center gap-2.5">
          <span className="text-[#C8F53B] font-bold">✓</span> 1x Serial Key Lisensi Permanen (Tidak Kedaluwarsa)
        </li>
        <li className="flex items-center gap-2.5">
          <span className="text-[#C8F53B] font-bold">✓</span> Fitur Multi-Currency, Catat Pengeluaran &amp; Bahan Baku
        </li>
        <li className="flex items-center gap-2.5">
          <span className="text-[#C8F53B] font-bold">✓</span> Peringatan Expired Date &amp; Database Membership
        </li>
        <li className="flex items-center gap-2.5">
          <span className="text-[#C8F53B] font-bold">✓</span> 11 Video Tutorial Panduan Lengkap
        </li>
        <li className="flex items-center gap-2.5">
          <span className="text-[#C8F53B] font-bold">✓</span> Template Excel Import Ratusan Produk Seketika
        </li>
        <li className="flex items-center gap-2.5">
          <span className="text-[#C8F53B] font-bold">✓</span> Dukungan Teknis Langsung via WhatsApp Resmi
        </li>
      </ul>

      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 leading-relaxed">
        <strong>Garansi Lisensi Resmi:</strong> Jika ganti HP baru di kemudian hari, tim kami siap membantu pemindahan lisensi permanen Anda secara gratis.
      </div>
    </div>
  );
}
