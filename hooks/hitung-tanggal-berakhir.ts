// Path: hooks/hitung-tanggal-berakhir.ts

/**
 * FUNGSI:
 * Menghitung tanggal berakhir secara akurat berdasarkan tanggal mulai,
 * durasi, dan unit durasi (Hari atau Bulan).
 * Fungsi ini adalah pusat logika untuk menentukan masa aktif langganan.
 *
 * @param tanggalMulai - String tanggal ISO ('YYYY-MM-DD').
 * @param durasi - Angka durasi (misal: 30 untuk hari, atau 1 untuk bulan).
 * @param unit - Satuan durasi ('Hari' atau 'Bulan').
 * @returns String tanggal ISO ('YYYY-MM-DD') dari tanggal berakhir yang telah dihitung.
 */
export const hitungTanggalBerakhir = (
  tanggalMulai: string,
  durasi: number,
  unit: 'Hari' | 'Bulan' | string // Mengizinkan string umum untuk fleksibilitas
): string => {
  // Membuat objek Date dari tanggal mulai untuk perhitungan.
  const tanggalBerakhir = new Date(tanggalMulai);

  // Logika Cerdas: Memeriksa unit durasi untuk menentukan metode perhitungan.
  if (unit === 'Bulan') {
    // Jika unitnya 'Bulan', kita hanya memajukan bulannya.
    // Metode setMonth secara otomatis menangani pergantian tahun jika melewati Desember.
    // Ini adalah perhitungan yang akurat dan sesuai dengan logika bisnis bulanan.
    tanggalBerakhir.setMonth(tanggalBerakhir.getMonth() + durasi);
  } else {
    // Jika unitnya 'Hari' (atau unit lain sebagai default), kita majukan harinya.
    // Ini digunakan untuk paket harian atau paket yang durasinya dikonversi dari jam.
    tanggalBerakhir.setDate(tanggalBerakhir.getDate() + durasi);
  }

  // Mengembalikan tanggal dalam format string 'YYYY-MM-DD' agar konsisten
  // dengan format yang disimpan di database dan digunakan di seluruh aplikasi.
  return tanggalBerakhir.toISOString().split('T')[0];
};
