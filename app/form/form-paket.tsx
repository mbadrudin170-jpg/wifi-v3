// path: app/form/form-paket.tsx
import HeaderCustom from '@/components/header/header-custom';
import InputTeks from '@/components/komponen-react/input-teks';
import SafeAreaViewCustom from '@/components/komponen-react/safe-area-view-custom';
import { TombolAksi, TombolKembali } from '@/components/tombol';
import { operasiPaket } from '@/database/operasi/paket-operasi';
import { formatAngka } from '@/utils/format/format-angka';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

// Tipe data untuk unit durasi agar lebih aman
type UnitDurasi = 'Jam' | 'Hari' | 'Bulan';

/**
 * FUNGSI:
 * Menyiapkan nilai durasi untuk disimpan di database.
 * Untuk 'Bulan' dan 'Hari', kita simpan nilainya apa adanya.
 * Untuk 'Jam', kita konversi ke hari untuk konsistensi.
 * @param nilai - Angka durasi yang dimasukkan pengguna.
 * @param unit - Unit durasi yang dipilih ('Jam', 'Hari', 'Bulan').
 * @returns Nilai durasi yang akan disimpan.
 */
const siapkanNilaiDurasi = (nilai: number, unit: UnitDurasi): number => {
  if (unit === 'Jam') {
    // Jam dikonversi ke hari agar konsisten dalam satuan terkecil (selain bulan)
    return Math.ceil(nilai / 24);
  }
  // Untuk 'Hari' dan 'Bulan', kita tidak melakukan konversi.
  // Nilai dan unitnya akan disimpan secara terpisah.
  return nilai;
};

/**
 * FUNGSI:
 * Halaman ini berfungsi sebagai formulir untuk menambah atau mengedit data paket internet.
 * Pengguna dapat memasukkan detail paket seperti nama, durasi, harga, dan kecepatan.
 * Data yang dimasukkan akan divalidasi dan disimpan ke dalam database.
 */
export default function HalamanFormPaket() {
  const router = useRouter();
  const db = useSQLiteContext();
  const paketRepo = operasiPaket(db);

  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [kecepatan, setKecepatan] = useState('');
  const [durasi, setDurasi] = useState('');
  const [unitDurasi, setUnitDurasi] = useState<UnitDurasi>('Hari'); // Default diubah ke 'Hari' agar lebih umum

  const refHarga = useRef<TextInput>(null);
  const refKecepatan = useRef<TextInput>(null);
  const refDurasi = useRef<TextInput>(null);

  const handleHargaChange = (text: string) => {
    const angkaMurni = text.replace(/[^0-9]/g, '');
    setHarga(angkaMurni);
  };

  const handleSimpan = async () => {
    if (!nama.trim() || !durasi.trim() || !harga.trim() || !kecepatan.trim()) {
      Alert.alert('Error', 'Semua kolom harus diisi.');
      return;
    }

    const durasiInput = parseInt(durasi, 10);
    const hargaAngka = parseInt(harga, 10);
    const kecepatanAngka = parseInt(kecepatan, 10);

    if (isNaN(durasiInput) || isNaN(hargaAngka) || isNaN(kecepatanAngka)) {
      Alert.alert('Error', 'Input durasi, harga, dan kecepatan harus berupa angka.');
      return;
    }

    // Menyiapkan nilai durasi tanpa konversi paksa ke hari
    const nilaiDurasiUntukDb = siapkanNilaiDurasi(durasiInput, unitDurasi);

    // Jika unitnya Jam, unit yang disimpan di db adalah Hari
    const unitUntukDb = unitDurasi === 'Jam' ? 'Hari' : unitDurasi;

    try {
      // PERUBAHAN: Sekarang kita juga mengirim 'unit_durasi'
      await paketRepo.tambahPaket({
        nama: nama.trim(),
        durasi: nilaiDurasiUntukDb,
        unit_durasi: unitUntukDb, // Kirim unitnya
        harga: hargaAngka,
        kecepatan: kecepatanAngka,
      });

      // Pesan sukses yang lebih umum
      Alert.alert('Sukses', `Paket "${nama.trim()}" berhasil disimpan.`);
      router.back();
    } catch (error) {
      console.error('Gagal menyimpan paket:', error);
      Alert.alert('Error', 'Gagal menyimpan paket. Silakan coba lagi.');
    }
  };

  return (
    <SafeAreaViewCustom>
      <HeaderCustom title='Form Paket' leftAccessory={<TombolKembali />} />

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.areaScroll}>
        <InputTeks
          label='Nama Paket'
          placeholder='Masukkan nama paket'
          value={nama}
          onChangeText={setNama}
          returnKeyType='next'
          onSubmitEditing={() => refHarga.current?.focus()}
        />
        <InputTeks
          ref={refHarga}
          label='Harga'
          placeholder='Contoh: 150.000'
          keyboardType='numeric'
          value={formatAngka(harga)}
          onChangeText={handleHargaChange}
          returnKeyType='next'
          onSubmitEditing={() => refKecepatan.current?.focus()}
        />
        <InputTeks
          ref={refKecepatan}
          label='Kecepatan (Mbps)'
          placeholder='Contoh: 10'
          keyboardType='numeric'
          value={kecepatan}
          onChangeText={setKecepatan}
          returnKeyType='next'
          onSubmitEditing={() => refDurasi.current?.focus()}
        />
        <InputTeks
          ref={refDurasi}
          label={`Durasi (${unitDurasi})`}
          placeholder='Contoh: 30'
          keyboardType='numeric'
          value={durasi}
          onChangeText={setDurasi}
          returnKeyType='done'
          onSubmitEditing={handleSimpan}
        />

        <View style={styles.opsiContainer}>
          <Pressable
            style={[styles.opsiTombol, unitDurasi === 'Jam' && styles.opsiTombolAktif]}
            onPress={() => setUnitDurasi('Jam')}
          >
            <Text style={[styles.opsiTeks, unitDurasi === 'Jam' && styles.opsiTeksAktif]}>Jam</Text>
          </Pressable>
          <Pressable
            style={[styles.opsiTombol, unitDurasi === 'Hari' && styles.opsiTombolAktif]}
            onPress={() => setUnitDurasi('Hari')}
          >
            <Text style={[styles.opsiTeks, unitDurasi === 'Hari' && styles.opsiTeksAktif]}>
              Hari
            </Text>
          </Pressable>
          <Pressable
            style={[styles.opsiTombol, unitDurasi === 'Bulan' && styles.opsiTombolAktif]}
            onPress={() => setUnitDurasi('Bulan')}
          >
            <Text style={[styles.opsiTeks, unitDurasi === 'Bulan' && styles.opsiTeksAktif]}>
              Bulan
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footerContainer}>
        <TombolAksi title='Simpan Paket' onPress={handleSimpan} />
      </View>
    </SafeAreaViewCustom>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  areaScroll: {
    gap: 16,
    padding: 16,
  },
  footerContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  opsiContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  opsiTombol: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opsiTombolAktif: {
    backgroundColor: '#007AFF',
  },
  opsiTeks: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  opsiTeksAktif: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
