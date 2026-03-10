// Path: ~/wifi-v3/app/form/form-transaksi.tsx
import HeaderCustom from '@/components/header-custom';
import ModalDropDown from '@/components/modal/modal';
import { TombolKembali, TombolSimpan } from '@/components/tombol';
import { Dompet, operasiDompet } from '@/database/operasi/dompet-operasi';
import { Kategori, operasiKategori } from '@/database/operasi/kategori-operasi';
import { SubKategori, operasiSubKategori } from '@/database/operasi/sub-kategori-operasi';
import { useDateTime } from '@/hooks/ambil-tanggal-dan-waktu-terbaru';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import InputTeks from '../../components/komponen-react/input-teks';
import SafeAreaViewCustom from '../../components/komponen-react/safe-area-view-custom';

export default function FormTransaksi() {
  const [keterangan, setKeterangan] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [catatan, setCatatan] = useState('');
  const [jenisTransaksi, setJenisTransaksi] = useState('pemasukan');
  const { tanggal, jam } = useDateTime();

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

  // Mengambil data dompet saat layar dibuka
  useFocusEffect(
    useCallback(() => {
      operasiDompet(db).getAll().then(setDompetList);
    }, [db])
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

  const handleSimpan = () => {
    console.log({
      jenisTransaksi,
      keterangan,
      jumlah,
      catatan,
      tanggal,
      jam,
      dompetAsal: selectedDompetAsal?.nama,
      dompetTujuan: selectedDompetTujuan?.nama,
      kategori: selectedKategori?.nama,
      subKategori: selectedSubKategori?.nama,
    });
    router.back();
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
      >
        <View style={styles.dateTimeContainer}>
          <Pressable style={styles.dateButton}>
            <MaterialIcons name='calendar-today' size={20} color='#666' />
            <Text style={styles.dateTimeText}>{tanggal}</Text>
          </Pressable>
          <Pressable style={styles.timeButton}>
            <MaterialIcons name='lock-clock' size={20} color='#666' />
            <Text style={styles.dateTimeText}>{jam}</Text>
          </Pressable>
        </View>

        <View style={styles.formContainer}>
          <InputTeks
            label='Keterangan'
            value={keterangan}
            onChangeText={setKeterangan}
            placeholder='Masukkan keterangan'
          />
          <InputTeks
            label='Jumlah'
            value={jumlah}
            onChangeText={setJumlah}
            placeholder='Masukkan jumlah'
            keyboardType='numeric'
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
  jenisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 1,
  },
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
  formContainer: {
    gap: 16,
  },
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
