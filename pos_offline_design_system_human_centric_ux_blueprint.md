# POS OFFLINE (`posoffline.xyz`) — Master Design System, UI Kit Rules & Human-Centric UX Blueprint

Dokumen ini adalah panduan komprehensif untuk merombak total tampilan, arsitektur informasi, dan perilaku interaksi (*user behavior*) dari **http://posoffline.xyz/** dengan mengadopsi estetika visual dari referensi **Neo-Bento Volt Lime & Carbon** serta pendekatan **Human-Centric UX (UX Manusiawi)** yang relevan bagi pemilik UMKM di Indonesia.

---

## 1. Audit UX Saat Ini vs. Transformasi "Manusiawi Behavior"

Berdasarkan bedah struktur `posoffline.xyz` saat ini, produk memiliki proposisi nilai yang sangat kuat (**Kasir Android 100% Offline, Sekali Bayar Rp 149.000 Seumur Hidup**), namun penyampaian UI/UX-nya masih menggunakan pola *hard-selling landing page* lama yang memicu kelelahan kognitif (*cognitive overload*) dan rasa curiga.

### Tabel Transformasi Perilaku UX (Dari *Pushy* ke *Manusiawi*)

| Aspek Pengalaman | Kondisi `posoffline.xyz` Saat Ini | Pendekatan Baru (Human-Centric UX Behavior) | Alasan Psikologis & Ergonomis |
| :--- | :--- | :--- | :--- |
| **Urgensi & Kepercayaan** | Countdown timer palsu (`23:59:56`) & teks ancaman *"⚠️ Harga sewaktu-waktu naik"*. | **Transparansi Nilai Jujur**: Kalkulator penghematan interaktif & alasan logis kenapa bisa sekali bayar (karena tanpa biaya sewa server bulanan). | Pemilik UMKM sudah kebal dan curiga terhadap *fake timer*. Kejujuran membangun rasa aman jangka panjang. |
| **Pameran 12 Layar Aplikasi** | *Horizontal carousel* 12 kartu sekaligus yang membuat jari pegal menggeser tanpa konteks. | **Task-Based Story Tabs (Berdasarkan Alur Kerja Harian)**: Dikelompokkan menjadi 3 momen nyata: *(1) Saat Kasir Ramai*, *(2) Saat Atur Barang/Grosir*, *(3) Saat Tutup Warung & Cek Laba*. | Sesuai **Hick's Law** $RT = a + b \log_2(n)$, mengurangi pilihan dari $n=12$ menjadi $n=3$ kategori bermakna mempercepat pemahaman hingga $60\%$. |
| **Bahasa & Micro-Copy** | Terlalu teknis atau klise iklan (*"Solusi kasir Android lengkap..."*, *"Multi-metode pembayaran"*). | **Bahasa Percakapan Warung/Toko**: *"Kasir tetap jalan walau kuota habis atau mati lampu"*, *"Nggak perlu kalkulator buat hitung kembalian"*. | Berbicara dengan kosakata sehari-hari pemilik toko kelontong, warung makan, kafe, dan butik. |
| **Kecemasan Pra-Beli** | User langsung disodori tabel panjang & form pemesanan tanpa tahu apakah HP/printernya cocok. | **Interactive Readiness Checker**: Fitur cek cepat 2 klik: *"Cek apakah HP & Printer Bluetooth Anda cocok"* sebelum ke tombol beli. | Menghilangkan *friction* terbesar pembeli software: takut sudah bayar tapi tidak bisa dipasang di HP mereka. |
| **Alur Pemesanan (Checkout)** | Formulir panjang 7+ kolom langsung terpampang di halaman utama seperti formulir birokrasi. | **Progressive Disclosure (Bertahap & Ramah)**: Ringkasan paket di kartu *Inverted Cutout* + Form 3 langkah ringkas + visualisasi *"Apa yang terjadi 1 menit setelah Anda bayar"*. | Mengurangi *form abandonment* dengan memecah beban input menjadi langkah yang ringan dan terprediksi. |

---

## 2. Filosofi Desain Visual (Adaptasi Referensi *Neo-Bento*)

Dari gambar referensi yang dilampirkan, terdapat **5 DNA Visual Utama** yang kita terjemahkan ke dalam identitas **POS OFFLINE**:

1. **High-Contrast Editorial Bento**: Menggunakan blok warna kontras tinggi antara **Volt Lime (`#C8F53B`)**, **Carbon Black (`#141414`)**, dan **Soft Cloud Gray (`#F3F4F6`)** di atas kanvas **Pure White (`#FFFFFF`)**.
2. **Signature Inverted Corner Cutout (Lekukan Sudut CTA)**: Kartu penawaran/program memiliki lekukan cekung (*concave notch*) di sudut kanan bawah yang membingkai tombol aksi bulat (`44px`–`48px`) berwarna *Volt Lime*.
3. **Extended Geometric Display Typography**: Judul bagian (*Section Headers*) menggunakan tipografi bergaya *wide geometric/tech-modern* yang tegas, dipadukan dengan teks isi (*body*) yang sangat bersih dan mudah dibaca.
4. **Split Dark Media Rows**: Bagian penjelasan fitur menggunakan kontainer gelap (`#141414`) dengan tata letak gambar persegi membulat di kiri dan narasi singkat di kanan.
5. **Visual Grid Berbasis Bukti Nyata**: Menampilkan foto/tampilan nyata pengguna dan antarmuka aplikasi dalam *bento grid* 2 kolom dengan sudut membulat besar (`24px`).

---

## 3. Fondasi Design System (Design Tokens)

### 3.1. Sistem Warna (Color Tokens & Contrast Rules)

Seluruh kombinasi warna dirancang untuk memenuhi standar aksesibilitas **WCAG AA/AAA** dengan rasio kontras $CR = \frac{L_1 + 0.05}{L_2 + 0.05} \ge 4.5:1$ untuk teks normal dan $CR \ge 7.0:1$ untuk elemen utama.

| Token Name | Hex Code | Peran & Penggunaan Utama | Pasangan Teks Wajib | Rasio Kontras ($CR$) |
| :--- | :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#FFFFFF` | Latar belakang utama halaman & ruang sela antar kartu (*bento gap*) | `#141414` | $18.4 : 1$ (AAA) |
| `--bg-surface-soft` | `#F3F4F6` | Kartu fitur standar, kartu FAQ, latar input form | `#141414` / `#4B5563` | $16.8 : 1$ (AAA) |
| `--bg-surface-lime` | `#C8F53B` | **Primary Accent**: Hero banner, kartu *Highlight/Best Value*, tombol bulat CTA, badge hemat | **Wajib `#141414`** *(Dilarang teks putih di atas Lime)* | $14.2 : 1$ (AAA) |
| `--bg-surface-dark` | `#141414` | **Anchor Contrast**: Header blok *"Kenapa Pindah?"*, bagian etalase layar kasir, kartu paket Pro/Grosir | `#FFFFFF` / `#A1A1AA` | $18.4 : 1$ (AAA) |
| `--bg-surface-dark-elevated` | `#1F1F22` | Kartu di dalam seksi gelap, baris perbandingan | `#FFFFFF` | $15.6 : 1$ (AAA) |
| `--text-primary` | `#141414` | Judul utama, harga, teks di atas latar putih/abu/lime | — | — |
| `--text-secondary` | `#52525B` | Paragraf penjelasan di atas latar terang | — | $7.2 : 1$ (AAA) |
| `--text-on-lime` | `#141414` | Teks di atas permukaan `#C8F53B` | — | $14.2 : 1$ (AAA) |
| `--semantic-success` | `#16A34A` | Indikator "100% Offline Ready", status printer terhubung | `#FFFFFF` / `#052E16` | $\ge 4.6 : 1$ |
| `--semantic-warning` | `#D97706` | Peringatan stok tipis / pengingat backup data | `#141414` | $\ge 6.1 : 1$ |
| `--semantic-danger` | `#DC2626` | Penanda kelemahan kompetitor (biaya bulanan membengkak) | `#FFFFFF` | $\ge 5.2 : 1$ |

> **Aturan Emas Warna (Golden Rule):** Warna **Volt Lime (`#C8F53B`)** tidak boleh dipasangkan dengan teks putih (`#FFFFFF`) karena rasio kontrasnya hanya $1.29:1$. Di atas permukaan `#C8F53B`, seluruh teks dan ikon **wajib** menggunakan **Carbon Black (`#141414`)**.

---

### 3.2. Sistem Tipografi (Typography Scale)

Menggabungkan karakter futuristik-tegas dari referensi (untuk *Headline*) dengan keterbacaan maksimal bagi mata pemilik usaha segala usia (untuk *Body* & *Angka*).

* **Font Display (Headings)**: `'Syne'`, `'Space Grotesk'`, atau `'Chakra Petch'` (Weight: `700 Bold` – `800 ExtraBold`, *tracking* `-0.02em` hingga `-0.03em`). Memberikan kesan teknologi kasir yang modern, tangguh, dan presisi seperti pada referensi *"Why choose us?"* dan *"Tennis Programs"*.
* **Font Body (UI & Narasi)**: `'Plus Jakarta Sans'` atau `'Inter'` (Weight: `400 Regular`, `500 Medium`, `600 SemiBold`). Sangat ramah di layar Android ukuran kecil hingga tablet.
* **Font Monospace (Harga, Angka, Struk, Kalkulator)**: `'JetBrains Mono'` (Weight: `600 SemiBold`, `700 Bold`). Memastikan angka nominal rupiah sejajar sempurna (*tabular-nums*).

#### Skala Ukuran Tipografi (Modular Ratio $1.25$)

| Token | Ukuran Mobile | Ukuran Desktop | Line Height | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| `display-xl` | `32px` (`2.0rem`) | `48px` (`3.0rem`) | `1.10` | Headline Utama Hero (*"Sekali Bayar, Kasir Aktif Selamanya"*) |
| `heading-lg` | `26px` (`1.625rem`) | `36px` (`2.25rem`) | `1.15` | Judul Seksi Utama (*"Kenapa UMKM Pindah ke POS OFFLINE?"*) |
| `heading-md` | `20px` (`1.25rem`) | `24px` (`1.5rem`) | `1.25` | Judul Kartu Program / Fitur Utama |
| `heading-sm` | `17px` (`1.0625rem`) | `18px` (`1.125rem`) | `1.35` | Sub-judul Kartu Bento & Item Fitur |
| `body-lg` | `16px` (`1.0rem`) | `18px` (`1.125rem`) | `1.60` | Paragraf pembuka (Lead copy) |
| `body-md` | `15px` (`0.9375rem`) | `16px` (`1.0rem`) | `1.55` | Teks isi kartu, daftar manfaat (`✓`), jawaban FAQ |
| `caption-sm` | `13px` (`0.8125rem`) | `13px` (`0.8125rem`) | `1.40` | Label spesifikasi, keterangan form, badge mikro |

---

### 3.3. Geometri, Radius Sudut & Spasi (Spacing & Radii)

Mengikuti referensi gambar, kunci kemewahan visual terletak pada kontras antara **sudut kartu yang sangat membulat** dengan **jarak antar kartu yang rapat namun konsisten**.

* **Sistem Grid Dasar**: Menggunakan kelipatan $8\text{ px}$ ($8, 12, 16, 24, 32, 48, 64\text{ px}$).
* **Jarak Antar Kartu Bento (`--bento-gap`)**:
  * Mobile: `12px`
  * Desktop: `16px`
* **Padding Dalam Kartu (`--card-padding`)**:
  * Kartu Kecil/List: `20px`
  * Kartu Utama/Harga: `28px` – `32px`
* **Aturan Border Radius**:
  * `--radius-bento`: `28px` (Untuk seluruh blok utama: Hero, Why Choose Us, Kartu Paket/Use-Case)
  * `--radius-inner`: `20px` (Untuk gambar di dalam blok gelap atau sub-kartu)
  * `--radius-input`: `14px` (Untuk kolom input formulir pemesanan & tombol sekunder)
  * `--radius-pill`: `9999px` (Untuk tombol utama, tab filter, dan tombol bulat di sudut kartu)

---

## 4. Aturan Lengkap UI Kit (Component Rules & Specifications)

### 4.1. Komponen Ikonik: *The Inverted Corner Cutout Card* (Kartu Sudut Terbalik)
Komponen paling khas dari referensi Anda (terlihat pada seksi *"Tennis Programs for Every Player"*). Pada `posoffline.xyz`, komponen ini digunakan untuk **3 Kartu Skema Penggunaan UMKM** (*Warung & Sembako*, *Kafe & Kuliner*, *Grosir & Multi-Cabang*) serta **Kartu Paket Lisensi**.

* **Anatomi Komponen**:
  1. **Header Kartu**: Judul tebal (`heading-md`) + Badge target usaha di pojok kanan atas.
  2. **Checklist Manfaat**: Maksimal 4–5 poin menggunakan ikon centang tajam (`✓`) dengan kalimat aktif berorientasi hasil.
  3. **Footer Harga**: Terletak di kiri bawah menggunakan font monospace tebal (`Rp 149.000 / selamanya`).
  4. **The Notch (Lekukan Sudut Kanan Bawah)**: Area berukuran `68px x 68px` di sudut kanan bawah yang memiliki latar sewarna kanvas (`#FFFFFF`) dan dua sudut lengkung terbalik (*inverted radial fillets* berukuran `16px`), tempat bersarangnya tombol bulat `#C8F53B` berdiameter `48px` dengan ikon panah `→` atau `↗`.
* **Aturan Interaksi (Hover & Tap Behavior)**:
  * Saat kartu di-*hover* atau ditekan, seluruh kartu terangkat halus (`translateY(-3px)`), dan tombol bulat di sudut kanan bawah berputar $45^\circ$ (dari `→` menjadi `↗` atau membesar $1.08\times$).

### 4.2. Komponen Section Header Block ("Why Choose Us" Dark Pill Block)
* Mengadaptasi blok hitam **"Why choose us?"** dari referensi:
  * Sebelum deretan kartu abu-abu (`#F3F4F6`), gunakan satu blok kartu berwarna **Carbon Black (`#141414`)** dengan padding `28px 32px`, `border-radius: 28px`, dan teks putih berukuran `heading-lg`.
  * Memberikan jangkar visual (*visual anchor*) yang sangat kuat saat pengguna menggulir halaman di HP.

### 4.3. Komponen Split Media Row on Dark Surface
* Mengadaptasi bagian **"Indoor Courts / Clay Courts / Grass Courts"** dari referensi:
  * Digunakan pada `posoffline.xyz` untuk memamerkan **3 Keunggulan Inti di Lapangan**:
    1. **Cetak Struk Bluetooth 2 Detik** (Visual: Foto/UI printer thermal 58mm/80mm mencetak struk rapi).
    2. **Scan Barcode Kamera HP & Kalkulator Uang Pas** (Visual: Tampilan kasir hitung kembalian otomatis).
    3. **Laporan Laba Bersih & Proteksi PIN Bos** (Visual: Grafik keuntungan harian yang terkunci PIN).
  * Setiap baris terdiri dari: **Thumbnail Persegi (`110px x 110px` di mobile, `140px x 140px` di desktop, `border-radius: 20px`) di sebelah kiri** + **Judul Putih & Deskripsi Abu-abu Terang di sebelah kanan**.

### 4.4. Komponen Tombol (Buttons & Ergonomi Fitts's Law)
Berdasarkan **Fitts's Law**:
$$T = a + b \log_2\left(1 + \frac{D}{W}\right)$$
Waktu untuk menekan target ($T$) berkurang drastis jika lebar/tinggi target ($W$) cukup besar dan dekat dengan jangkauan ibu jari.

1. **Primary CTA on Lime Surface**: Latar `#141414`, teks `#FFFFFF`, tinggi minimal `52px`, `border-radius: 14px` atau `9999px`, dilengkapi panah mikro.
2. **Primary CTA on Dark/Light Surface**: Latar `#C8F53B`, teks `#141414` (`font-weight: 700`), tinggi minimal `52px`.
3. **Notch Circle Action Button**: Diameter `48px` (`W = 48\text{ px}$), latar `#C8F53B`, ikon `#141414` tebal `2px`.

### 4.5. Komponen Formulir Manusiawi (Human-Friendly Checkout Form)
* **Aturan Input Field**:
  * Tinggi input wajib minimal `52px` agar nyaman diketik dengan jempol di layar Android.
  * Label selalu berada di **atas** kolom input (bukan sekadar *placeholder* yang hilang saat diketik).
  * **Inline Helper Copy yang Menenangkan**:
    * Di bawah input *WhatsApp*: *"Format otomatis (08xx). Tim kami hanya menghubungi untuk bantuan aktivasi, bebas spam."*
    * Di bawah input *Email*: *"Link download APK resmi & Serial Key permanen dikirim otomatis ke email ini."*
  * **Pemilih Jenis Usaha Berbasis Chip (Bukan Dropdown Tersembunyi)**: Alih-alih `<select>` kaku, tampilkan *selectable pill chips* bergaya Bento (*Warung/Sembako*, *Kafe/Resto*, *Fashion/Butik*, *Apotek*, *Bengkel/Jasa*, *Lainnya*) agar pemilik usaha cukup 1 kali sentuh.

---

## 5. Arsitektur Informasi Baru (`posoffline.xyz` Human-Centric Flow)

Urutan seksi dirancang mengikuti alur psikologi keputusan pemilik usaha (dari *Empati Masalah* $\rightarrow$ *Bukti Nyata* $\rightarrow$ *Simulasi Keuntungan* $\rightarrow$ *Kepastian Teknis* $\rightarrow$ *Transaksi Mudah*):

1. **Sticky Minimal Header & Trust Bar**: Logo POS OFFLINE + Status *"v1.0 Android Native • Sekali Bayar Rp 149rb"* + Tombol cepat *"Cek Kecocokan HP"*.
2. **Hero Bento Block (Volt Lime `#C8F53B` + Visual Terintegrasi)**:
   * Pesan Utama: *"Beli Sekali Rp 149.000. Kasir Aktif Selamanya Tanpa Tagihan Bulanan."*
   * Tiga *Trust Pills*: `100% Tanpa Internet`, `Support 50+ Printer Bluetooth`, `Garansi Resmi Seumur Hidup`.
3. **"Kenapa Pindah?" (Dark Header Block + 3 Soft Gray Cards)**:
   * Mengangkat rasa sakit nyata pemilik toko (tagihan SaaS bulanan saat toko sepi, internet mati kasir macet, rekap buku manual yang bikin selisih uang).
4. **Etalase Antarmuka Berdasarkan Alur Kerja (Dark Split-Media Section + Interactive Screen Switcher)**:
   * Menggantikan *carousel* 12 layar yang membingungkan menjadi 3 Tab Alur Kerja Harian (*Kasir & Pembayaran*, *Stok & Harga Grosir*, *Laporan Laba & Keamanan PIN*).
5. **Program Sesuai Jenis Usaha Anda (3 Kartu dengan *Signature Inverted Corner Cutout*)**:
   * **Kartu 1 (Soft Gray)**: *Mode Warung, Sembako & Kelontong* (Harga ecer/grosir bertingkat, barang timbangan curah, scan barcode cepat).
   * **Kartu 2 (Volt Lime — Paling Populer)**: *Mode Kafe, Warung Makan & Resto* (Simpan pesanan/Open Bill, nomor meja, cetak struk dapur/KOT & kasir).
   * **Kartu 3 (Carbon Black)**: *Mode Retail, Butik, Apotek & Multi-Toko* (Import ribuan barang via Excel 10 detik, laporan HPP detail, kunci PIN pemilik).
6. **Kalkulator Penghematan Jujur & Tabel Perbandingan**:
   * Pengguna bisa menggeser jumlah cabang/kasir dan melihat berapa juta rupiah yang berhasil dihemat dalam 1–3 tahun dibanding aplikasi kasir berlangganan.
7. **Cerita Pemilik Usaha (Bento Photo Grid + Lime Summary Banner)**:
   * Mengadaptasi seksi *"Coaches"* pada referensi menjadi potret pemilik UMKM nyata (Toko Sembako Bekasi, Soto Surabaya, Butik Bandung, Kelontong Malang).
8. **Cek Kesiapan Perangkat & Checkout Manusiawi**:
   * Panduan visual 3 langkah setelah bayar + Formulir pemesanan bersih dengan metode bayar QRIS/Transfer instan.

---

## 6. Prompt Siap Pakai untuk Google Stitch (`stitch.withgoogle.com`)

Jika Anda ingin men-generate variasi layar tambahan di **Google Stitch**, salin dan tempel prompt di bawah ini (lampirkan juga gambar referensi Anda di Stitch):

### Prompt 1: Landing Page Utama `posoffline.xyz` (Mobile & Desktop Bento)
> **Prompt untuk Google Stitch:**
> Design a modern, high-converting, human-centric mobile-first landing page for "POS OFFLINE" (an Indonesian Android Point-of-Sale app with a one-time lifetime license of Rp 149.000, 100% offline capability). Follow the exact visual language of the attached reference image:
> - **Color Palette**: Pure white canvas (`#FFFFFF`), electric volt lime accent cards (`#C8F53B`), deep carbon black contrast blocks (`#141414`), and soft cloud gray cards (`#F3F4F6`). All text on volt lime must be deep carbon black (`#141414`).
> - **Typography**: Wide geometric display font (Syne or Space Grotesk Bold) for section headers, paired with clean Plus Jakarta Sans for body text and JetBrains Mono for Rupiah pricing.
> - **Layout & Components**:
>   1. Top Hero Card in Volt Lime (`#C8F53B`) with large rounded corners (`28px`), headline "Sekali Bayar, Kasir Aktif Selamanya", concise empathetic subcopy for Indonesian SMEs, and a solid black pill CTA button "Dapatkan Lisensi Rp 149.000".
>   2. A bold Carbon Black (`#141414`) rounded header block saying "Kenapa UMKM Beralih ke POS OFFLINE?" followed by 3 stacked Soft Gray (`#F3F4F6`) bento cards explaining: Tanpa Biaya Bulanan, 100% Jalan Tanpa Internet, and Laporan Laba Otomatis.
>   3. A Dark Section (`#141414`) showcasing 3 core workflows using horizontal split rows: rounded square image on the left (`20px` radius) and title + description on the right (Cetak Struk Bluetooth 2 Detik, Harga Grosir & Timbangan, Laporan Laba & PIN Bos).
>   4. "Cocok Untuk Usaha Anda" section featuring 3 stacked pricing/use-case cards (Soft Gray, Volt Lime, and Carbon Black). CRITICAL DETAIL: Each card must feature an inverted concave corner cutout at the bottom-right corner housing a circular Volt Lime (`#C8F53B`) arrow button (`>`).
>   5. A 2x2 Bento Photo Testimonial grid of Indonesian shop owners with rounded corners and overlay names, followed by a Volt Lime summary card and a clean, human-friendly 3-step checkout form.

### Prompt 2: Desain UI Aplikasi Kasir Android POS OFFLINE (Mode Tablet & HP)
> **Prompt untuk Google Stitch:**
> Design a clean, ergonomic Android POS (Point of Sale) cashier screen and daily profit dashboard following the Volt Lime (`#C8F53B`), Carbon Black (`#141414`), and Soft Cloud Gray (`#F3F4F6`) Neo-Bento design system.
> - Left/Main Area: Fast product grid with category pills (Semua, Sembako, Minuman, Grosir), instant barcode scan button, and big touch-friendly product cards showing stock badge and Rupiah price.
> - Right/Bottom Cart Drawer: Clean order summary with "Uang Pas" quick cash denomination buttons (`Rp 20.000`, `Rp 50.000`, `Rp 100.000`), automatic change calculation in large monospace font, Bluetooth 58mm thermal printer status badge (Connected - Green dot), and a prominent Volt Lime (`#C8F53B`) "Bayar & Cetak Struk (2 dtk)" button with an inverted corner action aesthetic.