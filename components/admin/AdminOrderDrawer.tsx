'use client';

import React from 'react';
import {
  MessageCircle,
  FileText,
  RotateCcw,
  Trash2,
  Key,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { Order } from '@/lib/types';
import { InfoRow, CopyBtn, StatusBadge } from './AdminSharedUi';
import { fmtCurrency, fmtDate } from '@/lib/ui-tokens';

interface AdminOrderDrawerProps {
  order: Order;
  onOpenReceipt: (order: Order) => void;
  onOpenReset: (order: Order) => void;
  onOpenDelete: (order: Order) => void;
  onOpenGenerator: (order: Order) => void;
  getOrderWhatsAppUrl: (order: Order) => string;
}

export function AdminOrderDrawer({
  order,
  onOpenReceipt,
  onOpenReset,
  onOpenDelete,
  onOpenGenerator,
  getOrderWhatsAppUrl,
}: AdminOrderDrawerProps) {
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
            {order.notes && (
              <InfoRow label="Catatan" value={order.notes} />
            )}
          </div>
        </div>

        {/* Informasi Lisensi & Aksi Kasir */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
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
                marginBottom: 10,
              }}
            >
              Status Lisensi & Tindakan
            </div>

            {order.serialKey ? (
              <div>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: 10,
                    padding: '12px 14px',
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#15803d',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <CheckCircle size={13} /> Lisensi Aktif Seumur Hidup
                  </div>
                  {order.deviceId && (
                    <div style={{ fontSize: 12, color: '#334155', marginBottom: 6 }}>
                      Terkunci ke Device ID:{' '}
                      <strong style={{ fontFamily: 'monospace' }}>{order.deviceId}</strong>
                    </div>
                  )}
                  <div
                    style={{
                      background: '#0f172a',
                      borderRadius: 8,
                      padding: '8px 12px',
                      fontFamily: 'monospace',
                      fontSize: 13,
                      fontWeight: 700,
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

                <div className="admin-drawer-actions">
                  <a
                    href={getOrderWhatsAppUrl(order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn-full"
                    style={{
                      background: '#16a34a',
                      color: '#ffffff',
                      borderRadius: 8,
                      padding: '11px 16px',
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
                    }}
                  >
                    <MessageCircle size={14} /> Kirim WhatsApp Lisensi
                  </a>

                  <button
                    type="button"
                    onClick={() => onOpenReceipt(order)}
                    className={order.deviceId ? 'admin-btn-half' : 'admin-btn-full'}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: 8,
                      padding: '10px 12px',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#1e293b',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                  >
                    <FileText size={13} style={{ color: '#2563eb' }} /> Nota Penjualan
                  </button>

                  {order.deviceId ? (
                    <button
                      type="button"
                      onClick={() => onOpenReset(order)}
                      className="admin-btn-half"
                      style={{
                        background: '#fff7ed',
                        border: '1px solid #fed7aa',
                        borderRadius: 8,
                        padding: '10px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#c2410c',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <RotateCcw size={13} /> Reset Device
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => onOpenDelete(order)}
                    className={order.deviceId ? 'admin-btn-half' : 'admin-btn-full'}
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: 8,
                      padding: '10px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Trash2 size={13} /> Hapus Pesanan
                  </button>
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

                <div className="admin-drawer-actions">
                  <button
                    type="button"
                    onClick={() => onOpenGenerator(order)}
                    className="admin-btn-full"
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '12px 16px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      fontFamily: 'inherit',
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.2)',
                    }}
                  >
                    <Key size={14} style={{ color: '#4ade80' }} /> Terbitkan Serial Key
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenReceipt(order)}
                    className="admin-btn-half"
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: 8,
                      padding: '10px 12px',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#1e293b',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                  >
                    <FileText size={13} style={{ color: '#2563eb' }} /> Nota Penjualan
                  </button>

                  <a
                    href={getOrderWhatsAppUrl(order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn-half"
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #86efac',
                      borderRadius: 8,
                      padding: '10px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#16a34a',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <MessageCircle size={14} style={{ color: '#25d366' }} /> Hubungi via WA
                  </a>

                  <button
                    type="button"
                    onClick={() => onOpenDelete(order)}
                    className="admin-btn-half"
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: 8,
                      padding: '10px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Trash2 size={13} /> Hapus Pesanan
                  </button>
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
                  <div className="admin-drawer-actions">
                    <a
                      href={getOrderWhatsAppUrl(order)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn-half"
                      style={{
                        background: '#fef9c3',
                        border: '1px solid #fde68a',
                        borderRadius: 8,
                        padding: '10px 16px',
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#854d0e',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <MessageCircle size={14} style={{ color: '#ca8a04' }} /> Follow Up WA
                    </a>

                    <button
                      type="button"
                      onClick={() => onOpenDelete(order)}
                      className="admin-btn-half"
                      style={{
                        background: '#ffffff',
                        border: '1px solid #fecaca',
                        borderRadius: 8,
                        padding: '10px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Trash2 size={13} /> Hapus Pesanan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ fontSize: 11, color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
            Status: <strong>{order.paymentStatus.toUpperCase()}</strong> · Nominal: <strong>{order.amount === 0 ? '🎁 GRATIS (KONTEN/PROPERTI)' : fmtCurrency(order.amount)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
