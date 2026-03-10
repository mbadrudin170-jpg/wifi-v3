# Dokumentasi Proyek WiFi V3

## 1. Ikhtisar Proyek

Aplikasi ini adalah sistem manajemen untuk layanan WiFi, dibangun menggunakan React Native dan Expo. Aplikasi ini memungkinkan pengelolaan data pelanggan, paket layanan, transaksi keuangan, dan kategori. Aplikasi ini menggunakan database SQLite untuk penyimpanan data lokal.

## 2. Struktur Proyek

Proyek ini diorganisir ke dalam beberapa direktori utama yang memisahkan tanggung jawab (concerns) secara logis.

```
.
├── app/                  # File routing dan layar utama aplikasi
│   ├── (tabs)/           # Layar dengan navigasi tab
│   ├── detail/           # Layar detail untuk item tertentu
│   └── form/             # Layar formulir untuk input data
├── assets/               # Gambar, ikon, dan aset statis lainnya
├── components/           # Komponen React yang dapat digunakan kembali
│   ├── komponen-react/   # Komponen UI dasar
│   ├── modal/            # Komponen modal
│   ├── tombol/           # Berbagai jenis tombol
│   └── ui/               # Komponen UI lainnya
├── constants/            # Nilai konstan (misalnya, tema)
├── database/             # Skema dan operasi database
│   └── operasi/          # Fungsi CRUD untuk setiap tabel
├── hooks/                # Custom hooks React untuk logika bisnis
├── scripts/              # Skrip bantuan untuk pengembangan
└── utils/                # Fungsi utilitas (misalnya, formatting)
```

## 3. Detail Dokumentasi per File

### 3.1. `app` (Routing & Layar)

Direktori ini mengelola semua rute dan layar aplikasi menggunakan sistem routing berbasis file dari Expo Router.

-   **`app/_layout.tsx`**:
    -   **Kegunaan**: File layout root aplikasi. Menginisialisasi database SQLite, mengatur provider tema, dan menangani pemuatan font. Ini adalah titik masuk utama aplikasi.

-   **`app/(tabs)/_layout.tsx`**:
    -   **Kegunaan**: Mengatur layout untuk navigasi tab utama. Mendefinisikan setiap tab (Beranda, Pelanggan, Transaksi, dll.) dan ikonnya.

-   **`app/(tabs)/index.tsx`**:
    -   **Kegunaan**: Layar Beranda (Dashboard). Menampilkan ringkasan informasi penting seperti jumlah pelanggan aktif, total pemasukan, dan total pengeluaran.

-   **`app/(tabs)/pelanggan.tsx`**:
    -   **Kegunaan**: Menampilkan daftar semua pelanggan. Menyediakan fungsionalitas pencarian dan pengurutan, serta tombol untuk menambah pelanggan baru.

-   **`app/(tabs)/transaksi.tsx`, `paket.tsx`, `kategori.tsx`**:
    -   **Kegunaan**: Layar serupa untuk menampilkan daftar transaksi, paket, dan kategori.

-   **`app/form/form-kategori.tsx`**:
    -   **Kegunaan**: Formulir untuk menambah atau mengedit data kategori.
    -   **Logika**:
        -   Menggunakan state (`useState`) untuk mengelola input nama dan tipe kategori.
        -   Menggunakan `useSQLiteContext` untuk mengakses database.
        -   Memanggil fungsi `create` dari `operasiKategori` untuk menyimpan data baru.
        -   Menampilkan modal (`ModalDropDown`) untuk memilih tipe ('Pemasukan' atau 'Pengeluaran').
        -   Memberikan umpan balik kepada pengguna melalui `Alert`.

-   **`app/detail/pelanggan/[id].tsx`**:
    -   **Kegunaan**: Menampilkan informasi detail dari seorang pelanggan berdasarkan `id` yang diterima dari parameter rute.

### 3.2. `components` (Komponen UI)

Komponen yang dapat digunakan kembali di seluruh aplikasi.

-   **`components/modal/modal.tsx`**:
    -   **Kegunaan**: Komponen `ModalDropDown` generik yang dapat dikonfigurasi.
    -   **Fungsi**: Menerima properti seperti `visible`, `onClose`, `data`, dan `renderItem` untuk menampilkan konten dinamis dalam sebuah modal. Sangat fleksibel dan digunakan di banyak bagian aplikasi untuk pemilihan data.

-   **`components/komponen-react/input-teks.tsx`**:
    -   **Kegunaan**: Komponen input teks standar dengan label dan placeholder.

-   **`components/tombol/`**:
    -   **Kegunaan**: Direktori ini berisi berbagai jenis tombol yang konsisten secara visual, seperti `TombolSimpan`, `TombolHapus`, `TombolEdit`, dll. Setiap tombol memiliki gaya dan ikon yang telah ditentukan sebelumnya.

### 3.3. `database` (Manajemen Data)

-   **`database/sqlite.ts`**:
    -   **Kegunaan**: Titik pusat untuk manajemen database.
    -   **Fungsi**:
        -   `initDb`: Fungsi utama untuk membuka atau membuat file database `main.db`.
        -   `db.execAsync`: Menjalankan migrasi skema database. Membuat tabel-tabel seperti `pelanggan`, `paket`, `transaksi`, `kategori`, dll., jika belum ada. Menggunakan `PRAGMA foreign_keys=ON` untuk memastikan integritas data.

-   **`database/operasi/kategori-operasi.ts`**:
    -   **Kegunaan**: Menyediakan sekumpulan fungsi (CRUD - Create, Read, Update, Delete) untuk berinteraksi dengan tabel `kategori`.
    -   **Fungsi**:
        -   `getAll()`: Mengambil semua kategori.
        -   `getByType(...)`: Mengambil kategori berdasarkan tipe ('Pemasukan' atau 'Pengeluaran').
        -   `create(...)`: Menyimpan record kategori baru.
        -   `update(...)`: Memperbarui record kategori yang ada.
        -   `delete(...)`: Menghapus record kategori.
    -   **Struktur serupa juga berlaku untuk file operasi lainnya**: `pelanggan-operasi.ts`, `paket-operasi.ts`, dll.

### 3.4. `hooks` (Logika Kustom)

-   **`hooks/use-theme-color.ts`**:
    -   **Kegunaan**: Hook kustom untuk mendapatkan warna spesifik berdasarkan tema aplikasi yang sedang aktif (terang atau gelap). Membantu menjaga konsistensi warna di seluruh aplikasi.

-   **`hooks/hitung-tanggal-berakhir.ts`**:
    -   **Kegunaan**: Menyediakan fungsi `hitungTanggalBerakhir` yang menghitung tanggal kedaluwarsa berdasarkan tanggal mulai dan durasi paket. Logika bisnis penting untuk status pelanggan.

-   **`hooks/status-pelanggan.ts`**:
    -   **Kegunaan**: Menentukan status pelanggan (`Aktif`, `Akan Segera Berakhir`, `Tidak Aktif`) berdasarkan tanggal berakhir langganan mereka.

### 3.5. `utils` (Fungsi Utilitas)

-   **`utils/format/format-angka.ts`**:
    -   **Kegunaan**: Mengubah angka menjadi format mata uang Rupiah (misalnya, `10000` menjadi `Rp 10.000`).
-   **`utils/format/format-tanggal.ts`**:
    -   **Kegunaan**: Mengubah objek `Date` atau string tanggal menjadi format yang lebih mudah dibaca (misalnya, `dd MMM yyyy`).

---
