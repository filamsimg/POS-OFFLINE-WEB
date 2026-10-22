'use client';

export function CheckoutStepBanner() {
  return (
    <div className="mb-8 pb-7 border-b border-zinc-200">
      <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-2 font-semibold">
        TRANSPARAN &amp; TANPA RIBET
      </span>
      <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#141414] mb-5 leading-snug">
        Apa yang Terjadi Setelah Anda Klik Bayar?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-zinc-200 flex items-start gap-3 shadow-xs">
          <span className="w-7 h-7 rounded-full bg-[#C8F53B] text-[#141414] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
            1
          </span>
          <div>
            <div className="font-bold text-sm text-[#141414]">Isi Data &amp; Bayar Instan</div>
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              Mendukung QRIS (GoPay, OVO, Dana, ShopeePay, m-Banking) serta Virtual Account BCA, Mandiri, BRI, BNI.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-zinc-200 flex items-start gap-3 shadow-xs">
          <span className="w-7 h-7 rounded-full bg-[#C8F53B] text-[#141414] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
            2
          </span>
          <div>
            <div className="font-bold text-sm text-[#141414]">Link APK &amp; Serial Key Masuk</div>
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              Kurang dari 1 menit setelah verifikasi, file installer resmi dan kode lisensi permanen dikirim ke Email &amp; WA Anda.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-zinc-200 flex items-start gap-3 shadow-xs">
          <span className="w-7 h-7 rounded-full bg-[#C8F53B] text-[#141414] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
            3
          </span>
          <div>
            <div className="font-bold text-sm text-[#141414]">Aktif Selamanya di Toko</div>
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              Masukkan kode aktivasi 1 kali, dan aplikasi kasir Anda langsung aktif seumur hidup tanpa biaya langganan bulanan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
