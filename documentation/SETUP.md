# Panduan Setup Lokal, Google Apps Script, & Deployment - Wolves Kab. Bogor

Dokumen ini berisi panduan teknis dan operasional untuk menghubungkan website **Wolves Basketball Club Kabupaten Bogor** dengan database **Google Spreadsheet** melalui **Google Apps Script**.

---

## 1. Arsitektur Aliran Data & Keamanan

```
Browser  ───>  Next.js Server (API / Middleware)  ───>  Google Apps Script Web App  ───>  Google Spreadsheet
```

### Mengapa ada lapisan server Next.js?
Browser pengguna **tidak pernah** memanggil Google Apps Script secara langsung. Semua permintaan diarahkan terlebih dahulu ke server Next.js. Server Next.js akan memvalidasi otorisasi sesi cookie, melakukan hashing password (menggunakan bcrypt), dan menyertakan **Secret Token** (`APPS_SCRIPT_SECRET`) saat menghubungi Google Apps Script. Dengan demikian, spreadsheet Anda tetap terlindungi dan tidak bisa diakses sembarang orang dari internet publik.

---

## 2. Cara Menghubungkan Google Spreadsheet (Database)

### Langkah 1: Buat Google Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama spreadsheet, misalnya: `Wolves Basketball Database`.

### Langkah 2: Buka Editor Apps Script
1. Di menu Google Spreadsheet, klik **Ekstensi (Extensions)** > **Apps Script**.
2. Anda akan diarahkan ke editor kode Google Apps Script.

### Langkah 3: Salin Kode
1. Di editor Apps Script, buat 2 file script (`.gs`):
   - **`code.gs`**: Salin seluruh isi file [`code.gs`](file:///Users/raisyaizzasyaputra/wolves-web-company/code.gs) dari root proyek website.
   - **`setup.gs`**: Salin seluruh isi file [`setup.gs`](file:///Users/raisyaizzasyaputra/wolves-web-company/setup.gs) dari root proyek website.

### Langkah 4: Atur Script Properties (Token Rahasia)
1. Di bilah menu kiri Apps Script, klik ikon gerigi ⚙️ (**Setelan Proyek / Project Settings**).
2. Gulir ke bawah ke bagian **Properti Skrip (Script Properties)**.
3. Klik **Tambahkan properti skrip (Add script property)**:
   - Properti: `APPS_SCRIPT_SECRET`
   - Nilai: *(Buat string rahasia acak, misalnya: `wolves_secret_token_2025_secure`)*
4. Klik **Simpan properti skrip**.

### Langkah 5: Jalankan Inisiasi Tabel (`initTables`)
1. Kembali ke editor kode (`Editor` < >).
2. Buka file `setup.gs`.
3. Pada menu dropdown fungsi di bagian atas, pilih fungsi **`initTables`**.
4. Klik tombol **Jalankan (Run)** ▶️.
5. Berikan izin (*Review permissions*) akun Google Anda.
6. Tunggu hingga selesai. Periksa Google Spreadsheet Anda: lembar `Roles`, `Users`, dan `News` beserta akun awal Super Admin (`admin@gmail.com`) dan data awal warta telah dibuat secara otomatis.
   *(Fungsi ini bersifat idempoten: aman dijalankan berulang kali tanpa merusak data yang ada).*

### Langkah 6: Deploy sebagai Web App
1. Di pojok kanan atas editor Apps Script, klik tombol biru **Terapkan (Deploy)** > **Penerapan baru (New deployment)**.
2. Klik ikon gerigi di sebelah *Pilih jenis*, pilih **Aplikasi web (Web app)**.
3. Konfigurasi:
   - **Deskripsi**: `Wolves Web API v1`
   - **Jalankan sebagai (Execute as)**: `Saya (Me - email@anda.com)`
   - **Yang memiliki akses (Who has access)**: `Siapa saja (Anyone)`
4. Klik **Terapkan (Deploy)**.
5. Salin **URL Aplikasi Web** yang dihasilkan (berformat `https://script.google.com/macros/s/.../exec`).

### Langkah 7: Sambungkan ke Proyek Website
1. Di komputer Anda, buat file `.env.local` di folder `wolves-web-company/`:
   ```bash
   APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbx.../exec"
   APPS_SCRIPT_SECRET="wolves_secret_token_2025_secure"
   AUTH_SECRET="wolves-basketball-club-super-secret-jwt-key-2025"
   ```
2. Restart server lokal (`npm run dev`). Kini website Anda telah terhubung langsung ke Google Spreadsheet!

---

## 3. Catatan Penting Media & Penyimpanan Gambar

- Thumbnail berita yang diunggah melalui dashboard admin disimpan di folder lokal `public/uploads/`.
- Hanya path relatif (misal: `/uploads/uuid.jpg`) yang disimpan di Google Spreadsheet.

> [!WARNING]
> **Batasan Disk Vercel (Produksi):**  
> Sistem file di Vercel bersifat sementara (*ephemeral & read-only* saat runtime). Artinya, file yang diupload ke folder lokal berfungsi optimal saat dijalankan di komputer Anda (*development*), namun file baru tidak akan disimpan permanen di server Vercel pada mode production.  
> Modul penyimpanan telah dibungkus rapi di [`src/lib/storage.ts`](file:///Users/raisyaizzasyaputra/wolves-web-company/src/lib/storage.ts). Pada **Step 4**, kami akan mendampingi Anda untuk menghubungkannya ke layanan penyimpanan cloud permanen (seperti Vercel Blob atau Cloudinary).

---

## 4. Kredensial Awal & Panduan Keamanan

Akun administrator default yang dibuat saat inisiasi:
- **Email**: `admin@gmail.com`
- **Password**: `123456`

> [!CAUTION]
> Segera ganti password admin ini melalui menu **Dashboard > Ganti Password** (`http://localhost:3000/dashboard/profile`) sebelum mempublikasikan website ke internet!

---

## 5. Panduan Deploy ke Vercel (Langkah demi Langkah)

Vercel adalah platform hosting cloud terbaik untuk aplikasi Next.js. Ikuti panduan sederhana ini untuk merilis website ke internet:

### Langkah 1: Push Kode ke GitHub
1. Buat repository baru di [GitHub](https://github.com/new), misalnya dengan nama `wolves-web-company` (pilih Private atau Public).
2. Di terminal komputer Anda, jalankan perintah:
   ```bash
   git init
   git add .
   git commit -m "feat: website resmi wolves kab bogor siap deploy"
   git branch -M main
   git remote add origin https://github.com/username-anda/wolves-web-company.git
   git push -u origin main
   ```
   *(Semua file rahasia seperti `.env*`, `code.gs`, `setup.gs`, dan `public/uploads/*` sudah otomatis dilindungi dan tidak akan ikut terunggah ke GitHub).*

### Langkah 2: Hubungkan Repository ke Vercel
1. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan login (bisa menggunakan akun GitHub Anda).
2. Klik tombol **Add New...** > **Project**.
3. Cari repository `wolves-web-company` yang baru saja Anda push, lalu klik **Import**.
4. Framework Preset akan otomatis terdeteksi sebagai **Next.js**.

### Langkah 3: Masukkan Environment Variables di Vercel
Sebelum mengklik Deploy, buka accordion **Environment Variables** di Vercel, lalu tambahkan 3 variabel berikut (samakan dengan isi `.env.local` Anda):

| Nama Variabel | Nilai Contoh | Keterangan |
|---|---|---|
| `APPS_SCRIPT_URL` | `https://script.google.com/macros/s/.../exec` | URL Web App Google Apps Script Anda |
| `APPS_SCRIPT_SECRET` | `token_rahasia_anda` | Token rahasia yang sama dengan di Script Properties |
| `AUTH_SECRET` | `string_acak_32_karakter_aman` | Kunci enkripsi sesi login cookie |

### Langkah 4: Klik Deploy!
1. Klik tombol **Deploy**.
2. Vercel akan menjalankan build otomatis sekitar 1-2 menit.
3. Setelah selesai, Anda akan mendapatkan URL domain resmi Vercel (misalnya: `https://wolves-web-company.vercel.app`).

### Langkah 5: Uji Coba & Ganti Password Admin
1. Buka URL Vercel Anda di browser / ponsel.
2. Masuk ke halaman login (`/login`) dengan akun admin default.
3. Buka menu **Ganti Password** (`/dashboard/profile`) dan ubah password admin menjadi password pribadi yang kuat.
4. Coba lakukan pendaftaran atlet, pemesanan merchandise, dan warta berita untuk memastikan semuanya terhubung dengan sempurna ke Google Spreadsheet.
