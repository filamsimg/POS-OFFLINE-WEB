'use client';

import { MessageCircle } from 'lucide-react';

const WA = process.env.NEXT_PUBLIC_WA_NUMBER ?? '6285853685622';
const MSG = encodeURIComponent('Halo Admin, saya ingin konsultasi mengenai aplikasi kasir POS OFFLINE.');

export function FloatingWhatsApp() {
  return (
    <>
      <style>{`
        .floating-wa-btn {
          bottom: calc(max(12px, env(safe-area-inset-bottom)) + 74px) !important;
          right: 16px !important;
        }
        @media (min-width: 640px) {
          .floating-wa-btn {
            bottom: 24px !important;
            right: 24px !important;
          }
        }
      `}</style>
      <a
        href={`https://wa.me/${WA}?text=${MSG}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Admin POS OFFLINE"
        className="floating-wa-btn"
        style={{
          position:        'fixed',
          zIndex:          50,
          width:           52,
          height:          52,
          borderRadius:    '50%',
          background:      '#25d366',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          color:           '#fff',
          boxShadow:       '0 4px 20px rgba(37, 211, 102, 0.45)',
          textDecoration:  'none',
          transition:      'transform 0.15s, box-shadow 0.15s',
          cursor:          'pointer',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.08)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
        }}
      >
        <MessageCircle size={26} fill="currentColor" />
      </a>
    </>
  );
}
