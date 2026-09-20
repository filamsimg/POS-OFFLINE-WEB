'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Apakah benar-benar sekali bayar tanpa biaya bulanan lagi?',
    a: 'Benar 100%! Anda hanya membayar satu kali saat pembelian pertama. Tidak ada biaya langganan bulanan, biaya tahunan, maupun potongan komisi dari setiap transaksi penjualan Anda.',
  },
  {
    q: 'Bagaimana jika nanti saya ganti HP baru? Apakah harus beli lisensi lagi?',
    a: 'Tidak perlu! POS OFFLINE dilengkapi fitur Backup & Restore database. Anda cukup mencadangkan data toko Anda ke file JSON, lalu memulihkannya di smartphone baru dalam hitungan detik. Semua data katalog produk dan riwayat transaksi akan kembali utuh 100%.',
  },
  {
    q: 'Apakah aplikasi membutuhkan koneksi internet saat melayani pembeli?',
    a: 'Sama sekali tidak! Aplikasi ini bekerja 100% secara offline mandiri di perangkat Android Anda. Bahkan saat HP dalam Mode Pesawat (Airplane Mode) atau saat mati lampu, kasir tetap bisa cetak struk dan mencatat penjualan dengan lancar.',
  },
  {
    q: 'Printer apa saja yang kompatibel dengan aplikasi ini?',
    a: 'Mendukung semua merk printer thermal Bluetooth standar ESC/POS ukuran 58mm maupun 80mm yang ada di pasaran, seperti Panda, Eppos, VSC, RPP02N, Zijiang, Iware, Zywell, dan sejenisnya.',
  },
  {
    q: 'Bagaimana cara instalasi dan mendapatkan kode aktivasinya?',
    a: 'Sangat mudah! Setelah menyelesaikan pesanan di halaman ini, Anda akan langsung mendapatkan file APK dan petunjuk instalasi. Buka aplikasi di HP, salin Device ID yang muncul, lalu masukkan ke halaman verifikasi untuk mendapatkan Serial Key aktivasi seumur hidup secara instan.',
  },
  {
    q: 'Saya gaptek dan belum pernah pakai aplikasi kasir, apakah dibantu?',
    a: 'Pasti dibantu! Paket pembelian sudah termasuk akses 11 video tutorial lengkap langkah-demi-langkah (mulai dari pertama buka sampai cetak struk), serta layanan konsultasi WhatsApp dengan tim teknis kami.',
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-20 px-4 sm:px-6 bg-white text-slate-900 border-t border-slate-200">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-emerald-800 uppercase bg-emerald-100/60 border border-emerald-200 px-3 py-1 rounded-full">
            Tanya Jawab
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-2 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Semua yang perlu Anda ketahui sebelum membeli aplikasi POS OFFLINE
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-5 font-bold text-sm sm:text-base text-slate-900 flex justify-between items-center gap-4 bg-slate-50/50 hover:bg-slate-100/60 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50">
                    <p className="border-t border-slate-200/60 pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
