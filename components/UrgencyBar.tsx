'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Clock } from 'lucide-react';

export function UrgencyBar() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 59, seconds: 59 }; // reset loop
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs sm:text-sm font-medium py-2 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 font-bold tracking-wide uppercase bg-black/25 px-2 py-0.5 rounded-full text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          Promo Rilis Terbatas
        </span>
        <span className="hidden sm:inline">Diskon 60% Beli Putus Seumur Hidup! Berakhir dalam:</span>
        <span className="sm:hidden">Sisa waktu promo:</span>
        <div className="inline-flex items-center gap-1 bg-white text-red-700 font-extrabold px-2 py-0.5 rounded shadow-sm text-xs">
          <Clock className="w-3 h-3 text-red-600" />
          <span>{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
        </div>
      </div>
    </div>
  );
}
