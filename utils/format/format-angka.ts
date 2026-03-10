// Path: ~/wifi-v3/utils/format/format-angka.ts// Path: ~/wifi-v3/utils/format/format-angka.ts

/**
 * Memformat angka menjadi string dengan pemisah ribuan gaya Indonesia (menggunakan titik).
 * Fungsi ini aman untuk input null, undefined, atau non-numerik.
 * @param angka Angka atau string yang akan diformat.
 * @returns String angka yang sudah diformat (misal: '1.234.567') atau '0' jika input tidak valid.
 */
export const formatAngka = (angka: number | string | null | undefined): string => {
  // Jika input kosong atau null/undefined, kembalikan '0' sebagai default.
  if (angka === null || angka === undefined || angka === '') {
    return '';
  }

  const angkaNumerik = Number(angka);

  // Periksa apakah hasil konversi adalah angka yang valid.
  if (isNaN(angkaNumerik)) {
    console.warn('Input tidak valid untuk formatAngka, dikembalikan "0":', angka);
    return '';
  }

  try {
    // Gunakan Intl.NumberFormat untuk format yang sesuai dengan locale.
    // 'id-ID' menggunakan titik sebagai pemisah ribuan.
    return new Intl.NumberFormat('id-ID').format(angkaNumerik);
  } catch (error) {
    console.error('Gagal memformat angka:', angka, error);
    // Kembalikan angka asli sebagai string jika terjadi error yang tidak terduga.
    return String(angkaNumerik);
  }
};

/**
 * Memformat angka menjadi format mata uang Rupiah (Rp).
 * @param angka Angka yang akan diformat.
 * @returns String dalam format mata uang (misal: 'Rp 1.000.000') atau 'Rp 0' jika input tidak valid.
 */
export const formatRupiah = (angka: number | string | null | undefined): string => {
  // Jika input kosong atau null/undefined, kembalikan 'Rp 0'.
  if (angka === null || angka === undefined || angka === '') {
    return 'Rp 0';
  }

  const angkaNumerik = Number(angka);

  if (isNaN(angkaNumerik)) {
    console.warn('Input tidak valid untuk formatRupiah, dikembalikan "Rp 0":', angka);
    return 'Rp 0';
  }

  try {
    // Gunakan Intl.NumberFormat dengan style 'currency'.
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0, // Tidak menampilkan angka di belakang koma
      maximumFractionDigits: 0, // Tidak menampilkan angka di belakang koma
    }).format(angkaNumerik);
  } catch (error) {
    console.error('Gagal memformat rupiah:', angka, error);
    return 'Rp 0';
  }
};
