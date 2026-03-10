// Path: ~/wifi-v3/database/operasi/pelanggan-operasi.ts

import * as SQLite from 'expo-sqlite';

export interface Pelanggan {
  id: number;
  nama: string;
  no_hp: string;
  mac_adress: string;
  alamat: string;
}

export type PelangganBaru = Omit<Pelanggan, 'id'>;

export const operasiPelanggan = (db: SQLite.SQLiteDatabase) => ({
  // Ambil Semua
  async ambilSemuaPelanggan(): Promise<Pelanggan[]> {
    return await db.getAllAsync<Pelanggan>('SELECT * FROM pelanggan ORDER BY nama');
  },

  // Ambil by ID
  async ambilPelangganBerdasarkanId(id: number): Promise<Pelanggan | null> {
    return await db.getFirstAsync<Pelanggan>('SELECT * FROM pelanggan WHERE id = ?', id);
  },

  // TAMBAH (DIPERBAIKI: 4 Kolom = 4 Tanda Tanya)
  async tambahPelanggan(pelanggan: PelangganBaru): Promise<SQLite.SQLiteRunResult> {
    console.log('[DB Operation] Menambah pelanggan:', pelanggan.nama);
    return await db.runAsync(
      'INSERT INTO pelanggan (nama, no_hp, mac_adress, alamat) VALUES (?, ?, ?, ?)',
      pelanggan.nama || '',
      pelanggan.no_hp,
      pelanggan.mac_adress,
      pelanggan.alamat || ''
    );
  },

  // PERBARUI (DIPERBAIKI: Hapus koma sebelum WHERE)
  async perbaruiPelanggan(id: number, pelanggan: PelangganBaru): Promise<SQLite.SQLiteRunResult> {
    return await db.runAsync(
      'UPDATE pelanggan SET nama = ?, no_hp = ?, mac_adress = ?, alamat = ? WHERE id = ?',
      pelanggan.nama,
      pelanggan.no_hp,
      pelanggan.mac_adress,
      pelanggan.alamat,
      id
    );
  },

  // HAPUS
  async hapusPelanggan(id: number): Promise<SQLite.SQLiteRunResult> {
    return await db.runAsync('DELETE FROM pelanggan WHERE id = ?', id);
  },
});
