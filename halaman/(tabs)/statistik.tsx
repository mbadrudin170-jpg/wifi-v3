// path: halaman/(tabs)/statistik.tsx
// Penjelasan: Halaman ini menampilkan visualisasi statistik keuangan,
// termasuk grafik saldo berjalan dan ringkasan rata-rata pendapatan dan pengeluaran.

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useStatistikKeuangan } from '@/hooks/transaksi/use-statistik-keuangan';
import { formatAngkaSingkat, formatRupiah } from '@/utils/format/format-angka';
import {
  ActivityIndicator,
  Dimensions,
  Platform, // Impor Platform untuk deteksi OS
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

          <ThemedText style={styles.rataTitle}>Rata-Rata Pemasukan</ThemedText>
          {/* Rata-Rata Pemasukan */}
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Per Hari</ThemedText>
            <ThemedText style={[styles.infoValue, styles.pemasukanValue]}>
              {formatRupiah(rataHarian)}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Per Minggu</ThemedText>
            <ThemedText style={[styles.infoValue, styles.pemasukanValue]}>
              {formatRupiah(rataMingguan)}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Per Bulan</ThemedText>
            <ThemedText style={[styles.infoValue, styles.pemasukanValue]}>
              {formatRupiah(rataBulanan)}
            </ThemedText>
          </View>

          <View style={styles.separator} />

          <ThemedText style={styles.rataTitle}>Rata-Rata Pengeluaran</ThemedText>

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

// Konfigurasi tampilan untuk grafik
const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#4ade80',
  },
  // Gunakan font monospace yang sesuai dengan platform
  propsForLabels: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
  },
};

const styles = StyleSheet.create({
  // Container utama
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header & Subheader
  header: {
    marginBottom: 4,
  },
  subHeader: {
    marginBottom: 16,
    fontSize: 14,
    color: 'gray',
  },

  // Grafik
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },

  // Kartu Ringkasan
  infoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },

  // Judul bagian rata-rata
  rataTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },

  // Baris info
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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

  // Nilai khusus
  saldoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  pemasukanValue: {
    color: '#16a34a', // hijau
    fontWeight: '600',
  },
  pengeluaranValue: {
    color: '#dc2626',
  },

  // Separator
  separator: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 8,
  },
});
