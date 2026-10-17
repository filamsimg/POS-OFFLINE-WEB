'use client';

import { ADMIN_CONTACTS } from '@/lib/types';

export function PackagesSection() {
  const filamsi = ADMIN_CONTACTS.find((c) => c.id === 'filamsi') || ADMIN_CONTACTS[1];
  const ariyo = ADMIN_CONTACTS.find((c) => c.id === 'ariyo') || ADMIN_CONTACTS[0];

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
          Seluruh paket di bawah ini sudah terbuka penuh dalam <strong>1x pembayaran Rp 299.000</strong> seumur hidup tanpa biaya tambahan.
        </p>
      </div>

      {/* 3 Signature Inverted Corner Cutout Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        
        {/* Card 1: Soft Cloud Gray (Warung & Sembako) */}
        <div className="notch-card bg-[#F3F4F6] p-5 sm:p-7 flex flex-col justify-between min-h-[410px] border border-zinc-200/60 shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-white text-[#141414] border border-zinc-200">
                WARUNG & SEMBAKO
              </span>
              <span className="text-xs text-zinc-500 font-mono">HP / Tablet</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#141414] mb-4">
              Mode Sembako & Ecer-Grosir
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
                <span><strong>Scan Barcode Kamera HP:</strong> Tambah produk ke keranjang tanpa perlu beli alat scanner eksternal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#141414] mt-0.5">✓</span>
                <span><strong>Multi-Currency (IDR/USD):</strong> Dukung transaksi fleksibel untuk toko di daerah wisata.</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-6 border-t border-zinc-200 pr-14 sm:pr-16">
            <span className="text-xs text-zinc-500 block">Lisensi Penuh Tanpa Batas</span>
            <span className="font-mono font-bold text-2xl text-[#141414]">Rp 299.000</span>
            <span className="text-xs text-zinc-600 font-semibold"> / sekali bayar</span>
          </div>

          {/* Signature Inverted Cutout Corner */}
          <div className="notch-cutout">
            <a
              href="#checkout-manusiawi"
              title="Pilih Mode Warung"
              className="notch-btn"
            >
              →
            </a>
          </div>
        </div>

        {/* Card 2: Volt Lime Highlight (Kafe & Resto) */}
        <div className="notch-card bg-[#C8F53B] p-5 sm:p-7 flex flex-col justify-between min-h-[410px] text-[#141414] shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-[#141414] text-[#C8F53B]">
                ★ PALING BANYAK DIPAKAI
              </span>
              <span className="text-xs text-[#141414]/75 font-mono font-bold">F&B Ready</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#141414] mb-4">
              Mode Kafe, Resto & Kuliner
            </h3>
            <ul className="space-y-3 text-sm text-[#141414]/90 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#141414] mt-0.5">✓</span>
                <span><strong>Simpan Meja (Open Bill):</strong> Pelanggan pesan dulu, tambah menu kapan saja, bayar saat selesai makan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#141414] mt-0.5">✓</span>
                <span><strong>Cetak Struk Dapur (KOT):</strong> Pisahkan struk koki di dapur dan struk pembayaran di meja kasir.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#141414] mt-0.5">✓</span>
                <span><strong>Manajemen Bahan Baku:</strong> Monitor stok bahan mentah dapur agar tidak kehabisan saat jam ramai.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#141414] mt-0.5">✓</span>
                <span><strong>Multi-Metode & PPN:</strong> Tunai, QRIS, Transfer, serta toggle pajak resto & logo kafe di struk.</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-6 border-t border-[#141414]/15 pr-14 sm:pr-16">
            <span className="text-xs text-[#141414]/75 block font-bold">Termasuk Fitur Meja & Bahan Baku</span>
            <span className="font-mono font-bold text-2xl text-[#141414]">Rp 299.000</span>
            <span className="text-xs text-[#141414]/80 font-bold"> / sekali bayar</span>
          </div>

          {/* Signature Inverted Cutout Corner */}
          <div className="notch-cutout">
            <a
              href="#checkout-manusiawi"
              title="Pilih Mode Kafe"
              className="notch-btn !bg-[#141414] !text-[#C8F53B]"
            >
              →
            </a>
          </div>
        </div>

        {/* Card 3: Carbon Black (Retail & Multi-Toko) */}
        <div className="notch-card bg-[#141414] text-white p-5 sm:p-7 flex flex-col justify-between min-h-[410px] border border-white/10 shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-white/10 text-[#C8F53B]">
                RETAIL, BUTIK & APOTEK
              </span>
              <span className="text-xs text-zinc-400 font-mono">Full Pro</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-white mb-4">
              Mode Retail, Stok & Keamanan
            </h3>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#C8F53B] mt-0.5">✓</span>
                <span><strong>Import Ribuan Produk via Excel:</strong> Upload katalog massal dalam 10 detik tanpa ketik satu-satu.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#C8F53B] mt-0.5">✓</span>
                <span><strong>Pengingat Expired Date:</strong> Notifikasi dini untuk obat, makanan kemasan, atau produk musiman.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#C8F53B] mt-0.5">✓</span>
                <span><strong>Pencatatan Expense & Laba:</strong> Catat biaya toko (listrik, sewa, gaji) untuk laba bersih akurat.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#C8F53B] mt-0.5">✓</span>
                <span><strong>PIN Pemilik & Membership:</strong> Kunci laporan laba rugi dan simpan database pelanggan setia.</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-6 border-t border-white/15 pr-14 sm:pr-16">
            <span className="text-xs text-zinc-400 block">Semua Fitur Pro & Expense Terbuka</span>
            <span className="font-mono font-bold text-2xl text-white">Rp 299.000</span>
            <span className="text-xs text-[#C8F53B] font-semibold"> / sekali bayar</span>
          </div>

          {/* Signature Inverted Cutout Corner */}
          <div className="notch-cutout">
            <a
              href="#checkout-manusiawi"
              title="Pilih Mode Retail"
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
              <span className="text-xs text-zinc-400 block font-mono mt-0.5">Tim Teknis & Kustomisasi</span>
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

        {/* Signature Inverted Cutout with WhatsApp Action */}
        <div className="notch-cutout">
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
