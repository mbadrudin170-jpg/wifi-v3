// Path: ~/wifi-v3/hooks/ambil-tanggal-dan-waktu-terbaru.ts
import { useEffect, useState } from 'react';

/**
 * Mengambil tanggal dan jam terkini dan memperbaruinya setiap menit.
 * Ini adalah hook, jadi hanya bisa digunakan di dalam komponen React.
 * @returns {{ tanggal: string, jam: string }}
 */
export const useDateTime = () => {
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format tanggal: YYYY-MM-DD
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      setTanggal(`${year}-${month}-${day}`);

      // Format jam: HH:MM
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setJam(`${hours}:${minutes}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return { tanggal, jam };
};

/**
 * Fungsi utilitas untuk mendapatkan waktu saat ini dalam format string 'HH:MM'.
 * Bisa dipanggil dari mana saja.
 * @returns {string} Waktu terkini.
 */
export const ambilWaktuTerkini = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
