// path: database/operasi/transaksi-operasi.ts

import * as SQLite from 'expo-sqlite';

export interface Transaksi {
  id: number;
  deskripsi: string;
  id_dompet: number | null;
  id_kategori: number | null;
  id_pelanggan: number | null;
  id_paket: number | null;
  jumlah: number;
  tipe: 'pemasukan' | 'pengeluaran';
  catatan: string | null;
  tanggal: string;
  dibuat: string;
}

export interface TransaksiLengkap extends Transaksi {
  nama_pelanggan: string | null;
  nama_paket: string | null;
  harga_paket: number | null;
  nama_kategori?: string; // Tambahan untuk detail
  nama_dompet?: string; // Tambahan untuk detail
}

export const operasiTransaksi = {
  ambilSemuaLengkap: async (db: SQLite.SQLiteDatabase): Promise<TransaksiLengkap[]> => {
    const query = `
      SELECT 
        t.*,
        p.nama as nama_pelanggan,
        pkt.nama as nama_paket,
        pkt.harga as harga_paket
      FROM transaksi t
      LEFT JOIN pelanggan p ON t.id_pelanggan = p.id
      LEFT JOIN paket pkt ON t.id_paket = pkt.id
      ORDER BY t.tanggal DESC;
    `;
    try {
      return await db.getAllAsync<TransaksiLengkap>(query);
    } catch (error) {
      console.error('Gagal mengambil data transaksi lengkap:', error);
      throw error;
    }
  },

  // FUNGSI BARU UNTUK DETAIL
  ambilBerdasarkanId: async (
    db: SQLite.SQLiteDatabase,
    id: number | string
  ): Promise<TransaksiLengkap | null> => {
    const query = `
      SELECT 
        t.*, 
        p.nama as nama_pelanggan, 
        pkt.nama as nama_paket, 
        pkt.harga as harga_paket,
        k.nama as nama_kategori,
        d.nama as nama_dompet
      FROM transaksi t
      LEFT JOIN pelanggan p ON t.id_pelanggan = p.id
      LEFT JOIN paket pkt ON t.id_paket = pkt.id
      LEFT JOIN kategori k ON t.id_kategori = k.id
      LEFT JOIN dompet d ON t.id_dompet = d.id
      WHERE t.id = ?;
    `;
    try {
      // Kita paksa konversi ke string untuk keamanan SQLite
      return await db.getFirstAsync<TransaksiLengkap>(query, [String(id)]);
    } catch (error) {
      console.error('Gagal mengambil detail transaksi:', error);
      throw error;
    }
  },

  hitungTotalTransaksi: async (db: SQLite.SQLiteDatabase): Promise<number> => {
    try {
      const result = await db.getFirstAsync<{ total: number }>(
        'SELECT COUNT(*) as total FROM transaksi'
      );
      return result?.total ?? 0;
    } catch (error) {
      console.error('Gagal menghitung total transaksi:', error);
      throw error;
    }
  },
};
