'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { OrderFilter } from './types';
import { Order } from '@/lib/types';
import { inputStyle } from '@/lib/ui-tokens';

interface AdminFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  filter: OrderFilter;
  setFilter: (val: OrderFilter) => void;
  orders: Order[];
}

export function AdminFilters({
  search,
  setSearch,
  filter,
  setFilter,
  orders,
}: AdminFiltersProps) {
  const filterTabs = [
    { key: 'all' as const, label: 'Semua', count: orders.length, color: '#0f172a' },
    {
      key: 'pending' as const,
      label: 'Menunggu',
      count: orders.filter((o) => o.paymentStatus === 'pending').length,
      color: '#d97706',
    },
    {
      key: 'paid' as const,
      label: 'Lunas',
      count: orders.filter((o) => o.paymentStatus === 'paid').length,
      color: '#16a34a',
    },
    {
      key: 'cancelled' as const,
      label: 'Batal',
      count: orders.filter((o) => o.paymentStatus === 'cancelled').length,
      color: '#dc2626',
    },
  ];

  return (
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
              fontSize: 13,
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

        {/* Filter Pills (Scrollable horizontally on mobile) */}
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
          {filterTabs.map((s) => {
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
                  minHeight: 36,
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
  );
}
