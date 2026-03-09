// Path: ~/wifi-v3/hooks/status-pelanggan.ts// Path: ~/wifi-v3/hooks/status-pelanggan.ts

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

  try {
    const sekarang = new Date();
    const akhir = new Date(tanggalBerakhir);

    // Mengatur jam, menit, dan detik ke nol untuk memastikan perbandingan hanya berdasarkan tanggal.
    sekarang.setHours(0, 0, 0, 0);
    akhir.setHours(0, 0, 0, 0);

    // Menghitung selisih waktu dalam milidetik
    const selisihMs = akhir.getTime() - sekarang.getTime();

    // Mengonversi selisih milidetik ke hari.
    // Math.ceil digunakan agar "sisa 1.1 hari" dihitung sebagai "sisa 2 hari".
    const sisaHari = Math.ceil(selisihMs / (1000 * 60 * 60 * 24));

    // KASUS 1: Paket sudah tidak aktif (sisa hari negatif)
    if (sisaHari < 0) {
      return {
        sisaHari: 0, // Tampilkan 0, bukan angka negatif
        statusTeks: 'Tidak Aktif',
        detailTeks: `Berakhir ${Math.abs(sisaHari)} hari lalu`,
        warna: '#E53E3E', // Merah
      };
    }

    // KASUS 2: Paket berakhir tepat hari ini
    if (sisaHari === 0) {
      return {
        sisaHari,
        statusTeks: 'Berakhir Hari Ini',
        detailTeks: 'Sisa 0 hari',
        warna: '#DD6B20', // Oranye
      };
    }

    // KASUS 3: Paket akan segera berakhir (misal: 3 hari lagi atau kurang)
    if (sisaHari <= 3) {
      return {
        sisaHari,
        statusTeks: 'Segera Berakhir',
        detailTeks: `Sisa ${sisaHari} hari`,
        warna: '#D69E2E', // Kuning/Coklat muda
      };
    }

    // KASUS 4: Paket masih aktif
    return {
      sisaHari,
      statusTeks: 'Aktif',
      detailTeks: `Sisa ${sisaHari} hari`,
      warna: '#38A169', // Hijau
    };
  } catch (error) {
    console.error('Gagal menghitung status pelanggan:', error);
    return {
      sisaHari: 0,
      statusTeks: 'Error',
      detailTeks: 'Tanggal tidak valid',
      warna: '#A0AEC0',
    };
  }
};
