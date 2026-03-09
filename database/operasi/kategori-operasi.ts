// Path: ~/wifi-v3/database/operasi/kategori-operasi.ts

import * as SQLite from 'expo-sqlite';

export interface Kategori {
  id: number;
  nama: string;
  tipe: 'pemasukan' | 'pengeluaran';
  ikon: string | null;
  dibuat: string;
}

export const operasiKategori = (db: SQLite.SQLiteDatabase) => ({
  async getAll() {
    return await db.getAllAsync<Kategori>('SELECT * FROM kategori ORDER BY nama ASC');
  },
  async getBytipe(tipe: 'pemasukan' | 'pengeluaran') {
    return await db.getAllAsync<Kategori>('SELECT * FROM kategori WHERE tipe = ?', [tipe]);
  },
  async create(nama: string, tipe: 'pemasukan' | 'pengeluaran', ikon: string | null = null) {
    return await db.runAsync('INSERT INTO kategori (nama, tipe, ikon) VALUES (?, ?, ?)', [
      nama,
      tipe,
      ikon,
    ]);
  },
  async update(id: number, nama: string, tipe: 'pemasukan' | 'pengeluaran', ikon: string | null) {
    return await db.runAsync('UPDATE kategori SET nama = ?, tipe = ?, ikon = ? WHERE id = ?', [
      nama,
      tipe,
      ikon,
      id,
    ]);
  },
  async delete(id: number) {
    return await db.runAsync('DELETE FROM kategori WHERE id = ?', [id]);
  },
});
