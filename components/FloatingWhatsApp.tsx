'use client';

import { MessageCircle } from 'lucide-react';

export function FloatingWhatsApp() {
  const waNumber = '6281234567890'; // User can customize in env or settings
  const message = encodeURIComponent(
    'Halo Admin POS OFFLINE, saya ingin tanya-tanya mengenai lisensi permanen aplikasi kasir dan paket printer thermalnya. Boleh dibantu?'
  );

  return (
    <a
      href={`https://wa.me/${waNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-full shadow-xl flex items-center gap-2 border-2 border-white/60 transition-transform duration-200 group"
      aria-label="Tanya via WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-white" />
      <span className="hidden sm:inline">Tanya via WhatsApp</span>
    </a>
  );
}
