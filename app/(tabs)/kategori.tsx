// Path: ~/wifi-v3/app/(tabs)/kategori.tsx

import HeaderCustom from '@/components/header-custom';
import SafeAreaViewCustom from '@/components/komponen-react/safe-area-view-custom';
import { TombolHapus, TombolTambah } from '@/components/tombol';
import { Kategori, operasiKategori } from '@/database/operasi/kategori-operasi';
import { SubKategori, operasiSubKategori } from '@/database/operasi/sub-kategori-operasi';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HalamanKategori() {
  const [tipeAktif, setTipeAktif] = useState<'Pemasukan' | 'Pengeluaran'>('Pemasukan');
  const [daftarKategori, setDaftarKategori] = useState<Kategori[]>([]);
  const [kategoriAktif, setKategoriAktif] = useState<Kategori | null>(null);
  const [daftarSubKategori, setDaftarSubKategori] = useState<SubKategori[]>([]);
  const db = useSQLiteContext();

  const muatData = useCallback(async () => {
    try {
      // 1. Muat daftar kategori berdasarkan tipe yang aktif
      const kategori = await operasiKategori(db).getByType(tipeAktif);
      setDaftarKategori(kategori);

      // 2. Periksa apakah kategori yang aktif sebelumnya masih ada di daftar baru
      const kategoriAktifSaatIniMasihAda = kategori.some((k) => k.id === kategoriAktif?.id);
      let subKategoriBaru: SubKategori[] = [];

      if (kategoriAktifSaatIniMasihAda && kategoriAktif) {
        // 3. Jika masih ada, muat sub-kategorinya
        subKategoriBaru = await operasiSubKategori(db).getByKategoriId(kategoriAktif.id);
      } else {
        // 4. Jika tidak, reset pilihan
        setKategoriAktif(null);
      }
      setDaftarSubKategori(subKategoriBaru);
    } catch (error) {
      console.error('Gagal memuat data kategori:', error);
    }
  }, [db, tipeAktif, kategoriAktif]);

  // Gunakan useFocusEffect untuk memuat ulang data saat layar ini kembali aktif
  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [muatData])
  );

  const handlePilihKategori = async (kategori: Kategori) => {
    setKategoriAktif(kategori);
    const subKategori = await operasiSubKategori(db).getByKategoriId(kategori.id);
    setDaftarSubKategori(subKategori);
  };

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

  const renderItemSubKategori = ({ item }: { item: SubKategori }) => (
    <View style={styles.itemKategori}>
      <Text style={styles.teksKategori}>{item.nama}</Text>
    </View>
  );

  return (
    <SafeAreaViewCustom>
      <HeaderCustom
        title='Kategori'
        rightAccessory={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TombolHapus onPress={() => console.log('Hapus')} />
            <TombolTambah onPress={() => console.log('Tambah')} />
          </View>
        }
      />

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

      <View style={styles.wadahKategoriDanSub}>
        {/* Kolom Kategori */}
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

        {/* Kolom Sub Kategori */}
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
    </SafeAreaViewCustom>
  );
}

const styles = StyleSheet.create({
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
  teksTombolTipeAktif: {
    color: '#FFFFFF',
    fontWeight: '700',
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
