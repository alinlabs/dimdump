import { ReactNode } from 'react';
import { Layout, Zap, Rocket, Smartphone, Database, Globe, Cpu, Cloud, Github, Calculator, MapPin, MousePointerClick, Search, FastForward, TrendingUp, Users, Timer, Code, HardDrive, Link as LinkIcon, PenTool, Lightbulb, Server, Triangle } from 'lucide-react';

export interface InfoItem {
  icon: ReactNode;
  colorClass: string;
  hoverColor: string;
  category?: string;
  title: string;
  description: string;
  link?: string;
}

export const caraPembuatan: InfoItem[] = [
  {
    icon: <Lightbulb className="w-6 h-6" />,
    colorClass: "bg-blue-50 text-blue-600",
    hoverColor: "hover:border-blue-300",
    title: "Memahami Kebutuhan Website",
    description: "Tahap pertama dimulai dengan memahami tujuan website yang akan dibuat. Pada proses ini ditentukan siapa pengguna website, informasi apa yang akan ditampilkan, layanan apa yang ingin disediakan, serta hasil akhir yang diharapkan. Semakin jelas kebutuhan yang ditentukan sejak awal, semakin mudah proses pengembangan pada tahap berikutnya."
  },
  {
    icon: <Search className="w-6 h-6" />,
    colorClass: "bg-purple-50 text-purple-600",
    hoverColor: "hover:border-purple-300",
    title: "Mencari Referensi dan Inspirasi",
    description: "Sebelum membuat tampilan website, dilakukan pencarian referensi dari berbagai sumber untuk mendapatkan inspirasi mengenai tata letak, gaya visual, warna, navigasi, dan pengalaman pengguna. Referensi ini membantu menentukan arah desain yang sesuai dengan tujuan website."
  },
  {
    icon: <Layout className="w-6 h-6" />,
    colorClass: "bg-orange-50 text-orange-600",
    hoverColor: "hover:border-orange-300",
    title: "Menyusun Struktur Halaman",
    description: "Setelah mendapatkan referensi yang sesuai, dilakukan penyusunan struktur halaman website. Pada tahap ini ditentukan halaman-halaman yang akan dibuat seperti Beranda, Tentang Kami, Layanan, Produk, Kontak, Artikel, dan halaman lainnya sesuai kebutuhan."
  },
  {
    icon: <PenTool className="w-6 h-6" />,
    colorClass: "bg-green-50 text-green-600",
    hoverColor: "hover:border-green-300",
    title: "Membuat Rancangan Tampilan",
    description: "Berdasarkan struktur yang telah disusun, dibuat rancangan tampilan website. Rancangan ini menjadi gambaran visual mengenai bagaimana website akan terlihat dan bagaimana pengguna akan berinteraksi dengan setiap halaman yang tersedia."
  },
  {
    icon: <Database className="w-6 h-6" />,
    colorClass: "bg-indigo-50 text-indigo-600",
    hoverColor: "hover:border-indigo-300",
    title: "Menyiapkan Materi dan Konten",
    description: "Seluruh materi yang akan digunakan mulai dikumpulkan dan disiapkan. Materi tersebut dapat berupa logo, gambar, teks profil perusahaan, informasi layanan, daftar produk, informasi kontak, artikel, hingga dokumen pendukung lainnya."
  },
  {
    icon: <Server className="w-6 h-6" />,
    colorClass: "bg-rose-50 text-rose-600",
    hoverColor: "hover:border-rose-300",
    title: "Menyusun dan Merapikan Data",
    description: "Apabila website membutuhkan data dalam jumlah banyak, data tersebut terlebih dahulu disusun dan dirapikan dalam format yang mudah dikelola. Proses ini bertujuan agar seluruh informasi tersusun secara rapi dan mudah digunakan pada tahap pengembangan."
  },
  {
    icon: <HardDrive className="w-6 h-6" />,
    colorClass: "bg-teal-50 text-teal-600",
    hoverColor: "hover:border-teal-300",
    title: "Membuat Database Awal",
    description: "Data yang telah dikumpulkan kemudian disusun menjadi struktur yang lebih terorganisir. Database ini berfungsi sebagai tempat penyimpanan informasi yang nantinya akan ditampilkan pada website sehingga proses pengelolaan data menjadi lebih mudah."
  },
  {
    icon: <Code className="w-6 h-6" />,
    colorClass: "bg-cyan-50 text-cyan-600",
    hoverColor: "hover:border-cyan-300",
    title: "Membangun Website",
    description: "Rancangan tampilan yang telah dibuat kemudian dikembangkan menjadi website yang dapat digunakan. Pada tahap ini seluruh halaman mulai dibangun dan dihubungkan satu sama lain sehingga membentuk sebuah website yang utuh."
  },
  {
    icon: <LinkIcon className="w-6 h-6" />,
    colorClass: "bg-sky-50 text-sky-600",
    hoverColor: "hover:border-sky-300",
    title: "Menghubungkan Data dengan Website",
    description: "Setelah halaman website selesai dibuat, data yang telah disusun sebelumnya mulai dihubungkan dengan website. Dengan cara ini informasi dapat ditampilkan secara otomatis tanpa harus ditulis ulang satu per satu pada setiap halaman."
  },
  {
    icon: <Search className="w-6 h-6" />,
    colorClass: "bg-gray-100 text-gray-800",
    hoverColor: "hover:border-gray-400",
    title: "Melakukan Pemeriksaan dan Pengujian",
    description: "Sebelum dipublikasikan, seluruh bagian website diperiksa secara menyeluruh. Pemeriksaan dilakukan untuk memastikan tampilan berjalan dengan baik, informasi tampil dengan benar, tombol dapat digunakan, serta seluruh fitur bekerja sesuai tujuan."
  },
  {
    icon: <Github className="w-6 h-6" />,
    colorClass: "bg-gray-100 text-gray-800",
    hoverColor: "hover:border-gray-400",
    title: "Membuat Akun GitHub",
    description: "Sebelum website dapat dipublikasikan, perlu dibuat akun GitHub sebagai tempat penyimpanan proyek secara online. GitHub berfungsi untuk menyimpan seluruh file website dengan aman serta memudahkan proses pengembangan dan pembaruan di masa mendatang."
  },
  {
    icon: <HardDrive className="w-6 h-6" />,
    colorClass: "bg-gray-100 text-gray-800",
    hoverColor: "hover:border-gray-400",
    title: "Membuat Repository Proyek",
    description: "Setelah akun GitHub tersedia, dibuat sebuah repository atau ruang penyimpanan khusus untuk proyek website. Repository ini akan menjadi lokasi utama penyimpanan seluruh file pengembangan website."
  },
  {
    icon: <LinkIcon className="w-6 h-6" />,
    colorClass: "bg-gray-100 text-gray-800",
    hoverColor: "hover:border-gray-400",
    title: "Menghubungkan Proyek ke GitHub",
    description: "Website yang telah dibuat di komputer kemudian dihubungkan ke repository GitHub. Proses ini memungkinkan seluruh perubahan yang dilakukan pada website dapat tersimpan secara online dan terdokumentasi dengan baik."
  },
  {
    icon: <FastForward className="w-6 h-6" />,
    colorClass: "bg-gray-100 text-gray-800",
    hoverColor: "hover:border-gray-400",
    title: "Melakukan Push ke GitHub Melalui PowerShell",
    description: "Setelah proyek terhubung dengan GitHub, dilakukan proses pengiriman file dari komputer ke repository online menggunakan PowerShell. Pada tahap ini sistem akan membaca seluruh perubahan yang telah dibuat, menyimpan catatan perubahan tersebut, kemudian mengunggahnya ke GitHub. Proses ini memastikan bahwa versi terbaru website tersimpan dengan aman di internet dan dapat digunakan untuk proses publikasi berikutnya."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    colorClass: "bg-blue-50 text-blue-600",
    hoverColor: "hover:border-blue-300",
    title: "Membuat Akun Vercel",
    description: "Untuk mempublikasikan website ke internet, dibuat akun Vercel. Platform ini berfungsi sebagai layanan yang akan menjalankan dan menampilkan website agar dapat diakses oleh pengguna melalui internet."
  },
  {
    icon: <LinkIcon className="w-6 h-6" />,
    colorClass: "bg-blue-50 text-blue-600",
    hoverColor: "hover:border-blue-300",
    title: "Menghubungkan Vercel dengan GitHub",
    description: "Setelah akun Vercel tersedia, akun tersebut dihubungkan dengan GitHub. Dengan koneksi ini Vercel dapat mengambil file website langsung dari repository yang telah dibuat sebelumnya."
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    colorClass: "bg-blue-50 text-blue-600",
    hoverColor: "hover:border-blue-300",
    title: "Melakukan Deploy ke Vercel",
    description: "Website kemudian dipublikasikan melalui Vercel. Pada proses ini seluruh file yang tersimpan di GitHub akan diproses dan diubah menjadi website yang dapat diakses secara online. Setelah proses selesai, website akan memperoleh alamat sementara yang dapat langsung digunakan."
  },
  {
    icon: <Cloud className="w-6 h-6" />,
    colorClass: "bg-orange-50 text-orange-600",
    hoverColor: "hover:border-orange-300",
    title: "Membuat Akun Cloudflare",
    description: "Untuk meningkatkan pengelolaan website, dibuat akun Cloudflare. Layanan ini membantu mengatur domain, keamanan, performa, dan berbagai kebutuhan pendukung lainnya agar website dapat berjalan lebih baik."
  },
  {
    icon: <LinkIcon className="w-6 h-6" />,
    colorClass: "bg-orange-50 text-orange-600",
    hoverColor: "hover:border-orange-300",
    title: "Menghubungkan Domain ke Cloudflare",
    description: "Jika telah memiliki nama domain sendiri, domain tersebut kemudian dihubungkan ke Cloudflare. Tujuannya adalah agar pengelolaan alamat website menjadi lebih mudah serta memperoleh berbagai manfaat tambahan seperti keamanan dan percepatan akses."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    colorClass: "bg-orange-50 text-orange-600",
    hoverColor: "hover:border-orange-300",
    title: "Menghubungkan Domain ke Website",
    description: "Setelah domain berhasil dikelola melalui Cloudflare, domain tersebut dihubungkan ke website yang telah dipublikasikan di Vercel. Dengan proses ini website tidak lagi menggunakan alamat sementara, melainkan menggunakan nama domain yang lebih profesional dan mudah diingat."
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    colorClass: "bg-amber-50 text-amber-600",
    hoverColor: "hover:border-amber-300",
    title: "Mengoptimalkan Keamanan Website",
    description: "Berbagai pengaturan tambahan dilakukan untuk membantu melindungi website dari akses yang tidak diinginkan, menjaga kestabilan layanan, serta meningkatkan keamanan bagi pengunjung maupun pengelola website."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    colorClass: "bg-yellow-50 text-yellow-600",
    hoverColor: "hover:border-yellow-300",
    title: "Mengoptimalkan Kecepatan Website",
    description: "Website kemudian dioptimalkan agar dapat diakses lebih cepat. Proses ini mencakup pengelolaan gambar, file, serta berbagai komponen lain sehingga halaman dapat dimuat dengan lebih efisien pada berbagai perangkat."
  },
  {
    icon: <Search className="w-6 h-6" />,
    colorClass: "bg-green-50 text-green-600",
    hoverColor: "hover:border-green-300",
    title: "Melakukan Pemeriksaan Akhir",
    description: "Sebelum website resmi digunakan, dilakukan pemeriksaan akhir untuk memastikan seluruh halaman dapat diakses, data tampil dengan benar, domain berfungsi dengan baik, serta seluruh fitur berjalan sesuai kebutuhan."
  },
  {
    icon: <Users className="w-6 h-6" />,
    colorClass: "bg-indigo-50 text-indigo-600",
    hoverColor: "hover:border-indigo-300",
    title: "Publikasi dan Pemeliharaan Website",
    description: "Setelah seluruh proses selesai, website siap digunakan secara online. Selanjutnya dilakukan pemantauan dan pemeliharaan secara berkala untuk memastikan website tetap aman, stabil, diperbarui sesuai kebutuhan, dan mampu mendukung aktivitas pengguna dalam jangka panjang."
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    colorClass: "bg-brand-red text-white",
    hoverColor: "hover:border-brand-red-dark",
    title: "HASIL AKHIR",
    description: "Website telah berhasil dirancang, dibangun, disimpan di GitHub, dipublikasikan melalui Vercel, dihubungkan dengan Cloudflare, menggunakan domain profesional, dapat diakses secara online, serta siap digunakan oleh pengunjung dari berbagai lokasi melalui internet."
  }
];

export const sources: InfoItem[] = [
  {
    icon: <Triangle className="w-6 h-6" fill="currentColor" />,
    colorClass: "bg-black text-white",
    hoverColor: "hover:border-gray-900",
    category: "Hosting",
    title: "Hosting Vercel",
    description: "Development Domain\ndimdump-11i2wwrxg-alinlabs-projects.vercel.app\n\nDefault Domain\ndimdump.vercel.app",
    link: "https://vercel.com"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    colorClass: "bg-blue-50 text-blue-600",
    hoverColor: "hover:border-blue-300",
    category: "Domain",
    title: "Custom Domain By AlinLabs",
    description: "Custom Domain\ndimdump.vercel.app\n\nDi-hosting menggunakan platform Vercel untuk performa yang optimal.",
    link: "https://dimdump.vercel.app"
  },
  {
    icon: <Github className="w-6 h-6" />,
    colorClass: "bg-gray-100 text-gray-800",
    hoverColor: "hover:border-gray-400",
    category: "Repositori",
    title: "GitHub Repository",
    description: "Source code lengkap dari website DimDump disimpan dan dikelola pada GitHub. Anda dapat melihat riwayat perubahan, struktur kode, dan teknologi yang digunakan di balik layar.",
    link: "https://github.com/alinlabs/dimdump"
  },
  {
    icon: <HardDrive className="w-6 h-6" />,
    colorClass: "bg-blue-50 text-blue-600",
    hoverColor: "hover:border-blue-300",
    category: "Penyimpanan",
    title: "Google Drive Source Code",
    description: "Selain GitHub, kami juga menyediakan salinan arsip source code (zip) yang dapat diunduh secara langsung melalui Google Drive sebagai bentuk transparansi dan pembelajaran.",
    link: "https://drive.google.com/embeddedfolderview?id=1Aj5DXLKgnIBpRC99SiTxm29saBX5pj5e#grid"
  },
  {
    icon: <Cloud className="w-6 h-6" />,
    colorClass: "bg-orange-50 text-orange-600",
    hoverColor: "hover:border-orange-300",
    category: "Cloud",
    title: "Endpoint Cloudflare",
    description: "Sistem pengolahan data seperti API KV, D1 Database, dan Worker dikendalikan lewat jaringan server Cloudflare untuk memastikan proses baca/tulis tercepat di kelasnya.",
    link: "https://dimdump.melamelati175.workers.dev"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    colorClass: "bg-purple-50 text-purple-600",
    hoverColor: "hover:border-purple-300",
    category: "Tools",
    title: "Publish Tools",
    description: "https://alinlabs-auto.vercel.app adalah website pembantu untuk mendapatkan script push website secara cepat dan tepat serta terbaik dari AlinLabs.",
    link: "https://alinlabs-auto.vercel.app"
  }
];

export const technologies: InfoItem[] = [
  {
    icon: <Layout className="w-6 h-6" />,
    colorClass: "bg-blue-50 text-blue-600",
    hoverColor: "hover:border-blue-300",
    category: "Framework",
    title: "React.js",
    description: "Bayangkan React seperti sistem mainan keping balok (LEGO). Daripada membangun satu dinding utuh yang rumit, kami membuat bagian-bagian kecil (tombol, gambar, kartu) secara terpisah. Ini membuat fondasi website menjadi sangat kuat, konsisten, dan mudah diperbaiki tanpa membongkar keseluruhan sistem."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    colorClass: "bg-sky-50 text-sky-600",
    hoverColor: "hover:border-sky-300",
    category: "Desain",
    title: "Tailwind CSS",
    description: "Jika dianalogikan seperti melukis, maka alat perancangan ini adalah kuas ajaib kami yang memberikan warna, mengatur kerapian jarak, dan menyesuaikan tampilan ukuran di HP maupun laptop secara otomatis. Tidak perlu repot menulis instruksi warna gaya satu-persatu."
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    colorClass: "bg-purple-50 text-purple-600",
    hoverColor: "hover:border-purple-300",
    category: "Pembangun",
    title: "Vite",
    description: "Ini adalah alat yang membungkus seluruh gambar, tata letak, dan tulisan website menjadi satu bungkusan memori yang sangat ringan. Hasilnya, saat pengunjung mampir, halaman akan terbuka merespons dalam hitungan milidetik. Mencegah tamu pergi karena menunggu beban halaman yang lambat memuat gambar."
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    colorClass: "bg-green-50 text-green-600",
    hoverColor: "hover:border-green-300",
    category: "Aplikasi",
    title: "Progressive Web App (PWA)",
    description: "Teknologi terkini yang membuat pelanggan bisa \"menginstal\" website secara langsung ke layar utama handphone mereka layaknya aplikasi bawaan, tetapi tanpa repot pergi mengunduh file besar dari PlayStore. Sistem PWA juga memotong kebutuhan kuota internet berulang kali untuk menampilkan rupa desain yang sama."
  },
  {
    icon: <Database className="w-6 h-6" />,
    colorClass: "bg-orange-50 text-orange-600",
    hoverColor: "hover:border-orange-300",
    category: "Caching",
    title: "Cloudflare Global Cache",
    description: "Kami menggunakan teknologi Penyimpanan Sementara (Cache) yang menjaga file statis kami berada paling dekat dari posisi pelanggan di penjuru negeri mana pun. File menu di Cloudflare KV didukung penyimpanan cerdik (Cache) di ujung tepi; jadi setiap ada pergantian harga baru (menggunakan JSON ringkas), menu tersebut langsung menyesuaikan sangat cepat. Cache bertugas untuk mengingat elemen-elemen secara mandiri di HP pengunjung sehingga tak perlulah mesin kami mengolah permintaan ganda pada sesi yang berulang dari pengunjung yang sama."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    colorClass: "bg-indigo-50 text-indigo-600",
    hoverColor: "hover:border-indigo-300",
    category: "Geolokasi",
    title: "OSM Geolocation Cerdas",
    description: "Untuk mempermudah pelanggan mengisi isian alamat, website kami mengumpulkan info Lintang Bujur dari sensor GPS HP mereka menggunakan Geolocation API, yang kemudian diolah melalui mesin server Nominatim (OpenStreetMap). Alamat abstrak berupa angka-angka latitude dan longitude dengan ajaib diuraikan balik (Geocoding) menjadi ejaan nama Jalan, Wilayah Kelurahan, hingga Kota sesuai pemetaan peta nyata yang ada di bumi ini. Tentu, sistem ini secara masif memotong upaya pengunjung menulis isian yang panjang."
  },
  {
    icon: <Database className="w-6 h-6" />,
    colorClass: "bg-rose-50 text-rose-600",
    hoverColor: "hover:border-rose-300",
    category: "Database",
    title: "Cloudflare D1 SQL Server",
    description: "Jika KV bertugas untuk papan pengumuman menu cepat, maka ruang penyimpanan D1 adalah lemari berkas baja kami yang tak tergoyahkan. Menyematkan format rasional standar industri (SQL Database), seluruh transaksi order yang berlalu lintas masuk, log sistem, hingga pengaturan panel diringkas secara ketat. Ini memberikan jaminan mutlak pada kemanan catatan jual-beli agar tidak bocor atau saling menimpa dalam lonjakan pelanggan bersilangan sekalipun."
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    colorClass: "bg-teal-50 text-teal-600",
    hoverColor: "hover:border-teal-300",
    category: "Identifikasi",
    title: "FingerprintJS Anonymous",
    description: "Sebagai penjual pinggir jalan daring, kami mengerti tamu malas melalui prosedur login atau membongkar sandi lupa setiap saat mau beli jajan. Teknologi rekam sensor ini memproduksi sidik jari anonim untuk browser pengunjung secara eksklusif. Komputer kita mengingat sesi tamu tertentu secara transparan, menjaga troli pesanan tetap melengket kuat tanpa membebani rutinitas verifikasi log-Masuk di awal fase kunjungan."
  },
  {
    icon: <Cloud className="w-6 h-6" />,
    colorClass: "bg-neutral-100 text-neutral-800",
    hoverColor: "hover:border-neutral-300",
    category: "Hosting",
    title: "Vercel Platform Cloud",
    description: "Kami mendirikan tiang server utama lewat infrastruktur milik raksasa hosting (Vercel). Penyelenggara mesin ini berfungsi mendelegasikan tayangan antarmuka untuk siaga bisa direquest selama detik 24 Jam seminggu nonstop bahkan saat kami tutup sekalipun, menyebarkan arus padat tanpa insiden beban server drop di mata umum."
  },
  {
    icon: <Github className="w-6 h-6" />,
    colorClass: "bg-gray-100 text-gray-800",
    hoverColor: "hover:border-gray-400",
    category: "CI/CD",
    title: "Github & Node (NPM)",
    description: "Teks file ketikan murni, perbaikan bug baru, serta rombakan rancangan baru dikelola memakai jalur pipa modern. Penulis/Admin hanya mengetik ulang kode lalu mendorong pembaruannya memakai alat manajer kemasan otomatis (melalui Terminal Node NPM push) di laptopnya. Begitu tombol dilempar (Push Sync) ke brankas repositori GitHub-semua rentetan dari tarik instalasi kode, pengujian, pemadatan data gambar, dan unggah pemutakhiran situs nyata ke tayangan pelanggan dieksekusi mesin Vercel serentak. Bebas jeda panjang mati."
  }
];

export const features: InfoItem[] = [
  {
    icon: <Calculator className="w-6 h-6" />,
    colorClass: "bg-blue-50 text-blue-600",
    hoverColor: "hover:border-blue-300",
    category: "Pemesanan",
    title: "Kalkulator Pesanan Real-time",
    description: "Sistem secara langsung menghitung total biaya yang harus dibayar saat pelanggan menambah atau mengurangi takaran porsi. Tak perlu menunggu halaman loading untuk mengetahui rincian biaya yang transparan."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    colorClass: "bg-green-50 text-green-600",
    hoverColor: "hover:border-green-300",
    category: "Geolokasi",
    title: "Deteksi Koordinat Cerdas",
    description: "Sistem membaca perizinan titik lokasi pelanggan dengan presisi tinggi lalu merapatkannya ke titik akurat pada pengantaran. Membantu mengurangi friksi pengisian isian manual bagi pelanggan baru."
  },
  {
    icon: <MousePointerClick className="w-6 h-6" />,
    colorClass: "bg-orange-50 text-orange-600",
    hoverColor: "hover:border-orange-300",
    category: "Aksesibilitas",
    title: "Bottom Sheet & Pop-up",
    description: "Untuk di layar sentuh HP (mobile), informasi ditarik rapi dari bawah ke atas (Bottom Sheet). Sementara di laptop (desktop), jendela informasi melebar proporsional mengikuti ergonomi tangan."
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    colorClass: "bg-rose-50 text-rose-600",
    hoverColor: "hover:border-rose-300",
    category: "Responsivitas",
    title: "Mobile-First Interface",
    description: "Tata porsi lebar website difokuskan pada proporsi vertikal sejak tahap perancangan. Rata-rata 90% audiens membuka di ponsel layar sentuh; ruang tombol diperlebar seukuran anatomi ibu jari tangan manusia."
  }
];

export const strategies: InfoItem[] = [
  {
    icon: <Search className="w-6 h-6" />,
    colorClass: "bg-indigo-50 text-indigo-600",
    hoverColor: "hover:border-indigo-300",
    category: "Visibilitas",
    title: "SEO On-Page & Meta-Tagging",
    description: "Seluruh struktur web dirancang dengan label Open Graph Meta-tags yang lengkap. Jika Anda membagikan tautan/link melalui WhatsApp atau media sosial lainnya, platform tersebut siap merekonstruksi label informasi bergambar sehingga tampil mempesona dan jauh dari kesan spam."
  },
  {
    icon: <FastForward className="w-6 h-6" />,
    colorClass: "bg-amber-50 text-amber-600",
    hoverColor: "hover:border-amber-300",
    category: "Performa",
    title: "Edge Caching Terdistribusi",
    description: "Penggunaan Cloudflare CDN (Content Delivery Network) mendistribusikan lalu lintas data menjadi terbagi rata. Data halaman selalu dibaca oleh mesin lokal terdekat pelanggan sehingga secepat kilat. Aset terberat (file foto) dijamin dilindungi metode efisien bernama CACHE."
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    colorClass: "bg-teal-50 text-teal-600",
    hoverColor: "hover:border-teal-300",
    category: "Konversi",
    title: "Checkout Tanpa Register",
    description: "Mengurangi beban pendaftaran yang amat rumit. Pengunjung cukup melihat barang, memencet Pesan, melengkapi isian, dan terbang ke gerbang komunikasi chat WhatsApp. Pemangkasan ini efektif menaikkan laju pemesanan ketimbang memaksa tamu mengisi formulir identitas panjang."
  },
  {
    icon: <Users className="w-6 h-6" />,
    colorClass: "bg-purple-50 text-purple-600",
    hoverColor: "hover:border-purple-300",
    category: "Retensi",
    title: "Perekaman Sesi Pengguna",
    description: "Jika pengunjung menutup peramban di tengah momen ragu (memilih dimsum), jejak yang tersisa tak lekas menghilang di keranjang. Keranjang dikaitkan ke ingatan persisten sesi pengguna. Secara rahasia, metode ini menjaga laju retensi konversi tak gampang putus di tengah jalan."
  },
  {
    icon: <Timer className="w-6 h-6" />,
    colorClass: "bg-red-50 text-red-600",
    hoverColor: "hover:border-red-300",
    category: "Psikologi",
    title: "Flash Timer & Pemodelan Urgensi",
    description: "Mekanisme hitung mundur dimanfaatkan untuk menstimulasi efek FOMO (Fear Of Missing Out) atau urgensi psikologis. Pengguna yang melihat tenggat waktu akan merasa terdorong mengambil tindakan pemesanan dalam porsi cepat, ketimbang menunda-nunda pembelian."
  }
];
