// Path: ~/wifi-v3/app/form/form-transaksi.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import InputTeks from '../../components/komponen-react/input-teks';
import SafeAreaViewCustom from '../../components/komponen-react/safe-area-view-custom';
import TombolKembali from '../../components/tombol/tombol-kembali';
import TombolSimpan from '../../components/tombol/tombol-simpan';

export default function FormTransaksi() {
  const [pelangganId, setPelangganId] = useState('');
  const [paketId, setPaketId] = useState('');
  const [jumlah, setJumlah] = useState('');

  const handleSimpan = () => {
    // Logika untuk menyimpan transaksi
    console.log({ pelangganId, paketId, jumlah });
    // Kembali ke halaman sebelumnya
    router.back();
  };

  return (
    <SafeAreaViewCustom>
      <TombolKembali />
      <View style={{ padding: 20, flex: 1 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Form Transaksi</Text>

        {/* Nanti ini akan diganti dengan komponen dropdown */}
        <InputTeks
          label='ID Pelanggan'
          value={pelangganId}
          onChangeText={setPelangganId}
          placeholder='Masukkan ID Pelanggan'
        />

        {/* Nanti ini akan diganti dengan komponen dropdown */}
        <InputTeks
          label='ID Paket'
          value={paketId}
          onChangeText={setPaketId}
          placeholder='Masukkan ID Paket'
        />

        <InputTeks
          label='Jumlah'
          value={jumlah}
          onChangeText={setJumlah}
          placeholder='Masukkan Jumlah'
          keyboardType='numeric'
        />

        <View style={{ marginTop: 'auto' }}>
          <TombolSimpan onPress={handleSimpan} teks='Simpan'/>
        </View>
      </View>
    </SafeAreaViewCustom>
  );
}
