import { Stack } from 'expo-router';

export default function LayoutForm() {
  return (
    <Stack>
      <Stack.Screen name='form-paket' options={{ headerShown: false }} />
      {/* Mendaftarkan halaman form secara langsung untuk menghindari konflik */}
      <Stack.Screen name='form-pelanggan' options={{ headerShown: false }} />
    </Stack>
  );
}
