// Path: ~/wifi-v3/halaman/(tabs)/index-halaman.tsx

import HeaderCustom from '@/components/header/header-custom';
import { TombolTambah } from '@/components/tombol';
import TombolHapus from '@/components/tombol/tombol-hapus';
import TombolUrutkan from '@/components/tombol/tombol-urutkan';
import {
  operasiPelangganAktif,
  type PelangganAktifDetail,
} from '@/database/operasi/pelanggan-aktif-operasi';
import { getStatusPelanggan } from '@/hooks/status-pelanggan';
import { formatTanggalAngka } from '@/utils/format/format-tanggal';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * @file index.tsx
 * @description Dashboard utama aplikasi untuk menampilkan daftar pelanggan aktif dengan fitur pengurutan.
 * @section Pelanggan (UI)
 */

// UI: RenderItem Pelanggan (Optimalisasi performa di luar komponen utama)
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

export default function HalamanHome() {
  const router = useRouter();
  const db = useSQLiteContext();
  const isMountedRef = useRef(true);

  // Logic: State Management
  const [totalAktif, setTotalAktif] = useState(0);
  const [pelangganList, setPelangganList] = useState<PelangganAktifDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSortModalVisible, setSortModalVisible] = useState(false);

  type TipeUrut = 'nama-asc' | 'nama-desc' | 'jatuh-tempo-asc' | 'mulai-desc';

  // Logic: Life Cycle Management
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Logic: Muat data dari database
  const muatData = useCallback(async () => {
    try {
      if (isMountedRef.current) setLoading(true);
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

  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [muatData])
  );
  // Logic: Fitur Pengurutan
  const handleUrutkan = (tipe: TipeUrut) => {
    const daftarUrut = [...pelangganList];

    switch (tipe) {
      case 'nama-asc':
        daftarUrut.sort((a, b) => a.nama.localeCompare(b.nama));
        break;
      case 'nama-desc':
        daftarUrut.sort((a, b) => b.nama.localeCompare(a.nama));
        break;
      case 'jatuh-tempo-asc':
        daftarUrut.sort((a, b) => {
          const dateA = a.tanggal_berakhir ? new Date(a.tanggal_berakhir).getTime() : Infinity;
          const dateB = b.tanggal_berakhir ? new Date(b.tanggal_berakhir).getTime() : Infinity;
          return dateA - dateB;
        });
        break;
      case 'mulai-desc':
        // Catatan: Implementasi ini membutuhkan field created_at di masa mendatang
        break;
    }

    setPelangganList(daftarUrut);
    tutupModalUrutkan();
  };

  const handleHapusSemuaPelanggan = () => {
    Alert.alert('Hapus Semua', 'Apakah Anda yakin ingin menghapus semua pelanggan aktif?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            const operasi = operasiPelangganAktif(db);
            await operasi.hapusSemuaPelangganAktif();
            await muatData();
          } catch (error) {
            console.error('Gagal menghapus pelanggan:', error);
          }
        },
      },
    ]);
  };

  const bukaModalUrutkan = () => setSortModalVisible(true);
  const tutupModalUrutkan = () => setSortModalVisible(false);

  const handleDetailPelangganAktif = (id: number) => {
    router.push({
      pathname: '/detail/detail-pelanggan-aktif/[id]',
      params: { id: id.toString() },
    });
  };

  return (
    <SafeAreaView style={Styles.container}>
      {/* UI: Section Header */}
      <HeaderCustom
        rightAccessory={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TombolUrutkan onPress={bukaModalUrutkan} />
            <TombolHapus onPress={handleHapusSemuaPelanggan} />
          </View>
        }
      >
        <View style={{ width: '100%' }}>
          <Text style={Styles.headerContentTitle}>Dashboard</Text>
          <Text style={Styles.headerContentSubtitle}>Pelanggan Aktif: {totalAktif}</Text>
        </View>
      </HeaderCustom>

      {/* UI: Section Content List */}
      {loading && pelangganList.length === 0 ? (
        <View style={Styles.emptyContainer}>
          <ActivityIndicator size='large' color='#2E7D32' />
          <Text>Mengambil Data Pelanggan...</Text>
        </View>
      ) : (
        <FlatList
          data={pelangganList}
          renderItem={({ item }) => (
            <RenderItemPelanggan item={item} onNavigate={handleDetailPelangganAktif} />
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

      {/* UI: Floating Action Button */}
      <TombolTambah onPress={() => router.push('/form/form-pelanggan-aktif')} />

      {/* UI: Modal Urutkan */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={isSortModalVisible}
        onRequestClose={tutupModalUrutkan}
      >
        <Pressable style={Styles.modalOverlay} onPress={tutupModalUrutkan}>
          <View style={Styles.modalContent}>
            <Text style={Styles.modalTitle}>Urutkan Berdasarkan</Text>

            <Pressable style={Styles.sortOption} onPress={() => handleUrutkan('nama-asc')}>
              <Text style={Styles.sortOptionText}>Nama (A-Z)</Text>
            </Pressable>

            <Pressable style={Styles.sortOption} onPress={() => handleUrutkan('nama-desc')}>
              <Text style={Styles.sortOptionText}>Nama (Z-A)</Text>
            </Pressable>

            <Pressable style={Styles.sortOption} onPress={() => handleUrutkan('jatuh-tempo-asc')}>
              <Text style={Styles.sortOptionText}>Jatuh Tempo Terdekat</Text>
            </Pressable>

            <Pressable
              style={[Styles.sortOption, { borderBottomWidth: 0 }]}
              onPress={() => handleUrutkan('mulai-desc')}
            >
              <Text style={Styles.sortOptionText}>Tanggal Mulai Terbaru</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const Styles = StyleSheet.create({
  // 1. Container Utama
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },

  // 2. Header Content Styles
  headerContentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  headerContentSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    textAlign: 'left',
  },

  // 3. List & Layout Konten
  listContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#37474F',
    marginBottom: 15,
  },

  // 4. Item Card Pelanggan Aktif
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
  itemDetailContainer: {
    flex: 1,
  },
  itemNama: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#263238',
  },
  tanggalBerakhir: {
    fontSize: 13,
    color: '#D32F2F',
    marginTop: 4,
  },
  itemAksiContainer: {
    alignItems: 'flex-end',
    gap: 2,
  },

  // 5. Loading & Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#78909C',
  },

  // 6. Modal Pengurutan Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  sortOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#37474F',
    textAlign: 'center',
  },
});
