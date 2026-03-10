// Path: ~/wifi-v3/app/form/form-transaksi.tsx
import HeaderCustom from '@/components/header-custom';
import ModalDropDown from '@/components/modal/modal';
import { TombolKembali, TombolSimpan } from '@/components/tombol';
import { Dompet, operasiDompet } from '@/database/operasi/dompet-operasi';
import { Kategori, operasiKategori } from '@/database/operasi/kategori-operasi';
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

  // State untuk modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'dompetAsal' | 'dompetTujuan' | 'kategori'>(
    'dompetAsal'
  );
  const [selectedDompetAsal, setSelectedDompetAsal] = useState('');
  const [selectedDompetTujuan, setSelectedDompetTujuan] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');

  const db = useSQLiteContext();

  // Mengambil data dompet saat layar dibuka
  useFocusEffect(
    useCallback(() => {
      async function loadDompets() {
        const dompetOps = operasiDompet(db);
        const result = await dompetOps.getAll();
        setDompetList(result);
      }
      loadDompets();
    }, [db])
  );

  // Mengambil data kategori berdasarkan jenis transaksi
  useEffect(() => {
    async function loadKategori() {
      if (jenisTransaksi === 'pemasukan' || jenisTransaksi === 'pengeluaran') {
        const tipeKategori = jenisTransaksi === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran';
        const kategoriOps = operasiKategori(db);
        const result = await kategoriOps.getByType(tipeKategori);
        setKategoriDbList(result);
      } else {
        setKategoriDbList([]); // Kosongkan jika tipe transfer
      }
      // Reset pilihan kategori saat jenis transaksi berubah
      setSelectedKategori('');
    }

    loadKategori();
  }, [jenisTransaksi, db]);

  const handleSimpan = () => {
    console.log({
      jenisTransaksi,
      keterangan,
      jumlah,
      catatan,
      tanggal,
      jam,
      dompetAsal: selectedDompetAsal,
      dompetTujuan: selectedDompetTujuan,
      kategori: selectedKategori,
    });
    router.back();
  };

  const openModal = (type: 'dompetAsal' | 'dompetTujuan' | 'kategori') => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleSelectItem = (item: Dompet | Kategori) => {
    const itemName = item.nama;
    switch (modalType) {
      case 'dompetAsal':
        setSelectedDompetAsal(itemName);
        if (itemName === selectedDompetTujuan) {
          setSelectedDompetTujuan('');
        }
        break;
      case 'dompetTujuan':
        setSelectedDompetTujuan(itemName);
        if (itemName === selectedDompetAsal) {
          setSelectedDompetAsal('');
        }
        break;
      case 'kategori':
        setSelectedKategori(itemName);
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
        return dompetList.filter((d) => d.nama !== selectedDompetTujuan);
      case 'dompetTujuan':
        return dompetList.filter((d) => d.nama !== selectedDompetAsal);
      case 'kategori':
        return kategoriDbList;
      default:
        return [];
    }
  };

  const renderModalItem = ({ item }: { item: Dompet | Kategori }) => {
    const itemName = item.nama;
    let selectedValue = '';
    switch (modalType) {
      case 'dompetAsal':
        selectedValue = selectedDompetAsal;
        break;
      case 'dompetTujuan':
        selectedValue = selectedDompetTujuan;
        break;
      case 'kategori':
        selectedValue = selectedKategori;
        break;
    }
    const isSelected = itemName === selectedValue;

    return (
      <Pressable style={styles.modalItem} onPress={() => handleSelectItem(item)}>
        <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
          {itemName}
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
                {selectedDompetAsal || (isTransfer ? 'Pilih Dompet Asal' : 'Pilih Dompet')}
              </Text>
              <MaterialIcons name='arrow-drop-down' size={24} color='#666' />
            </Pressable>
          </View>

          {!isTransfer && (
            <View style={styles.dropdownContainer}>
              <Pressable style={styles.dropdownButton} onPress={() => openModal('kategori')}>
                <Text
                  style={[
                    styles.dropdownButtonText,
                    selectedKategori && styles.dropdownButtonTextSelected,
                  ]}
                >
                  {selectedKategori || 'Pilih Kategori'}
                </Text>
                <MaterialIcons name='arrow-drop-down' size={24} color='#666' />
              </Pressable>
            </View>
          )}

          {isTransfer && (
            <View style={styles.dropdownContainer}>
              <Pressable style={styles.dropdownButton} onPress={() => openModal('dompetTujuan')}>
                <Text
                  style={[
                    styles.dropdownButtonText,
                    selectedDompetTujuan && styles.dropdownButtonTextSelected,
                  ]}
                >
                  {selectedDompetTujuan || 'Pilih Dompet Tujuan'}
                </Text>
                <MaterialIcons name='arrow-drop-down' size={24} color='#666' />
              </Pressable>
            </View>
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
        title={
          modalType === 'dompetAsal'
            ? 'Pilih Dompet Asal'
            : modalType === 'dompetTujuan'
              ? 'Pilih Dompet Tujuan'
              : 'Pilih Kategori'
        }
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
