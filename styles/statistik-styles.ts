// path: styles/statistik-styles.ts
// Penjelasan: File ini berisi semua styling dan konfigurasi visual 
// yang digunakan oleh halaman statistik dan komponen-komponennya.

import { StyleSheet } from "react-native";

// Konfigurasi tampilan untuk grafik LineChart
export const chartConfig = {
  backgroundColor: "#1e2923",
  backgroundGradientFrom: "#08130D",
  backgroundGradientTo: "#1A2B21",
  decimalPlaces: 0, 
  color: (opacity = 1) => `rgba(134, 239, 172, ${opacity})`, // Warna garis dan label utama
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Warna label pada sumbu
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#4ade80", // Warna titik pada grafik
  },
};

// Kumpulan gaya untuk halaman statistik dan komponennya
export const styles = StyleSheet.create({
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
    justifyContent: "center",
    alignItems: "center",
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
    shadowColor: "#000",
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
    color: '#222'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333'
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    color: '#dc2626' // Merah untuk pengeluaran
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 8,
  },
});