const PAINS = [
  {
    before: 'Bayar langganan tiap bulan ke aplikasi kasir lain, padahal toko masih sepi.',
    after:  'Bayar sekali Rp 149.000, aplikasi kasir aktif selamanya tanpa potongan bulanan.',
  },
  {
    before: 'Kasir berhenti fungsi saat internet mati atau sinyal jelek di dalam toko.',
    after:  '100% bekerja offline. Toko tetap buka dan transaksi jalan terus tanpa internet.',
  },
  {
    before: 'Cetak struk manual tulis tangan, lambat dan sering salah hitung.',
    after:  'Struk cetak otomatis ke printer Bluetooth 58mm/80mm dalam 2 detik, tepat dan rapi.',
  },
  {
    before: 'Tidak tahu berapa keuntungan bersih toko hari ini karena rekap masih manual di buku.',
    after:  'Laporan laba bersih per hari, minggu, bulan langsung tampil di dashboard aplikasi.',
  },
];

export function PainPoints() {
  return (
    <section
      id="solusi"
      className="section"
      style={{ background: 'var(--clr-soil)' }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 64px)' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>
            Masalah & Solusi
          </div>
          <h2 className="heading-lg" style={{ maxWidth: '34ch', margin: '0 auto 16px' }}>
            Kenapa UMKM Beralih ke POS OFFLINE?
          </h2>
          <p
            style={{
              fontSize: 15,
              color: 'var(--clr-sand)',
              maxWidth: '52ch',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Setiap rupiah yang Anda keluarkan seharusnya bekerja untuk toko Anda, bukan untuk biaya langganan.
          </p>
        </div>

        {/* Pain/Solution Grid */}
        <style>{`
          .pain-card {
            background: var(--clr-moss);
            border: 1px solid var(--clr-sage);
            border-radius: 14px;
            overflow: hidden;
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease;
          }
          .pain-card:hover {
            transform: translateY(-4px);
            border-color: rgba(34, 197, 94, 0.35);
            box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.4), 0 0 24px -4px rgba(34, 197, 94, 0.12);
          }
          .pain-after-half {
            transition: background-color 0.25s ease;
          }
          .pain-card:hover .pain-after-half {
            background: rgba(61, 186, 120, 0.08) !important;
          }
          .check-badge {
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .pain-card:hover .check-badge {
            transform: scale(1.12);
          }
          @media (prefers-reduced-motion: reduce) {
            .pain-card:hover {
              transform: none !important;
            }
          }
        `}</style>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: 16,
          }}
        >
          {PAINS.map((item, i) => (
            <div
              key={i}
              className="pain-card"
            >
              {/* Before */}
              <div
                style={{
                  padding: '18px 22px',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  borderBottom: '1px solid var(--clr-sage)',
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    minWidth: 22,
                    borderRadius: '50%',
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    color: '#f87171',
                    fontWeight: 700,
                    marginTop: 2,
                  }}
                >
                  ✗
                </span>
                <p style={{ fontSize: 14, color: 'var(--clr-sand)', lineHeight: 1.6, margin: 0 }}>
                  {item.before}
                </p>
              </div>
              {/* After */}
              <div
                className="pain-after-half"
                style={{
                  padding: '18px 22px',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  background: 'rgba(61,186,120,0.04)',
                }}
              >
                <span
                  className="check-badge"
                  style={{
                    width: 22,
                    height: 22,
                    minWidth: 22,
                    borderRadius: '50%',
                    background: 'rgba(61,186,120,0.15)',
                    border: '1px solid rgba(61,186,120,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    color: 'var(--clr-leaf)',
                    fontWeight: 700,
                    marginTop: 2,
                  }}
                >
                  ✓
                </span>
                <p style={{ fontSize: 14, color: 'var(--clr-cream)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  {item.after}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
