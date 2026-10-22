'use client';

import React from 'react';
import { Trash2, X, Loader2 } from 'lucide-react';
import { Order } from '@/lib/types';
import { inputStyle } from '@/lib/ui-tokens';

interface AdminDeleteModalProps {
  order: Order;
  deletePw: string;
  setDeletePw: (val: string) => void;
  deleteLoading: boolean;
  deleteError: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminDeleteModal({
  order,
  deletePw,
  setDeletePw,
  deleteLoading,
  deleteError,
  onClose,
  onSubmit,
}: AdminDeleteModalProps) {
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
                background: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626',
              }}
            >
              <Trash2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Hapus Data Pesanan
              </h3>
              <p style={{ fontSize: 12, color: '#dc2626', margin: '2px 0 0', fontWeight: 600 }}>
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
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 10,
            padding: '12px 14px',
            fontSize: 13,
            color: '#991b1b',
            lineHeight: 1.6,
            marginBottom: 18,
          }}
        >
          Pesanan atas nama <strong>{order.customerName}</strong> ({order.storeName || 'Toko'}) dengan Order ID <code>#{order.id.slice(0, 8).toUpperCase()}</code> akan dihapus permanen dari sistem.
          {order.serialKey && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#b91c1c', fontWeight: 600 }}>
              ⚠️ Serial Key yang pernah diterbitkan pada pesanan ini akan ikut dihapus dari daftar admin.
            </div>
          )}
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
              value={deletePw}
              onChange={(e) => setDeletePw(e.target.value)}
              style={{ ...inputStyle, padding: '11px 14px', fontSize: 13, borderColor: '#cbd5e1' }}
            />
          </div>

          {deleteError && (
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
              {deleteError}
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
              disabled={deleteLoading}
              style={{
                flex: 1,
                background: '#dc2626',
                border: 'none',
                borderRadius: 10,
                padding: '12px',
                fontSize: 13,
                fontWeight: 700,
                color: '#ffffff',
                cursor: deleteLoading ? 'not-allowed' : 'pointer',
                opacity: deleteLoading ? 0.75 : 1,
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              {deleteLoading ? (
                <>
                  <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Menghapus...
                </>
              ) : (
                <>
                  <Trash2 size={15} /> Ya, Hapus Pesanan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
