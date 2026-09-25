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
  AlertCircle,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Store,
  Loader2,
  ExternalLink,
  Sparkles,
  Phone,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Order } from '@/lib/types';
import {
  T,
  inputStyle,
  fmtCurrency,
  fmtDate,
  copyText,
  statusBadgeConfig,
} from '@/lib/ui-tokens';

// ─── Status Badge Component ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: Order['paymentStatus'] }) {
  const s = statusBadgeConfig[status] ?? statusBadgeConfig.pending;
  const dotColor = status === 'paid' ? '#16a34a' : status === 'pending' ? '#d97706' : '#dc2626';

  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 11,
        fontWeight: 700,
        padding: '3px 9px',
        borderRadius: 99,
        letterSpacing: '0.03em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: dotColor,
          display: 'inline-block',
        }}
      />
      {s.label}
    </span>
  );
}

// ─── Copy Button Component ───────────────────────────────────────────────────

function CopyBtn({ text, label = 'Salin' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Salin ke clipboard"
      style={{
        background: copied ? '#dcfce7' : '#f1f5f9',
        border: `1px solid ${copied ? '#86efac' : '#e2e8f0'}`,
        borderRadius: 6,
        cursor: 'pointer',
        padding: '3px 8px',
        color: copied ? '#15803d' : '#475569',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 600,
        transition: 'all 0.15s ease',
        fontFamily: 'inherit',
      }}
    >
      {copied ? (
        <>
          <Check size={11} /> Disalin
        </>
      ) : (
        <>
          <Copy size={11} /> {label}
        </>
      )}
    </button>
  );
}

// ─── Stat Card Component ─────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  accent,
  sub,
  highlight = false,
  className = '',
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
  sub?: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`admin-stat-card ${className}`}
      style={{
        background: highlight
          ? 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
          : '#ffffff',
        border: `1px solid ${highlight ? '#86efac' : '#e2e8f0'}`,
        borderRadius: 14,
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: highlight
          ? '0 4px 14px -3px rgba(34, 197, 94, 0.15)'
          : '0 1px 3px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${accent}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accent,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 3, fontWeight: 500 }}>
          {label}
        </div>
        {sub && (
          <div
            style={{
              fontSize: 11,
              color: accent,
              fontWeight: 600,
              marginTop: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── InfoRow Component ───────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  copy,
  href,
}: {
  label: string;
  value: React.ReactNode;
  copy?: string;
  href?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        padding: '6px 0',
        borderBottom: '1px solid #f1f5f9',
        fontSize: 12,
      }}
    >
      <span style={{ color: '#64748b', minWidth: 105, flexShrink: 0 }}>{label}</span>
      <div
        style={{
          flex: 1,
          textAlign: 'right',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 6,
          wordBreak: 'break-all',
        }}
      >
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#0284c7',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {value} <ExternalLink size={11} />
          </a>
        ) : (
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{value}</span>
        )}
        {copy && <CopyBtn text={copy} label="" />}
      </div>
    </div>
  );
}

// ─── Main Admin Component ────────────────────────────────────────────────────

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
  const [orders, setOrders]                 = useState<Order[]>([]);
  const [dataLoading, setDataLoading]       = useState(false);
  const [search, setSearch]                 = useState('');
  const [filter, setFilter]                 = useState<'all' | 'paid' | 'pending' | 'cancelled'>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Generator state
  const [tab, setTab]                 = useState<'orders' | 'generator'>('orders');
  const [genDeviceId, setGenDeviceId] = useState('');
  const [genOrderId, setGenOrderId]   = useState('');
  const [genResult, setGenResult]     = useState<{ serialKey: string; waTemplate: string } | null>(null);
  const [genLoading, setGenLoading]   = useState(false);
  const [genError, setGenError]       = useState('');

  // Reset modal state
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

  // Login submit
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

  // WhatsApp helper
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

  // Switch to Generator for specific order
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select order in generator
  const handleSelectGenOrder = (orderId: string) => {
    setGenOrderId(orderId);
    setGenError('');
    if (orderId) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        if (order.deviceId) setGenDeviceId(order.deviceId);
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
  const stats = useMemo(() => {
    const paid = orders.filter((o) => o.paymentStatus === 'paid');
    const active = orders.filter((o) => o.serialKey);
    const pending = orders.filter((o) => o.paymentStatus === 'pending');
    const revenue = paid.reduce((s, o) => s + o.amount, 0);
    return {
      total: orders.length,
      paid: paid.length,
      active: active.length,
      pending: pending.length,
      revenue,
    };
  }, [orders]);

  // Checking session loader
  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          color: '#94a3b8',
        }}
      >
        <Loader2 size={36} style={{ color: '#22c55e', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: 14, fontWeight: 600 }}>Memverifikasi sesi admin...</span>
      </div>
    );
  }

  // Login Screen
  if (!isAuth) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(ellipse at 50% 20%, #1e293b 0%, #0f172a 60%, #020617 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        }}
      >
        <div style={{ width: '100%', maxWidth: 410 }}>
          {/* Logo Brand */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Image
                src="/icon.png"
                alt="Logo POS OFFLINE"
                width={40}
                height={40}
                style={{ borderRadius: 10, boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)' }}
              />
              <span style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                POS OFFLINE
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>
              Portal Manajemen Administrator
            </div>
          </div>

          {/* Login Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              padding: 'clamp(24px, 5vw, 36px) clamp(20px, 4vw, 30px)',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16a34a',
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Autentikasi Admin
                </h1>
                <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
                  Akses khusus staf internal
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Username
                </label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    ...inputStyle,
                    padding: '12px 14px',
                    fontSize: 14,
                    borderColor: '#cbd5e1',
                  }}
                  placeholder="Masukkan username admin"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      ...inputStyle,
                      padding: '12px 42px 12px 14px',
                      fontSize: 14,
                      borderColor: '#cbd5e1',
                    }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748b',
                      display: 'flex',
                      padding: 4,
                    }}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {authError && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 10,
                    padding: '11px 14px',
                    fontSize: 13,
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                style={{
                  background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '13px 18px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loginLoading ? 'not-allowed' : 'pointer',
                  opacity: loginLoading ? 0.75 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontFamily: 'inherit',
                  marginTop: 6,
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
                }}
              >
                {loginLoading ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Memverifikasi...
                  </>
                ) : (
                  <>
                    <Lock size={15} /> Masuk ke Dashboard
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Render Order Drawer Helper ──────────────────────────────────────────────
  const renderOrderDrawer = (order: Order) => {
    return (
      <div
        style={{
          padding: 'clamp(16px, 3vw, 24px) clamp(16px, 4vw, 24px)',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {/* Detail Transaksi Pelanggan */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '16px 18px',
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: '#64748b',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Informasi Transaksi & Pelanggan
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <InfoRow label="Order ID" value={`#${order.id.slice(0, 8).toUpperCase()}`} copy={order.id} />
              <InfoRow label="Nama Pemesan" value={order.customerName} />
              <InfoRow label="Nama Toko" value={order.storeName || '-'} />
              <InfoRow label="Kategori Usaha" value={order.businessType || '-'} />
              <InfoRow
                label="WhatsApp"
                value={order.customerPhone}
                href={`https://wa.me/${order.customerPhone.replace(/\D/g, '').replace(/^0/, '62')}`}
              />
              {order.customerEmail && (
                <InfoRow
                  label="Email"
                  value={order.customerEmail}
                  href={`mailto:${order.customerEmail}`}
                />
              )}
              <InfoRow label="Waktu Pesan" value={fmtDate(order.createdAt)} />
              {order.activatedAt && (
                <InfoRow label="Waktu Aktivasi" value={fmtDate(order.activatedAt)} />
              )}
            </div>
          </div>

          {/* Status Lisensi & Tindakan Administrator */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#64748b',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                Status Lisensi & Tindakan
              </div>

              {order.serialKey ? (
                <div>
                  {/* Credential Card */}
                  <div
                    style={{
                      background: '#0f172a',
                      borderRadius: 10,
                      padding: '14px 16px',
                      color: '#ffffff',
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 2 }}>
                      DEVICE ID TERDAFTAR:
                    </div>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: 13,
                        color: '#cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}
                    >
                      <span>{order.deviceId || '-'}</span>
                      {order.deviceId && <CopyBtn text={order.deviceId} />}
                    </div>

                    <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 2 }}>
                      SERIAL KEY AKTIF:
                    </div>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: 16,
                        fontWeight: 800,
                        color: '#4ade80',
                        letterSpacing: '0.05em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{order.serialKey}</span>
                      <CopyBtn text={order.serialKey} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <a
                      href={getOrderWhatsAppUrl(order)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#16a34a',
                        color: '#ffffff',
                        borderRadius: 8,
                        padding: '8px 14px',
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <MessageCircle size={14} /> Kirim WhatsApp Lisensi
                    </a>

                    {order.deviceId && (
                      <button
                        type="button"
                        onClick={() => setResetOrder(order)}
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          borderRadius: 8,
                          padding: '8px 14px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#dc2626',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <RotateCcw size={13} /> Reset Device
                      </button>
                    )}
                  </div>
                </div>
              ) : order.paymentStatus === 'paid' ? (
                <div>
                  <div
                    style={{
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: 10,
                      padding: '12px 14px',
                      fontSize: 12,
                      color: '#92400e',
                      marginBottom: 12,
                    }}
                  >
                    Pembayaran telah lunas. Pelanggan belum menerima Serial Key.
                    {order.deviceId ? ' Device ID sudah tersedia di bawah.' : ' Device ID belum diinput oleh pelanggan.'}
                  </div>

                  {order.deviceId && (
                    <div
                      style={{
                        fontSize: 12,
                        marginBottom: 12,
                        background: '#f1f5f9',
                        padding: '8px 12px',
                        borderRadius: 8,
                        fontFamily: 'monospace',
                      }}
                    >
                      Device ID: <strong>{order.deviceId}</strong>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenGeneratorForOrder(order)}
                      style={{
                        background: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '9px 16px',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontFamily: 'inherit',
                      }}
                    >
                      <Key size={14} /> Terbitkan Serial Key
                    </button>

                    <a
                      href={getOrderWhatsAppUrl(order)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#f0fdf4',
                        border: '1px solid #86efac',
                        borderRadius: 8,
                        padding: '8px 14px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#16a34a',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <MessageCircle size={14} /> Hubungi via WA
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: 10,
                      padding: '12px 14px',
                      fontSize: 12,
                      color: '#991b1b',
                      marginBottom: 12,
                    }}
                  >
                    Pesanan ini belum diselesaikan pembayarannya. Anda dapat menghubungi pelanggan untuk follow up via WhatsApp.
                  </div>

                  <a
                    href={getOrderWhatsAppUrl(order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#fef9c3',
                      border: '1px solid #fde68a',
                      borderRadius: 8,
                      padding: '8px 14px',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#854d0e',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <MessageCircle size={14} style={{ color: '#ca8a04' }} /> Follow Up WhatsApp Pelanggan
                  </a>
                </div>
              )}
            </div>

            <div style={{ fontSize: 11, color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
              Status: <strong>{order.paymentStatus.toUpperCase()}</strong> · Nominal: <strong>{fmtCurrency(order.amount)}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // DASHBOARD MAIN
  // ─────────────────────────────────────────────────────────────────────────────

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
      `}</style>

      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <header
        style={{
          background: '#0f172a',
          borderBottom: '1px solid #1e293b',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 clamp(16px, 4vw, 28px)',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image
              src="/icon.png"
              alt="Logo"
              width={30}
              height={30}
              style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(34, 197, 94, 0.25)' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                POS OFFLINE
              </span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#4ade80',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '2px 7px',
                  borderRadius: 4,
                  letterSpacing: '0.08em',
                }}
              >
                ADMIN
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={() => authToken && fetchOrders(authToken)}
              disabled={dataLoading}
              title="Perbarui Data"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 8,
                padding: '7px 12px',
                color: '#cbd5e1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              <RefreshCw
                size={13}
                style={{ animation: dataLoading ? 'spin 1s linear infinite' : 'none' }}
              />
              <span style={{ display: 'inline-block' }}>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 8,
                padding: '7px 12px',
                color: '#fca5a5',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              <LogOut size={13} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Container ─────────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: 'clamp(20px, 3vw, 32px) clamp(14px, 4vw, 28px)',
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

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              background: '#e2e8f0',
              padding: 3,
              borderRadius: 10,
              gap: 2,
            }}
          >
            <button
              type="button"
              onClick={() => setTab('orders')}
              style={{
                background: tab === 'orders' ? '#ffffff' : 'transparent',
                color: tab === 'orders' ? '#0f172a' : '#64748b',
                border: 'none',
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                boxShadow: tab === 'orders' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Package size={14} style={{ color: tab === 'orders' ? '#16a34a' : 'inherit' }} />
              <span>Daftar Pesanan</span>
              <span
                style={{
                  fontSize: 11,
                  background: tab === 'orders' ? '#f1f5f9' : 'rgba(0,0,0,0.06)',
                  padding: '1px 6px',
                  borderRadius: 99,
                  fontWeight: 800,
                }}
              >
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTab('generator')}
              style={{
                background: tab === 'generator' ? '#ffffff' : 'transparent',
                color: tab === 'generator' ? '#0f172a' : '#64748b',
                border: 'none',
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                boxShadow: tab === 'generator' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Key size={14} style={{ color: tab === 'generator' ? '#7c3aed' : 'inherit' }} />
              <span>Generate Serial Key</span>
            </button>
          </div>
        </div>

        {/* ── Stat Cards Grid ──────────────────────────────────────────────── */}
        <div className="admin-stats-grid">
          <StatCard
            label="Total Pesanan"
            value={stats.total}
            icon={<Package size={20} />}
            accent="#2563eb"
            sub="Semua data"
          />
          <StatCard
            label="Menunggu Bayar"
            value={stats.pending}
            icon={<Clock size={20} />}
            accent="#d97706"
            sub={stats.pending > 0 ? 'Perlu follow-up' : 'Semua beres'}
          />
          <StatCard
            label="Pembayaran Lunas"
            value={stats.paid}
            icon={<CheckCircle size={20} />}
            accent="#16a34a"
            sub="Terverifikasi"
          />
          <StatCard
            label="Lisensi Aktif"
            value={stats.active}
            icon={<Key size={20} />}
            accent="#7c3aed"
            sub="Sudah terbit key"
          />
          <StatCard
            label="Total Pendapatan"
            value={fmtCurrency(stats.revenue)}
            icon={<TrendingUp size={20} />}
            accent="#16a34a"
            sub="Dari pesanan lunas"
            highlight={true}
            className="admin-stat-highlight"
          />
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ORDERS TAB                                                          */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {tab === 'orders' && (
          <div>
            {/* Search & Filter Bar */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 12,
                  justifyContent: 'space-between',
                }}
              >
                {/* Search Input */}
                <div style={{ flex: '1 1 260px', position: 'relative' }}>
                  <Search
                    size={15}
                    style={{
                      position: 'absolute',
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Cari nama, WhatsApp, email, toko, atau order ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      ...inputStyle,
                      paddingLeft: 40,
                      paddingRight: search ? 36 : 14,
                      background: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: 10,
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                    }}
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        padding: 4,
                        display: 'flex',
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filter Pills (Scrollable on mobile) */}
                <div
                  className="no-scrollbar"
                  style={{
                    display: 'flex',
                    gap: 6,
                    overflowX: 'auto',
                    paddingBottom: 2,
                    maxWidth: '100%',
                  }}
                >
                  {(
                    [
                      { key: 'all', label: 'Semua', count: orders.length, color: '#0f172a' },
                      {
                        key: 'pending',
                        label: 'Menunggu',
                        count: orders.filter((o) => o.paymentStatus === 'pending').length,
                        color: '#d97706',
                      },
                      {
                        key: 'paid',
                        label: 'Lunas',
                        count: orders.filter((o) => o.paymentStatus === 'paid').length,
                        color: '#16a34a',
                      },
                      {
                        key: 'cancelled',
                        label: 'Batal',
                        count: orders.filter((o) => o.paymentStatus === 'cancelled').length,
                        color: '#dc2626',
                      },
                    ] as const
                  ).map((s) => {
                    const active = filter === s.key;
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setFilter(s.key)}
                        style={{
                          background: active ? s.color : '#ffffff',
                          border: `1px solid ${active ? s.color : '#cbd5e1'}`,
                          borderRadius: 8,
                          padding: '7px 13px',
                          fontSize: 12,
                          fontWeight: 700,
                          color: active ? '#ffffff' : '#475569',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          whiteSpace: 'nowrap',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                          transition: 'all 0.15s ease',
                          flexShrink: 0,
                        }}
                      >
                        <span>{s.label}</span>
                        <span
                          style={{
                            fontSize: 10,
                            padding: '1px 6px',
                            borderRadius: 99,
                            background: active ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                            color: active ? '#ffffff' : '#64748b',
                            fontWeight: 800,
                          }}
                        >
                          {s.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Orders Content Area */}
            {dataLoading ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '70px 20px',
                  color: '#64748b',
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #e2e8f0',
                }}
              >
                <Loader2
                  size={32}
                  style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 12px', color: '#16a34a' }}
                />
                <span style={{ fontSize: 14, fontWeight: 600 }}>Memuat daftar pesanan...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '70px 20px',
                  color: '#64748b',
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #e2e8f0',
                }}
              >
                <Package size={40} style={{ color: '#cbd5e1', margin: '0 auto 12px', display: 'block' }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                  {search ? `Tidak ada pesanan cocok dengan "${search}"` : 'Belum ada data pesanan.'}
                </div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                  {search ? 'Coba gunakan kata kunci pencarian yang lain.' : 'Pesanan dari checkout akan muncul di sini.'}
                </div>
              </div>
            ) : (
              <div>
                {/* ── Desktop Table View ──────────────────────────────────── */}
                <div
                  className="desktop-only-table"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  {/* Table Header */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '110px 1.5fr 1.3fr 130px 130px 42px',
                      gap: 16,
                      padding: '12px 20px',
                      background: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0',
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#64748b',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <div>Status</div>
                    <div>Pelanggan & Toko</div>
                    <div>Kontak</div>
                    <div>Lisensi</div>
                    <div style={{ textAlign: 'right' }}>Total</div>
                    <div />
                  </div>

                  {/* Table Body */}
                  {filtered.map((order, i) => {
                    const isExpanded = selectedOrderId === order.id;
                    return (
                      <div
                        key={order.id}
                        style={{ borderTop: i === 0 ? 'none' : '1px solid #e2e8f0' }}
                      >
                        <div
                          className={`admin-order-row ${isExpanded ? 'active' : ''}`}
                          onClick={() => setSelectedOrderId(isExpanded ? null : order.id)}
                        >
                          {/* Col 1: Status */}
                          <div>
                            <StatusBadge status={order.paymentStatus} />
                          </div>

                          {/* Col 2: Pelanggan */}
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                              {order.customerName}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                marginTop: 2,
                              }}
                            >
                              <Store size={11} style={{ flexShrink: 0 }} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {order.storeName || '-'}
                              </span>
                            </div>
                          </div>

                          {/* Col 3: Kontak */}
                          <div style={{ fontSize: 12 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                color: '#334155',
                                fontWeight: 500,
                              }}
                            >
                              <Phone size={11} style={{ color: '#16a34a' }} />
                              {order.customerPhone}
                            </div>
                            {order.customerEmail && (
                              <div
                                style={{
                                  fontSize: 11,
                                  color: '#94a3b8',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  marginTop: 2,
                                }}
                              >
                                {order.customerEmail}
                              </div>
                            )}
                          </div>

                          {/* Col 4: Lisensi */}
                          <div>
                            {order.serialKey ? (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 800,
                                  background: '#ede9fe',
                                  color: '#6d28d9',
                                  padding: '3px 8px',
                                  borderRadius: 6,
                                  letterSpacing: '0.04em',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                              >
                                <Check size={10} /> AKTIF
                              </span>
                            ) : order.paymentStatus === 'paid' ? (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 800,
                                  background: '#fef3c7',
                                  color: '#b45309',
                                  padding: '3px 8px',
                                  borderRadius: 6,
                                  letterSpacing: '0.04em',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                              >
                                ⚡ BUTUH KEY
                              </span>
                            ) : (
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>-</span>
                            )}
                          </div>

                          {/* Col 5: Total & Date */}
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#16a34a' }}>
                              {fmtCurrency(order.amount)}
                            </div>
                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                              {fmtDate(order.createdAt).split(',')[0]}
                            </div>
                          </div>

                          {/* Col 6: Chevron */}
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {isExpanded ? (
                              <ChevronUp size={16} style={{ color: '#64748b' }} />
                            ) : (
                              <ChevronDown size={16} style={{ color: '#94a3b8' }} />
                            )}
                          </div>
                        </div>

                        {/* Expanded Details Drawer */}
                        {isExpanded && renderOrderDrawer(order)}
                      </div>
                    );
                  })}
                </div>

                {/* ── Mobile Order Cards ─────────────────────────────────── */}
                <div className="mobile-only-cards">
                  {filtered.map((order) => {
                    const isExpanded = selectedOrderId === order.id;
                    return (
                      <div
                        key={order.id}
                        style={{
                          background: '#ffffff',
                          borderRadius: 14,
                          border: `1px solid ${isExpanded ? '#86efac' : '#e2e8f0'}`,
                          overflow: 'hidden',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                          transition: 'border-color 0.15s ease',
                        }}
                      >
                        {/* Mobile Card Header */}
                        <div
                          style={{
                            padding: '14px 16px',
                            cursor: 'pointer',
                          }}
                          onClick={() => setSelectedOrderId(isExpanded ? null : order.id)}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: 8,
                            }}
                          >
                            <StatusBadge status={order.paymentStatus} />
                            <span style={{ fontSize: 13, fontWeight: 800, color: '#16a34a' }}>
                              {fmtCurrency(order.amount)}
                            </span>
                          </div>

                          <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                            {order.customerName}
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 8,
                              marginTop: 4,
                              fontSize: 12,
                              color: '#64748b',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Store size={12} />
                              <span>{order.storeName || '-'}</span>
                            </div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>
                              {fmtDate(order.createdAt).split(',')[0]}
                            </div>
                          </div>

                          {/* Quick Toolbar */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginTop: 12,
                              paddingTop: 10,
                              borderTop: '1px solid #f1f5f9',
                            }}
                          >
                            <div>
                              {order.serialKey ? (
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    background: '#ede9fe',
                                    color: '#6d28d9',
                                    padding: '2px 8px',
                                    borderRadius: 6,
                                  }}
                                >
                                  ✓ Lisensi Aktif
                                </span>
                              ) : order.paymentStatus === 'paid' ? (
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    background: '#fef3c7',
                                    color: '#b45309',
                                    padding: '2px 8px',
                                    borderRadius: 6,
                                  }}
                                >
                                  ⚡ Butuh Serial Key
                                </span>
                              ) : (
                                <span style={{ fontSize: 11, color: '#94a3b8' }}>Belum Dibayar</span>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <a
                                href={getOrderWhatsAppUrl(order)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  background: '#f0fdf4',
                                  border: '1px solid #bbf7d0',
                                  borderRadius: 6,
                                  padding: '4px 10px',
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: '#16a34a',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                              >
                                <MessageCircle size={12} style={{ color: '#25d366' }} /> WhatsApp
                              </a>

                              <span
                                style={{
                                  fontSize: 11,
                                  color: '#64748b',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                  fontWeight: 600,
                                }}
                              >
                                {isExpanded ? 'Tutup' : 'Detail'}
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Drawer for Mobile */}
                        {isExpanded && renderOrderDrawer(order)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* GENERATOR TAB                                                       */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {tab === 'generator' && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 18,
                padding: 'clamp(20px, 4vw, 32px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: '#ede9fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#7c3aed',
                    flexShrink: 0,
                  }}
                >
                  <Key size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Generate Serial Key Lisensi
                  </h2>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
                    Penerbitan lisensi manual oleh administrator
                  </p>
                </div>
              </div>

              <form onSubmit={handleGenerate} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Order Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Hubungkan ke Pesanan (Disarankan)
                  </label>
                  <select
                    value={genOrderId}
                    onChange={(e) => handleSelectGenOrder(e.target.value)}
                    style={{
                      ...inputStyle,
                      padding: '11px 14px',
                      fontSize: 13,
                      borderColor: '#cbd5e1',
                      borderRadius: 10,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">(Generate Standalone / Tanpa Terhubung Pesanan)</option>
                    {orders
                      .filter((o) => o.paymentStatus === 'paid')
                      .map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.serialKey ? '✓ ' : '⚡ '}#{o.id.slice(0, 8).toUpperCase()} · {o.customerName} ({o.storeName || 'Tanpa Toko'}) {o.serialKey ? '• (Sudah Ada Key)' : '• (Perlu Key)'}
                        </option>
                      ))}
                  </select>
                  <span style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                    Memilih pesanan akan otomatis menyimpan Serial Key ke database pelanggan bersangkutan.
                  </span>
                </div>

                {/* Device ID Input with Format Validation */}
                {(() => {
                  const cleanDev = genDeviceId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
                  const isDevValid = cleanDev.length >= 10;
                  return (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
                          Device ID Perangkat <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        {isDevValid && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: '#16a34a',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
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
                          fontFamily: 'monospace',
                          fontSize: 15,
                          letterSpacing: '0.05em',
                          padding: '12px 14px',
                          borderRadius: 10,
                          borderColor: genError
                            ? '#ef4444'
                            : isDevValid
                            ? '#22c55e'
                            : '#cbd5e1',
                          background: genError ? '#fef2f2' : isDevValid ? '#f0fdf4' : '#ffffff',
                          boxShadow: isDevValid ? '0 0 0 3px rgba(34, 197, 94, 0.12)' : 'none',
                          transition: 'all 0.15s ease',
                        }}
                      />
                      <span style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                        Device ID diperoleh pelanggan dari layar aktivasi di aplikasi Android POS OFFLINE.
                      </span>
                    </div>
                  );
                })()}

                {genError && (
                  <div
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: 10,
                      padding: '11px 14px',
                      fontSize: 13,
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <AlertCircle size={15} style={{ flexShrink: 0 }} />
                    <span>{genError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={genLoading}
                  style={{
                    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '13px 18px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: genLoading ? 'not-allowed' : 'pointer',
                    opacity: genLoading ? 0.75 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontFamily: 'inherit',
                    marginTop: 4,
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                  }}
                >
                  {genLoading ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Memproses Lisensi...
                    </>
                  ) : (
                    <>
                      <Key size={15} /> Terbitkan Serial Key Sekarang
                    </>
                  )}
                </button>
              </form>

              {/* Generator Result Display */}
              {genResult && (
                <div
                  style={{
                    marginTop: 24,
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: 14,
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: '#15803d',
                      fontWeight: 800,
                      fontSize: 14,
                      marginBottom: 16,
                    }}
                  >
                    <CheckCircle size={17} /> Serial Key Berhasil Diterbitkan!
                  </div>

                  {/* Serial Key Box */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                      SERIAL KEY AKTIVASI RESMI:
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        background: '#0f172a',
                        borderRadius: 10,
                        padding: '14px 18px',
                        fontFamily: 'monospace',
                        fontSize: 18,
                        fontWeight: 800,
                        color: '#4ade80',
                        letterSpacing: '0.08em',
                      }}
                    >
                      <span style={{ wordBreak: 'break-all' }}>{genResult.serialKey}</span>
                      <CopyBtn text={genResult.serialKey} label="Salin Key" />
                    </div>
                  </div>

                  {/* WhatsApp Template Box */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                      TEMPLATE PESAN WHATSAPP PELANGGAN:
                    </div>
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        padding: '12px 14px',
                        fontSize: 12,
                        color: '#334155',
                        lineHeight: 1.7,
                        whiteSpace: 'pre-wrap',
                        maxHeight: 160,
                        overflowY: 'auto',
                      }}
                    >
                      {genResult.waTemplate}
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => copyText(genResult.waTemplate)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: 8,
                          padding: '8px 14px',
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#334155',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Copy size={13} /> Salin Pesan
                      </button>

                      {(() => {
                        const linkedOrder = orders.find((o) => o.id === genOrderId);
                        if (linkedOrder) {
                          return (
                            <a
                              href={getOrderWhatsAppUrl(linkedOrder)}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                background: '#25d366',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: 8,
                                padding: '8px 16px',
                                fontSize: 12,
                                fontWeight: 700,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                              }}
                            >
                              <MessageCircle size={14} /> Buka WhatsApp Pelanggan
                            </a>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>



      {/* ── Reset Device Modal ───────────────────────────────────────────────── */}
      {resetOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 16,
            backdropFilter: 'blur(6px)',
          }}
          onClick={() => setResetOrder(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 18,
              padding: '28px 24px',
              maxWidth: 440,
              width: '100%',
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: '#fef2f2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#dc2626',
                  }}
                >
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Reset Device Lisensi
                  </h3>
                  <p style={{ fontSize: 12, color: '#dc2626', margin: '2px 0 0', fontWeight: 600 }}>
                    Tindakan permanen / tidak bisa dibatalkan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResetOrder(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 10,
                padding: '12px 14px',
                fontSize: 13,
                color: '#92400e',
                lineHeight: 1.6,
                marginBottom: 18,
              }}
            >
              Device ID dan Serial Key pada pesanan <strong>{resetOrder.customerName}</strong> ({resetOrder.storeName || 'Toko'}) akan dihapus dari sistem. Pelanggan dapat mendaftarkan HP barunya kembali melalui portal aktivasi mandiri.
            </div>

            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Konfirmasi Password Admin
                </label>
                <input
                  type="password"
                  required
                  placeholder="Ketik password admin Anda..."
                  value={resetPw}
                  onChange={(e) => setResetPw(e.target.value)}
                  style={{ ...inputStyle, padding: '11px 14px', fontSize: 13, borderColor: '#cbd5e1' }}
                />
              </div>

              {resetError && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 8,
                    padding: '10px 14px',
                    fontSize: 13,
                    color: '#dc2626',
                  }}
                >
                  {resetError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setResetOrder(null)}
                  style={{
                    flex: 1,
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    padding: '12px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#475569',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  style={{
                    flex: 1,
                    background: '#dc2626',
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#ffffff',
                    cursor: resetLoading ? 'not-allowed' : 'pointer',
                    opacity: resetLoading ? 0.75 : 1,
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  {resetLoading ? (
                    <>
                      <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Mereset...
                    </>
                  ) : (
                    <>
                      <RotateCcw size={15} /> Ya, Reset Device
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
