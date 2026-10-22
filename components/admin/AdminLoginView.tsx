'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { inputStyle } from '@/lib/ui-tokens';

interface AdminLoginViewProps {
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPw: boolean;
  setShowPw: (val: boolean | ((prev: boolean) => boolean)) => void;
  authError: string;
  loginLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminLoginView({
  username,
  setUsername,
  password,
  setPassword,
  showPw,
  setShowPw,
  authError,
  loginLoading,
  onSubmit,
}: AdminLoginViewProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#ffffff',
          borderRadius: 20,
          padding: '36px 32px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: '#f0fdf4',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
            }}
          >
            <Image src="/icon.png" alt="POS Offline" width={38} height={38} style={{ borderRadius: 10 }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            POS OFFLINE PRO
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: '6px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <ShieldCheck size={14} style={{ color: '#16a34a' }} />
            Portal Administrator Resmi
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
              Username Admin
            </label>
            <input
              type="text"
              required
              autoFocus
              autoCapitalize="none"
              placeholder="Ketik username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ ...inputStyle, padding: '12px 14px', fontSize: 14, borderColor: '#cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
              Password Admin
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                required
                placeholder="Ketik password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  ...inputStyle,
                  padding: '12px 14px',
                  paddingRight: 40,
                  fontSize: 14,
                  borderColor: '#cbd5e1',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  padding: 4,
                }}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {authError && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 10,
                padding: '11px 14px',
                fontSize: 13,
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loginLoading}
            style={{
              background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 10,
              padding: '13px 18px',
              fontSize: 14,
              fontWeight: 700,
              cursor: loginLoading ? 'not-allowed' : 'pointer',
              opacity: loginLoading ? 0.75 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'inherit',
              marginTop: 6,
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
            }}
          >
            {loginLoading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Memverifikasi...
              </>
            ) : (
              <>
                <Lock size={15} /> Masuk ke Dashboard
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
