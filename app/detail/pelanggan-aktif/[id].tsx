// Path: /home/user/wifi-v3/app/detail/pelanggan-aktif/[id].tsx

import {
  operasiPelangganAktif,
  type PelangganAktifDetail,
} from '@/database/operasi/pelanggan-aktif-operasi';
import { getStatusPelanggan } from '@/hooks/status-pelanggan';
import { formatRupiah } from '@/utils/format/format-angka';
import { formatTanggalAngka } from '@/utils/format/format-tanggal';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Komponen kecil untuk membuat baris detail lebih rapi
const DetailRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

export default function DetailPelangganAktif() {
  const router = useRouter();

  const db = useSQLiteContext(); // Ambil instance database yang sudah dimigrasi oleh Provider
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pelanggan, setPelanggan] = useState<PelangganAktifDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        const data = await operasiPelangganAktif(db).ambilDetailPelangganAktifById(Number(id));
        setPelanggan(data);
      } catch (error) {
        console.error('Gagal mengambil detail pelanggan:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, db]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (!pelanggan) {
    return (
      <View style={styles.center}>
        <Text>Pelanggan tidak ditemukan.</Text>
      </View>
    );
  }

  const statusInfo = getStatusPelanggan(pelanggan.tanggal_berakhir);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Kustom */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <MaterialIcons name='arrow-back' size={24} color='black' />
        </Pressable>
        <Text style={styles.headerTitle}>Detail Pelanggan</Text>
        <Pressable>
          <MaterialIcons name='edit' size={24} color='black' />
        </Pressable>
      </View>

      {/* Konten Halaman */}
      <View style={styles.content}>
        {/* Kartu Info Dasar */}
        <View style={styles.card}>
          <Text style={styles.namaPelanggan}>{pelanggan.nama}</Text>
          <Text style={styles.alamatPelanggan}>{pelanggan.alamat}</Text>
        </View>

        {/* Kartu Status Langganan */}
        <View style={styles.card}>
          <Text style={[styles.status, { backgroundColor: statusInfo.warna }]}>
            {statusInfo.statusTeks}
          </Text>
          <DetailRow label='Sisa Masa Aktif' value={statusInfo.detailTeks} />
          <DetailRow
            label='Tanggal Berakhir'
            value={formatTanggalAngka(pelanggan.tanggal_berakhir)}
          />
        </View>

        {/* Kartu Info Paket & Kontak */}
        <View style={styles.card}>
          <DetailRow label='Paket Langganan' value={pelanggan.nama_paket} />
          <DetailRow label='Harga Paket' value={formatRupiah(pelanggan.harga_paket)} />
          <DetailRow label='Nomor HP' value={pelanggan.no_hp} />
          <DetailRow
            label='Mulai Berlangganan'
            value={formatTanggalAngka(pelanggan.tanggal_mulai)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// Ganti StyleSheet lama Anda dengan ini
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  namaPelanggan: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alamatPelanggan: {
    fontSize: 14,
    color: '#6B7280',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  label: {
    fontSize: 14,
    color: '#374151',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  status: {
    alignSelf: 'flex-start',
    color: '#fff',
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
