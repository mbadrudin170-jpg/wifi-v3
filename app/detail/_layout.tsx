// Path: ~/wifi-v3/app/detail/_layout.tsx
// File layout untuk grup folder detail.
// Penjelasan: Mengatur header dan transisi untuk semua layar detail agar seragam.

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';

export default function DetailLayout() {
  const colorScheme = useColorScheme();
  const activeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <Stack
      screenOptions={{
        // Pengaturan Header Global untuk folder detail
        headerStyle: {
          backgroundColor: activeColors.background,
        },
        headerTintColor: activeColors.tint,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerShadowVisible: false, // Tampilan bersih tanpa garis bawah tebal
        headerBackTitle: 'Kembali',

        // Animasi transisi profesional
        animation: 'slide_from_right',

        // Agar status bar menyesuaikan dengan tema saat berada di layar detail
        contentStyle: {
          backgroundColor: activeColors.background,
        },
      }}
    >
      {/* PERBAIKAN: Menghapus ekstensi .tsx dari nama rute */}
      <Stack.Screen
        name='detail-transaksi/[id]'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='detail-paket/[id]'
        options={{
          title: 'Informasi Paket',
        }}
      />
      <Stack.Screen
        name='detail-pelanggan/[id]'
        options={{
          title: 'Profil Pelanggan',
        }}
      />
      <Stack.Screen
        name='detail-pelanggan-aktif/[id]'
        options={{
          title: 'Status Berlangganan',
        }}
      />{' '}
      <Stack.Screen
        name='detail-dompet/[id]'
        options={{
          title: 'Status Berlangganan',
        }}
      />
    </Stack>
  );
}
