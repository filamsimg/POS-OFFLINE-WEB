'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, ShoppingBag, Wrench, ChevronRight, Sparkles } from 'lucide-react';
import { ADMIN_CONTACTS } from '@/lib/types';

export function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Pre-configured message per admin role
  const getPreFilledMessage = (id: 'ariyo' | 'filamsi', name: string) => {
    if (id === 'ariyo') {
      return encodeURIComponent(
        `Halo Mas ${name}, saya tertarik dengan aplikasi kasir POS OFFLINE dan ingin konsultasi mengenai fitur & cara pembelian.`
      );
    }
    return encodeURIComponent(
      `Halo Mas ${name}, saya butuh bantuan teknis terkait aplikasi kasir POS OFFLINE (kompatibilitas HP / printer / lisensi).`
    );
  };

  return (
    <div ref={containerRef}>
      <style>{`
        .floating-wa-wrapper {
          position: fixed;
          z-index: 50;
          bottom: calc(max(12px, env(safe-area-inset-bottom)) + 74px);
          right: 16px;
        }
        @media (min-width: 640px) {
          .floating-wa-wrapper {
            bottom: 24px;
            right: 24px;
          }
        }

        .floating-wa-popup {
          position: absolute;
          bottom: 64px;
          right: 0;
          width: clamp(300px, 86vw, 360px);
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          box-shadow: 0 16px 36px -6px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          animation: waPopupIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: bottom right;
        }

        @keyframes waPopupIn {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(12px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .admin-option-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          text-decoration: none;
          color: #0f172a;
          transition: all 0.15s ease;
          cursor: pointer;
        }
        .admin-option-btn:hover {
          background: #f0fdf4;
          border-color: #86efac;
          transform: translateX(-2px);
        }
      `}</style>

      <div className="floating-wa-wrapper">
        {/* ── Pop-up Mini Pilihan Admin ─────────────────────────────────── */}
        {isOpen && (
          <div className="floating-wa-popup">
            {/* Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                padding: '16px 18px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MessageCircle size={20} fill="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em' }}>
                    Hubungi Tim POS OFFLINE
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.9, marginTop: 1 }}>
                    Pilih admin sesuai kebutuhan Anda:
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup"
                style={{
                  background: 'rgba(0, 0, 0, 0.15)',
                  border: 'none',
                  borderRadius: 8,
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* List Admin */}
            <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ADMIN_CONTACTS.map((admin) => {
                const isSales = admin.id === 'ariyo';
                const msg = getPreFilledMessage(admin.id, admin.name);

                return (
                  <a
                    key={admin.id}
                    href={`https://wa.me/${admin.waNumber}?text=${msg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-option-btn"
                    onClick={() => setIsOpen(false)}
                  >
                    {/* Icon / Avatar */}
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        background: isSales ? '#dcfce7' : '#eff6ff',
                        color: isSales ? '#16a34a' : '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isSales ? <ShoppingBag size={20} /> : <Wrench size={20} />}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>
                          {admin.name}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: 6,
                            background: isSales ? '#dcfce7' : '#eff6ff',
                            color: isSales ? '#15803d' : '#1d4ed8',
                          }}
                        >
                          {isSales ? 'Pembelian' : 'Teknis'}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#64748b',
                          lineHeight: 1.4,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {admin.desc}
                      </div>
                    </div>

                    <ChevronRight size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
                  </a>
                );
              })}
            </div>

            {/* Footer note */}
            <div
              style={{
                padding: '10px 14px 12px',
                background: '#f8fafc',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 11,
                color: '#64748b',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
                Online (08.00 – 22.00 WIB)
              </span>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>Balas Cepat</span>
            </div>
          </div>
        )}

        {/* ── Trigger Button ────────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Tutup Pilihan WhatsApp' : 'Chat WhatsApp Admin POS OFFLINE'}
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: isOpen ? '#0f172a' : '#25d366',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: isOpen
              ? '0 6px 20px rgba(15, 23, 42, 0.4)'
              : '0 6px 24px rgba(37, 211, 102, 0.5)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, background-color 0.15s ease',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <>
              <MessageCircle size={28} fill="currentColor" />
              {/* Notification dot */}
              <span
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: '#ef4444',
                  border: '2px solid #ffffff',
                }}
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
