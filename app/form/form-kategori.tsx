// Path: ~/wifi-v3/app/form/form-kategori.tsx

import HeaderCustom from '@/components/header-custom';
import InputTeks from '@/components/komponen-react/input-teks';
import SafeAreaViewCustom from '@/components/komponen-react/safe-area-view-custom';
import ModalDropDown from '@/components/modal/modal';
import { TombolSimpan } from '@/components/tombol';
import { Kategori, operasiKategori } from '@/database/operasi/kategori-operasi';
import { useSQLiteContext } from 'expo-sqlite';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Tipe data untuk opsi di modal
type OpsiTipe = {
  id: 'Pemasukan' | 'Pengeluaran';
  nama: 'Pemasukan' | 'Pengeluaran';
};

export default function HalamanFormKategori() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { create } = operasiKategori(db);

  const [nama, setNama] = useState('');
  const [tipe, setTipe] = useState<'Pemasukan' | 'Pengeluaran' | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * FUNGSI:
   * Menangani proses penyimpanan data kategori baru ke database.
   * Fungsi ini melakukan validasi input sebelum mengirim data.
   */
  const handleSimpan = async () => {
    if (!nama.trim()) {
      Alert.alert('Error', 'Nama kategori tidak boleh kosong.');
      return;
    }
    if (!tipe) {
      Alert.alert('Error', 'Tipe kategori harus dipilih.');
      return;
    }

    try {
      // Objek kategori yang akan disimpan
      const kategoriBaru: Omit<Kategori, 'id'> = {
        nama: nama.trim(),
        tipe: tipe,
        ikon: null, // Ikon belum diimplementasikan di form ini
      };

      await create(kategoriBaru);
      Alert.alert('Sukses', 'Kategori berhasil disimpan.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Gagal menyimpan kategori:', error);
      Alert.alert('Error', 'Gagal menyimpan kategori.');
    }
  };

  // Data untuk pilihan tipe di modal
  const dataTipe: OpsiTipe[] = [
    { id: 'Pemasukan', nama: 'Pemasukan' },
    { id: 'Pengeluaran', nama: 'Pengeluaran' },
  ];

  /**
   * FUNGSI:
   * Merender setiap item pilihan tipe di dalam modal.
   */
  const renderItemTipe = ({ item }: { item: OpsiTipe }) => (
    <Pressable
      style={styles.itemModal}
      onPress={() => {
        setTipe(item.id);
        setModalVisible(false);
      }}
    >
      <Text style={styles.itemModalTeks}>{item.nama}</Text>
    </Pressable>
  );

  return (
    <SafeAreaViewCustom style={styles.container}>
      <HeaderCustom title='Form Kategori' />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <InputTeks
            label='Nama Kategori'
            placeholder='Masukkan nama kategori'
            value={nama}
            onChangeText={setNama}
          />
          <Pressable onPress={() => setModalVisible(true)} style={styles.inputDropdown}>
            <Text style={tipe ? styles.inputDropdownTeks : styles.inputDropdownPlaceholder}>
              {tipe || 'Pilih tipe kategori'}
            </Text>
            <Text>▼</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.tombolContainer}>
        <TombolSimpan onPress={handleSimpan} />
      </View>

      <ModalDropDown
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title='Pilih Tipe Kategori'
        data={dataTipe}
        renderItem={renderItemTipe}
        position='center'
      />
    </SafeAreaViewCustom>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
    gap: 20,
  },
  tombolContainer: {
    padding: 20,
    paddingBottom: 28,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 4,
  },
  inputDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    height: 50,
  },
  inputDropdownTeks: {
    fontSize: 16,
    color: '#495057',
  },
  inputDropdownPlaceholder: {
    fontSize: 16,
    color: '#6c757d', // Warna placeholder
  },
  itemModal: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemModalTeks: {
    fontSize: 16,
    color: '#333',
  },
});
