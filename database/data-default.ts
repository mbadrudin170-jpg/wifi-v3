// path: database/data-default.ts
// File ini berfungsi untuk mengisi data awal (seeding) secara otomatis.
// Penjelasan: Menerima instance 'db' dari SQLiteProvider untuk menjamin transaksi yang aman.

import { type SQLiteDatabase } from 'expo-sqlite';

export const insertDefaultData = async (db: SQLiteDatabase) => {
  await db.withTransactionAsync(async () => {
    // Koreksi: Cek tabel 'kategori' yang lebih mendasar untuk mencegah seeding parsial.
    const result = await db.getFirstAsync<{ total: number }>(
      'SELECT COUNT(*) as total FROM kategori'
    );

    if (result && result.total > 0) {
      console.log('Data default sudah ada, proses seeding dilewati.');
      return;
    }

    console.log('Memasukkan data default lengkap...');

    // === KATEGORI, SUB-KATEGORI & DOMPET ===
    console.log('Memasukkan data kategori, sub-kategori, dan dompet...');

    // Kategori
    await db.runAsync(
      "INSERT INTO kategori (nama, tipe, ikon) VALUES ('Pendapatan WiFi', 'Pemasukan', 'wifi')"
    );
    await db.runAsync(
      "INSERT INTO kategori (nama, tipe, ikon) VALUES ('Penjualan Aset', 'Pemasukan', 'archive')"
    );
    await db.runAsync(
      "INSERT INTO kategori (nama, tipe, ikon) VALUES ('Operasional', 'Pengeluaran', 'settings')"
    );
    await db.runAsync(
      "INSERT INTO kategori (nama, tipe, ikon) VALUES ('Gaji & SDM', 'Pengeluaran', 'users')"
    );

    // Ambil ID Kategori yang baru dibuat untuk relasi
    const pendapatanWifi = await db.getFirstAsync<{ id: number }>(
      "SELECT id FROM kategori WHERE nama = 'Pendapatan WiFi'"
    );
    const operasional = await db.getFirstAsync<{ id: number }>(
      "SELECT id FROM kategori WHERE nama = 'Operasional'"
    );

    if (!pendapatanWifi || !operasional) {
      console.error('Gagal mengambil ID kategori utama untuk seeding sub-kategori.');
      return;
    }

    // Sub-Kategori (BARU)
    await db.runAsync(
      "INSERT INTO sub_kategori (nama, kategori_id) VALUES ('Iuran Bulanan', ?)",
      pendapatanWifi.id
    );
    await db.runAsync(
      "INSERT INTO sub_kategori (nama, kategori_id) VALUES ('Instalasi Baru', ?)",
      pendapatanWifi.id
    );
    await db.runAsync(
      "INSERT INTO sub_kategori (nama, kategori_id) VALUES ('Upgrade Paket', ?)",
      pendapatanWifi.id
    );

    await db.runAsync(
      "INSERT INTO sub_kategori (nama, kategori_id) VALUES ('Tagihan Listrik', ?)",
      operasional.id
    );
    await db.runAsync(
      "INSERT INTO sub_kategori (nama, kategori_id) VALUES ('Pembelian Alat', ?)",
      operasional.id
    );
    await db.runAsync(
      "INSERT INTO sub_kategori (nama, kategori_id) VALUES ('Transportasi', ?)",
      operasional.id
    );
    // Dompet
    await db.runAsync("INSERT INTO dompet (nama, saldo, tipe) VALUES ('Kas Usaha', 0, 'Utama')");
    await db.runAsync("INSERT INTO dompet (nama, saldo, tipe) VALUES ('Bank', 0, 'Utama')");

    // PAKET WIFI
    console.log('Memasukkan data paket...');
    await db.runAsync(
      "INSERT INTO paket (nama, harga, durasi, kecepatan) VALUES ('Hemat 10 Mbps', 150000, 30, 10)"
    );
    await db.runAsync(
      "INSERT INTO paket (nama, harga, durasi, kecepatan) VALUES ('Keluarga 25 Mbps', 250000, 30, 25)"
    );
    await db.runAsync(
      "INSERT INTO paket (nama, harga, durasi, kecepatan) VALUES ('Cepat 50 Mbps', 400000, 30, 50)"
    );
    await db.runAsync(
      "INSERT INTO paket (nama, harga, durasi, kecepatan) VALUES ('Bisnis 100 Mbps', 750000, 30, 100)"
    );

    // PELANGGAN
    console.log('Memasukkan data pelanggan...');
    await db.runAsync(
      'INSERT INTO pelanggan (nama, alamat, no_hp, mac_adress) VALUES (?, ?, ?, ?)',
      ['Budi Santoso', 'Jl. Sudirman No. 123', '081234567890', '-']
    );
    await db.runAsync(
      'INSERT INTO pelanggan (nama, alamat, no_hp, mac_adress) VALUES (?, ?, ?, ?)',
      ['Siti Aminah', 'Jl. Gatot Subroto No. 45', '089876543210', '-']
    );
    await db.runAsync(
      'INSERT INTO pelanggan (nama, alamat, no_hp, mac_adress) VALUES (?, ?, ?, ?)',
      ['Ahmad Dahlan', 'Jl. Pahlawan No. 7', '085611223344', '-']
    );
    await db.runAsync(
      'INSERT INTO pelanggan (nama, alamat, no_hp, mac_adress) VALUES (?, ?, ?, ?)',
      ['Dewi Lestari', 'Jl. Melati No. 88', '087755667788', '-']
    );

    // AMBIL DATA MASTER UNTUK TRANSAKSI
    const dompet = await db.getFirstAsync<{ id: number }>(
      "SELECT id FROM dompet WHERE nama = 'Kas Usaha'"
    );
    const subKategoriIuran = await db.getFirstAsync<{ id: number; kategori_id: number }>(
      "SELECT id, kategori_id FROM sub_kategori WHERE nama = 'Iuran Bulanan'"
    );

    if (!dompet || !subKategoriIuran) {
      console.error('Data master (dompet, sub-kategori) untuk transaksi tidak ditemukan!');
      return; // Hentikan proses jika data master tidak ada
    }

    // JADIKAN PELANGGAN AKTIF & BUAT TRANSAKSI
    console.log('Menjadikan pelanggan aktif, memberi paket, dan membuat transaksi...');
    const semuaPelanggan = await db.getAllAsync<{ id: number; nama: string }>(
      'SELECT id, nama FROM pelanggan'
    );
    const semuaPaket = await db.getAllAsync<{
      id: number;
      durasi: number;
      harga: number;
      nama: string;
    }>('SELECT id, durasi, harga, nama FROM paket');

    for (let i = 0; i < semuaPelanggan.length; i++) {
      const pelanggan = semuaPelanggan[i];
      const paketDiberikan = semuaPaket[i % semuaPaket.length];

      const tanggalMulai = new Date();
      const tanggalBerakhir = new Date();
      tanggalBerakhir.setDate(tanggalBerakhir.getDate() + paketDiberikan.durasi);

      // 1. Jadikan Pelanggan Aktif
      await db.runAsync(
        'INSERT INTO pelanggan_aktif (pelanggan_id, paket_id, tanggal_mulai, tanggal_berakhir) VALUES (?, ?, ?, ?)',
        [pelanggan.id, paketDiberikan.id, tanggalMulai.toISOString(), tanggalBerakhir.toISOString()]
      );

      // 2. Buat Transaksi Pembayaran Awal (dengan sub-kategori)
      await db.runAsync(
        `INSERT INTO transaksi 
          (deskripsi, id_dompet, id_kategori, id_sub_kategori, id_pelanggan, id_paket, jumlah, tipe, catatan, tanggal)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, // Tambah kolom id_sub_kategori
        [
          `Iuran paket ${paketDiberikan.nama} oleh ${pelanggan.nama}`,
          dompet.id,
          subKategoriIuran.kategori_id, // -> id dari 'Pendapatan WiFi'
          subKategoriIuran.id, // -> id dari 'Iuran Bulanan'
          pelanggan.id,
          paketDiberikan.id,
          paketDiberikan.harga,
          'Pemasukan',
          'Pembayaran iuran bulanan pertama.',
          tanggalMulai.toISOString(),
        ]
      );
    }

    console.log('Data default lengkap berhasil dimasukkan!');
  });
};
