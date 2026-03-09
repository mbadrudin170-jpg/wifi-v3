// Path: ~/wifi-v3/utils/format/format-tanggal.ts

/**
 * Mengubah string tanggal ISO atau objek Date menjadi format angka (DD/MM/YYYY).
 * Fungsi ini aman untuk input null atau undefined.
 * @param isoString String tanggal dalam format ISO ('YYYY-MM-DDTHH:mm:ss.sssZ') atau objek Date.
 * @returns String tanggal yang sudah diformat (misal: '25/12/2023') atau string kosong jika input tidak valid.
 */
export const formatTanggalAngka = (isoString: string | Date | null | undefined): string => {
  if (!isoString) {
    return '';
  }

  try {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date value');
    }

    // Gunakan 'numeric' untuk menghasilkan tahun 4-digit (misal: 2023 bukan 23)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Gagal memformat tanggal angka:', isoString, error);
    return '';
  }
};

/**
 * Mengubah string tanggal ISO atau objek Date menjadi format teks panjang (DD MMMM YYYY).
 * Fungsi ini aman untuk input null atau undefined.
 * @param isoString String tanggal dalam format ISO ('YYYY-MM-DDTHH:mm:ss.sssZ') atau objek Date.
 * @returns String tanggal yang sudah diformat (misal: '25 Desember 2023') atau string kosong jika input tidak valid.
 */
export const formatTanggal = (isoString: string | Date | null | undefined): string => {
  if (!isoString) {
    return '';
  }

  try {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date value');
    }

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Gagal memformat tanggal:', isoString, error);
    return '';
  }
};
