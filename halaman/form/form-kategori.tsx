// Path: ~/wifi-v3/app/form/form-kategori.tsx

import HeaderBiasa from '@/components/header/header-biasa';
import SafeAreaViewCustom from '@/components/komponen-react/safe-area-view-custom';
import ModalDropDown from '@/components/modal/modal';
import { TombolEdit, TombolHapus, TombolKembali, TombolSimpan } from '@/components/tombol';
import { Kategori, operasiKategori } from '@/database/operasi/kategori-operasi';
import { operasiSubKategori, SubKategori } from '@/database/operasi/sub-kategori-operasi';
import { MaterialIcons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HalamanFormKategori() {
  const db = useSQLiteContext();

  // State untuk form
  const [namaSubKategori, setNamaSubKategori] = useState('');
  const [namaKategoriBaru, setNamaKategoriBaru] = useState('');
  const [tipe, setTipe] = useState<'Pemasukan' | 'Pengeluaran'>('Pengeluaran');

  // State untuk data & UI
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<Kategori | null>(null);
  const [subKategoriList, setSubKategoriList] = useState<SubKategori[]>([]);
  const [editingSub, setEditingSub] = useState<{ id: number; nama: string } | null>(null);

  // State untuk kontrol UI
  const [modalVisible, setModalVisible] = useState(false);
  const [isInputVisible, setInputVisible] = useState(false);
  const [bukaInputSub, setBukaInputSub] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- FUNGSI MEMUAT DATA ---
  const muatKategoriInduk = useCallback(async () => {
    try {
      const result = await operasiKategori(db).getByType(tipe);
      setKategoriList(result);
    } catch (error) {
      console.error('Gagal memuat kategori:', error);
    }
  }, [tipe, db]);

  const muatSubKategori = useCallback(async () => {
    if (selectedKategori) {
      setLoading(true);
      try {
        const results = await operasiSubKategori(db).getByKategoriId(selectedKategori.id);
        setSubKategoriList(results);
      } catch (error) {
        console.error('Gagal memuat sub-kategori:', error);
        setSubKategoriList([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSubKategoriList([]);
    }
  }, [selectedKategori, db]);

  // --- EFEK UNTUK MEMUAT DATA ---
  useEffect(() => {
    muatKategoriInduk();
  }, [muatKategoriInduk]);

  useEffect(() => {
    setSelectedKategori(null);
    setEditingSub(null);
    setBukaInputSub(false);
  }, [tipe]);

  useEffect(() => {
    muatSubKategori();
  }, [muatSubKategori]);

  // --- FUNGSI HANDLER UNTUK KATEGORI INDUK ---
  const handleTambahKategori = async () => {
    const namaBaru = namaKategoriBaru.trim();
    if (!namaBaru) {
      Alert.alert('Error', 'Nama kategori baru tidak boleh kosong.');
      return;
    }

    // Pengecekan duplikat kategori berdasarkan tipe (case-insensitive)
    const isDuplicate = kategoriList.some(
      (kategori) => kategori.nama.toLowerCase() === namaBaru.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert('Gagal', `Kategori "${namaBaru}" sudah ada untuk tipe "${tipe}".`);
      return;
    }

    setLoading(true);
    try {
      await operasiKategori(db).create({
        nama: namaBaru,
        tipe: tipe,
        ikon: null,
      });
      setNamaKategoriBaru('');
      setInputVisible(false);
      await muatKategoriInduk();
      Alert.alert('Sukses', 'Kategori baru berhasil ditambahkan.');
    } catch (error) {
      console.error('Gagal menambah kategori baru:', error);
      Alert.alert('Error', 'Gagal menambah kategori baru.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimpanSubKategoriInline = async () => {
    const namaBaru = namaSubKategori.trim();
    if (!namaBaru) {
      Alert.alert('Error', 'Nama sub-kategori tidak boleh kosong.');
      return;
    }
    if (!selectedKategori) return;

    // Pengecekan duplikat (case-insensitive)
    const isDuplicate = subKategoriList.some(
      (sub) => sub.nama.toLowerCase() === namaBaru.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert(
        'Gagal',
        `Sub-kategori "${namaBaru}" sudah ada di dalam kategori "${selectedKategori.nama}".`
      );
      return;
    }

    setLoading(true);
    try {
      await operasiSubKategori(db).create({
        nama: namaBaru,
        kategori_id: selectedKategori.id,
      });
      setNamaSubKategori('');
      setBukaInputSub(false);
      await muatSubKategori();
      Alert.alert('Sukses', 'Sub-kategori baru berhasil ditambahkan.');
    } catch (error) {
      console.error('Gagal menambah sub-kategori:', error);
      Alert.alert('Error', 'Gagal menambah sub-kategori.');
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateSubKategori = async () => {
    if (!editingSub || !editingSub.nama.trim()) {
      Alert.alert('Error', 'Nama sub-kategori tidak boleh kosong.');
      return;
    }
    const namaBaru = editingSub.nama.trim();

    // Pengecekan duplikat (case-insensitive) saat update
    const isDuplicate = subKategoriList.some(
      (sub) => sub.id !== editingSub.id && sub.nama.toLowerCase() === namaBaru.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert('Gagal', `Nama sub-kategori "${namaBaru}" sudah ada.`);
      return;
    }

    setLoading(true);
    try {
      const subKategoriLama = subKategoriList.find((item) => item.id === editingSub.id);
      if (!subKategoriLama) return;

      await operasiSubKategori(db).update(editingSub.id, {
        nama: namaBaru,
        kategori_id: subKategoriLama.kategori_id,
      });

      setSubKategoriList((list) =>
        list.map((item) => (item.id === editingSub.id ? { ...item, nama: namaBaru } : item))
      );
      setEditingSub(null);
      Alert.alert('Sukses', 'Nama sub-kategori berhasil diperbarui.');
    } catch (error) {
      console.error('Gagal memperbarui sub-kategori:', error);
      Alert.alert('Error', 'Gagal memperbarui sub-kategori.');
    } finally {
      setLoading(false);
    }
  };
  const handleHapusSubKategori = (id: number) => {
    Alert.alert('Hapus Sub-Kategori', 'Apakah Anda yakin ingin menghapus sub-kategori ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await operasiSubKategori(db).delete(id);
            setSubKategoriList((list) => list.filter((item) => item.id !== id));
            Alert.alert('Sukses', 'Sub-kategori berhasil dihapus.');
          } catch (error) {
            console.error('Gagal menghapus sub-kategori:', error);
            Alert.alert('Error', 'Gagal menghapus sub-kategori.');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  // --- RENDER ---
  const renderItemKategori = ({ item }: { item: Kategori }) => (
    <Pressable
      style={styles.itemModal}
      onPress={() => {
        setSelectedKategori(item);
        setModalVisible(false);
      }}
    >
      <Text style={styles.itemModalTeks}>{item.nama}</Text>
    </Pressable>
  );

  const renderSubKategoriItem = ({ item, index }: { item: SubKategori; index: number }) => (
    <View
      style={[
        styles.itemSubKategori,
        index === 0 && styles.itemSubKategoriFirst,
        index === subKategoriList.length - 1 && styles.itemSubKategoriLast,
      ]}
    >
      {editingSub?.id === item.id ? (
        <>
          <TextInput
            style={styles.inputEditInline}
            value={editingSub.nama}
            onChangeText={(text) => setEditingSub({ ...editingSub, nama: text })}
            autoFocus
          />
          <View style={styles.wadahAksiItem}>
            <TombolSimpan onPress={handleUpdateSubKategori} disabled={loading} />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.itemTeksSubKategori}>{item.nama}</Text>
          <View style={styles.wadahAksiItem}>
            <TombolEdit
              onPress={() => setEditingSub({ id: item.id, nama: item.nama })}
              disabled={loading || !!editingSub}
            />
            <TombolHapus
              onPress={() => handleHapusSubKategori(item.id)}
              disabled={loading || !!editingSub}
            />
          </View>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaViewCustom style={styles.container}>
      <HeaderBiasa>
        <TombolKembali />
        <Text style={styles.headerTitle}>Kelola Kategori & Sub</Text>
        <View style={styles.headerRight} />
      </HeaderBiasa>

      <FlatList
        data={selectedKategori ? subKategoriList : []}
        renderItem={renderSubKategoriItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={
          <>
            {/* Tipe Transaksi */}
            <View style={styles.wadahTombolTipe}>
              <Pressable
                style={[styles.tombolTipe, tipe === 'Pemasukan' && styles.tombolTipeAktif]}
                onPress={() => setTipe('Pemasukan')}
                disabled={loading}
              >
                <Text style={[styles.teksTipe, tipe === 'Pemasukan' && styles.teksTombolTipeAktif]}>
                  Pemasukan
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tombolTipe, tipe === 'Pengeluaran' && styles.tombolTipeAktif]}
                onPress={() => setTipe('Pengeluaran')}
                disabled={loading}
              >
                <Text
                  style={[styles.teksTipe, tipe === 'Pengeluaran' && styles.teksTombolTipeAktif]}
                >
                  Pengeluaran
                </Text>
              </Pressable>
            </View>

            {/* Form Tambah Kategori Induk */}
            {isInputVisible ? (
              <View style={styles.wadahInputKategori}>
                <View style={styles.wadahLabelInputKategori}>
                  <Text style={styles.labelInputKategori}>Tambah Kategori Induk Baru</Text>
                  <Pressable
                    style={styles.tombolSimpanInputKategori}
                    onPress={handleTambahKategori}
                    disabled={loading}
                  >
                    <Text style={styles.teksTombolSimpanInputKategori}>Simpan</Text>
                  </Pressable>
                </View>
                <View style={styles.wadahInputKategoriDanTombolTutup}>
                  <TextInput
                    style={styles.inputKategori}
                    placeholder='cth: Gaji, Hadiah'
                    value={namaKategoriBaru}
                    onChangeText={setNamaKategoriBaru}
                  />
                  <Pressable
                    style={styles.tombolTutupInputKategori}
                    onPress={() => setInputVisible(false)}
                    disabled={loading}
                  >
                    <MaterialIcons name='close' size={24} color={'#555'} />
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.wadahTombolTambah}>
                <Pressable
                  style={styles.tombolTambah}
                  onPress={() => setInputVisible(true)}
                  disabled={loading}
                >
                  <MaterialIcons name='add' size={16} color='#2563EB' />
                  <Text style={styles.teksTombolTambah}>Buat Kategori Induk Baru</Text>
                </Pressable>
              </View>
            )}

            <View style={styles.separator} />

            {/* Form & Daftar Sub-Kategori */}
            <View style={styles.formContainer}>
              <View>
                <Text style={styles.label}>Pilih Kategori Induk</Text>
                <Pressable
                  onPress={() => setModalVisible(true)}
                  style={styles.inputDropdown}
                  disabled={loading}
                >
                  <Text
                    style={
                      selectedKategori ? styles.inputDropdownTeks : styles.inputDropdownPlaceholder
                    }
                  >
                    {selectedKategori?.nama || 'Pilih...'}
                  </Text>
                  <MaterialIcons name='arrow-drop-down' size={24} color='#6c757d' />
                </Pressable>
              </View>

              {/* Tombol untuk membuka form tambah Sub-Kategori */}
              {bukaInputSub ? (
                <View style={styles.wadahInputKategori}>
                  <View style={styles.wadahLabelInputKategori}>
                    <Text style={styles.labelInputKategori}>Tambah Sub-Kategori Baru</Text>
                    <Pressable
                      style={styles.tombolSimpanInputKategori}
                      onPress={handleSimpanSubKategoriInline}
                      disabled={loading}
                    >
                      <Text style={styles.teksTombolSimpanInputKategori}>Simpan</Text>
                    </Pressable>
                  </View>

                  <View style={styles.wadahInputKategoriDanTombolTutup}>
                    <TextInput
                      style={styles.inputKategori}
                      placeholder='Contoh: Belanja Bulanan'
                      value={namaSubKategori}
                      onChangeText={setNamaSubKategori}
                    />
                    <Pressable
                      style={styles.tombolTutupInputKategori}
                      onPress={() => setBukaInputSub(false)}
                      disabled={loading}
                    >
                      <MaterialIcons name='close' size={24} color={'#555'} />
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={styles.wadahTombolTambah}>
                  <Pressable
                    style={[styles.tombolTambah, !selectedKategori && styles.tombolTambahDisabled]}
                    onPress={() => setBukaInputSub(true)}
                    disabled={!selectedKategori || loading || !!editingSub}
                  >
                    <MaterialIcons
                      name='add'
                      size={16}
                      color={selectedKategori ? '#2563EB' : '#999'}
                    />
                    <Text
                      style={[
                        styles.teksTombolTambah,
                        !selectedKategori && styles.teksTombolTambahDisabled,
                      ]}
                    >
                      Buat Sub-Kategori Baru
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
            {selectedKategori && (
              <Text style={[styles.label, { marginTop: 24, marginBottom: 8 }]}>
                Daftar Sub-Kategori
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          selectedKategori ? (
            <View style={[styles.list, { padding: 20, alignItems: 'center' }]}>
              <Text style={styles.emptyListText}>Belum ada sub-kategori.</Text>
            </View>
          ) : null
        }
      />

      {/* Modal Dropdown */}
      <ModalDropDown
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title='Pilih Kategori Induk'
        data={kategoriList}
        renderItem={renderItemKategori}
        position='center'
      />
    </SafeAreaViewCustom>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  headerRight: { width: 40 },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 20 },
  separator: { height: 1, backgroundColor: '#e9ecef', marginVertical: 20 },
  formContainer: { gap: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 8 },
  inputDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
  },
  inputDropdownTeks: { fontSize: 16, color: '#495057' },
  inputDropdownPlaceholder: { fontSize: 16, color: '#6c757d' },
  itemModal: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  itemModalTeks: { fontSize: 16, color: '#333' },
  wadahTombolTipe: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  tombolTipe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  tombolTipeAktif: { backgroundColor: '#4c669f', borderColor: '#4c669f' },
  teksTipe: { fontSize: 14, fontWeight: '500' },
  teksTombolTipeAktif: { color: '#FFFFFF', fontWeight: 'bold' },
  wadahTombolTambah: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
  tombolTambah: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e7f5ff',
    borderRadius: 8,
  },
  teksTombolTambah: { color: '#2563EB', fontSize: 14, fontWeight: '600' },
  wadahInputKategori: { gap: 8 },
  wadahLabelInputKategori: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelInputKategori: { color: '#495057', fontSize: 14, fontWeight: '600' },
  tombolSimpanInputKategori: { paddingVertical: 4, paddingHorizontal: 8 },
  teksTombolSimpanInputKategori: { color: '#2563EB', fontSize: 14, fontWeight: '500' },
  wadahInputKategoriDanTombolTutup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inputKategori: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  tombolTutupInputKategori: { padding: 4 },
  list: {
    backgroundColor: '#fff',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
  },
  itemSubKategori: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#ced4da',
    borderRightColor: '#ced4da',
  },
  itemSubKategoriFirst: {
    borderTopWidth: 1,
    borderTopColor: '#ced4da',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  itemSubKategoriLast: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomWidth: 0,
  },
  itemTeksSubKategori: {
    fontSize: 15,
    color: '#495057',
    flex: 1,
  },
  wadahAksiItem: {
    flexDirection: 'row',
    gap: 8,
  },
  tombolTambahDisabled: {
    backgroundColor: '#f3f4f6',
  },
  teksTombolTambahDisabled: {
    color: '#9ca3af',
  },
  inputEditInline: {
    flex: 1,
    height: 40,
    borderColor: '#2563EB',
    borderBottomWidth: 1,
    fontSize: 15,
    color: '#495057',
    marginRight: 10,
  },
  emptyListText: {
    fontSize: 15,
    color: '#6c757d',
  },
});
