'use client';

import React from 'react';
import { Store, Phone, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Order } from '@/lib/types';
import { StatusBadge } from './AdminSharedUi';
import { AdminOrderDrawer } from './AdminOrderDrawer';
import { fmtCurrency, fmtDate } from '@/lib/ui-tokens';

interface AdminOrderTableProps {
  orders: Order[];
  selectedOrderId: string | null;
  onToggleExpand: (orderId: string) => void;
  onOpenReceipt: (order: Order) => void;
  onOpenReset: (order: Order) => void;
  onOpenDelete: (order: Order) => void;
  onOpenGenerator: (order: Order) => void;
  getOrderWhatsAppUrl: (order: Order) => string;
  getOrderActivationText?: (order: Order) => string;
}

export function AdminOrderTable({
  orders,
  selectedOrderId,
  onToggleExpand,
  onOpenReceipt,
  onOpenReset,
  onOpenDelete,
  onOpenGenerator,
  getOrderWhatsAppUrl,
  getOrderActivationText,
}: AdminOrderTableProps) {
  return (
    <div
      className="desktop-only-table"
      style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
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
      {orders.map((order, i) => {
        const isExpanded = selectedOrderId === order.id;
        return (
          <div
            key={order.id}
            style={{ borderTop: i === 0 ? 'none' : '1px solid #e2e8f0' }}
          >
            <div
              className={`admin-order-row ${isExpanded ? 'active' : ''}`}
              onClick={() => onToggleExpand(order.id)}
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
                <div style={{ fontSize: 13, fontWeight: 800, color: order.amount === 0 ? '#7c3aed' : '#16a34a' }}>
                  {order.amount === 0 ? '🎁 Gratis' : fmtCurrency(order.amount)}
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
            {isExpanded && (
              <AdminOrderDrawer
                order={order}
                onOpenReceipt={onOpenReceipt}
                onOpenReset={onOpenReset}
                onOpenDelete={onOpenDelete}
                onOpenGenerator={onOpenGenerator}
                getOrderWhatsAppUrl={getOrderWhatsAppUrl}
                getOrderActivationText={getOrderActivationText}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
