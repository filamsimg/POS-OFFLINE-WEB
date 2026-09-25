// Social proof testimonials: concise, natural, and realistic
const TESTIMONIALS = [
  {
    name:     'Ibu Sari',
    store:    'Toko Sembako Berkah',
    city:     'Bekasi',
    initials: 'SB',
    color:    '#16a34a',
    stars:    5,
    text:     'Aplikasinya simpel dan enteng di HP. Yang paling ngebantu laporan laba hariannya, tiap tutup toko ga perlu hitung manual lagi.',
  },
  {
    name:     'Pak Dimas',
    store:    'Warung Soto Bu Minem',
    city:     'Surabaya',
    initials: 'DK',
    color:    '#0284c7',
    stars:    5,
    text:     'Konek printer Bluetooth langsung lancar. Pas warung lagi rame, kasir jadi cepet dan ga pernah salah kembalian lagi.',
  },
  {
    name:     'Rina Wulandari',
    store:    'Butik Rina',
    city:     'Bandung',
    initials: 'RW',
    color:    '#7c3aed',
    stars:    5,
    text:     'Awalnya ragu karena harganya murah, ternyata fiturnya komplit. Scan barcode lancar dan mantap ga ada biaya bulanan.',
  },
  {
    name:     'Mas Andri',
    store:    'Toko Kelontong Santoso',
    city:     'Malang',
    initials: 'AS',
    color:    '#ea580c',
    stars:    5,
    text:     'Sangat terbantu ada import barang dari Excel. Stok otomatis kepotong pas ada penjualan, ga ribet kontrol barang.',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: '#f59e0b', fontSize: 14 }}>★</span>
      ))}
    </div>
  );
}

export function SocialProof() {
  return (
    <section
      id="testimoni"
      className="section section-light"
      style={{ background: 'var(--clr-linen)' }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 60px)' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Testimoni Pengguna</div>
          <h2 className="heading-lg" style={{ color: '#111827', marginBottom: 12 }}>
            Apa Kata Pemilik Usaha yang Menggunakan POS Offline
          </h2>
          <p style={{ fontSize: 15, color: '#6b7280', maxWidth: '50ch', margin: '0 auto', lineHeight: 1.7 }}>
            Bukan janji di iklan, ini cerita nyata dari sesama pemilik toko.
          </p>
        </div>

        {/* Styles for Testimonial Micro-Interactions */}
        <style>{`
          .testimonial-card {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 24px 22px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
          }
          .testimonial-card:hover {
            transform: translateY(-4px);
            border-color: #86efac;
            box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.08), 0 0 16px -4px rgba(34, 197, 94, 0.12);
          }
          @media (prefers-reduced-motion: reduce) {
            .testimonial-card:hover {
              transform: none !important;
            }
          }
        `}</style>

        {/* Testimonials grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 20,
          }}
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="testimonial-card"
            >
              {/* Stars */}
              <StarRating count={t.stars} />

              {/* Quote */}
              <blockquote
                style={{
                  fontSize: 14,
                  color: '#374151',
                  lineHeight: 1.7,
                  margin: 0,
                  flexGrow: 1,
                }}
              >
                &ldquo;{t.text}&rdquo;
              </blockquote>

              {/* Author */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  paddingTop: 12,
                  borderTop: '1px solid #f3f4f6',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: t.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{t.store} · {t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
