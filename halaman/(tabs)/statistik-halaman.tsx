// path: halaman/(tabs)/statistik.tsx
// Penjelasan: Halaman ini menampilkan visualisasi statistik keuangan,
// termasuk grafik saldo berjalan dan ringkasan rata-rata pendapatan dan pengeluaran.

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useStatistikKeuangan } from '@/hooks/transaksi/use-statistik-keuangan';
import { formatAngkaSingkat, formatRupiah } from '@/utils/format/format-angka';
import {
  ActivityIndicator,
  Dimensions, // Impor Platform untuk deteksi OS
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function StatistikScreen() {
  // ... (sisa fungsi komponen tetap sama)
  const {
    dataGrafik,
    saldoTerakhir,
    rataHarian,
    rataMingguan,
    rataBulanan,
    rataHarianPengeluaran,
    rataMingguanPengeluaran,
    rataBulananPengeluaran,
    isLoading,
  } = useStatistikKeuangan();

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size='large' />
        <ThemedText>Mengkalkulasi statistik...</ThemedText>
      </ThemedView>
    );
  }

  const dataGrafikFinal =
    dataGrafik && dataGrafik.labels.length > 0
      ? dataGrafik
      : { labels: ['Mulai'], datasets: [{ data: [0] }] };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.innerContainer}>
        <ThemedText type='title' style={styles.header}>
          Grafik Saldo
        </ThemedText>
        <ThemedText style={styles.subHeader}>
          Visualisasi arus kas (pemasukan - pengeluaran) Anda dari waktu ke waktu.
        </ThemedText>

        <LineChart
          data={dataGrafikFinal}
          width={screenWidth - 32}
          height={220}
          yAxisInterval={1}
          chartConfig={chartConfig}
          // bezier // Dinonaktifkan untuk memperbaiki bug rendering nilai negatif
          style={styles.chart}
          formatYLabel={
            (yLabel) => formatAngkaSingkat(parseFloat(yLabel)).padStart(8) // Beri padding agar lebar sama
          }
        />

        <View style={styles.infoCard}>
          <ThemedText style={styles.cardTitle}>Ringkasan Keuangan</ThemedText>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Saldo Terakhir</ThemedText>
            <ThemedText style={[styles.infoValue, styles.saldoValue]}>
              {formatRupiah(saldoTerakhir)}
            </ThemedText>
          </View>

          <View style={styles.separator} />

          <ThemedText style={styles.sectionTitle}>Rata-Rata Pemasukan</ThemedText>
          {/* Rata-Rata Pemasukan */}
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Per Hari</ThemedText>
            <ThemedText style={styles.infoValue}>{formatRupiah(rataHarian)}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Per Minggu</ThemedText>
            <ThemedText style={styles.infoValue}>{formatRupiah(rataMingguan)}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Per Bulan</ThemedText>
            <ThemedText style={styles.infoValue}>{formatRupiah(rataBulanan)}</ThemedText>
          </View>

          <View style={styles.separator} />

          <ThemedText style={styles.sectionTitle}>Rata-Rata Pengeluaran</ThemedText>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Per Hari</ThemedText>
            <ThemedText style={[styles.infoValue, styles.pengeluaranValue]}>
              {formatRupiah(rataHarianPengeluaran)}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Per Minggu</ThemedText>
            <ThemedText style={[styles.infoValue, styles.pengeluaranValue]}>
              {formatRupiah(rataMingguanPengeluaran)}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Per Bulan</ThemedText>
            <ThemedText style={[styles.infoValue, styles.pengeluaranValue]}>
              {formatRupiah(rataBulananPengeluaran)}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
}
// Konfigurasi tampilan untuk grafik LineChart
const chartConfig = {
  backgroundColor: '#FFFFFF',
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  decimalPlaces: 0,
  // Mengubah warna garis dan label utama menjadi biru agar kontras
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, 
  // Mengubah warna label sumbu menjadi hitam agar terbaca
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, 
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    // Mengubah warna titik menjadi biru agar serasi
    stroke: '#007AFF', 
  },
};

// Kumpulan gaya untuk halaman statistik dan komponennya
const styles = StyleSheet.create({
  // Gaya untuk container utama
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 16,
    paddingBottom: 40, // Ruang ekstra di bawah
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  // Gaya untuk header
  header: {
    marginBottom: 4,
  },
  subHeader: {
    marginBottom: 16,
    fontSize: 14,
    color: 'gray',
  },

  // Gaya untuk komponen Grafik Saldo
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },

  // Gaya untuk Komponen Kartu Informasi Keuangan
  infoCard: {
    backgroundColor: '#fff', // Sedikit lebih cerah
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#222',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
  },
  infoLabel: {
    fontSize: 14,
    color: '#555',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
  },
  saldoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a', // Hijau untuk saldo positif
  },
  pengeluaranValue: {
    color: '#dc2626', // Merah untuk pengeluaran
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 8,
  },
});
