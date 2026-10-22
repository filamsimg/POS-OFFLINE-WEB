'use client';

import React from 'react';
import Image from 'next/image';
import { RefreshCw, LogOut } from 'lucide-react';
import { CURRENT_APP_VERSION } from '@/lib/types';

interface AdminHeaderProps {
  dataLoading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
}

export function AdminHeader({
  dataLoading,
  onRefresh,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header
      style={{
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 clamp(12px, 3vw, 28px)',
          minHeight: 58,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        {/* Brand Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <Image
            src="/icon.png"
            alt="Logo"
            width={30}
            height={30}
            style={{
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.25)',
              flexShrink: 0,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: 'clamp(13px, 3.5vw, 16px)',
                color: '#f8fafc',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              POS OFFLINE
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '2px 6px',
                borderRadius: 4,
                letterSpacing: '0.08em',
              }}
            >
              ADMIN
            </span>
            <span
              className="desktop-header-version"
              style={{
                fontSize: 9,
                fontWeight: 700,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#94a3b8',
                padding: '2px 5px',
                borderRadius: 4,
                fontFamily: 'monospace',
              }}
            >
              v{CURRENT_APP_VERSION}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons (Mobile Friendly) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={onRefresh}
            disabled={dataLoading}
            title="Perbarui Data"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: 8,
              padding: '8px 12px',
              color: '#cbd5e1',
              cursor: dataLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'inherit',
              minHeight: 38,
              transition: 'all 0.15s ease',
            }}
          >
            <RefreshCw
              size={14}
              style={{
                animation: dataLoading ? 'spin 1s linear infinite' : 'none',
                color: '#4ade80',
                flexShrink: 0,
              }}
            />
            <span className="header-btn-text">Refresh</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            title="Keluar dari Dashboard"
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 8,
              padding: '8px 12px',
              color: '#fca5a5',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontFamily: 'inherit',
              minHeight: 38,
              transition: 'all 0.15s ease',
            }}
          >
            <LogOut size={14} style={{ flexShrink: 0 }} />
            <span className="header-btn-text">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
