// Path: ~/wifi-v3/hooks/ambil-tanggal-dan-waktu-terbaru.ts
import { useState, useEffect } from 'react';

export const useDateTime = () => {
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format tanggal: DD/MM/YYYY
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      setTanggal(`${day}/${month}/${year}`);
      
      // Format jam: HH:MM
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setJam(`${hours}:${minutes}`);
    };

    updateDateTime();
    
    // Update setiap menit (opsional)
    const interval = setInterval(updateDateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { tanggal, jam };
};