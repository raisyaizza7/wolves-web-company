# Progres Proyek - Wolves Basketball Club Kabupaten Bogor

Terakhir diperbarui: 2026-11-18
Posisi saat ini: **Step 4 - Deploy & Maintenance (Persiapan Rilis)**

## Checklist
- [x] Inisiasi (data usaha & desain terkumpul dari `design-reference`)
- [x] STEP 1 - Landing page
  - [x] Setup Next.js App Router + Tailwind CSS + Design Tokens
  - [x] Hero Section (Headline, CTA, Quick Metrics, Badges, Foto Skuad Juara)
  - [x] About Section (Filosofi & Keunggulan Klub)
  - [x] Service Section (4 Program Layanan: Akademi, Tim Prestasi, Sewa Court, Merchandise)
  - [x] Berita/Post Section (Warta Terkini dengan data dummy terstruktur)
  - [x] Contact + Google Maps Section (Form, Kontak Sekretariat, Peta Embed GOR Pakansari)
  - [x] Navbar & Footer Responsif
  - [x] Responsif (Mobile 375px, Tablet 768px, Desktop 1280px) & Aksesibilitas dicek
  - [x] Dikonfirmasi pengguna
- [x] STEP 2 - User management & dashboard
  - [x] Apps Script (`code.gs`, `setup.gs`) + inisiasi tabel idempoten (`Roles`, `Users`, `News`)
  - [x] Login & register lengkap dengan validasi dan hashing bcrypt
  - [x] Role admin & user dilindungi Middleware dan server-side checking
  - [x] Dashboard: Manajemen User (cari, ubah role, aktif/nonaktif, proteksi hapus admin)
  - [x] Dashboard: Manajemen Role (lihat role sistem, tambah/hapus role kustom)
  - [x] Dashboard: CRUD Berita (tambah, edit, hapus, status draft/publish, pratinjau artikel)
  - [x] Upload media lokal (`public/uploads/`) dengan validasi tipe file & ukuran
  - [x] Fitur Ganti Password Admin di dashboard
  - [x] Fitur Pemain Atlet Wolves di Landing Page (Nama, Posisi, Nomor Punggung, Umur, Tinggi, Berat, Foto)
  - [x] Fitur Pendaftaran Atlet di `/register` (Input Posisi, Tinggi, Berat, Umur, Nomor Jersey, Upload Foto Atlet)
  - [x] Fitur Verifikasi & ACC Atlet di Admin Dashboard (`/dashboard/athletes`): Atlet baru berstatus pending, setelah di-ACC admin otomatis tampil di daftar Pemain Atlet website utama
  - [x] Integrasi 10 foto profil atlet asli yang dicrop langsung dari foto skuad juara Wolves
  - [x] Hapus box kredensial testing admin dari halaman login
  - [x] Integrasi warta dinamis di Landing Page
  - [x] Dikonfirmasi pengguna
- [x] STEP 3 - Pemesanan & QRIS
  - [x] Pembuatan aset kartu QRIS resmi Wolves (`public/images/qris-wolves.png`) dengan logo & standar nasional
  - [x] Alur pendaftaran atlet akademi berjenjang (Bayar QRIS Rp 350.000 $\rightarrow$ Upload Bukti Bayar $\rightarrow$ Isi Biodata Lengkap: Foto, Nama, Asal, Tanggal Lahir, Posisi, Berat & Tinggi Badan)
  - [x] Katalog & Sistem Checkout Official Merchandise (`/merchandise`) dengan varian ukuran (S-XXL), alamat kirim & pembayaran QRIS
  - [x] Halaman portal "Pesanan Anda" (`/orders`) di Navbar khusus pengguna login untuk cek tiket pesanan & status
  - [x] Dashboard Admin Pesanan (`/dashboard/orders`): Verifikasi bukti transfer, tombol ACC otomatis (langsung approve atlet ke Roster), dan tautan chat langsung ke WhatsApp pembeli
  - [x] Integrasi database tabel `Orders` & `Athletes` di Next.js, `db.json`, `setup.gs`, dan `code.gs`
  - [x] Dikonfirmasi pengguna
- [ ] STEP 4 - Deploy & maintenance
  - [x] Verifikasi build produksi (`npm run build` lolos 0 error, 28 rute terkompilasi)
  - [x] Proteksi keamanan `.gitignore` (`.env*`, `code.gs`, `setup.gs`, `public/uploads/*`)
  - [x] Template environment variables publik (`.env.example`)
  - [x] Halaman kustom 404 Not Found (`src/app/not-found.tsx`)
  - [x] Panduan teknis deployment Vercel langkah demi langkah di `documentation/SETUP.md`
  - [x] Log pemeliharaan & backlog di `documentation/MAINTENANCE.md`
  - [x] Push seluruh kode ke repository GitHub (`https://github.com/raisyaizza7/wolves-web-company`)
  - [ ] Deploy ke Vercel
  - [ ] Konfirmasi deployment selesai

## Catatan & Keputusan
- Arsitektur Database: Browser -> Next.js API Routes -> Google Apps Script Web App -> Google Spreadsheet.
- Dual Mode: Otomatis mendukung Google Apps Script saat `APPS_SCRIPT_URL` diisi, serta fallback instan local persistent database (`data/db.json`) agar dapat langsung diuji dan dijalankan secara mandiri.
- File `code.gs` dan `setup.gs` berada di root proyek dan telah dikecualikan di `.gitignore`.
- Folder `public/uploads/*` telah dikecualikan di `.gitignore`.
- Kredensial default admin: `admin@gmail.com` / `123456`. Password tersimpan dalam bentuk hash bcrypt.

## Cara Menjalankan & Menguji
- Buka `http://localhost:3000/login`
- Masuk sebagai admin: `admin@gmail.com` / `123456`
- Coba dashboard:
  - `http://localhost:3000/dashboard/users` (Ubah status atau role pengguna)
  - `http://localhost:3000/dashboard/roles` (Tambah role kustom baru)
  - `http://localhost:3000/dashboard/news` (Buat atau edit berita, upload thumbnail baru)
  - `http://localhost:3000/dashboard/profile` (Ubah password admin)
- Coba register akun user baru di `http://localhost:3000/register`:
  - Tahap 1: Isi Akun & No WhatsApp
  - Tahap 2: Lakukan pembayaran QRIS & upload bukti transfer
  - Tahap 3: Isi biodata lengkap pemain atlet (Foto, Nama, Asal, Tanggal Lahir, Posisi, Tinggi & Berat)
- Coba beli merchandise Wolves di `http://localhost:3000/merchandise` (Pilih ukuran, masukkan alamat pengiriman & scan QRIS).
- Coba buka menu "Pesanan Anda" di `http://localhost:3000/orders` untuk melihat status tiket pesanan Anda.
- Buka Dashboard Pesanan Admin di `http://localhost:3000/dashboard/orders` untuk meninjau bukti bayar QRIS, menghubungi pembeli via WhatsApp, dan klik "Konfirmasi Pembayaran (ACC)". Saat pendaftaran akademi di-ACC, profil atlet otomatis langsung tayang di daftar Pemain Atlet website!
