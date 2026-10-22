'use client';

import React from 'react';
import { Package, Clock, CheckCircle, Key, TrendingUp } from 'lucide-react';
import { AdminStats } from './types';
import { fmtCurrency } from '@/lib/ui-tokens';

interface AdminStatsGridProps {
  stats: AdminStats;
}

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

export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  return (
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
  );
}
