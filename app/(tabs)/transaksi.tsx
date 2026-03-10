// path: app/(tabs)/transaksi.tsx
// File Screen untuk manajemen Transaksi WiFi dengan teks loading.

import TombolTambah from '@/components/tombol/tombol-tambah';
import { operasiTransaksi, TransaksiLengkap } from '@/database/operasi/transaksi-operasi';
import { formatAngka } from '@/utils/format/format-angka';
import { formatTanggal } from '@/utils/format/format-tanggal';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransaksiScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [transaksi, setTransaksi] = useState<TransaksiLengkap[]>([]);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  type SectionData = {
    title: string; // Tanggal sebagai judul section
    total: number; // Total transaksi untuk tanggal tersebut
    data: TransaksiLengkap[]; // Data transaksi untuk tanggal tersebut
  };

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fungsi untuk mengelompokkan transaksi berdasarkan tanggal
  const groupByDate = (items: TransaksiLengkap[]): SectionData[] => {
    // Kelompokkan items berdasarkan tanggal
    const grouped = items.reduce((acc: { [key: string]: TransaksiLengkap[] }, item) => {
      // Format tanggal untuk dijadikan key
      const date = item.tanggal ? formatTanggal(new Date(item.tanggal)) : 'Tanpa Tanggal';

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    // Konversi ke array section dan urutkan
    return Object.keys(grouped)
      .sort((a, b) => {
        // Sorting berdasarkan tanggal (terbaru ke terlama)
        const dateA = new Date(grouped[a][0]?.tanggal || '');
        const dateB = new Date(grouped[b][0]?.tanggal || '');
        return dateB.getTime() - dateA.getTime();
      })
      .map((title) => {
        // Hitung total untuk tanggal ini
        const totalPerTanggal = grouped[title].reduce((sum, item) => {
          return item.tipe === 'pemasukan' ? sum + (item.jumlah || 0) : sum - (item.jumlah || 0);
        }, 0);

        return {
          title,
          total: totalPerTanggal, // Tambahkan total
          data: grouped[title].sort(
            (a, b) =>
              // Urutkan transaksi dalam satu hari (terbaru ke terlama)
              new Date(b.tanggal || '').getTime() - new Date(a.tanggal || '').getTime()
          ),
        };
      });
  };
  const muatData = useCallback(async () => {
    if (transaksi.length === 0 && isMountedRef.current) setIsLoading(true);

    try {
      const [data, total] = await Promise.all([
        operasiTransaksi.ambilSemuaLengkap(db),
        operasiTransaksi.hitungTotalTransaksi(db),
      ]);

      if (!isMountedRef.current) return;
      setTransaksi(data || []);
      setSections(groupByDate(data || [])); // Tambahkan ini untuk grouping
      setTotalTransaksi(total);
    } catch (error) {
      console.error('Gagal memuat transaksi:', error);
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [db, transaksi.length]);

  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [muatData])
  );
  // Render header untuk setiap section (tanggal)
  const renderSectionHeader = ({ section }: { section: SectionData }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text
        style={[
          styles.sectionTotal,
          section.total >= 0 ? styles.sectionTotalPlus : styles.sectionTotalMinus,
        ]}
      >
        {section.total >= 0 ? '+' : '-'} {formatAngka(Math.abs(section.total))}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: TransaksiLengkap }) => (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/detail/detail-transaksi/[id]',
          params: { id: item.id },
        })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.namaPelanggan} numberOfLines={1}>
          {item.nama_pelanggan || 'Transaksi Umum'}
        </Text>
        {/* HAPUS bagian tanggal dari sini karena sudah ada di section header */}
        {/* <Text style={styles.tanggal}>
        {item.tanggal ? formatTanggal(new Date(item.tanggal)) : '-'}
      </Text> */}
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
        <Text style={[styles.hargaPaket, item.tipe === 'pengeluaran' && styles.hargaPengeluaran]}>
          {item.tipe === 'pemasukan' ? '+' : '-'} {formatAngka(item.jumlah || 0)}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={[styles.status, item.tipe === 'pengeluaran' && styles.statusPengeluaran]}>
          <Text
            style={[styles.statusText, item.tipe === 'pengeluaran' && styles.statusTextPengeluaran]}
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
      </View>

      {isLoading && transaksi.length === 0 ? (
        <View style={styles.centerLoader}>
          <Text style={styles.loadingText}>Memuat data transaksi...</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={true} // Membuat header tetap di atas saat scroll
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
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  namaPelanggan: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  tanggal: {
    fontSize: 12,
    color: '#999',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  descWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  namaPaket: {
    fontSize: 14,
    color: '#666',
  },
  hargaPaket: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  hargaPengeluaran: {
    color: '#C62828',
  },
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
  statusPengeluaran: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statusTextPengeluaran: {
    color: '#C62828',
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 15,
    color: '#999',
  },
  sectionHeader: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row', // TAMBAHKAN INI
    justifyContent: 'space-between', // TAMBAHKAN INI
    alignItems: 'center', // TAMBAHKAN INI
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    flex: 1, // TAMBAHKAN INI (opsional, untuk memastikan title tidak terpotong)
  },
  sectionTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionTotalPlus: {
    color: '#2E7D32',
  },
  sectionTotalMinus: {
    color: '#C62828',
  },
});
