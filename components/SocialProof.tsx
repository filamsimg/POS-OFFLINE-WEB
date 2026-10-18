'use client';

import { useState } from 'react';
import { ADMIN_CONTACTS, PACKAGES } from '@/lib/types';

const STORIES = [
  {
    name: 'Ibu Sari',
    store: 'Toko Sembako Berkah',
    city: 'Bekasi',
    gradient: 'from-emerald-950/90 to-black/80',
    text: '“Aplikasinya enteng banget di HP Android jadul. Yang paling ngebantu laporan laba hariannya dan pencatatan pengeluaran operasional listrik/sewa, tiap tutup toko ga perlu rekap buku manual lagi.”',
  },
  {
    name: 'Pak Dimas',
    store: 'Warung Soto Bu Minem',
    city: 'Surabaya',
    gradient: 'from-amber-950/90 to-black/80',
    text: '“Konek printer Bluetooth langsung lancar. Jam makan siang antrean rame, kasir tinggal klik uang pas, struk dapur keluar otomatis, dan ga pernah salah kembalian lagi.”',
  },
  {
    name: 'Rina Wulandari',
    store: 'Butik Rina',
    city: 'Bandung',
    gradient: 'from-sky-950/90 to-black/80',
    text: `“Awalnya ragu karena sekali bayar Rp ${Math.round(PACKAGES.software_only.price / 1000)}rb murah banget, ternyata fiturnya komplit. Ada fitur membership pelanggan dan barcode kamera HP lancar tanpa alat scanner tambahan.”`,
  },
  {
    name: 'Mas Andri',
    store: 'Toko Kelontong Santoso',
    city: 'Malang',
    gradient: 'from-purple-950/90 to-black/80',
    text: '“Sangat terbantu ada import barang dari Excel 10 detik. Ditambah fitur peringatan expired date, barang stok lama bisa langsung ketahuan sebelum kedaluwarsa.”',
  },
];

export function SocialProof() {
  const [device, setDevice] = useState<string>('android');
  const [printer, setPrinter] = useState<string>('bluetooth');

  const filamsi = ADMIN_CONTACTS.find((c) => c.id === 'filamsi') || ADMIN_CONTACTS[1];
  const ariyo = ADMIN_CONTACTS.find((c) => c.id === 'ariyo') || ADMIN_CONTACTS[0];

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Header & 2x2 Bento Cards (Reference Coaches Style) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#F3F4F6] rounded-[28px] p-6 sm:p-7 border border-zinc-200/60 shadow-sm">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#141414] mb-2 leading-snug">
              Cerita Pemilik Usaha
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Bukan sekadar klaim sepihak. Ini pengalaman nyata sesama pemilik warung makan, toko sembako, butik, dan minimarket yang sudah merdeka dari biaya bulanan.
            </p>
          </div>

          {/* 2x2 Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STORIES.map((story) => (
              <div
                key={story.name}
                className={`relative rounded-[20px] overflow-hidden bg-gradient-to-br ${story.gradient} text-white p-5 min-h-[200px] flex flex-col justify-between border border-white/10 shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono bg-[#C8F53B] text-[#141414] font-bold px-2.5 py-0.5 rounded-full">
                    ★★★★★
                  </span>
                  <span className="text-xs text-zinc-300 font-mono font-medium">
                    {story.city}
                  </span>
                </div>
                <div className="mt-5">
                  <p className="text-xs sm:text-[13px] text-zinc-100 leading-relaxed mb-3">
                    {story.text}
                  </p>
                  <div className="font-display font-bold text-base text-white">
                    {story.name}
                  </div>
                  <div className="text-xs text-[#C8F53B] font-medium">
                    {story.store}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Device Checker + Support Card */}
        <div id="cek-perangkat" className="lg:col-span-5 flex flex-col justify-between gap-4">
          
          {/* Interactive Device Compatibility Checker (Eliminates Tech Fear) */}
          <div className="bg-[#F3F4F6] rounded-[28px] p-6 sm:p-7 flex-1 flex flex-col justify-between border border-zinc-200/60 shadow-sm">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-2 font-semibold">
                CEK KECOCOKAN PERANGKAT (10 DETIK)
              </span>
              <h3 className="font-display font-bold text-xl text-[#141414] mb-2 leading-snug">
                Apakah HP & Printer Anda Cocok?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 mb-5 leading-relaxed">
                Pilih jenis perangkat Anda untuk memastikan aplikasi berjalan mulus:
              </p>

              <div className="space-y-3.5 mb-5">
                <div>
                  <label htmlFor="deviceSelect" className="text-xs font-bold text-[#141414] block mb-1.5">
                    1. Perangkat Kasir Anda:
                  </label>
                  <select
                    id="deviceSelect"
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#141414] focus:outline-none focus:border-[#141414]"
                  >
                    <option value="android">HP Android</option>
                    <option value="tablet">Tablet Android</option>
                    <option value="pos">Mesin POS Android</option>
                    <option value="ios">iPhone / iPad</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="printerSelect" className="text-xs font-bold text-[#141414] block mb-1.5">
                    2. Printer Struk Thermal (Opsional):
                  </label>
                  <select
                    id="printerSelect"
                    value={printer}
                    onChange={(e) => setPrinter(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#141414] focus:outline-none focus:border-[#141414]"
                  >
                    <option value="bluetooth">Printer Thermal Bluetooth</option>
                    <option value="noprinter">Tanpa Printer / Belum Ada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Result Box */}
            {device === 'ios' ? (
              <div className="p-4 rounded-2xl bg-amber-950 text-white border border-amber-500/40">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm mb-1">
                  <span>ℹ️ Khusus Sistem Operasi Android</span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed">
                  Saat ini POS OFFLINE dirancang khusus untuk HP, Tablet, atau Mesin POS berbasis <strong>Android (mulai RAM 2GB)</strong> dan belum tersedia untuk iPhone/iPad.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-500/30">
                <div className="flex items-center gap-2 text-[#C8F53B] font-bold text-xs sm:text-sm mb-1">
                  <span>✓ 100% Kompatibel & Siap Dipasang!</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Perangkat Anda mendukung penuh kamera scan barcode, penyimpanan database offline, dan koneksi printer thermal seketika.
                </p>
              </div>
            )}
          </div>

          {/* Volt Lime Coach/Support Card */}
          <div className="bg-[#C8F53B] rounded-[28px] p-6 sm:p-7 text-[#141414] shadow-sm">
            <h4 className="font-display font-bold text-lg mb-2 leading-snug">
              Didampingi Tim Teknis Sampai Bisa Pakai
            </h4>
            <p className="text-xs sm:text-sm text-[#141414]/85 leading-relaxed mb-4">
              Baru pertama kali memakai aplikasi kasir? Jangan khawatir. Anda mendapat <strong>11 Video Panduan praktis</strong> serta pendampingan langsung via WhatsApp bersama <strong>Tim Support & Teknis kami</strong> setiap hari.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
              <span className="px-3 py-1.5 rounded-full bg-[#141414] text-[#C8F53B]">
                Respon Cepat WhatsApp
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/70 text-[#141414]">
                Garansi Resmi Pemindahan Lisensi
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
