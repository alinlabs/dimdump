# Dokumentasi Lengkap Website DimDump

Selamat datang di repositori dan panduan lengkap dari website **DimDump** – sebuah platform web modern untuk UMKM Dimsum Goreng Krispi yang berlokasi strategis di dekat STIE Wikara, Purwakarta. Dokumen ini bertujuan untuk menjelaskan secara mendetail seluruh fitur, arsitektur, teknologi, dan komponen yang ada di dalam website ini, baik dari sisi pengguna (Publik) maupun pengelola (Admin).

---

## 1. Profil Bisnis DimDump

**DimDump** adalah usaha mikro, kecil, dan menengah (UMKM) yang berfokus pada hidangan dimsum goreng krispi yang lezat, terjangkau, dan berkualitas. DimDump menargetkan pasar mahasiswa (khususnya STIE Wikara Purwakarta), pelajar, dan masyarakat umum yang mencari jajanan praktis dan enak.
- **Produk Utama:** Dimsum Goreng Krispi.
- **Nilai Tambah (Value Proposition):** Harga mahasiswa, rasa bintang lima, bisa pesan antar (delivery), dan layanan pelanggan kasual dan bersahabat.
- **Maskot:** **Dimo** (Karakter dimsum lucu yang menjadi representasi interaktif).
- **Lokasi Utama:** Area Purwakarta, dekat dengan STIE Wikara.

---

## 2. Arsitektur & Teknologi (Tech Stack)

Website DimDump dibangun menggunakan ekosistem pengembangan web modern yang berfokus pada kecepatan, responsivitas, Progressive Web App (PWA), dan SEO yang optimal.

### Frontend
- **Framework Utama:** React 19 dengan TypeScript.
- **Build Tool:** Vite – untuk HMR super cepat dan optimasi bundle.
- **Styling:** Tailwind CSS (v4) – utility-first CSS framework untuk pembuatan desain UI khusus.
- **Routing:** React Router v7 – untuk navigasi Single Page Application (SPA).
- **Animasi:** `motion/react` – untuk transisi halaman dan interaksi UI seperti Floating Chat dan Popup Banner yang halus.
- **Peta (Mapping):** Leaflet & React-Leaflet untuk penampil peta (MapPicker) area pengiriman, serta OpenStreetMap Nominatim API untuk reverse geocoding (mendeteksi alamat pembeli otomatis).
- **State Management & Sinkronisasi:** Menggunakan Hooks React (useState, useEffect) yang dioptimasi dan integrasi Cloudflare KV (lewat Cloudflare Worker).
- **PWA (Progressive Web App):** Dilengkapi dengan Service Worker, `manifest.json`, dan alur instalasi khusus (prompt instalasi di mobile dan desktop).

### Layanan Eksternal & Backend Ringkas
- **Analytics & Identifikasi:** @fingerprintjs/fingerprintjs untuk mendeteksi perangkat unik (Device ID) sebagai solusi pelacakan kunjungan bebas login.
- **Database / API Endpoint:** Cloudflare Workers (menghubungkan ke D1/KV) yang menyediakan data dinamis berupa `data.json` atau SQLite schema. Server.ts lokal yang di-bundle dengan esbuild (Express server) untuk menghandling request lokal / proxy jika diperlukan (meski versi production bisa berbentuk SPA murni / static API).
- **Interaksi AI / Smart Logic:** Integrasi Gemini API (opsional) untuk smart admin processing, meski saat ini difokuskan pada flow WhatsApp API untuk checkout.
- **Checkout:** Menghasilkan format pesan WhatsApp yang rapi langsung diarahkan ke API WhatsApp `wa.me`.

---

## 3. Fitur Sisi Publik (User-Facing)

Bagian publik (Tampilan Pembeli) didesain sangat _mobile-friendly_, ringan, dan menarik dengan tema bernuansa **Merah (#e11d48)** dan **Kuning (#facc15)**.

### A. Beranda (Home)
- **Hero Section:** Banner ajakan untuk langsung membeli dimsum, menonjolkan kelezatan, diskon, dan kemudahan.
- **Header:** Navigasi menuju halaman Beranda, Produk, dan Tentang. Memiliki keranjang (Cart) mini dengan counter produk, serta Hamburger Menu untuk versi Mobile.
- **Features Section:** Poin-poin mengapa memilih DimDump (Kecepatan, Rasa, Harga).
- **Menu Section:** Menampilkan varian dimsum atau paket-paket (Bundling/Personal) yang bisa ditambahkan langsung ke keranjang dengan tombol '+' interaktif.
- **Promo Section (Lebih Mudah, Lebih Dekat):** Menjelaskan keunggulan layanan pesan antar. Kata "Lebih Dekat" memiliki warna khusus (kuning) di Mobile dan Desktop.
- **Testimonials & FAQ:** Ulasan pelanggan mahasiswa & pertanyaan yang sering diajukan mengenai daya tahan, pengiriman, dan cara bayar.
- **Footer:** Tautan ke Info Web (Penjelasan teknologi), LinkTree (Tautan Sosmed), Info Install PWA, dan hak cipta.

### B. Keranjang (Cart) & Checkout
- **Floating Cart:** Tombol Cart selalu terlihat di bawah/atas atau bisa diakses lewat menu dengan animasi mulus.
- **Sistem Keranjang Lokal:** State keranjang disimpan tanpa membebani server sebelum final checkout.
- **Checkout Form Dinamis:**
  - *Data Pribadi:* Nama, dan Nomor HP.
  - *Lokasi (Auto-Detect):* Secara otomatis akan meminta izin geolokasi dan mengubah titik GPS menjadi alamat tertulis via OpenStreetMap Nominatim. User dapat memperbaiki alamat via Map Picker visual.
  - *Tombol Pesan:* Menghasilkan rangkuman pesanan dan total harga, lalu membula jendela baru menuju WhatsApp penjual (nomor CS DimDump).

### C. Floating Chat (Tanya Dimo)
- **Maskot Dimo:** Menggunakan wajah maskot (gambar PNG), muncul di bagian kanan bawah dengan tombol bulat besar tanpa outline kotak.
- **Efek Gradasi Pijakan:** Ada sentuhan gradasi bayangan lembut transparan hitam (tanpa blur berlebih) di area bawah agar Dimo lebih menonjol.
- **Badge Notifikasi:** Setiap 15 detik atau pertama kali load, muncul badge memanjang dengan tulisan "Tanya **Dimo**" dari kiri ke kanan yang bertahan selama 6 detik lalu menutup lagi perlahan.
- **Simulasi Live Chat:** Ketika diklik, chat terbuka (ukuran portrait seperti messenger di Desktop dan layar full pop-up di Mobile). Dimo menyapa otomatis *"Hai Teman! Dimo disini siap bantu kamu. mau berapa pcs hari ini?"*.
- **Auto-Reply (Loading Bubbles):** Saat user membalas, Dimo akan menunjukkan status "Sedang mengetik..." (Bubble animasi pantul 3 titik) selama 5 detik, memberi sapaan, lalu mengetik lagi 3 detik, baru akhirnya me-redirect pertanyaan ke WhatsApp CS sungguhan dengan prompt teks.

### D. Halaman PWA Install & Link Tree
- **/install:** Halaman panduan langkah demi langkah cara memasang DimDump sebagai aplikasi (Add to Home Screen) untuk Android (Chrome), iOS (Safari), dan Desktop. Disertai gambar (`.webp`) tata cara instalasinya.
- **/link:** Halaman mirip Linktree, berisi tombol cepat menuju GoFood, WhatsApp, Instagram, dll.
- **/info:** Halaman edukasi khusus untuk menjelaskan 'Studi Kasus' teknologi di balik DimDump (React, Vite, PWA, Cloudflare) yang ditujukan untuk dokumentasi akademis kampus (STIE Wikara).

---

## 4. Fitur Sisi Admin (Dashboard)

Admin dapat diakses di `/admin`. Ini adalah pusat kendali ringkas untuk operasional bisnis DimDump. UI Admin ditandai dengan sidebar (desktop) atau hamburger (mobile).

### Pengelompokan Menu Admin:
1. **Basis Data Pengguna (Database):**
   - *Database Pengguna:* Mencatat informasi user/visitor unik (diproses menggunakan tracker Fingerprint / Session).
   - *Log Aktivitas:* Mencatat log seperti produk apa yang paling sering diklik, atau aktivitas check-out.

2. **Alat Keuangan:**
   - *Kalkulator HPP (Harga Pokok Penjualan):* Kalkulator pintar untuk menghitung modal bahan baku vs harga jual dimsum per batch, menolong penentuan margin profit.
   - *Catatan Keuangan (Finance):* Catatan pembukuan sederhana arus kas/masuk/keluar harian.

3. **Tampilan Website (CMS KV Data):**
   - *Manajemen Konten (KV Data Cloudflare):* Digunakan untuk mengubah konfigurasi JSON dinamis yang ditarik oleh Frontend Publik (misalnya mengubah teks Menu, Harga, Alamat, Info Kontak, Jam Operasional) sehingga tidak perlu build ulang kodingan jika ada promo mendadak.

---

## 5. SEO & Open Graph Meta Tags

Aplikasi ini mendefinisikan meta tags HTML lengkap di setiap entry point (`index.html`, `/admin/index.html`, `/info/index.html`, `/link/index.html`).
- **Title & Deskripsi:** Dirancang spesifik mengandung kata kunci lokal: "Dimsum Purwakarta", "STIE Wikara", "Dimsum Goreng Krispi", dsb.
- **Open Graph (og:) & Twitter Cards:** Dilengkapi dengan thumbnail `.webp` pre-made agar jika link di share via WhatsApp atau Twitter, muncul preview gambar yang cantik ("DimDump - Tersedia di Purwakarta").
- **Robots.txt & Sitemap:** Tersedia (dalam folder `public/`) untuk pendaftaran ke Google Search Console. Dashboard admin diset `noindex, nofollow` agar tidak terlacak Google.

---

## 6. Struktur Direktori Utama

- `/public/` - Menampung semua aset statis.
  - `/gambar/` - Logo, maskot, icon, asset thumbnail artikel (format modern `.webp` untuk web perf).
  - `/cloudflare/` - Simulasi atau skrip Cloudflare worker, skema sql (`schema.sql`), dan fallback `data.json`.
  - `manifest.json`, `sw.js` - Komponen krusial PWA.
- `/src/` - Source Code Frontend.
  - `/components/` - Komponen UI yang dapat digunakan kembali (Header, Footer, Cart, FloatingChat, dll).
  - `/pages/` - Komponen level halaman (InstallPWA, LinkTree, Halaman Info).
  - `/admin/` - Komponen dan halaman khusus dashboard admin HPP/Data.
  - `/hooks/` - Hook React khusus (seperti `usePWAInstall.ts`).
  - `/utils/` - Fungsi utility, format mata uang, formatter WA.
  - `App.tsx` - Router Publik.
  - `main.tsx` - Entry Point Aplikasi.
- `/server.ts` & `package.json` - Server konfigurasi Node.js/Express lokal untuk support API local/SSG logic if needed.

---

## 7. Filosofi Responsivitas & Kompatibilitas

Segala bagian web ini dibuat berdasarkan prinsip *Mobile First* namun diperindah untuk *Desktop Layout*. 
1. **Grid & Flexbox:** Memastikan kartu menu rapi. Di mobile menjadi satu kolom (atau grid kecil), di desktop meluas (grid-cols-2 atau grid-cols-3).
2. **Animasi Halus:** Hanya menggunakan CSS Transforms atau modul Motion yang di-_hardware accelerate_, untuk memastikan framerate yang stabil di smartphone.
3. **Pemberitahuan Block Popup (Pop-up Blocker Escape):** Pada Checkout API dan Floating Chat WhatsApp, ditambahkan fallback `window.location.href = waUrl;` jika browser mendeteksi dan memblokir tab baru (misalnya Safari mobile mencegah pop-up window yang ditrigger dari async timeout). 
4. **Touch Targets (Area Sentuh):** Sangat besar dan cukup untuk ukuran jempol user di mobile.

---

Akhir Kata, web aplikasi DimDump dirancang tidak hanya menjadi etalase, namun mesin akuisisi pelanggan otomatis bagi entitas UMKM jajanan di Purwakarta. Berfokus pada kemudahan, pengalaman UI/UX yang modern, namun backend yang sangat efisien dan perawatannya bebas repot.
