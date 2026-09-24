'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  User,
  Key,
  DollarSign,
  Search,
  Copy,
  CheckCircle,
  MessageCircle,
  Sparkles,
  RefreshCw,
  LogOut,
  AlertTriangle,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
  Smartphone,
  Store,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { Order } from '@/lib/types';

export default function AdminPage() {
  // Authentication State
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'cancelled'>('all');
  const [activeTab, setActiveTab] = useState<'orders' | 'generator'>('orders');

  // Double Security Reset Device Modal State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedOrderToReset, setSelectedOrderToReset] = useState<Order | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  // Manual Generator State
  const [manualDeviceId, setManualDeviceId] = useState('');
  const [manualCustomer, setManualCustomer] = useState('');
  const [manualStore, setManualStore] = useState('');
  const [manualResult, setManualResult] = useState<{ serialKey: string; whatsappTemplate: string } | null>(null);
  const [manualLoading, setManualLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);

  // Copy Feedback Map for order rows
  const [copiedRowKey, setCopiedRowKey] = useState<string | null>(null);

  // Restore session from sessionStorage on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem('pos_admin_token');
    if (savedToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
      fetchOrders(savedToken);
    }
  }, []);

  const fetchOrders = async (token: string) => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          throw new Error('Sesi telah kedaluwarsa. Silakan login kembali.');
        }
        throw new Error(data.error || 'Gagal memuat daftar pesanan.');
      }
      setOrders(data.orders || []);
    } catch (err: any) {
      setAuthError(err?.message || 'Gagal memuat pesanan.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Username atau Password salah.');
      }

      const token = data.token;
      sessionStorage.setItem('pos_admin_token', token);
      setAuthToken(token);
      setIsAuthenticated(true);
      setPassword('');
      fetchOrders(token);
    } catch (err: any) {
      setAuthError(err?.message || 'Gagal masuk.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('pos_admin_token');
    setAuthToken(null);
    setIsAuthenticated(false);
    setOrders([]);
    setPassword('');
  };

  const handleUpdateStatus = async (orderId: string, newStatus: 'paid' | 'pending' | 'cancelled') => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memperbarui status');
      fetchOrders(authToken);
    } catch (err: any) {
      alert(err?.message);
    }
  };

  // Open the Double-Security Reset Device Modal
  const openResetModal = (order: Order) => {
    setSelectedOrderToReset(order);
    setConfirmPassword('');
    setResetError('');
    setResetSuccessMessage('');
    setResetModalOpen(true);
  };

  const handleConfirmResetDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderToReset || !confirmPassword.trim()) {
      setResetError('Masukkan password admin untuk mengonfirmasi tindakan ini.');
      return;
    }

    setResetLoading(true);
    setResetError('');

    try {
      const res = await fetch('/api/admin/reset-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrderToReset.id,
          adminPassword: confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password konfirmasi salah.');
      }

      setResetSuccessMessage(data.message);
      if (authToken) {
        fetchOrders(authToken);
      }
      setTimeout(() => {
        setResetModalOpen(false);
        setSelectedOrderToReset(null);
        setConfirmPassword('');
      }, 1500);
    } catch (err: any) {
      setResetError(err?.message || 'Gagal mereset Device ID.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleManualGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDeviceId.trim() || !authToken) return;

    setManualLoading(true);
    try {
      const res = await fetch('/api/admin/generate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
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
    } finally {
      setManualLoading(false);
    }
  };

  const copyRowKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedRowKey(key);
    setTimeout(() => setCopiedRowKey(null), 2000);
  };

  const copyManualText = (text: string, isWa: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isWa) {
      setCopiedWa(true);
      setTimeout(() => setCopiedWa(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.storeName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.deviceId || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || order.paymentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = orders.length;
    const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.amount || 149000), 0);
    const claimedDevices = orders.filter((o) => !!o.deviceId).length;
    return {
      total,
      paidCount: paidOrders.length,
      totalRevenue,
      claimedDevices,
    };
  }, [orders]);

  // 1. LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d1f1c] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#183630] border border-emerald-500/20 rounded-3xl p-8 shadow-2xl text-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white">POS OFFLINE</h1>
            <p className="text-xs text-emerald-200/70 mt-1 uppercase tracking-wider font-semibold">
              Portal Admin & Manajemen Lisensi
            </p>
          </div>

          {authError && (
            <div className="p-3.5 mb-6 bg-red-950/50 border border-red-500/30 text-red-200 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-100/80 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Username Admin
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: admin"
                className="w-full px-4 py-3 bg-[#0d1f1c]/70 border border-emerald-500/30 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-100/80 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Password Admin
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password admin"
                  className="w-full px-4 py-3 bg-[#0d1f1c]/70 border border-emerald-500/30 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all placeholder:text-slate-500 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-2 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? (
                <span>MEMVERIFIKASI...</span>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>MASUK KE DASHBOARD ADMIN</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-emerald-500/10 text-center">
            <Link href="/" className="text-xs text-emerald-400/80 hover:text-emerald-300 transition-colors">
              &larr; Kembali ke Landing Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Navbar */}
      <header className="bg-[#183630] border-b border-emerald-500/20 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/icon.png"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-lg border border-emerald-500/30"
            />
            <div>
              <span className="font-black text-white text-base sm:text-lg tracking-tight">POS OFFLINE</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-md text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#0d1f1c] rounded-xl border border-emerald-500/20 text-xs text-emerald-300">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin: <strong>{username}</strong></span>
            </div>

            <button
              onClick={() => authToken && fetchOrders(authToken)}
              disabled={dataLoading}
              title="Refresh Data"
              className="p-2 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/20 rounded-xl text-emerald-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-red-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#183630]/60 border border-emerald-500/20 rounded-2xl p-4 sm:p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/70 block mb-1">
              Total Pesanan
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">{stats.total}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Seluruh order masuk</span>
          </div>

          <div className="bg-[#183630]/60 border border-emerald-500/20 rounded-2xl p-4 sm:p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/70 block mb-1">
              Pesanan Lunas
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">{stats.paidCount}</div>
            <span className="text-[11px] text-emerald-200/60 mt-1 block">Terkonfirmasi bayar</span>
          </div>

          <div className="bg-[#183630]/60 border border-emerald-500/20 rounded-2xl p-4 sm:p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/70 block mb-1">
              Total Omset Lunas
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#E5C690]">
              Rp {stats.totalRevenue.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Dana masuk terverifikasi</span>
          </div>

          <div className="bg-[#183630]/60 border border-emerald-500/20 rounded-2xl p-4 sm:p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/70 block mb-1">
              Device Terdaftar
            </span>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">{stats.claimedDevices}</div>
            <span className="text-[11px] text-cyan-200/60 mt-1 block">HP kasir aktif permanen</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mb-6 border-b border-emerald-500/20 pb-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50'
                : 'bg-[#183630]/50 text-slate-300 hover:bg-[#183630] border border-emerald-500/10'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Daftar Pesanan & Lisensi ({filteredOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50'
                : 'bg-[#183630]/50 text-slate-300 hover:bg-[#183630] border border-emerald-500/10'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Manual Key Generator</span>
          </button>
        </div>

        {/* TAB 1: ORDERS & LICENSES TABLE */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#183630]/40 p-4 rounded-2xl border border-emerald-500/20">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama pembeli, toko, WhatsApp, ID pesanan, atau Device ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0d1f1c] border border-emerald-500/30 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#0d1f1c] border border-emerald-500/30 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="paid">Lunas (Paid)</option>
                  <option value="pending">Menunggu (Pending)</option>
                  <option value="cancelled">Dibatalkan (Cancelled)</option>
                </select>
              </div>
            </div>

            {/* Orders Table Container */}
            <div className="bg-[#183630]/30 border border-emerald-500/20 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#183630] border-b border-emerald-500/20 text-emerald-200/80 uppercase text-[10px] font-black tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Order ID & Waktu</th>
                      <th className="py-3.5 px-4">Pelanggan & Toko</th>
                      <th className="py-3.5 px-4">Tagihan & Status</th>
                      <th className="py-3.5 px-4">Kaitan Device ID & Serial Key</th>
                      <th className="py-3.5 px-4 text-right">Aksi Manajemen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-500/10">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                          {dataLoading ? 'Memuat data pesanan...' : 'Tidak ada pesanan yang sesuai filter.'}
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const isPaid = order.paymentStatus === 'paid';
                        const isPending = order.paymentStatus === 'pending';
                        const hasDevice = !!order.deviceId;

                        return (
                          <tr key={order.id} className="hover:bg-emerald-950/20 transition-colors">
                            {/* Order ID & Time */}
                            <td className="py-3.5 px-4 align-top">
                              <span className="font-mono font-bold text-white text-xs block">{order.id}</span>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3 text-slate-500" />
                                {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <Link
                                href={`/order/${order.id}`}
                                target="_blank"
                                className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:underline mt-1.5"
                              >
                                <span>Lihat Invoice</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </Link>
                            </td>

                            {/* Customer & Store Info */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="font-bold text-white text-xs sm:text-sm">{order.customerName}</div>
                              <div className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                                <Store className="w-3 h-3 text-emerald-400" />
                                <span>{order.storeName || 'Toko Retail'}</span>
                              </div>
                              <a
                                href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 mt-1 font-mono"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>{order.customerPhone}</span>
                              </a>
                            </td>

                            {/* Payment Status & Amount */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="font-black text-[#E5C690] text-xs sm:text-sm">
                                Rp {(order.amount || 149000).toLocaleString('id-ID')}
                              </div>
                              <div className="mt-1.5 flex items-center gap-1">
                                <select
                                  value={order.paymentStatus}
                                  onChange={(e: any) => handleUpdateStatus(order.id, e.target.value)}
                                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                                    isPaid
                                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                                      : isPending
                                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                                      : 'bg-red-950/60 border-red-500/40 text-red-300'
                                  }`}
                                >
                                  <option value="paid">● LUNAS</option>
                                  <option value="pending">● MENUNGGU</option>
                                  <option value="cancelled">● BATAL</option>
                                </select>
                              </div>
                            </td>

                            {/* Device ID & Serial Key (1-to-1 Lock) */}
                            <td className="py-3.5 px-4 align-top">
                              {hasDevice ? (
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <Smartphone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                                      {order.deviceId}
                                    </span>
                                  </div>

                                  {order.serialKey && (
                                    <div className="flex items-center gap-1.5">
                                      <Key className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                      <span className="font-mono text-xs font-black text-emerald-300 tracking-wider">
                                        {order.serialKey}
                                      </span>
                                      <button
                                        onClick={() => copyRowKey(order.serialKey!)}
                                        title="Salin Serial Key"
                                        className="p-1 hover:bg-emerald-500/20 rounded text-slate-400 hover:text-emerald-300 transition-colors"
                                      >
                                        {copiedRowKey === order.serialKey ? (
                                          <Check className="w-3 h-3 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  )}
                                  <span className="text-[10px] text-slate-400 block">
                                    Terkunci 1 Perangkat Permanen
                                  </span>
                                </div>
                              ) : (
                                <div className="text-slate-500 text-xs italic flex items-center gap-1">
                                  <Smartphone className="w-3.5 h-3.5" />
                                  <span>Belum klaim Device ID</span>
                                </div>
                              )}
                            </td>

                            {/* Management Actions */}
                            <td className="py-3.5 px-4 align-top text-right">
                              {hasDevice ? (
                                <button
                                  onClick={() => openResetModal(order)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 hover:text-red-200 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                                  title="Ganti atau reset Device ID untuk pelanggan ini"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Reset Device</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-500">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANUAL KEY GENERATOR TOOL */}
        {activeTab === 'generator' && (
          <div className="max-w-2xl bg-[#183630]/40 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-500/20">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Generator Serial Key Manual</h2>
                <p className="text-xs text-slate-400">
                  Gunakan untuk menerbitkan lisensi pembeli khusus atau pesanan via WhatsApp
                </p>
              </div>
            </div>

            <form onSubmit={handleManualGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Device ID Perangkat HP Pembeli: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: POS-YPJZ-L92W-5GJY"
                  value={manualDeviceId}
                  onChange={(e) => setManualDeviceId(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-[#0d1f1c] border border-emerald-500/30 rounded-xl font-mono text-sm sm:text-base font-bold text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 uppercase tracking-wide placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Nama Pembeli (Opsional):
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={manualCustomer}
                    onChange={(e) => setManualCustomer(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0d1f1c] border border-emerald-500/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Nama Toko (Opsional):
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kopi Kenangan"
                    value={manualStore}
                    onChange={(e) => setManualStore(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0d1f1c] border border-emerald-500/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={manualLoading}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {manualLoading ? (
                  <span>MENERBITKAN KUNCI...</span>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>TERBITKAN SERIAL KEY RESMI</span>
                  </>
                )}
              </button>
            </form>

            {manualResult && (
              <div className="mt-6 pt-6 border-t border-emerald-500/20 space-y-4">
                <div className="bg-[#0d1f1c] border border-emerald-500/30 rounded-2xl p-5 text-center">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                    SERIAL KEY RESMI PERMANEN:
                  </span>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-emerald-300 tracking-wider py-2 select-all">
                    {manualResult.serialKey}
                  </div>
                  <button
                    onClick={() => copyManualText(manualResult.serialKey, false)}
                    className="mt-2 inline-flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold px-4 py-2 rounded-xl border border-emerald-500/30 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey ? 'BERHASIL DISALIN!' : 'SALIN SERIAL KEY'}</span>
                  </button>
                </div>

                <div className="bg-[#0d1f1c] border border-emerald-500/20 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      Template Pesan WhatsApp Siap Kirim:
                    </span>
                    <button
                      onClick={() => copyManualText(manualResult.whatsappTemplate, true)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                    >
                      {copiedWa ? '✓ Disalin' : 'Salin Pesan'}
                    </button>
                  </div>
                  <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap bg-slate-900/60 p-3 rounded-xl border border-emerald-500/10 max-h-48 overflow-y-auto">
                    {manualResult.whatsappTemplate}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* DOUBLE-SECURITY RESET DEVICE MODAL */}
      {resetModalOpen && selectedOrderToReset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#183630] border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-emerald-500/10">
              <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Konfirmasi Reset Device ID</h3>
                <p className="text-xs text-red-200/80">Tindakan ini memerlukan verifikasi password admin.</p>
              </div>
            </div>

            {/* Target Order Info */}
            <div className="bg-[#0d1f1c] rounded-2xl p-4 border border-emerald-500/20 text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono font-bold text-white">{selectedOrderToReset.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pelanggan:</span>
                <span className="font-semibold text-white">{selectedOrderToReset.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Toko:</span>
                <span className="text-slate-200">{selectedOrderToReset.storeName || '-'}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-emerald-500/10">
                <span className="text-slate-400">Device ID Terdaftar:</span>
                <span className="font-mono font-bold text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                  {selectedOrderToReset.deviceId}
                </span>
              </div>
            </div>

            {/* Warning Message */}
            <p className="text-xs text-amber-200/90 leading-relaxed mb-4 bg-amber-950/30 border border-amber-500/20 p-3 rounded-xl">
              <strong>Peringatan Keamanan:</strong> Kaitan Device ID ({selectedOrderToReset.deviceId}) dan Serial Key akan dihapus dari pesanan ini. Pelanggan dapat mendaftarkan 1 perangkat baru di halaman order mereka.
            </p>

            {resetError && (
              <div className="p-3 mb-4 bg-red-950/60 border border-red-500/40 text-red-200 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{resetError}</span>
              </div>
            )}

            {resetSuccessMessage && (
              <div className="p-3 mb-4 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{resetSuccessMessage}</span>
              </div>
            )}

            {/* Password Verification Form */}
            <form onSubmit={handleConfirmResetDevice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-red-400" /> Masukkan Password Admin untuk Konfirmasi: *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik password admin Anda"
                    className="w-full px-4 py-3 bg-[#0d1f1c] border border-red-500/40 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-400 placeholder:text-slate-600 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  disabled={resetLoading}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={resetLoading || !confirmPassword.trim()}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 active:scale-98 text-white font-black text-xs rounded-xl transition-all shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {resetLoading ? (
                    <span>MEMPROSES RESET...</span>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>YA, RESET DEVICE INI</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
