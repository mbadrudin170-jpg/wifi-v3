// path: app/form/form-pelanggan-aktif.tsx
// File ini berfungsi untuk membuat form tambah pelanggan aktif baru.
// Pengguna dapat memilih pelanggan dari daftar yang sudah ada dan memilih paket
// yang akan dilanggan. Tanggal mulai diatur otomatis ke hari ini.

import HeaderCustom from '@/components/header-custom';
import SafeAreaViewCustom from '@/components/komponen-react/safe-area-view-custom';
import { TombolKembali } from '@/components/tombol';
import TombolSimpan from '@/components/tombol/tombol-simpan';
import { Colors } from '@/constants/theme';
import { operasiPaket, Paket } from '@/database/operasi/paket-operasi';
import { operasiPelangganAktif } from '@/database/operasi/pelanggan-aktif-operasi';
import { operasiPelanggan, Pelanggan } from '@/database/operasi/pelanggan-operasi';
import { hitungTanggalBerakhir } from '@/hooks/hitung-tanggal-berakhir';
import { formatTanggalAngka } from '@/utils/format/format-tanggal';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FormPelangganAktif() {
  const db = useSQLiteContext();

  const [daftarPelanggan, setDaftarPelanggan] = useState<Pelanggan[]>([]);
  const [daftarPaket, setDaftarPaket] = useState<Paket[]>([]);
  const [idPelanggan, setIdPelanggan] = useState<number | null>(null);
  const [idPaket, setIdPaket] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const tanggalMulai = new Date();

  useEffect(() => {
    const ambilData = async () => {
      try {
        const pelanggan = await operasiPelanggan(db).ambilSemuaPelanggan();
        const paket = await operasiPaket(db).ambilSemuaPaket();
        setDaftarPelanggan(pelanggan);
        setDaftarPaket(paket);
      } catch (error) {
        Alert.alert('Error', 'Gagal memuat data pelanggan atau paket.');
        console.error('Gagal memuat data:', error);
      }
    };
    ambilData();
  }, [db]);

  const handleSimpan = async () => {
    if (!idPelanggan || !idPaket) {
      Alert.alert('Input Tidak Lengkap', 'Harap pilih pelanggan dan paket terlebih dahulu.');
      return;
    }

    setLoading(true);

    try {
      const paketTerpilih = daftarPaket.find((p) => p.id === idPaket);
      if (!paketTerpilih) {
        Alert.alert('Error', 'Paket yang dipilih tidak valid.');
        setLoading(false);
        return;
      }

      const tanggalMulaiISO = tanggalMulai.toISOString().split('T')[0];

      // PERUBAHAN KUNCI: Panggil fungsi hitung dengan 3 parameter
      const tanggalBerakhirISO = hitungTanggalBerakhir(
        tanggalMulaiISO,
        paketTerpilih.durasi,
        paketTerpilih.unit_durasi // Menggunakan unit_durasi dari data paket
      );

      await operasiPelangganAktif(db).tambahPelangganAktif(
        idPelanggan,
        idPaket,
        tanggalMulaiISO,
        tanggalBerakhirISO
      );

      Alert.alert('Berhasil', 'Pelanggan berhasil diaktifkan.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error('Gagal mengaktifkan pelanggan:', error.message);
      Alert.alert(
        'Error Simpan',
        `Gagal mengaktifkan pelanggan: ${error?.message || 'Terjadi kesalahan sistem'}`
      );
    } finally {
      setLoading(false);
    }
  };

  // LOGIKA: Hitung tanggal berakhir untuk ditampilkan di UI secara real-time.
  const paketTerpilih = idPaket ? daftarPaket.find((p) => p.id === idPaket) : null;
  let tanggalBerakhirTampilan = '--';
  if (paketTerpilih) {
    // PERUBAHAN KUNCI: Gunakan logika perhitungan yang sama untuk tampilan
    const tanggalMulaiISO = tanggalMulai.toISOString().split('T')[0];
    const tanggalBerakhirISO = hitungTanggalBerakhir(
      tanggalMulaiISO,
      paketTerpilih.durasi,
      paketTerpilih.unit_durasi
    );
    tanggalBerakhirTampilan = formatTanggalAngka(tanggalBerakhirISO);
  }

  return (
    <SafeAreaViewCustom>
      <HeaderCustom title='Aktifkan Langganan' leftAccessory={<TombolKembali />} />
      <ScrollView style={styles.container}>
        <View style={styles.pickerSection}>
          <Text style={styles.label}>Pilih Pelanggan</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={idPelanggan}
              onValueChange={(itemValue) => setIdPelanggan(itemValue)}
            >
              <Picker.Item label='-- Pilih Pelanggan --' value={null} />
              {daftarPelanggan.map((p) => (
                <Picker.Item key={p.id} label={p.nama} value={p.id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.pickerSection}>
          <Text style={styles.label}>Pilih Paket</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={idPaket} onValueChange={(itemValue) => setIdPaket(itemValue)}>
              <Picker.Item label='-- Pilih Paket --' value={null} />
              {daftarPaket.map((p) => (
                <Picker.Item key={p.id} label={`${p.nama} - Rp${p.harga}`} value={p.id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.dateSection}>
          <View style={styles.dateInfoContainer}>
            <Text style={styles.label}>Tanggal Mulai Langganan</Text>
            <Text style={styles.dateText}>{formatTanggalAngka(tanggalMulai.toISOString())}</Text>
          </View>
          <View style={styles.dateInfoContainer}>
            <Text style={styles.label}>Tanggal Berakhir</Text>
            <Text style={styles.dateText}>{tanggalBerakhirTampilan}</Text>
          </View>
        </View>

        <TombolSimpan onPress={handleSimpan} disabled={loading} />
      </ScrollView>
    </SafeAreaViewCustom>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  pickerSection: { marginBottom: 20 },
  label: { fontSize: 16, color: '#333', fontWeight: '500' },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dateSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    gap: 16,
  },
  dateInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
});
