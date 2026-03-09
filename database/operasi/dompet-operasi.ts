import * as SQLite from 'expo-sqlite';

export interface Dompet {
  id: number;
  nama: string;
  saldo: number;
  mata_uang: string;
}

export const operasiDompet = (db: SQLite.SQLiteDatabase) => ({
  async getAll() {
    return await db.getAllAsync<Dompet>('SELECT * FROM dompet ORDER BY nama ASC');
  },
  async getById(id: number) {
    return await db.getFirstAsync<Dompet>('SELECT * FROM dompet WHERE id = ?', [id]);
  },
  async create(nama: string, saldo: number = 0, mata_uang: string = 'IDR') {
    return await db.runAsync(
      'INSERT INTO dompet (nama, saldo, mata_uang) VALUES (?, ?, ?)',
      [nama, saldo, mata_uang]
    );
  },
  async update(id: number, nama: string, saldo: number) {
    return await db.runAsync(
      'UPDATE dompet SET nama = ?, saldo = ? WHERE id = ?',
      [nama, saldo, id]
    );
  },
  async delete(id: number) {
    return await db.runAsync('DELETE FROM dompet WHERE id = ?', [id]);
  }
});