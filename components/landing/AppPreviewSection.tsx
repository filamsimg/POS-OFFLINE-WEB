'use client';

import { useState } from 'react';
import Image from 'next/image';

interface WorkflowItem {
  id: string;
  category: 'kasir' | 'stok' | 'laporan';
  title: string;
  badge: string;
  metric: string;
  desc: string;
  imgSrc: string;
}

const WORKFLOW_ITEMS: WorkflowItem[] = [
  // 1. Saat Antrean Kasir Ramai (5 Layar)
  {
    id: 'katalog-kasir',
    category: 'kasir',
    title: '1. Katalog Kasir & Grid Menu Instan',
    badge: 'Tablet & HP',
    metric: '3 DETIK',
    desc: 'Tampilan produk rapi per kategori dengan pencarian cepat, scan barcode, dan hitung total belanja otomatis secara real-time.',
    imgSrc: '/preview-apps/preview-katalog-tablet.webp',
  },
  {
    id: 'numpad-uang-pas',
    category: 'kasir',
    title: '2. Numpad Cepat & Saran Pecahan Uang',
    badge: 'Anti Salah Hitung',
    metric: 'UANG PAS',
    desc: 'Tombol pecahan Rp 20rb, Rp 50rb, Rp 100rb membantu kasir menghitung kembalian otomatis tanpa kalkulator tambahan.',
    imgSrc: '/preview-apps/preview-numpad-bayar.webp',
  },
  {
    id: 'multi-metode',
    category: 'kasir',
    title: '3. Multi-Metode Bayar & Multi-Currency',
    badge: 'IDR, USD, SGD, MYR',
    metric: 'MULTI-MATA UANG',
    desc: 'Dukung Tunai, QRIS, Transfer Bank, serta transaksi multi-currency untuk turis atau pelanggan luar negeri. Bisa Open Bill (Simpan Meja).',
    imgSrc: '/preview-apps/preview-tablet-kasir.webp',
  },
  {
    id: 'cetak-struk',
    category: 'kasir',
    title: '4. Pratinjau & Cetak Struk Bluetooth',
    badge: '58mm & 80mm',
    metric: '2 DETIK',
    desc: 'Koneksi stabil ke printer thermal Bluetooth. Cetak struk lengkap dengan logo toko, nama kasir, dan rincian item dalam 2 detik.',
    imgSrc: '/preview-apps/preview-struk-kasir.webp',
  },
  {
    id: 'konfirmasi-transaksi',
    category: 'kasir',
    title: '5. Konfirmasi Transaksi Sukses & No. Invoice',
    badge: 'Otomatis',
    metric: 'INVOICE RESMI',
    desc: 'Setiap transaksi selesai otomatis menerbitkan nomor invoice unik. Kasir bisa langsung mencetak struk, melihat pratinjau, atau langsung lanjut transaksi berikutnya.',
    imgSrc: '/preview-apps/preview-struk-detail.webp',
  },

  // 2. Saat Atur Stok, Bahan Baku & Expired (4 Layar)
  {
    id: 'kelola-produk',
    category: 'stok',
    title: '6. Kelola Produk, Grosir & Timbangan',
    badge: 'Sembako & Eceran',
    metric: 'ECER/GROSIR',
    desc: 'Atur harga bertingkat (beli 1 ecer, beli 1 lusin harga grosir), stok minimal, dan input angka desimal untuk produk timbangan curah (kg).',
    imgSrc: '/preview-apps/preview-manajemen-produk.webp',
  },
  {
    id: 'bahan-baku-expired',
    category: 'stok',
    title: '7. Manajemen Bahan Baku & Notifikasi Expired Date',
    badge: 'Fitur Baru 2026',
    metric: 'KONTROL EXPIRED',
    desc: 'Pantau stok bahan dasar dapur/resto dan dapatkan pengingat produk yang mendekati tanggal kedaluwarsa sebelum merugikan toko.',
    imgSrc: '/preview-apps/preview-pengaturan-fitur.webp',
  },
  {
    id: 'import-excel',
    category: 'stok',
    title: '8. Impor & Ekspor Ribuan Barang via Excel',
    badge: 'Bebas Capek Ketik',
    metric: '10 DETIK',
    desc: 'Punya ratusan hingga ribuan SKU barang? Masukkan sekaligus dalam 10 detik menggunakan template Excel/CSV yang sudah disediakan.',
    imgSrc: '/preview-apps/preview-impor-excel.webp',
  },
  {
    id: 'setup-printer',
    category: 'stok',
    title: '9. Setup Printer Bluetooth Plug & Play',
    badge: '50+ Merk Printer',
    metric: 'INSTAN',
    desc: 'Pindai dan hubungkan HP/Tablet Anda ke printer Bluetooth merk Panda, Iware, Eppos, VSC, Blueprint, dan Kassen tanpa instal driver rumit.',
    imgSrc: '/preview-apps/preview-printer-thermal.webp',
  },

  // 3. Saat Tutup Toko, Pengeluaran & Membership (3 Layar)
  {
    id: 'dashboard-omzet',
    category: 'laporan',
    title: '10. Dashboard Omzet & Jam Sibuk Toko',
    badge: 'Ringkasan Harian',
    metric: 'REAL-TIME',
    desc: 'Pantau kesehatan keuangan toko kapan saja. Ketahui jam paling ramai pembeli dan daftar produk yang paling cepat habis terjual.',
    imgSrc: '/preview-apps/preview-dashboard-mobile.webp',
  },
  {
    id: 'expense-laba',
    category: 'laporan',
    title: '11. Catat Pengeluaran Toko & Laporan Laba Bersih Riil',
    badge: 'Laba Bersih Riil',
    metric: 'PENGELUARAN',
    desc: 'Catat pengeluaran biaya operasional (listrik, sewa, gaji, kantong plastik). Sistem otomatis memotong HPP & pengeluaran untuk hitung laba bersih.',
    imgSrc: '/preview-apps/preview-laporan-keuangan.webp',
  },
  {
    id: 'pin-membership',
    category: 'laporan',
    title: '12. Proteksi PIN Pemilik & Data Membership',
    badge: 'Keamanan Bos',
    metric: 'PIN & LOYALTI',
    desc: 'Kunci menu keuntungan dan hapus data transaksi dengan PIN Pemilik. Simpan data pelanggan setia untuk program diskon membership.',
    imgSrc: '/preview-apps/preview-keamanan-pin.webp',
  },
];

export function AppPreviewSection() {
  const [activeTab, setActiveTab] = useState<'kasir' | 'stok' | 'laporan'>('kasir');
  const [selectedImage, setSelectedImage] = useState<WorkflowItem | null>(null);

  const filteredItems = WORKFLOW_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section id="alur-kerja" className="bg-[#141414] text-white rounded-[22px] sm:rounded-[28px] p-4 sm:p-8 md:p-10 mb-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#C8F53B] block mb-1.5 sm:mb-2 font-semibold">
            FITUR &amp; TAMPILAN APLIKASI
          </span>
          <h2 className="font-display text-xl sm:text-3xl md:text-4xl font-bold leading-tight">
            Antarmuka Cepat &amp; Mudah Digunakan
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
          Dirancang praktis dan ringan agar karyawan atau kasir baru langsung bisa mengoperasikan toko tanpa pelatihan rumit.
        </p>
      </div>

      {/* Concise Workflow Tabs */}
      <div className="flex gap-2 sm:gap-2.5 my-5 sm:my-6 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        <button
          type="button"
          onClick={() => setActiveTab('kasir')}
          className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
            activeTab === 'kasir'
              ? 'bg-[#C8F53B] text-[#141414] shadow'
              : 'bg-[#1F1F22] text-zinc-300 hover:text-white border border-white/10'
          }`}
        >
          Transaksi Kasir (5)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('stok')}
          className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
            activeTab === 'stok'
              ? 'bg-[#C8F53B] text-[#141414] shadow'
              : 'bg-[#1F1F22] text-zinc-300 hover:text-white border border-white/10'
          }`}
        >
          Stok &amp; Produk (4)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('laporan')}
          className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
            activeTab === 'laporan'
              ? 'bg-[#C8F53B] text-[#141414] shadow'
              : 'bg-[#1F1F22] text-zinc-300 hover:text-white border border-white/10'
          }`}
        >
          Laba &amp; Laporan (3)
        </button>
      </div>

      {/* Split Media Rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group cursor-pointer bg-[#1F1F22] hover:bg-[#26262B] rounded-[18px] sm:rounded-[20px] p-3.5 sm:p-5 flex items-start gap-3.5 sm:gap-4 border border-white/10 hover:border-[#C8F53B]/40 transition shadow-sm"
          >
            {/* Square Screenshot Thumbnail */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden bg-black/60 shrink-0 relative border border-white/15">
              <Image
                src={item.imgSrc}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 80px, 120px"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 bg-black/75 backdrop-blur-sm text-[8px] sm:text-[9px] font-mono text-[#C8F53B] font-bold px-1.5 py-0.5 rounded">
                {item.metric}
              </div>
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0">
              <div className="inline-block text-[9px] sm:text-[10px] font-mono font-semibold text-zinc-300 bg-white/10 px-2 py-0.5 rounded-full mb-1">
                {item.badge}
              </div>
              <h3 className="font-display font-bold text-xs sm:text-base text-white mb-1 leading-snug group-hover:text-[#C8F53B] transition-colors">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-[13px] text-zinc-400 leading-relaxed line-clamp-2">
                {item.desc}
              </p>
              <span className="inline-block mt-1 sm:mt-2 text-[10px] sm:text-[11px] font-mono text-[#C8F53B] font-semibold">
                Klik perbesar layar →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal for Inspecting High-Res Screenshot */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#141414] border border-white/20 rounded-[20px] sm:rounded-[24px] max-w-3xl w-full p-4 sm:p-6 text-white relative shadow-2xl overflow-y-auto max-h-[92vh]"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/15">
              <div>
                <span className="text-[11px] font-mono text-[#C8F53B] uppercase font-bold">
                  {selectedImage.metric} • {selectedImage.badge}
                </span>
                <h4 className="font-display font-bold text-lg text-white mt-0.5">
                  {selectedImage.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full aspect-[16/10] bg-black rounded-xl overflow-hidden border border-white/10 mb-4">
              <Image
                src={selectedImage.imgSrc}
                alt={selectedImage.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-contain"
              />
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {selectedImage.desc}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
