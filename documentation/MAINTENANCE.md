# Maintenance Log - Wolves Basketball Club Kabupaten Bogor

Panduan dan log pemeliharaan website Wolves Basketball Club setelah rilis.

---

## Backlog Fitur (Pengembangan Lanjutan)
- [ ] **Penyimpanan Media Cloud (Vercel Blob / Cloudinary):** Mengalihkan upload foto profil atlet & bukti bayar dari disk lokal ke cloud storage agar permanen di serverless Vercel.
- [ ] **Notifikasi WhatsApp Otomatis:** Mengirim pesan otomatis ke WhatsApp pendaftar begitu pembayaran di-ACC oleh admin.
- [ ] **Payment Gateway QRIS Dinamis (Midtrans / Xendit):** Verifikasi pembayaran otomatis secara realtime tanpa perlu cek mutasi manual.
- [ ] **E-KTA Atlet Digital:** Fitur download kartu anggota digital ber-QR code untuk siswa akademi Wolves.

---

## Bug Diketahui
*Tidak ada bug aktif saat ini. Semua pengujian build, autentikasi, database, dan pemesanan berjalan lancar.*

---

## Riwayat Perubahan (Changelog)

- **2026-11-18 (Step 4 - Deploy & Maintenance):**
  - Pembuatan halaman 404 kustom bertema Apex Predator Athletic (`src/app/not-found.tsx`).
  - Pembuatan dokumentasi maintenance (`MAINTENANCE.md`) dan checklist panduan rilis Vercel (`SETUP.md` & `PROGRESS.md`).
  - Uji build produksi Next.js lolos 100% (28 rute valid, 0 error).

- **2026-11-17 (Step 3 - Sistem Pemesanan & QRIS):**
  - Pembuatan aset grafis kartu QRIS resmi Wolves (`public/images/qris-wolves.png`) dengan standar nasional QRIS & NMID Wolves.
  - Alur pendaftaran multi-step akademi: Bayar QRIS (Rp 350.000) $\rightarrow$ Upload Bukti Transfer $\rightarrow$ Isi Biodata Lengkap Atlet (Foto, Nama, Asal, Tanggal Lahir, Posisi, Tinggi, Berat Badan, No Jersey).
  - Katalog & sistem checkout Official Merchandise Wolves (`/merchandise`) dengan varian ukuran (S-XXL), alamat kirim & QRIS.
  - Halaman portal "Pesanan Anda" (`/orders`) di Navbar untuk memantau status tiket pesanan.
  - Dashboard Admin Pesanan (`/dashboard/orders`) dengan verifikasi bukti bayar, tombol ACC instan otomatis, dan tombol chat langsung ke WhatsApp pembeli (`wa.me`).

- **2026-11-16:**
  - Penyesuaian nama section dari "Roster" menjadi "Pemain Atlet" di seluruh halaman dan navigasi.
  - Pembersihan kotak bantuan testing admin pada formulir login.

- **2026-11-10 (Step 2 - Database, User Management, & Pemain Atlet):**
  - Implementasi Google Apps Script (`code.gs`, `setup.gs`) dengan fallback database lokal (`data/db.json`).
  - Autentikasi JWT via cookie httpOnly dan hashing password bcrypt.
  - Dashboard Admin (Overview, Manajemen User, Manajemen Role, CRUD Berita, Ganti Password).
  - Fitur awal daftar pemain atlet dan alur verifikasi pending/approved.

- **2026-11-09 (Step 1 - Landing Page):**
  - Setup Next.js App Router + Tailwind CSS dengan token desain *Apex Predator Athletic*.
  - Section Hero dengan foto tim juara resmi Wolves, Profil Klub, 4 Program Layanan, Warta Berita, Kontak & Embed Google Maps GOR Laga Tangkas Pakansari.
  - Optimasi logo wolves dengan background transparan.
