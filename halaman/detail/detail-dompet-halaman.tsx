// Path: ~/wifi-v3/halaman/detail/detail-dompet-halaman.tsx

import SafeAreaViewCustom from '@/components/komponen-react/safe-area-view-custom';
import { TombolEdit, TombolKembali } from '@/components/tombol';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

// Data contoh untuk riwayat transaksi
const dummyTransactions = [
  { id: '1', type: 'Pemasukan', description: 'Gaji Bulanan', amount: 5000000 },
  { id: '2', type: 'Pengeluaran', description: 'Bayar Listrik', amount: -250000 },
  { id: '3', type: 'Pengeluaran', description: 'Belanja Bulanan', amount: -1500000 },
  { id: '4', type: 'Pemasukan', description: 'Bonus Proyek', amount: 1000000 },
  { id: '5', type: 'Pengeluaran', description: 'Makan Siang', amount: -50000 },
];

export default function HalamanDetailDompet() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Mengambil ID dompet dari URL

  // Nanti, Anda akan menggunakan ID ini untuk mengambil data dari database
  const wallet = {
    name: 'Dompet Utama',
    balance: 4200000,
  };

  const handleEdit = () => {
    // Navigasi ke halaman form dengan membawa ID dompet
    router.push(`/form/form-dompet?id=${id}`);
  };

  const renderTransactionItem = ({ item }: { item: (typeof dummyTransactions)[0] }) => (
    <View style={styles.itemTransaksi}>
      <View>
        <Text style={styles.deskripsiTransaksi}>{item.description}</Text>
        <Text style={styles.tipeTransaksi}>{item.type}</Text>
      </View>
      <Text
        style={[styles.jumlahTransaksi, item.amount > 0 ? styles.pemasukan : styles.pengeluaran]}
      >
        {item.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
      </Text>
    </View>
  );

  return (
    <SafeAreaViewCustom style={styles.container}>
      <View style={styles.header}>
        <TombolKembali />
        <Text style={styles.judulHalaman}>Detail Dompet</Text>
        <TombolEdit onPress={handleEdit} />
      </View>

      <View style={styles.wadahInfoDompet}>
        <Text style={styles.namaDompet}>{wallet.name}</Text>
        <Text style={styles.saldoDompet}>
          {wallet.balance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
        </Text>
        <Text style={styles.labelSaldo}>Saldo Saat Ini</Text>
      </View>

      <View style={styles.wadahRiwayat}>
        <Text style={styles.judulRiwayat}>Riwayat Transaksi</Text>
        <FlatList
          data={dummyTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
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
