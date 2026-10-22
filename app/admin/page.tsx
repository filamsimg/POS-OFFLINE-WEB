'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Package, Key, Loader2, AlertCircle } from 'lucide-react';
import { Order } from '@/lib/types';
import { DigitalReceiptModal } from '@/components/DigitalReceiptModal';
import {
  AdminTab,
  OrderFilter,
  AdminStats,
  GenResult,
  AdminHeader,
  AdminLoginView,
  AdminStatsGrid,
  AdminFilters,
  AdminOrderTable,
  AdminOrderCards,
  AdminGeneratorTab,
  AdminResetModal,
  AdminDeleteModal,
} from '@/components/admin';

export default function AdminPage() {
  // Auth state
  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [showPw, setShowPw]             = useState(false);
  const [authToken, setAuthToken]       = useState<string | null>(null);
  const [isAuth, setIsAuth]             = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError]       = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Orders state
  const [orders, setOrders]                     = useState<Order[]>([]);
  const [dataLoading, setDataLoading]           = useState(false);
  const [search, setSearch]                     = useState('');
  const [filter, setFilter]                     = useState<OrderFilter>('all');
  const [selectedOrderId, setSelectedOrderId]   = useState<string | null>(null);

  // Generator state
  const [tab, setTab]                           = useState<AdminTab>('orders');
  const [genDeviceId, setGenDeviceId]           = useState('');
  const [genOrderId, setGenOrderId]             = useState('');
  const [genResult, setGenResult]               = useState<GenResult | null>(null);
  const [genLoading, setGenLoading]             = useState(false);
  const [genError, setGenError]                 = useState('');

  // Standalone / Mandiri form state
  const [genCustomerName, setGenCustomerName]   = useState('');
  const [genCustomerPhone, setGenCustomerPhone] = useState('');
  const [genStoreName, setGenStoreName]         = useState('');
  const [genLicenseType, setGenLicenseType]     = useState<'paid' | 'free'>('paid');
  const [genAmount, setGenAmount]               = useState(299000);
  const [genNotes, setGenNotes]                 = useState('');
  const [waMsgCopied, setWaMsgCopied]           = useState(false);

  // Modals state
  const [receiptOrder, setReceiptOrder]         = useState<Order | null>(null);
  const [resetOrder, setResetOrder]             = useState<Order | null>(null);
  const [resetPw, setResetPw]                   = useState('');
  const [resetLoading, setResetLoading]         = useState(false);
  const [resetError, setResetError]             = useState('');

  const [deleteOrderTarget, setDeleteOrderTarget] = useState<Order | null>(null);
  const [deletePw, setDeletePw]                   = useState('');
  const [deleteLoading, setDeleteLoading]         = useState(false);
  const [deleteError, setDeleteError]             = useState('');

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    sessionStorage.removeItem('pos_admin_token');
    setAuthToken(null);
    setIsAuth(false);
    setOrders([]);
    setPassword('');
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async (token: string) => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrders(data.orders ?? []);
    } catch {
      handleLogout();
    } finally {
      setDataLoading(false);
    }
  }, [handleLogout]);

  // Session verification on mount
  useEffect(() => {
    async function verifySession() {
      const savedToken = sessionStorage.getItem('pos_admin_token');
      if (!savedToken) {
        setCheckingAuth(false);
        return;
      }
      try {
        const res = await fetch('/api/admin/verify', {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        if (res.ok) {
          setAuthToken(savedToken);
          setIsAuth(true);
          fetchOrders(savedToken);
        } else {
          sessionStorage.removeItem('pos_admin_token');
        }
      } catch {
        sessionStorage.removeItem('pos_admin_token');
      } finally {
        setCheckingAuth(false);
      }
    }
    verifySession();
  }, [fetchOrders]);

  // Login handler
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
      if (!res.ok) throw new Error(data.error ?? 'Login gagal.');
      sessionStorage.setItem('pos_admin_token', data.token);
      setAuthToken(data.token);
      setIsAuth(true);
      fetchOrders(data.token);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Login gagal.');
    } finally {
      setLoginLoading(false);
    }
  };

  // WhatsApp draft helper
  const getOrderWhatsAppUrl = (order: Order) => {
    const phone = order.customerPhone.replace(/\D/g, '').replace(/^0/, '62');
    let text = '';
    if (order.serialKey) {
      const isFree = order.amount === 0;
      const greeting = isFree
        ? `Halo Kak ${order.customerName}! Berikut adalah lisensi POS OFFLINE (Properti Konten / Demo) Anda 😊\n\n`
        : `Halo Kak ${order.customerName}! Terima kasih atas pesanannya di POS OFFLINE 😊\n\n`;

      text =
        greeting +
        `Berikut rincian aktivasi lisensi resmi Anda:\n` +
        `🏪 Nama Toko: ${order.storeName || '-'}\n` +
        `📱 Device ID: ${order.deviceId || '-'}\n` +
        `🔑 SERIAL KEY (Ketuk kode untuk menyalin):\n` +
        `\`${order.serialKey}\`\n\n` +
        `Cara Aktivasi:\n` +
        `1. Buka aplikasi POS OFFLINE di HP Anda.\n` +
        `2. Ketuk kode Serial Key di atas untuk menyalin, lalu tempelkan ke kolom yang tersedia di aplikasi.\n` +
        `3. Klik tombol "Aktivasi Aplikasi".\n\n` +
        `Aplikasi Anda langsung aktif permanen seumur hidup! ` +
        `Jika ada pertanyaan, jangan ragu hubungi kami kembali ya Kak. 🙏`;
    } else if (order.paymentStatus === 'paid') {
      text =
        `Halo Kak ${order.customerName}! Pembayaran Anda untuk pesanan POS OFFLINE #${order.id.slice(0, 8).toUpperCase()} telah berhasil dikonfirmasi.\n\n` +
        `Silakan download & pasang aplikasi POS OFFLINE di HP Anda, lalu berikan Device ID yang tertera di layar aktivasi untuk kami terbitkan Serial Key permanen Anda. Terima kasih!`;
    } else {
      text =
        `Halo Kak ${order.customerName}! Terima kasih sudah melakukan pemesanan POS OFFLINE.\n` +
        `No. Pesanan: #${order.id.slice(0, 8).toUpperCase()}\n\n` +
        `Apakah ada pertanyaan atau kendala dalam menyelesaikan pembayaran yang bisa kami bantu?`;
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  // Switch to Generator for specific order
  const handleOpenGeneratorForOrder = (order: Order) => {
    setGenOrderId(order.id);
    if (order.deviceId) {
      setGenDeviceId(order.deviceId);
    }
    setGenError('');
    if (order.serialKey) {
      const isFree = order.amount === 0;
      const greeting = isFree
        ? `Halo Kak ${order.customerName}! Berikut adalah lisensi POS OFFLINE (Properti / Konten / Demo) Anda 😊\n\n`
        : `Halo Kak ${order.customerName}! Terima kasih atas pesanannya di POS OFFLINE 😊\n\n`;

      const waText =
        greeting +
        `Berikut rincian aktivasi lisensi resmi Anda:\n` +
        `🏪 Nama Toko: ${order.storeName || '-'}\n` +
        `📱 Device ID: ${order.deviceId || '-'}\n` +
        `🔑 SERIAL KEY (Ketuk kode untuk menyalin):\n` +
        `\`${order.serialKey}\`\n\n` +
        `Cara Aktivasi:\n` +
        `1. Buka aplikasi POS OFFLINE di HP Anda.\n` +
        `2. Ketuk kode Serial Key di atas untuk menyalin, lalu tempelkan ke kolom yang tersedia di aplikasi.\n` +
        `3. Klik tombol "Aktivasi Aplikasi".\n\n` +
        `Aplikasi Anda langsung aktif permanen seumur hidup! ` +
        `Jika ada pertanyaan, jangan ragu hubungi kami kembali ya Kak. 🙏`;
      setGenResult({ serialKey: order.serialKey, waTemplate: waText, order });
    } else {
      setGenResult(null);
    }
    setTab('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select order in generator dropdown
  const handleSelectGenOrder = (orderId: string) => {
    setGenOrderId(orderId);
    setGenError('');
    if (orderId) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        if (order.deviceId) setGenDeviceId(order.deviceId);
        if (order.serialKey) {
          const isFree = order.amount === 0;
          const greeting = isFree
            ? `Halo Kak ${order.customerName}! Berikut adalah lisensi POS OFFLINE (Properti / Konten / Demo) Anda 😊\n\n`
            : `Halo Kak ${order.customerName}! Terima kasih atas pesanannya di POS OFFLINE 😊\n\n`;

          const waText =
            greeting +
            `Berikut rincian aktivasi lisensi resmi Anda:\n` +
            `🏪 Nama Toko: ${order.storeName || '-'}\n` +
            `📱 Device ID: ${order.deviceId || '-'}\n` +
            `🔑 SERIAL KEY (Ketuk kode untuk menyalin):\n` +
            `\`${order.serialKey}\`\n\n` +
            `Cara Aktivasi:\n` +
            `1. Buka aplikasi POS OFFLINE di HP Anda.\n` +
            `2. Ketuk kode Serial Key di atas untuk menyalin, lalu tempelkan ke kolom yang tersedia di aplikasi.\n` +
            `3. Klik tombol "Aktivasi Aplikasi".\n\n` +
            `Aplikasi Anda langsung aktif permanen seumur hidup! ` +
            `Jika ada pertanyaan, jangan ragu hubungi kami kembali ya Kak. 🙏`;
          setGenResult({ serialKey: order.serialKey, waTemplate: waText, order });
        } else {
          setGenResult(null);
        }
      }
    } else {
      setGenResult(null);
      setGenDeviceId('');
      setGenCustomerName('');
      setGenCustomerPhone('');
      setGenStoreName('');
      setGenLicenseType('paid');
      setGenAmount(299000);
      setGenNotes('');
    }
  };

  // Generate key submit
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenError('');
    setGenResult(null);
    const rawInput = genDeviceId.trim().toUpperCase();
    if (!rawInput) {
      setGenError('Device ID wajib diisi.');
      return;
    }
    const cleanChars = rawInput.replace(/[^A-Z0-9]/g, '');
    if (cleanChars.length < 8) {
      setGenError('Format Device ID tidak valid. Contoh yang benar: POS-8F92-4B21-7A09.');
      return;
    }
    setGenLoading(true);
    try {
      const order = orders.find((o) => o.id === genOrderId);
      const res = await fetch('/api/admin/generate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          deviceId: rawInput,
          orderId: genOrderId || undefined,
          customerName: genOrderId ? undefined : genCustomerName.trim(),
          customerPhone: genOrderId ? undefined : genCustomerPhone.trim(),
          storeName: genOrderId ? undefined : genStoreName.trim(),
          amount: genOrderId ? undefined : (genLicenseType === 'free' ? 0 : genAmount),
          notes: genOrderId
            ? undefined
            : (genNotes.trim() || (genLicenseType === 'free' ? 'Lisensi Gratis (Properti Konten / Demo) via Dashboard Admin' : 'Order Mandiri dibuat via Dashboard Admin')),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setGenResult({
        serialKey: data.serialKey,
        waTemplate: data.waTemplate,
        order: data.order || order,
      });

      if (authToken) fetchOrders(authToken);
    } catch (err: unknown) {
      setGenError(err instanceof Error ? err.message : 'Gagal generate key.');
    } finally {
      setGenLoading(false);
    }
  };

  // Reset device submit
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetLoading(true);
    try {
      const res = await fetch('/api/admin/reset-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ orderId: resetOrder?.id, confirmPassword: resetPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResetOrder(null);
      setResetPw('');
      if (authToken) fetchOrders(authToken);
    } catch (err: unknown) {
      setResetError(err instanceof Error ? err.message : 'Reset gagal.');
    } finally {
      setResetLoading(false);
    }
  };

  // Delete order submit
  const handleDeleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteOrderTarget) return;
    setDeleteError('');
    setDeleteLoading(true);
    try {
      const res = await fetch('/api/admin/delete-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ orderId: deleteOrderTarget.id, adminPassword: deletePw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const deletedId = deleteOrderTarget.id;
      setDeleteOrderTarget(null);
      setDeletePw('');
      if (selectedOrderId === deletedId) {
        setSelectedOrderId(null);
      }
      if (authToken) fetchOrders(authToken);
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Penghapusan pesanan gagal.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered orders
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = filter === 'all' || o.paymentStatus === filter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        (o.storeName ?? '').toLowerCase().includes(q) ||
        (o.customerEmail ?? '').toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [orders, filter, search]);

  // Summary statistics
  const stats: AdminStats = useMemo(() => {
    const paid = orders.filter((o) => o.paymentStatus === 'paid');
    const active = orders.filter((o) => o.serialKey);
    const pending = orders.filter((o) => o.paymentStatus === 'pending');
    const revenue = paid.reduce((sum, o) => sum + (o.amount || 0), 0);
    return {
      total: orders.length,
      pending: pending.length,
      paid: paid.length,
      active: active.length,
      revenue,
    };
  }, [orders]);

  // Loading splash
  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px', color: '#4ade80' }} />
          Memuat sesi admin...
        </div>
      </div>
    );
  }

  // Not logged in -> Show Login View
  if (!isAuth) {
    return (
      <AdminLoginView
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        showPw={showPw}
        setShowPw={setShowPw}
        authError={authError}
        loginLoading={loginLoading}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        color: '#334155',
      }}
    >
      {/* Dynamic Scoped CSS for Responsive Elegance */}
      <style>{`
        .admin-stat-card {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .admin-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.08);
          border-color: #cbd5e1;
        }

        /* Order Table for Desktop */
        .admin-order-row {
          display: grid;
          grid-template-columns: 110px 1.5fr 1.3fr 130px 130px 42px;
          gap: 16px;
          align-items: center;
          padding: 14px 20px;
          cursor: pointer;
          background: #ffffff;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .admin-order-row:hover {
          background: #f8fafc;
        }
        .admin-order-row.active {
          background: #f1f5f9;
        }

        /* Responsive Breakpoints */
        .desktop-only-table {
          display: block;
        }
        .mobile-only-cards {
          display: none;
        }

        @media (max-width: 900px) {
          .desktop-only-table {
            display: none;
          }
          .mobile-only-cards {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
        }

        /* Header Responsiveness */
        @media (max-width: 640px) {
          .desktop-header-version {
            display: none !important;
          }
        }
        @media (max-width: 420px) {
          .header-btn-text {
            display: none !important;
          }
        }

        /* Stats Grid Breakpoints */
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }
        @media (max-width: 1150px) {
          .admin-stats-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 680px) {
          .admin-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }
          .admin-stat-highlight {
            grid-column: span 2;
          }
        }

        /* Hide horizontal scrollbar in filters */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Admin Order Actions Mobile Responsiveness */
        .admin-drawer-actions {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 8px !important;
          width: 100% !important;
        }
        .admin-drawer-actions .admin-btn-full {
          grid-column: 1 / -1 !important;
          width: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          min-height: 42px !important;
          padding: 10px 14px !important;
          text-align: center !important;
          box-sizing: border-box !important;
        }
        .admin-drawer-actions .admin-btn-half {
          width: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          min-height: 40px !important;
          padding: 9px 8px !important;
          text-align: center !important;
          box-sizing: border-box !important;
          font-size: 11.5px !important;
        }

        @media (min-width: 901px) {
          .admin-drawer-actions {
            display: flex !important;
            flex-wrap: wrap !important;
            align-items: center !important;
          }
          .admin-drawer-actions .admin-btn-full,
          .admin-drawer-actions .admin-btn-half {
            width: auto !important;
            flex: 0 0 auto !important;
            grid-column: auto !important;
          }
        }
      `}</style>

      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <AdminHeader
        dataLoading={dataLoading}
        onRefresh={() => authToken && fetchOrders(authToken)}
        onLogout={handleLogout}
      />

      {/* ── Main Container ─────────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: 'clamp(16px, 3vw, 32px) clamp(12px, 4vw, 28px)',
        }}
      >
        {/* Title Bar & Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 'clamp(20px, 3vw, 26px)',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.03em',
              }}
            >
              Dashboard Pesanan & Lisensi
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
              Monitoring transaksi, verifikasi pembayaran, dan aktivasi perangkat pelanggan.
            </p>
          </div>

          {/* Navigation Tabs (Mobile Touch Friendly) */}
          <div
            style={{
              display: 'flex',
              background: '#e2e8f0',
              padding: 3,
              borderRadius: 10,
              gap: 2,
              width: 'clamp(280px, 100%, 360px)',
            }}
          >
            <button
              type="button"
              onClick={() => setTab('orders')}
              style={{
                flex: 1,
                background: tab === 'orders' ? '#ffffff' : 'transparent',
                color: tab === 'orders' ? '#0f172a' : '#64748b',
                border: 'none',
                borderRadius: 8,
                padding: '9px 12px',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: tab === 'orders' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                transition: 'all 0.15s ease',
                minHeight: 38,
              }}
            >
              <Package size={14} style={{ color: tab === 'orders' ? '#2563eb' : 'inherit' }} />
              <span>Daftar Pesanan</span>
            </button>

            <button
              type="button"
              onClick={() => setTab('generator')}
              style={{
                flex: 1,
                background: tab === 'generator' ? '#ffffff' : 'transparent',
                color: tab === 'generator' ? '#0f172a' : '#64748b',
                border: 'none',
                borderRadius: 8,
                padding: '9px 12px',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: tab === 'generator' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                transition: 'all 0.15s ease',
                minHeight: 38,
              }}
            >
              <Key size={14} style={{ color: tab === 'generator' ? '#7c3aed' : 'inherit' }} />
              <span>Generate Key</span>
            </button>
          </div>
        </div>

        {/* ── Stat Cards Grid ──────────────────────────────────────────────── */}
        <AdminStatsGrid stats={stats} />

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ORDERS TAB                                                          */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {tab === 'orders' && (
          <div>
            {/* Search & Filter Bar */}
            <AdminFilters
              search={search}
              setSearch={setSearch}
              filter={filter}
              setFilter={setFilter}
              orders={orders}
            />

            {/* Orders Content Area */}
            {dataLoading ? (
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  padding: '64px 20px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                }}
              >
                <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px', color: '#2563eb' }} />
                <div style={{ fontWeight: 600, fontSize: 14 }}>Memuat daftar pesanan...</div>
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  padding: '64px 20px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: '#94a3b8',
                  }}
                >
                  <Package size={24} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 4 }}>
                  Tidak ada pesanan ditemukan
                </div>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>
                  {search || filter !== 'all'
                    ? 'Coba ubah kata kunci pencarian atau ganti filter status.'
                    : 'Belum ada transaksi pesanan yang masuk ke database.'}
                </div>
              </div>
            ) : (
              <div>
                {/* Desktop Table View */}
                <AdminOrderTable
                  orders={filtered}
                  selectedOrderId={selectedOrderId}
                  onToggleExpand={(id) => setSelectedOrderId(selectedOrderId === id ? null : id)}
                  onOpenReceipt={(order) => setReceiptOrder(order)}
                  onOpenReset={(order) => {
                    setResetOrder(order);
                    setResetPw('');
                    setResetError('');
                  }}
                  onOpenDelete={(order) => {
                    setDeleteOrderTarget(order);
                    setDeletePw('');
                    setDeleteError('');
                  }}
                  onOpenGenerator={handleOpenGeneratorForOrder}
                  getOrderWhatsAppUrl={getOrderWhatsAppUrl}
                />

                {/* Mobile Cards View */}
                <AdminOrderCards
                  orders={filtered}
                  selectedOrderId={selectedOrderId}
                  onToggleExpand={(id) => setSelectedOrderId(selectedOrderId === id ? null : id)}
                  onOpenReceipt={(order) => setReceiptOrder(order)}
                  onOpenReset={(order) => {
                    setResetOrder(order);
                    setResetPw('');
                    setResetError('');
                  }}
                  onOpenDelete={(order) => {
                    setDeleteOrderTarget(order);
                    setDeletePw('');
                    setDeleteError('');
                  }}
                  onOpenGenerator={handleOpenGeneratorForOrder}
                  getOrderWhatsAppUrl={getOrderWhatsAppUrl}
                />
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* GENERATOR TAB                                                       */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {tab === 'generator' && (
          <AdminGeneratorTab
            orders={orders}
            genOrderId={genOrderId}
            onSelectOrder={handleSelectGenOrder}
            genDeviceId={genDeviceId}
            setGenDeviceId={setGenDeviceId}
            genCustomerName={genCustomerName}
            setGenCustomerName={setGenCustomerName}
            genCustomerPhone={genCustomerPhone}
            setGenCustomerPhone={setGenCustomerPhone}
            genStoreName={genStoreName}
            setGenStoreName={setGenStoreName}
            genLicenseType={genLicenseType}
            setGenLicenseType={setGenLicenseType}
            genAmount={genAmount}
            setGenAmount={setGenAmount}
            genNotes={genNotes}
            setGenNotes={setGenNotes}
            genResult={genResult}
            genLoading={genLoading}
            genError={genError}
            waMsgCopied={waMsgCopied}
            setWaMsgCopied={setWaMsgCopied}
            onSubmit={handleGenerate}
            onOpenReceipt={(order) => setReceiptOrder(order)}
            getOrderWhatsAppUrl={getOrderWhatsAppUrl}
          />
        )}
      </main>

      {/* ── Reset Device Modal ───────────────────────────────────────────────── */}
      {resetOrder && (
        <AdminResetModal
          order={resetOrder}
          resetPw={resetPw}
          setResetPw={setResetPw}
          resetLoading={resetLoading}
          resetError={resetError}
          onClose={() => setResetOrder(null)}
          onSubmit={handleReset}
        />
      )}

      {/* ── Delete Order Modal ────────────────────────────────────────────────── */}
      {deleteOrderTarget && (
        <AdminDeleteModal
          order={deleteOrderTarget}
          deletePw={deletePw}
          setDeletePw={setDeletePw}
          deleteLoading={deleteLoading}
          deleteError={deleteError}
          onClose={() => setDeleteOrderTarget(null)}
          onSubmit={handleDeleteOrder}
        />
      )}

      {/* ── Digital Sales Receipt Modal ─────────────────────────────────────── */}
      {receiptOrder && (
        <DigitalReceiptModal
          order={receiptOrder}
          onClose={() => setReceiptOrder(null)}
        />
      )}
    </div>
  );
}
