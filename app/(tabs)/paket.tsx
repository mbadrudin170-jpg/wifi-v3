// Path: /home/user/wifi-v3/app/(tabs)/paket.tsx
// File Screen untuk manajemen Paket WiFi.
// Penjelasan: Menampilkan daftar paket dengan desain kartu profesional dan ringkasan total paket di header.

import TombolTambah from '@/components/tombol/tombol-tambah';
import { operasiPaket, Paket } from '@/database/operasi/paket-operasi';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// RenderItem diletakkan di luar untuk performa RAM Poco C40 yang lebih stabil
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
  const db = useSQLiteContext();
  const router = useRouter();
  const muatData = useCallback(async () => {
    try {
      setLoading(true);
      const repo = operasiPaket(db);

      // Mengambil data secara paralel agar lebih cepat di Poco C40/Chromebook
      const [paket, jumlah] = await Promise.all([repo.ambilSemuaPaket(), repo.hitungTotalPaket()]);

      setDaftarPaket(paket);
      setTotalPaket(jumlah);
    } catch (error) {
      console.error('Gagal mengambil data paket:', error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    muatData();
  }, [muatData]);

  const handleKeDetail = (id: number) => {
    // Navigasi ke file: app/detail/detail-paket/[id].tsx
    router.push(`/detail/detail-paket/${id}`);
  };
  // Komponen Header yang dipisahkan
  return (
    <SafeAreaView style={styles.container} edges={['left', 'top', 'right']}>
      {/* Header Seksi */}
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
      <TombolTambah onPress={() => router.push('/form/form-paket')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
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
