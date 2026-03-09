// path: app/(tabs)/transaksi.tsx
// File Screen untuk manajemen Transaksi WiFi.

import TombolTambah from '@/components/tombol/tombol-tambah';
import { Colors } from '@/constants/theme';
import { operasiTransaksi, TransaksiLengkap } from '@/database/operasi/transaksi-operasi';
import { formatAngka } from '@/utils/format/format-angka';
import { formatTanggal } from '@/utils/format/format-tanggal';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransaksiScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [transaksi, setTransaksi] = useState<TransaksiLengkap[]>([]);
  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const muatData = useCallback(async () => {
    if (transaksi.length === 0) setIsLoading(true);

    try {
      const [data, total] = await Promise.all([
        operasiTransaksi.ambilSemuaLengkap(db),
        operasiTransaksi.hitungTotalTransaksi(db),
      ]);

      setTransaksi(data || []);
      setTotalTransaksi(total);
    } catch (error) {
      console.error('Gagal memuat transaksi:', error);
    } finally {
      setIsLoading(false);
    }
  }, [db, transaksi.length]);

  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [muatData])
  );

  const renderItem: ListRenderItem<TransaksiLengkap> = ({ item }) => (
    <Pressable
      style={styles.card}
      // PERBAIKAN: Path disesuaikan dengan struktur folder app/detail/detail-transaksi.tsx/[id].tsx
      onPress={() =>
        router.push({
          pathname: '/detail/detail-transaksi.tsx/[id]',
          params: { id: item.id },
        })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.namaPelanggan} numberOfLines={1}>
          {item.nama_pelanggan || 'Transaksi Umum'}
        </Text>
        <Text style={styles.tanggal}>
          {item.tanggal ? formatTanggal(new Date(item.tanggal)) : '-'}
        </Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.descWrapper}>
          <MaterialIcons
            name={item.id_pelanggan ? 'wifi' : 'receipt'}
            size={16}
            color='#888'
            style={{ marginRight: 6 }}
          />
          <Text style={styles.namaPaket} numberOfLines={1}>
            {item.nama_paket || item.deskripsi}
          </Text>
        </View>
        <Text style={[styles.hargaPaket, item.tipe === 'Pengeluaran' && styles.hargaPengeluaran]}>
          {item.tipe === 'Pengeluaran' ? '-' : '+'} {formatAngka(item.saldo || 0)}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={[styles.status, item.tipe === 'Pengeluaran' && styles.statusPengeluaran]}>
          <Text
            style={[styles.statusText, item.tipe === 'Pengeluaran' && styles.statusTextPengeluaran]}
          >
            {item.tipe}
          </Text>
        </View>
        {item.catatan && <MaterialIcons name='notes' size={14} color='#BBB' />}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Riwayat Transaksi</Text>
          <Text style={styles.subtitle}>{totalTransaksi} Total Catatan</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.refreshButton, pressed && { opacity: 0.6 }]}
          onPress={muatData}
        >
          <MaterialIcons name='refresh' size={28} color={Colors.light.tint} />
        </Pressable>
      </View>

      {isLoading && transaksi.length === 0 ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size='large' color={Colors.light.tint} />
        </View>
      ) : (
        <FlatList
          data={transaksi}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name='receipt-long' size={64} color='#E0E0E0' />
              <Text style={styles.emptyText}>Belum ada riwayat transaksi.</Text>
            </View>
          }
          onRefresh={muatData}
          refreshing={isLoading}
        />
      )}

      <TombolTambah onPress={() => router.push('/form/form-transaksi')} />
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
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  refreshButton: { padding: 5 },
  listContainer: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  namaPelanggan: { fontSize: 16, fontWeight: '700', color: '#333', flex: 1, marginRight: 10 },
  tanggal: { fontSize: 12, color: '#999' },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  descWrapper: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  namaPaket: { fontSize: 14, color: '#666' },
  hargaPaket: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },
  hargaPengeluaran: { color: '#C62828' },
  cardFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
  },
  statusPengeluaran: { backgroundColor: '#FFEBEE' },
  statusText: { fontSize: 11, fontWeight: 'bold', color: '#2E7D32' },
  statusTextPengeluaran: { color: '#C62828' },
  centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { textAlign: 'center', marginTop: 16, fontSize: 15, color: '#999' },
});
