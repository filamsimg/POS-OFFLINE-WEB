'use client';

import React from 'react';
import { AlertCircle, X, RotateCcw, Loader2 } from 'lucide-react';
import { Order } from '@/lib/types';
import { inputStyle } from '@/lib/ui-tokens';

interface AdminResetModalProps {
  order: Order;
  resetPw: string;
  setResetPw: (val: string) => void;
  resetLoading: boolean;
  resetError: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminResetModal({
  order,
  resetPw,
  setResetPw,
  resetLoading,
  resetError,
  onClose,
  onSubmit,
}: AdminResetModalProps) {
  return (
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
      onClick={onClose}
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
                background: '#fff7ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c2410c',
              }}
            >
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Reset Device Lisensi
              </h3>
              <p style={{ fontSize: 12, color: '#c2410c', margin: '2px 0 0', fontWeight: 600 }}>
                Tindakan permanen / tidak bisa dibatalkan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
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
          Device ID dan Serial Key pada pesanan <strong>{order.customerName}</strong> ({order.storeName || 'Toko'}) akan dihapus dari sistem. Pelanggan dapat mendaftarkan HP barunya kembali melalui portal aktivasi mandiri.
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
              onClick={onClose}
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
                background: '#c2410c',
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
  );
}
