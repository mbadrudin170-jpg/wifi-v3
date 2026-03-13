// Path: halaman/(tabs)/dompet-halaman.tsx

import SafeAreaViewCustom from '@/components/komponen-react/safe-area-view-custom';
import { TombolTambah } from '@/components/tombol';
import { Dompet, operasiDompet } from '@/database/operasi/dompet-operasi';
import { formatAngka } from '@/utils/format/format-angka';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

export default function HalamanDompet() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [dataDompet, setDataDompet] = useState<Dompet[]>([]);

  const muatData = useCallback(async () => {
    const data = await operasiDompet(db).getAll();
    setDataDompet(data);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [muatData])
  );

  const handleDetailDompet = (id: number) => {
    router.push(`/detail/detail-dompet/${id}`);
  };

  // Statistik utama tetap berdasarkan saldo positif/negatif
  const totalAset = useMemo(
    () => dataDompet.filter((item) => item.saldo >= 0).reduce((acc, item) => acc + item.saldo, 0),
    [dataDompet]
  );

  const totalUtang = useMemo(
    () => dataDompet.filter((item) => item.saldo < 0).reduce((acc, item) => acc + item.saldo, 0),
    [dataDompet]
  );

  const saldoBersih = useMemo(() => totalAset + totalUtang, [totalAset, totalUtang]);

  // LOGIKA BARU (OPSI 2): Mengelompokkan berdasarkan tipe dompet ('tunai', 'bank', dll.)
  const sections = useMemo(() => {
    const groupedData = dataDompet.reduce(
      (acc, item) => {
        const grup = item.tipe; // Grup berdasarkan tipe: 'tunai', 'bank', etc.

        if (!acc[grup]) {
          acc[grup] = {
            title: grup, // Title akan menjadi 'tunai', 'bank', 'pinjaman', dll.
            data: [],
            total: 0,
          };
        }
        acc[grup].data.push(item);
        acc[grup].total += item.saldo;
        return acc;
      },
      {} as { [key: string]: { title: string; data: Dompet[]; total: number } }
    );

    // Mengubah objek menjadi array yang bisa dibaca oleh SectionList
    return Object.values(groupedData);
  }, [dataDompet]);

  const renderItem = ({ item }: { item: Dompet }) => (
    <Pressable onPress={() => handleDetailDompet(item.id)}>
      <View style={styles.rincianDompet}>
        <Text style={styles.namaDompet}>{item.nama}</Text>
        {/* Logika warna tetap berdasarkan nilai saldo item */}
        <Text
          style={[
            styles.saldoDompet,
            item.saldo < 0 ? styles.jumlahPengeluaran : styles.jumlahPemasukan,
          ]}
        >
          {formatAngka(item.saldo)}
        </Text>
      </View>
    </Pressable>
  );

  const renderSectionHeader = ({
    section: { title, total },
  }: {
    section: { title: string; total: number };
  }) => (
    <View style={styles.headerList}>
      <Text style={styles.namaTipe}>{title}</Text>
      {/* Logika warna tetap berdasarkan nilai total saldo grup */}
      <Text
        style={[styles.jumlahTipe, total < 0 ? styles.jumlahPengeluaran : styles.jumlahPemasukan]}
      >
        {formatAngka(total)}
      </Text>
    </View>
  );

  return (
    <SafeAreaViewCustom>
      <View style={styles.header}>
        <Text style={styles.judulHalaman}>Halaman Dompet</Text>
      </View>

      <View style={styles.wadahStatistik}>
        <View style={styles.tipeStatistik}>
          <Text style={styles.namaStatistik}>Total Aset</Text>
          <Text style={styles.jumlahPemasukan}>{formatAngka(totalAset)}</Text>
        </View>
        <View style={styles.tipeStatistik}>
          <Text style={styles.namaStatistik}>Total Utang</Text>
          <Text style={styles.jumlahPengeluaran}>{formatAngka(Math.abs(totalUtang))}</Text>
        </View>
        <View style={styles.tipeStatistik}>
          <Text style={styles.namaStatistik}>Saldo Bersih</Text>
          <Text style={saldoBersih < 0 ? styles.jumlahPengeluaran : styles.jumlahPemasukan}>
            {formatAngka(saldoBersih)}
          </Text>
        </View>
      </View>

      <View style={styles.wadahListDompet}>
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Belum ada dompet.</Text>
              <Text style={styles.emptyText}>Tekan tombol + untuk menambah.</Text>
            </View>
          }
        />
      </View>

      <TombolTambah onPress={() => router.push('/form/form-dompet')} />
    </SafeAreaViewCustom>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 6,
    paddingVertical: 16,
  },
  judulHalaman: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  wadahStatistik: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tipeStatistik: {
    width: '32%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    minWidth: 80,
    paddingVertical: 8,
  },
  namaStatistik: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  jumlahPemasukan: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  jumlahPengeluaran: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  wadahListDompet: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 10,
    flex: 1,
  },
  headerList: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 4,
  },
  namaTipe: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize', // Membuat huruf pertama besar
  },
  jumlahTipe: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rincianDompet: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  namaDompet: {
    fontSize: 16,
    fontWeight: '500',
  },
  saldoDompet: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#78909C',
  },
});
