'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  Lock,
  Key,
  Search,
  Copy,
  CheckCircle,
  MessageCircle,
  RefreshCw,
  LogOut,
  RotateCcw,
  Eye,
  EyeOff,
  Smartphone,
  Calendar,
  Mail,
  Package,
  TrendingUp,
  Users,
  AlertCircle,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Store,
  Loader2,
} from 'lucide-react';
import { Order } from '@/lib/types';
import {
  T,
  inputStyle,
  btnPrimary,
  btnSecondary,
  btnDanger,
  cardStyle,
  errorBoxStyle,
  warningBoxStyle,
  fmtCurrency,
  fmtDate,
  copyText,
  statusBadgeConfig,
} from '@/lib/ui-tokens';

// Status Badge
function StatusBadge({ status }: { status: Order['paymentStatus'] }) {
  const s = statusBadgeConfig[status] ?? statusBadgeConfig.pending;
  return (
    <span
      style={{
        background:    s.bg,
        color:         s.color,
        fontSize:      11,
        fontWeight:    700,
        padding:       '3px 10px',
        borderRadius:  99,
        letterSpacing: '0.04em',
        display:       'inline-block',
        whiteSpace:    'nowrap',
      }}
    >
      {s.label}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, icon, accent, sub,
}: {
  label: string; value: string | number; icon: React.ReactNode; accent: string; sub?: string;
}) {
  return (
    <div
      style={{
        background:   T.white,
        border:       `1px solid ${T.border}`,
        borderRadius: 14,
        padding:      '18px 20px',
        display:      'flex',
        alignItems:   'center',
        gap:          16,
        boxShadow:    '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          width:          44,
          height:         44,
          borderRadius:   12,
          background:     `${accent}15`,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          color:          accent,
          flexShrink:     0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.heading, letterSpacing: '-0.03em', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: accent, fontWeight: 600, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => copyText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); })}
      title="Salin"
      style={{
        background: copied ? '#dcfce7' : '#f3f4f8',
        border:     `1px solid ${copied ? '#bbf7d0' : T.border}`,
        borderRadius: 6,
        cursor:     'pointer',
        padding:    '4px 8px',
        color:      copied ? '#15803d' : T.muted,
        display:    'inline-flex',
        alignItems: 'center',
        gap:        4,
        fontSize:   11,
        fontWeight: 600,
        transition: 'all 0.15s',
      }}
    >
      {copied ? <><Check size={11} /> Disalin</> : <><Copy size={11} /> Salin</>}
    </button>
  );
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────

function InfoRow({ label, value, copy }: { label: string; value: string; copy?: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12 }}>
      <span style={{ color: T.muted, minWidth: 110, flexShrink: 0, paddingTop: 1 }}>{label}</span>
      <span style={{ color: T.heading, fontFamily: copy ? 'monospace' : 'inherit', flex: 1, wordBreak: 'break-all', fontWeight: copy ? 600 : 400 }}>
        {value}
      </span>
      {copy && <CopyBtn text={copy} />}
    </div>
  );
}

// Main Page
export default function AdminPage() {
  // Auth
  const [username, setUsername]         = useState('admin');
  const [password, setPassword]         = useState('');
  const [showPw, setShowPw]             = useState(false);
  const [authToken, setAuthToken]       = useState<string | null>(null);
  const [isAuth, setIsAuth]             = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError]       = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Orders
  const [orders, setOrders]           = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState<'all' | 'paid' | 'pending' | 'cancelled'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Generator
  const [tab, setTab]                 = useState<'orders' | 'generator'>('orders');
  const [genDeviceId, setGenDeviceId] = useState('');
  const [genOrderId, setGenOrderId]   = useState('');
  const [genResult, setGenResult]     = useState<{ serialKey: string; waTemplate: string } | null>(null);
  const [genLoading, setGenLoading]   = useState(false);
  const [genError, setGenError]       = useState('');

  // Reset modal
  const [resetOrder, setResetOrder]     = useState<Order | null>(null);
  const [resetPw, setResetPw]           = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError]     = useState('');

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
      const res  = await fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } });
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
      const saved = typeof window !== 'undefined' ? sessionStorage.getItem('pos_admin_token') : null;
      try {
        const res = await fetch('/api/admin/verify', {
          headers: saved ? { Authorization: `Bearer ${saved}` } : {},
        });
        const data = await res.json();
        if (res.ok && data.authenticated) {
          const token = saved || 'session';
          setAuthToken(token);
          setIsAuth(true);
          fetchOrders(token);
        } else {
          sessionStorage.removeItem('pos_admin_token');
          setAuthToken(null);
          setIsAuth(false);
        }
      } catch {
        sessionStorage.removeItem('pos_admin_token');
        setAuthToken(null);
        setIsAuth(false);
      } finally {
        setCheckingAuth(false);
      }
    }
    verifySession();
  }, [fetchOrders]);

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoginLoading(true);
    try {
      const res  = await fetch('/api/admin/login', {
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

  // ── WhatsApp URL Helper for Orders ──────────────────────────────────────────
  const getOrderWhatsAppUrl = (order: Order) => {
    const phone = order.customerPhone.replace(/\D/g, '').replace(/^0/, '62');
    let text = '';
    if (order.serialKey) {
      text =
        `Halo Kak ${order.customerName}! Terima kasih atas pesanannya di POS OFFLINE 😊\n\n` +
        `Berikut rincian aktivasi lisensi resmi Anda:\n` +
        `🏪 Nama Toko: ${order.storeName || '-'}\n` +
        `📱 Device ID: ${order.deviceId || '-'}\n` +
        `🔑 SERIAL KEY: ${order.serialKey}\n\n` +
        `Cara Aktivasi:\n` +
        `1. Buka aplikasi POS OFFLINE di HP Anda.\n` +
        `2. Salin dan tempelkan Serial Key di atas ke kolom yang tersedia.\n` +
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

  // ── Open Generator from Orders List ─────────────────────────────────────────
  const handleOpenGeneratorForOrder = (order: Order) => {
    setGenOrderId(order.id);
    if (order.deviceId) {
      setGenDeviceId(order.deviceId);
    }
    setGenError('');
    if (order.serialKey) {
      const waText =
        `Halo Kak ${order.customerName}! Terima kasih atas pesanannya di POS OFFLINE 😊\n\n` +
        `Berikut rincian aktivasi lisensi resmi Anda:\n` +
        `🏪 Nama Toko: ${order.storeName || '-'}\n` +
        `📱 Device ID: ${order.deviceId || '-'}\n` +
        `🔑 SERIAL KEY: ${order.serialKey}\n\n` +
        `Cara Aktivasi:\n` +
        `1. Buka aplikasi POS OFFLINE di HP Anda.\n` +
        `2. Salin dan tempelkan Serial Key di atas ke kolom yang tersedia.\n` +
        `3. Klik tombol "Aktivasi Aplikasi".\n\n` +
        `Aplikasi Anda langsung aktif permanen seumur hidup! ` +
        `Jika ada pertanyaan, jangan ragu hubungi kami kembali ya Kak. 🙏`;
      setGenResult({ serialKey: order.serialKey, waTemplate: waText });
    } else {
      setGenResult(null);
    }
    setTab('generator');
  };

  // ── Select Order in Generator Dropdown ──────────────────────────────────────
  const handleSelectGenOrder = (orderId: string) => {
    setGenOrderId(orderId);
    setGenError('');
    if (orderId) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        if (order.deviceId) {
          setGenDeviceId(order.deviceId);
        }
        if (order.serialKey) {
          const waText =
            `Halo Kak ${order.customerName}! Terima kasih atas pesanannya di POS OFFLINE 😊\n\n` +
            `Berikut rincian aktivasi lisensi resmi Anda:\n` +
            `🏪 Nama Toko: ${order.storeName || '-'}\n` +
            `📱 Device ID: ${order.deviceId || '-'}\n` +
            `🔑 SERIAL KEY: ${order.serialKey}\n\n` +
            `Cara Aktivasi:\n` +
            `1. Buka aplikasi POS OFFLINE di HP Anda.\n` +
            `2. Salin dan tempelkan Serial Key di atas ke kolom yang tersedia.\n` +
            `3. Klik tombol "Aktivasi Aplikasi".\n\n` +
            `Aplikasi Anda langsung aktif permanen seumur hidup! ` +
            `Jika ada pertanyaan, jangan ragu hubungi kami kembali ya Kak. 🙏`;
          setGenResult({ serialKey: order.serialKey, waTemplate: waText });
        } else {
          setGenResult(null);
        }
      }
    } else {
      setGenResult(null);
    }
  };

  // ── Generate key ──────────────────────────────────────────────────────────────
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenError(''); setGenResult(null);
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
      const res   = await fetch('/api/admin/generate-key', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body:    JSON.stringify({
          deviceId: rawInput,
          orderId: genOrderId || undefined,
          customerName: order?.customerName ?? '',
          storeName: order?.storeName ?? '',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGenResult({ serialKey: data.serialKey, waTemplate: data.whatsappTemplate });
      if (authToken) fetchOrders(authToken);
    } catch (err: unknown) {
      setGenError(err instanceof Error ? err.message : 'Gagal generate key.');
    } finally {
      setGenLoading(false);
    }
  };

  // ── Reset device ──────────────────────────────────────────────────────────────
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(''); setResetLoading(true);
    try {
      const res  = await fetch('/api/admin/reset-device', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body:    JSON.stringify({ orderId: resetOrder?.id, confirmPassword: resetPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResetOrder(null); setResetPw('');
      if (authToken) fetchOrders(authToken);
    } catch (err: unknown) {
      setResetError(err instanceof Error ? err.message : 'Reset gagal.');
    } finally {
      setResetLoading(false);
    }
  };

  // ── Derived ──────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = filter === 'all' || o.paymentStatus === filter;
      const q           = search.toLowerCase();
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

  const stats = useMemo(() => {
    const paid    = orders.filter((o) => o.paymentStatus === 'paid');
    const active  = orders.filter((o) => o.serialKey);
    const pending = orders.filter((o) => o.paymentStatus === 'pending');
    const revenue = paid.reduce((s, o) => s + o.amount, 0);
    return { total: orders.length, paid: paid.length, active: active.length, pending: pending.length, revenue };
  }, [orders]);

  // Checking session loader
  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight:      '100vh',
          background:     'linear-gradient(135deg, #1a1c2b 0%, #0f1117 100%)',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            12,
          fontFamily:     "'Plus Jakarta Sans', system-ui, sans-serif",
          color:          '#94a3b8',
        }}
      >
        <Loader2 size={32} style={{ color: T.green, animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: 13, fontWeight: 500 }}>Memverifikasi sesi admin...</span>
      </div>
    );
  }

  // Login Screen
  if (!isAuth) {
    return (
      <div
        style={{
          minHeight:      '100vh',
          background:     'linear-gradient(135deg, #1a1c2b 0%, #0f1117 100%)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        16,
          fontFamily:     "'Plus Jakarta Sans', system-ui, sans-serif",
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Image src="/icon.png" alt="Logo" width={36} height={36} style={{ borderRadius: 10 }} />
              <span style={{ fontSize: 20, fontWeight: 800, color: '#f0f1f8' }}>POS OFFLINE</span>
            </div>
            <div style={{ fontSize: 12, color: '#6b6f8e', marginTop: 4 }}>Admin Dashboard | Akses Terbatas</div>
          </div>

          <div
            style={{
              background:   T.white,
              border:       `1px solid ${T.border}`,
              borderRadius: 16,
              padding:      '32px 28px',
              boxShadow:    '0 8px 40px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ShieldCheck size={18} style={{ color: '#16a34a' }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.heading }}>Masuk ke Dashboard</div>
                <div style={{ fontSize: 11, color: T.muted }}>Khusus administrator</div>
              </div>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: T.body }}>Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: T.body }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: T.muted, display: 'flex',
                    }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {authError && (
                <div
                  style={{
                    background: '#fef2f2', border: '1px solid #fecaca',
                    borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626',
                    display: 'flex', alignItems: 'center', gap: 7,
                  }}
                >
                  <AlertCircle size={14} style={{ flexShrink: 0 }} /> {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                style={{
                  background:  T.dark,
                  color:       '#fff',
                  border:      'none',
                  borderRadius: 9,
                  padding:     '13px',
                  fontSize:    14,
                  fontWeight:  700,
                  cursor:      loginLoading ? 'not-allowed' : 'pointer',
                  opacity:     loginLoading ? 0.75 : 1,
                  display:     'flex',
                  alignItems:  'center',
                  justifyContent: 'center',
                  gap:         8,
                  fontFamily:  'inherit',
                  marginTop:   4,
                }}
              >
                {loginLoading
                  ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Memverifikasi...</>
                  : <><Lock size={14} /> Masuk ke Dashboard</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight:  '100vh',
        background: T.pageBg,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        color:      T.body,
      }}
    >
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <header
        style={{
          background:    T.dark,
          padding:       '0 clamp(16px, 4vw, 32px)',
          height:        56,
          display:       'flex',
          alignItems:    'center',
          justifyContent: 'space-between',
          position:      'sticky',
          top:           0,
          zIndex:        50,
          boxShadow:     '0 2px 12px rgba(0,0,0,0.2)',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src="/icon.png" alt="Logo" width={28} height={28} style={{ borderRadius: 7 }} />
          <span style={{ fontWeight: 800, fontSize: 15, color: '#f0f1f8' }}>POS OFFLINE</span>
          <span
            style={{
              fontSize: 9, fontWeight: 700, background: T.green,
              color: '#fff', padding: '2px 7px', borderRadius: 4, letterSpacing: '0.07em',
            }}
          >
            ADMIN
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => authToken && fetchOrders(authToken)}
            disabled={dataLoading}
            title="Refresh data"
            style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 7, padding: '6px 10px', color: '#94a3b8', cursor: 'pointer', display: 'flex',
            }}
          >
            <RefreshCw size={14} style={{ animation: dataLoading ? 'spin 1s linear infinite' : 'none' }} />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 7, padding: '6px 14px', color: '#fca5a5', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit',
            }}
          >
            <LogOut size={13} /> Keluar
          </button>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(20px, 3vw, 32px) clamp(16px, 4vw, 32px)' }}>

        {/* Page title */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: T.heading, margin: 0, letterSpacing: '-0.02em' }}>
            Dashboard Pesanan
          </h1>
          <p style={{ fontSize: 13, color: T.muted, margin: '4px 0 0' }}>
            Kelola semua transaksi dan lisensi POS OFFLINE
          </p>
        </div>

        {/* ── Stat Cards ──────────────────────────────────────────────────── */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap:                 14,
            marginBottom:        28,
          }}
        >
          <StatCard
            label="Total Pesanan"
            value={stats.total}
            icon={<Package size={20} />}
            accent={T.blue}
          />
          <StatCard
            label="Menunggu Bayar"
            value={stats.pending}
            icon={<AlertCircle size={20} />}
            accent={T.amber}
            sub={stats.pending > 0 ? 'Perlu tindak lanjut' : undefined}
          />
          <StatCard
            label="Lunas"
            value={stats.paid}
            icon={<CheckCircle size={20} />}
            accent={T.green}
          />
          <StatCard
            label="Lisensi Aktif"
            value={stats.active}
            icon={<Key size={20} />}
            accent={T.purple}
          />
          <StatCard
            label="Total Pendapatan"
            value={fmtCurrency(stats.revenue)}
            icon={<TrendingUp size={20} />}
            accent={T.green}
            sub="Semua transaksi lunas"
          />
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────────── */}
        <div
          style={{
            display:      'flex',
            gap:          4,
            background:   T.white,
            border:       `1px solid ${T.border}`,
            borderRadius: 10,
            padding:      4,
            marginBottom: 20,
            width:        'fit-content',
            boxShadow:    '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {(['orders', 'generator'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              style={{
                background:   tab === t ? T.dark : 'transparent',
                color:        tab === t ? '#fff' : T.muted,
                border:       'none',
                borderRadius: 7,
                padding:      '8px 20px',
                fontSize:     13,
                fontWeight:   700,
                cursor:       'pointer',
                fontFamily:   'inherit',
                display:      'flex',
                alignItems:   'center',
                gap:          6,
                transition:   'all 0.15s',
              }}
            >
              {t === 'orders' ? <><Users size={14} /> Daftar Pesanan</> : <><Key size={14} /> Generate Serial Key</>}
            </button>
          ))}
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ORDERS TAB                                                          */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {tab === 'orders' && (
          <>
            {/* Filter bar */}
            <div
              style={{
                display:      'flex',
                flexWrap:     'wrap',
                gap:          10,
                marginBottom: 16,
              }}
            >
              {/* Search */}
              <div style={{ flex: '1 1 220px', position: 'relative' }}>
                <Search
                  size={14}
                  style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    color: T.muted, pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  placeholder="Cari nama, email, no. HP, toko, order ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    ...inputStyle,
                    paddingLeft:  36,
                    background:   T.white,
                    boxShadow:    '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                />
              </div>

              {/* Status filters */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(['all', 'pending', 'paid', 'cancelled'] as const).map((s) => {
                  const labels = { all: 'Semua', pending: 'Menunggu', paid: 'Lunas', cancelled: 'Batal' };
                  const colors = { all: T.dark, pending: T.amber, paid: T.green, cancelled: T.red };
                  const active = filter === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFilter(s)}
                      style={{
                        background:   active ? colors[s] : T.white,
                        border:       `1px solid ${active ? colors[s] : T.border}`,
                        borderRadius: 8,
                        padding:      '7px 14px',
                        fontSize:     12,
                        fontWeight:   700,
                        color:        active ? '#fff' : T.body,
                        cursor:       'pointer',
                        fontFamily:   'inherit',
                        boxShadow:    '0 1px 3px rgba(0,0,0,0.04)',
                        transition:   'all 0.15s',
                      }}
                    >
                      {labels[s]}{' '}
                      <span style={{ opacity: active ? 0.8 : 0.5, fontSize: 11 }}>
                        ({s === 'all' ? orders.length : orders.filter((o) => o.paymentStatus === s).length})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Orders list */}
            {dataLoading ? (
              <div
                style={{
                  textAlign:    'center',
                  padding:      60,
                  color:        T.muted,
                  background:   T.white,
                  borderRadius: 14,
                  border:       `1px solid ${T.border}`,
                }}
              >
                <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 12px' }} />
                Memuat data pesanan...
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  textAlign:    'center',
                  padding:      60,
                  color:        T.muted,
                  background:   T.white,
                  borderRadius: 14,
                  border:       `1px solid ${T.border}`,
                  fontSize:     14,
                }}
              >
                {search ? `Tidak ada pesanan yang cocok dengan "${search}".` : 'Belum ada pesanan masuk.'}
              </div>
            ) : (
              <div
                style={{
                  background:   T.white,
                  border:       `1px solid ${T.border}`,
                  borderRadius: 14,
                  overflow:     'hidden',
                  boxShadow:    '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                {filtered.map((order, i) => {
                  const isExpanded = selectedOrder?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      style={{ borderTop: i === 0 ? 'none' : `1px solid ${T.border}` }}
                    >
                      {/* Row */}
                      <div
                        style={{
                          padding:    '14px 20px',
                          display:    'flex',
                          flexWrap:   'wrap',
                          gap:        '8px 20px',
                          alignItems: 'center',
                          cursor:     'pointer',
                          background: isExpanded ? T.surface : 'transparent',
                          transition: 'background 0.12s',
                        }}
                        onClick={() => setSelectedOrder(isExpanded ? null : order)}
                      >
                        <StatusBadge status={order.paymentStatus} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 140 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: T.heading }}>
                            {order.customerName}
                          </span>
                          <span style={{ fontSize: 11, color: T.muted, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Store size={10} /> {order.storeName ?? '-'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: T.body }}>
                          <Smartphone size={12} style={{ color: T.muted }} />
                          {order.customerPhone}
                        </div>

                        {order.customerEmail && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: T.body }}>
                            <Mail size={12} style={{ color: T.muted }} />
                            {order.customerEmail}
                          </div>
                        )}

                        {order.serialKey && (
                          <span
                            style={{
                              fontSize:   10,
                              fontWeight: 700,
                              background: '#ede9fe',
                              color:      '#7c3aed',
                              padding:    '2px 8px',
                              borderRadius: 4,
                              letterSpacing: '0.04em',
                            }}
                          >
                            ✓ AKTIF
                          </span>
                        )}

                        <div style={{ marginLeft: 'auto', textAlign: 'right', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: '#16a34a' }}>
                              {fmtCurrency(order.amount)}
                            </div>
                            <div style={{ fontSize: 11, color: T.muted, display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end', marginTop: 1 }}>
                              <Calendar size={10} />
                              {fmtDate(order.createdAt)}
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp size={16} style={{ color: T.muted }} /> : <ChevronDown size={16} style={{ color: T.muted }} />}
                        </div>
                      </div>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div
                          style={{
                            borderTop:  `1px solid ${T.border}`,
                            padding:    '18px 20px',
                            background: T.surface,
                            display:    'flex',
                            flexWrap:   'wrap',
                            gap:        20,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Info block */}
                          <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                            <InfoRow label="Order ID"        value={`#${order.id.slice(0, 8).toUpperCase()}`} copy={order.id} />
                            <InfoRow label="Bidang Usaha"    value={order.businessType ?? '-'} />
                            <InfoRow label="Email"           value={order.customerEmail ?? '-'} />
                            {order.deviceId  && <InfoRow label="Device ID"   value={order.deviceId}  copy={order.deviceId} />}
                            {order.serialKey && <InfoRow label="Serial Key"  value={order.serialKey} copy={order.serialKey} />}
                            {order.activatedAt && <InfoRow label="Aktivasi"  value={fmtDate(order.activatedAt)} />}
                            {order.emailSentAt && <InfoRow label="Email Dikirim" value={fmtDate(order.emailSentAt)} />}
                          </div>

                          {/* Action buttons */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                            {order.serialKey ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => copyText(order.serialKey!)}
                                  style={{
                                    background:   '#ede9fe',
                                    border:       '1px solid #c4b5fd',
                                    borderRadius: 8,
                                    padding:      '8px 16px',
                                    fontSize:     12,
                                    fontWeight:   700,
                                    color:        '#6d28d9',
                                    cursor:       'pointer',
                                    fontFamily:   'inherit',
                                    display:      'flex',
                                    alignItems:   'center',
                                    gap:          6,
                                  }}
                                >
                                  <Key size={13} /> Salin Serial Key
                                </button>

                                <a
                                  href={getOrderWhatsAppUrl(order)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    background:     '#f0fdf4',
                                    border:         `1px solid ${T.greenBd}`,
                                    borderRadius:   8,
                                    padding:        '7px 16px',
                                    fontSize:       12,
                                    fontWeight:     600,
                                    color:          '#16a34a',
                                    cursor:         'pointer',
                                    display:        'flex',
                                    alignItems:     'center',
                                    gap:            6,
                                    textDecoration: 'none',
                                  }}
                                >
                                  <MessageCircle size={13} style={{ color: '#25d366' }} /> Kirim WA Lisensi
                                </a>
                              </>
                            ) : order.paymentStatus === 'paid' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenGeneratorForOrder(order)}
                                  style={{
                                    background:   T.dark,
                                    border:       'none',
                                    borderRadius: 8,
                                    padding:      '8px 16px',
                                    fontSize:     12,
                                    fontWeight:   700,
                                    color:        '#fff',
                                    cursor:       'pointer',
                                    fontFamily:   'inherit',
                                    display:      'flex',
                                    alignItems:   'center',
                                    gap:          6,
                                  }}
                                >
                                  <Key size={13} /> Terbitkan Serial Key
                                </button>

                                <a
                                  href={getOrderWhatsAppUrl(order)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    background:     '#f0fdf4',
                                    border:         `1px solid ${T.greenBd}`,
                                    borderRadius:   8,
                                    padding:        '7px 16px',
                                    fontSize:       12,
                                    fontWeight:     600,
                                    color:          '#16a34a',
                                    cursor:         'pointer',
                                    display:        'flex',
                                    alignItems:     'center',
                                    gap:            6,
                                    textDecoration: 'none',
                                  }}
                                >
                                  <MessageCircle size={13} style={{ color: '#25d366' }} /> Hubungi via WA
                                </a>
                              </>
                            ) : (
                              <a
                                href={getOrderWhatsAppUrl(order)}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  background:     '#fef9c3',
                                  border:         '1px solid #fde68a',
                                  borderRadius:   8,
                                  padding:        '7px 16px',
                                  fontSize:       12,
                                  fontWeight:     600,
                                  color:          '#854d0e',
                                  cursor:         'pointer',
                                  display:        'flex',
                                  alignItems:     'center',
                                  gap:            6,
                                  textDecoration: 'none',
                                }}
                              >
                                <MessageCircle size={13} style={{ color: '#ca8a04' }} /> Follow Up WhatsApp
                              </a>
                            )}

                            {order.deviceId && (
                              <button
                                type="button"
                                onClick={() => setResetOrder(order)}
                                style={{
                                  background:   '#fef2f2',
                                  border:       '1px solid #fecaca',
                                  borderRadius: 8,
                                  padding:      '7px 16px',
                                  fontSize:     12,
                                  fontWeight:   600,
                                  color:        '#dc2626',
                                  cursor:       'pointer',
                                  fontFamily:   'inherit',
                                  display:      'flex',
                                  alignItems:   'center',
                                  gap:          6,
                                }}
                              >
                                <RotateCcw size={13} /> Reset Device
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* GENERATOR TAB                                                       */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {tab === 'generator' && (
          <div style={{ maxWidth: 620 }}>
            <div
              style={{
                background:   T.white,
                border:       `1px solid ${T.border}`,
                borderRadius: 16,
                padding:      '28px 24px',
                boxShadow:    '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Key size={18} style={{ color: T.purple }} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.heading }}>Generate Serial Key Lisensi</div>
                  <div style={{ fontSize: 12, color: T.muted }}>Untuk klaim manual oleh admin</div>
                </div>
              </div>

              <form onSubmit={handleGenerate} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Order selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: T.body }}>
                    Pilih Order (opsional)
                  </label>
                  <select
                    value={genOrderId}
                    onChange={(e) => handleSelectGenOrder(e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">(Generate tanpa order / standalone)</option>
                    {orders.filter((o) => o.paymentStatus === 'paid').map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.serialKey ? '✓ ' : '⚡ '}#{o.id.slice(0, 8).toUpperCase()} | {o.customerName} ({o.storeName ?? 'Tanpa toko'}) {o.serialKey ? '• (Sudah Ada Key)' : '• (Belum Ada Key)'}
                      </option>
                    ))}
                  </select>
                  <span style={{ fontSize: 11, color: T.muted }}>
                    Pilih order untuk otomatis menghubungkan Serial Key ke data pelanggan di database.
                  </span>
                </div>

                {/* Device ID with live format badge */}
                {(() => {
                  const cleanDev = genDeviceId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
                  const isDevValid = cleanDev.length >= 10;
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: T.body }}>
                          Device ID <span style={{ color: T.red }}>*</span>
                        </label>
                        {isDevValid && (
                          <span
                            style={{
                              fontSize:   11,
                              fontWeight: 700,
                              color:      '#16a34a',
                              display:    'inline-flex',
                              alignItems: 'center',
                              gap:        4,
                            }}
                          >
                            <Check size={12} /> Format Valid
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Contoh: POS-8F92-4B21-7A09"
                        value={genDeviceId}
                        onChange={(e) => {
                          setGenDeviceId(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''));
                          if (genError) setGenError('');
                        }}
                        style={{
                          ...inputStyle,
                          fontFamily:    'monospace',
                          fontSize:      15,
                          letterSpacing: '0.05em',
                          border:        genError
                            ? '1.5px solid #ef4444'
                            : isDevValid
                            ? '1.5px solid #22c55e'
                            : `1px solid ${T.border}`,
                          background:    genError ? '#fef2f2' : isDevValid ? '#f0fdf4' : T.white,
                          boxShadow:     isDevValid ? '0 0 0 3px rgba(34, 197, 94, 0.12)' : 'none',
                          transition:    'all 0.15s ease',
                        }}
                      />
                      <span style={{ fontSize: 11, color: T.muted }}>
                        Format standar POS OFFLINE: <code style={{ fontFamily: 'monospace', fontWeight: 700 }}>POS-XXXX-XXXX-XXXX</code>. Sistem otomatis menormalisasi jika prefix belum diketik.
                      </span>
                    </div>
                  );
                })()}

                {genError && (
                  <div
                    style={{
                      background: '#fef2f2', border: '1px solid #fecaca',
                      borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626',
                      display: 'flex', alignItems: 'center', gap: 7,
                    }}
                  >
                    <AlertCircle size={13} style={{ flexShrink: 0 }} /> {genError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={genLoading}
                  style={{
                    background:     T.dark,
                    color:          '#fff',
                    border:         'none',
                    borderRadius:   9,
                    padding:        '13px',
                    fontSize:       14,
                    fontWeight:     700,
                    cursor:         genLoading ? 'not-allowed' : 'pointer',
                    opacity:        genLoading ? 0.75 : 1,
                    fontFamily:     'inherit',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    gap:            8,
                  }}
                >
                  {genLoading
                    ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Memproses...</>
                    : <><Key size={15} /> Generate Serial Key</>}
                </button>
              </form>

              {/* Result */}
              {genResult && (
                <div
                  style={{
                    marginTop:    22,
                    background:   T.greenBg,
                    border:       `1px solid ${T.greenBd}`,
                    borderRadius: 12,
                    padding:      '20px',
                  }}
                >
                  <div
                    style={{
                      display:      'flex',
                      alignItems:   'center',
                      gap:          6,
                      marginBottom: 16,
                      color:        '#15803d',
                      fontWeight:   700,
                      fontSize:     13,
                    }}
                  >
                    <CheckCircle size={15} /> Serial Key Berhasil Dibuat
                  </div>

                  {/* Key display */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: T.muted, marginBottom: 6, fontWeight: 600 }}>SERIAL KEY:</div>
                    <div
                      style={{
                        display:      'flex',
                        alignItems:   'center',
                        justifyContent: 'space-between',
                        gap:          12,
                        background:   T.dark,
                        borderRadius: 9,
                        padding:      '12px 16px',
                        fontFamily:   'monospace',
                        fontSize:     20,
                        fontWeight:   800,
                        color:        T.green,
                        letterSpacing: '0.08em',
                      }}
                    >
                      {genResult.serialKey}
                      <CopyBtn text={genResult.serialKey} />
                    </div>
                  </div>

                  {/* WA Template */}
                  <div>
                    <div style={{ fontSize: 11, color: T.muted, marginBottom: 6, fontWeight: 600 }}>TEMPLATE WHATSAPP:</div>
                    <div
                      style={{
                        background:  T.white,
                        border:      `1px solid ${T.border}`,
                        borderRadius: 8,
                        padding:     '12px 14px',
                        fontSize:    12,
                        color:       T.body,
                        lineHeight:  1.7,
                        whiteSpace:  'pre-wrap',
                        maxHeight:   160,
                        overflowY:   'auto',
                      }}
                    >
                      {genResult.waTemplate}
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(genResult!.waTemplate)}
                      style={{
                        marginTop:  8,
                        background: 'rgba(37,211,102,0.08)',
                        border:     '1px solid rgba(37,211,102,0.25)',
                        borderRadius: 7,
                        padding:    '7px 14px',
                        fontSize:   12,
                        fontWeight: 600,
                        color:      '#16a34a',
                        cursor:     'pointer',
                        fontFamily: 'inherit',
                        display:    'flex',
                        alignItems: 'center',
                        gap:        6,
                      }}
                    >
                      <Copy size={13} /> Salin Template WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Reset Device Modal ───────────────────────────────────────────────── */}
      {resetOrder && (
        <div
          style={{
            position:       'fixed',
            inset:          0,
            background:     'rgba(0,0,0,0.5)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            zIndex:         100,
            padding:        16,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setResetOrder(null)}
        >
          <div
            style={{
              background:   T.white,
              border:       `1px solid ${T.border}`,
              borderRadius: 16,
              padding:      '28px 24px',
              maxWidth:     420,
              width:        '100%',
              boxShadow:    '0 16px 48px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <AlertCircle size={18} style={{ color: T.red }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.heading }}>Reset Device Lisensi</div>
                  <div style={{ fontSize: 11, color: T.muted }}>Tindakan tidak bisa dibatalkan</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResetOrder(null)}
                style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', display: 'flex' }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                background:   '#fef9c3',
                border:       '1px solid #fde68a',
                borderRadius: 8,
                padding:      '12px 14px',
                fontSize:     13,
                color:        '#854d0e',
                lineHeight:   1.6,
                marginBottom: 18,
              }}
            >
              Ini akan menghapus Device ID dan Serial Key dari order{' '}
              <strong style={{ color: T.heading }}>{resetOrder.customerName}</strong>.
              Pelanggan bisa klaim ulang Serial Key di HP baru melalui portal mereka.
            </div>

            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: T.body }}>
                  Konfirmasi Password Admin
                </label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password admin untuk konfirmasi"
                  value={resetPw}
                  onChange={(e) => setResetPw(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {resetError && (
                <div
                  style={{
                    background: '#fef2f2', border: '1px solid #fecaca',
                    borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626',
                  }}
                >
                  {resetError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setResetOrder(null)}
                  style={{
                    flex:         1,
                    background:   T.surface,
                    border:       `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding:      '11px',
                    fontSize:     13,
                    fontWeight:   600,
                    color:        T.body,
                    cursor:       'pointer',
                    fontFamily:   'inherit',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  style={{
                    flex:         1,
                    background:   T.red,
                    border:       'none',
                    borderRadius: 8,
                    padding:      '11px',
                    fontSize:     13,
                    fontWeight:   700,
                    color:        '#fff',
                    cursor:       resetLoading ? 'not-allowed' : 'pointer',
                    opacity:      resetLoading ? 0.75 : 1,
                    fontFamily:   'inherit',
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent: 'center',
                    gap:          6,
                  }}
                >
                  {resetLoading
                    ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Mereset...</>
                    : <><RotateCcw size={14} /> Ya, Reset Device</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
