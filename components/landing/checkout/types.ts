export interface PaymentOptionDef {
  id: string;
  name: string;
  desc: string;
  tag: string;
  isPopular?: boolean;
}

export interface BusinessPreset {
  id: string;
  label: string;
}

export interface PendingResumeOrder {
  id: string;
  name?: string;
  store?: string;
  time: number;
}

export interface CheckoutFormValues {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  storeName: string;
  businessType: string;
  notes: string;
}

export const BUSINESS_PRESETS: BusinessPreset[] = [
  { id: 'Warung & Sembako', label: 'Warung & Sembako' },
  { id: 'Kafe & Resto', label: 'Kafe & Resto' },
  { id: 'Fashion & Butik', label: 'Fashion & Butik' },
  { id: 'Apotek & Obat', label: 'Apotek & Obat' },
  { id: 'Bengkel & Jasa', label: 'Bengkel & Jasa' },
  { id: 'Usaha Lainnya', label: 'Usaha Lainnya' },
];

export const DEFAULT_PAYMENT_OPTIONS: PaymentOptionDef[] = [
  {
    id: 'gopay',
    name: 'GoPay',
    desc: 'E-Wallet',
    tag: 'Otomatis',
    isPopular: true,
  },
  {
    id: 'mandiri',
    name: 'Bank Mandiri',
    desc: 'Virtual Account',
    tag: 'Otomatis',
  },
  {
    id: 'bri',
    name: 'Bank BRI',
    desc: 'Virtual Account',
    tag: 'Otomatis',
  },
  {
    id: 'bni',
    name: 'Bank BNI',
    desc: 'Virtual Account',
    tag: 'Otomatis',
  },
  {
    id: 'bsi',
    name: 'Bank BSI',
    desc: 'Virtual Account',
    tag: 'Otomatis',
  },
];
