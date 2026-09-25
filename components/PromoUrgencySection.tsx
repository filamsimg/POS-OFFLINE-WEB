'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Clock, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import { PACKAGES } from '@/lib/types';

export function PromoUrgencySection() {
  const pkg = PACKAGES['software_only'];

  // ── Live Countdown Timer: 1 Hari (24 Jam) ──────────────────────────────────
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 58,
    seconds: 40,
  });

  useEffect(() => {
    // Durasi timer: 24 jam (1 hari)
    const DURATION = 24 * 60 * 60 * 1000;
    const storageKey = 'pos_promo_countdown_target';

    let targetTime: number;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && !isNaN(Number(stored)) && Number(stored) > Date.now()) {
        targetTime = Number(stored);
      } else {
        targetTime = Date.now() + DURATION;
        localStorage.setItem(storageKey, String(targetTime));
      }
    } catch {
      targetTime = Date.now() + DURATION;
    }

    const updateTimer = () => {
      const now = Date.now();
      let diff = targetTime - now;
      if (diff <= 0) {
        // Reset 24 jam baru jika habis
        targetTime = Date.now() + DURATION;
        try {
          localStorage.setItem(storageKey, String(targetTime));
        } catch { /* silent */ }
        diff = DURATION;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDigit = (num: number) => String(num).padStart(2, '0');

  return (
    <section
      id="promo-khusus"
      style={{
        background: '#090d16',
        padding: 'clamp(56px, 8vw, 84px) clamp(16px, 4vw, 40px)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.16) 0%, rgba(14, 165, 233, 0.08) 50%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <style>{`
        .promo-urgency-card {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          background: linear-gradient(180deg, #131726 0%, #0c101c 100%);
          border: 1.5px solid rgba(34, 197, 94, 0.35);
          border-radius: 24px;
          padding: clamp(28px, 6vw, 48px) clamp(20px, 5vw, 44px);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.6), 0 0 40px rgba(34, 197, 94, 0.12);
          text-align: center;
        }

        .countdown-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(8px, 2.5vw, 16px);
          margin: 24px 0 28px;
        }

        .countdown-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: clamp(64px, 14vw, 84px);
          padding: 12px 10px;
          background: rgba(10, 14, 26, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3);
        }

        .countdown-value {
          font-family: var(--font-mono, monospace);
          font-size: clamp(28px, 6vw, 40px);
          font-weight: 800;
          color: #f8fafc;
          line-height: 1;
          letter-spacing: -0.02em;
          text-shadow: 0 0 16px rgba(34, 197, 94, 0.4);
        }

        .countdown-label {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 6px;
        }

        .countdown-sep {
          font-size: clamp(24px, 5vw, 32px);
          font-weight: 800;
          color: #4ade80;
          margin-top: -16px;
          opacity: 0.8;
          animation: pulse-colon 1s ease-in-out infinite;
        }

        @keyframes pulse-colon {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.3; }
        }

        .promo-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: clamp(15px, 2.5vw, 17px);
          padding: 16px clamp(24px, 5vw, 40px);
          border-radius: 14px;
          text-decoration: none;
          box-shadow: 0 10px 30px rgba(34, 197, 94, 0.45);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: none;
          cursor: pointer;
          width: 100%;
          max-width: 440px;
        }

        .promo-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(34, 197, 94, 0.6);
        }

        .quota-progress-track {
          width: 100%;
          max-width: 460px;
          height: 10px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 99px;
          margin: 12px auto 0;
          overflow: hidden;
          position: relative;
        }

        .quota-progress-fill {
          height: 100%;
          width: 86.6%; /* 26 of 30 sold */
          background: linear-gradient(90deg, #f59e0b 0%, #ef4444 100%);
          border-radius: 99px;
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.6);
        }
      `}</style>

      <div className="promo-urgency-card">
        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              padding: '5px 12px',
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            <Flame size={14} /> Khusus 30 Orang Pertama
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#4ade80',
              padding: '5px 12px',
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            <Sparkles size={14} /> Diskon Terbesar Rilis Perdana
          </span>
        </div>

        {/* Heading */}
        <h3
          style={{
            fontSize: 'clamp(22px, 4.5vw, 32px)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.25,
            marginBottom: 12,
          }}
        >
          Waktu Terbatas! Amankan Kuota Promo Spesial Anda
        </h3>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 14,
            color: '#cbd5e1',
            maxWidth: 580,
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Penawaran harga perdana ini hanya berlaku selama slot 30 pembeli masih tersedia.
        </p>

        {/* Live Countdown Timer */}
        <div className="countdown-box" aria-label="Penghitung Waktu Mundur Promo">
          <div className="countdown-item">
            <span className="countdown-value">{formatDigit(timeLeft.hours)}</span>
            <span className="countdown-label">Jam</span>
          </div>
          <span className="countdown-sep">:</span>
          <div className="countdown-item">
            <span className="countdown-value">{formatDigit(timeLeft.minutes)}</span>
            <span className="countdown-label">Menit</span>
          </div>
          <span className="countdown-sep">:</span>
          <div className="countdown-item">
            <span className="countdown-value">{formatDigit(timeLeft.seconds)}</span>
            <span className="countdown-label">Detik</span>
          </div>
        </div>

        {/* Quota Tracker */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: 13,
              color: '#f8fafc',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#ef4444',
                display: 'inline-block',
                boxShadow: '0 0 10px #ef4444',
              }}
            />
            Sisa Kuota Promo: <span style={{ color: '#ef4444', fontWeight: 800 }}>Tersisa 4 Lisensi</span> dari 30 Kuota
          </div>
          <div className="quota-progress-track">
            <div className="quota-progress-fill" />
          </div>
        </div>

        {/* Price Contrast Area */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 18,
            padding: '20px 24px',
            maxWidth: 540,
            margin: '0 auto 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {/* Strikethrough Old Price (Option A: Sesuai Checkout & Payment Gateway) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Harga Normal:</span>
            <span
              style={{
                fontSize: 'clamp(18px, 3.5vw, 22px)',
                fontWeight: 800,
                color: '#ef4444',
                textDecoration: 'line-through',
                textDecorationColor: '#ef4444',
                textDecorationThickness: '3px',
                letterSpacing: '0.02em',
                background: 'rgba(239, 68, 68, 0.12)',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              Rp {pkg.originalPrice.toLocaleString('id-ID')}
            </span>
            <span
              style={{
                background: '#ef4444',
                color: '#ffffff',
                fontSize: 11,
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: 6,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              HEMAT 57%
            </span>
          </div>

          {/* Flash Promo Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <span
              style={{
                fontSize: 'clamp(34px, 7vw, 52px)',
                fontWeight: 900,
                color: '#22c55e',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                textShadow: '0 0 25px rgba(34, 197, 94, 0.45)',
              }}
            >
              Rp {pkg.price.toLocaleString('id-ID')}
            </span>
            <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600 }}>/ Lisensi</span>
          </div>
          <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 700 }}>
            Sekali Bayar • Berlaku Permanen Seumur Hidup
          </span>
        </div>

        {/* Required Statements per User Specification */}
        <div
          style={{
            maxWidth: 620,
            margin: '0 auto 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(13px, 2.5vw, 15px)',
              fontWeight: 800,
              color: '#fbbf24',
              lineHeight: 1.5,
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              padding: '8px 16px',
              borderRadius: 10,
              margin: 0,
            }}
          >
            ⚠️ Harga sewaktu-waktu bisa naik setelah kuota promo 30 orang terpenuhi.
          </p>
          <p
            style={{
              fontSize: 'clamp(13px, 2.5vw, 14.5px)',
              fontWeight: 600,
              color: '#f1f5f9',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Dapatkan sekarang untuk selamanya dan pasti dapat update fitur berkala serta gratis konsultasi langsung bersama tim pengembang.
          </p>
        </div>

        {/* Action Button (WITHOUT price in button label, per user request) */}
        <div>
          <a href="#checkout" className="promo-cta-btn">
            <span>Ambil Lisensi Permanen Sekarang</span>
            <ArrowRight size={18} />
          </a>
        </div>

        {/* Trust Badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px 24px',
            marginTop: 20,
            fontSize: 12,
            color: '#94a3b8',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={14} style={{ color: '#22c55e' }} /> Aktivasi Instan Langsung Aktif
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={14} style={{ color: '#22c55e' }} /> 100% Offline Tanpa Potongan
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={14} style={{ color: '#38bdf8' }} /> Garansi Lisensi Resmi
          </span>
        </div>
      </div>
    </section>
  );
}
