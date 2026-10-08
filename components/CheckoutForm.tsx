'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PACKAGES, ADMIN_CONTACTS } from '@/lib/types';
import { trackInitiateCheckout } from '@/lib/fpixel';
import { CheckCircle2, Lock, ArrowRight, Loader2, ShieldCheck, Mail, MessageCircle, Clock, X } from 'lucide-react';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

const loadSnapScript = (clientKeyFromApi?: string): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve();
    if (window.snap) return resolve();

    const clientKey =
      clientKeyFromApi?.trim() ||
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.trim() ||
      '';
    const isSandboxKey = clientKey.startsWith('SB-');
    const isExplicitProd = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
    const isProduction =
      !isSandboxKey && (isExplicitProd || process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION !== 'false');

    const scriptSrc = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';

    const existingScript = document.querySelector(`script[src*="snap.js"]`);
    if (existingScript) return resolve();

    const script = document.createElement('script');
    script.src = scriptSrc;
    if (clientKey) {
      script.setAttribute('data-client-key', clientKey);
    }
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });
};

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
    customerName:   '',
    customerPhone:  '',
    customerEmail:  '',
    storeName:      '',
    businessType:   BUSINESS_TYPES[0],
    notes:          '',
  });

  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [contactAdmin, setContactAdmin] = useState(false);
  const [pendingResumeOrder, setPendingResumeOrder] = useState<{
    id: string;
    name?: string;
    store?: string;
    time: number;
  } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pos_last_pending_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Date.now() - parsed.time < 24 * 60 * 60 * 1000) {
          setPendingResumeOrder(parsed);
        } else {
          localStorage.removeItem('pos_last_pending_order');
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setContactAdmin(false);

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

    // Fire Meta Pixel InitiateCheckout with accurate package price
    trackInitiateCheckout({
      content_name: `Lisensi Software POS OFFLINE (${pkg.name})`,
      value: pkg.price,
      currency: 'IDR',
    });

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.contactAdmin) {
          setContactAdmin(true);
        }
        throw new Error(data.error ?? 'Gagal memproses pesanan.');
      }

      // ── Solusi 1 & 2: Simpan Sesi & Direct Redirect ke Halaman Order ────────
      try {
        localStorage.setItem(
          'pos_last_pending_order',
          JSON.stringify({
            id: data.orderId,
            name: form.customerName,
            store: form.storeName,
            time: Date.now(),
          })
        );
      } catch {
        // ignore
      }

      // Langsung arahkan browser ke halaman order dengan flag auto-pay
      router.push(`/order/${data.orderId}?pay=true`);
      return;
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

        {/* Resume Active Pending Order Notification (Mobile-Friendly & High-Touch Target) */}
        {pendingResumeOrder && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.16), rgba(202, 138, 4, 0.08))',
              border: '1px solid rgba(234, 179, 8, 0.45)',
              borderRadius: 14,
              padding: 'clamp(14px, 3.5vw, 18px)',
              marginBottom: 24,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Top row: Icon + Order info + Dismiss button */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'rgba(234, 179, 8, 0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <Clock size={17} style={{ color: '#facc15' }} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#fef08a', lineHeight: 1.35 }}>
                    Tagihan Belum Dibayar (#{pendingResumeOrder.id.slice(0, 8).toUpperCase()})
                  </div>
                  <div style={{ fontSize: 12, color: '#fde047', marginTop: 3, lineHeight: 1.45 }}>
                    {pendingResumeOrder.store || pendingResumeOrder.name ? (
                      <strong style={{ color: '#fff' }}>{pendingResumeOrder.store || pendingResumeOrder.name} · </strong>
                    ) : null}
                    Selesaikan pembayaran untuk klaim Serial Key instan.
                  </div>
                </div>
              </div>

              {/* Close X Button (Touch-friendly) */}
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('pos_last_pending_order');
                  setPendingResumeOrder(null);
                }}
                title="Tutup pemberitahuan"
                aria-label="Tutup pemberitahuan"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 8,
                  color: '#cbd5e1',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  padding: 0,
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Single High-Converting Action: Lanjutkan Bayar */}
            <div style={{ marginTop: 10 }}>
              <button
                type="button"
                onClick={() => router.push(`/order/${pendingResumeOrder.id}?pay=true`)}
                style={{
                  width: '100%',
                  minHeight: 46,
                  background: 'linear-gradient(135deg, #facc15, #eab308)',
                  color: '#090a02',
                  fontWeight: 800,
                  fontSize: 13.5,
                  padding: '12px 20px',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px rgba(234, 179, 8, 0.35)',
                  fontFamily: 'inherit',
                  transition: 'transform 0.15s ease, filter 0.15s ease',
                }}
              >
                <span>Lanjutkan Pembayaran Sekarang</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

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

            {/* Notes */}
            <div className="field">
              <label htmlFor="notes">Catatan Tambahan (Opsional)</label>
              <textarea
                id="notes"
                rows={2}
                placeholder="Pertanyaan atau permintaan khusus..."
                value={form.notes}
                onChange={set('notes')}
              />
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
                lineHeight: 1.6,
              }}
            >
              <div>{error}</div>
              {contactAdmin && (
                <div style={{ marginTop: 12 }}>
                  <a
                    href={`https://wa.me/${(ADMIN_CONTACTS.find((c) => c.id === 'ariyo') ?? ADMIN_CONTACTS[0]).waNumber}?text=${encodeURIComponent(
                      `Halo Admin, saya ingin memesan Lisensi Software POS OFFLINE.\n` +
                      `Nama: ${form.customerName.trim() || '-'}\n` +
                      `WhatsApp: ${form.customerPhone.trim() || '-'}\n` +
                      `Email: ${form.customerEmail.trim() || '-'}\n` +
                      `Toko: ${form.storeName.trim() || '-'}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      background: '#16a34a',
                      color: '#ffffff',
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 12,
                      textDecoration: 'none',
                      boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
                    }}
                  >
                    <MessageCircle size={15} /> Hubungi WhatsApp Admin untuk Bantuan Pemesanan
                  </a>
                </div>
              )}
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
