// path: app/(tabs)/transaksi.tsx
// File Screen untuk manajemen Transaksi WiFi dengan teks loading.

import SafeAreaViewCustom from '@/components/komponen-react/safe-area-view-custom';
import { TombolHapus } from '@/components/tombol';
import TombolTambah from '@/components/tombol/tombol-tambah';
import { operasiTransaksi, TransaksiLengkap } from '@/database/operasi/transaksi-operasi';
import { formatAngka, formatRupiah } from '@/utils/format/format-angka';
import { formatTanggal } from '@/utils/format/format-tanggal';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

export default function TransaksiScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [sections, setSections] = useState<SectionData[]>([]);
  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [totalPemasukan, setTotalPemasukan] = useState(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  type SectionData = {
    title: string; // Tanggal sebagai judul section
    total: number; // Total transaksi untuk tanggal tersebut
    data: TransaksiLengkap[]; // Data transaksi untuk tanggal tersebut
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fungsi untuk mengelompokkan transaksi berdasarkan tanggal
  const groupByDate = useCallback((items: TransaksiLengkap[]): SectionData[] => {
    const grouped = items.reduce((acc: { [key: string]: TransaksiLengkap[] }, item) => {
      const date = item.tanggal ? formatTanggal(new Date(item.tanggal)) : 'Tanpa Tanggal';
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => {
        const dateA = new Date(grouped[a][0]?.tanggal || '');
        const dateB = new Date(grouped[b][0]?.tanggal || '');
        return dateB.getTime() - dateA.getTime();
      })
      .map((title) => {
        const totalPerTanggal = grouped[title].reduce((sum, item) => {
          return item.tipe === 'pemasukan' ? sum + (item.jumlah || 0) : sum - (item.jumlah || 0);
        }, 0);

        return {
          title,
          total: totalPerTanggal,
          data: grouped[title].sort(
            (a, b) => new Date(b.tanggal || '').getTime() - new Date(a.tanggal || '').getTime()
          ),
        };
      });
  }, []);

  const muatData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [data, total, totalKeuangan] = await Promise.all([
        operasiTransaksi(db).ambilSemuaLengkap(50), // HANYA AMBIL 50 TERBARU
        operasiTransaksi(db).hitungTotalTransaksi(),
        operasiTransaksi(db).hitungPemasukanPengeluaran(),
      ]);

      if (!isMountedRef.current) return;
      setTotalPemasukan(totalKeuangan.pemasukan);
      setTotalPengeluaran(totalKeuangan.pengeluaran);
      setSections(groupByDate(data || []));
      setTotalTransaksi(total);
    } catch (error) {
      console.error('Gagal memuat transaksi:', error);
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [db, groupByDate]);

  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [muatData])
  );

  const handleHapusSemua = () => {
    if (totalTransaksi === 0) {
      Alert.alert('Informasi', 'Tidak ada riwayat transaksi untuk di hapus.');
      return;
    }
    Alert.alert('Konfirmasi Hapus', 'Apakah Anda yakin ingin menghapus semua riwayat transaksi?', [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Hapus Semua',
        style: 'destructive',
        onPress: async () => {
          try {
            await operasiTransaksi(db).hapusSemua();
            muatData();
            Alert.alert('Berhasil', 'Semua riwayat transaksi berhasil dihapus.');
          } catch (error) {
            console.error('Gagal menghapus semua transaksi:', error);
            Alert.alert('Gagal', 'Terjadi kesalahan saat menghapus semua transaksi.');
          }
        },
      },
    ]);
  };
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
        {formatRupiah(Math.abs(section.total))}
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
      <View style={styles.wadahKiri}>
        <Text>{item.nama_kategori}</Text>
        <Text>{item.nama_sub_kategori}</Text>
      </View>

      <View style={styles.wadahTengah}>
        <Text>{item.deskripsi}</Text>
        <Text>{item.nama_dompet}</Text>
      </View>
      <View style={styles.wadahKanan}>
        <Text
          style={[
            styles.jumlahTransaksi,
            item.tipe === 'pengeluaran' ? styles.jumlahPengeluaran : styles.jumlahPemasukan,
          ]}
        >
          {formatRupiah(item.jumlah || 0)}
        </Text>
        <Text style={styles.jam}>{item.jam}</Text>
      </View>
    </Pressable>
  );

  const totalAkhir = totalPemasukan - totalPengeluaran;

  return (
    <SafeAreaViewCustom>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Riwayat Transaksi</Text>
          <Text style={styles.subtitle}>{totalTransaksi} Total Catatan</Text>
        </View>
        <TombolHapus onPress={handleHapusSemua} />
      </View>

      <View style={styles.wadahRingkasanSaldo}>
        <View style={[styles.wadahTipe, styles.pemasukanBorder]}>
          <Text style={styles.teksTipe}>Pemasukan</Text>
          <Text style={[styles.jumlahTeks, styles.jumlahPemasukan]}>
            {formatAngka(totalPemasukan)}
          </Text>
        </View>
        <View style={[styles.wadahTipe, styles.pengeluaranBorder]}>
          <Text style={styles.teksTipe}>Pengeluaran</Text>
          <Text style={[styles.jumlahTeks, styles.jumlahPengeluaran]}>
            {formatAngka(totalPengeluaran)}
          </Text>
        </View>
        <View style={[styles.wadahTipe, styles.totalBorder]}>
          <Text style={styles.teksTipe}>Total</Text>
          <Text
            style={[
              styles.jumlahTeks,
              totalAkhir < 0 ? styles.jumlahPengeluaran : styles.jumlahPemasukan,
            ]}
          >
            {formatAngka(Math.abs(totalAkhir))}
          </Text>
        </View>
      </View>

      {isLoading ? (
        // TAMPILKAN INI SAAT LOADING
        <View style={styles.centerLoader}>
          <Text style={styles.loadingText}>Memuat data transaksi...</Text>
        </View>
      ) : sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onRefresh={muatData}
          refreshing={isLoading}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name='receipt-long' size={64} color='#E0E0E0' />
          <Text style={styles.emptyText}>Belum ada riwayat transaksi.</Text>
        </View>
      )}

      <TombolTambah onPress={() => router.push('/form/form-transaksi')} />
    </SafeAreaViewCustom>
  );
}

const styles = StyleSheet.create({
  // Container Utama
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Header Section
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

  // Ringkasan Saldo Section
  wadahRingkasanSaldo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  wadahTipe: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
  },
  pemasukanBorder: {
    borderColor: '#A5D6A7',
  },
  pengeluaranBorder: {
    borderColor: '#EF9A9A',
  },
  totalBorder: {
    borderColor: '#90CAF9',
  },
  teksTipe: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
    marginBottom: 4,
  },
  jumlahTeks: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  jumlahPemasukan: {
    color: '#2E7D32',
  },
  jumlahPengeluaran: {
    color: '#C62828',
  },
  jumlahTotal: {
    color: '#1565C0',
  },

  // Loading State
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

  // Empty State
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

  // Section List Container
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },

  // Section Header
  sectionHeader: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    flex: 1,
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

  // Card Item
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // Card Layout Sections
  wadahKiri: {
    justifyContent: 'flex-start',
    marginBottom: 10,
    alignItems: 'center',
  },
  wadahTengah: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 8,
  },
  wadahKanan: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  // Card Elements
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
  descWrapper: {
    justifyContent: 'flex-start',
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

  // Card Footer
  cardFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },

  // Status Badge
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
  jumlahTransaksi: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  jam: {
    fontSize: 12,
  },
});
