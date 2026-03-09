// path: database/sqlite.ts
// File ini berisi skema database permanen tanpa migrasi bertahap.
// Digunakan oleh: SQLiteProvider di app/_layout.tsx

import * as SQLite from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
  // Aktifkan fitur database standar
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // Langsung eksekusi pembuatan tabel jika belum ada (IF NOT EXISTS)
  // Ini memastikan kode tidak crash jika tabel sudah ada, tapi tetap membuatnya jika baru.
  await db.execAsync(`
    -- 1. Tabel Dompet
    CREATE TABLE IF NOT EXISTS dompet (
      id INTEGER PRIMARY KEY NOT NULL, 
      nama TEXT NOT NULL, 
      saldo REAL DEFAULT 0, 
      mata_uang TEXT DEFAULT 'IDR'
    );

    -- 2. Tabel Paket
    CREATE TABLE IF NOT EXISTS paket (
      id INTEGER PRIMARY KEY NOT NULL, 
      nama TEXT NOT NULL, 
      harga REAL NOT NULL, 
      durasi INTEGER NOT NULL, 
      kecepatan INTEGER NOT NULL
    );

    -- 3. Tabel Kategori
    CREATE TABLE IF NOT EXISTS kategori (
      id INTEGER PRIMARY KEY NOT NULL, 
      nama TEXT NOT NULL, 
      tipe TEXT NOT NULL, -- 'pemasukan' atau 'pengeluaran'
      ikon TEXT
    );

    -- 4. Tabel Pelanggan
    CREATE TABLE IF NOT EXISTS pelanggan (
      id INTEGER PRIMARY KEY NOT NULL, 
      nama TEXT NOT NULL, 
      no_hp TEXT NOT NULL, 
      alamat TEXT NOT NULL, 
      mac_adress TEXT NOT NULL
    );

    -- 5. Tabel Pelanggan Aktif
    CREATE TABLE IF NOT EXISTS pelanggan_aktif (
      id INTEGER PRIMARY KEY NOT NULL, 
      pelanggan_id INTEGER NOT NULL, 
      paket_id INTEGER, 
      tanggal_mulai TEXT, 
      tanggal_berakhir TEXT,
      FOREIGN KEY (pelanggan_id) REFERENCES pelanggan (id) ON DELETE CASCADE, 
      FOREIGN KEY (paket_id) REFERENCES paket (id) ON DELETE SET NULL
    );

    -- 6. Tabel Transaksi (Versi Final)
    CREATE TABLE IF NOT EXISTS transaksi (
      id INTEGER PRIMARY KEY NOT NULL,
      deskripsi TEXT NOT NULL,
      id_dompet INTEGER,
      id_kategori INTEGER,
      id_pelanggan INTEGER,
      id_paket INTEGER,
      jumlah REAL NOT NULL,
      tipe TEXT NOT NULL,
      catatan TEXT,
      tanggal TEXT NOT NULL,
      dibuat TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_dompet) REFERENCES dompet (id) ON DELETE SET NULL,
      FOREIGN KEY (id_kategori) REFERENCES kategori (id) ON DELETE SET NULL,
      FOREIGN KEY (id_pelanggan) REFERENCES pelanggan (id) ON DELETE SET NULL,
      FOREIGN KEY (id_paket) REFERENCES paket (id) ON DELETE SET NULL
    );
  `);
}
