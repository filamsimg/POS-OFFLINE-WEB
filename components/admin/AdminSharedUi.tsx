'use client';

import React, { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { Order } from '@/lib/types';
import { statusBadgeConfig, copyText } from '@/lib/ui-tokens';

// ─── Status Badge Component ───────────────────────────────────────────────────

export function StatusBadge({ status }: { status: Order['paymentStatus'] }) {
  const s = statusBadgeConfig[status] ?? statusBadgeConfig.pending;
  const dotColor = status === 'paid' ? '#16a34a' : status === 'pending' ? '#d97706' : '#dc2626';

  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 11,
        fontWeight: 700,
        padding: '3px 9px',
        borderRadius: 99,
        letterSpacing: '0.03em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: dotColor,
          display: 'inline-block',
        }}
      />
      {s.label}
    </span>
  );
}

// ─── Copy Button Component ───────────────────────────────────────────────────

export function CopyBtn({ text, label = 'Salin' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Salin ke clipboard"
      style={{
        background: copied ? '#dcfce7' : '#f1f5f9',
        border: `1px solid ${copied ? '#86efac' : '#e2e8f0'}`,
        borderRadius: 6,
        cursor: 'pointer',
        padding: '3px 8px',
        color: copied ? '#15803d' : '#475569',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 600,
        transition: 'all 0.15s ease',
        fontFamily: 'inherit',
      }}
    >
      {copied ? (
        <>
          <Check size={11} /> Disalin
        </>
      ) : (
        <>
          <Copy size={11} /> {label}
        </>
      )}
    </button>
  );
}

// ─── InfoRow Component ───────────────────────────────────────────────────────

export function InfoRow({
  label,
  value,
  copy,
  href,
}: {
  label: string;
  value: React.ReactNode;
  copy?: string;
  href?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        padding: '6px 0',
        borderBottom: '1px solid #f1f5f9',
        fontSize: 12,
      }}
    >
      <span style={{ color: '#64748b', minWidth: 105, flexShrink: 0 }}>{label}</span>
      <div
        style={{
          flex: 1,
          textAlign: 'right',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 6,
          wordBreak: 'break-all',
        }}
      >
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#0284c7',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {value} <ExternalLink size={11} />
          </a>
        ) : (
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{value}</span>
        )}
        {copy && <CopyBtn text={copy} label="" />}
      </div>
    </div>
  );
}
