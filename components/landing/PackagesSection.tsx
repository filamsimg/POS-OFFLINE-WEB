'use client';

import { ADMIN_CONTACTS, PACKAGES } from '@/lib/types';

export function PackagesSection() {
  const filamsi = ADMIN_CONTACTS.find((c) => c.id === 'filamsi') || ADMIN_CONTACTS[1];
  const ariyo = ADMIN_CONTACTS.find((c) => c.id === 'ariyo') || ADMIN_CONTACTS[0];
  const formattedPrice = 'Rp ' + PACKAGES.software_only.price.toLocaleString('id-ID');

  const waCustomUrl = `https://wa.me/${filamsi?.waNumber || ariyo?.waNumber}?text=${encodeURIComponent(
    'Halo Tim POS OFFLINE, saya ingin konsultasi kebutuhan custom fitur / modifikasi alur khusus untuk toko saya.'
  )}`;

  return (
    <section id="program-usaha" className="mb-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 gap-3">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-2 font-semibold">
            FLEKSIBEL UNTUK SEMUA JENIS UMKM
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#141414] leading-tight">
            Satu Lisensi untuk<br className="hidden sm:block" /> Setiap Skala Usaha
          </h2>
        </div>
        <p className="text-sm text-zinc-600 max-w-md leading-relaxed">
          Seluruh paket di bawah ini sudah terbuka penuh dalam <strong>1x pembayaran {formattedPrice}</strong> seumur hidup tanpa biaya tambahan.
        </p>
      </div>

      {/* 3 Signature Inverted Corner Cutout Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        
        {/* Card 1: Soft Cloud Gray (Retail & Toko Sembako) */}
        <div className="notch-card bg-[#F3F4F6] p-5 sm:p-7 flex flex-col justify-between min-h-[410px] border border-zinc-200/60 shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-white text-[#141414] border border-zinc-200">
                RETAIL &amp; TOKO
              </span>
              <span className="text-xs text-zinc-500 font-mono">Sembako / Minimarket</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#141414] mb-4">
              Mode Retail &amp; Toko Sembako
            </h3>
            <ul className="space-y-3 text-sm text-zinc-700">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#141414] mt-0.5">✓</span>
                <span><strong>Harga Bertingkat Otomatis:</strong> Beli 1 pcs harga ecer, beli ≥12 pcs otomatis beralih ke harga grosir.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#141414] mt-0.5">✓</span>
                <span><strong>Barang Timbangan Curah:</strong> Input desimal (0.25 kg, 1.5 kg) untuk beras, telur, gula, dan buah.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#141414] mt-0.5">✓</span>
                <span><strong>Scan Barcode Kamera &amp; Gun OTG:</strong> Tambah produk via kamera HP atau gun scanner kasir USB/OTG tanpa lag.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#141414] mt-0.5">✓</span>
                <span><strong>Import Ribuan Produk Excel:</strong> Upload &amp; perbarui ribuan SKU barang sekaligus dalam 10 detik.</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-6 border-t border-zinc-200 pr-14 sm:pr-16">
            <span className="text-xs text-zinc-500 block">Lisensi Penuh Tanpa Batas</span>
            <span className="font-mono font-bold text-2xl text-[#141414]">{formattedPrice}</span>
            <span className="text-xs text-zinc-600 font-semibold"> / sekali bayar</span>
          </div>

          {/* Signature Inverted Cutout Corner */}
          <div className="notch-cutout">
            <a
              href="#checkout"
              title="Pilih Mode Retail"
              className="notch-btn"
            >
              →
            </a>
          </div>
        </div>

        {/* Card 2: Volt Lime Highlight (Kuliner & F&B) */}
        <div className="notch-card bg-[#C8F53B] p-5 sm:p-7 flex flex-col justify-between min-h-[410px] text-[#141414] shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-[#141414] text-[#C8F53B]">
                ★ PALING BANYAK DIPAKAI
              </span>
              <span className="text-xs text-[#141414]/75 font-mono font-bold">Resto &amp; Kafe</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#141414] mb-4">
              Mode Kuliner &amp; F&amp;B
            </h3>
            <ul className="space-y-3 text-sm text-[#141414]/90 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#141414] mt-0.5">✓</span>
                <span><strong>Simpan Meja (Open Bill):</strong> Pelanggan pesan dulu per meja, tambah menu kapan saja, bayar saat selesai.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#141414] mt-0.5">✓</span>
                <span><strong>Cetak Struk Bluetooth Kilat:</strong> Cetak struk rincian pesanan dan total bayar dalam 2 detik ke printer thermal 58mm/80mm.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#141414] mt-0.5">✓</span>
                <span><strong>Bahan Baku &amp; Resep Otomatis:</strong> Setiap porsi/cup terjual otomatis memotong stok bahan baku dapur secara atomik.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#141414] mt-0.5">✓</span>
                <span><strong>Multi-Metode &amp; PPN Resto:</strong> Tunai, QRIS toko, simpan bill, serta toggle pajak resto &amp; logo kafe di struk.</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-6 border-t border-[#141414]/15 pr-14 sm:pr-16">
            <span className="text-xs text-[#141414]/75 block font-bold">Termasuk Fitur Meja &amp; Bahan Baku</span>
            <span className="font-mono font-bold text-2xl text-[#141414]">{formattedPrice}</span>
            <span className="text-xs text-[#141414]/80 font-bold"> / sekali bayar</span>
          </div>

          {/* Signature Inverted Cutout Corner */}
          <div className="notch-cutout">
            <a
              href="#checkout"
              title="Pilih Mode Kuliner"
              className="notch-btn !bg-[#141414] !text-[#C8F53B]"
            >
              →
            </a>
          </div>
        </div>

        {/* Card 3: Carbon Black (Jasa & Layanan) */}
        <div className="notch-card bg-[#141414] text-white p-5 sm:p-7 flex flex-col justify-between min-h-[410px] border border-white/10 shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-white/10 text-[#C8F53B]">
                JASA &amp; LAYANAN
              </span>
              <span className="text-xs text-zinc-400 font-mono">Bengkel / Cuci / Salon</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-white mb-4">
              Mode Jasa, Servis &amp; Laundry
            </h3>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#C8F53B] mt-0.5">✓</span>
                <span><strong>Layanan Jasa Non-Stok:</strong> Jual jasa servis, potong rambut, atau laundry kiloan tanpa ribet hitung stok barang.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#C8F53B] mt-0.5">✓</span>
                <span><strong>Buku Piutang &amp; Kasbon CRM:</strong> Catat tagihan pelanggan, pantau riwayat cicilan, dan kirim tagihan via WhatsApp.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#C8F53B] mt-0.5">✓</span>
                <span><strong>Catat Pengeluaran &amp; Laba:</strong> Catat biaya operasional toko (listrik, sewa, gaji) untuk hitung laba bersih riil.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#C8F53B] mt-0.5">✓</span>
                <span><strong>Proteksi PIN Supervisor / Owner:</strong> Kunci menu keuntungan, hapus nota transaksi, dan ubah modal dari kasir.</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-6 border-t border-white/15 pr-14 sm:pr-16">
            <span className="text-xs text-zinc-400 block">Termasuk Fitur Kasbon &amp; Proteksi PIN</span>
            <span className="font-mono font-bold text-2xl text-white">{formattedPrice}</span>
            <span className="text-xs text-[#C8F53B] font-semibold"> / sekali bayar</span>
          </div>

          {/* Signature Inverted Cutout Corner */}
          <div className="notch-cutout">
            <a
              href="#checkout"
              title="Pilih Mode Jasa"
              className="notch-btn"
            >
              →
            </a>
          </div>
        </div>

      </div>

      {/* DEDICATED CUSTOM OFFERING BENTO CARD */}
      <div className="notch-card bg-[#141414] text-white p-5 sm:p-8 border border-white/10 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8">
            <div className="inline-flex items-center gap-2 bg-[#C8F53B]/20 text-[#C8F53B] border border-[#C8F53B]/30 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-[#C8F53B]"></span>
              LAYANAN KHUSUS • CUSTOM REQUEST
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2 leading-snug">
              Butuh Fitur Khusus atau Modifikasi Alur Toko Anda?
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">
              Punya alur kerja unik, butuh integrasi format nota khusus perusahaan, sistem grosir bertingkat spesifik, atau penambahan modul tersendiri? Tim developer kami siap berdiskusi langsung dan menyesuaikan aplikasi dengan kebutuhan bisnis Anda.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col items-start md:items-end pr-0 sm:pr-16">
            <div className="text-left md:text-right mb-4">
              <span className="text-xs text-zinc-400 block font-mono">KONSULTASI LANGSUNG</span>
              <span className="font-display font-bold text-xl text-[#C8F53B]">Chat Tim Developer</span>
              <span className="text-xs text-zinc-400 block font-mono mt-0.5">Tim Teknis &amp; Kustomisasi</span>
            </div>
            <a
              href={waCustomUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C8F53B] hover:bg-[#BCEB28] text-[#141414] text-sm font-bold px-5 py-3 rounded-xl transition inline-flex items-center gap-2 shadow"
            >
              <span>Diskusi Custom via WA</span>
              <span className="font-mono">↗</span>
            </a>
          </div>
        </div>

        {/* Signature Inverted Cutout with WhatsApp Action (Desktop only to prevent mobile overlap) */}
        <div className="notch-cutout notch-cutout-mobile-hide">
          <a
            href={waCustomUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat Tim Kami untuk Custom"
            className="notch-btn"
          >
            ↗
          </a>
        </div>
      </div>
    </section>
  );
}
