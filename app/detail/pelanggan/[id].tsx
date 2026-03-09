// Path: /home/user/wifi-v3/app/detail/pelanggan/[id].tsx

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Mengimpor operasi database
import { operasiPelanggan, Pelanggan } from '../../../database/operasi/pelanggan-operasi';

export default function HalamanDetailPelanggan() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Menangkap ID dari parameter URL
  const db = useSQLiteContext();

  const [pelanggan, setPelanggan] = useState<Pelanggan | null>(null);
  const [loading, setLoading] = useState(true);

  // Inisialisasi fungsi operasi database
  const pelangganDb = operasiPelanggan(db);

  useEffect(() => {
    let isCancelled = false;

    const muatDetailPelanggan = async () => {
      try {
        if (!isCancelled) setLoading(true);
        // Mengkonversi id string ke number sesuai kebutuhan SQLite
        const data = await pelangganDb.ambilPelangganBerdasarkanId(Number(id));
        if (!isCancelled) setPelanggan(data);
      } catch (error) {
        console.error('Gagal memuat detail pelanggan:', error);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    if (id) muatDetailPelanggan();

    return () => {
      isCancelled = true;
    };
  }, [id, pelangganDb]);

  // Fungsi untuk aksi cepat (Telepon & WA)
  const handleContact = (type: 'tel' | 'wa') => {
    if (!pelanggan?.no_hp) return;
    const cleanPhone = pelanggan.no_hp.replace(/[^0-9]/g, '');
    const url = type === 'tel' ? `tel:${cleanPhone}` : `https://wa.me/${cleanPhone}`;
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <View style={styles.centerLoader}>
        <ActivityIndicator size='large' color='#007AFF' />
        <Text style={{ marginTop: 10, color: '#666' }}>Memuat data...</Text>
      </View>
    );
  }

  if (!pelanggan) {
    return (
      <View style={styles.centerLoader}>
        <Text style={{ color: '#FF5252', fontWeight: 'bold' }}>Pelanggan tidak ditemukan!</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#007AFF' }}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Bagian Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name='chevron-left' size={28} color={'#333'} />
        </Pressable>
        <Text style={styles.headerTitle}>Detail Pelanggan</Text>
        <Pressable style={styles.editButton}>
          <MaterialIcons name='edit' size={22} color={'#007AFF'} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Kartu Profil Utama */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <MaterialIcons name='person' size={50} color={'#FFFFFF'} />
          </View>
          <Text style={styles.namaText}>{pelanggan.nama}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Pelanggan Terdaftar</Text>
          </View>
        </View>

        {/* Informasi Detail */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informasi Kontak</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconWrapper}>
              <MaterialIcons name='place' size={20} color={'#666'} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={styles.label}>Alamat Lengkap</Text>
              <Text style={styles.value}>{pelanggan.alamat}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconWrapper}>
              <MaterialIcons name='phone' size={20} color={'#666'} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={styles.label}>Nomor WhatsApp / HP</Text>
              <Text style={styles.value}>{pelanggan.no_hp || 'Tidak ada nomor'}</Text>
            </View>
          </View>
        </View>

        {/* Tombol Aksi Cepat */}
        <View style={styles.actionContainer}>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: '#25D366' }]}
            onPress={() => handleContact('wa')}
          >
            <MaterialIcons name='chat' size={20} color={'#fff'} />
            <Text style={styles.actionBtnText}>WhatsApp</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: '#007AFF' }]}
            onPress={() => handleContact('tel')}
          >
            <MaterialIcons name='call' size={20} color={'#fff'} />
            <Text style={styles.actionBtnText}>Telepon</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  backButton: {
    padding: 4,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#EBF5FF',
    borderRadius: 10,
  },
  scrollContent: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  namaText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#666',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    lineHeight: 22,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
});
