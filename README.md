Disantren Core
==============

Aplikasi Laravel + Inertia (React) untuk mengelola operasional pesantren: pengguna, santri, kelas, kamar, pengaturan aplikasi, dan akuntansi sederhana (jurnal & pembayaran SPP).

Teknologi
---------
- Laravel (PHP) + Eloquent
- Inertia.js + React + TypeScript + Vite
- Tailwind + Komponen Shadcn UI
- PHPUnit untuk pengujian

Fitur Utama
-----------
- Manajemen User, Role, dan Permission
- Manajemen Santri, Kelas, dan Kamar
- Pengaturan Aplikasi (logo, metadata)
- Akuntansi
  - Daftar Akun (Chart of Accounts / CoA)
  - Jurnal (ledger entries)
  - Pembayaran SPP dengan harga per Unit
  - Jurnal otomatis saat pembayaran Lunas (Debit Kas 1000, Kredit Pendapatan SPP 4000)
  - Daftar belum bayar dan ringkasan tunggakan

Mulai Cepat
-----------

Prasyarat
- PHP 8.2+
- Composer
- Node.js 18+
- Database (MySQL/PostgreSQL/SQLite)

Instalasi
1) Clone dan instal dependency
- composer install
- npm install

2) Konfigurasi environment
- cp .env.example .env
- php artisan key:generate
- Sesuaikan variabel DB_ di `.env`

3) Migrasi dan seed
- php artisan migrate
- php artisan db:seed

Seeder akan membuat permission/role, user, dan bootstrap akuntansi (CoA, saldo awal). Opsional: seed ulang Unit dengan contoh harga SPP:
- php artisan db:seed --class=UnitSeeder

4) Jalankan aplikasi
- php artisan serve
- npm run dev

Lalu buka URL dari output `php artisan serve`.

Ringkasan Akuntansi
-------------------
- CoA default mencakup Kas (1000), Modal (3000), Pendapatan SPP (4000)
- Halaman Jurnal menampilkan ledger dan validasi input + toast
- Halaman Pembayaran
  - Nominal default mengikuti harga SPP Unit santri (fallback ke pengaturan global bila kosong)
  - Saat status = paid, sistem otomatis membuat jurnal:
    - Debit: Kas (1000)
    - Kredit: Pendapatan SPP (4000)
  - Daftar:
    - Belum Bayar Bulan Ini: ada pencarian cepat dan tombol “Isi Form Pembayaran”
    - Kekurangan SPP (Sejak Awal Tahun): daftar bulan tertunggak dan total kekurangan; tombol cepat untuk mengisi total tunggakan

Harga SPP per Unit
------------------
- Tersedia field `spp_monthly_price` pada Unit (atur di Dashboard → App Setting → Unit)
- Saat memilih santri, nominal pembayaran otomatis diisi berdasarkan harga Unit santri

Migrasi terkait:
- database/migrations/2025_09_03_000011_add_spp_monthly_price_to_units_table.php

Catatan Frontend
----------------
- Halaman terkait:
  - resources/js/pages/akuntansi/akun/index.tsx
  - resources/js/pages/akuntansi/jurnal/index.tsx
  - resources/js/pages/akuntansi/pembayaran/index.tsx
  - resources/js/pages/app-setting/unit/unit.tsx
- Pagination: komponen menangani array biasa atau paginator Laravel (`.data`)
- Tanggal ditampilkan dalam format DD-MM-YYYY

Rute (pilihan)
--------------
- GET /dashboard/akuntansi → dashboard akuntansi
- GET /dashboard/akuntansi/akun → kelola akun
- GET /dashboard/akuntansi/jurnal → jurnal
- GET /dashboard/akuntansi/pembayaran → pembayaran SPP
- POST /dashboard/akuntansi/jurnal → buat entri jurnal
- POST /dashboard/akuntansi/pembayaran → buat pembayaran

Tips Pengembangan
-----------------
- Gunakan toast `sonner` untuk umpan balik cepat
- Konsistenkan kode CoA dengan seeder (1000 Kas, 4000 Pendapatan SPP) kecuali Anda memperbarui mapping di controller

Pengujian
---------
- phpunit.xml sudah dikonfigurasi; lihat folder `tests/`
- Jalankan: vendor\bin\phpunit (Windows) atau ./vendor/bin/phpunit

Lisensi
-------
Proprietary – proyek internal.
