// Path: ~/wifi-v3/utils/format-no-hp.ts

/**
 * Memformat nomor HP menjadi kelompok 4 digit dipisahkan dengan strip (-)
 * Contoh: 081234567890 -> 0812-3456-7890
 */
export const formatNoHp = (text: string): string => {
  // Hanya ambil angka saja
  const cleaned = text.replace(/\D/g, '');

  // Gunakan regex untuk membagi setiap 4 karakter
  const match = cleaned.match(/.{1,4}/g);

  return match ? match.join('-') : cleaned;
};

/**
 * Menghilangkan tanda strip untuk keperluan simpan ke database
 * Contoh: 0812-3456-7890 -> 081234567890
 */
export const bersihkanNoHp = (text: string): string => {
  return text.replace(/-/g, '');
};
