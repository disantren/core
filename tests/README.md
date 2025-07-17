# Unit Testing untuk Proyek E-Santren

## Deskripsi
Unit tests telah dibuat untuk menguji berbagai komponen dalam proyek E-Santren ini, termasuk:

### Unit Tests (tests/Unit/)
- **UnitTest.php** - Test untuk model Unit
- **KelasTest.php** - Test untuk model Kelas  
- **SantriTest.php** - Test untuk model Santri
- **FactoryTest.php** - Test untuk factory models

### Feature Tests (tests/Feature/Controllers/)
- **KelasControllerTest.php** - Test untuk KelasController
- **KelasControllerValidationTest.php** - Test validasi untuk KelasController

### Factories (database/factories/)
- **UnitFactory.php** - Factory untuk model Unit
- **KelasFactory.php** - Factory untuk model Kelas
- **SantriFactory.php** - Factory untuk model Santri

## Cara Menjalankan Tests

### Prerequisites
1. Pastikan PHP extension SQLite sudah diaktifkan
2. Database testing sudah dikonfigurasi di phpunit.xml

### Menjalankan Semua Tests
```bash
php artisan test
```

### Menjalankan Test Spesifik
```bash
# Menjalankan semua Unit tests
php artisan test tests/Unit

# Menjalankan semua Feature tests
php artisan test tests/Feature

# Menjalankan test untuk model tertentu
php artisan test --filter=UnitTest
php artisan test --filter=KelasTest
php artisan test --filter=SantriTest

# Menjalankan test untuk controller tertentu
php artisan test --filter=KelasControllerTest
```

### Menjalankan Test dengan Coverage
```bash
php artisan test --coverage
```

## Struktur Test

### Model Tests
Setiap model memiliki test untuk:
- Pembuatan record
- Validasi fillable attributes
- Relationship antar model
- Soft deletes functionality
- Penggunaan table name yang benar

### Controller Tests
Controller tests mencakup:
- HTTP request handling
- Validasi input
- Response handling
- Database operations (CRUD)

### Factory Tests
Factory tests memastikan:
- Factory dapat membuat data dengan benar
- Relationship antar model berfungsi
- Data yang dihasilkan sesuai format

## Konfigurasi Database Testing

Project ini menggunakan SQLite untuk testing (dikonfigurasi di phpunit.xml):
- Database: `database/database.sqlite`
- Connection: sqlite
- RefreshDatabase trait digunakan untuk reset database setiap test

## Tips Testing

1. **Gunakan RefreshDatabase trait** untuk memastikan database bersih setiap test
2. **Gunakan Factory** untuk membuat test data yang konsisten
3. **Test edge cases** seperti validasi dan error handling
4. **Pisahkan unit tests dan feature tests** untuk organisasi yang lebih baik
5. **Berikan nama test yang deskriptif** untuk memudahkan debugging

## Contoh Menjalankan Test

```bash
# Menjalankan semua tests
php artisan test

# Menjalankan test dengan verbose output
php artisan test --verbose

# Menjalankan test tertentu
php artisan test --filter=test_unit_can_be_created

# Menjalankan test untuk class tertentu
php artisan test tests/Unit/Models/UnitTest.php
```
