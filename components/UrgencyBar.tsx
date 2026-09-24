'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

export function UrgencyBar() {
  return (
    <>
      <style>{`
        @keyframes border-beam-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Container Model B: Announcement Bar full width */
        .announcement-bar-hybrid {
          position: relative;
          width: 100%;
          background: #0d0f1a;
          text-decoration: none;
          display: block;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
          /* Ketebalan border tempat cahaya berputar */
          padding: 1.5px 0;
          transition: background-color 0.2s ease;
        }

        /* Berkas sinar cahaya berputar Model A (Hijau -> Putih Berkilau -> Hijau) */
        .announcement-bar-hybrid::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 250vw;
          height: 250vw;
          margin-top: -125vw;
          margin-left: -125vw;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 280deg,
            rgba(34, 197, 94, 0.2) 300deg,
            #22c55e 325deg,
            #ffffff 345deg,
            #22c55e 355deg,
            transparent 360deg
          );
          animation: border-beam-rotate 4s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        /* Background bagian dalam bar yang menimpa tengah agar cahaya hanya terlihat di border */
        .announcement-bar-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          background: #141728;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          box-sizing: border-box;
          transition: background-color 0.2s ease;
        }

        .announcement-bar-hybrid:hover .announcement-bar-inner {
          background: #191e33;
        }

        /* Chip label "PROMO" */
        .bar-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.4);
          color: #4ade80;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 6px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          flex-shrink: 0;
          line-height: 1.2;
        }

        /* Responsivitas Mobile Friendly */
        .bar-content {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          color: #f0f1f8;
          font-weight: 600;
          letter-spacing: 0.01em;
          white-space: nowrap;
          max-width: 100%;
        }

        .bar-cta {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #22c55e;
          font-weight: 700;
          font-size: 11.5px;
          flex-shrink: 0;
          transition: transform 0.15s ease;
        }

        .announcement-bar-hybrid:hover .bar-cta {
          transform: translateX(2px);
          color: #4ade80;
        }

        /* Text switcher: ringkas di HP, lengkap di Tablet & Desktop */
        .text-mobile-only {
          display: inline;
        }
        .text-desktop-only {
          display: none;
        }

        @media (min-width: 640px) {
          .announcement-bar-inner {
            padding: 9px 16px;
          }
          .bar-content {
            font-size: 13px;
            gap: 12px;
          }
          .bar-cta {
            font-size: 12.5px;
          }
          .text-mobile-only {
            display: none;
          }
          .text-desktop-only {
            display: inline;
          }
        }
      `}</style>

      <aside aria-label="Pengumuman Penawaran Khusus">
        <a href="#checkout" className="announcement-bar-hybrid">
          <div className="announcement-bar-inner">
            <div className="bar-content">
              {/* Chip Tag */}
              <span className="bar-chip">
                <Sparkles size={11} />
                <span className="text-desktop-only">PROMO TERBATAS</span>
                <span className="text-mobile-only">PROMO</span>
              </span>

              {/* Teks Penawaran */}
              <span>
                Lisensi Permanen{' '}
                <strong style={{ color: '#4ade80', fontWeight: 800 }}>Rp 149.000</strong>
                <span className="text-desktop-only"> (Sekali Bayar)</span>
              </span>

              {/* Tombol CTA */}
              <span className="bar-cta">
                <span className="text-desktop-only">Klaim Sekarang</span>
                <span className="text-mobile-only">Klaim</span>
                <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </a>
      </aside>
    </>
  );
}
