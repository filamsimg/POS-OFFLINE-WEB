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
  phone:    string;
  waNumber: string;
}

export const ADMIN_CONTACTS: AdminContact[] = [
  {
    id:       'filamsi',
    name:     'Filamsi',
    role:     'Admin 1',
    phone:    '085853685622',
    waNumber: '6285853685622',
  },
  {
    id:       'ariyo',
    name:     'Ariyo',
    role:     'Admin 2',
    phone:    '+201515409378',
    waNumber: '201515409378',
  },
];

// ─── Order ──────────────────────────────────────────────────────────────────

export interface Order {
  id:              string;
  customerName:    string;
  customerPhone:   string;
  customerEmail?:  string;
  storeName?:      string;
  businessType?:   string;
  packageType:     PackageType;
  amount:          number;
  paymentMethod:   'mayar' | 'manual_transfer';
  paymentStatus:   'pending' | 'paid' | 'cancelled';
  // Mayar.id integration
  mayarPaymentId?:  string;
  mayarPaymentUrl?: string;
  // License activation
  deviceId?:       string;
  serialKey?:      string;
  activatedAt?:    string;
  // Email tracking
  emailSentAt?:    string;
  notes?:          string;
  createdAt:       string;
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

// ─── Mayar.id API Response Types ────────────────────────────────────────────

export interface MayarCreatePaymentResponse {
  status:  string;
  data: {
    id:          string;
    paymentLink: string;
    expiredAt?:  string;
  };
}

export interface MayarWebhookPayload {
  event:  string;
  status: string;
  data: {
    id:          string;
    status:      string;
    amount:      number;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    metadata?:   Record<string, string>;
  };
}
