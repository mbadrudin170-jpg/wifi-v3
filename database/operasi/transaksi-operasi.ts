// Path: ~/wifi-v3/database/operasi/transaksi-operasi.ts

import { type SQLiteBindValue, type SQLiteDatabase, type SQLiteRunResult } from 'expo-sqlite';

export interface Transaksi {
  id: number;
  deskripsi: string;
  id_dompet: number | null;
  id_kategori: number | null;
  id_sub_kategori: number | null;
  id_pelanggan: number | null;
  id_paket: number | null;
  jumlah: number;
  tipe: 'pemasukan' | 'pengeluaran';
  catatan: string | null;
  tanggal: string | null;
  jam: string | null;
  dibuat: string;
}

export type TransaksiBaru = Omit<Transaksi, 'id' | 'dibuat'>;

export interface TransaksiLengkap extends Transaksi {
  nama_dompet: string | null;
  nama_kategori: string | null;
  nama_sub_kategori: string | null;
  nama_pelanggan: string | null;
  nama_paket: string | null;
  harga_paket: number | null;
}

export const operasiTransaksi = (db: SQLiteDatabase) => ({
  async create(transaksi: Partial<TransaksiBaru>): Promise<SQLiteRunResult> {
    const query = `
      INSERT INTO transaksi (
        deskripsi, jumlah, tipe, catatan, tanggal, jam,
        id_kategori, id_sub_kategori, id_dompet, id_pelanggan, id_paket
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const params: SQLiteBindValue[] = [
      transaksi.deskripsi ?? null,
      transaksi.jumlah ?? null,
      transaksi.tipe ?? null,
      transaksi.catatan ?? null,
      transaksi.tanggal ?? null,
      transaksi.jam ?? null,
      transaksi.id_kategori ?? null,
      transaksi.id_sub_kategori ?? null,
      transaksi.id_dompet ?? null,
      transaksi.id_pelanggan ?? null,
      transaksi.id_paket ?? null,
    ];

    try {
      return await db.runAsync(query, params);
    } catch (error) {
      console.error('Gagal membuat transaksi baru:', error);
      throw error;
    }
  },

  async update(id: number, transaksi: Partial<TransaksiBaru>): Promise<SQLiteRunResult> {
    const query = `
      UPDATE transaksi SET
        deskripsi = ?, jumlah = ?, tipe = ?, catatan = ?, tanggal = ?, jam = ?,
        id_kategori = ?, id_sub_kategori = ?, id_dompet = ?, id_pelanggan = ?, id_paket = ?
      WHERE id = ?;
    `;

    const params: SQLiteBindValue[] = [
      transaksi.deskripsi ?? null,
      transaksi.jumlah ?? null,
      transaksi.tipe ?? null,
      transaksi.catatan ?? null,
      transaksi.tanggal ?? null,
      transaksi.jam ?? null,
      transaksi.id_kategori ?? null,
      transaksi.id_sub_kategori ?? null,
      transaksi.id_dompet ?? null,
      transaksi.id_pelanggan ?? null,
      transaksi.id_paket ?? null,
      id,
    ];

    try {
      return await db.runAsync(query, params);
    } catch (error) {
      console.error(`Gagal memperbarui transaksi dengan id: ${id}`, error);
      throw error;
    }
  },

  async getAllByDompetId(dompetId: number): Promise<Transaksi[]> {
    const query = `
      SELECT * 
      FROM transaksi 
      WHERE id_dompet = ? 
      ORDER BY tanggal DESC, id DESC;
    `;
    try {
      return await db.getAllAsync<Transaksi>(query, [dompetId]);
    } catch (error) {
      console.error(`Gagal mengambil transaksi untuk dompet id: ${dompetId}`, error);
      throw error;
    }
  },

  async ambilSemuaLengkap(limit?: number): Promise<TransaksiLengkap[]> {
    const query = `
      SELECT
        t.*,
        d.nama as nama_dompet, 
        k.nama as nama_kategori,
        sk.nama as nama_sub_kategori,
        p.nama as nama_pelanggan,
        pk.nama as nama_paket,
        pk.harga as harga_paket
      FROM transaksi t
      LEFT JOIN dompet d ON t.id_dompet = d.id
      LEFT JOIN kategori k ON t.id_kategori = k.id
      LEFT JOIN sub_kategori sk ON t.id_sub_kategori = sk.id
      LEFT JOIN pelanggan p ON t.id_pelanggan = p.id
      LEFT JOIN paket pk ON t.id_paket = pk.id
      ORDER BY t.tanggal DESC, t.id DESC
      ${limit ? 'LIMIT ?' : ''}
    `;

    try {
      const params = limit ? [limit] : [];
      return await db.getAllAsync<TransaksiLengkap>(query, params);
    } catch (error) {
      console.error('Gagal mengambil data transaksi lengkap:', error);
      throw error;
    }
  },

  async ambilBerdasarkanId(id: number | string): Promise<TransaksiLengkap | null> {
    const query = `
      SELECT 
        t.*, 
        p.nama as nama_pelanggan, 
        pk.nama as nama_paket, 
        pk.harga as harga_paket,
        k.nama as nama_kategori,
        sk.nama as nama_sub_kategori,
        d.nama as nama_dompet
      FROM transaksi t
      LEFT JOIN pelanggan p ON t.id_pelanggan = p.id
      LEFT JOIN paket pk ON t.id_paket = pk.id
      LEFT JOIN kategori k ON t.id_kategori = k.id
      LEFT JOIN sub_kategori sk ON t.id_sub_kategori = sk.id
      LEFT JOIN dompet d ON t.id_dompet = d.id
      WHERE t.id = ?;
    `;

    try {
      const transaksi = await db.getFirstAsync<TransaksiLengkap>(query, [
        typeof id === 'string' ? parseInt(id, 10) : id,
      ]);
      return transaksi ?? null;
    } catch (error) {
      console.error(`Gagal mengambil detail transaksi: ${id}`, error);
      throw error;
    }
  },

  async hapusById(id: number | string): Promise<SQLiteRunResult> {
    try {
      return await db.runAsync('DELETE FROM transaksi WHERE id = ?;', [
        typeof id === 'string' ? parseInt(id, 10) : id,
      ]);
    } catch (error) {
      console.error(`Gagal menghapus transaksi id: ${id}`, error);
      throw error;
    }
  },

  async hapusSemua(): Promise<void> {
    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync('DELETE FROM transaksi;');
        await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'transaksi';");
      });
      console.log('Semua data transaksi berhasil dihapus dan auto-increment direset.');
    } catch (error) {
      console.error('Gagal menghapus semua transaksi:', error);
      throw error;
    }
  },

  async hitungTotalTransaksi(): Promise<number> {
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

  async hitungPemasukanPengeluaran(): Promise<{ pemasukan: number; pengeluaran: number }> {
    const query = `
      SELECT 
        SUM(CASE WHEN tipe = 'pemasukan' THEN jumlah ELSE 0 END) as totalPemasukan,
        SUM(CASE WHEN tipe = 'pengeluaran' THEN jumlah ELSE 0 END) as totalPengeluaran
      FROM transaksi;
    `;

    try {
      const result = await db.getFirstAsync<{
        totalPemasukan: number;
        totalPengeluaran: number;
      }>(query);

      return {
        pemasukan: result?.totalPemasukan ?? 0,
        pengeluaran: result?.totalPengeluaran ?? 0,
      };
    } catch (error) {
      console.error('Gagal menghitung total pemasukan dan pengeluaran:', error);
      throw error;
    }
  },
});
