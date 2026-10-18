'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PACKAGES, ADMIN_CONTACTS } from '@/lib/types';
import { trackInitiateCheckout } from '@/lib/fpixel';

const BUSINESS_PRESETS = [
  { id: 'Warung & Sembako', label: 'Warung & Sembako' },
  { id: 'Kafe & Resto', label: 'Kafe & Resto' },
  { id: 'Fashion & Butik', label: 'Fashion & Butik' },
  { id: 'Apotek & Obat', label: 'Apotek & Obat' },
  { id: 'Bengkel & Jasa', label: 'Bengkel & Jasa' },
  { id: 'Usaha Lainnya', label: 'Usaha Lainnya' },
];

const PAYMENT_OPTIONS = [
  {
    id: 'qris',
    name: 'QRIS Instan',
    desc: 'GoPay, OVO, Dana, ShopeePay & Semua m-Banking',
    tag: 'Terpopuler',
  },
  {
    id: 'bca',
    name: 'BCA Virtual Account',
    desc: 'BCA Mobile, myBCA, KlikBCA & ATM BCA',
    tag: 'Otomatis 24 Jam',
  },
  {
    id: 'mandiri',
    name: 'Mandiri Bill / VA',
    desc: 'Livin by Mandiri & ATM Mandiri',
    tag: 'Otomatis 24 Jam',
  },
  {
    id: 'bri',
    name: 'BRI Virtual Account',
    desc: 'BRImo & ATM Bank BRI',
    tag: 'Otomatis 24 Jam',
  },
  {
    id: 'bni',
    name: 'BNI Virtual Account',
    desc: 'BNI Mobile Banking & ATM BNI',
    tag: 'Otomatis 24 Jam',
  },
  {
    id: 'manual',
    name: 'Transfer Bank Manual',
    desc: 'Transfer Rekening & Konfirmasi WhatsApp',
    tag: 'Alternatif',
  },
];

export function CheckoutForm() {
  const router = useRouter();
  const pkg = PACKAGES['software_only'];

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    storeName: '',
    businessType: BUSINESS_PRESETS[0].id,
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca' | 'mandiri' | 'bri' | 'bni' | 'manual'>('qris');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
        body: JSON.stringify({ ...form, paymentMethod }),
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

  return (
    <section id="checkout" className="bg-[#F3F4F6] rounded-[28px] p-4 sm:p-8 md:p-10 mb-12 border border-zinc-200/60 shadow-sm">
      
      {/* 1. Step Expectation Banner (Eliminates Post-Payment Anxiety) */}
      <div className="mb-8 pb-7 border-b border-zinc-200">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-2 font-semibold">
          TRANSPARAN & TANPA RIBET
        </span>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#141414] mb-5 leading-snug">
          Apa yang Terjadi Setelah Anda Klik Bayar?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="bg-white rounded-2xl p-4 border border-zinc-200 flex items-start gap-3 shadow-xs">
            <span className="w-7 h-7 rounded-full bg-[#C8F53B] text-[#141414] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <div className="font-bold text-sm text-[#141414]">Isi Data & Bayar Instan</div>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Mendukung QRIS (GoPay, OVO, Dana, ShopeePay, m-Banking) serta Virtual Account BCA, Mandiri, BRI, BNI.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-zinc-200 flex items-start gap-3 shadow-xs">
            <span className="w-7 h-7 rounded-full bg-[#C8F53B] text-[#141414] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <div className="font-bold text-sm text-[#141414]">Link APK & Serial Key Masuk</div>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Kurang dari 1 menit setelah verifikasi, file installer resmi dan kode lisensi permanen dikirim ke Email & WA Anda.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-zinc-200 flex items-start gap-3 shadow-xs">
            <span className="w-7 h-7 rounded-full bg-[#C8F53B] text-[#141414] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <div className="font-bold text-sm text-[#141414]">Aktif Selamanya di Toko</div>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Masukkan kode aktivasi 1 kali, dan aplikasi kasir Anda langsung aktif seumur hidup tanpa biaya langganan bulanan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Pending Order Notification if exists */}
      {pendingResumeOrder && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-amber-900">
          <div>
            <strong>Lanjutkan Pesanan Sebelumnya:</strong> Ada pesanan aktif atas nama{' '}
            <strong>{pendingResumeOrder.name || 'Anda'}</strong>.
          </div>
          <button
            type="button"
            onClick={() => router.push(`/order/${pendingResumeOrder.id}?pay=true`)}
            className="px-4 py-2 bg-[#141414] text-[#C8F53B] rounded-xl font-bold text-xs hover:bg-zinc-800 transition"
          >
            Lanjut Bayar Pesanan Ini →
          </button>
        </div>
      )}

      {/* 2. Main Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: What You Get Summary Card */}
        <div className="lg:col-span-5 bg-[#141414] text-white rounded-[24px] p-5 sm:p-7 border border-white/10 shadow-md">
          <div className="inline-block bg-[#C8F53B] text-[#141414] text-xs font-mono font-bold px-3 py-1 rounded-full mb-4">
            DISKON 54% • LISENSI PERMANEN
          </div>
          <h3 className="font-display font-bold text-2xl mb-1 leading-snug">
            Paket Lengkap POS OFFLINE
          </h3>
          <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
            Satu kali pembayaran untuk ketenangan usaha bertahun-tahun.
          </p>

          <div className="flex items-baseline gap-3 pb-5 mb-5 border-b border-white/10">
            <span className="font-mono font-bold text-3xl sm:text-4xl text-[#C8F53B]">
              Rp {pkg.price.toLocaleString('id-ID')}
            </span>
            <span className="font-mono text-sm text-zinc-500 line-through">
              Rp {pkg.originalPrice.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-zinc-300">/ Sekali Bayar</span>
          </div>

          <ul className="space-y-3 text-xs sm:text-[13px] text-zinc-200 mb-6">
            <li className="flex items-center gap-2.5">
              <span className="text-[#C8F53B] font-bold">✓</span> File APK POS OFFLINE Full Version Resmi
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-[#C8F53B] font-bold">✓</span> 1x Serial Key Lisensi Permanen (Tidak Kedaluwarsa)
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-[#C8F53B] font-bold">✓</span> Fitur Multi-Currency, Catat Pengeluaran &amp; Bahan Baku
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-[#C8F53B] font-bold">✓</span> Peringatan Expired Date & Database Membership
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-[#C8F53B] font-bold">✓</span> 11 Video Tutorial Panduan Lengkap
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-[#C8F53B] font-bold">✓</span> Template Excel Import Ratusan Produk Seketika
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-[#C8F53B] font-bold">✓</span> Dukungan Teknis Langsung via WhatsApp Resmi
            </li>
          </ul>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 leading-relaxed">
            🔒 <strong>Garansi Lisensi Resmi:</strong> Jika ganti HP baru di kemudian hari, tim kami siap membantu pemindahan lisensi permanen Anda secara gratis.
          </div>
        </div>

        {/* Right Column: Progressive Touch-Friendly Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white rounded-[24px] p-5 sm:p-8 border border-zinc-200 shadow-sm"
        >
          <h3 className="font-display font-bold text-xl text-[#141414] mb-1">
            Data Penerima Lisensi & Toko
          </h3>
          <p className="text-xs text-zinc-500 mb-6">
            Pastikan data di bawah terisi benar agar pengiriman file installer APK & Serial Key otomatis berjalan lancar.
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
                Digunakan untuk kirim panduan & bantuan aktivasi.
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
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
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
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-[#141414]">
                Pilih Metode Pembayaran:
              </label>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Otomatis &amp; Terverifikasi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PAYMENT_OPTIONS.map((opt) => {
                const isSelected = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id as any)}
                    className={`p-3.5 rounded-xl text-left border transition relative flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-[#141414] bg-[#141414] text-white shadow-sm ring-1 ring-[#C8F53B]'
                        : 'border-zinc-200 bg-[#F9FAFB] hover:bg-zinc-100 text-zinc-900'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center ${
                        isSelected
                          ? 'border-[#C8F53B] bg-[#C8F53B]'
                          : 'border-zinc-400 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#141414]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs truncate">
                          {opt.name}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ${
                            isSelected
                              ? 'bg-[#C8F53B] text-[#141414]'
                              : 'bg-zinc-200 text-zinc-700'
                          }`}
                        >
                          {opt.tag}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] mt-0.5 leading-snug line-clamp-1 ${
                          isSelected ? 'text-zinc-300' : 'text-zinc-500'
                        }`}
                      >
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic guidance note below selection */}
            <div className="mt-2.5 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 leading-relaxed">
              {paymentMethod === 'qris' && (
                <span>Kode QRIS resmi akan langsung muncul setelah Anda klik tombol bayar. Bisa di-scan dari GoPay, OVO, Dana, ShopeePay, atau m-Banking apapun.</span>
              )}
              {paymentMethod === 'bca' && (
                <span>Nomor Virtual Account BCA resmi akan langsung terbit untuk Anda salin ke m-BCA, myBCA, atau KlikBCA.</span>
              )}
              {paymentMethod === 'mandiri' && (
                <span>Nomor Mandiri Bill / Virtual Account resmi langsung terbit untuk pembayaran via aplikasi Livin by Mandiri.</span>
              )}
              {paymentMethod === 'bri' && (
                <span>Nomor BRI Virtual Account (BRIVA) resmi langsung terbit untuk pembayaran via aplikasi BRImo.</span>
              )}
              {paymentMethod === 'bni' && (
                <span>Nomor BNI Virtual Account resmi langsung terbit untuk pembayaran via BNI Mobile Banking.</span>
              )}
              {paymentMethod === 'manual' && (
                <span>Anda akan diarahkan ke petunjuk rekening resmi dan dapat langsung konfirmasi bukti transfer via WhatsApp ke Tim Pembelian.</span>
              )}
            </div>
          </div>

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
