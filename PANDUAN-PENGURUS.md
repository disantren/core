Panduan Singkat untuk Pengurus/Pimpinan Ponpes
=============================================

Dokumen ini menjelaskan fungsi utama aplikasi Disantren Core dengan bahasa operasional agar mudah dipahami oleh pengurus dan pimpinan pondok pesantren.

Ringkasan
---------
Disantren Core membantu mengelola data santri, kelas, kamar, pengaturan pondok, serta pencatatan keuangan sederhana (SPP dan jurnal). Aplikasi ini memudahkan pemantauan siapa yang sudah/ belum bayar SPP dan otomatis membuat pencatatan akuntansi dasar.

Manfaat Utama
-------------
- Data santri tertata (unit, kelas, kamar).
- Pencatatan pembayaran SPP cepat dan konsisten.
- Otomatis membuat jurnal akuntansi saat pembayaran masuk.
- Pemantauan santri yang belum membayar dan tunggakan per bulan.
- Hak akses berbasis peran (role & permission).

Peran Pengguna (contoh)
-----------------------
- Pimpinan: Melihat ringkasan, memantau pembayaran dan laporan.
- Bendahara/Keuangan: Mengatur harga SPP per unit, mencatat pembayaran, melihat tunggakan.
- Admin: Mengelola pengguna, unit, kelas, kamar, dan pengaturan umum.

Modul Utama
-----------
- Pengaturan Aplikasi: Identitas pondok (nama, logo), pengaturan umum.
- Unit: Kelompok pendidikan/jenjang. Tiap unit punya harga SPP bulanan sendiri.
- Santri: Data santri (termasuk unit, kelas, kamar).
- Akuntansi:
  - Akun (CoA): Daftar akun seperti Kas (1000), Pendapatan SPP (4000).
  - Jurnal: Daftar transaksi akuntansi (otomatis terisi dari pembayaran SPP, bisa juga input manual bila perlu).
  - Pembayaran: Mencatat pembayaran SPP dan melihat riwayat.

Cara Kerja Pembayaran SPP
-------------------------
1) Tentukan harga SPP per Unit (menu: App Setting → Unit). Setiap unit dapat harga berbeda.
2) Saat mencatat pembayaran santri, nominal otomatis mengikuti harga unit santri.
3) Jika status pembayaran “Lunas (paid)”, sistem otomatis membuat jurnal:
   - Debit: Kas (1000)
   - Kredit: Pendapatan SPP (4000)
4) Riwayat pembayaran tampil beserta tanggal dan status.

Pemantauan Belum Bayar & Tunggakan
----------------------------------
- “Belum Bayar Bulan Ini”: Daftar santri yang belum membayar SPP pada bulan berjalan. Ada kotak pencarian untuk memudahkan.
- “Kekurangan SPP (Sejak Awal Tahun)”: Menampilkan berapa bulan tertunggak, daftar bulannya, dan total kekurangan (otomatis dihitung dari harga unit x jumlah bulan belum bayar). Tersedia tombol untuk mengisi form sesuai total tunggakan.

Alur Harian yang Disarankan
---------------------------
- Bendahara:
  - Cek daftar “Belum Bayar Bulan Ini” → hubungi wali santri bila perlu.
  - Saat menerima pembayaran → catat di menu Pembayaran.
  - Tinjau “Kekurangan SPP (Sejak Awal Tahun)” untuk follow-up tunggakan.
- Pimpinan:
  - Lihat ringkasan di Dashboard Akuntansi (jumlah pembayaran, jurnal terbaru, dll.).

Pertanyaan yang Sering Diajukan (FAQ)
-------------------------------------
- Q: Mengapa nominal pembayaran otomatis berubah?
  - A: Nominal mengikuti harga SPP sesuai Unit santri, agar seragam.
- Q: Bisa ubah harga SPP?
  - A: Bisa. Buka App Setting → Unit, lalu edit harga SPP per Unit.
- Q: Apakah bisa mencatat jurnal selain dari pembayaran SPP?
  - A: Bisa. Buka menu Jurnal dan isi transaksi manual (mis. beban operasional).
- Q: Apakah ada laporan cetak?
  - A: Versi ini fokus pada tampilan layar. Ekspor/cetak bisa ditambahkan sesuai kebutuhan.

Keamanan & Hak Akses
--------------------
- Setiap pengguna punya peran (role) dan izin (permission). Pengguna hanya bisa mengakses menu sesuai tugasnya.
- Data perubahan (membuat/mengubah/hapus) dibatasi oleh izin.

Langkah Implementasi Singkat
----------------------------
1) Buat Unit dan harga SPP per Unit.
2) Input data santri (lengkap dengan Unit/kelas/kamar).
3) Mulai catat pembayaran SPP setiap bulan.
4) Pantau daftar belum bayar dan tunggakan untuk tindak lanjut.

Bantuan
-------
Hubungi admin/penanggung jawab IT internal bila ada kebutuhan fitur tambahan atau kendala penggunaan.
