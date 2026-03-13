// Path: /home/user/wifi-v3/halaman/detail/pelanggan-aktif/[id].tsx

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

// UI: Komponen baris detail (Pelayan)
const DetailRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

export default function DetailPelangganAktif() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Logic: State Management
  const [pelanggan, setPelanggan] = useState<PelangganAktifDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Logic: Memuat data detail pelanggan (Koki)
  useEffect(() => {
    if (!id) return;
    let isCancelled = false;

    const loadData = async () => {
      try {
        const data = await operasiPelangganAktif(db).ambilDetailPelangganAktifById(Number(id));
        if (!isCancelled) setPelanggan(data);
      } catch (error) {
        console.error('Gagal mengambil detail pelanggan:', error);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };
    loadData();

    return () => {
      isCancelled = true;
    };
  }, [id, db]);

  // UI: Loading State
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size='large' color='#1976D2' />
      </View>
    );
  }

  // UI: Empty/Error State
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

      {/* UI: Section Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name='arrow-back' size={24} color='black' />
        </Pressable>
        <Text style={styles.headerTitle}>Detail Pelanggan</Text>
        <Pressable style={styles.editButton}>
          <MaterialIcons name='edit' size={24} color='#1976D2' />
        </Pressable>
      </View>

      {/* UI: Section Content */}
      <View style={styles.content}>
        {/* Kartu 1: Info Dasar */}
        <View style={styles.card}>
          <Text style={styles.namaPelanggan}>{pelanggan.nama}</Text>
          <Text style={styles.alamatPelanggan}>{pelanggan.alamat}</Text>
        </View>

        {/* Kartu 2: Status Langganan */}
        <View style={styles.card}>
          <Text style={[styles.statusBadge, { backgroundColor: statusInfo.warna }]}>
            {statusInfo.statusTeks}
          </Text>
          <DetailRow label='Sisa Masa Aktif' value={statusInfo.detailTeks} />
          <DetailRow
            label='Tanggal Berakhir'
            value={formatTanggalAngka(pelanggan.tanggal_berakhir)}
          />
        </View>

        {/* Kartu 3: Info Paket & Kontak */}
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

const styles = StyleSheet.create({
  // 1. Container & Layout Utama
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },

  // 2. Header Styles
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  editButton: {
    padding: 4,
  },

  // 3. Card & Typography Dasar
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  namaPelanggan: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  alamatPelanggan: {
    fontSize: 14,
    color: '#6B7280',
  },

  // 4. Baris Detail (Row)
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 10,
  },

  // 5. Status Badge Specific
  statusBadge: {
    alignSelf: 'flex-start',
    color: '#fff',
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
    fontSize: 12,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
});
