// Path: ~/wifi-v3/halaman/detail/detail-dompet-halaman.tsx

import SafeAreaViewCustom from '@/components/komponen-react/safe-area-view-custom';
import { TombolEdit, TombolKembali } from '@/components/tombol';
import { Dompet, operasiDompet } from '@/database/operasi/dompet-operasi';
import { Transaksi, operasiTransaksi } from '@/database/operasi/transaksi-operasi';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

export default function HalamanDetailDompet() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams<{ id: string }>();

  // State untuk loading, detail dompet, dan daftar transaksi
  const [loading, setLoading] = useState(true);
  const [dompet, setDompet] = useState<Dompet | null>(null);
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);

  // Fungsi untuk memuat data dari database
  const muatData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const dataDompet = await operasiDompet(db).getById(Number(id));
      // Pastikan fungsi getAllByDompetId ada di operasiTransaksi
      const dataTransaksi = await operasiTransaksi(db).getAllByDompetId(Number(id));
      setDompet(dataDompet || null);
      setTransaksiList(dataTransaksi);
    } catch (error) {
      console.error('Gagal memuat data detail dompet:', error);
    } finally {
      setLoading(false);
    }
  }, [db, id]);

  // Muat data saat halaman ini menjadi fokus
  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [muatData])
  );

  const handleEdit = () => {
    if (!id) return;
    // Navigasi ke halaman form dengan membawa ID dompet (cara type-safe)
    router.push({
      pathname: '/form/form-dompet',
      params: { id },
    });
  };

  // Komponen untuk merender setiap item transaksi
  const renderTransactionItem = ({ item }: { item: Transaksi }) => (
    <View style={styles.itemTransaksi}>
      <View>
        <Text style={styles.deskripsiTransaksi}>{item.deskripsi}</Text>
        <Text style={styles.tipeTransaksi}>{item.tipe}</Text>
      </View>
      <Text
        style={[
          styles.jumlahTransaksi,
          // PERBAIKAN: Gunakan 'pemasukan' (huruf kecil) sesuai definisi tipe
          item.tipe === 'pemasukan' ? styles.pemasukan : styles.pengeluaran,
        ]}
      >
        {item.jumlah.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
      </Text>
    </View>
  );

  // Tampilan saat loading
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F4F5F7',
        }}
      >
        <ActivityIndicator size='large' color='#4A90E2' />
        <Text style={{ marginTop: 10, color: '#333' }}>Memuat data dompet...</Text>
      </View>
    );
  }

  // Tampilan jika dompet tidak ditemukan
  if (!dompet) {
    return (
      <SafeAreaViewCustom style={styles.container}>
        <View style={styles.header}>
          <TombolKembali />
          <Text style={styles.judulHalaman}>Error</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#333' }}>Dompet tidak ditemukan.</Text>
        </View>
      </SafeAreaViewCustom>
    );
  }

  // Tampilan utama
  return (
    <SafeAreaViewCustom style={styles.container}>
      <View style={styles.header}>
        <TombolKembali />
        <Text style={styles.judulHalaman}>Detail Dompet</Text>
        <TombolEdit onPress={handleEdit} />
      </View>

      <View style={styles.wadahInfoDompet}>
        <Text style={styles.namaDompet}>{dompet.nama}</Text>
        <Text style={styles.saldoDompet}>
          {dompet.saldo.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
        </Text>
        <Text style={styles.labelSaldo}>Saldo Saat Ini</Text>
      </View>

      <View style={styles.wadahRiwayat}>
        <Text style={styles.judulRiwayat}>Riwayat Transaksi</Text>
        <FlatList
          data={transaksiList}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: '#718096', fontSize: 16 }}>Belum ada transaksi.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaViewCustom>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  judulHalaman: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  wadahInfoDompet: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  namaDompet: {
    fontSize: 22,
    fontWeight: '600',
    color: '#444',
  },
  saldoDompet: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A202C',
    marginTop: 8,
    marginBottom: 4,
  },
  labelSaldo: {
    fontSize: 14,
    color: '#718096',
  },
  wadahRiwayat: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  judulRiwayat: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  itemTransaksi: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  deskripsiTransaksi: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
  tipeTransaksi: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 4,
  },
  jumlahTransaksi: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pemasukan: {
    color: '#2F855A', // Green
  },
  pengeluaran: {
    color: '#C53030', // Red
  },
});
