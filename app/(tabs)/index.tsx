// path: app/(tabs)/index.tsx
// File Screen Utama (Dashboard) untuk menampilkan daftar pelanggan aktif.
// Perubahan: Menggunakan useSQLiteContext untuk menyuntikkan db ke fungsi operasi.

import {
  operasiPelangganAktif,
  type PelangganAktifDetail,
} from '@/database/operasi/pelanggan-aktif-operasi';
// import { migrateDbIfNeeded } from '@/database/sqlite'; // Hapus ini, tidak butuh di Screen
import { getStatusPelanggan } from '@/hooks/status-pelanggan';
import { formatTanggalAngka } from '@/utils/format/format-tanggal';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite'; // Impor Hook Context
import { useCallback, useEffect, useRef, useState } from 'react'; // Tambah useCallback untuk performa
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RenderItemPelanggan = ({
  item,
  onNavigate,
}: {
  item: PelangganAktifDetail;
  onNavigate: (id: number) => void;
}) => {
  const statusInfo = getStatusPelanggan(item.tanggal_berakhir);
  return (
    <Pressable style={Styles.itemContainer} onPress={() => onNavigate(item.id)}>
      <View style={Styles.itemDetailContainer}>
        <Text style={Styles.itemNama}>{item.nama}</Text>
        <Text style={Styles.tanggalBerakhir}>{formatTanggalAngka(item.tanggal_berakhir)}</Text>
      </View>
      <View style={Styles.itemAksiContainer}>
        <Text style={{ color: statusInfo.warna, fontWeight: 'bold' }}>{statusInfo.statusTeks}</Text>
        <Text style={{ fontSize: 12 }}>{statusInfo.detailTeks}</Text>
        <Text style={{ fontSize: 12, color: '#666' }}>{item.nama_paket}</Text>
      </View>
    </Pressable>
  );
};

export default function Home() {
  const router = useRouter();
  const db = useSQLiteContext(); // Ambil instance database yang sudah dimigrasi oleh Provider
  const [totalAktif, setTotalAktif] = useState(0);
  const [pelangganList, setPelangganList] = useState<PelangganAktifDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fungsi muatData dipisahkan agar bisa dipanggil ulang (refresh)
  const muatData = useCallback(async () => {
    try {
      if (isMountedRef.current) setLoading(true);
      // SUNTIKKAN 'db' ke dalam operasi, bukan fungsi migrasi
      const operasi = operasiPelangganAktif(db);

      const [total, list] = await Promise.all([
        operasi.hitungTotalPelangganAktif(),
        operasi.ambilSemuaPelangganAktifDetail(),
      ]);

      if (!isMountedRef.current) return;
      setTotalAktif(total);
      setPelangganList(list);
    } catch (error) {
      console.error('Gagal mengambil data pelanggan:', error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    muatData();
  }, [muatData]);

  const handleNavigasiNavigasi = (id: number) => {
    router.push(`/detail/pelanggan-aktif/${id}`);
  };

  return (
    <SafeAreaView style={Styles.container}>
      {/* Header */}
      <View style={Styles.header}>
        <View style={Styles.judul}>
          <Text style={Styles.teksJudul}>Dashboard</Text>
          <Text style={Styles.teksSubjudul}>Pelanggan Aktif: {totalAktif}</Text>
        </View>
        <View style={Styles.containerTombolHeader}>
          <Pressable style={Styles.tombolHeader}>
            <MaterialIcons name='add-circle' size={32} color='#2E7D32' />
          </Pressable>
          <Pressable style={Styles.tombolHeader} onPress={muatData}>
            <MaterialIcons name='refresh' size={32} color='#0277BD' />
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View style={Styles.emptyContainer}>
          <ActivityIndicator size='large' color='#2E7D32' />
          <Text>Mengambil Data Keuangan...</Text>
        </View>
      ) : (
        <FlatList
          data={pelangganList}
          renderItem={({ item }) => (
            <RenderItemPelanggan item={item} onNavigate={handleNavigasiNavigasi} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={Styles.listContentContainer}
          ListHeaderComponent={() => <Text style={Styles.listHeader}>Daftar Pelanggan</Text>}
          ListEmptyComponent={() => (
            <View style={Styles.emptyContainer}>
              <MaterialIcons name='info-outline' size={48} color='#B0BEC5' />
              <Text style={Styles.emptyText}>Belum ada pelanggan aktif.</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const Styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f5f7' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  judul: { flexDirection: 'column' },
  teksJudul: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a' },
  teksSubjudul: { fontSize: 16, color: '#666666', marginTop: 4 },
  containerTombolHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tombolHeader: { padding: 6 },
  listContentContainer: { paddingHorizontal: 20, paddingVertical: 15 },
  listHeader: { fontSize: 18, fontWeight: 'bold', color: '#37474F', marginBottom: 15 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemDetailContainer: { flex: 1 },
  itemNama: { fontSize: 16, fontWeight: 'bold', color: '#263238' },
  tanggalBerakhir: { fontSize: 13, color: '#D32F2F', marginTop: 4 },
  itemAksiContainer: { alignItems: 'flex-end', gap: 2 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 10, fontSize: 16, color: '#78909C' },
});
