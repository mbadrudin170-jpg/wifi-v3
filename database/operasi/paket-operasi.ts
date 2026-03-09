// Path: ~/wifi-v3/database/operasi/paket-operasi.ts

import { type SQLiteDatabase } from 'expo-sqlite';

export interface Paket {
  id: number;
  nama: string;
  harga: number;
  durasi: number;
  kecepatan: number;
}

export const operasiPaket = (db: SQLiteDatabase) => ({
  /**
   * Mengambil semua data paket dari database, diurutkan berdasarkan harga.
   * @returns Promise yang akan resolve dengan array berisi semua data paket.
   */
  async ambilSemuaPaket(): Promise<Paket[]> {
    const query = `SELECT * FROM paket ORDER BY harga ASC;`;
    const hasil = await db.getAllAsync<Paket>(query);
    return hasil;
  },

  /**
   * Menghitung jumlah total paket yang tersedia di database.
   * @returns Promise yang akan resolve dengan jumlah total paket.
   */
  async hitungTotalPaket(): Promise<number> {
    const query = `SELECT COUNT(id) as total FROM paket;`;
    const hasil = await db.getFirstAsync<{ total: number }>(query);
    return hasil?.total ?? 0;
  },

  /**
   * Menambahkan paket baru ke dalam database.
   * @param data Objek paket yang akan ditambahkan, tanpa properti 'id'.
   * @returns Promise yang resolve ketika operasi selesai.
   */
  async tambahPaket(data: Omit<Paket, 'id'>): Promise<void> {
    const { nama, harga, durasi, kecepatan } = data;
    const query = `INSERT INTO paket (nama, harga, durasi, kecepatan) VALUES (?, ?, ?, ?);`;
    await db.runAsync(query, [nama, harga, durasi, kecepatan]);
  },
});
