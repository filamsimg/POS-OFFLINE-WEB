'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  Copy,
  Download,
  Smartphone,
  Key,
  ShieldCheck,
  QrCode,
  CreditCard,
  MessageCircle,
  Clock,
  Sparkles,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Order, PACKAGES, ADMIN_CONTACTS } from '@/lib/types';

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [deviceIdInput, setDeviceIdInput] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [claimError, setClaimError] = useState('');

  // Fetch or mock order load
  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/checkout?orderId=${orderId}`);
        // If not found in API yet, use stored state from sessionStorage or fallback
        const saved = sessionStorage.getItem(`order_${orderId}`);
        if (saved) {
          setOrder(JSON.parse(saved));
        } else {
          // Default placeholder order for presentation
          setOrder({
            id: orderId,
            customerName: 'Pelanggan POS OFFLINE',
            customerPhone: '628123456789',
            storeName: 'Toko Anda',
            packageType: 'software_only',
            amount: 149000,
            paymentMethod: 'manual_transfer',
            paymentStatus: 'pending',
            createdAt: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const handleClaimLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimError('');
    if (!deviceIdInput.trim()) {
      setClaimError('Mohon masukkan Device ID dari aplikasi Anda.');
      return;
    }

    setClaimLoading(true);

    try {
      const res = await fetch('/api/claim-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          deviceId: deviceIdInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses klaim lisensi.');
      }

      setGeneratedKey(data.serialKey);
      setClaimSuccess(true);
    } catch (err: any) {
      setClaimError(err?.message || 'Gagal memproses Device ID.');
    } finally {
      setClaimLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const pkg = order ? PACKAGES[order.packageType] : PACKAGES.software_only;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 text-slate-800">
      <div className="max-w-2xl mx-auto">
        {/* Top Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 font-black text-xl text-slate-900 mb-4">
            <Image
              src="/icon.png"
              alt="POS OFFLINE Logo"
              width={32}
              height={32}
              className="rounded-lg shadow-sm"
            />
            <span>POS OFFLINE</span>
          </Link>
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pesanan Berhasil Dibuat!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Nomor Pesanan: <strong className="font-mono text-emerald-800">{orderId}</strong>
          </p>
        </div>

        {/* Invoice Summary Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Rincian Pembelian</span>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
              {claimSuccess ? 'SELESAI / AKTIF' : 'MENUNGGU AKTIVASI'}
            </span>
          </h2>

          <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Paket Dipilih:</span>
              <span className="font-bold text-slate-900">{pkg.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Nama Pembeli:</span>
              <span className="font-semibold text-slate-900">{order?.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>WhatsApp:</span>
              <span className="font-mono text-slate-900">{order?.customerPhone}</span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-sm">Total Tagihan:</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-800">
                Rp {pkg.price.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Confirmation via WhatsApp */}
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Konfirmasi Transfer via WhatsApp</h3>
              <p className="text-xs text-slate-500">Kirim bukti transfer ke salah satu admin kami:</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {ADMIN_CONTACTS.map((admin) => {
              const waText = encodeURIComponent(
                `Halo ${admin.name} (Admin POS OFFLINE), saya mau konfirmasi pembayaran lisensi aplikasi kasir.\n\n` +
                `Nomor Pesanan: ${orderId}\n` +
                `Nama Pembeli: ${order?.customerName || '-'}\n` +
                `Nama Toko: ${order?.storeName || '-'}\n` +
                `Nominal: Rp ${pkg.price.toLocaleString('id-ID')}\n\n` +
                `Berikut saya lampirkan bukti transfer. Mohon diverifikasi.`
              );
              return (
                <a
                  key={admin.id}
                  href={`https://wa.me/${admin.waNumber}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/70 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {admin.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900 group-hover:text-emerald-900">
                        {admin.role} ({admin.name})
                      </p>
                      <p className="text-[11px] text-emerald-700 font-medium">Klik untuk Kirim Bukti Transfer &rarr;</p>
                    </div>
                  </div>
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                </a>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            Setelah transfer terverifikasi atau jika sudah memiliki Device ID, Anda dapat langsung memasukkan kodenya di bawah ini.
          </p>
        </div>

        {/* Claim License Box (The Magic Flow) */}
        <div className="bg-white rounded-3xl border-2 border-emerald-500/40 shadow-lg p-6 sm:p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Generator Otomatis
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg sm:text-xl">
                {claimSuccess ? 'Serial Key Resmi Anda' : 'Klaim Serial Key Lisensi Anda'}
              </h3>
              <p className="text-xs text-slate-500">
                {claimSuccess
                  ? 'Gunakan kunci ini untuk mengaktifkan aplikasi secara permanen'
                  : 'Masukkan Device ID yang muncul di layar aplikasi HP Anda'}
              </p>
            </div>
          </div>

          {claimSuccess ? (
            /* Result Box */
            <div className="mt-4 space-y-4">
              <div className="bg-slate-900 text-white rounded-2xl p-5 text-center">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block mb-2">
                  SERIAL KEY RESMI (SEUMUR HIDUP):
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-black text-emerald-300 tracking-wider select-all py-2">
                  {generatedKey}
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(generatedKey)}
                  className="mt-2 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey ? 'BERHASIL DISALIN!' : 'SALIN SERIAL KEY'}</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 space-y-2">
                <p className="font-bold flex items-center gap-1.5 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Cara Mengaktifkan di HP:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1 leading-relaxed">
                  <li>Download dan buka file APK <strong>POS OFFLINE</strong> di smartphone Anda.</li>
                  <li>Tempelkan (*paste*) 16 digit Serial Key di atas ke kolom yang tersedia.</li>
                  <li>Klik tombol hijau <strong>"Aktivasi Sekarang"</strong>.</li>
                  <li>Aplikasi Anda langsung aktif permanen seumur hidup! 🎉</li>
                </ol>
              </div>

              {/* Download APK Button */}
              <div className="pt-2">
                <a
                  href="#download"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('File APK siap diunduh! Hubungi WhatsApp kami jika membutuhkan link drive alternatif.');
                  }}
                  className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>UNDUH FILE APK POS OFFLINE (V1.0.0)</span>
                </a>
              </div>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleClaimLicense} className="mt-4 space-y-4">
              {claimError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {claimError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  Masukkan Device ID HP Anda:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: POS-8F92-4B21-7A09"
                  value={deviceIdInput}
                  onChange={(e) => setDeviceIdInput(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono text-sm sm:text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 uppercase tracking-wide"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Device ID tertera di layar saat pertama kali membuka aplikasi POS OFFLINE. Klik tombol <em>Salin Device ID</em> lalu tempelkan di sini.
                </p>
              </div>

              <button
                type="submit"
                disabled={claimLoading}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-extrabold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all cursor-pointer disabled:opacity-60"
              >
                {claimLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>MENERBITKAN SERIAL KEY...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>TERBITKAN SERIAL KEY SEKARANG</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 underline">
            &larr; Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
