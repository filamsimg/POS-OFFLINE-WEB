'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Tablet, 
  Smartphone, 
  SlidersHorizontal,
  CheckCircle,
  Sparkles,
  Layers,
  ArrowRight,
  MoveHorizontal
} from 'lucide-react';

interface PreviewItem {
  id: string;
  title: string;
  category: 'tablet' | 'mobile' | 'admin';
  deviceType: 'Tablet 10"' | 'Smartphone';
  src: string;
  width: number;
  height: number;
  highlight: string;
  description: string;
}

const PREVIEWS: PreviewItem[] = [
  {
    id: 'katalog-tablet',
    title: 'Katalog Kasir & Grid Menu',
    category: 'tablet',
    deviceType: 'Tablet 10"',
    src: '/preview-apps/preview-katalog-tablet.webp',
    width: 1280,
    height: 842,
    highlight: 'Grid produk interaktif dengan kategori & keranjang instan',
    description: 'Tampilan kasir modern dengan navigasi kategori cepat, pencarian instan, dan kalkulasi total belanja langsung secara real-time.'
  },
  {
    id: 'tablet-kasir',
    title: 'Multi-Metode Pembayaran',
    category: 'tablet',
    deviceType: 'Tablet 10"',
    src: '/preview-apps/preview-tablet-kasir.webp',
    width: 1280,
    height: 842,
    highlight: 'Tunai, QRIS Dinamis/Statis, Transfer, & Open Bill',
    description: 'Dukung berbagai cara bayar pelanggan dalam satu layar sederhana. Bisa simpan pesanan (Open Bill / Meja) untuk resto dan cafe.'
  },
  {
    id: 'numpad-bayar',
    title: 'Numpad Cepat & Uang Pas',
    category: 'tablet',
    deviceType: 'Tablet 10"',
    src: '/preview-apps/preview-numpad-bayar.webp',
    width: 1280,
    height: 842,
    highlight: 'Saran pecahan uang pas & hitung kembalian otomatis',
    description: 'Kasir tidak perlu menghitung manual di kalkulator. Tombol nominal pecahan uang membantu transaksi selesai dalam 3 detik.'
  },
  {
    id: 'struk-kasir',
    title: 'Pratinjau Cetak Struk Thermal',
    category: 'tablet',
    deviceType: 'Tablet 10"',
    src: '/preview-apps/preview-struk-kasir.webp',
    width: 1280,
    height: 842,
    highlight: 'Cetak langsung ke printer Bluetooth 58mm & 80mm',
    description: 'Preview struk akurat sebelum dicetak. Dilengkapi logo toko, rincian item, nomor meja, kasir bertugas, dan ucapan terima kasih.'
  },
  {
    id: 'struk-detail',
    title: 'Detail Transaksi & Nota Digital',
    category: 'tablet',
    deviceType: 'Tablet 10"',
    src: '/preview-apps/preview-struk-detail.webp',
    width: 1280,
    height: 842,
    highlight: 'Riwayat transaksi rapi & kirim nota ke WhatsApp pelanggan',
    description: 'Selain cetak thermal fisik, nota belanja dapat dibagikan langsung secara digital melalui WhatsApp pelanggan tanpa perlu kertas.'
  },
  {
    id: 'dashboard-mobile',
    title: 'Dashboard & Tren Penjualan',
    category: 'mobile',
    deviceType: 'Smartphone',
    src: '/preview-apps/preview-dashboard-mobile.webp',
    width: 842,
    height: 1280,
    highlight: 'Ringkasan omset harian, produk terlaris, & grafik 7 hari',
    description: 'Pantau kesehatan keuangan tokomu kapan saja. Semua angka ringkas, jelas, dan dihitung otomatis langsung di genggaman.'
  },
  {
    id: 'laporan-keuangan',
    title: 'Laporan Laba Rugi & HPP',
    category: 'mobile',
    deviceType: 'Smartphone',
    src: '/preview-apps/preview-laporan-keuangan.webp',
    width: 842,
    height: 1280,
    highlight: 'Ketahui laba bersih toko riil tanpa rekap buku manual',
    description: 'Otomatis menghitung margin keuntungan, harga pokok penjualan (HPP), total diskon, dan analisis waktu jam paling sibuk.'
  },
  {
    id: 'manajemen-produk',
    title: 'Kelola Produk & Harga Grosir',
    category: 'admin',
    deviceType: 'Smartphone',
    src: '/preview-apps/preview-manajemen-produk.webp',
    width: 842,
    height: 1280,
    highlight: 'Harga bertingkat eceran/grosir & barang timbangan curah',
    description: 'Atur kategori, barcode, stok minimal, hingga varian harga grosir / bakul untuk toko kelontong, retail, dan sembako.'
  },
  {
    id: 'impor-excel',
    title: 'Impor & Ekspor Massal Excel',
    category: 'admin',
    deviceType: 'Smartphone',
    src: '/preview-apps/preview-impor-excel.webp',
    width: 842,
    height: 1280,
    highlight: 'Upload ratusan produk sekaligus dalam 10 detik',
    description: 'Punya banyak item barang? Cukup gunakan template Excel/CSV yang disediakan untuk memasukkan ribuan data produk sekaligus tanpa repot.'
  },
  {
    id: 'printer-thermal',
    title: 'Setup Printer Bluetooth',
    category: 'admin',
    deviceType: 'Smartphone',
    src: '/preview-apps/preview-printer-thermal.webp',
    width: 842,
    height: 1280,
    highlight: 'Koneksi instan ke berbagai printer thermal 58mm / 80mm',
    description: 'Sambungkan perangkat ke printer struk thermal Bluetooth merk apapun (Panda, Iware, Eppos, Vsc, dsb) secara stabil dan cepat.'
  },
  {
    id: 'keamanan-pin',
    title: 'Proteksi PIN Pemilik Toko',
    category: 'admin',
    deviceType: 'Smartphone',
    src: '/preview-apps/preview-keamanan-pin.webp',
    width: 842,
    height: 1280,
    highlight: 'Kunci menu sensitif agar aman dari manipulasi kasir',
    description: 'Hanya pemilik toko berwenang yang dapat membuka laporan keuntungan, mengubah harga pokok, atau mereset data riwayat kasir.'
  },
  {
    id: 'pengaturan-fitur',
    title: 'Kustomisasi Fitur Fleksibel',
    category: 'admin',
    deviceType: 'Smartphone',
    src: '/preview-apps/preview-pengaturan-fitur.webp',
    width: 842,
    height: 1280,
    highlight: 'Atur PPN, service charge, open bill, & format nota',
    description: 'Sesuaikan fitur aplikasi dengan jenis usahamu, mulai dari warung makan, cafe & resto, toko sembako, laundry, hingga barbershop.'
  },
];

type CategoryFilter = 'all' | 'tablet' | 'mobile' | 'admin';

export function AppPreviewSection() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);

  const filteredItems = activeFilter === 'all' 
    ? PREVIEWS 
    : PREVIEWS.filter(item => item.category === activeFilter);

  // Update scroll buttons state
  const checkScrollState = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)));
    } else {
      setScrollProgress(100);
    }
  };

  useEffect(() => {
    checkScrollState();
    const current = sliderRef.current;
    if (current) {
      current.addEventListener('scroll', checkScrollState, { passive: true });
      window.addEventListener('resize', checkScrollState);
    }
    return () => {
      if (current) current.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [filteredItems]);

  // Reset scroll to 0 when filter changes
  const handleFilterChange = (filter: CategoryFilter) => {
    setActiveFilter(filter);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  // Scroll controls
  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth * 0.75;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <section
      id="preview-aplikasi"
      className="section"
      style={{
        background: 'var(--clr-forest)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid var(--clr-sage)',
        borderBottom: '1px solid var(--clr-sage)',
        paddingTop: 'clamp(48px, 6vw, 72px)',
        paddingBottom: 'clamp(48px, 6vw, 72px)',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '720px',
          height: '350px',
          background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.08) 0%, rgba(59, 130, 246, 0.04) 50%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <style>{`
        .preview-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          border-radius: 99px;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid var(--clr-sage);
          background: rgba(20, 21, 31, 0.7);
          color: var(--clr-sand);
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
          white-space: nowrap;
        }

        .preview-filter-btn:hover {
          color: var(--clr-cream);
          border-color: rgba(34, 197, 94, 0.4);
          background: rgba(34, 197, 94, 0.08);
        }

        .preview-filter-btn.active {
          color: #ffffff;
          background: var(--clr-leaf);
          border-color: var(--clr-leaf);
          box-shadow: 0 4px 16px rgba(34, 197, 94, 0.35);
        }

        /* ─── Horizontal Slider Track ─── */
        .preview-slider-track {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          padding: 8px 4px 18px 4px;
          scrollbar-width: none; /* Firefox */
        }

        .preview-slider-track::-webkit-scrollbar {
          display: none; /* Chrome, Safari */
        }

        .preview-slide-card {
          flex: 0 0 clamp(285px, 28vw, 340px);
          scroll-snap-align: start;
          position: relative;
          background: var(--clr-moss);
          border: 1px solid var(--clr-sage);
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          user-select: none;
        }

        .preview-slide-card:hover {
          transform: translateY(-4px);
          border-color: rgba(34, 197, 94, 0.5);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.45), 0 0 20px rgba(34, 197, 94, 0.12);
        }

        .preview-img-wrapper {
          position: relative;
          width: 100%;
          height: 220px;
          background: #06080d;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .preview-slide-card:hover .preview-img-wrapper img {
          transform: scale(1.03);
        }

        .preview-img-wrapper img {
          transition: transform 0.35s ease;
        }

        .preview-zoom-overlay {
          position: absolute;
          inset: 0;
          background: rgba(8, 9, 14, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
          backdrop-filter: blur(2px);
        }

        .preview-slide-card:hover .preview-zoom-overlay {
          opacity: 1;
        }

        /* ─── Slider Navigation Controls ─── */
        .slider-nav-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(20, 21, 31, 0.85);
          border: 1px solid var(--clr-sage);
          color: var(--clr-cream);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }

        .slider-nav-btn:hover:not(:disabled) {
          background: var(--clr-leaf);
          border-color: var(--clr-leaf);
          color: #ffffff;
          transform: scale(1.05);
        }

        .slider-nav-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* ─── Lightbox Modal ─── */
        .preview-lightbox-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(4, 5, 8, 0.9);
          backdrop-filter: blur(12px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-dialog {
          position: relative;
          max-width: 1040px;
          width: 100%;
          max-height: 94vh;
          background: #0f121d;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(34, 197, 94, 0.15);
          display: flex;
          flex-direction: column;
        }

        .lightbox-nav-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lightbox-nav-btn:hover {
          background: var(--clr-leaf);
          border-color: var(--clr-leaf);
          transform: scale(1.08);
        }
      `}</style>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 4vw, 40px)' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>
            <Sparkles size={14} /> Tampilan Nyata Aplikasi
          </div>
          <h2 className="heading-lg" style={{ maxWidth: '30ch', margin: '0 auto 14px' }}>
            Lihat Langsung Antarmuka POS OFFLINE
          </h2>
          <p
            style={{
              fontSize: 14.5,
              color: 'var(--clr-sand)',
              maxWidth: '54ch',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Bukan sekadar mockup konsep. Geser untuk melihat tampilan asli aplikasi POS OFFLINE 
            yang berjalan mulus di tablet dan smartphone Android.
          </p>

          {/* Filter Pills */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 22,
            }}
          >
            <button
              onClick={() => handleFilterChange('all')}
              className={`preview-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            >
              <Layers size={13} /> Semua ({PREVIEWS.length})
            </button>
            <button
              onClick={() => handleFilterChange('tablet')}
              className={`preview-filter-btn ${activeFilter === 'tablet' ? 'active' : ''}`}
            >
              <Tablet size={13} /> Mode Tablet & Kasir ({PREVIEWS.filter(p => p.category === 'tablet').length})
            </button>
            <button
              onClick={() => handleFilterChange('mobile')}
              className={`preview-filter-btn ${activeFilter === 'mobile' ? 'active' : ''}`}
            >
              <Smartphone size={13} /> HP & Laporan ({PREVIEWS.filter(p => p.category === 'mobile').length})
            </button>
            <button
              onClick={() => handleFilterChange('admin')}
              className={`preview-filter-btn ${activeFilter === 'admin' ? 'active' : ''}`}
            >
              <SlidersHorizontal size={13} /> Fitur & Stok ({PREVIEWS.filter(p => p.category === 'admin').length})
            </button>
          </div>
        </div>

        {/* Slider Controls Header (Indicator & Prev/Next Arrows) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
            padding: '0 4px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12.5,
              color: 'var(--clr-sand)',
              fontWeight: 600,
            }}
          >
            <MoveHorizontal size={15} style={{ color: '#22c55e' }} />
            <span>Geser ke samping ({filteredItems.length} Layar)</span>
            <span style={{ color: 'var(--clr-fog)' }}>•</span>
            <span style={{ color: '#4ade80' }}>Klik kartu untuk memperbesar</span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="slider-nav-btn"
              aria-label="Geser ke kiri"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="slider-nav-btn"
              aria-label="Geser ke kanan"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Slider Track */}
        <div
          ref={sliderRef}
          className="preview-slider-track"
          role="region"
          aria-label="Galeri Layar Aplikasi POS OFFLINE"
        >
          {filteredItems.map((item, idx) => {
            const isLandscape = item.width > item.height;

            return (
              <div
                key={item.id}
                className="preview-slide-card"
                onClick={() => setLightboxIndex(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setLightboxIndex(idx);
                  }
                }}
                aria-label={`Lihat detail ${item.title}`}
              >
                {/* Image Container with Safe Responsive Styles (No Aspect Ratio Warnings) */}
                <div className="preview-img-wrapper">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={item.width}
                    height={item.height}
                    style={{
                      width: 'auto',
                      height: '100%',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      padding: isLandscape ? '8px 12px' : '6px 10px',
                    }}
                    sizes="340px"
                    loading="lazy"
                  />

                  {/* Device Tag */}
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: 'rgba(8, 9, 14, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(8px)',
                      color: isLandscape ? '#38bdf8' : '#4ade80',
                      fontSize: 10.5,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 99,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      zIndex: 2,
                    }}
                  >
                    {isLandscape ? <Tablet size={11} /> : <Smartphone size={11} />}
                    {item.deviceType}
                  </span>

                  {/* Zoom Overlay */}
                  <div className="preview-zoom-overlay">
                    <span
                      style={{
                        background: 'var(--clr-leaf)',
                        color: '#fff',
                        fontSize: 11.5,
                        fontWeight: 700,
                        padding: '6px 14px',
                        borderRadius: 99,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                      }}
                    >
                      <Maximize2 size={13} /> Perbesar
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: 'var(--clr-cream)',
                      marginBottom: 4,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 12,
                      color: '#4ade80',
                      fontWeight: 600,
                      lineHeight: 1.45,
                      marginBottom: 8,
                    }}
                  >
                    {item.highlight}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--clr-sand)',
                      lineHeight: 1.5,
                      marginTop: 'auto',
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Progress Bar */}
        <div
          style={{
            width: '100%',
            maxWidth: 240,
            height: 4,
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 99,
            margin: '10px auto 32px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.max(15, scrollProgress)}%`,
              background: 'var(--clr-leaf)',
              borderRadius: 99,
              transition: 'width 0.15s ease',
            }}
          />
        </div>

        {/* Bottom Compatibility Banner (Compact) */}
        <div
          style={{
            padding: '16px 20px',
            background: 'rgba(20, 21, 31, 0.7)',
            border: '1px solid var(--clr-sage)',
            borderRadius: 14,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22c55e',
                flexShrink: 0,
              }}
            >
              <CheckCircle size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13.5, color: '#f0f1f8' }}>
                Responsif di Semua Layar Android (HP, Tablet, & Mesin Kasir POS)
              </div>
              <div style={{ fontSize: 12, color: 'var(--clr-sand)' }}>
                Tampilan otomatis menyesuaikan mode portrait (HP) atau landscape (Tablet).
              </div>
            </div>
          </div>

          <a
            href="#checkout"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--clr-leaf)',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 13,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
              transition: 'transform 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span>Dapatkan Lisensi</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* ── Lightbox Modal ─────────────────────────────────────────────────── */}
      {activeItem && lightboxIndex !== null && (
        <div
          className="preview-lightbox-backdrop"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
        >
          <div
            className="lightbox-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div
              style={{
                padding: '12px 18px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#090c14',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    background: activeItem.width > activeItem.height ? 'rgba(56, 189, 248, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                    color: activeItem.width > activeItem.height ? '#38bdf8' : '#4ade80',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  {activeItem.deviceType}
                </span>
                <span style={{ fontWeight: 800, fontSize: 14.5, color: '#f8fafc' }}>
                  {activeItem.title}
                </span>
                <span style={{ fontSize: 12, color: 'var(--clr-sand)' }}>
                  ({lightboxIndex + 1} dari {filteredItems.length})
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#f8fafc',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                aria-label="Tutup Pratinjau"
              >
                <X size={16} />
              </button>
            </div>

            {/* Lightbox Image Stage */}
            <div
              style={{
                flex: 1,
                minHeight: '340px',
                maxHeight: '66vh',
                background: '#04060a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '16px',
                overflow: 'hidden',
              }}
            >
              {/* Prev Button */}
              <button
                className="lightbox-nav-btn"
                style={{ position: 'absolute', left: 16, zIndex: 10 }}
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1
                  )
                }
                aria-label="Gambar Sebelumnya"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Main Image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  maxHeight: '62vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src={activeItem.src}
                  alt={activeItem.title}
                  width={activeItem.width}
                  height={activeItem.height}
                  priority
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '62vh',
                    objectFit: 'contain',
                    borderRadius: 12,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
                  }}
                />
              </div>

              {/* Next Button */}
              <button
                className="lightbox-nav-btn"
                style={{ position: 'absolute', right: 16, zIndex: 10 }}
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0
                  )
                }
                aria-label="Gambar Selanjutnya"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Lightbox Footer Info */}
            <div
              style={{
                padding: '14px 20px',
                background: '#090c14',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <div style={{ color: '#4ade80', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>
                  {activeItem.highlight}
                </div>
                <div style={{ color: 'var(--clr-sand)', fontSize: 12.5, maxWidth: 640, lineHeight: 1.5 }}>
                  {activeItem.description}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <a
                  href="#checkout"
                  onClick={() => setLightboxIndex(null)}
                  style={{
                    background: 'var(--clr-leaf)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: 12.5,
                    padding: '8px 16px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  Beli Lisensi Sekarang
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
