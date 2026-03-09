// Path: app/form/form-paket.tsx
import HeaderCustom from '@/components/header-custom';
import InputTeks from '@/components/komponen-react/input-teks';
import SafeAreaViewCustom from '@/components/komponen-react/safe-area-view-custom';
import { ThemedText } from '@/components/themed-text';
import { TombolKembali, TombolSimpan } from '@/components/tombol';
import { operasiPaket } from '@/database/operasi/paket-operasi';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

export default function HalamanFormPaket() {
  const router = useRouter();
  const db = useSQLiteContext();
  const paketRepo = operasiPaket(db);

  // State untuk setiap input
  const [nama, setNama] = useState('');
  const [durasi, setDurasi] = useState('');
  const [harga, setHarga] = useState('');
  const [kecepatan, setKecepatan] = useState('');

  const handleSimpan = async () => {
    // Validasi input tidak boleh kosong
    if (!nama || !durasi || !harga || !kecepatan) {
      Alert.alert('Error', 'Semua kolom harus diisi.');
      return;
    }

    try {
      // Panggil fungsi tambahPaket dari repositori paket
      await paketRepo.tambahPaket({
        nama: nama,
        durasi: parseInt(durasi, 10), // Konversi string ke angka
        harga: parseInt(harga, 10), // Konversi string ke angka
        kecepatan: parseInt(kecepatan, 10), // Konversi string ke angka
      });

      Alert.alert('Sukses', 'Paket berhasil disimpan!');
      router.back(); // Kembali ke halaman sebelumnya setelah berhasil
    } catch (error) {
      console.error('Gagal menyimpan paket:', error);
      Alert.alert('Error', 'Gagal menyimpan paket. Silakan coba lagi.');
    }
  };

  return (
    <SafeAreaViewCustom>
      <HeaderCustom leftAccessory={<TombolKembali style={{ padding: 4 }} />}>
        <ThemedText type='title'>Form Paket</ThemedText>
      </HeaderCustom>
      <ScrollView contentContainerStyle={styles.areaScroll}>
        <InputTeks
          label='Nama Paket'
          placeholder='Masukkan nama paket'
          value={nama}
          onChangeText={setNama}
        />
        <InputTeks
          label='Durasi (hari)'
          placeholder='Contoh: 30'
          keyboardType='numeric'
          value={durasi}
          onChangeText={setDurasi}
        />
        <InputTeks
          label='Harga'
          placeholder='Contoh: 150000'
          keyboardType='numeric'
          value={harga}
          onChangeText={setHarga}
        />
        <InputTeks
          label='Kecepatan (Mbps)'
          placeholder='Contoh: 10'
          keyboardType='numeric'
          value={kecepatan}
          onChangeText={setKecepatan}
        />
        <TombolSimpan teks='Simpan' onPress={handleSimpan} />
      </ScrollView>
    </SafeAreaViewCustom>
  );
}

const styles = StyleSheet.create({
  areaScroll: {
    gap: 16,
    padding: 16,
  },
});
