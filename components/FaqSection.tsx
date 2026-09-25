'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Apakah aplikasinya benar-benar tidak perlu internet sama sekali?',
    a: 'Ya, 100% offline. Setelah diinstall dan diaktivasi, aplikasi bekerja sepenuhnya di perangkat Anda tanpa koneksi internet. Data transaksi, produk, dan laporan tersimpan di HP Anda sendiri.',
  },
  {
    q: 'Berapa lama lisensi ini berlaku?',
    a: 'Seumur hidup. Anda bayar satu kali Rp 149.000 dan aplikasi aktif permanen di perangkat tersebut. Tidak ada perpanjangan, tidak ada biaya tambahan.',
  },
  {
    q: 'Bagaimana proses aktivasi setelah saya bayar?',
    a: 'Setelah pembayaran terkonfirmasi otomatis, link download APK langsung dikirim ke email Anda dan portal aktivasi instan akan terbuka. Cukup install APK di HP Android, buka aplikasi untuk menyalin Device ID unik, lalu tempelkan ke portal pesanan untuk menerbitkan Serial Key resmi Anda secara langsung dalam hitungan detik.',
  },
  {
    q: 'Apakah bisa diinstall di lebih dari satu HP?',
    a: 'Satu lisensi berlaku untuk satu perangkat (satu Device ID). Jika Anda membutuhkan lebih dari satu HP kasir, silakan hubungi kami untuk pembelian lisensi tambahan.',
  },
  {
    q: 'Printer apa saja yang kompatibel?',
    a: 'Kompatibel dengan 50+ merk printer thermal Bluetooth ukuran 58mm dan 80mm, termasuk Epson, Cashino, Gprinter, HPRT, RONGTA, Xprinter, dan lainnya. Cukup hubungkan via Bluetooth di HP Android Anda.',
  },
  {
    q: 'Apakah ada update aplikasi gratis?',
    a: 'Ya, pembaruan aplikasi gratis. Kami akan memberitahu file update terbaru via grup WhatsApp pengguna.',
  },
  {
    q: 'Berapa lama proses aktivasi setelah memasukkan Device ID?',
    a: 'Aktivasi berlangsung otomatis dalam hitungan detik melalui portal pesanan Anda. Tim admin WhatsApp kami juga siap membantu jika Anda memerlukan panduan setup tambahan.',
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="section section-light"
      style={{ background: 'var(--clr-paper)' }}
    >
      <div className="container" style={{ maxWidth: 760 }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 56px)' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>FAQ</div>
          <h2 className="heading-lg" style={{ color: '#111827', marginBottom: 12 }}>
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7 }}>
            Masih ada pertanyaan lain?{' '}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER ?? '6285853685622'}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}
            >
              Hubungi admin kami via WhatsApp
            </a>
            .
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  background: '#fff',
                  border: `1px solid ${isOpen ? '#86efac' : '#e5e7eb'}`,
                  borderRadius: 12,
                  overflow: 'hidden',
                  transition: 'border-color 0.15s',
                }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 16,
                    padding: '18px 20px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: isOpen ? '#15803d' : '#111827',
                      lineHeight: 1.5,
                    }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    style={{
                      color: '#9ca3af',
                      flexShrink: 0,
                      marginTop: 2,
                      transition: 'transform 0.2s',
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 20px 18px',
                      fontSize: 14,
                      color: '#4b5563',
                      lineHeight: 1.7,
                      borderTop: '1px solid #f3f4f6',
                      paddingTop: 14,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
