'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PACKAGES, ADMIN_CONTACTS } from '@/lib/types';
import { trackInitiateCheckout } from '@/lib/fpixel';
import {
  BUSINESS_PRESETS,
  DEFAULT_PAYMENT_OPTIONS,
  PaymentOptionDef,
  PendingResumeOrder,
  CheckoutFormValues,
} from './types';
import { CheckoutStepBanner } from './CheckoutStepBanner';
import { CheckoutPendingResume } from './CheckoutPendingResume';
import { CheckoutSummaryCard } from './CheckoutSummaryCard';
import { PaymentMethodSelector } from './PaymentMethodSelector';

export function CheckoutForm() {
  const router = useRouter();
  const pkg = PACKAGES['software_only'];

  const [form, setForm] = useState<CheckoutFormValues>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    storeName: '',
    businessType: BUSINESS_PRESETS[0].id,
    notes: '',
  });

  const [paymentOptions, setPaymentOptions] = useState<PaymentOptionDef[]>(DEFAULT_PAYMENT_OPTIONS);
  const [paymentMethod, setPaymentMethod] = useState<string>('gopay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contactAdmin, setContactAdmin] = useState(false);
  const [forceNewOrder, setForceNewOrder] = useState(false);
  const [pendingResumeOrder, setPendingResumeOrder] = useState<PendingResumeOrder | null>(null);

  // Restore pending order from local storage if within 24h
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

  // Fetch live active channels from Midtrans API dynamically
  useEffect(() => {
    let isMounted = true;
    fetch('/api/payment-methods')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data?.success || !Array.isArray(data.options) || data.options.length === 0) {
          return;
        }
        setPaymentOptions(data.options);
        setPaymentMethod((curr) => {
          const exists = data.options.some((opt: PaymentOptionDef) => opt.id === curr);
          if (exists) return curr;
          const popular = data.options.find((opt: PaymentOptionDef) => opt.isPopular);
          return popular ? popular.id : data.options[0].id;
        });
      })
      .catch((err) => {
        console.warn('[Checkout] Using fallback payment options:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filamsi = ADMIN_CONTACTS.find((c) => c.id === 'filamsi') || ADMIN_CONTACTS[1];
  const ariyo = ADMIN_CONTACTS.find((c) => c.id === 'ariyo') || ADMIN_CONTACTS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setContactAdmin(false);

    if (!form.customerName.trim()) {
      setError('Nama lengkap wajib diisi.');
      return;
    }
    if (!form.customerPhone.trim() || form.customerPhone.trim().length < 9) {
      setError('Nomor WhatsApp tidak valid. Masukkan nomor aktif Anda.');
      return;
    }
    if (!form.customerEmail.trim() || !form.customerEmail.includes('@')) {
      setError('Alamat email wajib diisi karena link installer APK resmi akan dikirim otomatis ke email ini.');
      return;
    }

    setLoading(true);

    trackInitiateCheckout({
      content_name: `Lisensi Software POS OFFLINE (${pkg.name})`,
      value: pkg.price,
      currency: 'IDR',
    });

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, paymentMethod, forceNew: forceNewOrder }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.contactAdmin) {
          setContactAdmin(true);
        }
        throw new Error(data.error ?? 'Gagal memproses pesanan.');
      }

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

      if (data.manualTransfer) {
        router.push(`/order/${data.orderId}`);
      } else {
        router.push(`/order/${data.orderId}?pay=true`);
      }
      return;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi gangguan jaringan.';
      setError(msg);
      setLoading(false);
    }
  };

  const handleResumeOrder = (orderId: string) => {
    router.push(`/order/${orderId}?pay=true`);
  };

  const handleDismissPending = () => {
    try {
      localStorage.removeItem('pos_last_pending_order');
    } catch {
      // ignore
    }
    setPendingResumeOrder(null);
    setForceNewOrder(true);
  };

  return (
    <section id="checkout" className="bg-[#F3F4F6] rounded-[28px] p-4 sm:p-8 md:p-10 mb-12 border border-zinc-200/60 shadow-sm">
      {/* 1. Step Expectation Banner */}
      <CheckoutStepBanner />

      {/* 2. Resume Pending Order Notification if exists */}
      {pendingResumeOrder && (
        <CheckoutPendingResume
          order={pendingResumeOrder}
          onResume={handleResumeOrder}
          onDismiss={handleDismissPending}
        />
      )}

      {/* 3. Main Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: What You Get Summary Card */}
        <CheckoutSummaryCard />

        {/* Right Column: Progressive Touch-Friendly Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white rounded-[24px] p-5 sm:p-8 border border-zinc-200 shadow-sm"
        >
          <h3 className="font-display font-bold text-xl text-[#141414] mb-1">
            Data Penerima Lisensi &amp; Toko
          </h3>
          <p className="text-xs text-zinc-500 mb-6">
            Pastikan data di bawah terisi benar agar pengiriman file installer APK &amp; Serial Key otomatis berjalan lancar.
          </p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
              ⚠️ {error}
              {contactAdmin && (
                <div className="mt-2">
                  <a
                    href={`https://wa.me/${filamsi?.waNumber || ariyo?.waNumber}?text=${encodeURIComponent(
                      'Halo Admin, saya mengalami kendala saat checkout di posoffline.xyz.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold text-emerald-800"
                  >
                    Hubungi Admin via WhatsApp Sekarang →
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-[#141414] mb-1.5">
                Nama Lengkap Pemilik *
              </label>
              <input
                required
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] border border-zinc-200 text-sm focus:outline-none focus:border-[#141414] focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#141414] mb-1.5">
                Nomor WhatsApp Aktif *
              </label>
              <input
                required
                type="tel"
                placeholder="Contoh: 081234567890"
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] border border-zinc-200 text-sm font-mono focus:outline-none focus:border-[#141414] focus:bg-white transition"
              />
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Digunakan untuk kirim panduan &amp; bantuan aktivasi.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-bold text-[#141414] mb-1.5">
                Alamat Email Aktif *
              </label>
              <input
                required
                type="email"
                placeholder="nama@email.com"
                value={form.customerEmail}
                onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] border border-zinc-200 text-sm focus:outline-none focus:border-[#141414] focus:bg-white transition"
              />
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Link download APK resmi otomatis dikirim ke sini.
              </span>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#141414] mb-1.5">
                Nama Toko / Usaha
              </label>
              <input
                type="text"
                placeholder="Contoh: Toko Berkah Jaya"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] border border-zinc-200 text-sm focus:outline-none focus:border-[#141414] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Touch-Friendly Business Type Pill Chips */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-[#141414] mb-2">
              Pilih Bidang Usaha Anda (1 Klik):
            </label>
            <div className="flex flex-wrap gap-2">
              {BUSINESS_PRESETS.map((biz) => {
                const isSelected = form.businessType === biz.id;
                return (
                  <button
                    key={biz.id}
                    type="button"
                    onClick={() => setForm({ ...form, businessType: biz.id })}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#141414] text-[#C8F53B]'
                        : 'bg-[#F3F4F6] text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
                    }`}
                  >
                    {biz.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Payment Method Selector */}
          <PaymentMethodSelector
            paymentOptions={paymentOptions}
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-[#C8F53B] hover:bg-[#BCEB28] text-[#141414] font-display font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-md transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Memproses Pesanan...</span>
            ) : (
              <>
                <span>Lanjut ke Pembayaran Resmi (Rp {pkg.price.toLocaleString('id-ID')})</span>
                <span className="w-7 h-7 rounded-full bg-[#141414] text-[#C8F53B] inline-flex items-center justify-center text-sm font-mono">
                  →
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
