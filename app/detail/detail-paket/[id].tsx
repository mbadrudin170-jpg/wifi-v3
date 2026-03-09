// Path: ~/wifi-v3/app/detail/detail-paket/[id].tsx
// File Screen Detail Paket.
// Penjelasan: Mengambil ID dari URL dan mencari data paket di SQLite secara otomatis.

import { Paket } from '@/database/operasi/paket-operasi';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HalamanDetailPaket() {
  // 1. Ambil ID dari parameter URL ([id])
  const { id } = useLocalSearchParams<{ id: string }>();

  const db = useSQLiteContext();
  const router = useRouter();

  const [paket, setPaket] = useState<Paket | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Fungsi untuk mengambil data detail berdasarkan ID
  useEffect(() => {
    async function ambilDetail() {
      try {
        setLoading(true);
        // Kita gunakan query langsung atau tambahkan fungsi di operasiPaket
        const result = await db.getFirstAsync<Paket>('SELECT * FROM paket WHERE id = ?', [id]);
        setPaket(result);
      } catch (error) {
        console.error('Gagal memuat detail paket:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) ambilDetail();
  }, [id, db]);

  // Fungsi kembali agar lebih rapi
  const handleBack = () => router.back();

  return (
    <SafeAreaView style={styles.container} edges={['left', 'top', 'right']}>
      {/* Sembunyikan header bawaan agar kita bisa pakai header custom */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Custom */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.iconBtn}>
          <MaterialIcons name='chevron-left' size={28} color={'#1976D2'} />
        </Pressable>
        <Text style={styles.titleHeader}>Detail Layanan</Text>
        <Pressable style={styles.iconBtn}>
          <MaterialIcons name='edit' size={24} color={'#424242'} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size='large' color='#1976D2' />
        </View>
      ) : paket ? (
        <View style={styles.content}>
          {/* Card Info Utama */}
          <View style={styles.card}>
            <Text style={styles.label}>Nama Paket WiFi</Text>
            <Text style={styles.valueNama}>{paket.nama}</Text>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View>
                <Text style={styles.label}>Kecepatan</Text>
                <Text style={styles.valueSmall}>{paket.kecepatan} Mbps</Text>
              </View>
              <View>
                <Text style={styles.label}>Durasi</Text>
                <Text style={styles.valueSmall}>{paket.durasi} Hari</Text>
              </View>
            </View>
          </View>

          {/* Card Harga */}
          <View style={[styles.card, styles.cardHarga]}>
            <Text style={styles.labelHarga}>Biaya Langganan</Text>
            <Text style={styles.valueHarga}>Rp {paket.harga.toLocaleString('id-ID')}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.center}>
          <Text>Data paket tidak ditemukan.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  titleHeader: { fontSize: 18, fontWeight: 'bold', color: '#212121' },
  iconBtn: { padding: 8 },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Styling Card Profesional
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHarga: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  label: { fontSize: 12, color: '#757575', marginBottom: 4, textTransform: 'uppercase' },
  labelHarga: { fontSize: 14, color: '#1976D2', fontWeight: '600' },
  valueNama: { fontSize: 22, fontWeight: '800', color: '#263238' },
  valueSmall: { fontSize: 16, fontWeight: 'bold', color: '#424242' },
  valueHarga: { fontSize: 28, fontWeight: '900', color: '#0D47A1', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});
