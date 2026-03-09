// Path: app/form/form-pelanggan.tsx

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// MENGGUNAKAN RELATIVE PATH UNTUK MENGHINDARI CRASH ALIAS
import { ThemedText } from '@/components/themed-text';
import TombolSimpan from '@/components/tombol/tombol-simpan';
import { operasiPelanggan } from '../../database/operasi/pelanggan-operasi';
import { formatNoHp } from '../../utils/format-no-hp';

export default function FormPelanggan() {
  const router = useRouter();
  const db = useSQLiteContext();
  const pelangganDb = operasiPelanggan(db);

  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noHp, setNoHp] = useState('');
  const [macAdress, setMacAdress] = useState('');
  const [loading, setLoading] = useState(false);

  // Ref untuk navigasi keyboard
  const refNoHp = useRef<TextInput>(null);
  const refMac = useRef<TextInput>(null);
  const refAlamat = useRef<TextInput>(null);

  // Fungsi untuk membersihkan nomor HP dari karakter non-numerik
  const bersihkanNoHp = (nomor: string) => nomor.replace(/[^0-9]/g, '');

  const handleSimpan = async () => {
    // 1. Validasi Input
    if (!nama.trim() || !alamat.trim()) {
      console.warn('[Validation] Nama atau Alamat kosong');
      Alert.alert('Peringatan', 'Nama dan Alamat wajib diisi.');
      return;
    }

    try {
      setLoading(true);

      const dataBaru = {
        nama: nama.trim(),
        no_hp: bersihkanNoHp(noHp) || null,
        alamat: alamat.trim(),
        mac_adress: macAdress.trim() || null,
      };

      console.log('[FormPelanggan] Mencoba menyimpan data:', dataBaru);

      // 2. Eksekusi Simpan ke Database
      const result = await pelangganDb.tambahPelanggan(dataBaru);

      console.log('[Database] Berhasil disimpan dengan ID:', result);

      Alert.alert('Berhasil', 'Data pelanggan berhasil disimpan', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      // 3. Log Error Detail
      console.error('================ ERROR SIMPAN PELANGGAN ================');
      console.error('Pesan Error:', error?.message);
      console.error('Stack Trace:', error?.stack);
      console.error('Data Terkait:', { nama, noHp, macAdress, alamat });
      console.error('========================================================');

      Alert.alert(
        'Error Simpan',
        `Gagal menyimpan: ${error?.message || 'Terjadi kesalahan sistem'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name='close' size={24} color={'#333'} />
        </Pressable>
        <Text style={styles.headerTitle}>Pelanggan Baru</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles.formContainer}>
            {/* Input Nama */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Lengkap *</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name='person-outline'
                  size={20}
                  color={'#999'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={nama}
                  onChangeText={setNama}
                  placeholder='Masukkan nama pelanggan'
                  autoCapitalize='words'
                  returnKeyType='next'
                  onSubmitEditing={() => refNoHp.current?.focus()}
                />
              </View>
            </View>

            {/* Input No HP */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nomor WhatsApp / HP</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name='phone-android'
                  size={20}
                  color={'#999'}
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={refNoHp}
                  style={styles.input}
                  value={noHp}
                  onChangeText={(text) => setNoHp(formatNoHp(text))}
                  placeholder='Contoh: 0812-3456-7890'
                  keyboardType='phone-pad'
                  returnKeyType='next'
                  onSubmitEditing={() => refMac.current?.focus()}
                />
              </View>
            </View>

            {/* Input MAC Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>MAC Address</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name='router' size={20} color={'#999'} style={styles.inputIcon} />
                <TextInput
                  ref={refMac}
                  style={styles.input}
                  value={macAdress}
                  onChangeText={setMacAdress}
                  placeholder='Contoh: AA:BB:CC:DD:EE:FF'
                  autoCapitalize='characters'
                  onSubmitEditing={() => refAlamat.current?.focus()}
                />
              </View>
            </View>

            {/* Input Alamat */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alamat *</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <MaterialIcons
                  name='place'
                  size={20}
                  color={'#999'}
                  style={[styles.inputIcon, { marginTop: 12 }]}
                />
                <TextInput
                  ref={refAlamat}
                  style={[styles.input, styles.textArea]}
                  value={alamat}
                  onChangeText={setAlamat}
                  placeholder='Contoh: Jl. Merdeka No. 10'
                  multiline
                  numberOfLines={3}
                  textAlignVertical='top'
                />
              </View>
            </View>

            <Text style={styles.infoText}>* Wajib diisi</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TombolSimpan teks='Simpan' onPress={handleSimpan} />
          <Pressable
            style={[styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSimpan}
            disabled={loading}
          >
            <ThemedText type='default' style={styles.saveButtonText}>
              {loading ? 'Menyimpan...' : 'Simpan Pelanggan'}
            </ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  backButton: { padding: 8 },
  scrollContent: { padding: 20 },
  formContainer: { flex: 1 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 8, marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 15, color: '#333' },
  textAreaWrapper: { alignItems: 'flex-start', minHeight: 100 },
  textArea: { height: 90, paddingTop: 12 },
  infoText: { fontSize: 12, color: '#999', fontStyle: 'italic' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: '#FFFFFF' },
  saveButton: {
    backgroundColor: '#007AFF',
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  buttonDisabled: { backgroundColor: '#A0CCFF' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
