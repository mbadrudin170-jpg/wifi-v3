// path: app/detail/_layout.tsx
// File layout untuk grup folder detail.
// Penjelasan: Mengatur header dan transisi untuk semua layar detail agar seragam.

import { Stack } from 'expo-router';

export default function DetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* PERBAIKAN: Menghapus ekstensi .tsx dari nama rute */}
      <Stack.Screen name='detail-transaksi/[id]' />
      <Stack.Screen name='detail-paket/[id]' />
      <Stack.Screen name='detail-pelanggan/[id]' />
      <Stack.Screen name='detail-pelanggan-aktif/[id]' />
      <Stack.Screen name='detail-dompet/[id]' />
    </Stack>
  );
}
