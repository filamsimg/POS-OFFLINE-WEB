'use client';

import React from 'react';
import { Store, ChevronDown, ChevronUp } from 'lucide-react';
import { Order } from '@/lib/types';
import { StatusBadge } from './AdminSharedUi';
import { AdminOrderDrawer } from './AdminOrderDrawer';
import { fmtCurrency, fmtDate } from '@/lib/ui-tokens';

interface AdminOrderCardsProps {
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

export function AdminOrderCards({
  orders,
  selectedOrderId,
  onToggleExpand,
  onOpenReceipt,
  onOpenReset,
  onOpenDelete,
  onOpenGenerator,
  getOrderWhatsAppUrl,
  getOrderActivationText,
}: AdminOrderCardsProps) {
  return (
    <div className="mobile-only-cards">
      {orders.map((order) => {
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
              onClick={() => onToggleExpand(order.id)}
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
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: order.amount === 0 ? '#7c3aed' : '#16a34a',
                  }}
                >
                  {order.amount === 0 ? '🎁 Gratis' : fmtCurrency(order.amount)}
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

              {/* Quick Status Bar */}
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
                      ⚡ Perlu Key
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>-</span>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    color: '#64748b',
                    fontWeight: 600,
                  }}
                >
                  <span>{isExpanded ? 'Tutup Detail' : 'Buka Detail'}</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>
            </div>

            {/* Expanded Drawer */}
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
