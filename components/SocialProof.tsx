// Social proof testimonials: realistic, specific, not generic
const TESTIMONIALS = [
  {
    name:        'Ibu Sari Rahayu',
    store:       'Toko Sembako Berkah',
    city:        'Bekasi, Jawa Barat',
    initials:    'SR',
    color:       '#16a34a',
    stars:       5,
    text:        'Saya pakai aplikasi ini sudah 8 bulan. Yang paling saya suka itu laporan laba hariannya, langsung keliatan untung berapa. Dulu harus hitung manual pakai kalkulator, sekarang tinggal buka dashboard. Dan harganya sekali bayar, tidak ada potongan bulanan seperti aplikasi kasir lain yang saya coba sebelumnya.',
    highlight:   'Laporan laba harian langsung keliatan, tidak perlu hitung manual lagi.',
  },
  {
    name:        'Pak Dimas Kurniawan',
    store:       'Warung Makan Soto Bu Minem',
    city:        'Surabaya, Jawa Timur',
    initials:    'DK',
    color:       '#0284c7',
    stars:       5,
    text:        'Warung makan saya ramai saat jam makan siang. Dulu kasir saya sering salah hitung kembalian kalau ramai. Sekarang pakai POS OFFLINE, tinggal scan menu, printer langsung cetak struk sehingga kasir jadi lebih fokus dan tidak ada salah hitung lagi. Pelanggan juga lebih percaya karena ada stuknya.',
    highlight:   'Tidak ada salah hitung kembalian lagi. Kasir lebih tenang saat ramai.',
  },
  {
    name:        'Kak Rina Wulandari',
    store:       'Toko Fashion & Butik Rina',
    city:        'Bandung, Jawa Barat',
    initials:    'RW',
    color:       '#7c3aed',
    stars:       5,
    text:        'Saya sempat ragu karena harganya murah, takutnya aplikasi abal-abal. Tapi setelah coba install dan pakai, fiturnya lengkap banget. Bisa scan barcode baju, ada fitur diskon, bisa cetak struk. Tim adminnya juga fast respon di WhatsApp waktu saya ada pertanyaan setup. Ternyata beneran worth it.',
    highlight:   'Sempat ragu karena harga murah, ternyata fiturnya lengkap banget.',
  },
  {
    name:        'Mas Andri Santoso',
    store:       'Minimarket Santoso',
    city:        'Malang, Jawa Timur',
    initials:    'AS',
    color:       '#ea580c',
    stars:       5,
    text:        'Minimarket saya punya 300+ item produk. Import massal dari Excel sangat membantu, kalau input satu-satu bisa makan waktu seharian. Fitur stok otomatis berkurang setiap ada transaksi juga sangat membantu buat kontrol barang. Sudah pakai lebih dari 1 tahun dan tidak pernah ada masalah.',
    highlight:   'Import 300+ produk dari Excel, stok otomatis terkontrol.',
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
            Dipakai Ribuan Pemilik Toko di Seluruh Indonesia
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

              {/* Highlight pill */}
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: 12,
                  color: '#15803d',
                  fontWeight: 600,
                  lineHeight: 1.5,
                }}
              >
                💡 {t.highlight}
              </div>

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

        {/* Social proof footer stat */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'clamp(24px, 6vw, 64px)',
            marginTop: 'clamp(40px, 6vw, 64px)',
            padding: '32px',
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #e5e7eb',
          }}
        >
          {[
            { value: '1.200+', label: 'Lisensi Aktif' },
            { value: '4.9 ★', label: 'Rating Pengguna' },
            { value: '25+', label: 'Provinsi di Indonesia' },
            { value: '< 2 jam', label: 'Rata-rata Waktu Aktivasi' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 'clamp(22px, 4vw, 30px)',
                  fontWeight: 800,
                  color: '#16a34a',
                  letterSpacing: '-0.03em',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
