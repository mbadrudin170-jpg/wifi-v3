// path: database/sqlite.ts
// File ini berisi skema database dan fungsi migrasi.
// Digunakan oleh: SQLiteProvider di app/_layout.tsx

import * as SQLite from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
  // ================== PERBAIKAN DI SINI (1) ==================
  // Naikkan versi database untuk memaksa migrasi.
  const DATABASE_VERSION = 2;
  // =========================================================

  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    // Jika versi sudah sesuai, tidak ada yang perlu dilakukan.
    return;
  }

  // Migrasi untuk pengguna pertama kali (versi 0)
  if (currentDbVersion === 0) {
    await db.execAsync(`
      CREATE TABLE dompet (
        id INTEGER PRIMARY KEY NOT NULL, nama TEXT NOT NULL, saldo REAL DEFAULT 0, mata_uang TEXT DEFAULT 'IDR'
      );
      CREATE TABLE paket (
        id INTEGER PRIMARY KEY NOT NULL, nama TEXT NOT NULL, harga REAL NOT NULL, durasi INTEGER NOT NULL, kecepatan INTEGER NOT NULL
      );
      CREATE TABLE kategori (
        id INTEGER PRIMARY KEY NOT NULL, nama TEXT NOT NULL, tipe TEXT NOT NULL, ikon TEXT
      );
      CREATE TABLE pelanggan (
        id INTEGER PRIMARY KEY NOT NULL, nama TEXT NOT NULL, no_hp TEXT NOT NULL, alamat TEXT NOT NULL, mac_adress TEXT NOT NULL
      );
      CREATE TABLE pelanggan_aktif (
        id INTEGER PRIMARY KEY NOT NULL, pelanggan_id INTEGER NOT NULL, paket_id INTEGER, tanggal_mulai TEXT, tanggal_berakhir TEXT,
        FOREIGN KEY (pelanggan_id) REFERENCES pelanggan (id) ON DELETE CASCADE, FOREIGN KEY (paket_id) REFERENCES paket (id) ON DELETE SET NULL
      );
    `);
  }

  // ================== PERBAIKAN DI SINI (2) ==================
  // Migrasi untuk versi < 2 (termasuk pengguna baru dari v0 dan pengguna lama dari v1)
  // Logika ini akan selalu berjalan jika versi database di bawah 2.
  if (currentDbVersion < 2) {
    await db.execAsync(`
      -- Hapus tabel transaksi yang lama (jika ada) tanpa syarat.
      DROP TABLE IF EXISTS transaksi;

      -- Buat kembali tabel transaksi dengan skema yang benar.
      CREATE TABLE transaksi (
        id INTEGER PRIMARY KEY NOT NULL,
        deskripsi TEXT NOT NULL,
        id_dompet INTEGER NOT NULL,
        id_kategori INTEGER NOT NULL,
        id_pelanggan INTEGER,
        id_paket INTEGER NOT NULL, -- Kolom ini sekarang pasti akan ada
        saldo REAL NOT NULL,
        tipe TEXT NOT NULL,
        catatan TEXT,
        tanggal DATETIME NOT NULL,
        dibuat DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_dompet) REFERENCES dompet (id) ON DELETE SET NULL,
        FOREIGN KEY (id_kategori) REFERENCES kategori (id) ON DELETE SET NULL,
        FOREIGN KEY (id_pelanggan) REFERENCES pelanggan (id) ON DELETE SET NULL,
        FOREIGN KEY (id_paket) REFERENCES paket (id) ON DELETE SET NULL
      );
    `);
  }
  // =========================================================

  // Set database ke versi terbaru setelah semua migrasi selesai.
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
