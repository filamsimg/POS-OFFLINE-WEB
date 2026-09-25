import { UrgencyBar }          from '@/components/UrgencyBar';
import { HeroSection }         from '@/components/HeroSection';
import { PainPoints }          from '@/components/PainPoints';
import { AppPreviewSection }   from '@/components/AppPreviewSection';
import { FeatureGrid }         from '@/components/FeatureGrid';
import { SocialProof }         from '@/components/SocialProof';
import { PromoUrgencySection } from '@/components/PromoUrgencySection';
import { ComparisonTable }     from '@/components/ComparisonTable';
import { CheckoutForm }        from '@/components/CheckoutForm';
import { FaqSection }          from '@/components/FaqSection';
import { StickyMobileCta }     from '@/components/StickyMobileCta';
import { FloatingWhatsApp }    from '@/components/FloatingWhatsApp';
import { ADMIN_CONTACTS }       from '@/lib/types';
import Image                   from 'next/image';

export default function Home() {
  const ariyoContact   = ADMIN_CONTACTS.find((c) => c.id === 'ariyo');
  const filamsiContact = ADMIN_CONTACTS.find((c) => c.id === 'filamsi');

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
  ).replace(/\/+$/, '');

  return (
    <main>
      {/* 1. Urgency countdown bar (Floating Sticky) */}
      <UrgencyBar />

      {/* 2. Hero */}
      <HeroSection />

      {/* 3. Pain → Solution */}
      <PainPoints />

      {/* 4. Real App Screenshot Showcase */}
      <AppPreviewSection />

      {/* 5. Feature grid */}
      <FeatureGrid />

      {/* 6. Social proof / testimonials */}
      <SocialProof />

      {/* 7. Special Promo Urgency & Countdown (Post-Testimonial) */}
      <PromoUrgencySection />

      {/* 8. Comparison table */}
      <ComparisonTable />

      {/* 9. Checkout form */}
      <CheckoutForm />

      {/* 10. FAQ */}
      <FaqSection />

      {/* 9. Footer */}
      <footer
        style={{
          background: '#080f0c',
          borderTop: '1px solid var(--clr-sage)',
          padding: 'clamp(40px, 6vw, 64px) clamp(16px, 4vw, 48px)',
          color: 'var(--clr-fog)',
          fontSize: 13,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 40,
            justifyContent: 'space-between',
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Image
                src="/icon.png"
                alt="POS OFFLINE Logo"
                width={32}
                height={32}
                style={{ borderRadius: 8 }}
              />
              <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--clr-cream)' }}>
                POS OFFLINE
              </span>
            </div>
            <p style={{ lineHeight: 1.7, fontSize: 13, color: 'var(--clr-fog)' }}>
              Aplikasi kasir Android 100% offline untuk UMKM Indonesia.
              Bayar sekali, aktif seumur hidup.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--clr-sand)', marginBottom: 12, fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Produk
              </div>
              {['#fitur', '#perbandingan', '#testimoni', '#faq'].map((href) => (
                <div key={href} style={{ marginBottom: 8 }}>
                  <a href={href} style={{ color: 'var(--clr-fog)', textDecoration: 'none', fontSize: 13 }}>
                    {href === '#fitur'        && 'Fitur Lengkap'}
                    {href === '#perbandingan' && 'Perbandingan'}
                    {href === '#testimoni'    && 'Testimoni'}
                    {href === '#faq'          && 'FAQ'}
                  </a>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontWeight: 700, color: 'var(--clr-sand)', marginBottom: 12, fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Kontak & Support
              </div>
              {ariyoContact?.waNumber && (
                <div style={{ marginBottom: 6 }}>
                  <a
                    href={`https://wa.me/${ariyoContact.waNumber}?text=${encodeURIComponent(`Halo Mas ${ariyoContact.name}, saya mau konsultasi mengenai pembelian aplikasi POS OFFLINE.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#25d366', textDecoration: 'none', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    WA: {ariyoContact.name} (Pembelian)
                  </a>
                </div>
              )}
              {filamsiContact?.waNumber && (
                <div style={{ marginBottom: 8 }}>
                  <a
                    href={`https://wa.me/${filamsiContact.waNumber}?text=${encodeURIComponent(`Halo Mas ${filamsiContact.name}, saya butuh bantuan teknis terkait aplikasi POS OFFLINE.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#25d366', textDecoration: 'none', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    WA: {filamsiContact.name} (Teknis & Setup)
                  </a>
                </div>
              )}
              <div style={{ fontSize: 12, color: 'var(--clr-fog)' }}>
                Setiap Hari: 08.00 – 22.00 WIB
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: 1100,
            margin: '32px auto 0',
            paddingTop: 20,
            borderTop: '1px solid var(--clr-sage)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
            fontSize: 11,
            color: 'var(--clr-fog)',
          }}
        >
          <span>© {new Date().getFullYear()} POS OFFLINE. Hak Cipta Dilindungi.</span>
          <span>
            <a href="/privacy" style={{ color: 'var(--clr-sand)', marginRight: 16, textDecoration: 'none' }}>Kebijakan Privasi</a>
            <a href="/terms"   style={{ color: 'var(--clr-sand)', marginRight: 16, textDecoration: 'none' }}>Syarat & Ketentuan</a>
            <a href="/terms"   style={{ color: 'var(--clr-sand)', textDecoration: 'none' }}>Pengembalian Dana & Garansi</a>
          </span>
        </div>
      </footer>

      {/* Floating */}
      <StickyMobileCta />
      <FloatingWhatsApp />
    </main>
  );
}
