import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { ADMIN_CONTACTS } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan dan Kebijakan Pengembalian Dana | POS OFFLINE',
  description:
    'Syarat dan ketentuan pembelian lisensi software kasir POS OFFLINE serta kebijakan garansi dan pengembalian dana (refund policy) resmi.',
};

export default function TermsPage() {
  const ariyoContact = ADMIN_CONTACTS.find((c) => c.id === 'ariyo');
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
            <ShieldCheck size={14} /> Dokumen Legalitas & Kebijakan Konsumen
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 12, lineHeight: 1.3 }}>
            Syarat, Ketentuan & Kebijakan Pengembalian Dana
          </h1>
          <p style={{ color: 'var(--clr-sand)', fontSize: 14 }}>
            Terakhir diperbarui: 25 September 2026 • Berlaku efektif untuk seluruh transaksi di posoffline.xyz
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
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--clr-cream)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--clr-leaf)' }}>1.</span> Ketentuan Umum & Definisi
            </h2>
            <p>
              Selamat datang di <strong>POS OFFLINE</strong> (layanan resmi melalui domain <code>posoffline.xyz</code>). Dengan memesan, membeli, atau mengunduh aplikasi software kasir POS OFFLINE, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan ini.
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>POS OFFLINE</strong> adalah aplikasi software kasir (Point of Sale) untuk perangkat Android yang beroperasi 100% mandiri secara offline tanpa memerlukan koneksi internet, tanpa biaya sewa server bulanan, dan tanpa biaya langganan berulang.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--clr-cream)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--clr-leaf)' }}>2.</span> Lisensi & Hak Penggunaan
            </h2>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>
                <strong>Lisensi Seumur Hidup (Lifetime License):</strong> Pembelian aplikasi POS OFFLINE memberikan hak pakai lisensi permanen satu kali bayar (one-time payment) tanpa batas kedaluwarsa.
              </li>
              <li>
                <strong>1 Serial Key per Perangkat:</strong> Setiap serial lisensi yang diterbitkan berlaku untuk 1 (satu) perangkat Android atau 1 (satu) outlet toko pengguna.
              </li>
              <li>
                <strong>Bebas Biaya Tambahan:</strong> Tidak ada pungutan biaya langganan bulanan, biaya tahunan, maupun biaya per transaksi.
              </li>
              <li>
                <strong>Hak Update & Tutorial:</strong> Pengguna berhak memperoleh video tutorial panduan lengkap, template import data Excel, dan pembaruan aplikasi tanpa biaya tambahan.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--clr-cream)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--clr-leaf)' }}>3.</span> Pembayaran & Keamanan Transaksi
            </h2>
            <p>
              Seluruh transaksi pembayaran diproses secara otomatis dan aman menggunakan Payment Gateway berlisensi resmi Bank Indonesia (<strong>Midtrans</strong>). Metode pembayaran yang didukung meliputi:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><strong>QRIS Otomatis:</strong> Mendukung GoPay, ShopeePay, OVO, Dana, LinkAja, dan seluruh aplikasi m-Banking Indonesia (BCA, Mandiri, BRI, BNI, dll).</li>
              <li><strong>Virtual Account (Transfer Bank):</strong> BCA, Mandiri, BNI, BRI, Permata Bank dengan verifikasi otomatis detik itu juga.</li>
            </ul>
            <div
              style={{
                marginTop: 14,
                padding: '12px 16px',
                background: 'rgba(34, 197, 94, 0.08)',
                borderLeft: '4px solid var(--clr-leaf)',
                borderRadius: 6,
                fontSize: 14,
              }}
            >
              Halaman pembayaran disematkan langsung di dalam sistem kami (Midtrans Snap Modal). Anda tidak akan pernah diarahkan ke situs pihak ketiga yang tidak tepercaya.
            </div>
          </section>

          {/* Section 4 - REFUND POLICY (CRITICAL FOR MIDTRANS COMPLIANCE) */}
          <section style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 24, borderRadius: 12, border: '1px solid var(--clr-sage)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--clr-leaf)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={22} /> 4. Kebijakan Pengembalian Dana (Refund Policy) & Garansi
            </h2>
            <p>
              Kami berkomitmen penuh terhadap kepuasan pelanggan dan kualitas software kami. Kami menyediakan <strong>Garansi Uang Kembali 100%</strong> dengan ketentuan sebagai berikut:
            </p>
            <div style={{ marginTop: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--clr-cream)', marginBottom: 6 }}>
                A. Kriteria Pengembalian Dana yang Diterima (Eligible for Refund):
              </h3>
              <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>Aplikasi terbukti mengalami galat teknis (crash fatal) pada perangkat Android pengguna (Android versi 7.0 ke atas) dan tim bantuan teknis kami tidak mampu memberikan solusi atau perbaikan dalam waktu 7 (tujuh) hari kerja sejak laporan diterima.</li>
                <li>Terjadi kegagalan sistematis dalam penerbitan serial lisensi permanen setelah pembayaran berhasil dan tervalidasi.</li>
                <li>Terjadi duplikasi pembayaran akibat gangguan teknis perbankan (kelebihan potong saldo).</li>
              </ul>
            </div>

            <div style={{ marginTop: 18 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--clr-cream)', marginBottom: 6 }}>
                B. Kriteria yang Tidak Dapat Dikembalikan (Non-Refundable):
              </h3>
              <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>Kelalaian pengguna membeli produk untuk perangkat non-Android (misal: meminta diinstal di Apple iPhone/iPad atau MacOS, padahal spesifikasi telah tertulis tegas hanya untuk Android).</li>
                <li>Pengguna berubah pikiran setelah serial lisensi berhasil diaktivasi pada perangkat dan software berfungsi secara normal.</li>
                <li>Kerusakan hardware fisik perangkat milik pengguna yang bukan diakibatkan oleh software kami.</li>
              </ul>
            </div>

            <div style={{ marginTop: 18 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--clr-cream)', marginBottom: 6 }}>
                C. Tata Cara & Prosedur Klaim Refund:
              </h3>
              <p>
                Untuk mengajukan pengembalian dana, pembeli dapat menghubungi WhatsApp Dukungan Pelanggan kami atau melalui email dengan melampirkan:
              </p>
              <ol style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>Nomor Order (Order ID) transaksi di <code>posoffline.xyz</code>.</li>
                <li>Bukti pembayaran resmi dari bank/e-wallet.</li>
                <li>Tangkapan layar (screenshot) atau video singkat kendala teknis yang dialami.</li>
              </ol>
              <p style={{ marginTop: 8 }}>
                Tim kami akan melakukan verifikasi paling lambat dalam <strong>1x24 jam kerja</strong>. Dana yang disetujui untuk refund akan dikembalikan utuh ke rekening bank atau dompet digital asal pembeli dalam kurun waktu <strong>3 - 5 hari kerja</strong>.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--clr-cream)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--clr-leaf)' }}>5.</span> Dukungan Teknis & Layanan Purna Jual
            </h2>
            <p>
              Setiap pembelian lisensi POS OFFLINE berhak mendapatkan pendampingan teknis gratis, meliputi panduan koneksi printer kasir thermal Bluetooth (58mm/80mm), bantuan import produk via Excel, serta reset aktivasi jika terjadi penggantian perangkat (sesuai verifikasi kepemilikan). Layanan bantuan beroperasi setiap hari kerja pukul <strong>08.00 – 22.00 WIB</strong>.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--clr-cream)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--clr-leaf)' }}>6.</span> Kontak Resmi & Layanan Pelanggan
            </h2>
            <p>
              Jika Anda memiliki pertanyaan seputar syarat & ketentuan ini, konsultasi fitur, atau ingin mengajukan garansi, hubungi kontak resmi kami:
            </p>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <div>🏢 <strong>Entitas Usaha:</strong> POS OFFLINE (Athena Shield Technology)</div>
              <div>📍 <strong>Alamat Operasional:</strong> Jl. Perintis Kemerdekaan No. 14, Tegal, Jawa Tengah 52121</div>
              <div>
                💬 <strong>WhatsApp Dukungan Teknis:</strong>{' '}
                {filamsiContact?.waNumber ? (
                  <a href={`https://wa.me/${filamsiContact.waNumber}`} style={{ color: 'var(--clr-leaf)', textDecoration: 'none' }}>
                    +{filamsiContact.waNumber} ({filamsiContact.name})
                  </a>
                ) : (
                  <span>Hubungi admin melalui situs</span>
                )}
              </div>
              <div>
                💬 <strong>WhatsApp Konsultasi & Pembelian:</strong>{' '}
                {ariyoContact?.waNumber ? (
                  <a href={`https://wa.me/${ariyoContact.waNumber}`} style={{ color: 'var(--clr-leaf)', textDecoration: 'none' }}>
                    +{ariyoContact.waNumber} ({ariyoContact.name})
                  </a>
                ) : (
                  <span>Hubungi admin melalui situs</span>
                )}
              </div>
              <div>🌐 <strong>Website Resmi:</strong> https://posoffline.xyz</div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
