// path: halaman/form/form-pelanggan-aktif-halaman.tsx
// File ini berfungsi untuk membuat form tambah pelanggan aktif baru.
// Pengguna dapat memilih pelanggan, paket, dan dompet.
// Setelah disimpan, data langganan dan transaksi pemasukan akan tercatat otomatis.

import HeaderCustom from '@/components/header/header-custom';
import SafeAreaViewCustom from '@/components/komponen-react/safe-area-view-custom';
import { TombolKembali } from '@/components/tombol';
import TombolSimpan from '@/components/tombol/tombol-simpan';
import { Colors } from '@/constants/theme';
import { Dompet, operasiDompet } from '@/database/operasi/dompet-operasi';
import { operasiPaket, Paket } from '@/database/operasi/paket-operasi';
import { operasiPelangganAktif } from '@/database/operasi/pelanggan-aktif-operasi';
import { operasiPelanggan, Pelanggan } from '@/database/operasi/pelanggan-operasi';
import { operasiTransaksi } from '@/database/operasi/transaksi-operasi';
import { ambilWaktuTerkini } from '@/hooks/ambil-tanggal-dan-waktu-terbaru';
import { hitungTanggalBerakhir } from '@/hooks/hitung-tanggal-berakhir';
import { formatTanggalAngka } from '@/utils/format/format-tanggal';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function FormPelangganAktifHalaman() {
  const db = useSQLiteContext();

  const [daftarPelanggan, setDaftarPelanggan] = useState<Pelanggan[]>([]);
  const [daftarPaket, setDaftarPaket] = useState<Paket[]>([]);
  const [daftarDompet, setDaftarDompet] = useState<Dompet[]>([]);
  const [idPelanggan, setIdPelanggan] = useState<number | null>(null);
  const [idPaket, setIdPaket] = useState<number | null>(null);
  const [idDompet, setIdDompet] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const tanggalMulai = new Date();

  useEffect(() => {
    const ambilData = async () => {
      try {
        const pelanggan = await operasiPelanggan(db).ambilSemuaPelanggan();
        const paket = await operasiPaket(db).ambilSemuaPaket();
        const dompet = await operasiDompet(db).ambilSemuaDompet();
        setDaftarPelanggan(pelanggan);
        setDaftarPaket(paket);
        setDaftarDompet(dompet);
      } catch (error) {
        console.error('Gagal memuat data:', error);
        Toast.show({
          type: 'error',
          text1: 'Error Memuat Data',
          text2: 'Gagal memuat data dari database.',
        });
      }
    };
    ambilData();
  }, [db]);

  const handleSimpan = async () => {
    if (!idPelanggan || !idPaket || !idDompet) {
      Toast.show({
        type: 'error',
        text1: 'Input Tidak Lengkap',
        text2: 'Harap pilih pelanggan, paket, dan dompet.',
      });
      return;
    }

    setLoading(true);

    try {
      const paketTerpilih = daftarPaket.find((p) => p.id === idPaket);
      if (!paketTerpilih) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Paket yang dipilih tidak valid.',
        });
        setLoading(false);
        return;
      }

      const tanggalMulaiISO = tanggalMulai.toISOString().split('T')[0];
      const tanggalBerakhirISO = hitungTanggalBerakhir(
        tanggalMulaiISO,
        paketTerpilih.durasi,
        paketTerpilih.unit_durasi
      );

      // 1. Tambah pelanggan aktif
      await operasiPelangganAktif(db).tambahPelangganAktif(
        idPelanggan,
        idPaket,
        tanggalMulaiISO,
        tanggalBerakhirISO
      );

      // 2. Buat transaksi pemasukan baru
      await operasiTransaksi(db).create({
        deskripsi: `Pendaftaran ${paketTerpilih.nama}`,
        jumlah: paketTerpilih.harga,
        tipe: 'pemasukan',
        catatan: `Pelanggan baru untuk paket ${paketTerpilih.nama}.`,
        tanggal: tanggalMulaiISO,
        jam: ambilWaktuTerkini(),
        id_dompet: idDompet,
        id_pelanggan: idPelanggan,
        id_paket: idPaket,
      });

      Toast.show({
        type: 'success',
        text1: 'Berhasil',
        text2: 'Pelanggan berhasil diaktifkan dan transaksi tercatat.',
        onHide: () => router.back(), // Kembali setelah notifikasi hilang
      });
    } catch (error: any) {
      console.error('Gagal mengaktifkan pelanggan:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Error Simpan',
        text2: `Gagal mengaktifkan pelanggan: ${error?.message || 'Terjadi kesalahan sistem'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const paketTerpilih = idPaket ? daftarPaket.find((p) => p.id === idPaket) : null;
  let tanggalBerakhirTampilan = '--';
  if (paketTerpilih) {
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
        {/* Picker Pelanggan */}
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

        {/* Picker Paket */}
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

        {/* Picker Dompet */}
        <View style={styles.pickerSection}>
          <Text style={styles.label}>Simpan Ke Dompet</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={idDompet} onValueChange={(itemValue) => setIdDompet(itemValue)}>
              <Picker.Item label='-- Pilih Dompet --' value={null} />
              {daftarDompet.map((d) => (
                <Picker.Item key={d.id} label={d.nama} value={d.id} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Info Tanggal */}
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
      {/* Tambahkan komponen Toast di sini agar bisa muncul di atas semua elemen lain */}
      <Toast />
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
