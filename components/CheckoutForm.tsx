'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PACKAGES } from '@/lib/types';
import { CheckCircle2, Lock, ArrowRight, Loader2, ShieldCheck, Mail } from 'lucide-react';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const BUSINESS_TYPES = [
  'Toko Kelontong / Sembako',
  'Kafe / Warung Makan / Restoran',
  'Fashion / Pakaian / Butik',
  'Apotek / Toko Obat',
  'Toko Bangunan / Material',
  'Minimarket',
  'Bengkel / Cuci Motor',
  'Toko Elektronik',
  'Usaha Lainnya',
];

export function CheckoutForm() {
  const router  = useRouter();
  const pkg     = PACKAGES['software_only'];

  const [form, setForm] = useState({
    customerName:  '',
    customerPhone: '',
    customerEmail: '',
    storeName:     '',
    businessType:  BUSINESS_TYPES[0],
    notes:         '',
  });

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!form.customerName.trim()) {
      setError('Nama lengkap wajib diisi.');
      return;
    }
    if (!form.customerPhone.trim() || form.customerPhone.trim().length < 9) {
      setError('Nomor WhatsApp tidak valid.');
      return;
    }
    if (!form.customerEmail.trim() || !form.customerEmail.includes('@')) {
      setError('Alamat email wajib diisi karena link APK akan dikirim ke email ini setelah pembayaran.');
      return;
    }

    setLoading(true);

    // Fire Meta Pixel InitiateCheckout
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', { value: pkg.price / 1000, currency: 'IDR' });
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Gagal memproses pesanan.');
      }

      // Fire Meta Pixel Purchase (best effort before redirect)
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', { value: pkg.price / 1000, currency: 'IDR' });
      }

      router.push(data.redirectUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi gangguan jaringan.';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <section
      id="checkout"
      className="section"
      style={{ background: 'var(--clr-forest)', scrollMarginTop: 20 }}
    >
      <div className="container" style={{ maxWidth: 680 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Pemesanan</div>
          <h2 className="heading-lg" style={{ marginBottom: 12 }}>
            Dapatkan Lisensi Permanen Anda
          </h2>
          <p style={{ fontSize: 14, color: 'var(--clr-sand)', lineHeight: 1.7 }}>
            Isi data di bawah. Setelah pembayaran, link APK & panduan aktivasi dikirim otomatis ke email Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Package summary */}
          <div
            style={{
              background: 'var(--clr-moss)',
              border: '1px solid var(--clr-leaf)',
              borderRadius: 14,
              padding: 'clamp(16px, 4vw, 22px)',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 240px' }}>
                <div
                  style={{
                    display: 'inline-block',
                    background: 'rgba(61,186,120,0.12)',
                    border: '1px solid rgba(61,186,120,0.25)',
                    borderRadius: 6,
                    padding: '3px 10px',
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'var(--clr-mint)',
                    letterSpacing: '0.06em',
                    marginBottom: 8,
                  }}
                >
                  {pkg.badge}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--clr-cream)', marginBottom: 4 }}>
                  {pkg.name}
                </div>
                <div style={{ fontSize: 13, color: 'var(--clr-sand)', lineHeight: 1.5 }}>{pkg.description}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, alignSelf: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--clr-fog)', textDecoration: 'line-through' }}>
                  Rp {pkg.originalPrice.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--clr-leaf)', letterSpacing: '-0.03em' }}>
                  Rp {pkg.price.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--clr-fog)' }}>Sekali Bayar</div>
              </div>
            </div>

            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--clr-sage)' }}>
              <ul
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '6px 16px',
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                }}
              >
                {pkg.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      fontSize: 12,
                      color: 'var(--clr-sand)',
                    }}
                  >
                    <CheckCircle2 size={13} style={{ color: 'var(--clr-leaf)', marginTop: 2, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form fields */}
          <div
            style={{
              background: 'var(--clr-moss)',
              border: '1px solid var(--clr-sage)',
              borderRadius: 14,
              padding: 'clamp(16px, 4vw, 24px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--clr-cream)', marginBottom: 2 }}>
              Data Pemilik & Toko
            </div>

            {/* Name */}
            <div className="field">
              <label htmlFor="customerName">
                Nama Lengkap <span style={{ color: '#f87171' }}>*</span>
              </label>
              <input
                id="customerName"
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={form.customerName}
                onChange={set('customerName')}
              />
            </div>

            {/* Phone + Email */}
            <div className="form-grid-responsive">
              <div className="field">
                <label htmlFor="customerPhone">
                  Nomor WhatsApp <span style={{ color: '#f87171' }}>*</span>
                </label>
                <input
                  id="customerPhone"
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={form.customerPhone}
                  onChange={set('customerPhone')}
                />
              </div>
              <div className="field">
                <label htmlFor="customerEmail">
                  Alamat Email <span style={{ color: '#f87171' }}>*</span>
                </label>
                <input
                  id="customerEmail"
                  type="email"
                  required
                  placeholder="Contoh: budi@gmail.com"
                  value={form.customerEmail}
                  onChange={set('customerEmail')}
                />
                <span className="field-hint">Link APK dikirim ke email ini setelah bayar</span>
              </div>
            </div>

            {/* Store name + business type */}
            <div className="form-grid-responsive">
              <div className="field">
                <label htmlFor="storeName">Nama Toko / Usaha</label>
                <input
                  id="storeName"
                  type="text"
                  placeholder="Contoh: Toko Sembako Berkah"
                  value={form.storeName}
                  onChange={set('storeName')}
                />
              </div>
              <div className="field">
                <label htmlFor="businessType">Bidang Usaha</label>
                <select id="businessType" value={form.businessType} onChange={set('businessType')}>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 13,
                color: '#fca5a5',
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <div
            style={{
              background: 'var(--clr-soil)',
              border: '1px solid var(--clr-sage)',
              borderRadius: 14,
              padding: 'clamp(16px, 4vw, 22px)',
            }}
          >
            {/* Payment methods support banner */}
            <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--clr-sand)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Metode Pembayaran Instan Didukung:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['QRIS (Semua E-Wallet/Bank)', 'BCA', 'Mandiri', 'BRI', 'BNI', 'GoPay', 'OVO', 'ShopeePay', 'Dana'].map((channel) => (
                  <span
                    key={channel}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--clr-sage)',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--clr-cream)',
                    }}
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingTop: 14, borderTop: '1px solid var(--clr-sage)' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--clr-fog)' }}>Total Pembayaran</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--clr-leaf)', letterSpacing: '-0.03em' }}>
                  Rp {pkg.price.toLocaleString('id-ID')}
                </div>
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--clr-mint)',
                  background: 'rgba(61,186,120,0.1)',
                  border: '1px solid rgba(61,186,120,0.2)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  letterSpacing: '0.06em',
                }}
              >
                LISENSI PERMANEN
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', fontSize: 16, padding: '15px 24px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} />
                  Memproses...
                </>
              ) : (
                <>
              Lanjut ke Pembayaran
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '6px 18px',
                marginTop: 14,
                fontSize: 11,
                color: 'var(--clr-fog)',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Lock size={11} style={{ color: 'var(--clr-leaf)' }} />
                Pembayaran 100% Aman
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Mail size={11} style={{ color: 'var(--clr-leaf)' }} />
                Konfirmasi Otomatis ke Email
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={11} style={{ color: 'var(--clr-leaf)' }} />
                Garansi Lisensi Permanen
              </span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
