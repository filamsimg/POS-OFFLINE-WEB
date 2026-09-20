export type PackageType = 'software_only' | 'bundling_printer';

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

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  storeName: string;
  businessType?: string;
  packageType: PackageType;
  amount: number;
  paymentMethod: 'qris' | 'manual_transfer';
  paymentStatus: 'pending' | 'paid' | 'cancelled';
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
    name: 'Paket Software Lisensi (Best Seller)',
    badge: 'HEMAT 60% • SEKALI BELI SEUMUR HIDUP',
    originalPrice: 350000,
    price: 149000,
    description: 'Solusi hemat untuk Anda yang sudah punya HP Android dan ingin langsung jualan tanpa biaya bulanan.',
    features: [
      'File APK POS OFFLINE Full Version Resmi',
      '1x Kode Serial Key Lisensi Aktif Seumur Hidup',
      'Akses 11 Video Tutorial Lengkap dari Awal s/d Cetak Struk',
      'Template Excel Siap Pakai Import Ratusan Produk Massal',
      'Fitur Diskon Bertingkat, Grosir, Timbangan, & Sistem Meja',
      'Layanan Bantuan Teknis & Panduan Setup via WhatsApp',
    ],
    popular: true,
  },
  bundling_printer: {
    id: 'bundling_printer',
    name: 'Paket Komplit Siap Pakai (+ Printer Thermal)',
    badge: 'PAKET LENGKAP TINGGAL PAKAI',
    originalPrice: 750000,
    price: 449000,
    description: 'Paket komplit siap jualan langsung, sudah termasuk printer thermal mini Bluetooth dan kertas struk.',
    features: [
      'Semua Fasilitas Paket Software Lisensi Seumur Hidup',
      '1 Unit Printer Bluetooth Thermal 58mm Baru (Portable)',
      'Free 5 Roll Kertas Struk Thermal Kasir',
      'Kabel Charger USB + Buku Panduan Koneksi Printer',
      'Garansi Tukar Unit Printer 1 Bulan',
      'Dipandu Video Call / WhatsApp oleh Admin Sampai Printer Bunyi',
    ],
    popular: false,
  },
};
