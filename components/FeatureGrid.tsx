import {
  Printer,
  Tag,
  ScanBarcode,
  Utensils,
  BarChart3,
  Lock,
  Scale,
  ShieldCheck,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Printer,
    title: 'Cetak Struk 58mm & 80mm',
    badge: 'Hardware Support',
    desc: 'Bisa pilih kertas 58mm untuk printer thermal mini saku, atau 80mm untuk printer kasir desktop. Cetak logo toko, alamat, dan rincian transaksi otomatis.',
  },
  {
    icon: Tag,
    title: 'Diskon & Promo Coret',
    badge: 'Fitur Baru',
    desc: 'Atur harga promo coret dengan badge PROMO merah di katalog, serta diskon transaksi kasir instan (% atau Rp) dengan perhitungan DPP & PPN presisi.',
  },
  {
    icon: ScanBarcode,
    title: 'Scan Barcode Super Cepat',
    badge: 'Efisiensi Kasir',
    desc: 'Scan barcode barang menggunakan kamera HP dengan suara konfirmasi BEEP, scanner barcode tembak USB via OTG, maupun scanner Bluetooth nirkabel.',
  },
  {
    icon: Utensils,
    title: 'Nomor Meja & Open Bill',
    badge: 'Khusus Kafe & F&B',
    desc: 'Simpan pesanan gantung tamu meja tanpa tertahan, layani meja lainnya, lalu panggil kembali saat tamu selesai makan untuk cetak struk penutup.',
  },
  {
    icon: BarChart3,
    title: 'Laporan Laba Bersih & HPP',
    badge: 'Analitik Keuangan',
    desc: 'Pantau total omset, modal keluar (HPP), dan laba bersih riil harian/bulanan. Ketahui produk terlaris dan ekspor seluruh pembukuan ke Excel/CSV.',
  },
  {
    icon: Lock,
    title: 'Kunci PIN 6-Digit Karyawan',
    badge: 'Anti-Kecurangan',
    desc: 'Kunci aksi sensitif (hapus transaksi, ubah harga jual, edit stok barang, dan laporan omset) dengan 6 digit PIN rahasia milik Anda.',
  },
  {
    icon: Scale,
    title: 'Grosir & Timbangan Desimal',
    badge: 'Retail & Sembako',
    desc: 'Harga grosir otomatis turun jika beli banyak (misal beli ≥6 pcs), serta mendukung penjualan timbangan curah (kg/gr) dengan angka desimal presisi.',
  },
  {
    icon: ShieldCheck,
    title: 'Backup & Pengingat 7 Hari',
    badge: 'Keamanan Data',
    desc: 'Data toko Anda tersimpan aman di HP sendiri. Ada pengingat mingguan di beranda yang bisa di-snooze 7 hari, dan pulihkan data saat ganti HP baru.',
  },
];

export function FeatureGrid() {
  return (
    <section id="fitur" className="py-20 px-4 sm:px-6 bg-white text-slate-900 scroll-mt-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-emerald-700 uppercase bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
            Fitur Lengkap Serba Bisa
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-3 tracking-tight">
            Dirancang Khusus untuk Semua Jenis Bisnis UMKM
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Mulai dari toko sembako, warung kelontong, kafe/warkop, rumah makan, barbershop, konter pulsa, hingga toko pakaian/retail.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-emerald-500/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/50 border border-emerald-200/60 px-2 py-0.5 rounded">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-800 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
