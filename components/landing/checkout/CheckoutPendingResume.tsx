'use client';

import { PendingResumeOrder } from './types';

interface CheckoutPendingResumeProps {
  order: PendingResumeOrder;
  onResume: (orderId: string) => void;
  onDismiss: () => void;
}

export function CheckoutPendingResume({ order, onResume, onDismiss }: CheckoutPendingResumeProps) {
  return (
    <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 text-xs sm:text-sm text-amber-950">
      <div className="leading-snug">
        <strong className="block font-bold text-amber-950 text-xs sm:text-sm">
          Lanjutkan Pesanan Sebelumnya?
        </strong>
        <span className="text-amber-800 text-xs mt-0.5 block">
          Ada pesanan aktif atas nama <strong>{order.name || 'Anda'}</strong> yang belum diselesaikan.
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 sm:pt-0 shrink-0">
        <button
          type="button"
          onClick={() => onResume(order.id)}
          className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-[#141414] text-[#C8F53B] rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 active:scale-[0.98] transition shadow-xs cursor-pointer"
        >
          <span>Lanjut Bayar Pesanan Ini</span>
          <span>→</span>
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="w-full sm:w-auto min-h-[44px] px-3.5 py-2 text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-100/70 hover:bg-amber-100 border border-amber-200 rounded-xl transition text-center cursor-pointer"
        >
          Buat Pesanan Baru
        </button>
      </div>
    </div>
  );
}
