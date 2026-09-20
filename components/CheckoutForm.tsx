'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PACKAGES, PackageType } from '@/lib/types';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  QrCode,
  CreditCard,
  MapPin,
  Loader2,
} from 'lucide-react';

export function CheckoutForm() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('software_only');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'manual_transfer'>('qris');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [storeName, setStoreName] = useState('');
  const [businessType, setBusinessType] = useState('Toko Kelontong / Sembako');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const pkg = PACKAGES[selectedPackage];
  const isPhysical = selectedPackage === 'bundling_printer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Mohon masukkan nama lengkap Anda.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 9) {
      setErrorMessage('Mohon masukkan nomor WhatsApp yang valid (contoh: 081234567890).');
      return;
    }
    if (isPhysical && !shippingAddress.trim()) {
      setErrorMessage('Mohon masukkan alamat lengkap pengiriman untuk printer fisik.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          storeName,
          businessType,
          packageType: selectedPackage,
          paymentMethod,
          shippingAddress: isPhysical ? shippingAddress : '',
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses pesanan.');
      }

      router.push(data.redirectUrl);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi gangguan jaringan.');
      setLoading(false);
    }
  };

  return (
    <section id="checkout" className="py-20 px-4 sm:px-6 bg-slate-100/70 border-b border-slate-200 scroll-mt-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pemesanan & Aktivasi Lisensi
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
            Lengkapi data toko Anda untuk penerbitan Serial Key resmi seumur hidup.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* STEP 1: Pilih Paket */}
          <div className="p-5 sm:p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm mb-3">1. Pilih Paket Lisensi</h3>
            <div className="space-y-3">
              {Object.values(PACKAGES).map((p) => {
                const isSelected = selectedPackage === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPackage(p.id)}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 mt-1 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm sm:text-base">{p.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5 mb-2">{p.description}</p>
                          <ul className="space-y-1">
                            {p.features.slice(0, 4).map((f, i) => (
                              <li key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-[11px] text-slate-400 line-through">
                          Rp {p.originalPrice.toLocaleString('id-ID')}
                        </p>
                        <p className="text-base sm:text-xl font-extrabold text-emerald-800">
                          Rp {p.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Data Pembeli */}
          <div className="p-5 sm:p-6 border-b border-slate-100 bg-[#fbfdfc]">
            <h3 className="font-bold text-slate-900 text-sm mb-3">2. Data Pembeli & Toko</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pemilik <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Budi Santoso"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-3456-7890"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Toko / Usaha</label>
                  <input
                    type="text"
                    placeholder="Toko Sembako Berkah"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>

              {isPhysical && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Alamat Pengiriman Printer <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Alamat jalan, kelurahan, kecamatan, kota, kode pos"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* STEP 3: Metode Bayar */}
          <div className="p-5 sm:p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm mb-3">3. Metode Pembayaran</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setPaymentMethod('qris')}
                className={`cursor-pointer rounded-xl p-3.5 border-2 flex items-center gap-3 transition-all ${
                  paymentMethod === 'qris'
                    ? 'border-emerald-600 bg-emerald-50/40'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">QRIS Instan</p>
                  <p className="text-[11px] text-slate-500">BCA, Mandiri, Dana, GoPay, dll</p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('manual_transfer')}
                className={`cursor-pointer rounded-xl p-3.5 border-2 flex items-center gap-3 transition-all ${
                  paymentMethod === 'manual_transfer'
                    ? 'border-emerald-600 bg-emerald-50/40'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">Transfer / WhatsApp</p>
                  <p className="text-[11px] text-slate-500">Konfirmasi via chat admin</p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: Total & CTA Button */}
          <div className="p-5 sm:p-6 bg-slate-900 text-white">
            {errorMessage && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 text-xs p-3 rounded-xl mb-4">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-between items-baseline mb-4">
              <div>
                <p className="text-xs text-slate-400">Total Tagihan (Sekali Bayar):</p>
                <p className="text-2xl font-black text-emerald-400">
                  Rp {pkg.price.toLocaleString('id-ID')}
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                PROMO BELI PUTUS
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>MEMPROSES...</span>
                </>
              ) : (
                <>
                  <span>AMBIL PROMO BELI PUTUS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-3 mt-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> Keamanan SSL 256-bit
              </span>
              <span>•</span>
              <span>Aktivasi Instan Tanpa Menunggu</span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
