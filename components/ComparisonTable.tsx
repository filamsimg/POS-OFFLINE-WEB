const ROWS = [
  { label: 'Biaya Awal',             pos: 'Rp 149.000 sekali bayar',  rival: 'Rp 149.000/bulan', hiPos: true },
  { label: 'Biaya Bulan Ke-12',      pos: 'Rp 0 (gratis selamanya)',   rival: 'Rp 1.788.000 total', hiPos: true },
  { label: 'Bekerja Tanpa Internet', pos: 'Ya (100% Offline)',         rival: 'Tidak / Terbatas',   hiPos: true },
  { label: 'Cetak Struk Bluetooth',  pos: 'Ya (50+ Merk Printer)',     rival: 'Ya (beberapa)',       hiPos: false },
  { label: 'Scan Barcode',           pos: 'Ya (Kamera HP)',            rival: 'Ya',                 hiPos: false },
  { label: 'Laporan Laba Bersih',    pos: 'Ya (Harian, Mingguan, Bulanan)', rival: 'Terbatas',     hiPos: true },
  { label: 'Import Produk Excel',    pos: 'Ya (Template Disediakan)',  rival: 'Fitur Premium',      hiPos: true },
  { label: 'Fitur Sistem Meja/KOT',  pos: 'Ya (Restoran / Kafe)',      rival: 'Hanya Plan Mahal',   hiPos: true },
  { label: 'Perpanjangan Lisensi',   pos: 'Tidak perlu selamanya',      rival: 'Wajib tiap bulan',   hiPos: true },
  { label: 'Dukungan WhatsApp',      pos: 'Ya (Tim Admin Langsung)',   rival: 'Tiket Support',      hiPos: true },
];

export function ComparisonTable() {
  return (
    <section
      id="perbandingan"
      className="section"
      style={{ background: 'var(--clr-soil)' }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 60px)' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Perbandingan</div>
          <h2 className="heading-lg" style={{ marginBottom: 12 }}>
            POS OFFLINE vs Aplikasi Kasir SaaS Langganan
          </h2>
          <p style={{ fontSize: 15, color: 'var(--clr-sand)', maxWidth: '52ch', margin: '0 auto', lineHeight: 1.7 }}>
            Bayar sekali vs terus bayar tiap bulan, selisihnya jutaan rupiah dalam setahun.
          </p>
        </div>

        {/* Savings callout */}
        <div
          style={{
            background: 'rgba(61,186,120,0.08)',
            border: '1px solid rgba(61,186,120,0.25)',
            borderRadius: 12,
            padding: '16px 24px',
            textAlign: 'center',
            marginBottom: 20,
            fontSize: 15,
            color: 'var(--clr-cream)',
            fontWeight: 600,
          }}
        >
          💰 Dengan POS OFFLINE, Anda hemat{' '}
          <span style={{ color: 'var(--clr-leaf)', fontWeight: 800 }}>Rp 1.639.000</span>{' '}
          di tahun pertama dibanding aplikasi kasir SaaS berlangganan.
        </div>

        {/* Mobile Swipe Hint & Table Styles */}
        <style>{`
          .comp-table {
            width: 100%;
            min-width: 540px;
            border-collapse: collapse;
            font-size: 14px;
          }
          .comp-table tbody tr {
            transition: background-color 0.15s ease;
          }
          .comp-table tbody tr:hover {
            background: rgba(34, 197, 94, 0.08) !important;
          }
          .comp-pos-col {
            background: rgba(34, 197, 94, 0.03);
            border-left: 1px solid rgba(34, 197, 94, 0.15);
            border-right: 1px solid rgba(34, 197, 94, 0.15);
          }
        `}</style>
        <div className="mobile-table-hint">
          <span>👉 Geser ke kanan untuk melihat perbandingan</span>
        </div>

        {/* Table */}
        <div
          style={{
            overflowX: 'auto',
            borderRadius: 16,
            border: '1px solid var(--clr-sage)',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <table className="comp-table">
            <thead>
              <tr style={{ background: 'var(--clr-moss)', borderBottom: '2px solid var(--clr-sage)' }}>
                <th
                  style={{
                    padding: '14px 20px',
                    textAlign: 'left',
                    color: 'var(--clr-sand)',
                    fontWeight: 600,
                    fontSize: 12,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    width: '34%',
                  }}
                >
                  Fitur
                </th>
                <th
                  className="comp-pos-col"
                  style={{
                    padding: '14px 20px',
                    textAlign: 'center',
                    color: 'var(--clr-leaf)',
                    fontWeight: 800,
                    width: '33%',
                  }}
                >
                  POS OFFLINE
                </th>
                <th
                  style={{
                    padding: '14px 20px',
                    textAlign: 'center',
                    color: 'var(--clr-fog)',
                    fontWeight: 600,
                    width: '33%',
                  }}
                >
                  Kasir SaaS (Langganan)
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.label}
                  style={{
                    background: i % 2 === 0 ? 'var(--clr-soil)' : 'var(--clr-forest)',
                    borderBottom: i < ROWS.length - 1 ? '1px solid var(--clr-sage)' : 'none',
                  }}
                >
                  <td
                    style={{
                      padding: '13px 20px',
                      color: 'var(--clr-sand)',
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {row.label}
                  </td>
                  <td
                    className="comp-pos-col"
                    style={{
                      padding: '13px 20px',
                      textAlign: 'center',
                      color: row.hiPos ? 'var(--clr-leaf)' : 'var(--clr-cream)',
                      fontWeight: row.hiPos ? 700 : 500,
                      fontSize: 13,
                    }}
                  >
                    {row.hiPos && (
                      <span style={{ marginRight: 6 }}>✓</span>
                    )}
                    {row.pos}
                  </td>
                  <td
                    style={{
                      padding: '13px 20px',
                      textAlign: 'center',
                      color: 'var(--clr-fog)',
                      fontSize: 13,
                    }}
                  >
                    {row.rival}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <a href="#checkout" className="btn-primary btn-shimmer" style={{ fontSize: 16, padding: '15px 36px' }}>
            Mulai Hemat Sekarang (Rp 149.000)
          </a>
        </div>
      </div>
    </section>
  );
}
