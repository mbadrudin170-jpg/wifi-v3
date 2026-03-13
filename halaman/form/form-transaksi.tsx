// Path: ~/wifi-v3/halaman/form/form-transaksi.tsx

import HeaderCustom from '@/components/header/header-custom';
import ModalDropDown from '@/components/modal/modal';
import { TombolKembali, TombolSimpan } from '@/components/tombol';
import { Dompet, operasiDompet } from '@/database/operasi/dompet-operasi';
import { Kategori, operasiKategori } from '@/database/operasi/kategori-operasi';
import { SubKategori, operasiSubKategori } from '@/database/operasi/sub-kategori-operasi';
import { operasiTransaksi } from '@/database/operasi/transaksi-operasi';
import { formatAngka } from '@/utils/format/format-angka';
import { formatJam } from '@/utils/format/format-jam';
import { formatTanggal } from '@/utils/format/format-tanggal';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import InputTeks from '../../components/komponen-react/input-teks';
import SafeAreaViewCustom from '../../components/komponen-react/safe-area-view-custom';

export default function FormTransaksi() {
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const [idEdit, setIdEdit] = useState<number | null>(null);
  const [keterangan, setKeterangan] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [catatan, setCatatan] = useState('');
  const [jenisTransaksi, setJenisTransaksi] = useState('pemasukan');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  // Refs untuk input
  const keteranganRef = useRef<TextInput>(null);
  const jumlahRef = useRef<TextInput>(null);

  // State untuk data dari database
  const [dompetList, setDompetList] = useState<Dompet[]>([]);
  const [kategoriDbList, setKategoriDbList] = useState<Kategori[]>([]);
  const [subKategoriDbList, setSubKategoriDbList] = useState<SubKategori[]>([]);

  // State untuk modal dan item terpilih
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<
    'dompetAsal' | 'dompetTujuan' | 'kategori' | 'subKategori'
  >('dompetAsal');
  const [selectedDompetAsal, setSelectedDompetAsal] = useState<Dompet | null>(null);
  const [selectedDompetTujuan, setSelectedDompetTujuan] = useState<Dompet | null>(null);
  const [selectedKategori, setSelectedKategori] = useState<Kategori | null>(null);
  const [selectedSubKategori, setSelectedSubKategori] = useState<SubKategori | null>(null);

  const db = useSQLiteContext();
  // path: app/form/form-transaksi.tsx

  // GANTI useFocusEffect LAMA ANDA DENGAN YANG INI:
  useFocusEffect(
    useCallback(() => {
      // Fungsi untuk memuat data transaksi dan mengisinya ke dalam form
      const muatDataUntukEdit = async (id: number) => {
        try {
          const data = await operasiTransaksi(db).ambilBerdasarkanId(id.toString());
          if (data) {
            // Set state mode edit
            setIdEdit(id);

            // Isi semua field form dengan data dari database
            setKeterangan(data.deskripsi);
            setJumlah(data.jumlah.toString()); // Ubah angka menjadi string untuk input
            setCatatan(data.catatan || '');
            setDate(new Date(data.tanggal || new Date())); // Buat objek Date dari string tanggal
            setJenisTransaksi(data.tipe as 'pemasukan' | 'pengeluaran');

            // Ambil dan set data untuk dropdown
            if (data.id_dompet) {
              const dompet = await operasiDompet(db).getById(data.id_dompet);
              setSelectedDompetAsal(dompet);
            }
            if (data.id_kategori) {
              const kategori = await operasiKategori(db).getById(data.id_kategori);
              setSelectedKategori(kategori);
            }
            if (data.id_sub_kategori) {
              const subKategori = await operasiSubKategori(db).getById(data.id_sub_kategori);
              setSelectedSubKategori(subKategori);
            }
          } else {
            Alert.alert('Error', 'Data transaksi untuk diedit tidak ditemukan.');
            router.back();
          }
        } catch (e) {
          Alert.alert('Error', 'Gagal memuat data untuk diedit.');
          router.back();
        }
      };

      // Selalu muat daftar dompet untuk pilihan dropdown
      operasiDompet(db).ambilSemuaDompet().then(setDompetList);

      if (idParam) {
        // Jika ada 'id' dari URL, jalankan fungsi muat data
        const idNumerik = parseInt(idParam, 10);
        muatDataUntukEdit(idNumerik);
      } else {
        // Jika tidak ada 'id', pastikan form dalam mode buat baru (reset state)
        setIdEdit(null);
        setKeterangan('');
        setJumlah('');
        setCatatan('');
        setDate(new Date());
        setJenisTransaksi('pemasukan');
        setSelectedDompetAsal(null);
        setSelectedKategori(null);
        setSelectedSubKategori(null);
      }
    }, [db, idParam]) // Efek ini akan berjalan lagi jika 'id' di URL berubah
  );

  // Mengambil data kategori berdasarkan jenis transaksi
  useEffect(() => {
    async function loadKategori() {
      if (jenisTransaksi === 'pemasukan' || jenisTransaksi === 'pengeluaran') {
        const tipeKategori = jenisTransaksi === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran';
        const result = await operasiKategori(db).getByType(tipeKategori);
        setKategoriDbList(result);
      } else {
        setKategoriDbList([]);
      }
      // Reset pilihan saat jenis transaksi berubah
      setSelectedKategori(null);
      setSelectedSubKategori(null);
    }
    loadKategori();
  }, [jenisTransaksi, db]);

  // Mengambil data sub-kategori berdasarkan kategori yang dipilih
  useEffect(() => {
    async function loadSubKategori() {
      if (selectedKategori) {
        const result = await operasiSubKategori(db).getByKategoriId(selectedKategori.id);
        setSubKategoriDbList(result);
      } else {
        setSubKategoriDbList([]);
      }
      // Reset pilihan sub-kategori saat kategori berubah
      setSelectedSubKategori(null);
    }
    loadSubKategori();
  }, [selectedKategori, db]);

  const handleJumlahChange = (text: string) => {
    const rawValue = text.replace(/[^0-9]/g, '');
    setJumlah(rawValue);
  };
  // Path: ~/wifi-v3/halaman/form/form-transaksi.tsx

  // ... (kode lainnya)

  const handleSimpan = async () => {
    const isTransfer = jenisTransaksi === 'transfer';
    const jumlahAngka = parseFloat(jumlah);

    // [!code focus:18]
    // --- VALIDASI INPUT ---
    if (!keterangan.trim()) {
      Alert.alert('Peringatan', 'Keterangan transaksi tidak boleh kosong.');
      return;
    }
    if (!jumlah || isNaN(jumlahAngka) || jumlahAngka <= 0) {
      Alert.alert('Peringatan', 'Jumlah harus diisi dengan angka yang valid.');
      return;
    }
    if (!selectedDompetAsal) {
      Alert.alert('Peringatan', `Harap pilih ${isTransfer ? 'dompet asal' : 'dompet'}.`);
      return;
    }
    if (isTransfer && !selectedDompetTujuan) {
      Alert.alert('Peringatan', 'Harap pilih dompet tujuan untuk transfer.');
      return;
    }
    if (!isTransfer && !selectedKategori) {
      Alert.alert('Peringatan', 'Harap pilih kategori transaksi.');
      return;
    }

    try {
      const tanggalISO = date.toISOString();
      const jamFormatted = formatJam(date);

      // Menangani kasus 'transfer' yang tidak didukung saat edit
      if (idEdit && isTransfer) {
        Alert.alert(
          'Aksi Tidak Didukung',
          'Mengedit transaksi jenis transfer tidak bisa dilakukan.'
        );
        return;
      }

      if (idEdit) {
        // --- LOGIKA UPDATE ---
        await operasiTransaksi(db).update(idEdit, {
          deskripsi: keterangan,
          jumlah: jumlahAngka,
          tipe: jenisTransaksi as 'pemasukan' | 'pengeluaran',
          catatan,
          tanggal: tanggalISO,
          jam: jamFormatted,
          id_kategori: selectedKategori!.id,
          id_sub_kategori: selectedSubKategori?.id || null,
          id_dompet: selectedDompetAsal!.id,
        });
      } else {
        // --- LOGIKA CREATE (YANG SUDAH ADA) ---
        if (isTransfer) {
          // Logika transfer Anda yang sudah ada
        } else {
          await operasiTransaksi(db).create({
            deskripsi: keterangan,
            jumlah: jumlahAngka,
            tipe: jenisTransaksi as 'pemasukan' | 'pengeluaran',
            catatan,
            tanggal: tanggalISO,
            jam: jamFormatted,
            id_kategori: selectedKategori!.id,
            id_sub_kategori: selectedSubKategori?.id || null,
            id_dompet: selectedDompetAsal!.id,
          });
        }
      }

      Alert.alert('Sukses', `Transaksi berhasil ${idEdit ? 'diperbarui' : 'disimpan'}.`);
      router.back();
    } catch (error) {
      console.error('Gagal menyimpan transaksi:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan transaksi.');
    }
  };

  const openModal = (type: 'dompetAsal' | 'dompetTujuan' | 'kategori' | 'subKategori') => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleSelectItem = (item: Dompet | Kategori | SubKategori) => {
    switch (modalType) {
      case 'dompetAsal':
        const newDompetAsal = item as Dompet;
        setSelectedDompetAsal(newDompetAsal);
        if (newDompetAsal.id === selectedDompetTujuan?.id) {
          setSelectedDompetTujuan(null);
        }
        break;
      case 'dompetTujuan':
        const newDompetTujuan = item as Dompet;
        setSelectedDompetTujuan(newDompetTujuan);
        if (newDompetTujuan.id === selectedDompetAsal?.id) {
          setSelectedDompetAsal(null);
        }
        break;
      case 'kategori':
        setSelectedKategori(item as Kategori);
        break;
      case 'subKategori':
        setSelectedSubKategori(item as SubKategori);
        break;
    }
    setModalVisible(false);
  };

  const showPickerMode = (currentMode: 'date' | 'time') => {
    setShowPicker(true);
    setPickerMode(currentMode);
  };

  const onChangeDateTimePicker = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    setDate(currentDate);
  };

  const isTransfer = jenisTransaksi === 'transfer';
  const isPemasukan = jenisTransaksi === 'pemasukan';
  const isPengeluaran = jenisTransaksi === 'pengeluaran';

  const getModalData = () => {
    switch (modalType) {
      case 'dompetAsal':
        return dompetList.filter((d) => d.id !== selectedDompetTujuan?.id);
      case 'dompetTujuan':
        return dompetList.filter((d) => d.id !== selectedDompetAsal?.id);
      case 'kategori':
        return kategoriDbList;
      case 'subKategori':
        return subKategoriDbList;
      default:
        return [];
    }
  };

  const renderModalItem = ({ item }: { item: Dompet | Kategori | SubKategori }) => {
    let selectedId: number | null = null;
    switch (modalType) {
      case 'dompetAsal':
        selectedId = selectedDompetAsal?.id ?? null;
        break;
      case 'dompetTujuan':
        selectedId = selectedDompetTujuan?.id ?? null;
        break;
      case 'kategori':
        selectedId = selectedKategori?.id ?? null;
        break;
      case 'subKategori':
        selectedId = selectedSubKategori?.id ?? null;
        break;
    }
    const isSelected = item.id === selectedId;

    return (
      <Pressable style={styles.modalItem} onPress={() => handleSelectItem(item)}>
        <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
          {item.nama}
        </Text>
        {isSelected && <MaterialIcons name='check' size={22} color='#2563EB' />}
      </Pressable>
    );
  };

  return (
    <SafeAreaViewCustom>
      <HeaderCustom title='Form Transaksi' leftAccessory={<TombolKembali />} />

      <View style={styles.jenisContainer}>
        <Pressable
          style={[styles.jenisButton, isPemasukan && styles.jenisButtonActive]}
          onPress={() => setJenisTransaksi('pemasukan')}
        >
          <Text style={[styles.jenisText, isPemasukan && styles.jenisTextActive]}>Pemasukan</Text>
        </Pressable>
        <Pressable
          style={[styles.jenisButton, isPengeluaran && styles.jenisButtonActive]}
          onPress={() => setJenisTransaksi('pengeluaran')}
        >
          <Text style={[styles.jenisText, isPengeluaran && styles.jenisTextActive]}>
            Pengeluaran
          </Text>
        </Pressable>

        <Pressable
          style={[styles.jenisButton, isTransfer && styles.jenisButtonActive]}
          onPress={() => setJenisTransaksi('transfer')}
        >
          <Text style={[styles.jenisText, isTransfer && styles.jenisTextActive]}>Transfer</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.dateTimeContainer}>
          <Pressable style={styles.dateButton} onPress={() => showPickerMode('date')}>
            <MaterialIcons name='calendar-today' size={20} color='#666' />
            <Text style={styles.dateTimeText}>{formatTanggal(date)}</Text>
          </Pressable>
          <Pressable style={styles.timeButton} onPress={() => showPickerMode('time')}>
            <MaterialIcons name='lock-clock' size={20} color='#666' />
            <Text style={styles.dateTimeText}>{formatJam(date)}</Text>
          </Pressable>
        </View>

        {showPicker && (
          <DateTimePicker
            testID='dateTimePicker'
            value={date}
            mode={pickerMode}
            is24Hour={true}
            display='default'
            onChange={onChangeDateTimePicker}
          />
        )}

        <View style={styles.formContainer}>
          <InputTeks
            ref={keteranganRef}
            label='Keterangan'
            value={keterangan}
            onChangeText={setKeterangan}
            placeholder='Masukkan keterangan'
            returnKeyType='next'
            onSubmitEditing={() => jumlahRef.current?.focus()}
          />
          <InputTeks
            ref={jumlahRef}
            label='Jumlah'
            value={formatAngka(jumlah)}
            onChangeText={handleJumlahChange}
            placeholder='Masukkan jumlah'
            keyboardType='numeric'
            returnKeyType='done'
            onSubmitEditing={Keyboard.dismiss}
          />

          <View style={styles.dropdownContainer}>
            <Pressable style={styles.dropdownButton} onPress={() => openModal('dompetAsal')}>
              <Text
                style={[
                  styles.dropdownButtonText,
                  selectedDompetAsal && styles.dropdownButtonTextSelected,
                ]}
              >
                {selectedDompetAsal?.nama || (isTransfer ? 'Pilih Dompet Asal' : 'Pilih Dompet')}
              </Text>
              <MaterialIcons name='arrow-drop-down' size={24} color='#666' />
            </Pressable>
          </View>

          {isTransfer && (
            <View style={styles.dropdownContainer}>
              <Pressable style={styles.dropdownButton} onPress={() => openModal('dompetTujuan')}>
                <Text
                  style={[
                    styles.dropdownButtonText,
                    selectedDompetTujuan && styles.dropdownButtonTextSelected,
                  ]}
                >
                  {selectedDompetTujuan?.nama || 'Pilih Dompet Tujuan'}
                </Text>
                <MaterialIcons name='arrow-drop-down' size={24} color='#666' />
              </Pressable>
            </View>
          )}

          {!isTransfer && (
            <>
              <View style={styles.dropdownContainer}>
                <Pressable style={styles.dropdownButton} onPress={() => openModal('kategori')}>
                  <Text
                    style={[
                      styles.dropdownButtonText,
                      selectedKategori && styles.dropdownButtonTextSelected,
                    ]}
                  >
                    {selectedKategori?.nama || 'Pilih Kategori'}
                  </Text>
                  <MaterialIcons name='arrow-drop-down' size={24} color='#666' />
                </Pressable>
              </View>

              {selectedKategori && subKategoriDbList.length > 0 && (
                <View style={styles.dropdownContainer}>
                  <Pressable style={styles.dropdownButton} onPress={() => openModal('subKategori')}>
                    <Text
                      style={[
                        styles.dropdownButtonText,
                        selectedSubKategori && styles.dropdownButtonTextSelected,
                      ]}
                    >
                      {selectedSubKategori?.nama || 'Pilih Sub-Kategori'}
                    </Text>
                    <MaterialIcons name='arrow-drop-down' size={24} color='#666' />
                  </Pressable>
                </View>
              )}
            </>
          )}

          <InputTeks
            label='Catatan'
            value={catatan}
            onChangeText={setCatatan}
            placeholder='Masukkan catatan (opsional)'
            multiline
            numberOfLines={3}
            textAlignVertical='top'
            returnKeyType='done'
          />
        </View>
      </ScrollView>

      <TombolSimpan onPress={handleSimpan} />

      <ModalDropDown
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`Pilih ${modalType.replace(/([A-Z])/g, ' $1')}`}
        data={getModalData()}
        renderItem={renderModalItem}
        position='bottom'
        animationType='slide'
      />
    </SafeAreaViewCustom>
  );
}
const styles = StyleSheet.create({
  // Jenis Transaksi Section
  jenisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  jenisButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  jenisButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  jenisText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  jenisTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // ScrollView Container
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingBottom: 1,
  },

  // DateTime Section
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dateButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

  // Form Container
  formContainer: {
    gap: 16,
  },

  // Dropdown Section
  dropdownContainer: {
    marginBottom: 4,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  dropdownButtonTextSelected: {
    color: '#374151',
    fontWeight: '500',
  },

  // Modal Styles
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalItemText: {
    fontSize: 16,
    color: '#374151',
  },
  modalItemTextSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
});
