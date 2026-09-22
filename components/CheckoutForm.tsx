'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PACKAGES, ADMIN_CONTACTS } from '@/lib/types';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  CreditCard,
  MessageCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

export function CheckoutForm() {
  const router = useRouter();
  const [selectedAdmin, setSelectedAdmin] = useState<'filamsi' | 'ariyo'>('filamsi');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [storeName, setStoreName] = useState('');
  const [businessType, setBusinessType] = useState('Toko Kelontong / Sembako');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const pkg = PACKAGES.software_only;

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
          packageType: 'software_only',
          paymentMethod: 'manual_transfer',
          targetAdmin: selectedAdmin,
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
            Pemesanan Lisensi Permanen
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
            Lengkapi data toko Anda untuk penerbitan Serial Key resmi aktif seumur hidup.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* STEP 1: Paket Lisensi Software (Single Focused Product) */}
          <div className="p-5 sm:p-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">1. Paket Lisensi Pilihan</h3>
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {pkg.badge}
              </span>
            </div>

            <div className="rounded-xl p-4 border-2 border-emerald-600 bg-emerald-50/40">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">{pkg.name}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{pkg.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-slate-400 line-through">
                    Rp {pkg.originalPrice.toLocaleString('id-ID')}
                  </p>
                  <p className="text-lg sm:text-2xl font-black text-emerald-800">
                    Rp {pkg.price.toLocaleString('id-ID')}
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium">Sekali Bayar</span>
                </div>
              </div>

              <div className="border-t border-emerald-200/60 pt-3">
                <p className="text-xs font-bold text-slate-800 mb-2">Fasilitas yang Anda Dapatkan:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* STEP 2: Data Pembeli & Toko */}
          <div className="p-5 sm:p-6 border-b border-slate-100 bg-[#fbfdfc]">
            <h3 className="font-bold text-slate-900 text-sm mb-3">2. Data Pemilik & Toko</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pemilik <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 bg-white"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Serial key dan link file APK akan dikirimkan ke nomor ini.</p>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Toko / Usaha</label>
                  <input
                    type="text"
                    placeholder="Contoh: Toko Sembako Berkah"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bidang Usaha</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 bg-white"
                >
                  <option value="Toko Kelontong / Sembako">Toko Kelontong / Sembako</option>
                  <option value="Kafe / Warung Makan / Resto">Kafe / Warung Makan / Resto</option>
                  <option value="Fashion / Pakaian / Butik">Fashion / Pakaian / Butik</option>
                  <option value="Bengkel / Cuci Motor">Bengkel / Cuci Motor</option>
                  <option value="Apotek / Toko Obat">Apotek / Toko Obat</option>
                  <option value="Toko Bangunan">Toko Bangunan</option>
                  <option value="Lainnya">Usaha Lainnya</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 3: Metode Pembayaran (Transfer Bank & Chat Admin WA) */}
          <div className="p-5 sm:p-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">3. Pembayaran via Transfer Bank</h3>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                Konfirmasi WhatsApp
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Pilih kontak Admin yang ingin Anda hubungi untuk konfirmasi transfer:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ADMIN_CONTACTS.map((admin) => {
                const isSelected = selectedAdmin === admin.id;
                return (
                  <div
                    key={admin.id}
                    onClick={() => setSelectedAdmin(admin.id)}
                    className={`cursor-pointer rounded-xl p-3.5 border-2 flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {admin.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900">
                          {admin.role} ({admin.name})
                        </p>
                        <p className="text-[11px] text-emerald-600 font-medium">Klik untuk Lanjut ke WhatsApp</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
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
                <p className="text-xs text-slate-400">Total Tagihan Lisensi (Sekali Bayar):</p>
                <p className="text-2xl font-black text-emerald-400">
                  Rp {pkg.price.toLocaleString('id-ID')}
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                LISENSI PERMANEN
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
                  <span>LANJUT KE KONFIRMASI TRANSFER</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-3 mt-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> Transaksi Aman & Terpercaya
              </span>
              <span>•</span>
              <span>Dipandu Langsung oleh Admin via WhatsApp</span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
