import Image from 'next/image';
import { UrgencyBar } from '@/components/UrgencyBar';
import { HeroSection } from '@/components/HeroSection';
import { PainPoints } from '@/components/PainPoints';
import { FeatureGrid } from '@/components/FeatureGrid';
import { ComparisonTable } from '@/components/ComparisonTable';
import { CheckoutForm } from '@/components/CheckoutForm';
import { FaqSection } from '@/components/FaqSection';
import { StickyMobileCta } from '@/components/StickyMobileCta';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16 sm:pb-0 font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Urgency Bar */}
      <UrgencyBar />

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Pain Points vs Solution */}
      <PainPoints />

      {/* 4. Core Features Grid */}
      <FeatureGrid />

      {/* 5. SaaS vs POS OFFLINE Comparison */}
      <ComparisonTable />

      {/* 6. Scalev-Style One-Page Checkout Form */}
      <CheckoutForm />

      {/* 7. FAQ Accordion */}
      <FaqSection />

      {/* 8. Footer */}
      <footer className="bg-[#0b1714] text-slate-400 py-12 px-4 sm:px-6 border-t border-[#183630] text-center text-xs sm:text-sm">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-white font-extrabold text-lg">
            <Image
              src="/icon.png"
              alt="POS OFFLINE Logo"
              width={32}
              height={32}
              className="rounded-lg shadow-sm border border-emerald-500/30"
            />
            <span>POS OFFLINE</span>
          </div>

          <p className="max-w-md text-slate-500 text-xs leading-relaxed">
            Sistem aplikasi kasir pintar Android 100% offline non-langganan. Dirancang untuk memajukan UMKM di seluruh Indonesia.
          </p>

          <div className="flex items-center gap-4 text-slate-500 text-xs">
            <span>Sekali Beli Aktif Seumur Hidup</span>
            <span>•</span>
            <span>Garansi Lisensi Permanen</span>
            <span>•</span>
            <span>Bantuan WhatsApp Resmi</span>
          </div>

          <p className="text-[11px] text-slate-600 mt-4">
            &copy; {new Date().getFullYear()} POS OFFLINE. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </footer>

      {/* 9. Floating Conversions */}
      <StickyMobileCta />
      <FloatingWhatsApp />
    </main>
  );
}
