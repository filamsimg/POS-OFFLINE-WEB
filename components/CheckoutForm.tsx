'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PACKAGES, PackageType } from '@/lib/types';
import {
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  QrCode,
  CreditCard,
  Building2,
  Smartphone,
  MapPin,
  Sparkles,
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
      setErrorMessage('Mohon masukkan alamat lengkap pengiriman untuk pengiriman printer fisik.');
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

      // Redirect to order confirmation page
      router.push(data.redirectUrl);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan jaringan.');
      setLoading(false);
    }
  };

  return (
    <section id="checkout" className="py-20 px-4 sm:px-6 bg-slate-100 scroll-mt-12">
      <div className="max-w-3xl mx-auto">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-emerald-800 uppercase bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
            Form Pemesanan Instan
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-2 tracking-tight">
            Ambil Promo Beli Putus Hari Ini
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Isi formulir di bawah untuk mendapatkan link download aplikasi dan kode lisensi resmi seumur hidup.
          </p>
        </div>

        {/* Scalev Card Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
        >
          {/* STEP 1: Pilih Paket */}
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                1
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  Pilih Paket yang Anda Butuhkan
                </h3>
                <p className="text-xs text-slate-500">Pilih paket sesuai kebutuhan perangkat toko Anda</p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.values(PACKAGES).map((p) => {
                const isSelected = selectedPackage === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPackage(p.id)}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                        : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-3 right-6 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Paling Laris
                      </span>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-base sm:text-lg">{p.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5 mb-3">{p.description}</p>

                          <ul className="space-y-1.5">
                            {p.features.map((f, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-400 line-through">
                          Rp {p.originalPrice.toLocaleString('id-ID')}
                        </p>
                        <p className="text-lg sm:text-2xl font-black text-emerald-800">
                          Rp {p.price.toLocaleString('id-ID')}
                        </p>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                          Sekali Bayar
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Data Pembeli */}
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                2
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  Informasi Pembeli & Toko
                </h3>
                <p className="text-xs text-slate-500">Kunci lisensi resmi akan dikaitkan dengan data toko Anda</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Nama Lengkap Pemilik <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Nama Toko / Usaha
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Toko Berkah Jaya"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Jenis Usaha
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option>Toko Kelontong / Sembako</option>
                  <option>Kafe / Warkop / Minuman</option>
                  <option>Warung / Rumah Makan</option>
                  <option>Toko Baju / Fashion / Sepatu</option>
                  <option>Barbershop / Salon / Jasa</option>
                  <option>Konter Pulsa / Aksesoris</option>
                  <option>Lainnya</option>
                </select>
              </div>

              {isPhysical && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Alamat Lengkap Pengiriman Printer Fisik <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Masukkan jalan, no rumah, RT/RW, kelurahan, kecamatan, kota, & kode pos"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* STEP 3: Metode Pembayaran */}
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                3
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  Metode Pembayaran
                </h3>
                <p className="text-xs text-slate-500">Pilih metode pembayaran yang paling nyaman untuk Anda</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod('qris')}
                className={`cursor-pointer rounded-2xl p-4 border-2 flex items-center gap-3.5 transition-all ${
                  paymentMethod === 'qris'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">QRIS Instan (Rekomendasi)</p>
                  <p className="text-xs text-slate-500">BCA, Mandiri, BRI, BNI, Dana, GoPay, OVO, ShopeePay</p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('manual_transfer')}
                className={`cursor-pointer rounded-2xl p-4 border-2 flex items-center gap-3.5 transition-all ${
                  paymentMethod === 'manual_transfer'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">Transfer Bank / WhatsApp</p>
                  <p className="text-xs text-slate-500">Konfirmasi bukti bayar langsung dengan admin kami</p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: Ringkasan & Tombol Beli */}
          <div className="p-6 sm:p-8 bg-slate-900 text-white">
            {errorMessage && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 text-xs sm:text-sm p-3.5 rounded-xl mb-5">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2 mb-6 text-xs sm:text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Paket:</span>
                <span className="font-semibold text-white">{pkg.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Harga Normal:</span>
                <span className="line-through text-slate-500">Rp {pkg.originalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Diskon Promo Beli Putus (60%):</span>
                <span>- Rp {(pkg.originalPrice - pkg.price).toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                <span className="text-base sm:text-lg font-bold text-white">Total Tagihan:</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                  Rp {pkg.price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>MEMPROSES PESANAN...</span>
                </>
              ) : (
                <>
                  <span>PROSES PEMESANAN SEKARANG</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 mt-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Transaksi Terenkripsi 256-bit
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Garansi Aktif Selamanya
              </span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
