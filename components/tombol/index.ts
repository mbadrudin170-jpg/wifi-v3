// path: components/tombol/index.ts
/**
 * File ini berfungsi sebagai "barrel" untuk semua komponen tombol.
 * Tujuannya adalah untuk menyederhanakan impor di bagian lain dari aplikasi.
 * Daripada mengimpor setiap tombol dari file masing-masing, Anda bisa mengimpor
 * semuanya dari direktori ini.
 *
 * Contoh Penggunaan:
 * import { TombolAksi, TombolKembali, TombolHapus } from '@/components/tombol';
 */

export { default as TombolAksi } from './tombol-aksi';
export { default as TombolEdit } from './tombol-edit';
export { default as TombolHapus } from './tombol-hapus';
export { default as TombolKembali } from './tombol-kembali';
export { default as TombolSimpan } from './tombol-simpan';
export { default as TombolTambah } from './tombol-tambah';
export { default as TombolTeks } from './tombol-teks';
export { default as TombolUrutkan } from './tombol-urutkan';
