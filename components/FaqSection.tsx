'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ADMIN_CONTACTS } from '@/lib/types';

const FAQS = [
  {
    q: 'Apakah benar-benar tidak butuh kuota internet sama sekali saat dipakai kasir?',
    a: 'Ya, 100% offline. Internet hanya dibutuhkan satu kali saat Anda mengunduh file APK dan mengaktifkan Serial Key di awal. Setelah itu, transaksi kasir, cetak struk Bluetooth, hitung expense, dan laporan laba berjalan sepenuhnya di HP/Tablet Anda tanpa kuota sepeser pun.',
  },
  {
    q: 'Bagaimana jika suatu saat HP saya rusak, hilang, atau saya ganti HP baru?',
    a: 'Data transaksi dan produk bisa Anda backup atau ekspor ke file Excel kapan saja. Tim teknis kami siap membantu proses pemindahan lisensi permanen Anda ke HP pengganti secara resmi dan gratis.',
  },
  {
    q: 'Apakah printer Bluetooth saya pasti cocok?',
    a: 'Kompatibel dengan lebih dari 50+ merk printer thermal Bluetooth 58mm maupun 80mm di pasaran Indonesia (Panda, Iware, Eppos, VSC, Kassen, Codeshop, Blueprint, dll). Jika belum memiliki printer thermal, transaksi tetap tercatat rapi dan struk transaksi bisa dipratinjau langsung di layar aplikasi.',
  },
  {
    q: 'Apakah ada fitur multi-currency dan bagaimana cara kerjanya?',
    a: 'Ya, POS OFFLINE mendukung multi-currency (IDR, USD, SGD, MYR, dll). Anda bisa mengatur mata uang dasar serta kurs konversi sehingga cocok untuk toko di kawasan wisata atau melayani pembeli luar negeri.',
  },
  {
    q: 'Bagaimana jika saya butuh fitur custom atau modifikasi alur khusus?',
    a: 'Anda bisa langsung menghubungi admin atau tim developer kami via WhatsApp. Kami siap mendiskusikan kebutuhan fitur khusus untuk bisnis Anda.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filamsi = ADMIN_CONTACTS.find((c) => c.id === 'filamsi') || ADMIN_CONTACTS[1];
  const ariyo = ADMIN_CONTACTS.find((c) => c.id === 'ariyo') || ADMIN_CONTACTS[0];

  const waAriyoUrl = `https://wa.me/${ariyo.waNumber}?text=${encodeURIComponent(
    'Halo Mas Ariyo, saya ingin tanya seputar aplikasi kasir POS OFFLINE.'
  )}`;
  const waFilamsiUrl = `https://wa.me/${filamsi.waNumber}?text=${encodeURIComponent(
    'Halo Mas Filamsi, saya butuh bantuan teknis seputar aplikasi kasir POS OFFLINE.'
  )}`;

  return (
    <footer id="faq" className="pt-8 sm:pt-10 border-t border-zinc-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left: Quick Human FAQ */}
        <div className="lg:col-span-7 space-y-3">
          <div className="mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold block mb-1">
              BANTUAN & JAWABAN
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#141414]">
              Pertanyaan yang Sering Ditanyakan
            </h3>
          </div>
          
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.q}
                className="bg-[#F3F4F6] rounded-2xl p-4 sm:p-5 cursor-pointer border border-zinc-200/70 transition shadow-xs"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <div className="font-bold text-sm sm:text-base text-[#141414] flex items-center justify-between gap-3 select-none">
                  <span>{item.q}</span>
                  <span className="w-6 h-6 rounded-full bg-white text-[#141414] inline-flex items-center justify-center text-xs font-mono font-bold shrink-0 shadow-xs">
                    {isOpen ? '−' : '+'}
                  </span>
                </div>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-zinc-600 mt-2.5 leading-relaxed pr-2">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Official Support & Admin Contact Card */}
        <div className="lg:col-span-5 bg-[#F3F4F6] rounded-[28px] p-6 sm:p-7 flex flex-col justify-between border border-zinc-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/icon.png"
                alt="POS OFFLINE Logo"
                width={36}
                height={36}
                className="rounded-xl shadow-xs"
              />
              <div>
                <h4 className="font-display font-bold text-base text-[#141414] leading-tight">
                  POS OFFLINE
                </h4>
                <span className="text-[11px] text-zinc-500 font-mono">
                  Sistem Kasir Android Lisensi Permanen
                </span>
              </div>
            </div>

            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#141414] leading-tight mb-5">
              Siap Membantu Kemajuan Usaha Toko Anda
            </h3>

            {/* Official Admin WhatsApp Contacts */}
            <div className="space-y-2.5 mb-6">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                LAYANAN WHATSAPP RESMI
              </div>

              {/* Tim Konsultasi (Ariyo) */}
              <a
                href={waAriyoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-emerald-500 transition group shadow-xs"
              >
                <div>
                  <div className="text-xs font-bold text-[#141414] flex items-center gap-1.5">
                    <span>Tim Konsultasi & Pembelian</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Tanya fitur aplikasi & panduan order
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                  Chat WA →
                </span>
              </a>

              {/* Tim Teknis (Filamsi) */}
              <a
                href={waFilamsiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-emerald-500 transition group shadow-xs"
              >
                <div>
                  <div className="text-xs font-bold text-[#141414] flex items-center gap-1.5">
                    <span>Tim Teknis & Aktivasi</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Setup printer thermal & bantuan lisensi
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                  Chat WA →
                </span>
              </a>
            </div>

            {/* Operational Info */}
            <div className="text-xs text-zinc-500 space-y-1 mb-4">
              <div>Jam Layanan: <strong>08.00 – 22.00 WIB</strong></div>
              <div>Garansi: <strong>Aktivasi Lisensi Resmi & Bantuan Setup</strong></div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono text-zinc-500 text-[11px]">
              © 2026 POS OFFLINE
            </span>
            <div className="flex items-center gap-3 text-zinc-600 text-xs font-medium">
              <Link href="/privacy" className="hover:text-[#141414] transition underline">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="hover:text-[#141414] transition underline">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
