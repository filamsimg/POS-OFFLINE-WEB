'use client';

import Image from 'next/image';
import { ArrowDown, ShieldCheck, WifiOff, Infinity } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: <WifiOff size={14} />,     label: '100% Offline' },
  { icon: <Infinity size={14} />,    label: 'Lisensi Seumur Hidup' },
  { icon: <ShieldCheck size={14} />, label: 'Garansi Resmi' },
];

export function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        background: 'var(--clr-forest)',
        borderBottom: '1px solid var(--clr-sage)',
        paddingTop: 'clamp(48px, 8vw, 96px)',
        paddingBottom: 'clamp(48px, 8vw, 96px)',
        overflow: 'hidden',
      }}
    >
      <style>{`
        /* ─── Hero-Specific Aura & Layout Styles (Modular Animations in globals.css) ─── */
        
        @keyframes aura-glow {
          0%, 100% {
            opacity: 0.55;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.08);
          }
        }

        .hero-mockup-card {
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: var(--clr-moss);
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(34, 197, 94, 0.1);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .hardware-float:hover .hero-mockup-card {
          border-color: rgba(34, 197, 94, 0.4);
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.65), 0 0 30px rgba(34, 197, 94, 0.2);
        }

        .hero-aurora-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 120%;
          height: 120%;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            ellipse at center,
            rgba(34, 197, 94, 0.22) 0%,
            rgba(20, 184, 166, 0.12) 40%,
            transparent 70%
          );
          filter: blur(45px);
          pointer-events: none;
          z-index: 0;
          animation: aura-glow 8s ease-in-out infinite;
        }

        .hero-ghost-btn {
          transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
        }

        .hero-ghost-btn:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .trust-pill {
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .trust-pill:hover {
          transform: translateY(-1px);
          color: var(--clr-cream) !important;
        }

        @media (max-width: 640px) {
          .hero-cta-btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-aurora-glow {
            animation: none !important;
          }
        }
      `}</style>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: 'clamp(32px, 6vw, 72px)',
            alignItems: 'center',
          }}
        >
          {/* ── Left: Copy ──────────────────────────────────────────────── */}
          <div>
            {/* Eyebrow */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(61,186,120,0.1)',
                border: '1px solid rgba(61,186,120,0.25)',
                borderRadius: 99,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--clr-mint)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 24,
              }}
            >
              <span className="radar-dot" />
              Sekali Bayar, Aktif Seumur Hidup
            </div>

            {/* Headline */}
            <h1
              className="heading-xl"
              style={{ marginBottom: 20 }}
            >
              Kasir Android{' '}
              <span style={{ color: 'var(--clr-leaf)', display: 'block' }}>
                Tanpa Biaya Bulanan.<br />Selamanya.
              </span>
            </h1>

            {/* Sub */}
            <p
              style={{
                fontSize: 'clamp(15px, 2vw, 17px)',
                color: 'var(--clr-sand)',
                lineHeight: 1.7,
                maxWidth: '46ch',
                marginBottom: 36,
              }}
            >
              Beli sekali, cukup bayar <strong style={{ color: 'var(--clr-cream)' }}>Rp 149.000</strong> dan aplikasi kasir Android Anda aktif selamanya.
              Cetak struk Bluetooth, scan barcode, kelola stok dan laporan laba tanpa kuota atau internet.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
              <a
                href="#checkout"
                className="btn-primary btn-shimmer hero-cta-btn"
                style={{ fontSize: 16, padding: '15px 32px' }}
              >
                Dapatkan Lisensi (Rp 149.000)
              </a>
              <a
                href="#fitur"
                className="btn-ghost hero-cta-btn hero-ghost-btn"
              >
                Lihat Fitur Lengkap
                <ArrowDown size={15} />
              </a>
            </div>

            {/* Trust row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px 20px',
                paddingTop: 20,
                borderTop: '1px solid var(--clr-sage)',
              }}
            >
              {TRUST_ITEMS.map((item) => (
                <span
                  key={item.label}
                  className="trust-pill"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--clr-sand)',
                    cursor: 'default',
                  }}
                >
                  <span style={{ color: 'var(--clr-leaf)' }}>{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Product Image with Ambient Aurora & Float ────────── */}
          <div style={{ position: 'relative' }}>
            {/* Ambient Aurora Studio Glow */}
            <div className="hero-aurora-glow" />

            {/* Floating Hardware Card */}
            <div className="hardware-float">
              <div className="hero-mockup-card">
                <Image
                  src="/hero-mockup.jpg"
                  alt="Aplikasi Kasir POS OFFLINE di smartphone Android dengan printer thermal Bluetooth"
                  width={700}
                  height={480}
                  priority
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover',
                  }}
                />
                {/* Caption bar */}
                <div
                  style={{
                    padding: '12px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 8,
                    fontSize: 11,
                    color: 'var(--clr-sand)',
                    borderTop: '1px solid var(--clr-sage)',
                    background: 'rgba(14, 15, 24, 0.95)',
                  }}
                >
                  <span style={{ fontFamily: 'monospace', color: 'var(--clr-mint)' }}>
                    POS OFFLINE v1.0 • Android Native
                  </span>
                  <span>Kompatibel 50+ Merk Printer Thermal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
