'use client';

import React from 'react';
import {
  Key,
  Sparkles,
  Smartphone,
  Copy,
  Check,
  Send,
  MessageCircle,
  FileText,
  Loader2,
  Gift,
} from 'lucide-react';
import { Order } from '@/lib/types';
import { GenResult } from './types';
import { CopyBtn } from './AdminSharedUi';
import { inputStyle, copyText, fmtCurrency } from '@/lib/ui-tokens';

interface AdminGeneratorTabProps {
  orders: Order[];
  genOrderId: string;
  onSelectOrder: (orderId: string) => void;
  genDeviceId: string;
  setGenDeviceId: (val: string) => void;
  genCustomerName: string;
  setGenCustomerName: (val: string) => void;
  genCustomerPhone: string;
  setGenCustomerPhone: (val: string) => void;
  genStoreName: string;
  setGenStoreName: (val: string) => void;
  genLicenseType: 'paid' | 'free';
  setGenLicenseType: (val: 'paid' | 'free') => void;
  genAmount: number;
  setGenAmount: (val: number) => void;
  genNotes: string;
  setGenNotes: (val: string) => void;
  genResult: GenResult | null;
  genLoading: boolean;
  genError: string;
  waMsgCopied: boolean;
  setWaMsgCopied: (val: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenReceipt: (order: Order) => void;
  getOrderWhatsAppUrl: (order: Order) => string;
}

export function AdminGeneratorTab({
  orders,
  genOrderId,
  onSelectOrder,
  genDeviceId,
  setGenDeviceId,
  genCustomerName,
  setGenCustomerName,
  genCustomerPhone,
  setGenCustomerPhone,
  genStoreName,
  setGenStoreName,
  genLicenseType,
  setGenLicenseType,
  genAmount,
  setGenAmount,
  genNotes,
  setGenNotes,
  genResult,
  genLoading,
  genError,
  waMsgCopied,
  setWaMsgCopied,
  onSubmit,
  onOpenReceipt,
  getOrderWhatsAppUrl,
}: AdminGeneratorTabProps) {
  const selectedOrder = genOrderId ? orders.find((o) => o.id === genOrderId) : null;

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          padding: 'clamp(20px, 4vw, 32px)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#f5f3ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7c3aed',
            }}
          >
            <Key size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Penerbitan Serial Key Lisensi
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>
              Terbitkan lisensi resmi seumur hidup terikat Device ID pelanggan.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Hubungkan ke Pesanan */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
              Target Pesanan Pelanggan (Opsional)
            </label>
            <select
              value={genOrderId}
              onChange={(e) => onSelectOrder(e.target.value)}
              style={{
                ...inputStyle,
                padding: '11px 14px',
                fontSize: 13,
                borderColor: '#cbd5e1',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              <option value="">(Generate Mandiri (Admin))</option>
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

          {/* Form Mandiri (Jika tidak terhubung pesanan yang sudah ada) */}
          {!genOrderId && (
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0f172a', fontWeight: 800, fontSize: 13 }}>
                  <Sparkles size={15} style={{ color: '#7c3aed' }} />
                  Data Transaksi Mandiri (Tercatat Otomatis ke DB & Laporan)
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '2px 8px',
                    borderRadius: 99,
                  }}
                >
                  STATUS: LUNAS
                </span>
              </div>

              <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Transaksi akan dicatat sebagai pesanan Lunas, otomatis menambah counter device terdaftar, dan menjumlahkan omset pendapatan admin.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Nama Pelanggan / Pemilik
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Bpk. Joko Santoso"
                    value={genCustomerName}
                    onChange={(e) => setGenCustomerName(e.target.value)}
                    style={{ ...inputStyle, padding: '10px 12px', fontSize: 13, background: '#ffffff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    No. WhatsApp Pelanggan
                  </label>
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={genCustomerPhone}
                    onChange={(e) => setGenCustomerPhone(e.target.value)}
                    style={{ ...inputStyle, padding: '10px 12px', fontSize: 13, background: '#ffffff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Nama Toko / Usaha
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Toko Berkah Mandiri"
                    value={genStoreName}
                    onChange={(e) => setGenStoreName(e.target.value)}
                    style={{ ...inputStyle, padding: '10px 12px', fontSize: 13, background: '#ffffff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Tipe Lisensi & Nilai Transaksi
                  </label>
                  {/* Segmented Control for License Type */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 6,
                      background: '#e2e8f0',
                      padding: 3,
                      borderRadius: 8,
                      marginBottom: 6,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setGenLicenseType('paid');
                        setGenAmount(299000);
                      }}
                      style={{
                        background: genLicenseType === 'paid' ? '#ffffff' : 'transparent',
                        color: genLicenseType === 'paid' ? '#0f172a' : '#64748b',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 8px',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        boxShadow: genLicenseType === 'paid' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>🟢 Beli / Berbayar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGenLicenseType('free');
                        setGenAmount(0);
                      }}
                      style={{
                        background: genLicenseType === 'free' ? '#ffffff' : 'transparent',
                        color: genLicenseType === 'free' ? '#7c3aed' : '#64748b',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 8px',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        boxShadow: genLicenseType === 'free' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Gift size={12} />
                      <span>Gratis / Konten</span>
                    </button>
                  </div>

                  {genLicenseType === 'paid' ? (
                    <input
                      type="number"
                      placeholder="299000"
                      value={genAmount}
                      onChange={(e) => setGenAmount(Number(e.target.value) || 0)}
                      style={{ ...inputStyle, padding: '10px 12px', fontSize: 13, background: '#ffffff' }}
                    />
                  ) : (
                    <div
                      style={{
                        background: '#ede9fe',
                        border: '1px solid #ddd6fe',
                        borderRadius: 8,
                        padding: '8px 12px',
                        fontSize: 11,
                        color: '#6d28d9',
                        fontWeight: 600,
                      }}
                    >
                      🎁 Nominal Rp 0 (Properti Syuting / Demo / Hadiah)
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Catatan Admin (Opsional)
                </label>
                <input
                  type="text"
                  placeholder={genLicenseType === 'free' ? 'Contoh: Device HP Syuting Konten TikTok' : 'Contoh: Pembayaran transfer BCA manual'}
                  value={genNotes}
                  onChange={(e) => setGenNotes(e.target.value)}
                  style={{ ...inputStyle, padding: '10px 12px', fontSize: 13, background: '#ffffff' }}
                />
              </div>
            </div>
          )}

          {/* Device ID Input */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
              Device ID Perangkat Kasir (Wajib)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                placeholder="Contoh: POS-8F92-4B21-7A09"
                value={genDeviceId}
                onChange={(e) => setGenDeviceId(e.target.value)}
                style={{
                  ...inputStyle,
                  fontFamily: 'monospace',
                  letterSpacing: '0.04em',
                  fontSize: 14,
                  padding: '12px 14px',
                  textTransform: 'uppercase',
                  borderColor: '#cbd5e1',
                  borderRadius: 10,
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              >
                <Smartphone size={16} />
              </span>
            </div>
            <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 4 }}>
              Device ID didapatkan dari layar aktivasi aplikasi kasir POS Offline di HP pelanggan.
            </span>
          </div>

          {genError && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 10,
                padding: '12px 14px',
                fontSize: 13,
                color: '#dc2626',
              }}
            >
              {genError}
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
              padding: '14px 20px',
              fontSize: 13,
              fontWeight: 700,
              cursor: genLoading ? 'not-allowed' : 'pointer',
              opacity: genLoading ? 0.75 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'inherit',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
              minHeight: 46,
            }}
          >
            {genLoading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Memproses Keygen...
              </>
            ) : (
              <>
                <Key size={16} style={{ color: '#4ade80' }} /> Generate Serial Key Lisensi
              </>
            )}
          </button>
        </form>

        {/* Hasil Generator */}
        {genResult && (
          <div
            style={{
              marginTop: 24,
              borderTop: '1px solid #e2e8f0',
              paddingTop: 24,
            }}
          >
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: 16,
                padding: '20px 22px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ✓ Serial Key Berhasil Diterbitkan
                </span>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                  Lisensi Seumur Hidup
                </span>
              </div>

              <div
                style={{
                  background: '#0f172a',
                  borderRadius: 12,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    fontWeight: 800,
                    color: '#4ade80',
                    letterSpacing: '0.08em',
                  }}
                >
                  {genResult.serialKey}
                </span>
                <CopyBtn text={genResult.serialKey} label="Salin Kode" />
              </div>

              {/* Template WhatsApp */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Draft Pesan WhatsApp untuk Pelanggan:
                </div>
                <textarea
                  readOnly
                  rows={9}
                  value={genResult.waTemplate || ''}
                  style={{
                    width: '100%',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    padding: '12px 14px',
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: '#1e293b',
                    fontFamily: 'inherit',
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    copyText(genResult.waTemplate || '').then(() => {
                      setWaMsgCopied(true);
                      setTimeout(() => setWaMsgCopied(false), 2500);
                    });
                  }}
                  style={{
                    background: waMsgCopied ? '#16a34a' : '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '11px 18px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
                    transition: 'all 0.2s ease',
                    minHeight: 40,
                    flex: '1 1 180px',
                  }}
                >
                  {waMsgCopied ? (
                    <>
                      <Check size={14} /> Pesan Berhasil Disalin!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Salin Seluruh Pesan
                    </>
                  )}
                </button>

                {(() => {
                  const targetOrder = genResult.order || selectedOrder;
                  const phoneTarget = targetOrder?.customerPhone || genCustomerPhone;
                  const cleanPhone = (phoneTarget || '').replace(/\D/g, '').replace(/^0/, '62');
                  if (cleanPhone.length >= 9) {
                    const waDirectUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(genResult.waTemplate || '')}`;
                    return (
                      <a
                        href={waDirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#25d366',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '11px 18px',
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          minHeight: 40,
                          flex: '1 1 180px',
                          boxShadow: '0 2px 6px rgba(37, 211, 102, 0.25)',
                        }}
                      >
                        <Send size={14} /> Kirim via WhatsApp
                      </a>
                    );
                  }
                  return null;
                })()}

                {(() => {
                  const targetOrder = genResult.order || selectedOrder;
                  if (targetOrder) {
                    return (
                      <button
                        type="button"
                        onClick={() => onOpenReceipt(targetOrder)}
                        style={{
                          background: '#ffffff',
                          color: '#1e293b',
                          border: '1px solid #cbd5e1',
                          borderRadius: 8,
                          padding: '11px 18px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                          minHeight: 40,
                          flex: '1 1 180px',
                        }}
                      >
                        <FileText size={14} style={{ color: '#2563eb' }} /> Lihat / Cetak Nota Penjualan
                      </button>
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
  );
}
