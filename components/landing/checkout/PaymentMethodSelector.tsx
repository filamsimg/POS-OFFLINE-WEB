'use client';

import { PaymentOptionDef } from './types';

interface PaymentMethodSelectorProps {
  paymentOptions: PaymentOptionDef[];
  selectedMethod: string;
  onSelectMethod: (id: string) => void;
}

export function PaymentMethodSelector({
  paymentOptions,
  selectedMethod,
  onSelectMethod,
}: PaymentMethodSelectorProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-bold text-[#141414]">
          Pilih Metode Pembayaran:
        </label>
        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Otomatis &amp; Terverifikasi
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {paymentOptions.map((opt) => {
          const isSelected = selectedMethod === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectMethod(opt.id)}
              className={`p-3.5 rounded-xl text-left border transition relative flex items-start gap-3 cursor-pointer ${
                isSelected
                  ? 'border-[#141414] bg-[#141414] text-white shadow-sm ring-1 ring-[#C8F53B]'
                  : 'border-zinc-200 bg-[#F9FAFB] hover:bg-zinc-100 text-zinc-900'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center ${
                  isSelected
                    ? 'border-[#C8F53B] bg-[#C8F53B]'
                    : 'border-zinc-400 bg-white'
                }`}
              >
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#141414]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-xs truncate">
                    {opt.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      isSelected
                        ? 'bg-[#C8F53B] text-[#141414]'
                        : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {opt.tag}
                  </span>
                </div>
                <p
                  className={`text-[11px] mt-0.5 leading-snug line-clamp-1 ${
                    isSelected ? 'text-zinc-300' : 'text-zinc-500'
                  }`}
                >
                  {opt.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic guidance note below selection */}
      <div className="mt-2.5 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        <span>
          Pembayaran diverifikasi otomatis 24 jam oleh sistem Midtrans.
        </span>
      </div>
    </div>
  );
}
