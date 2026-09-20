'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Key,
  Users,
  DollarSign,
  Search,
  Copy,
  CheckCircle,
  MessageCircle,
  Sparkles,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { Order } from '@/lib/types';

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Admin Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'generator'>('orders');

  // Manual Generator State
  const [manualDeviceId, setManualDeviceId] = useState('');
  const [manualCustomer, setManualCustomer] = useState('');
  const [manualStore, setManualStore] = useState('');
  const [manualResult, setManualResult] = useState<{ serialKey: string; whatsappTemplate: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'x-admin-pin': pin },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'PIN salah.');
      }

      setOrders(data.orders || []);
      setIsAuthenticated(true);
    } catch (err: any) {
      setAuthError(err?.message || 'Gagal masuk.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDeviceId.trim()) return;

    try {
      const res = await fetch('/api/admin/generate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin,
        },
        body: JSON.stringify({
          deviceId: manualDeviceId,
          customerName: manualCustomer,
          storeName: manualStore,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal generate kunci.');
      }

      setManualResult(data);
    } catch (err: any) {
      alert(err?.message);
    }
  };

  const copyText = (text: string, isWa: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isWa) {
      setCopiedWa(true);
      setTimeout(() => setCopiedWa(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  // If not logged in, show clean PIN Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-xl font-black text-white mb-1">Admin Panel POS OFFLINE</h1>
          <p className="text-xs text-slate-400 mb-6">Masukkan PIN pemilik untuk mengakses data pesanan & generator lisensi</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-500/20 border border-red-500 text-red-200 text-xs rounded-xl">
                {authError}
              </div>
            )}

            <input
              type="password"
              maxLength={6}
              required
              autoFocus
              placeholder="PIN 6 Digit (Default: 123456)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-white text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'MEMVERIFIKASI...' : 'MASUK KE ADMIN'}
            </button>
          </form>

          <div className="mt-6">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-400 underline">
              &larr; Kembali ke Landing Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalOmset = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.amount : 0), 0);
  const totalLisensi = orders.filter((o) => o.serialKey).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Navbar */}
      <header className="bg-slate-900 text-white py-4 px-6 border-b border-slate-800 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
            P
          </span>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base leading-tight">Admin POS OFFLINE</h1>
            <p className="text-[11px] text-slate-400">Database Neon PostgreSQL & Generator Lisensi</p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar</span>
        </button>
      </header>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Total Omset Terkonfirmasi</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                Rp {totalOmset.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Total Pesanan Masuk</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{orders.length} Pesanan</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Lisensi Diterbitkan</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{totalLisensi} Device</p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Daftar Pesanan ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'generator'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Manual Generator Lisensi (Chat WA)</span>
          </button>
        </div>

        {/* TAB 1: Orders Table */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-sm text-slate-900">Riwayat Pesanan Pelanggan</h2>
              <span className="text-xs text-slate-500">Tersimpan di Neon PostgreSQL</span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                Belum ada pesanan masuk. Saat ada pembeli mengisi form, pesanan akan muncul di sini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase">
                    <tr>
                      <th className="py-3 px-4">ID / Tanggal</th>
                      <th className="py-3 px-4">Pembeli & Toko</th>
                      <th className="py-3 px-4">Paket & Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Device ID & Serial Key</th>
                      <th className="py-3 px-4">Aksi WA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4">
                          <p className="font-mono font-bold text-slate-900">{o.id}</p>
                          <p className="text-[11px] text-slate-500">
                            {new Date(o.createdAt).toLocaleDateString('id-ID')}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{o.customerName}</p>
                          <p className="text-[11px] text-slate-500">
                            {o.storeName} ({o.businessType})
                          </p>
                          <p className="font-mono text-[11px] text-emerald-800">{o.customerPhone}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-800">
                            {o.packageType === 'bundling_printer' ? 'Bundling Printer' : 'Software Only'}
                          </p>
                          <p className="font-bold text-emerald-800">
                            Rp {o.amount.toLocaleString('id-ID')}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              o.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {o.paymentStatus === 'paid' ? 'LUNAS / AKTIF' : 'PENDING'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px]">
                          {o.serialKey ? (
                            <div>
                              <p className="text-slate-500">{o.deviceId}</p>
                              <p className="font-bold text-emerald-800 select-all">{o.serialKey}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Belum klaim Device ID</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={`https://wa.me/${o.customerPhone}?text=Halo%20Kak%20${encodeURIComponent(
                              o.customerName
                            )},%20terima%20kasih%20telah%20memesan%20POS%20OFFLINE%20(ID:%20${o.id}).`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white text-xs px-2.5 py-1.5 rounded-lg font-bold"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Chat</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Manual License Generator */}
        {activeTab === 'generator' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Manual License Key Generator
                </h2>
                <p className="text-xs text-slate-500">
                  Gunakan untuk membuat Serial Key instan jika pembeli order langsung via chat WhatsApp / offline
                </p>
              </div>
            </div>

            <form onSubmit={handleManualGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Device ID Pembeli <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: POS-8F92-4B21-7A09"
                  value={manualDeviceId}
                  onChange={(e) => setManualDeviceId(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Nama Pembeli (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Pak Budi"
                    value={manualCustomer}
                    onChange={(e) => setManualCustomer(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Nama Toko (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Toko Sembako Berkah"
                    value={manualStore}
                    onChange={(e) => setManualStore(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-950/20 cursor-pointer"
              >
                BUAT SERIAL KEY RESMI
              </button>
            </form>

            {manualResult && (
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                <div className="bg-slate-900 text-white rounded-2xl p-5 text-center">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                    SERIAL KEY SEUMUR HIDUP:
                  </span>
                  <p className="font-mono text-2xl font-black text-emerald-300 tracking-wider py-1 select-all">
                    {manualResult.serialKey}
                  </p>
                  <button
                    onClick={() => copyText(manualResult.serialKey)}
                    className="mt-2 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey ? 'Tersalin!' : 'Salin Kunci'}</span>
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-700">Format Balasan WhatsApp Siap Kirim:</span>
                    <button
                      onClick={() => copyText(manualResult.whatsappTemplate, true)}
                      className="text-xs text-emerald-700 hover:underline font-bold flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedWa ? 'Tersalin!' : 'Salin Semua'}</span>
                    </button>
                  </div>
                  <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans bg-white p-3 rounded-lg border border-slate-200 max-h-48 overflow-y-auto">
                    {manualResult.whatsappTemplate}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
