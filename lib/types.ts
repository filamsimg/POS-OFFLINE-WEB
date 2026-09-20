export type PackageType = 'software_only';

export interface PackageDetail {
  id: PackageType;
  name: string;
  badge: string;
  originalPrice: number;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface AdminContact {
  id: 'filamsi' | 'ariyo';
  name: string;
  role: string;
  phone: string;
  waNumber: string;
}

export const ADMIN_CONTACTS: AdminContact[] = [
  {
    id: 'filamsi',
    name: 'Filamsi',
    role: 'Admin 1',
    phone: '085853685622',
    waNumber: '6285853685622',
  },
  {
    id: 'ariyo',
    name: 'Ariyo',
    role: 'Admin 2',
    phone: '+201515409378',
    waNumber: '201515409378',
  },
];

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  storeName: string;
  businessType?: string;
  packageType: PackageType;
  amount: number;
  paymentMethod: 'manual_transfer';
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  targetAdmin?: 'filamsi' | 'ariyo';
  deviceId?: string;
  serialKey?: string;
  activatedAt?: string;
  shippingAddress?: string;
  notes?: string;
  createdAt: string;
}

export const PACKAGES: Record<PackageType, PackageDetail> = {
  software_only: {
    id: 'software_only',
    name: 'Lisensi Software POS OFFLINE (Aktivasi Permanen)',
    badge: 'HEMAT 60% • SEKALI BAYAR SEUMUR HIDUP',
    originalPrice: 350000,
    price: 149000,
    description: 'Solusi cerdas untuk Anda yang sudah punya HP Android dan ingin langsung mengelola kasir toko tanpa biaya bulanan seumur hidup.',
    features: [
      'File APK POS OFFLINE Full Version Resmi',
      '1x Kode Serial Key Lisensi Aktif Permanen',
      'Akses 11 Video Tutorial Lengkap dari Awal s/d Cetak Struk',
      'Template Excel Siap Pakai Import Ratusan Produk Massal',
      'Fitur Diskon Bertingkat, Grosir, Timbangan, & Sistem Meja',
      'Layanan Panduan Setup & Bantuan Teknis via WhatsApp',
    ],
    popular: true,
  },
};
