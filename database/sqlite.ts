// path: database/sqlite.ts
// File ini berisi skema database permanen dengan perbaikan AUTOINCREMENT.

import * as SQLite from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
  // Aktifkan fitur database standar
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(`
    -- 1. Tabel Dompet
    CREATE TABLE IF NOT EXISTS dompet (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      tipe TEXT NOT NULL,
      nama TEXT NOT NULL, 
      saldo REAL DEFAULT 0, 
      mata_uang TEXT DEFAULT 'IDR'
    );

    -- 2. Tabel Paket
    CREATE TABLE IF NOT EXISTS paket (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      nama TEXT NOT NULL, 
      harga REAL NOT NULL, 
      durasi INTEGER NOT NULL,
      unit_durasi TEXT NOT NULL DEFAULT 'Hari', 
      kecepatan INTEGER NOT NULL
    );

    -- 3. Tabel Kategori
    CREATE TABLE IF NOT EXISTS kategori (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      nama TEXT NOT NULL, 
      tipe TEXT NOT NULL, -- 'Pemasukan' atau 'Pengeluaran'
      ikon TEXT
    );

    -- Tabel Sub Kategori
    CREATE TABLE IF NOT EXISTS sub_kategori (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      nama TEXT NOT NULL,
      kategori_id INTEGER NOT NULL,
      FOREIGN KEY (kategori_id) REFERENCES kategori (id) ON DELETE CASCADE
    );

    -- 4. Tabel Pelanggan
    CREATE TABLE IF NOT EXISTS pelanggan (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      nama TEXT NOT NULL, 
      no_hp TEXT NOT NULL, 
      alamat TEXT NOT NULL, 
      mac_adress TEXT NOT NULL
    );

    -- 5. Tabel Pelanggan Aktif
    CREATE TABLE IF NOT EXISTS pelanggan_aktif (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      pelanggan_id INTEGER NOT NULL, 
      paket_id INTEGER, 
      tanggal_mulai TEXT, 
      tanggal_berakhir TEXT,
      FOREIGN KEY (pelanggan_id) REFERENCES pelanggan (id) ON DELETE CASCADE, 
      FOREIGN KEY (paket_id) REFERENCES paket (id) ON DELETE SET NULL
    );

    -- 6. Tabel Transaksi (Disempurnakan dengan AUTOINCREMENT)
    CREATE TABLE IF NOT EXISTS transaksi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deskripsi TEXT NOT NULL,
      id_dompet INTEGER,
      id_kategori INTEGER,
      id_sub_kategori INTEGER,
      id_pelanggan INTEGER,
      id_paket INTEGER,
      jumlah REAL NOT NULL,
      tipe TEXT NOT NULL,
      catatan TEXT,
      tanggal TEXT,
      jam TEXT,
      dibuat TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_dompet) REFERENCES dompet (id) ON DELETE SET NULL,
      FOREIGN KEY (id_kategori) REFERENCES kategori (id) ON DELETE SET NULL,
      FOREIGN KEY (id_sub_kategori) REFERENCES sub_kategori (id) ON DELETE SET NULL,
      FOREIGN KEY (id_pelanggan) REFERENCES pelanggan (id) ON DELETE SET NULL,
      FOREIGN KEY (id_paket) REFERENCES paket (id) ON DELETE SET NULL
    );
  `);
}