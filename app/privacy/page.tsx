import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Lock, ShieldCheck, Database, FileText } from 'lucide-react';
import { ADMIN_CONTACTS } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | POS OFFLINE',
  description:
    'Kebijakan privasi perlindungan data pengguna dan jaminan keamanan data lokal 100% offline pada aplikasi POS OFFLINE.',
};

export default function PrivacyPage() {
  const filamsiContact = ADMIN_CONTACTS.find((c) => c.id === 'filamsi');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-soil)', color: 'var(--clr-cream)', paddingBottom: 80 }}>
      {/* Header Bar */}
      <header
        style={{
          borderBottom: '1px solid var(--clr-sage)',
          background: 'rgba(8, 9, 14, 0.85)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '16px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--clr-sand)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image src="/icon.png" alt="POS OFFLINE Logo" width={28} height={28} style={{ borderRadius: 6 }} />
            <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--clr-cream)' }}>POS OFFLINE</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 840, margin: '40px auto 0', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: 20,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--clr-leaf)',
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <Lock size={14} /> Privasi & Perlindungan Data
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 12, lineHeight: 1.3 }}>
            Kebijakan Privasi (Privacy Policy)
          </h1>
          <p style={{ color: 'var(--clr-sand)', fontSize: 14 }}>
            Terakhir diperbarui: 25 September 2026 • Komitmen perlindungan data pengguna POS OFFLINE
          </p>
        </div>

        <div
          style={{
            background: 'var(--clr-forest)',
            border: '1px solid var(--clr-sage)',
            borderRadius: 16,
            padding: 'clamp(24px, 4vw, 44px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
            lineHeight: 1.8,
            fontSize: 15,
            color: '#d1d5db',
          }}
        >
          {/* Section 1 */}
          <section style={{ background: 'rgba(34, 197, 94, 0.04)', padding: 20, borderRadius: 12, border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--clr-leaf)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Database size={20} /> Jaminan Privasi Data 100% Offline (Local-First Architecture)
            </h2>
            <p>
              Prinsip utama aplikasi <strong>POS OFFLINE</strong> adalah kedaulatan data di tangan pengguna. Kami tidak menggunakan model server cloud terpusat untuk menyimpan operasional toko Anda.
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><strong>Data Penjualan & Transaksi:</strong> 100% tersimpan secara lokal di database SQLite memori internal perangkat Android Anda.</li>
              <li><strong>Data Keuangan, Stok & Pelanggan:</strong> Tidak pernah disinkronkan atau dikirimkan ke server kami maupun server pihak ketiga manapun.</li>
              <li><strong>Tanpa Risiko Kebocoran Cloud:</strong> Karena beroperasi offline murni, data rahasia omzet dan margin laba toko Anda tidak dapat diintip oleh siapapun.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--clr-cream)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--clr-leaf)' }}>1.</span> Data yang Dikumpulkan Melalui Website
            </h2>
            <p>
              Ketika Anda melakukan pemesanan lisensi di website <code>posoffline.xyz</code>, kami mengumpulkan data dasar berikut yang diperlukan untuk pemenuhan pesanan:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><strong>Nama Lengkap & Nama Toko:</strong> Untuk identifikasi kepemilikan lisensi dan format sertifikat serial key.</li>
              <li><strong>Nomor WhatsApp:</strong> Untuk pengiriman notifikasi instan, bantuan aktivasi, dan pendampingan teknis.</li>
              <li><strong>Alamat Email:</strong> Untuk pengiriman link download file instalasi APK POS OFFLINE, invoice pembayaran, dan tutorial.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--clr-cream)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--clr-leaf)' }}>2.</span> Pemrosesan Pembayaran yang Aman
            </h2>
            <p>
              Kami menggunakan gerbang pembayaran resmi <strong>Midtrans</strong> (di bawah lisensi Bank Indonesia). Semua transmisi informasi finansial Anda diamankan menggunakan enkripsi 256-bit SSL/TLS berstandar industri. Kami tidak pernah melihat, mengakses, atau menyimpan informasi rahasia seperti nomor PIN perbankan, kartu, atau kredensial akun keuangan Anda.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--clr-cream)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--clr-leaf)' }}>3.</span> Penggunaan & Perlindungan Data Pribadi
            </h2>
            <p>
              Sesuai dengan <strong>Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022)</strong> Republik Indonesia:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Kami <strong>tidak akan pernah menjual, menyewakan, atau memperdagangkan</strong> data pribadi Anda kepada pihak mana pun untuk keperluan periklanan pihak ketiga.</li>
              <li>Data Anda hanya digunakan secara eksklusif untuk aktivasi software, bantuan teknis pasca-pembelian, dan komunikasi terkait produk POS OFFLINE.</li>
              <li>Pengguna memiliki hak penuh untuk meminta pemutakhiran atau penghapusan data kontak dari catatan sistem kami sewaktu-waktu.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--clr-cream)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--clr-leaf)' }}>4.</span> Hubungi Kami Terkait Privasi
            </h2>
            <p>
              Apabila Anda memiliki pertanyaan, keberatan, atau ingin mengajukan permohonan terkait data pribadi Anda, Anda dapat menghubungi Petugas Perlindungan Data kami melalui WhatsApp resmi di{' '}
              {filamsiContact?.waNumber ? (
                <a href={`https://wa.me/${filamsiContact.waNumber}`} style={{ color: 'var(--clr-leaf)', textDecoration: 'none', fontWeight: 600 }}>
                  +{filamsiContact.waNumber}
                </a>
              ) : (
                'dukungan WhatsApp resmi kami'
              )}{' '}
              atau melalui alamat operasional: Jl. Perintis Kemerdekaan No. 14, Tegal, Jawa Tengah 52121.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
