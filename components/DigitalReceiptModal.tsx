'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Printer,
  Copy,
  Check,
  X,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Key,
  ExternalLink,
} from 'lucide-react';
import { Order } from '@/lib/types';
import { fmtCurrency, fmtDate, copyText } from '@/lib/ui-tokens';
import { QRCodeSVG } from 'qrcode.react';

interface DigitalReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export function DigitalReceiptModal({ order, onClose }: DigitalReceiptModalProps) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}`;
  const isPaid = order.paymentStatus === 'paid';

  const siteBaseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.posoffline.xyz').replace(/\/+$/, '');
  const portalUrl = `${siteBaseUrl}/order/${order.id}`;

  const receiptSummaryText =
    `*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*\n` +
    `*NOTA PENJUALAN RESMI POS OFFLINE*\n` +
    `*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*\n\n` +
    `No. Invoice: #${invoiceNumber}\n` +
    `Tanggal: ${fmtDate(order.createdAt)}\n` +
    `Status: ${isPaid ? 'LUNAS (TERVERIFIKASI)' : 'MENUNGGU PEMBAYARAN'}\n\n` +
    `*DATA PEMBELI:*\n` +
    `• Nama: ${order.customerName}\n` +
    `• WhatsApp: ${order.customerPhone || '-'}\n` +
    `• Toko/Usaha: ${order.storeName || '-'}\n\n` +
    `*RINCIAN LISENSI:*\n` +
    `• Item: Lisensi Software POS OFFLINE Pro\n` +
    `• Model: Lisensi Permanen (Sekali Bayar Seumur Hidup)\n` +
    `• Total: ${fmtCurrency(order.amount)}\n\n` +
    `*DATA PERANGKAT:*\n` +
    `• Device ID: ${order.deviceId || '(Belum didaftarkan)'}\n` +
    `• Serial Key: ${order.serialKey || '(Belum diterbitkan)'}\n` +
    `• Status Lisensi: ${order.serialKey ? 'Aktif Permanen Seumur Hidup' : 'Menunggu Aktivasi'}\n\n` +
    `*Portal Akses & Download APK:*\n` +
    `${portalUrl}\n\n` +
    `_Terima kasih atas kepercayaan Anda bermitra dengan POS OFFLINE!_`;

  const handleCopyReceipt = () => {
    copyText(receiptSummaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const phone = (order.customerPhone || '').replace(/\D/g, '').replace(/^0/, '62');
  const hasValidPhone = phone.length >= 9;
  const waUrl = hasValidPhone ? `https://wa.me/${phone}?text=${encodeURIComponent(receiptSummaryText)}` : '';
  const verificationUrl = portalUrl;

  return (
    <div
      className="receipt-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        @media screen and (max-width: 540px) {
          .receipt-modal-backdrop {
            padding: 8px !important;
          }
          .receipt-printable-sheet {
            max-height: 96vh !important;
            border-radius: 16px !important;
          }
          .receipt-body-content {
            padding: 16px 14px 16px !important;
          }
          .receipt-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .receipt-header-badge-col {
            text-align: left !important;
            width: 100% !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
          }
          .receipt-meta-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
            padding: 10px 12px !important;
          }
          .receipt-license-qr-card {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 14px !important;
            padding: 14px !important;
          }
          .receipt-qr-wrapper {
            margin: 0 auto !important;
            width: fit-content !important;
          }
          .receipt-actions-bar {
            padding: 12px 14px !important;
            flex-direction: column !important;
            gap: 8px !important;
          }
          .receipt-actions-primary-group {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            width: 100% !important;
            gap: 8px !important;
          }
          .receipt-actions-secondary-group {
            display: grid !important;
            grid-template-columns: 1fr auto !important;
            width: 100% !important;
            gap: 8px !important;
          }
          .receipt-action-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 10px 8px !important;
            font-size: 11px !important;
          }
        }

        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-modal-backdrop {
            position: absolute !important;
            inset: 0 !important;
            background: #ffffff !important;
            padding: 0 !important;
            display: block !important;
          }
          .receipt-printable-sheet,
          .receipt-printable-sheet * {
            visibility: visible !important;
          }
          .receipt-printable-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 24px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        className="receipt-printable-sheet"
        style={{
          width: '100%',
          maxWidth: 580,
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          color: '#0f172a',
          position: 'relative',
        }}
      >
        {/* Modal Controls (Hidden in Print) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>
            Pratinjau Nota Penjualan Resmi
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: 4,
              borderRadius: 6,
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="receipt-body-content" style={{ padding: '24px 22px 20px', overflowY: 'auto', flex: 1 }}>
          
          {/* Header */}
          <div className="receipt-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Image
                src="/icon.png"
                alt="POS OFFLINE"
                width={40}
                height={40}
                style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(34, 197, 94, 0.25)' }}
              />
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  POS OFFLINE
                </h3>
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  Sistem Kasir Android Standalone Permanen
                </span>
              </div>
            </div>

            <div className="receipt-header-badge-col" style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 800,
                  color: isPaid ? '#15803d' : '#854d0e',
                  background: isPaid ? '#dcfce7' : '#fef9c3',
                  border: `1px solid ${isPaid ? '#86efac' : '#fde68a'}`,
                  padding: '3px 10px',
                  borderRadius: 99,
                  letterSpacing: '0.04em',
                }}
              >
                <ShieldCheck size={13} />
                {isPaid ? 'LUNAS • RESMI' : 'PENDING'}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, fontFamily: 'monospace' }}>
                #{invoiceNumber}
              </div>
            </div>
          </div>

          <div style={{ borderBottom: '2px dashed #e2e8f0', marginBottom: 18 }} />

          {/* Metadata Row */}
          <div
            className="receipt-meta-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              background: '#f8fafc',
              padding: '12px 14px',
              borderRadius: 12,
              fontSize: 12,
              marginBottom: 18,
              border: '1px solid #f1f5f9',
            }}
          >
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: 11 }}>Tanggal Pembelian</span>
              <strong style={{ color: '#0f172a' }}>{fmtDate(order.createdAt)}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: 11 }}>Metode Pembayaran</span>
              <strong style={{ color: '#0f172a' }}>
                {order.paymentMethod === 'midtrans' ? 'Midtrans Payment Gateway' : 'Transfer Manual / Direct Admin'}
              </strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: 11 }}>Nama Pelanggan / Toko</span>
              <strong style={{ color: '#0f172a' }}>
                {order.customerName} {order.storeName ? `(${order.storeName})` : ''}
              </strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: 11 }}>No. WhatsApp</span>
              <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{order.customerPhone}</strong>
            </div>
          </div>

          {/* Items Purchased Table */}
          <div style={{ marginBottom: 20 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textAlign: 'left' }}>
                  <th style={{ paddingBottom: 8 }}>DESKRIPSI PRODUK</th>
                  <th style={{ paddingBottom: 8, textAlign: 'center', width: 60 }}>QTY</th>
                  <th style={{ paddingBottom: 8, textAlign: 'right', width: 110 }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 0' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>
                      Lisensi Software POS OFFLINE Pro
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      Aplikasi Kasir Android Standalone Permanen • Sekali Bayar Seumur Hidup
                    </div>
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'center', color: '#334155' }}>
                    1x
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                    {fmtCurrency(order.amount)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ paddingTop: 14, fontWeight: 800, fontSize: 13, color: '#0f172a' }}>
                    TOTAL PEMBAYARAN:
                  </td>
                  <td style={{ paddingTop: 14, textAlign: 'right', fontWeight: 800, fontSize: 16, color: '#16a34a' }}>
                    {fmtCurrency(order.amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* License Certificate & QR Code Row */}
          <div
            className="receipt-license-qr-card"
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 14,
              padding: '16px',
              marginBottom: 18,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            {/* Left: License details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#15803d',
                  }}
                >
                  <Key size={13} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#15803d', letterSpacing: '0.04em' }}>
                  SERTIFIKAT LISENSI RESMI
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, borderBottom: '1px solid #f1f5f9', paddingBottom: 5 }}>
                  <span style={{ color: '#64748b', fontSize: 11 }}>Device ID:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', wordBreak: 'break-all' }}>
                    {order.deviceId || '(Belum Didaftarkan)'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, borderBottom: '1px solid #f1f5f9', paddingBottom: 5 }}>
                  <span style={{ color: '#64748b', fontSize: 11 }}>Serial Key:</span>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      color: order.serialKey ? '#16a34a' : '#94a3b8',
                      letterSpacing: order.serialKey ? '0.04em' : 'normal',
                      wordBreak: 'break-all',
                    }}
                  >
                    {order.serialKey || '(Belum Diterbitkan)'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, paddingTop: 2 }}>
                  <span style={{ color: '#64748b', fontSize: 11 }}>Masa Aktif:</span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: '#0284c7',
                      background: '#e0f2fe',
                      padding: '1px 8px',
                      borderRadius: 99,
                      fontSize: 10,
                    }}
                  >
                    Permanen (Seumur Hidup)
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Verification QR Code */}
            <div
              className="receipt-qr-wrapper"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '10px 12px',
                flexShrink: 0,
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              }}
            >
              <QRCodeSVG
                value={verificationUrl}
                size={76}
                level="M"
                includeMargin={false}
              />
              <span style={{ fontSize: 9, fontWeight: 700, color: '#64748b', marginTop: 6, letterSpacing: '0.02em' }}>
                SCAN VERIFIKASI
              </span>
              <span style={{ fontSize: 8, color: '#94a3b8', marginTop: 1 }}>
                Bukti Sah Online
              </span>
            </div>
          </div>

          {/* Terms & Guarantee */}
          <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
            Nota ini merupakan bukti sah transaksi dan sertifikat lisensi resmi aplikasi POS OFFLINE. Lisensi terikat 1-to-1 dengan Device ID Android. Garansi pemindahan perangkat &amp; bantuan teknis via WhatsApp resmi.
          </div>
        </div>

        {/* Action Bar (Hidden in Print) */}
        <div
          className="no-print receipt-actions-bar"
          style={{
            padding: '14px 18px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div className="receipt-actions-primary-group" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handlePrint}
              className="receipt-action-btn"
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                padding: '9px 15px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'inherit',
              }}
            >
              <Printer size={14} /> Cetak / PDF
            </button>

            {hasValidPhone && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="receipt-action-btn"
                style={{
                  background: '#f0fdf4',
                  color: '#16a34a',
                  border: '1px solid #86efac',
                  borderRadius: 8,
                  padding: '9px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'inherit',
                }}
              >
                <MessageCircle size={14} /> Kirim ke WA
              </a>
            )}
          </div>

          <div className="receipt-actions-secondary-group" style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={handleCopyReceipt}
              className="receipt-action-btn"
              style={{
                background: copied ? '#dcfce7' : '#ffffff',
                color: copied ? '#15803d' : '#475569',
                border: `1px solid ${copied ? '#86efac' : '#cbd5e1'}`,
                borderRadius: 8,
                padding: '9px 14px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'inherit',
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Disalin' : 'Salin Teks'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="receipt-action-btn"
              style={{
                background: '#f1f5f9',
                color: '#475569',
                border: 'none',
                borderRadius: 8,
                padding: '9px 14px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
