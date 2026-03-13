# Dokumentasi Proyek

Dokumentasi ini menjelaskan struktur proyek dan fungsi dari setiap file untuk membantu pengembangan dan pemeliharaan.

## app

Direktori `app` adalah jantung dari struktur rute (routing) aplikasi Anda, dikelola oleh Expo Router. Setiap file di sini secara otomatis menjadi sebuah rute dalam aplikasi.

- #### `app.json`

  File konfigurasi utama untuk aplikasi Expo. Ini mengontrol properti fundamental seperti nama aplikasi, versi, ikon, layar splash, orientasi, serta konfigurasi spesifik platform untuk iOS dan Android.

- #### `app/_layout.tsx`
  Komponen layout root aplikasi. Komponen ini membungkus semua rute dan halaman. Ideal untuk menginisialisialisasi provider global (seperti Theme Provider, State Management) dan memuat aset penting (seperti font) sebelum aplikasi ditampilkan.

### (tabs)

Direktori ini mendefinisikan rute yang ada di dalam navigasi tab utama.

- #### `app/(tabs)/_layout.tsx`

  Mendefinisikan struktur dan konfigurasi untuk navigasi tab utama. Ini mengatur daftar tab (misalnya, Dompet, Transaksi), termasuk ikon dan label yang sesuai untuk setiap tab.

- #### `app/(tabs)/dompet.tsx`, `kategori.tsx`, `paket.tsx`, dll.
  Ini adalah file _entry-point_ untuk setiap halaman yang diakses melalui tab navigasi. Peran utama file-file ini adalah untuk mengimpor dan me-render komponen "halaman" yang sebenarnya dari direktori `halaman/`. Ini adalah pola yang baik untuk memisahkan logika rute dari logika UI.

### detail

- #### `app/detail/_layout.tsx`

  Komponen layout yang berlaku untuk semua rute di dalam grup `(detail)`. Dapat digunakan untuk menyediakan header yang konsisten atau konteks bersama untuk semua halaman detail.

- #### `app/detail/detail-dompet/[id].tsx`, `detail-paket/[id].tsx`, dll.
  Ini adalah rute dinamis. Bagian `[id]` pada nama file berarti rute ini akan cocok untuk path seperti `detail/detail-dompet/1`, `detail/detail-dompet/2`, dll. File ini bertugas untuk mengambil ID dari URL dan menampilkan halaman detail yang sesuai untuk item tersebut.

### form

- #### `app/form/_layout.tsx`

  Komponen layout yang berlaku untuk semua halaman formulir, memastikan tampilan yang konsisten (misalnya, header dengan tombol "Simpan" atau "Batal").

- #### `app/form/form-dompet.tsx`, `form-paket.tsx`, dll.
  Rute yang mengarah ke halaman formulir spesifik untuk menambah atau mengedit data (misalnya, dompet baru, paket baru). File ini akan me-render komponen form yang relevan dari direktori `halaman/form`.

- #### `app/form/form-pelanggan-aktif.tsx`

   **Tujuan**: Rute yang menampilkan form untuk mengaktifkan langganan baru bagi seorang pelanggan.
   **Fungsi**: File ini bertanggung jawab untuk me-render komponen `FormPelangganAktif` yang berisi logika dan UI formulir.

## halaman

Direktiri ini berisi implementasi UI dan logika untuk setiap halaman aplikasi. Ini memisahkan "apa itu halaman" (di `app`) dari "bagaimana halaman itu terlihat dan berfungsi" (di `halaman`).

### `halaman/(tabs)`

- #### `halaman/(tabs)/dompet-halaman.tsx`

  **Tujuan**: Menampilkan ringkasan dan daftar semua dompet pengguna.
  **Fitur**:
  - **Statistik Keuangan**: Menampilkan kartu statistik untuk **Total Aset** (saldo positif), **Total Utang** (saldo negatif), dan **Saldo Bersih** (aset - utang).
  - **Daftar Dompet Berkelompok**: Menggunakan `SectionList` untuk menampilkan dompet yang dikelompokkan berdasarkan tipenya (misalnya, 'tunai', 'bank'). Setiap grup menampilkan total saldonya.
  - **Navigasi**: Pengguna dapat menekan item dompet untuk masuk ke halaman detailnya (`/detail/detail-dompet/[id]`).
  - **Aksi Tambah**: Terdapat tombol tambah (`TombolTambah`) yang mengarahkan pengguna ke halaman form untuk membuat dompet baru (`/form/form-dompet`).
    **Logika**:
  - Mengambil semua data dompet dari database menggunakan `operasiDompet`.
  - Menggunakan `useMemo` untuk menghitung total aset, total utang, dan saldo bersih secara efisien.
  - Data dompet dikelompokkan berdasarkan `tipe` untuk ditampilkan dalam `SectionList`.
  - `useFocusEffect` digunakan untuk memuat ulang data setiap kali halaman ini mendapatkan fokus, memastikan data selalu terbaru.

- #### `halaman/(tabs)/index.tsx`

  **Tujuan**: Berfungsi sebagai dashboard utama yang menampilkan daftar pelanggan yang sedang aktif.
  **Fitur**:
  - **Header Dasbor**: Menampilkan judul "Dashboard" dan jumlah total pelanggan aktif.
  - **Daftar Pelanggan Aktif**: Menampilkan daftar pelanggan aktif dalam bentuk kartu, masing-masing berisi nama pelanggan, tanggal berakhir langganan, nama paket, dan status langganan (misalnya, "Aktif", "Akan Berakhir", "Berakhir").
  - **Fitur Urutkan**: Tombol urutkan di header membuka modal yang memungkinkan pengguna mengurutkan daftar berdasarkan:
    - Nama (A-Z atau Z-A)
    - Jatuh Tempo Terdekat
    - Tanggal Mulai Terbaru
  - **Navigasi**: Menekan item pelanggan akan membawa pengguna ke halaman detail pelanggan aktif tersebut.
  - **Aksi Tambah**: Tombol tambah mengarahkan ke form untuk menambah pelanggan aktif baru.
    **Logika**:
  - Mengambil data pelanggan aktif dari `operasiPelangganAktif` di database.
  - Status setiap pelanggan (warna teks, teks status) ditentukan oleh _custom hook_ `getStatusPelanggan`.
  - Logika pengurutan diimplementasikan langsung di dalam _handler_ `handleUrutkan`.
  - Menggunakan `Modal` untuk menampilkan opsi pengurutan.

- #### `halaman/(tabs)/kategori.tsx`

  **Tujuan**: Mengelola kategori dan sub-kategori untuk pemasukan dan pengeluaran.
  **Fitur**:
  - **Filter Tipe**: Terdapat dua tombol utama ("Pemasukan" dan "Pengeluaran") yang berfungsi sebagai filter untuk menampilkan kategori yang sesuai.
  - **Daftar Kategori**: Menampilkan daftar kategori berdasarkan tipe yang aktif. Kategori yang sedang dipilih akan ditandai secara visual.
  - **Daftar Sub-Kategori**: Menampilkan daftar sub-kategori yang dimiliki oleh kategori yang sedang aktif.
  - **Aksi Tambah**: Tombol tambah mengarahkan pengguna ke form untuk membuat kategori baru.
    **Logika**:
  - Menggunakan `useState` untuk mengelola tipe yang aktif (`Pemasukan` atau `Pengeluaran`) dan kategori yang dipilih.
  - `useFocusEffect` dan `useCallback` digunakan untuk memuat data kategori dari `operasiKategori` dan sub-kategori dari `operasiSubKategori` saat halaman dibuka atau saat tipe/kategori aktif berubah.
  - Ketika sebuah kategori dipilih, aplikasi akan mengambil dan menampilkan sub-kategori yang terkait dengannya.

- #### `halaman/(tabs)/paket.tsx`

  **Tujuan**: Menampilkan dan mengelola daftar paket layanan internet yang tersedia.
  **Fitur**:
  - **Header Informasi**: Menampilkan judul "Manajemen Paket" dan jumlah total paket yang tersedia.
  - **Daftar Paket**: Menampilkan setiap paket dalam format kartu yang informatif, berisi:
    - Nama Paket
    - Durasi Masa Aktif
    - Kecepatan (misalnya, Mbps)
    - Harga Paket
  - **Aksi Cepat**: Tombol _refresh_ untuk memuat ulang data dan tombol hapus (fungsionalitas belum diimplementasikan).
  - **Navigasi**: Menekan kartu paket akan mengarahkan pengguna ke halaman detail paket.
  - **Aksi Tambah**: Tombol tambah untuk membuat paket baru.
    **Logika**:
  - Mengambil semua data paket dari `operasiPaket` di database.
  - `Promise.all` digunakan untuk mengambil daftar paket dan total jumlahnya secara paralel demi efisiensi.
  - Komponen `RenderItemPaket` dibuat di luar komponen utama untuk optimalisasi performa `FlatList`.

- #### `halaman/(tabs)/pelanggan.tsx`

  **Tujuan**: Menampilkan daftar semua pelanggan yang terdaftar dalam sistem.
  **Fitur**:
  - **Header Informasi**: Menampilkan judul "Daftar Pelanggan" dan jumlah total pelanggan.
  - **Daftar Pelanggan**: Setiap pelanggan ditampilkan dalam sebuah kartu yang berisi:
    - Nama Lengkap
    - Alamat
    - Nomor Telepon
  - **Aksi Refresh**: Tombol _refresh_ untuk memuat ulang data dari database.
  - **Navigasi**: Menekan kartu pelanggan akan mengarahkan pengguna ke halaman detail pelanggan.
  - **Aksi Tambah**: Tombol tambah untuk menambah data pelanggan baru (mengarahkan ke form pelanggan aktif).
    **Logika**:
  - `useFocusEffect` digunakan untuk memastikan data pelanggan selalu diperbarui saat halaman dibuka.
  - `useMemo` digunakan untuk mengoptimalkan pembuatan _instance_ `operasiPelanggan`, mencegah pembuatan ulang yang tidak perlu di setiap _render_.
  - Menampilkan _loading indicator_ saat data sedang diambil dari database.

- #### `halaman/(tabs)/statistik.tsx`

  **Tujuan**: Memberikan visualisasi data keuangan melalui grafik dan ringkasan statistik.
  **Fitur**:
  - **Grafik Saldo Berjalan**: Menampilkan `LineChart` yang memvisualisasikan perubahan total saldo (pemasukan dikurangi pengeluaran) dari waktu ke waktu.
  - **Ringkasan Keuangan**: Kartu informasi yang menampilkan: - **Saldo Terakhir**: Nilai saldo paling akhir. - **Rata-Rata Pemasukan**: Rata-rata per hari, per minggu, dan per bulan. - **Rata-Rata Pengeluaran**: Rata-rata per hari, per minggu, dan per bulan.
    **Logika**:
  - Menggunakan _custom hook_ `useStatistikKeuangan` untuk melakukan semua kalkulasi kompleks, seperti mempersiapkan data untuk grafik dan menghitung semua nilai rata-rata.
  - Menggunakan `react-native-chart-kit` untuk merender grafik.
  - `formatAngkaSingkat` digunakan untuk memformat label pada sumbu Y grafik (misalnya, 1000000 menjadi 1JT) agar lebih ringkas.
  - `formatRupiah` digunakan untuk menampilkan nilai-nilai keuangan dalam format mata uang yang benar.

- #### `halaman/(tabs)/transaksi.tsx`
  **Tujuan**: Menampilkan riwayat semua transaksi keuangan (pemasukan dan pengeluaran).
  **Fitur**:
  - **Header Ringkasan**: Menampilkan total pemasukan, total pengeluaran, dan selisihnya (total akhir).
  - **Daftar Transaksi Berkelompok**: Menggunakan `SectionList` untuk menampilkan transaksi yang dikelompokkan berdasarkan tanggal. Setiap grup (section) menampilkan total transaksi (pemasukan - pengeluaran) pada hari itu.
  - **Detail Item Transaksi**: Setiap item transaksi menampilkan:
    - Kategori & Sub-Kategori
    - Deskripsi & Dompet yang digunakan
    - Jumlah uang (dengan warna berbeda untuk pemasukan dan pengeluaran)
    - Jam transaksi
  - **Aksi Hapus Semua**: Tombol di header memungkinkan pengguna untuk menghapus semua riwayat transaksi dengan konfirmasi.
  - **Navigasi**: Menekan item transaksi akan membawa pengguna ke halaman detail transaksi.
    **Logika**:
  - Mengambil data transaksi dari `operasiTransaksi.ambilSemuaLengkap()`, yang juga menyertakan nama kategori, sub-kategori, dan dompet.
  - Data diolah dengan fungsi `groupByDate` untuk dikelompokkan sebelum ditampilkan di `SectionList`.
  - `Promise.all` digunakan untuk mengambil data transaksi, total jumlah, serta total pemasukan/pengeluaran secara efisien.
  - Menampilkan pesan "Memuat data transaksi..." saat data sedang diambil.

### `halaman/detail`

- #### `halaman/detail/detail-dompet-halaman.tsx`

  **Tujuan**: Menampilkan informasi detail dari sebuah dompet, termasuk saldo saat ini dan riwayat transaksinya.
  **Fitur**:
  - **Header Aksi**: Dilengkapi dengan tombol Kembali dan tombol Edit untuk mengubah data dompet.
  - **Info Saldo**: Kartu utama menampilkan nama dompet dan jumlah saldo saat ini dalam format mata uang.
  - **Riwayat Transaksi**: Menampilkan daftar transaksi yang terkait dengan dompet ini menggunakan `FlatList`. Saat ini, daftar ini masih menggunakan data dummy.
    **Logika**:
  - Menggunakan `useLocalSearchParams` untuk mendapatkan `id` dompet dari parameter rute.
  - **(TODO)**: Logika untuk mengambil data dompet asli dan riwayat transaksinya dari database berdasarkan `id` perlu diimplementasikan. Saat ini masih menggunakan data statis (`wallet` dan `dummyTransactions`).
  - Tombol Edit mengarahkan pengguna ke halaman `form/form-dompet` sambil membawa `id` dompet yang akan diedit.

- #### `halaman/detail/detail-paket/[id].tsx`

  **Tujuan**: Menampilkan rincian lengkap dari sebuah paket layanan.
  **Fitur**:
  - **Header Kustom**: Header dengan tombol kembali dan tombol edit.
  - **Informasi Paket**: Menampilkan semua detail penting dari sebuah paket dalam kartu-kartu yang terpisah: - Nama Paket - Kecepatan - Durasi (dalam hari) - Harga langganan (Biaya).
    **Logika**:
  - Menerima `id` paket dari rute dinamis.
  - Menggunakan `useEffect` untuk mengambil data lengkap paket dari database SQLite menggunakan query `SELECT * FROM paket WHERE id = ?`.
  - Menampilkan `ActivityIndicator` selama proses pengambilan data.
  - Jika tidak ada paket yang ditemukan, sebuah pesan akan ditampilkan.

- #### `halaman/detail/detail-transaksi/[id].tsx`

  **Tujuan**: Menampilkan semua informasi terkait satu transaksi spesifik.
  **Fitur**:
  - **Header Lengkap**: Termasuk tombol Kembali, Edit, dan Hapus.
  - **Kartu Nominal**: Menampilkan jumlah transaksi secara besar dengan warna yang berbeda (hijau untuk pemasukan, merah untuk pengeluaran).
  - **Informasi Rinci**: Menyajikan semua detail dalam beberapa bagian:
    - **Informasi Utama**: Deskripsi, Tanggal, Kategori, dan Dompet yang digunakan.
    - **Data Pelanggan**: Jika transaksi tertaut dengan pelanggan, nama pelanggan dan paket WiFi akan ditampilkan.
    - **Catatan**: Menampilkan catatan tambahan jika ada.
  - **Aksi Hapus**: Tombol hapus akan memunculkan dialog konfirmasi `Alert` sebelum benar-benar menghapus data dari database.
    **Logika**:
  - Mengambil `id` dari `useLocalSearchParams`.
  - Menggunakan fungsi `operasiTransaksi(db).ambilBerdasarkanId(id)` untuk mendapatkan data transaksi yang lengkap (termasuk join dengan tabel lain).
  - Menangani proses hapus dengan memanggil `operasiTransaksi(db).hapusById(id)` dan kemudian kembali ke halaman sebelumnya.

- #### `halaman/detail/pelanggan/[id].tsx`

  **Tujuan**: Menampilkan profil lengkap dari seorang pelanggan yang terdaftar (non-aktif).
  **Fitur**:
  - **Kartu Profil**: Menampilkan avatar, nama lengkap, dan status "Pelanggan Terdaftar".
  - **Informasi Kontak**: Menampilkan alamat lengkap dan nomor telepon pelanggan.
  - **Aksi Cepat**: Terdapat tombol untuk langsung melakukan panggilan telepon (`tel:`) atau mengirim pesan via WhatsApp (`https://wa.me/`) menggunakan nomor yang terdaftar.
    **Logika**:
  - Mengambil `id` pelanggan dari rute.
  - Menggunakan `operasiPelanggan(db).ambilPelangganBerdasarkanId(id)` untuk mendapatkan data dari database.
  - Menggunakan `Linking.openURL` untuk membuka aplikasi telepon atau WhatsApp.
  - Tampilan dirancang dengan kartu-kartu yang jelas untuk memisahkan informasi profil dan kontak.

- #### `halaman/detail/pelanggan-aktif/[id].tsx`

  **Tujuan**: Menampilkan detail spesifik dari seorang pelanggan yang sedang dalam masa langganan aktif.
  **Fitur**:
  - **Info Dasar**: Kartu menampilkan nama dan alamat pelanggan.
  - **Status Langganan**: Kartu khusus untuk menampilkan status langganan (misalnya, "Aktif", "Akan Berakhir") dengan badge berwarna, sisa masa aktif, dan tanggal berakhir.
  - **Info Paket & Kontak**: Kartu ketiga merinci paket yang digunakan, harga paket, nomor HP, dan tanggal mulai berlangganan.
    **Logika**:
  - Mengambil `id` dari rute.
  - Menggunakan `operasiPelangganAktif(db).ambilDetailPelangganAktifById(id)` yang melakukan join beberapa tabel untuk mendapatkan semua informasi yang dibutuhkan dalam satu query.
  - Menggunakan _custom hook_ `getStatusPelanggan` untuk mendapatkan logika status (teks, warna, sisa hari) yang konsisten dengan bagian lain aplikasi.
  - Komponen `DetailRow` digunakan untuk menampilkan pasangan label dan nilai secara konsisten.

- #### `halaman/form/*.tsx`
  Komponen yang berisi elemen-elemen formulir (`TextInput`, `Button`, dll.), state untuk mengelola input pengguna, dan logika validasi serta pengiriman data ke database.

- #### `halaman/form/form-pelanggan-aktif-halaman.tsx`

   **Tujuan**: Menyediakan antarmuka untuk mengaktifkan langganan baru bagi pelanggan. Halaman ini adalah implementasi dari rute `app/form/form-pelanggan-aktif`.
   **Fitur**:
   - **Pemilihan Pelanggan**: Dropdown untuk memilih pelanggan dari daftar yang sudah ada.
   - **Pemilihan Paket**: Dropdown untuk memilih paket langganan yang akan diaplikasikan.
   - **Pemilihan Dompet**: Dropdown untuk memilih dompet tempat pembayaran akan dicatat.
   - **Informasi Otomatis**: Tanggal mulai diatur ke hari ini, dan tanggal berakhir dihitung secara otomatis berdasarkan durasi paket yang dipilih.
   - **Integrasi Transaksi**: Setelah langganan berhasil disimpan, secara otomatis membuat catatan transaksi `pemasukan` baru.
   **Logika**:
   - `useEffect` digunakan untuk mengambil daftar pelanggan, paket, dan dompet dari database saat komponen dimuat.
   - `handleSimpan` adalah fungsi inti yang melakukan beberapa langkah:
     1. Validasi input untuk memastikan pelanggan, paket, dan dompet telah dipilih.
     2. Menyimpan data pelanggan aktif baru ke tabel `pelanggan_aktif` menggunakan `operasiPelangganAktif`.
     3. Membuat entri transaksi baru di tabel `transaksi` menggunakan `operasiTransaksi.create()`. Data transaksi ini mencakup deskripsi, jumlah, tipe, tanggal, jam, serta ID dari pelanggan, paket, dan dompet yang terkait. Kolom `id_kategori` sengaja dibiarkan kosong (`null`) untuk transaksi pendaftaran ini.
   - Menampilkan `Alert` untuk memberi tahu pengguna tentang keberhasilan atau kegagalan operasi.

## components

Direktori ini berisi komponen UI yang dapat digunakan kembali di seluruh aplikasi.

- #### `components/komponen-react/input-teks.tsx`

  Komponen `TextInput` kustom. Ini mungkin sudah termasuk `View` sebagai pembungkus, `Text` untuk label, dan logika untuk menampilkan pesan error, memastikan input teks yang konsisten di seluruh aplikasi.

- #### `components/tombol/*.tsx`

  Serangkaian komponen tombol (Simpan, Hapus, Edit, Tambah) yang sudah memiliki gaya, ikon, dan fungsionalitas yang telah ditentukan sebelumnya. Menggunakan ini memastikan semua tombol aksi di aplikasi terlihat dan berfungsi sama.

- #### `components/header/*.tsx`
  Komponen untuk header aplikasi. `header-biasa.tsx` mungkin untuk header standar dengan judul, sedangkan `header-custom.tsx` bisa menerima prop tambahan untuk tombol aksi kustom.

## database

Semua yang berhubungan dengan persistensi data ada di sini.

- #### `database/sqlite.ts`

  File ini adalah inti dari lapisan database. Ia bertanggung jawab untuk:
  1. Membuka atau membuat file database SQLite.
  2. Menjalankan query `CREATE TABLE` untuk mendefinisikan skema database saat aplikasi pertama kali dijalankan.
  3. Mengekspor objek koneksi database (`db`) untuk digunakan oleh file operasi.

- #### `database/operasi/*.ts`

  Setiap file di sini (misal: `pelanggan-operasi.ts`) mengelola query SQL untuk satu tabel tertentu. Ini mengimplementasikan fungsi-fungsi seperti `tambahPelanggan()`, `ambilSemuaPelanggan()`, `updatePelanggan()`. Pola ini (dikenal sebagai Data Access Object atau Repository) mengisolasi logika SQL dari bagian lain aplikasi.

- #### `database/data-default.ts`
  Berisi data awal (seed data) yang dimasukkan ke database saat pertama kali dibuat. Berguna untuk mengisi data penting seperti kategori default atau dompet awal.

## hooks

Custom React Hooks untuk logika yang dapat digunakan kembali.

- #### `hooks/use-theme-color.ts`

  Hook kustom yang memudahkan pengambilan warna dari tema yang sedang aktif (terang atau gelap). Ia mengambil nama warna (misalnya, `text`, `background`) dan mengembalikan kode warna yang sesuai.

- #### `hooks/transaksi/use-statistik-keuangan.ts`

  Hook yang kompleks untuk melakukan kalkulasi keuangan. Ia mungkin mengambil semua transaksi, lalu menghitung total pendapatan, pengeluaran, dan saldo akhir untuk ditampilkan di halaman statistik.

- #### `hooks/hitung-tanggal-berakhir.ts`
  Enkapsulasi logika bisnis untuk menghitung tanggal kedaluwarsa. Diberikan tanggal mulai dan durasi (misalnya, 30 hari), hook ini akan mengembalikan tanggal berakhir yang akurat.

## styles

- #### `styles/statistik-styles.ts`
  File `StyleSheet` khusus untuk halaman Statistik. Mengumpulkan semua gaya untuk halaman yang kompleks di satu tempat membuatnya lebih mudah dikelola dan menghindari duplikasi.

## utils

Kumpulan fungsi pembantu murni (pure functions) yang tidak terkait dengan UI.

- #### `utils/format/*.ts`
  Berisi fungsi-fungsi untuk memformat data agar dapat dibaca oleh manusia. `format-angka.ts` mengubah angka menjadi format mata uang, `format-tanggal.ts` mengubah objek `Date` menjadi string seperti "17 Agustus 2024".

## File Konfigurasi (Root)

- #### `tsconfig.json`

  Konfigurasi untuk compiler TypeScript. Ini memberi tahu compiler cara memeriksa tipe data dalam kode Anda dan ke versi JavaScript apa kode tersebut harus dikompilasi.

- #### `eslint.config.js`

  Konfigurasi untuk ESLint, sebuah _linter_ yang menganalisis kode Anda untuk menemukan masalah, baik itu potensi error maupun pelanggaran gaya penulisan kode, untuk menjaga konsistensi.

- #### `package.json`
  "Kartu identitas" proyek Node.js Anda. Ini mencantumkan semua dependensi (pustaka pihak ketiga) yang dibutuhkan proyek dan mendefinisikan skrip yang dapat dijalankan (misalnya, `npm start`).

## Dokumentasi File Proyek

Berikut adalah daftar lengkap semua file dalam proyek, dikelompokkan berdasarkan folder.

### File Root

- `GEMINI.md`: Konfigurasi untuk asisten AI.
- `README.md`: Dokumentasi utama proyek.
- `app.json`: Konfigurasi utama aplikasi Expo.
- `eslint.config.js`: Konfigurasi untuk linter ESLint.
- `link-github.md`: Informasi terkait repositori GitHub.
- `package-lock.json`: Merekam versi pasti dari setiap dependensi.
- `package.json`: Daftar dependensi proyek dan skrip.
- `tsconfig.json`: Konfigurasi untuk compiler TypeScript.

### `.idx`

- `.idx/dev.nix`: Konfigurasi lingkungan pengembangan untuk IDX.

### `.vscode`

- `.vscode/extensions.json`: Rekomendasi ekstensi VS Code untuk proyek.
- `.vscode/settings.json`: Pengaturan VS Code spesifik untuk proyek.
- `.vscode/snippet.code-snippets`: Kumpulan snippet kode kustom.

### `app`

- `app/_layout.tsx`: Layout utama untuk seluruh aplikasi.
- **`app/(tabs)`**
  - `app/(tabs)/_layout.tsx`: Layout untuk navigasi tab.
  - `app/(tabs)/dompet.tsx`: Entry point untuk halaman dompet.
  - `app/(tabs)/index.tsx`: Entry point untuk halaman utama (dashboard).
  - `app/(tabs)/kategori.tsx`: Entry point untuk halaman kategori.
  - `app/(tabs)/paket.tsx`: Entry point untuk halaman paket.
  - `app/(tabs)/pelanggan.tsx`: Entry point untuk halaman pelanggan.
  - `app/(tabs)/statistik.tsx`: Entry point untuk halaman statistik.
  - `app/(tabs)/transaksi.tsx`: Entry point untuk halaman transaksi.
- **`app/detail`**
  - `app/detail/_layout.tsx`: Layout untuk halaman detail.
  - `app/detail/detail-dompet/[id].tsx`: Rute dinamis untuk detail dompet.
  - `app/detail/detail-paket/[id].tsx`: Rute dinamis untuk detail paket.
  - `app/detail/detail-pelanggan/[id].tsx`: Rute dinamis untuk detail pelanggan.
  - `app/detail/detail-pelanggan-aktif/[id].tsx`: Rute dinamis untuk detail pelanggan aktif.
  - `app/detail/detail-transaksi/[id].tsx`: Rute dinamis untuk detail transaksi.
- **`app/form`**
  - `app/form/_layout.tsx`: Layout untuk halaman form.
  - `app/form/form-dompet.tsx`: Rute untuk form tambah/edit dompet.
  - `app/form/form-kategori.tsx`: Rute untuk form tambah/edit kategori.
  - `app/form/form-paket.tsx`: Rute untuk form tambah/edit paket.
  - `app/form/form-pelanggan.tsx`: Rute untuk form tambah/edit pelanggan.
  - `app/form/form-pelanggan-aktif.tsx`: Rute untuk form data pelanggan aktif.
  - `app/form/form-transaksi.tsx`: Rute untuk form tambah/edit transaksi.

### `assets`

- **`assets/images`**
  - `assets/images/android-icon-background.png`
  - `assets/images/android-icon-foreground.png`
  - `assets/images/android-icon-monochrome.png`
  - `assets/images/favicon.png`
  - `assets/images/icon.png`
  - `assets/images/splash-icon.png`

### `components`

- `components/external-link.tsx`: Komponen untuk link eksternal.
- `components/haptic-tab.tsx`: Komponen tab dengan haptic feedback.
- `components/hello-wave.tsx`: Komponen animasi gelombang sapaan.
- `components/themed-text.tsx`: Komponen `Text` yang mendukung tema.
- `components/themed-view.tsx`: Komponen `View` yang mendukung tema.
- **`components/header`**
  - `components/header/header-biasa.tsx`: Komponen header standar.
  - `components/header/header-custom.tsx`: Komponen header kustom.
- **`components/komponen-react`**
  - `components/komponen-react/input-teks.tsx`: Komponen input teks kustom.
  - `components/komponen-react/safe-area-view-custom.tsx`: Komponen `SafeAreaView` kustom.
- **`components/modal`**
  - `components/modal/modal.tsx`: Komponen modal yang dapat digunakan kembali.
- **`components/tombol`**
  - `components/tombol/index.ts`: Ekspor semua komponen tombol.
  - `components/tombol/tombol-aksi.tsx`: Komponen untuk tombol aksi umum.
  - `components/tombol/tombol-edit.tsx`: Komponen tombol edit.
  - `components/tombol/tombol-hapus.tsx`: Komponen tombol hapus.
  - `components/tombol/tombol-kembali.tsx`: Komponen tombol kembali.
  - `components/tombol/tombol-simpan.tsx`: Komponen tombol simpan.
  - `components/tombol/tombol-tambah.tsx`: Komponen tombol tambah.
  - `components/tombol/tombol-teks.tsx`: Komponen tombol berbasis teks.
  - `components/tombol/tombol-urutkan.tsx`: Komponen tombol untuk pengurutan.
- **`components/ui`**
  - `components/ui/icon-symbol.ios.tsx`: Komponen ikon simbol untuk iOS.
  - `components/ui/icon-symbol.tsx`: Komponen ikon simbol.

### `constants`

- `constants/theme.ts`: Menyimpan konstanta warna dan tema aplikasi.

### `database`

- `database/data-default.ts`: Data default untuk inisialisasi database.
- `database/sqlite.ts`: Inisialisasi dan koneksi ke database SQLite.
- **`database/operasi`**
  - `database/operasi/dompet-operasi.ts`: Operasi CRUD untuk tabel dompet.
  - `database/operasi/kategori-operasi.ts`: Operasi CRUD untuk tabel kategori.
  - `database/operasi/paket-operasi.ts`: Operasi CRUD untuk tabel paket.
  - `database/operasi/pelanggan-aktif-operasi.ts`: Operasi CRUD untuk pelanggan aktif.
  - `database/operasi/pelanggan-operasi.ts`: Operasi CRUD untuk tabel pelanggan.
  - `database/operasi/sub-kategori-operasi.ts`: Operasi CRUD untuk sub-kategori.
  - `database/operasi/transaksi-operasi.ts`: Operasi CRUD untuk tabel transaksi.

### `halaman`

- **`halaman/(tabs)`**
  - `halaman/(tabs)/dompet-halaman.tsx`: UI dan logika untuk halaman dompet.
  - `halaman/(tabs)/index.tsx`: UI dan logika untuk halaman utama.
  - `halaman/(tabs)/kategori.tsx`: UI dan logika untuk halaman kategori.
  - `halaman/(tabs)/paket.tsx`: UI dan logika untuk halaman paket.
  - `halaman/(tabs)/pelanggan.tsx`: UI dan logika untuk halaman pelanggan.
  - `halaman/(tabs)/statistik.tsx`: UI dan logika untuk halaman statistik.
  - `halaman/(tabs)/transaksi.tsx`: UI dan logika untuk halaman transaksi.
- **`halaman/detail`**
  - `halaman/detail/detail-dompet-halaman.tsx`: UI untuk detail dompet.
  - `halaman/detail/detail-paket/[id].tsx`: UI untuk detail paket.
  - `halaman/detail/detail-transaksi/[id].tsx`: UI untuk detail transaksi.
  - `halaman/detail/pelanggan/[id].tsx`: UI untuk detail pelanggan.
  - `halaman/detail/pelanggan-aktif/[id].tsx`: UI untuk detail pelanggan aktif.
- **`halaman/form`**
  - `halaman/form/_layout.tsx`: Layout untuk halaman form.
  - `halaman/form/form-dompet-halaman.tsx`: Form untuk menambah/mengedit dompet.
  - `halaman/form/form-kategori.tsx`: Form untuk menambah/mengedit kategori.
  - `halaman/form/form-paket.tsx`: Form untuk menambah/mengedit paket.
  - `halaman/form/form-pelanggan.tsx`: Form untuk menambah/mengedit pelanggan.
  - `halaman/form/form-pelanggan-aktif-halaman.tsx`: Form untuk menambah/mengedit pelanggan aktif.
  - `halaman/form/form-transaksi.tsx`: Form untuk menambah/mengedit transaksi.

### `hooks`

- `hooks/ambil-tanggal-dan-waktu-terbaru.ts`: Hook untuk mendapatkan tanggal dan waktu terkini.
- `hooks/hitung-tanggal-berakhir.ts`: Hook untuk menghitung tanggal berakhir.
- `hooks/status-pelanggan.ts`: Hook untuk menentukan status pelanggan.
- `hooks/use-color-scheme.ts`: Hook untuk mendapatkan skema warna (dark/light).
- `hooks/use-color-scheme.web.ts`: Versi web dari `use-color-scheme`.
- `hooks/use-theme-color.ts`: Hook untuk mendapatkan warna dari tema saat ini.
- **`hooks/transaksi`**
  - `hooks/transaksi/grup-transkasi.ts`: Hook untuk mengelompokkan transaksi.
  - `hooks/transaksi/use-statistik-keuangan.ts`: Hook untuk kalkulasi statistik keuangan.

### `scripts`

- `scripts/reset-project.js`: Skrip untuk mereset proyek ke keadaan awal.

### `styles`

- `styles/statistik-styles.ts`: StyleSheet khusus untuk halaman statistik.

### `utils`

- **`utils/format`**
  - `utils/format/format-angka.ts`: Fungsi untuk memformat angka (misal: mata uang).
  - `utils/format/format-jam.ts`: Fungsi untuk memformat waktu.
  - `utils/format/format-no-hp.ts`: Fungsi untuk memformat nomor telepon.
  - `utils/format/format-tanggal.ts`: Fungsi untuk memformat tanggal.
