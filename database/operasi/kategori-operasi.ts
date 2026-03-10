// path: database/operasi/kategori-operasi.ts
import type { SQLiteDatabase } from 'expo-sqlite';

export interface Kategori {
  id: number;
  nama: string;
  tipe: 'Pemasukan' | 'Pengeluaran';
  ikon: string | null;
}

export const operasiKategori = (db: SQLiteDatabase) => ({
  async getAll() {
    return await db.getAllAsync<Kategori>('SELECT * FROM kategori ORDER BY nama ASC');
  },

  async getByType(tipe: 'Pemasukan' | 'Pengeluaran') {
    return await db.getAllAsync<Kategori>('SELECT * FROM kategori WHERE tipe = ? ORDER BY nama ASC', [
      tipe,
    ]);
  },

  async getById(id: number) {
    return await db.getFirstAsync<Kategori>('SELECT * FROM kategori WHERE id = ?', [id]);
  },

  async create(kategori: Omit<Kategori, 'id'>) {
    return await db.runAsync(
      'INSERT INTO kategori (nama, tipe, ikon) VALUES (?, ?, ?)',
      kategori.nama,
      kategori.tipe,
      kategori.ikon
    );
  },

  async update(id: number, kategori: Omit<Kategori, 'id'>) {
    return await db.runAsync(
      'UPDATE kategori SET nama = ?, tipe = ?, ikon = ? WHERE id = ?',
      kategori.nama,
      kategori.tipe,
      kategori.ikon,
      id
    );
  },

  async delete(id: number) {
    return await db.runAsync('DELETE FROM kategori WHERE id = ?', [id]);
  },
});
