// ─── App Version ─────────────────────────────────────────────────────────────
export const CURRENT_APP_VERSION = '1.5.2';

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

const sanitizePhone = (val: string | undefined, fallback: string) => {
  if (!val || val.includes('nomor_') || val.includes('masukkan_') || val.includes('admin')) return fallback;
  return val.trim();
};

const sanitizeWa = (val: string | undefined, fallback: string) => {
  if (!val || val.includes('nomor_') || val.includes('masukkan_') || val.includes('admin')) return fallback;
  return val.replace(/[^0-9]/g, '');
};

const ariyoWa = sanitizeWa(process.env.NEXT_PUBLIC_ADMIN_ARIYO_WA, '6285168828063');
const ariyoPhone = sanitizePhone(process.env.NEXT_PUBLIC_ADMIN_ARIYO_PHONE, '+62851-6882-8063');
const ariyoName = (process.env.NEXT_PUBLIC_ADMIN_ARIYO_NAME && !process.env.NEXT_PUBLIC_ADMIN_ARIYO_NAME.includes('admin2'))
  ? process.env.NEXT_PUBLIC_ADMIN_ARIYO_NAME
  : 'Ariyo';

const filamsiWa = sanitizeWa(process.env.NEXT_PUBLIC_ADMIN_FILAMSI_WA || process.env.NEXT_PUBLIC_WA_NUMBER, '6285853685622');
const filamsiPhone = sanitizePhone(process.env.NEXT_PUBLIC_ADMIN_FILAMSI_PHONE, '085853685622');
const filamsiName = (process.env.NEXT_PUBLIC_ADMIN_FILAMSI_NAME && !process.env.NEXT_PUBLIC_ADMIN_FILAMSI_NAME.includes('admin1'))
  ? process.env.NEXT_PUBLIC_ADMIN_FILAMSI_NAME
  : 'Filamsi';

export const ADMIN_CONTACTS: AdminContact[] = [
  {
    id:       'ariyo',
    name:     ariyoName,
    role:     'Konsultasi & Pembelian',
    desc:     'Tanya fitur aplikasi, kecocokan toko, & cara order',
    phone:    ariyoPhone,
    waNumber: ariyoWa,
  },
  {
    id:       'filamsi',
    name:     filamsiName,
    role:     'Bantuan Teknis & Aktivasi',
    desc:     'Setup printer thermal, kendala HP, & serial key',
    phone:    filamsiPhone,
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
    badge:         'HEMAT 54% • SEKALI BAYAR SEUMUR HIDUP',
    originalPrice: 650_000,
    price:         299_000,
    description:
      'Solusi kasir Android lengkap untuk toko Anda. Bayar sekali, aktif seumur hidup tanpa biaya bulanan.',
    features: [
      'File APK POS OFFLINE Full Version Resmi',
      '1x Serial Key Lisensi Permanen (Aktif Seumur Hidup)',
      'Cetak Struk Thermal Bluetooth 58mm & 80mm',
      'Support Barcode Scanner Fisik (USB/OTG) & Kamera HP',
      'Modul Retur Barang & Pengembalian Stok Otomatis',
      'Proteksi PIN Supervisor / Owner & Buku Piutang Kasbon',
      'Pengeluaran Operasional Toko, Bahan Baku HPP & Expired Date',
      'Diskon Bertingkat, Harga Grosir & Timbangan Curah (kg)',
      'Sistem Open Bill (Meja Kafe & Bayar Nanti)',
      'Template Excel Import & Ekspor Produk Massal',
      'Dukungan Teknis & Konsultasi via WhatsApp Resmi',
    ],
    popular: true,
  },
};
