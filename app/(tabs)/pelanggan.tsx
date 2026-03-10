// Path: ~/wifi-v3/app/(tabs)/pelanggan.tsx

import { TombolTambah } from '@/components/tombol';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { operasiPelanggan, Pelanggan } from '../../database/operasi/pelanggan-operasi';

export default function HalamanPelanggan() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [daftarPelanggan, setDaftarPelanggan] = useState<Pelanggan[]>([]);
  // Ubah default loading ke false jika data default diharapkan sudah ada dari provider
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Gunakan useMemo agar instance operasi tidak dibuat ulang setiap render
  const pelangganDb = useMemo(() => operasiPelanggan(db), [db]);

  const muatDataPelanggan = useCallback(async () => {
    try {
      // Pastikan db tersedia
      const data = await pelangganDb.ambilSemuaPelanggan();
      if (!isMountedRef.current) return;
      setDaftarPelanggan(data);
    } catch (error) {
      console.error('Gagal memuat pelanggan:', error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [pelangganDb]);

  // Gunakan useFocusEffect untuk sinkronisasi data
  useFocusEffect(
    useCallback(() => {
      muatDataPelanggan();
    }, [muatDataPelanggan])
  );

  const renderItemPelanggan = ({ item }: { item: Pelanggan }) => (
    <Pressable style={styles.card} onPress={() => router.push(`/detail/pelanggan/${item.id}`)}>
      <View style={styles.cardInfo}>
        <Text style={styles.namaText}>{item.nama}</Text>
        <Text style={styles.alamatText}>{item.alamat}</Text>
      </View>
      <View style={styles.cardContact}>
        <View style={styles.phoneBadge}>
          <MaterialIcons name='phone' size={14} color={'#007AFF'} />
          <Text style={styles.noHpText}>{item.no_hp || '-'}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerTextWrapper}>
          <Text style={styles.headerTitle}>Daftar Pelanggan</Text>
          <Text style={styles.headerSubtitle}>
            {loading ? 'Mengambil data...' : `${daftarPelanggan.length} Total Pelanggan`}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={styles.iconButton}
            onPress={() => {
              setLoading(true);
              muatDataPelanggan();
            }}
          >
            <MaterialIcons name='refresh' size={24} color={'#333'} />
          </Pressable>
        </View>
      </View>

      {loading && daftarPelanggan.length === 0 ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size='large' color='#007AFF' />
        </View>
      ) : (
        <FlatList
          data={daftarPelanggan}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItemPelanggan}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={muatDataPelanggan}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name='person-off' size={60} color='#CCC' />
              <Text style={styles.emptyText}>Belum ada data pelanggan.</Text>
            </View>
          }
        />
      )}
      <TombolTambah onPress={() => router.push('/form/form-pelanggan-aktif')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerTextWrapper: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  headerSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 10, padding: 8, backgroundColor: '#F0F0F0', borderRadius: 20 },
  listContent: { padding: 16, paddingBottom: 100 },
  centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#999', fontSize: 16, marginTop: 10 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardInfo: { flex: 1, marginRight: 10 },
  namaText: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 4 },
  alamatText: { fontSize: 13, color: '#888', lineHeight: 18 },
  cardContact: { alignItems: 'flex-end' },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  noHpText: { fontSize: 13, fontWeight: '600', color: '#007AFF', marginLeft: 4 },
  tombolTambah: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
});
