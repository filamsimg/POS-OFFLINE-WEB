'use client';

export function StickyMobileCta() {
  return (
    <>
      <style>{`
        @media (min-width: 640px) {
          .sticky-mobile-cta { display: none !important; }
        }
      `}</style>
      <div
        className="sticky-mobile-cta"
        style={{
          position:             'fixed',
          bottom:               0,
          left:                 0,
          right:                0,
          zIndex:               40,
          padding:              '10px 16px max(12px, env(safe-area-inset-bottom))',
          background:           'rgba(8, 9, 14, 0.92)',
          backdropFilter:       'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop:            '1px solid var(--clr-sage)',
          boxShadow:            '0 -6px 24px rgba(0, 0, 0, 0.4)',
          display:              'flex',
          gap:                  10,
        }}
      >
        <a
          href="#checkout"
          className="btn-primary btn-shimmer"
          style={{
            flex:           1,
            fontSize:       15,
            fontWeight:     800,
            padding:        '13px 18px',
            minHeight:      48,
            boxSizing:      'border-box',
            justifyContent: 'center',
            borderRadius:   10,
            boxShadow:      '0 4px 16px rgba(34, 197, 94, 0.35)',
          }}
        >
          Dapatkan Lisensi Sekarang (Rp 149.000)
        </a>
      </div>
    </>
  );
}
