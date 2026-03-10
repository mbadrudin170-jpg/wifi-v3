// Path: hooks/status-pelanggan.ts

/**
 * Menganalisis tanggal berakhir untuk menentukan status berlangganan dan sisa hari.
 * Fungsi ini membandingkan tanggal berakhir dengan tanggal hari ini.
 *
 * @param tanggalBerakhir - String tanggal ISO ('YYYY-MM-DDTHH:mm:ss.sssZ') dari database.
 * @returns Object yang berisi:
 *   - `sisaHari`: Jumlah hari tersisa (angka).
 *   - `statusTeks`: Status utama pelanggan (misal: "Aktif", "Tidak Aktif").
 *   - `detailTeks`: Penjelasan detail sisa hari (misal: "Sisa 5 hari").
 *   - `warna`: Kode warna hex untuk representasi visual di UI.
 */
export const getStatusPelanggan = (tanggalBerakhir: string | null | undefined) => {
  // Kondisi default jika pelanggan tidak memiliki tanggal berakhir (misal: belum ada paket)
  if (!tanggalBerakhir) {
    return {
      sisaHari: 0,
      statusTeks: 'Tidak Ada Paket',
      detailTeks: '-',
      warna: '#A0AEC0', // Abu-abu netral
    };
  }

  // Parse tanggal dengan aman
  const tglBerakhir = new Date(tanggalBerakhir);

  // Periksa apakah tanggal valid setelah parsing
  if (isNaN(tglBerakhir.getTime())) {
    console.error('Format tanggal tidak valid:', tanggalBerakhir);
    return {
      sisaHari: 0,
      statusTeks: 'Tanggal Error',
      detailTeks: 'Format tanggal salah',
      warna: '#E53E3E', // Merah untuk error
    };
  }

  const hariIni = new Date();

  // Reset waktu untuk perbandingan tanggal yang akurat
  hariIni.setHours(0, 0, 0, 0);
  tglBerakhir.setHours(0, 0, 0, 0);

  const selisihWaktu = tglBerakhir.getTime() - hariIni.getTime();
  const sisaHari = Math.ceil(selisihWaktu / (1000 * 3600 * 24));

  // Logika status berdasarkan sisa hari
  if (sisaHari > 7) {
    return {
      sisaHari,
      statusTeks: 'Aktif',
      detailTeks: `Sisa ${sisaHari} hari`,
      warna: '#38A169', // Hijau
    };
  } else if (sisaHari > 0) {
    return {
      sisaHari,
      statusTeks: 'Segera Berakhir',
      detailTeks: `Sisa ${sisaHari} hari`,
      warna: '#DD6B20', // Oranye
    };
  } else if (sisaHari === 0) {
    return {
      sisaHari,
      statusTeks: 'Berakhir Hari Ini',
      detailTeks: 'Berakhir hari ini',
      warna: '#E53E3E', // Merah
    };
  } else {
    return {
      sisaHari,
      statusTeks: 'Tidak Aktif',
      detailTeks: `Berakhir ${Math.abs(sisaHari)} hari lalu`,
      warna: '#718096', // Abu-abu gelap
    };
  }
};
