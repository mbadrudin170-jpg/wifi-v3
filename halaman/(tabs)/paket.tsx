// Path: /home/user/wifi-v3/halaman/(tabs)/paket.tsx

import SafeAreaViewCustom from '@/components/komponen-react/safe-area-view-custom';
import TombolTambah from '@/components/tombol/tombol-tambah';
import { operasiPaket, Paket } from '@/database/operasi/paket-operasi';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';


// UI: RenderItem Paket (Diletakkan di luar untuk performa RAM yang lebih stabil)
const RenderItemPaket = ({
  item,
  onPress,
  styles,
}: {
  item: Paket;
  onPress: (id: number) => void;
  styles: any;
}) => (
  <Pressable style={styles.card} onPress={() => onPress(item.id)}>
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>
        <MaterialIcons name='wifi' size={24} color='#1976D2' />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.namaPaket}>{item.nama}</Text>
        <Text style={styles.subText}>{item.durasi} Hari Masa Aktif</Text>
      </View>
      <View style={styles.speedBadge}>
        <Text style={styles.speedText}>{item.kecepatan} Mbps</Text>
      </View>
    </View>
    <View style={styles.cardFooter}>
      <Text style={styles.labelHarga}>Harga Paket</Text>
      <Text style={styles.hargaText}>Rp {item.harga.toLocaleString('id-ID')}</Text>
    </View>
  </Pressable>
);

export default function HalamanPaket() {
  const [totalPaket, setTotalPaket] = useState(0);
  const [daftarPaket, setDaftarPaket] = useState<Paket[]>([]);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);
  const db = useSQLiteContext();
  const router = useRouter();

  // Logic: Life Cycle Management
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Logic: Muat data dari database (Koki)
  const muatData = useCallback(async () => {
    try {
      if (isMountedRef.current) setLoading(true);
      const repo = operasiPaket(db);

      // Eksekusi paralel untuk efisiensi hardware
      const [paket, jumlah] = await Promise.all([repo.ambilSemuaPaket(), repo.hitungTotalPaket()]);

      if (!isMountedRef.current) return;
      setDaftarPaket(paket);
      setTotalPaket(jumlah);
    } catch (error) {
      console.error('Gagal mengambil data paket:', error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    muatData();
  }, [muatData]);

  // Logic: Navigasi
  const handleKeDetail = (id: number) => {
    router.push(`/detail/detail-paket/${id}`);
  };

  return (
    <SafeAreaViewCustom>
      {/* UI: Section Header */}
      <View style={styles.header}>
        <View style={styles.infoHeader}>
          <Text style={styles.titleHeader}>Manajemen Paket</Text>
          <Text style={styles.subtitleHeader}>Total Tersedia: {totalPaket} Layanan</Text>
        </View>
        <View style={styles.actionHeader}>
          <Pressable style={styles.iconBtn} onPress={muatData}>
            <MaterialIcons name='refresh' size={24} color='#1976D2' />
          </Pressable>
          <Pressable style={[styles.iconBtn, styles.btnDelete]}>
            <MaterialIcons name='delete-outline' size={24} color='#D32F2F' />
          </Pressable>
        </View>
      </View>

      {/* UI: Section Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size='large' color='#1976D2' />
        </View>
      ) : (
        <FlatList
          data={daftarPaket}
          renderItem={({ item }) => (
            <RenderItemPaket item={item} onPress={handleKeDetail} styles={styles} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialIcons name='inventory' size={48} color='#BDBDBD' />
              <Text style={styles.emptyText}>Belum ada paket wifi dibuat.</Text>
            </View>
          }
        />
      )}

      {/* UI: Floating Action Button */}
      <TombolTambah onPress={() => router.push('/form/form-paket')} />
    </SafeAreaViewCustom>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  infoHeader: {
    flex: 1,
  },
  titleHeader: {
    fontSize: 22,
    fontWeight: '800',
    color: '#212121',
    letterSpacing: -0.5,
  },
  subtitleHeader: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  actionHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    padding: 10,
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
  },
  btnDelete: {
    backgroundColor: '#FFF1F1',
  },

  // 3. List & Layout Kartu
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // 4. Detail Komponen di Dalam Kartu
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  namaPaket: {
    fontSize: 16,
    fontWeight: '700',
    color: '#263238',
  },
  subText: {
    fontSize: 12,
    color: '#90A4AE',
    marginTop: 2,
  },
  speedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  speedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  // 5. Card Footer (Harga)
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  labelHarga: {
    fontSize: 12,
    color: '#78909C',
  },
  hargaText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1976D2',
  },

  // 6. Loading & Empty State
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 12,
    color: '#9E9E9E',
    fontSize: 14,
  },
});
