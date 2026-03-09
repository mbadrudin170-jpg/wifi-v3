// Path: ~/wifi-v3/utils/format/format-jam.ts

/**
 * Mengubah string tanggal ISO atau objek Date menjadi format jam yang mudah dibaca (HH:mm).
 * Fungsi ini aman untuk input null atau undefined.
 * @param isoString String tanggal dalam format ISO ('YYYY-MM-DDTHH:mm:ss.sssZ') atau objek Date.
 * @returns String jam yang sudah diformat (misal: '14:30') atau string kosong jika input tidak valid.
 */
export const formatJam = (isoString: string | Date | null | undefined): string => {
  // Jika input kosong (null, undefined, atau string kosong), kembalikan string kosong.
  if (!isoString) {
    return '';
  }

  try {
    const date = new Date(isoString);

    // Periksa apakah hasil konversi tanggal valid atau tidak.
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date value');
    }

    // Gunakan toLocaleTimeString dengan locale 'id-ID' untuk mendapatkan format jam 24H.
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Menggunakan format 24 jam
    });
  } catch (error) {
    console.error('Gagal memformat jam:', isoString, error);
    // Kembalikan string kosong jika terjadi kesalahan saat parsing.
    return '';
  }
};
