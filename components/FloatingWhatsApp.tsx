'use client';

import { useState } from 'react';
import { MessageCircle, X, ChevronUp, UserCheck } from 'lucide-react';
import { ADMIN_CONTACTS } from '@/lib/types';

export function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);

  const getWaLink = (phone: string, adminName: string) => {
    const text = encodeURIComponent(
      `Halo ${adminName} (Admin POS OFFLINE), saya ingin tanya-tanya mengenai lisensi permanen aplikasi kasir Android Rp 149.000. Boleh dibantu?`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* Popover options when open */}
      {isOpen && (
        <div className="mb-3 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 w-64 text-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Pilih Admin WhatsApp:
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Tutup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {ADMIN_CONTACTS.map((admin) => (
              <a
                key={admin.id}
                href={getWaLink(admin.waNumber, admin.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 transition-colors group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    {admin.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                      {admin.name}
                    </p>
                    <p className="text-[10px] text-slate-500">{admin.role} • {admin.phone}</p>
                  </div>
                </div>
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Main floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-full shadow-xl flex items-center gap-2 border-2 border-white/60 transition-transform duration-200 cursor-pointer"
        aria-label="Hubungi Admin WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="hidden sm:inline">Hubungi Admin ({ADMIN_CONTACTS.length})</span>
        <span className="sm:hidden">Chat WA</span>
      </button>
    </div>
  );
}
