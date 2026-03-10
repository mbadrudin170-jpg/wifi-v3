// path: database/data-default.ts
// File ini berfungsi untuk mengisi data awal (seeding) secara otomatis.
// Penjelasan: Menerima instance 'db' dari SQLiteProvider untuk menjamin transaksi yang aman.

import { type SQLiteDatabase } from 'expo-sqlite';

// Tambahkan parameter 'db' agar tidak error saat dipanggil di _layout.tsx
export const insertDefaultData = async (db: SQLiteDatabase) => {
  await db.withTransactionAsync(async () => {
    const result = await db.getFirstAsync<{ total: number }>(
      'SELECT COUNT(*) as total FROM pelanggan'
    );

    if (result && result.total > 0) {
      console.log('Data default sudah ada, proses seeding dilewati.');
      return;
    }

    console.log('Memasukkan data default lengkap...');

    // KATEGORI & DOMPET
    await db.runAsync(
      "INSERT INTO kategori (nama, tipe, ikon) VALUES ('Pendapatan WiFi', 'Pemasukan', 'wifi')"
    );
    await db.runAsync(
      "INSERT INTO kategori (nama, tipe, ikon) VALUES ('Listrik & Operasional', 'Pengeluaran', 'zap')"
    );
    await db.runAsync("INSERT INTO dompet (nama, saldo) VALUES ('Kas Usaha', 0)");
    await db.runAsync("INSERT INTO dompet (nama, saldo) VALUES ('Bank', 0)");

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
    const kategori = await db.getFirstAsync<{ id: number }>(
      "SELECT id FROM kategori WHERE nama = 'Pendapatan WiFi'"
    );

    if (!dompet || !kategori) {
      console.error('Dompet atau Kategori default tidak ditemukan!');
      return; // Hentikan proses jika data master tidak ada
    }

    // JADIKAN PELANGGAN AKTIF, BERI PAKET, DAN BUAT TRANSAKSI
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

      // 2. Buat Transaksi Pembayaran Awal
      await db.runAsync(
        `INSERT INTO transaksi 
          (deskripsi, id_dompet, id_kategori, id_pelanggan, id_paket, jumlah, tipe, catatan, tanggal)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `Pembayaran paket ${paketDiberikan.nama} oleh ${pelanggan.nama}`,
          dompet.id,
          kategori.id,
          pelanggan.id,
          paketDiberikan.id,
          paketDiberikan.harga,
          'Pemasukan',
          'Pembayaran awal saat pendaftaran.',
          tanggalMulai.toISOString(),
        ]
      );
    }

    console.log('Data default lengkap berhasil dimasukkan!');
  });
};
