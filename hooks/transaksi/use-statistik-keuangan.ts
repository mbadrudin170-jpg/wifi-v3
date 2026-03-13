// path: hooks/transaksi/use-statistik-keuangan.ts
// Penjelasan: Hook ini menghitung semua statistik kunci: saldo, rata-rata pemasukan, dan rata-rata pengeluaran.
// Versi ini lebih aman dengan mengabaikan transaksi tanpa tanggal.

import { operasiTransaksi, TransaksiLengkap } from '@/database/operasi/transaksi-operasi';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

export interface DataGrafikSaldo {
  labels: string[];
  datasets: [{ data: number[] }];
}

const dapatkanNomorMinggu = (tgl: Date) => {
  const tanggalMulaiTahun = new Date(tgl.getFullYear(), 0, 1);
  const selisihHari = Math.floor((tgl.getTime() - tanggalMulaiTahun.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((selisihHari + tanggalMulaiTahun.getDay() + 1) / 7);
};

export function useStatistikKeuangan() {
  const db = useSQLiteContext();
  const [dataGrafik, setDataGrafik] = useState<DataGrafikSaldo | null>(null);
  const [saldoTerakhir, setSaldoTerakhir] = useState(0);
  const [rataHarian, setRataHarian] = useState(0);
  const [rataMingguan, setRataMingguan] = useState(0);
  const [rataBulanan, setRataBulanan] = useState(0);
  // TAMBAHAN: State untuk rata-rata pengeluaran
  const [rataHarianPengeluaran, setRataHarianPengeluaran] = useState(0);
  const [rataMingguanPengeluaran, setRataMingguanPengeluaran] = useState(0);
  const [rataBulananPengeluaran, setRataBulananPengeluaran] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const kalkulasiSemuaStatistik = async () => {
        // Jangan set dataGrafik ke null agar data lama tetap tampil saat refresh
        
        const semuaTransaksi: TransaksiLengkap[] = await operasiTransaksi(db).ambilSemuaLengkap();
        const transaksiValid = semuaTransaksi.filter(t => t.tanggal);

        if (transaksiValid.length === 0) {
          setDataGrafik({ labels: ["Mulai"], datasets: [{ data: [0] }] });
          setSaldoTerakhir(0);
          setRataHarian(0);
          setRataMingguan(0);
          setRataBulanan(0);
          // TAMBAHAN: Reset state pengeluaran
          setRataHarianPengeluaran(0);
          setRataMingguanPengeluaran(0);
          setRataBulananPengeluaran(0);
          setIsLoading(false); // Selesai loading
          return;
        }

        // BAGIAN 1: KALKULASI SALDO BERJALAN
        const transaksiTerurut = [...transaksiValid].sort(
          (a, b) => new Date(a.tanggal!).getTime() - new Date(b.tanggal!).getTime()
        );

        let saldoBerjalan = 0;
        const labelsGrafik: string[] = [];
        const dataSaldo: number[] = [];
        const tanggalTercatat: { [key: string]: boolean } = {};

        transaksiTerurut.forEach(transaksi => {
          saldoBerjalan += (transaksi.tipe === 'pemasukan' ? transaksi.jumlah : -transaksi.jumlah);
          const tanggal = new Date(transaksi.tanggal!); 
          const labelTanggal = `${String(tanggal.getDate()).padStart(2, '0')}/${String(tanggal.getMonth() + 1).padStart(2, '0')}`;
          if (!tanggalTercatat[labelTanggal]) {
            labelsGrafik.push(labelTanggal);
            dataSaldo.push(saldoBerjalan);
            tanggalTercatat[labelTanggal] = true;
          } else {
            dataSaldo[dataSaldo.length - 1] = saldoBerjalan;
          }
        });

        setDataGrafik({ labels: labelsGrafik, datasets: [{ data: dataSaldo }] });
        setSaldoTerakhir(saldoBerjalan);

        // BAGIAN 2: KALKULASI RATA-RATA PEMASUKAN
        const pemasukanHarian: { [key: string]: number } = {};
        const pemasukanMingguan: { [key: string]: number } = {};
        const pemasukanBulanan: { [key: string]: number } = {};
        let totalPemasukan = 0;
        const transaksiPemasukan = transaksiValid.filter(t => t.tipe === 'pemasukan');

        transaksiPemasukan.forEach(transaksi => {
          const tanggal = new Date(transaksi.tanggal!); 
          totalPemasukan += transaksi.jumlah;
          const kunciHari = tanggal.toISOString().split('T')[0];
          const kunciMinggu = `${tanggal.getFullYear()}-W${dapatkanNomorMinggu(tanggal)}`;
          const kunciBulan = `${tanggal.getFullYear()}-${String(tanggal.getMonth() + 1).padStart(2, '0')}`;
          pemasukanHarian[kunciHari] = (pemasukanHarian[kunciHari] || 0) + transaksi.jumlah;
          pemasukanMingguan[kunciMinggu] = (pemasukanMingguan[kunciMinggu] || 0) + transaksi.jumlah;
          pemasukanBulanan[kunciBulan] = (pemasukanBulanan[kunciBulan] || 0) + transaksi.jumlah;
        });

        const jumlahHariPemasukan = Object.keys(pemasukanHarian).length;
        const jumlahMingguPemasukan = Object.keys(pemasukanMingguan).length;
        const jumlahBulanPemasukan = Object.keys(pemasukanBulanan).length;

        setRataHarian(jumlahHariPemasukan > 0 ? totalPemasukan / jumlahHariPemasukan : 0);
        setRataMingguan(jumlahMingguPemasukan > 0 ? totalPemasukan / jumlahMingguPemasukan : 0);
        setRataBulanan(jumlahBulanPemasukan > 0 ? totalPemasukan / jumlahBulanPemasukan : 0);

        // TAMBAHAN: BAGIAN 3 - KALKULASI RATA-RATA PENGELUARAN
        const pengeluaranHarian: { [key: string]: number } = {};
        const pengeluaranMingguan: { [key: string]: number } = {};
        const pengeluaranBulanan: { [key: string]: number } = {};
        let totalPengeluaran = 0;
        const transaksiPengeluaran = transaksiValid.filter(t => t.tipe === 'pengeluaran');

        transaksiPengeluaran.forEach(transaksi => {
          const tanggal = new Date(transaksi.tanggal!); 
          totalPengeluaran += transaksi.jumlah;
          const kunciHari = tanggal.toISOString().split('T')[0];
          const kunciMinggu = `${tanggal.getFullYear()}-W${dapatkanNomorMinggu(tanggal)}`;
          const kunciBulan = `${tanggal.getFullYear()}-${String(tanggal.getMonth() + 1).padStart(2, '0')}`;
          pengeluaranHarian[kunciHari] = (pengeluaranHarian[kunciHari] || 0) + transaksi.jumlah;
          pengeluaranMingguan[kunciMinggu] = (pengeluaranMingguan[kunciMinggu] || 0) + transaksi.jumlah;
          pengeluaranBulanan[kunciBulan] = (pengeluaranBulanan[kunciBulan] || 0) + transaksi.jumlah;
        });

        const jumlahHariPengeluaran = Object.keys(pengeluaranHarian).length;
        const jumlahMingguPengeluaran = Object.keys(pengeluaranMingguan).length;
        const jumlahBulanPengeluaran = Object.keys(pengeluaranBulanan).length;

        setRataHarianPengeluaran(jumlahHariPengeluaran > 0 ? totalPengeluaran / jumlahHariPengeluaran : 0);
        setRataMingguanPengeluaran(jumlahMingguPengeluaran > 0 ? totalPengeluaran / jumlahMingguPengeluaran : 0);
        setRataBulananPengeluaran(jumlahBulanPengeluaran > 0 ? totalPengeluaran / jumlahBulanPengeluaran : 0);
        
        setIsLoading(false); // Set loading ke false setelah semua kalkulasi selesai
      };

      kalkulasiSemuaStatistik();
    }, [db])
  );

  // TAMBAHAN: Kembalikan state pengeluaran dan loading
  return { 
    dataGrafik, 
    saldoTerakhir, 
    rataHarian, 
    rataMingguan, 
    rataBulanan, 
    rataHarianPengeluaran, 
    rataMingguanPengeluaran, 
    rataBulananPengeluaran,
    isLoading // Kembalikan isLoading
  };
}