// path: database/operasi/pelanggan-aktif-operasi.ts

import { type SQLiteDatabase } from 'expo-sqlite';

export interface PelangganAktifDetail {
  id: number;
  pelanggan_id: number;
  paket_id: number | null;
  nama: string;
  alamat: string;
  no_hp: string | null;
  nama_paket: string | null;
  harga_paket: number | null;
  tanggal_mulai: string | null;
  tanggal_berakhir: string | null;
}

export const operasiPelangganAktif = (db: SQLiteDatabase) => ({
  async hitungTotalPelangganAktif(): Promise<number> {
    // ================== PERBAIKAN DI SINI ==================
    // Query ini tidak lagi mencari kolom 'status', tapi menghitung berdasarkan tanggal.
    const query = `SELECT COUNT(*) FROM pelanggan_aktif WHERE date(tanggal_berakhir) >= date('now', 'localtime')`;
    const result = await db.getFirstAsync<{ 'COUNT(*)': number }>(query);
    // =======================================================
    return result ? result['COUNT(*)'] : 0;
  },

  async ambilSemuaPelangganAktifDetail(): Promise<PelangganAktifDetail[]> {
    const query = `
      SELECT
        pa.id,
        pa.pelanggan_id,
        pa.paket_id,
        p.nama,
        p.alamat,
        p.no_hp,
        pkt.nama AS nama_paket,
        pkt.harga AS harga_paket,
        pa.tanggal_mulai,
        pa.tanggal_berakhir
      FROM pelanggan_aktif AS pa
      JOIN pelanggan AS p ON pa.pelanggan_id = p.id
      LEFT JOIN paket AS pkt ON pa.paket_id = pkt.id
      ORDER BY p.nama ASC;
    `;
    return await db.getAllAsync<PelangganAktifDetail>(query);
  },
  async ambilSemuaRiwayatPelanggan(): Promise<PelangganAktifDetail[]> {
    const query = `
      SELECT
        pa.id,
        pa.pelanggan_id,
        pa.paket_id,
        p.nama,
        p.alamat,
        p.no_hp,
        pkt.nama AS nama_paket,
        pkt.harga AS harga_paket,
        pa.tanggal_mulai,
        pa.tanggal_berakhir,
        -- Status tetap dihitung agar UI bisa menampilkan mana yang aktif/tidak
        CASE WHEN date(pa.tanggal_berakhir) >= date('now', 'localtime') THEN 1 ELSE 0 END AS status
      FROM pelanggan_aktif AS pa
      JOIN pelanggan AS p ON pa.pelanggan_id = p.id
      LEFT JOIN paket AS pkt ON pa.paket_id = pkt.id
      ORDER BY pa.tanggal_berakhir DESC; -- Diurutkan berdasarkan yang paling baru berakhir
    `;
    return await db.getAllAsync<PelangganAktifDetail>(query);
  },
  async ambilDetailPelangganAktifById(id: number): Promise<PelangganAktifDetail | null> {
    const query = `
      SELECT
        pa.id,
        pa.pelanggan_id,
        pa.paket_id,
        p.nama,
        p.alamat,
        p.no_hp,
        pkt.nama AS nama_paket,
        pkt.harga AS harga_paket,
        pa.tanggal_mulai,
        pa.tanggal_berakhir,
        CASE WHEN date(pa.tanggal_berakhir) >= date('now', 'localtime') THEN 1 ELSE 0 END AS status
      FROM pelanggan_aktif AS pa
      JOIN pelanggan AS p ON pa.pelanggan_id = p.id
      LEFT JOIN paket AS pkt ON pa.paket_id = pkt.id
      WHERE pa.id = ?; -- Mencari berdasarkan ID dari pelanggan_aktif
    `;
    const result = await db.getFirstAsync<PelangganAktifDetail>(query, id);
    return result ?? null;
  },
});