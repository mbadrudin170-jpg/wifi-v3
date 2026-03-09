// Path: /home/user/wifi-v3/app/detail/detail-transaksi.tsx/[id].tsx

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { TransaksiLengkap } from '@/database/operasi/transaksi-operasi';
import { formatAngka } from '@/utils/format/format-angka';
import { formatTanggal } from '@/utils/format/format-tanggal';

export default function DetailTransaksiScreen() {
  const { id } = useLocalSearchParams();
  const db = useSQLiteContext();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TransaksiLengkap | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const muatDetail = useCallback(async () => {
    // FIX: Pastikan ID adalah string tunggal untuk menghindari error TypeScript
    const validId = Array.isArray(id) ? id[0] : id;

    if (!validId) return;

    try {
      if (isMountedRef.current) setLoading(true);
      const query = `
        SELECT 
          t.*, 
          p.nama as nama_pelanggan, 
          pkt.nama as nama_paket, 
          pkt.harga as harga_paket,
          k.nama as nama_kategori,
          d.nama as nama_dompet
        FROM transaksi t
        LEFT JOIN pelanggan p ON t.id_pelanggan = p.id
        LEFT JOIN paket pkt ON t.id_paket = pkt.id
        LEFT JOIN kategori k ON t.id_kategori = k.id
        LEFT JOIN dompet d ON t.id_dompet = d.id
        WHERE t.id = ?
      `;

      const result = await db.getFirstAsync<
        TransaksiLengkap & { nama_kategori: string; nama_dompet: string }
      >(query, [validId]);

      if (result) {
        if (isMountedRef.current) setData(result);
      } else {
        Alert.alert('Error', 'Data transaksi tidak ditemukan');
        router.back();
      }
    } catch (error) {
      console.error('Gagal memuat detail transaksi:', error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [db, id, router]);

  useEffect(() => {
    muatDetail();
  }, [muatDetail]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size='large' color={Colors.light.tint} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          headerShown: true, // Diaktifkan agar tombol 'Back' muncul
          title: 'Detail Transaksi',
          headerShadowVisible: false,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.labelHeader}>Nominal Transaksi</Text>
          <Text
            style={[
              styles.nominal,
              data?.tipe === 'Pengeluaran' ? styles.teksMerah : styles.teksHijau,
            ]}
          >
            {data?.tipe === 'Pengeluaran' ? '- ' : '+ '}
            {formatAngka(data?.saldo || 0)}
          </Text>
          <View
            style={[
              styles.badgeTipe,
              data?.tipe === 'Pengeluaran' ? styles.bgMerah : styles.bgHijau,
            ]}
          >
            <Text style={styles.teksBadge}>{data?.tipe}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Utama</Text>
          <ItemDetail label='Deskripsi' value={data?.deskripsi} ikon='description' />
          <ItemDetail
            label='Tanggal'
            value={data?.tanggal ? formatTanggal(new Date(data.tanggal)) : '-'}
            ikon='event'
          />
          <ItemDetail
            label='Kategori'
            value={(data as any)?.nama_kategori || 'Tanpa Kategori'}
            ikon='category'
          />
          <ItemDetail
            label='Sumber Dana / Dompet'
            value={(data as any)?.nama_dompet || 'Kas'}
            ikon='account-balance-wallet'
          />
        </View>

        {data?.id_pelanggan && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Pelanggan & Paket</Text>
            <ItemDetail label='Nama Pelanggan' value={data.nama_pelanggan} ikon='person' />
            <ItemDetail label='Paket WiFi' value={data.nama_paket} ikon='wifi' />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catatan</Text>
          <Text style={styles.catatanText}>{data?.catatan || 'Tidak ada catatan tambahan.'}</Text>
        </View>

        <Text style={styles.footerInfo}>
          ID Transaksi: {data?.id} • Dibuat: {data?.dibuat}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const ItemDetail = ({ label, value, ikon }: { label: string; value: any; ikon: any }) => (
  <View style={styles.itemRow}>
    <View style={styles.iconWrapper}>
      <MaterialIcons name={ikon} size={20} color='#666' />
    </View>
    <View style={styles.textWrapper}>
      <Text style={styles.labelItem}>{label}</Text>
      <Text style={styles.valueItem}>{value || '-'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerCard: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  labelHeader: { fontSize: 14, color: '#666', marginBottom: 8 },
  nominal: { fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
  teksHijau: { color: '#2E7D32' },
  teksMerah: { color: '#C62828' },
  badgeTipe: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  bgHijau: { backgroundColor: '#E8F5E9' },
  bgMerah: { backgroundColor: '#FFEBEE' },
  teksBadge: { fontSize: 12, fontWeight: 'bold' },
  section: { backgroundColor: 'white', marginTop: 12, padding: 16 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.tint,
    paddingLeft: 8,
  },
  itemRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'center' },
  iconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textWrapper: { flex: 1 },
  labelItem: { fontSize: 12, color: '#888' },
  valueItem: { fontSize: 15, color: '#333', fontWeight: '500' },
  catatanText: { fontSize: 14, color: '#555', lineHeight: 20, fontStyle: 'italic' },
  footerInfo: { textAlign: 'center', marginVertical: 20, fontSize: 11, color: '#AAA' },
});
