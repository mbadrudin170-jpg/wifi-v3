// path: database/operasi/sub-kategori-operasi.ts
import type { SQLiteDatabase } from 'expo-sqlite';

export interface SubKategori {
  id: number;
  nama: string;
  kategori_id: number;
}

export const operasiSubKategori = (db: SQLiteDatabase) => ({
  async getAll() {
    return await db.getAllAsync<SubKategori>('SELECT * FROM sub_kategori ORDER BY nama ASC');
  },

  async getByKategoriId(kategoriId: number) {
    return await db.getAllAsync<SubKategori>(
      'SELECT * FROM sub_kategori WHERE kategori_id = ? ORDER BY nama ASC',
      [kategoriId]
    );
  },

  async getById(id: number) {
    return await db.getFirstAsync<SubKategori>('SELECT * FROM sub_kategori WHERE id = ?', [id]);
  },

  async create(subKategori: Omit<SubKategori, 'id'>) {
    return await db.runAsync(
      'INSERT INTO sub_kategori (nama, kategori_id) VALUES (?, ?)',
      subKategori.nama,
      subKategori.kategori_id
    );
  },

  async update(id: number, subKategori: Omit<SubKategori, 'id'>) {
    return await db.runAsync(
      'UPDATE sub_kategori SET nama = ?, kategori_id = ? WHERE id = ?',
      subKategori.nama,
      subKategori.kategori_id,
      id
    );
  },

  async delete(id: number) {
    return await db.runAsync('DELETE FROM sub_kategori WHERE id = ?', [id]);
  },
});
