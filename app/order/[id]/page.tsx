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
  MessageCircle,
  Clock,
  Loader2,
  ExternalLink,
  Check,
  AlertCircle,
  Zap,
  RefreshCw,
  CreditCard,
} from 'lucide-react';

import { Order, PACKAGES, ADMIN_CONTACTS } from '@/lib/types';

function fmtCurrency(n: number) {
  return `Rp ${n.toLocaleString('id-ID')}`;
}

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = use(params);

  const [order, setOrder]               = useState<Order | null>(null);
  const [loading, setLoading]           = useState(true);
  const [deviceIdInput, setDeviceId]    = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [serialKey, setSerialKey]       = useState('');
  const [copiedKey, setCopiedKey]       = useState(false);
  const [claimError, setClaimError]     = useState('');
  const [syncLoading, setSyncLoading]   = useState(false);
  const [syncMessage, setSyncMessage]   = useState<{ text: string; type: 'info' | 'success' | 'warn' } | null>(null);

  // ── Fetch order ─────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch(`/api/order/${orderId}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
          if (data.order.serialKey) {
            setSerialKey(data.order.serialKey);
            setClaimSuccess(true);
            setDeviceId(data.order.deviceId ?? '');
          }
        }
      } catch (e) {
        console.error('[OrderPage] fetch error:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  // ── Poll every 4s until paid ─────────────────────────────────────────────────
  useEffect(() => {
    if (!order || order.paymentStatus === 'paid') return;
    const id = setInterval(async () => {
      try {
        const res  = await fetch(`/api/order/${orderId}`);
        const data = await res.json();
        if (data.order?.paymentStatus === 'paid') {
          setOrder(data.order);
          clearInterval(id);
        }
      } catch { /* silent */ }
    }, 4_000);
    return () => clearInterval(id);
  }, [order, orderId]);

  // ── Manual Payment Status Verification ───────────────────────────────────────
  const handleManualSync = async () => {
    setSyncLoading(true);
    setSyncMessage(null);
    try {
      const res = await fetch(`/api/order/${orderId}`, { method: 'POST' });
      const data = await res.json();
      if (data.isPaid) {
        const fullRes = await fetch(`/api/order/${orderId}`);
        const fullData = await fullRes.json();
        if (fullData.order) {
          setOrder(fullData.order);
        }
        setSyncMessage({
          text: 'Pembayaran berhasil dikonfirmasi! Silakan lanjutkan klaim Serial Key di bawah.',
          type: 'success',
        });
      } else {
        setSyncMessage({
          text: 'Pembayaran belum terdeteksi di Mayar. Jika baru saja transfer/scan QRIS, tunggu beberapa detik lalu cek kembali.',
          type: 'warn',
        });
      }
    } catch {
      setSyncMessage({ text: 'Gagal mengecek status ke server. Silakan coba beberapa saat lagi.', type: 'warn' });
    } finally {
      setSyncLoading(false);
    }
  };


  // ── Claim license ─────────────────────────────────────────────────────────────
  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimError('');

    const rawInput = deviceIdInput.trim().toUpperCase();
    if (!rawInput) {
      setClaimError('Mohon masukkan Device ID yang tertera di layar aplikasi POS OFFLINE Anda.');
      return;
    }

    const cleanChars = rawInput.replace(/[^A-Z0-9]/g, '');
    if (cleanChars.length < 8) {
      setClaimError(
        'Format Device ID tidak valid. Contoh yang benar: POS-8F92-4B21-7A09 (lihat di layar aplikasi HP Anda).'
      );
      return;
    }

    setClaimLoading(true);
    try {
      const res  = await fetch('/api/claim-key', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ orderId, deviceId: rawInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal memproses klaim lisensi.');
      setSerialKey(data.serialKey);
      setClaimSuccess(true);
      setOrder((prev) =>
        prev ? { ...prev, deviceId: data.deviceId, serialKey: data.serialKey, paymentStatus: 'paid' } : prev
      );
    } catch (err: unknown) {
      setClaimError(err instanceof Error ? err.message : 'Gagal memproses Device ID.');
    } finally {
      setClaimLoading(false);
    }
  };


  const copyKey = () => {
    navigator.clipboard.writeText(serialKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2_500);
  };

  const pkg    = order ? PACKAGES[order.packageType] : PACKAGES.software_only;
  const isPaid = order?.paymentStatus === 'paid';
  const directApkUrl = isPaid
    ? `/api/download/apk?orderId=${orderId}`
    : (process.env.NEXT_PUBLIC_APK_DRIVE_URL || '');

  const cleanDeviceInput = deviceIdInput.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const isCompleteFormat = cleanDeviceInput.length >= 10;

  const statusBg = claimSuccess ? '#dcfce7' : isPaid ? '#fef3c7' : '#f0f2ff';

  const statusTx = claimSuccess ? '#15803d' : isPaid ? '#92400e' : '#3730a3';
  const statusLabel = claimSuccess
    ? '✓ AKTIF'
    : isPaid
    ? 'MENUNGGU AKTIVASI'
    : '🔄 MENUNGGU PEMBAYARAN';

  // Inline design tokens (light, clean, professional)
  const C = {
    bg:      '#f4f6fb',
    white:   '#ffffff',
    border:  '#e2e5f0',
    text:    '#0f1023',
    muted:   '#6b6f8e',
    dim:     '#9599b8',
    green:   '#22c55e',
    greenBg: '#f0fdf4',
    greenBd: '#bbf7d0',
    dark:    '#0d0e18',
  };

  const card: React.CSSProperties = {
    background:   C.white,
    border:       `1px solid ${C.border}`,
    borderRadius: 14,
    padding:      '22px 24px',
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight:      '100vh',
          background:     C.bg,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontFamily:     "'Plus Jakarta Sans', system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: 'center', color: C.muted }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 14 }}>Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight:  '100vh',
        background: C.bg,
        padding:    'clamp(24px, 5vw, 56px) clamp(16px, 4vw, 32px)',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth:      600,
          margin:        '0 auto',
          display:       'flex',
          flexDirection: 'column',
          gap:           16,
        }}
      >

        {/* ── Brand header ─────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', paddingBottom: 8 }}>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20, textDecoration: 'none' }}
          >
            <Image src="/icon.png" alt="POS OFFLINE" width={28} height={28} style={{ borderRadius: 8 }} />
            <span style={{ fontWeight: 800, fontSize: 15, color: C.text }}>POS OFFLINE</span>
          </Link>

          <div
            style={{
              width:          52,
              height:         52,
              borderRadius:   '50%',
              background:     C.greenBg,
              border:         `2px solid ${C.greenBd}`,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              margin:         '0 auto 14px',
            }}
          >
            <CheckCircle2 size={26} style={{ color: '#16a34a' }} />
          </div>

          <h1 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, color: C.text, margin: '0 0 8px' }}>
            Pesanan Berhasil Dibuat!
          </h1>
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
            No. Pesanan:{' '}
            <code style={{ fontFamily: 'monospace', fontWeight: 700, color: '#16a34a' }}>
              #{orderId.slice(0, 8).toUpperCase()}
            </code>
          </p>
        </div>

        {/* ── Order summary ─────────────────────────────────────────────────── */}
        <div style={card}>
          <div
            style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
              marginBottom:   14,
              paddingBottom:  12,
              borderBottom:   `1px solid ${C.border}`,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Rincian Pembelian</span>
            <span
              style={{
                fontSize:      10,
                fontWeight:    700,
                padding:       '3px 10px',
                borderRadius:  99,
                background:    statusBg,
                color:         statusTx,
                letterSpacing: '0.05em',
              }}
            >
              {statusLabel}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13 }}>
            <SummaryRow label="Paket"    value={pkg.name} color={C} />
            <SummaryRow label="Pembeli"  value={order?.customerName ?? '-'} color={C} />
            <SummaryRow label="WhatsApp" value={order?.customerPhone ?? '-'} mono color={C} />
            {order?.storeName && <SummaryRow label="Toko" value={order.storeName} color={C} />}
            <div
              style={{
                display:        'flex',
                justifyContent: 'space-between',
                alignItems:     'baseline',
                paddingTop:     12,
                borderTop:      `1px solid ${C.border}`,
              }}
            >
              <span style={{ fontWeight: 700, color: C.text }}>Total Dibayar:</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#16a34a' }}>
                {fmtCurrency(pkg.price)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Pending: waiting for payment ──────────────────────────────────── */}
        {!isPaid && (
          <div style={{ ...card, background: '#fffbf0', border: '1px solid #fde68a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Clock size={18} style={{ color: '#d97706', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Menunggu Konfirmasi Pembayaran</div>
                <div style={{ fontSize: 11, color: C.muted }}>
                  Halaman ini otomatis update saat pembayaran dikonfirmasi
                </div>
              </div>
            </div>

            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 14 }}>
              Setelah pembayaran dikonfirmasi oleh sistem (&lt;10 menit),{' '}
              <strong>link APK + portal aktivasi akan otomatis dikirim ke email Anda</strong>.
              Tidak perlu konfirmasi manual ke admin untuk produk digital ini.
            </p>

            {/* ── Action buttons: Pay now & Sync status ─────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {order?.mayarPaymentUrl && (
                <a
                  href={order.mayarPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    gap:             8,
                    background:      '#16a34a',
                    color:           '#fff',
                    borderRadius:    10,
                    padding:         '12px 16px',
                    fontSize:        13,
                    fontWeight:      800,
                    textDecoration:  'none',
                    boxShadow:       '0 2px 10px rgba(22, 163, 74, 0.25)',
                    transition:      'transform 0.15s ease',
                  }}
                >
                  <CreditCard size={16} />
                  Buka Halaman Pembayaran Mayar (QRIS / VA)
                  <ExternalLink size={13} style={{ opacity: 0.8 }} />
                </a>
              )}

              <button
                type="button"
                onClick={handleManualSync}
                disabled={syncLoading}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  gap:            8,
                  background:     '#ffffff',
                  color:          '#0f1023',
                  border:         `1px solid ${C.border}`,
                  borderRadius:   10,
                  padding:        '11px 16px',
                  fontSize:       13,
                  fontWeight:     700,
                  cursor:         syncLoading ? 'not-allowed' : 'pointer',
                  opacity:        syncLoading ? 0.7 : 1,
                  fontFamily:     'inherit',
                  transition:     'background 0.15s ease',
                }}
              >
                {syncLoading ? (
                  <>
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    Mengecek Status Langsung ke Mayar...
                  </>
                ) : (
                  <>
                    <RefreshCw size={15} style={{ color: '#16a34a' }} />
                    Sudah Bayar? Cek Status Pembayaran
                  </>
                )}
              </button>

              {syncMessage && (
                <div
                  style={{
                    fontSize:     12,
                    lineHeight:   1.5,
                    padding:      '10px 12px',
                    borderRadius: 8,
                    background:   syncMessage.type === 'success' ? '#f0fdf4' : '#fffbeb',
                    border:       `1px solid ${syncMessage.type === 'success' ? '#bbf7d0' : '#fde68a'}`,
                    color:        syncMessage.type === 'success' ? '#166534' : '#92400e',
                    display:      'flex',
                    alignItems:   'flex-start',
                    gap:          8,
                  }}
                >
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{syncMessage.text}</span>
                </div>
              )}
            </div>

            <div
              style={{
                background:   '#f0fdf4',
                border:       `1px solid ${C.greenBd}`,
                borderRadius: 10,
                padding:      '12px 14px',
                fontSize:     12,
                color:        '#166534',
              }}
            >
              <strong>Butuh bantuan pembayaran?</strong> Hubungi admin kami:
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                {ADMIN_CONTACTS.map((admin) => {
                  const waText = encodeURIComponent(
                    `Halo ${admin.name}, saya butuh bantuan pembayaran.\n` +
                    `No. Pesanan: #${orderId.slice(0, 8).toUpperCase()}\n` +
                    `Nama: ${order?.customerName ?? '-'}`
                  );
                  return (
                    <a
                      key={admin.id}
                      href={`https://wa.me/${admin.waNumber}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display:        'inline-flex',
                        alignItems:     'center',
                        gap:            6,
                        padding:        '7px 14px',
                        background:     '#fff',
                        border:         `1px solid ${C.greenBd}`,
                        borderRadius:   8,
                        fontSize:       12,
                        fontWeight:     700,
                        color:          '#16a34a',
                        textDecoration: 'none',
                      }}
                    >
                      <MessageCircle size={13} />
                      {admin.name} ({admin.role})
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Paid: claim license ──────────────────────────────────────────── */}
        {isPaid && (
          <div style={{ ...card, border: '1px solid #a5f3c0' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div
                style={{
                  width:          40,
                  height:         40,
                  borderRadius:   10,
                  background:     C.greenBg,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  color:          '#16a34a',
                  flexShrink:     0,
                }}
              >
                <Key size={20} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>
                  {claimSuccess ? 'Serial Key Resmi Anda' : 'Klaim Serial Key Lisensi'}
                </div>
                <div style={{ fontSize: 12, color: C.muted }}>
                  {claimSuccess
                    ? 'Gunakan kunci ini untuk mengaktifkan aplikasi POS OFFLINE di HP Anda'
                    : 'Masukkan Device ID yang muncul di layar aplikasi setelah install APK'}
                </div>
              </div>
            </div>

            {claimSuccess ? (
              /* ─── Key Display ────────────────────────────────────────────── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Serial key box */}
                <div
                  style={{
                    background:   C.dark,
                    borderRadius: 12,
                    padding:      '20px 18px',
                    textAlign:    'center',
                  }}
                >
                  <div
                    style={{
                      fontSize:      10,
                      color:         '#4ade80',
                      fontWeight:    700,
                      letterSpacing: '0.12em',
                      marginBottom:  10,
                    }}
                  >
                    SERIAL KEY RESMI: BERLAKU SEUMUR HIDUP
                  </div>
                  <div
                    style={{
                      fontFamily:    'monospace',
                      fontSize:      'clamp(18px, 4vw, 26px)',
                      fontWeight:    800,
                      color:         '#22c55e',
                      letterSpacing: '0.08em',
                      userSelect:    'all',
                      marginBottom:  14,
                    }}
                  >
                    {serialKey}
                  </div>
                  <button
                    type="button"
                    onClick={copyKey}
                    style={{
                      display:      'inline-flex',
                      alignItems:   'center',
                      gap:          6,
                      background:   '#22c55e',
                      color:        '#fff',
                      border:       'none',
                      borderRadius: 8,
                      padding:      '8px 18px',
                      fontSize:     12,
                      fontWeight:   800,
                      cursor:       'pointer',
                      fontFamily:   'inherit',
                    }}
                  >
                    {copiedKey ? <><Check size={13} /> TERSALIN!</> : <><Copy size={13} /> SALIN SERIAL KEY</>}
                  </button>
                </div>

                {/* Device ID lock indicator */}
                {(order?.deviceId || deviceIdInput) && (
                  <div
                    style={{
                      display:      'flex',
                      alignItems:   'center',
                      gap:          10,
                      background:   '#f9f9fd',
                      border:       `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding:      '10px 14px',
                      fontSize:     12,
                    }}
                  >
                    <Smartphone size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
                    <span style={{ color: C.muted }}>Terkunci untuk Device ID:</span>
                    <code
                      style={{
                        fontFamily:   'monospace',
                        fontWeight:   700,
                        color:        C.text,
                        marginLeft:   'auto',
                        background:   C.white,
                        padding:      '2px 8px',
                        borderRadius: 6,
                        border:       `1px solid ${C.border}`,
                      }}
                    >
                      {order?.deviceId || deviceIdInput}
                    </code>
                  </div>
                )}

                {/* Activation steps */}
                <div
                  style={{
                    background:   C.greenBg,
                    border:       `1px solid ${C.greenBd}`,
                    borderRadius: 12,
                    padding:      '16px 18px',
                  }}
                >
                  <div
                    style={{
                      display:      'flex',
                      alignItems:   'center',
                      gap:          6,
                      fontSize:     13,
                      fontWeight:   700,
                      color:        '#15803d',
                      marginBottom: 10,
                    }}
                  >
                    <ShieldCheck size={16} />
                    Cara Mengaktifkan di HP Android:
                  </div>
                  <ol style={{ paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {[
                      'Download & install file APK POS OFFLINE (klik tombol di bawah).',
                      'Buka aplikasi → layar aktivasi → salin Device ID Anda.',
                      'Tempelkan 16-digit Serial Key di atas ke kolom yang tersedia.',
                      'Klik "Aktivasi Aplikasi". Aplikasi langsung aktif permanen! 🎉',
                    ].map((step, i) => (
                      <li key={i} style={{ fontSize: 13, color: '#166534', lineHeight: 1.55 }}>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Download APK */}
                <a
                  href={directApkUrl}
                  download="POS-OFFLINE.apk"
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    gap:            8,
                    background:     C.text,
                    color:          '#fff',
                    borderRadius:   10,
                    padding:        '13px',
                    fontSize:       14,
                    fontWeight:     700,
                    textDecoration: 'none',
                    transition:     'opacity 0.15s ease',
                  }}
                >
                  <Download size={16} style={{ color: '#22c55e' }} />
                  Download APK POS OFFLINE
                </a>
              </div>
            ) : (
              /* ─── Claim Form ──────────────────────────────────────────────── */
              <form onSubmit={handleClaim} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Instruction banner */}
                <div
                  style={{
                    display:      'flex',
                    gap:          10,
                    alignItems:   'flex-start',
                    background:   '#f0f4ff',
                    border:       '1px solid #c7d2fe',
                    borderRadius: 10,
                    padding:      '12px 14px',
                    fontSize:     12,
                    color:        '#3730a3',
                  }}
                >
                  <Zap size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>
                    <strong>Langkah 1:</strong> Download &amp; install APK dulu, lalu buka aplikasi untuk melihat Device ID Anda.
                    Setelah itu salin dan tempelkan kodenya di bawah untuk terbitkan Serial Key permanen.
                  </span>
                </div>

                {/* Download APK (also available before claim) */}
                <a
                  href={directApkUrl}
                  download="POS-OFFLINE.apk"
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    gap:            8,
                    background:     C.text,
                    color:          '#fff',
                    borderRadius:   10,
                    padding:        '12px',
                    fontSize:       13,
                    fontWeight:     700,
                    textDecoration: 'none',
                    transition:     'opacity 0.15s ease',
                  }}
                >
                  <Download size={15} style={{ color: '#22c55e' }} />
                  Download APK POS OFFLINE 
                </a>

                {/* Device ID Input with Tailored Validation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label
                      htmlFor="deviceIdInput"
                      style={{ fontSize: 12, fontWeight: 700, color: C.muted, display: 'flex', alignItems: 'center', gap: 5 }}
                    >
                      <Smartphone size={13} style={{ color: '#22c55e' }} />
                      Masukkan Device ID HP Anda (Langkah 2):
                    </label>
                    {isCompleteFormat && (
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
                    id="deviceIdInput"
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Contoh: POS-8F92-4B21-7A09"
                    value={deviceIdInput}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
                      setDeviceId(val);
                      if (claimError) setClaimError('');
                    }}
                    style={{
                      width:         '100%',
                      padding:       '13px 14px',
                      border:        claimError
                        ? '1.5px solid #ef4444'
                        : isCompleteFormat
                        ? '1.5px solid #22c55e'
                        : `1px solid ${C.border}`,
                      borderRadius:  8,
                      fontFamily:    'monospace',
                      fontSize:      15,
                      fontWeight:    700,
                      color:         C.text,
                      letterSpacing: '0.06em',
                      outline:       'none',
                      background:    claimError ? '#fef2f2' : isCompleteFormat ? '#f0fdf4' : '#f9f9fd',
                      boxSizing:     'border-box',
                      boxShadow:     claimError
                        ? '0 0 0 3px rgba(239, 68, 68, 0.15)'
                        : isCompleteFormat
                        ? '0 0 0 3px rgba(34, 197, 94, 0.15)'
                        : 'none',
                      transition:    'all 0.15s ease',
                    }}
                  />

                  {/* Tailored error / format hint */}
                  {claimError ? (
                    <div
                      style={{
                        display:    'flex',
                        alignItems: 'center',
                        gap:        6,
                        fontSize:   12,
                        color:      '#dc2626',
                        fontWeight: 600,
                        marginTop:  2,
                        lineHeight: 1.4,
                      }}
                    >
                      <AlertCircle size={14} style={{ flexShrink: 0 }} />
                      <span>{claimError}</span>
                    </div>
                  ) : (
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: C.dim, lineHeight: 1.5 }}>
                      Format ID di aplikasi: <code style={{ fontFamily: 'monospace', fontWeight: 700 }}>POS-XXXX-XXXX-XXXX</code> (muncul saat pertama kali buka aplikasi).
                    </p>
                  )}
                </div>


                {/* Submit */}
                <button
                  type="submit"
                  disabled={claimLoading}
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    gap:            8,
                    background:     '#22c55e',
                    color:          '#fff',
                    border:         'none',
                    borderRadius:   10,
                    padding:        '14px',
                    fontSize:       14,
                    fontWeight:     800,
                    cursor:         claimLoading ? 'not-allowed' : 'pointer',
                    opacity:        claimLoading ? 0.7 : 1,
                    fontFamily:     'inherit',
                  }}
                >
                  {claimLoading
                    ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Menerbitkan Kunci...</>
                    : <><Key size={16} /> Terbitkan Serial Key Sekarang</>}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── Back link ─────────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', paddingBottom: 16 }}>
          <Link href="/" style={{ fontSize: 12, color: C.dim, textDecoration: 'underline' }}>
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Summary Row ─────────────────────────────────────────────────────────────
function SummaryRow({
  label,
  value,
  mono,
  color,
}: {
  label: string;
  value: string;
  mono?: boolean;
  color: { text: string; muted: string };
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ color: color.muted }}>{label}:</span>
      <span style={{ fontWeight: 600, color: color.text, fontFamily: mono ? 'monospace' : 'inherit', textAlign: 'right' }}>
        {value}
      </span>
    </div>
  );
}
