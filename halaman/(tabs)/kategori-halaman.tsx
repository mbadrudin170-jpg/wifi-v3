// Path: ~/wifi-v3/halaman/(tabs)/kategori.tsx

import SafeAreaViewCustom from '@/components/komponen-react/safe-area-view-custom';
import { TombolHapus, TombolTambah } from '@/components/tombol';
import { Kategori, operasiKategori } from '@/database/operasi/kategori-operasi';
import { SubKategori, operasiSubKategori } from '@/database/operasi/sub-kategori-operasi';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HalamanKategori() {
  const router = useRouter();
  const [tipeAktif, setTipeAktif] = useState<'Pemasukan' | 'Pengeluaran'>('Pemasukan');
  const [daftarKategori, setDaftarKategori] = useState<Kategori[]>([]);
  const [kategoriAktif, setKategoriAktif] = useState<Kategori | null>(null);
  const [daftarSubKategori, setDaftarSubKategori] = useState<SubKategori[]>([]);
  const db = useSQLiteContext();

  // Logic: Memuat data dari database
  const muatData = useCallback(async () => {
    try {
      const kategori = await operasiKategori(db).getByType(tipeAktif);
      setDaftarKategori(kategori);

      const kategoriAktifSaatIniMasihAda = kategori.some((k) => k.id === kategoriAktif?.id);
      let subKategoriBaru: SubKategori[] = [];

      if (kategoriAktifSaatIniMasihAda && kategoriAktif) {
        subKategoriBaru = await operasiSubKategori(db).getByKategoriId(kategoriAktif.id);
      } else {
        setKategoriAktif(null);
      }
      setDaftarSubKategori(subKategoriBaru);
    } catch (error) {
      console.error('Gagal memuat data kategori:', error);
    }
  }, [db, tipeAktif, kategoriAktif]);

  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [muatData])
  );

  // Logic: Handler pilih kategori
  const handlePilihKategori = async (kategori: Kategori) => {
    setKategoriAktif(kategori);
    const subKategori = await operasiSubKategori(db).getByKategoriId(kategori.id);
    setDaftarSubKategori(subKategori);
  };

  // UI: Render Item Kategori
  const renderItemKategori = ({ item }: { item: Kategori }) => {
    const isActive = kategoriAktif?.id === item.id;
    return (
      <Pressable
        style={[styles.itemKategori, isActive && styles.kategoriAktif]}
        onPress={() => handlePilihKategori(item)}
      >
        <Text style={[styles.teksKategori, isActive && styles.teksKategoriAktif]}>{item.nama}</Text>
      </Pressable>
    );
  };

  // UI: Render Item Sub Kategori
  const renderItemSubKategori = ({ item }: { item: SubKategori }) => (
    <View style={styles.itemKategori}>
      <Text style={styles.teksKategori}>{item.nama}</Text>
    </View>
  );

  return (
    <SafeAreaViewCustom>
      {/* Section: Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kategori</Text>
        <TombolHapus />
      </View>

      {/* Section: Filter Tipe */}
      <View style={styles.wadahTombolTipe}>
        <Pressable
          style={[styles.tombolTipe, tipeAktif === 'Pemasukan' && styles.tombolTipeAktif]}
          onPress={() => setTipeAktif('Pemasukan')}
        >
          <Text
            style={[styles.teksPemasukan, tipeAktif === 'Pemasukan' && styles.teksTombolTipeAktif]}
          >
            Pemasukan
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tombolTipe, tipeAktif === 'Pengeluaran' && styles.tombolTipeAktif]}
          onPress={() => setTipeAktif('Pengeluaran')}
        >
          <Text
            style={[
              styles.teksPengeluaran,
              tipeAktif === 'Pengeluaran' && styles.teksTombolTipeAktif,
            ]}
          >
            Pengeluaran
          </Text>
        </Pressable>
      </View>

      {/* Section: Daftar List */}
      <View style={styles.wadahKategoriDanSub}>
        <View style={styles.wadahRincian}>
          <FlatList
            data={daftarKategori}
            renderItem={renderItemKategori}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={<Text style={styles.judulList}>Kategori</Text>}
            contentContainerStyle={{ gap: 8 }}
            ListEmptyComponent={<Text style={styles.teksKosong}>Tidak ada kategori.</Text>}
          />
        </View>

        <View style={styles.wadahRincian}>
          <FlatList
            data={daftarSubKategori}
            renderItem={renderItemSubKategori}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={<Text style={styles.judulList}>Sub-Kategori</Text>}
            contentContainerStyle={{ gap: 8 }}
            ListEmptyComponent={
              <Text style={styles.teksKosong}>
                {kategoriAktif ? 'Tidak ada sub-kategori.' : 'Pilih kategori untuk melihat sub.'}
              </Text>
            }
          />
        </View>
      </View>

      {/* Section: Floating Action Button */}
      <TombolTambah onPress={() => router.push('/form/form-kategori')} />
    </SafeAreaViewCustom>
  );
}

const styles = StyleSheet.create({
  // 1. Header Styles
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 2,
    color: '#333',
  },

  // 2. Filter Tipe Styles
  wadahTombolTipe: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  tombolTipe: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tombolTipeAktif: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  teksPemasukan: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  teksPengeluaran: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c62828',
  },
  teksTombolTipeAktif: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // 3. Layout Konten (Kategori & Sub)
  wadahKategoriDanSub: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  wadahRincian: {
    flex: 1,
    flexDirection: 'column',
    gap: 12,
  },
  judulList: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 4,
  },

  // 4. Item List Styles
  itemKategori: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  teksKategori: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  kategoriAktif: {
    backgroundColor: '#EBF1FD',
    borderColor: '#2563EB',
  },
  teksKategoriAktif: {
    color: '#2563EB',
    fontWeight: '700',
  },
  teksKosong: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
