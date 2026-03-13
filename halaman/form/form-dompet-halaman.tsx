import SafeAreaViewCustom from '@/components/komponen-react/safe-area-view-custom';
import { TombolEdit, TombolKembali, TombolSimpan } from '@/components/tombol';
import { MaterialIcons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HalamanFormDompet() {
  return (
    <SafeAreaViewCustom>
      <View style={styles.header}>
        <TombolKembali />
        <Text style={styles.judulHalaman}>Formulir Dompet</Text>
        <TombolEdit onPress={() => ''} />
      </View>

      <View style={styles.wadahForm}>
        <Text style={styles.label}>Nama Dompet</Text>
        <TextInput style={styles.input} placeholder='Contoh: Dompet Utama, Dana, GoPay' />
        <Text style={styles.label}>Saldo Awal</Text>
        <TextInput style={styles.input} placeholder='Contoh: 50000' keyboardType='numeric' />
      </View>

      {/* Tombol Simpan diposisikan di bawah */}
      <View style={styles.wadahTombolSimpan}>
        <TombolSimpan onPress={() => console.log('Simpan Dompet')} />
      </View>

      <Modal visible={false} transparent={true} animationType='fade'>
        <View style={styles.pusatModal}>
          <View style={styles.kontenModal}>
            <View style={styles.headerModal}>
              <Text style={styles.judulModal}>Pilih Dompet</Text>
              <Pressable onPress={() => ''}>
                <MaterialIcons name='close' size={24} color={'#555'} />
              </Pressable>
            </View>
            <Pressable onPress={() => ''} style={styles.itemModal}>
              <Text style={styles.textItemModal}>nama dompet</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaViewCustom>
  );
}

const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  judulHalaman: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  // Wadah Form
  wadahForm: {
    padding: 20,
    flex: 1, // Agar form mengisi ruang yang tersedia
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },

  // Tombol Simpan
  wadahTombolSimpan: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },

  // Modal
  pusatModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Latar belakang semi-transparan
  },
  kontenModal: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  judulModal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemModal: {
    paddingVertical: 12,
  },
  textItemModal: {
    fontSize: 16,
    color: '#444',
  },
});
