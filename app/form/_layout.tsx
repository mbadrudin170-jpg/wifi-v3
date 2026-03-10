// Path: app/form/_layout.tsx
import { Stack } from 'expo-router';

/**
 * FUNGSI:
 * Mengatur tata letak navigasi untuk semua layar dalam direktori (form).
 * Komponen ini menggunakan Stack Navigator dari Expo Router untuk mendefinisikan
 * setiap layar form. Opsi `headerShown: false` digunakan untuk menyembunyikan
 * header default agar bisa diganti dengan header kustom jika diperlukan.
 */
export default function LayoutForm() {
  return (
    <Stack>
      <Stack.Screen name='form-paket' options={{ headerShown: false }} />
      <Stack.Screen name='form-pelanggan' options={{ headerShown: false }} />
      {/* PERBAIKAN: Menambahkan layar form lainnya ke dalam stack navigasi */}
      <Stack.Screen name='form-pelanggan-aktif' options={{ headerShown: false }} />
      <Stack.Screen name='form-transaksi' options={{ headerShown: false }} />
    </Stack>
  );
}
