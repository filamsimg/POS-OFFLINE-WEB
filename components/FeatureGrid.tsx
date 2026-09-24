import {
  Bluetooth,
  Barcode,
  LayoutDashboard,
  FileText,
  Users,
  Layers,
  WifiOff,
  Printer,
} from 'lucide-react';

const FEATURES = [
  {
    icon:    <Bluetooth size={22} />,
    title:   'Cetak Struk Bluetooth Instan',
    desc:    'Terhubung ke printer thermal 58mm atau 80mm via Bluetooth dalam hitungan detik. Kompatibel dengan 50+ merk printer.',
    weight:  'major',
  },
  {
    icon:    <Barcode size={22} />,
    title:   'Scan Barcode Produk',
    desc:    'Gunakan kamera HP sebagai scanner barcode. Tambah produk ke keranjang seketika tanpa ketik manual.',
    weight:  'major',
  },
  {
    icon:    <LayoutDashboard size={22} />,
    title:   'Dashboard Laporan Laba',
    desc:    'Lihat ringkasan omzet, laba bersih, produk terlaris, dan tren penjualan per hari, minggu, atau bulan.',
    weight:  'major',
  },
  {
    icon:    <WifiOff size={22} />,
    title:   '100% Offline, Tanpa Internet',
    desc:    'Semua data tersimpan di HP. Tidak ada server yang bisa mati, tidak ada gangguan koneksi.',
    weight:  'minor',
  },
  {
    icon:    <Users size={22} />,
    title:   'Multi-Kasir & Multi-Toko',
    desc:    'Tambah kasir tambahan dan kelola beberapa toko dari satu perangkat dengan sistem manajemen hak akses.',
    weight:  'minor',
  },
  {
    icon:    <Layers size={22} />,
    title:   'Diskon, Grosir & Timbangan',
    desc:    'Atur diskon bertingkat, harga grosir otomatis, dan produk satuan timbangan kg/gram per kategori.',
    weight:  'minor',
  },
  {
    icon:    <FileText size={22} />,
    title:   'Import Produk Massal via Excel',
    desc:    'Upload ratusan SKU produk sekaligus dari file Excel dengan template siap pakai.',
    weight:  'minor',
  },
  {
    icon:    <Printer size={22} />,
    title:   'Sistem Meja & KOT (Restoran)',
    desc:    'Fitur khusus kafe dan restoran: order per meja, cetak kitchen order (KOT) ke printer dapur.',
    weight:  'minor',
  },
];

export function FeatureGrid() {
  const major = FEATURES.filter((f) => f.weight === 'major');
  const minor = FEATURES.filter((f) => f.weight === 'minor');

  return (
    <section
      id="fitur"
      className="section"
      style={{ background: 'var(--clr-forest)' }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 60px)' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Fitur Lengkap</div>
          <h2 className="heading-lg" style={{ marginBottom: 12 }}>
            Satu Aplikasi, Semua Kebutuhan Kasir Toko
          </h2>
          <p style={{ fontSize: 15, color: 'var(--clr-sand)', maxWidth: '50ch', margin: '0 auto', lineHeight: 1.7 }}>
            Dari toko kelontong sampai kafe, POS OFFLINE punya fitur yang Anda butuhkan tanpa biaya langganan.
          </p>
        </div>

        {/* Styles for Feature Card Micro-Interactions */}
        <style>{`
          .feature-card-major {
            background: var(--clr-moss);
            border: 1px solid var(--clr-sage);
            border-radius: 16px;
            padding: 28px 24px;
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease;
            position: relative;
            overflow: hidden;
          }
          .feature-card-major:hover {
            transform: translateY(-5px);
            border-color: rgba(34, 197, 94, 0.4);
            box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 28px -4px rgba(34, 197, 94, 0.16);
          }
          .feature-icon-box {
            width: 46px;
            height: 46px;
            border-radius: 12px;
            background: rgba(61, 186, 120, 0.1);
            border: 1px solid rgba(61, 186, 120, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--clr-leaf);
            margin-bottom: 18px;
            transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease;
          }
          .feature-card-major:hover .feature-icon-box {
            transform: scale(1.08);
            background: rgba(34, 197, 94, 0.2);
            border-color: rgba(34, 197, 94, 0.4);
            color: var(--clr-mint);
          }

          .feature-card-minor {
            display: flex;
            gap: 14px;
            align-items: flex-start;
            background: rgba(20, 22, 34, 0.7);
            border: 1px solid var(--clr-sage);
            border-radius: 12px;
            padding: 18px 16px;
            transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
          }
          .feature-card-minor:hover {
            transform: translateY(-2px);
            border-color: rgba(34, 197, 94, 0.35);
            background: rgba(26, 29, 46, 0.9);
          }
          .feature-minor-icon {
            color: var(--clr-leaf);
            margin-top: 2px;
            flex-shrink: 0;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease;
          }
          .feature-card-minor:hover .feature-minor-icon {
            transform: scale(1.12);
            color: var(--clr-mint);
          }
          @media (prefers-reduced-motion: reduce) {
            .feature-card-major:hover, .feature-card-minor:hover {
              transform: none !important;
            }
          }
        `}</style>

        {/* Major features: 3 cards, slightly larger */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 16,
            marginBottom: 16,
          }}
        >
          {major.map((f) => (
            <div
              key={f.title}
              className="feature-card-major"
            >
              <div className="feature-icon-box">
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: 'var(--clr-cream)',
                  marginBottom: 10,
                  letterSpacing: '-0.015em',
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--clr-sand)', lineHeight: 1.65, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Minor features: 4-column compact list */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: 12,
          }}
        >
          {minor.map((f) => (
            <div
              key={f.title}
              className="feature-card-minor"
            >
              <div className="feature-minor-icon">
                {f.icon}
              </div>
              <div>
                <h4
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--clr-cream)',
                    marginBottom: 4,
                    lineHeight: 1.3,
                  }}
                >
                  {f.title}
                </h4>
                <p style={{ fontSize: 12, color: 'var(--clr-sand)', lineHeight: 1.55, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
