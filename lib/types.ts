// ─── Package Types ──────────────────────────────────────────────────────────

export type PackageType = 'software_only';

export interface PackageDetail {
  id:            PackageType;
  name:          string;
  badge:         string;
  originalPrice: number;
  price:         number;
  description:   string;
  features:      string[];
  popular?:      boolean;
}

// ─── Admin Contacts ─────────────────────────────────────────────────────────

export interface AdminContact {
  id:       'filamsi' | 'ariyo';
  name:     string;
  role:     string;
  desc:     string;
  phone:    string;
  waNumber: string;
}

const ariyoWa = process.env.NEXT_PUBLIC_ADMIN_ARIYO_WA || process.env.NEXT_PUBLIC_ADMIN_ARIYO_PHONE || '';
const filamsiWa = process.env.NEXT_PUBLIC_ADMIN_FILAMSI_WA || process.env.NEXT_PUBLIC_ADMIN_FILAMSI_PHONE || process.env.NEXT_PUBLIC_WA_NUMBER || '';

export const ADMIN_CONTACTS: AdminContact[] = [
  {
    id:       'ariyo',
    name:     process.env.NEXT_PUBLIC_ADMIN_ARIYO_NAME || 'Ariyo',
    role:     'Konsultasi & Pembelian',
    desc:     'Tanya fitur aplikasi, kecocokan toko, & cara order',
    phone:    ariyoWa,
    waNumber: ariyoWa,
  },
  {
    id:       'filamsi',
    name:     process.env.NEXT_PUBLIC_ADMIN_FILAMSI_NAME || 'Filamsi',
    role:     'Bantuan Teknis & Aktivasi',
    desc:     'Setup printer thermal, kendala HP, & serial key',
    phone:    filamsiWa,
    waNumber: filamsiWa,
  },
];

// ─── Order ──────────────────────────────────────────────────────────────────

export interface Order {
  id:                    string;
  customerName:          string;
  customerPhone:         string;
  customerEmail?:        string;
  storeName?:            string;
  businessType?:         string;
  packageType:           PackageType;
  amount:                number;
  paymentMethod:         'midtrans' | 'manual_transfer';
  paymentStatus:         'pending' | 'paid' | 'cancelled';
  // Midtrans integration
  midtransPaymentToken?: string;
  midtransRedirectUrl?:  string;
  // License activation
  deviceId?:             string;
  serialKey?:            string;
  activatedAt?:          string;
  // Email tracking
  emailSentAt?:          string;
  notes?:                string;
  createdAt:             string;
}

// ─── Packages ───────────────────────────────────────────────────────────────

export const PACKAGES: Record<PackageType, PackageDetail> = {
  software_only: {
    id:            'software_only',
    name:          'Lisensi Software POS OFFLINE',
    badge:         'HEMAT 57% • SEKALI BAYAR SEUMUR HIDUP',
    originalPrice: 350_000,
    price:         149_000,
    description:
      'Solusi kasir Android lengkap untuk toko Anda. Bayar sekali, aktif seumur hidup tanpa biaya bulanan.',
    features: [
      'File APK POS OFFLINE Full Version Resmi',
      '1x Serial Key Lisensi Permanen (tidak kedaluwarsa)',
      'Akses 11 Video Tutorial Lengkap',
      'Template Excel Import Produk Massal',
      'Fitur Diskon, Grosir, Timbangan & Sistem Meja',
      'Dukungan Teknis via WhatsApp Resmi',
    ],
    popular: true,
  },
};
