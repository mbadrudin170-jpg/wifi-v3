# Isi dari semua file di projek

Path: app.json

```json
{
  "expo": {
    "name": "wifi-v3",
    "slug": "wifi-v3",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "wifiv3",
    "userInterfaceStyle": "automatic",
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      "expo-sqlite",
      "expo-font",
      "expo-image",
      "expo-web-browser"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}
```

Path: eslint.config.js

```javascript
// Path: ~/wifi-v3/eslint.config.js

const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactCompiler = require('eslint-plugin-react-compiler');

module.exports = defineConfig([
  expoConfig,
  reactCompiler.configs.recommended,
  {
    // PERBAIKAN: Menambahkan semua direktori yang perlu diabaikan oleh ESLint
    ignores: ['.expo/**', 'node_modules/**', 'dist/**', 'build/**'],
  },
]);
```

Path: link-github.md

```markdown
https://github.com/mbadrudin170-jpg/wifi-v3/blob/main/database/operasi/transaksi-operasi.ts

https://github.com/mbadrudin170-jpg/wifi-v3/blob/main/database/sqlite.ts

https://github.com/mbadrudin170-jpg/wifi-v3/blob/main/database/data-default.ts
```

Path: package.json

```json
{
  "name": "wifi-v3",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "dependencies": {
    "@expo/ngrok": "^4.1.3",
    "@expo/vector-icons": "^15.0.3",
    "@react-native-picker/picker": "2.11.4",
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/elements": "^2.6.3",
    "@react-navigation/native": "^7.1.8",
    "babel-plugin-react-compiler": "^19.0.0-beta-af1b7da-20250417",
    "expo": "^55.0.5",
    "expo-constants": "~55.0.7",
    "expo-font": "~55.0.4",
    "expo-haptics": "~55.0.8",
    "expo-image": "~55.0.6",
    "expo-linking": "~55.0.7",
    "expo-router": "~55.0.4",
    "expo-splash-screen": "~55.0.10",
    "expo-sqlite": "~55.0.10",
    "expo-status-bar": "~55.0.4",
    "expo-symbols": "~55.0.5",
    "expo-system-ui": "~55.0.9",
    "expo-web-browser": "~55.0.9",
    "react": "19.2.0",
    "react-compiler-runtime": "^19.0.0-beta-af1b7da-20250417",
    "react-dom": "19.2.0",
    "react-native": "0.83.2",
    "react-native-gesture-handler": "~2.30.0",
    "react-native-reanimated": "4.2.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.23.0",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.7.2"
  },
  "devDependencies": {
    "@types/react": "~19.2.10",
    "eslint": "^9.39.4",
    "eslint-config-expo": "~55.0.0",
    "eslint-plugin-react-compiler": "^19.1.0-rc.2",
    "prettier": "^3.8.1",
    "typescript": "~5.9.2"
  },
  "private": true
}
```

Path: tsconfig.json

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts",
    "app/detail/detail-transaksi"
  ]
}
```

Path: app/\_layout.tsx

```tsx
// Path: app/_layout.tsx
// File root untuk mengatur tema, navigasi, dan inisialisasi database SQLite.

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme'; // Pastikan import Colors
import { insertDefaultData } from '@/database/data-default';
import { migrateDbIfNeeded } from '@/database/sqlite';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Memasukkan skema warna kustom kita ke dalam navigasi
  const customTheme = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const themeBase = isDark ? DarkTheme : DefaultTheme;
    const myColors = isDark ? Colors.dark : Colors.light;

    return {
      ...themeBase,
      colors: {
        ...themeBase.colors,
        primary: myColors.tint,
        background: myColors.background,
        card: myColors.background,
        text: myColors.text,
        border: isDark ? '#2c2c2e' : '#e5e5e7',
        notification: myColors.tint,
      },
    };
  }, [colorScheme]);

  const handleInitDatabase = async (db: SQLiteDatabase) => {
    await migrateDbIfNeeded(db);
    try {
      await insertDefaultData(db);
      console.log('Database & Data Default Berhasil Disiapkan.');
    } catch (error) {
      console.error('Gagal menyiapkan data default:', error);
    }
    SplashScreen.hideAsync();
  };

  return (
    // Menggunakan customTheme hasil racikan kita sendiri
    <ThemeProvider value={customTheme}>
      <Suspense fallback={<LoadingView />}>
        <SQLiteProvider databaseName='main.db' onInit={handleInitDatabase} useSuspense>
          <Stack>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen name='detail' options={{ headerShown: false }} />
            <Stack.Screen
              name='form'
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </SQLiteProvider>
      </Suspense>
    </ThemeProvider>
  );
}

function LoadingView() {
  const colorScheme = useColorScheme();
  const activeColor = colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background,
      }}
    >
      <ActivityIndicator size='large' color={activeColor} />
    </View>
  );
}
```

Path: app/(tabs)/\_layout.tsx

```tsx
// Path: ~/wifi-v3/app/(tabs)/_layout.tsx

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[(colorScheme ?? 'light') as 'light' | 'dark'].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        headerShown: false,
        tabBarButton: HapticTab, // Menggunakan feedback getaran saat ditekan
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol name='house.fill' size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name='paket'
        options={{
          title: 'Paket',
          tabBarIcon: ({ color }) => <IconSymbol name='inventory.fill' size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name='pelanggan'
        options={{
          title: 'Pelanggan',
          tabBarIcon: ({ color }) => <IconSymbol name='person.2.fill' size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name='transaksi'
        options={{
          title: 'Transaksi',
          tabBarIcon: ({ color }) => <IconSymbol name='banknote.fill' size={24} color={color} />,
        }}
      />{' '}
      <Tabs.Screen
        name='kategori'
        options={{
          title: 'Kategori',
          tabBarIcon: ({ color }) => (
            <IconSymbol name='rectangle.stack.fill' size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

Path: app/(tabs)/index.tsx

```tsx
// path: app/(tabs)/index.tsx
// File Screen Utama (Dashboard) untuk menampilkan daftar pelanggan aktif.
// Perubahan: Menambahkan logika pengurutan pada modal.

import HeaderCustom from '@/components/header-custom';
import { TombolTambah } from '@/components/tombol';
import TombolHapus from '@/components/tombol/tombol-hapus';
import TombolUrutkan from '@/components/tombol/tombol-urutkan';
import {
  operasiPelangganAktif,
  type PelangganAktifDetail,
} from '@/database/operasi/pelanggan-aktif-operasi';
import { getStatusPelanggan } from '@/hooks/status-pelanggan';
import { formatTanggalAngka } from '@/utils/format/format-tanggal';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RenderItemPelanggan = ({
  item,
  onNavigate,
}: {
  item: PelangganAktifDetail;
  onNavigate: (id: number) => void;
}) => {
  const statusInfo = getStatusPelanggan(item.tanggal_berakhir);
  return (
    <Pressable style={Styles.itemContainer} onPress={() => onNavigate(item.id)}>
      <View style={Styles.itemDetailContainer}>
        <Text style={Styles.itemNama}>{item.nama}</Text>
        <Text style={Styles.tanggalBerakhir}>{formatTanggalAngka(item.tanggal_berakhir)}</Text>
      </View>
      <View style={Styles.itemAksiContainer}>
        <Text style={{ color: statusInfo.warna, fontWeight: 'bold' }}>{statusInfo.statusTeks}</Text>
        <Text style={{ fontSize: 12 }}>{statusInfo.detailTeks}</Text>
        <Text style={{ fontSize: 12, color: '#666' }}>{item.nama_paket}</Text>
      </View>
    </Pressable>
  );
};

export default function Home() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [totalAktif, setTotalAktif] = useState(0);
  const [pelangganList, setPelangganList] = useState<PelangganAktifDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);
  const [isSortModalVisible, setSortModalVisible] = useState(false);

  type TipeUrut = 'nama-asc' | 'nama-desc' | 'jatuh-tempo-asc' | 'mulai-desc';

  const handleUrutkan = (tipe: TipeUrut) => {
    const daftarUrut = [...pelangganList];

    switch (tipe) {
      case 'nama-asc':
        daftarUrut.sort((a, b) => a.nama.localeCompare(b.nama));
        break;
      case 'nama-desc':
        daftarUrut.sort((a, b) => b.nama.localeCompare(a.nama));
        break;
      case 'jatuh-tempo-asc':
        // PERBAIKAN: Menangani kasus `null` pada tanggal dengan memberikan nilai default.
        // Ini mencegah error "No overload matches this call" saat `new Date(null)`.
        daftarUrut.sort((a, b) => {
          const dateA = a.tanggal_berakhir ? new Date(a.tanggal_berakhir).getTime() : Infinity;
          const dateB = b.tanggal_berakhir ? new Date(b.tanggal_berakhir).getTime() : Infinity;
          return dateA - dateB;
        });
        break;
      case 'mulai-desc':
        console.log("Pengurutan 'Tanggal Mulai Terbaru' perlu data tambahan.");
        break;
    }

    setPelangganList(daftarUrut);
    tutupModalUrutkan();
  };

  const bukaModalUrutkan = () => setSortModalVisible(true);
  const tutupModalUrutkan = () => setSortModalVisible(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const muatData = useCallback(async () => {
    try {
      if (isMountedRef.current) setLoading(true);
      const operasi = operasiPelangganAktif(db);
      const [total, list] = await Promise.all([
        operasi.hitungTotalPelangganAktif(),
        operasi.ambilSemuaPelangganAktifDetail(),
      ]);
      if (!isMountedRef.current) return;
      setTotalAktif(total);
      setPelangganList(list);
    } catch (error) {
      console.error('Gagal mengambil data pelanggan:', error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    muatData();
  }, [muatData]);

  const handleNavigasiNavigasi = (id: number) => {
    router.push(`/detail/pelanggan-aktif/${id}`);
  };

  return (
    <SafeAreaView style={Styles.container}>
      <HeaderCustom
        rightAccessory={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TombolUrutkan onPress={bukaModalUrutkan} />
            <TombolHapus />
          </View>
        }
      >
        <View style={{ width: '100%' }}>
          <Text style={Styles.headerContentTitle}>Dashboard</Text>
          <Text style={Styles.headerContentSubtitle}>Pelanggan Aktif: {totalAktif}</Text>
        </View>
      </HeaderCustom>

      {loading ? (
        <View style={Styles.emptyContainer}>
          <ActivityIndicator size='large' color='#2E7D32' />
          <Text>Mengambil Data Keuangan...</Text>
        </View>
      ) : (
        <FlatList
          data={pelangganList}
          renderItem={({ item }) => (
            <RenderItemPelanggan item={item} onNavigate={handleNavigasiNavigasi} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={Styles.listContentContainer}
          ListHeaderComponent={() => <Text style={Styles.listHeader}>Daftar Pelanggan</Text>}
          ListEmptyComponent={() => (
            <View style={Styles.emptyContainer}>
              <MaterialIcons name='info-outline' size={48} color='#B0BEC5' />
              <Text style={Styles.emptyText}>Belum ada pelanggan aktif.</Text>
            </View>
          )}
        />
      )}
      <TombolTambah onPress={() => router.push('/form/form-pelanggan-aktif')} />

      <Modal
        animationType='fade'
        transparent={true}
        visible={isSortModalVisible}
        onRequestClose={tutupModalUrutkan}
      >
        <Pressable style={Styles.modalOverlay} onPress={tutupModalUrutkan}>
          <View style={Styles.modalContent}>
            <Text style={Styles.modalTitle}>Urutkan Berdasarkan</Text>

            <Pressable style={Styles.sortOption} onPress={() => handleUrutkan('nama-asc')}>
              <Text style={Styles.sortOptionText}>Nama (A-Z)</Text>
            </Pressable>

            <Pressable style={Styles.sortOption} onPress={() => handleUrutkan('nama-desc')}>
              <Text style={Styles.sortOptionText}>Nama (Z-A)</Text>
            </Pressable>

            <Pressable style={Styles.sortOption} onPress={() => handleUrutkan('jatuh-tempo-asc')}>
              <Text style={Styles.sortOptionText}>Jatuh Tempo Terdekat</Text>
            </Pressable>

            <Pressable
              style={[Styles.sortOption, { borderBottomWidth: 0 }]}
              onPress={() => handleUrutkan('mulai-desc')}
            >
              <Text style={Styles.sortOptionText}>Tanggal Mulai Terbaru</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const Styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f5f7' },
  listContentContainer: { paddingHorizontal: 20, paddingVertical: 15 },
  listHeader: { fontSize: 18, fontWeight: 'bold', color: '#37474F', marginBottom: 15 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemDetailContainer: { flex: 1 },
  itemNama: { fontSize: 16, fontWeight: 'bold', color: '#263238' },
  tanggalBerakhir: { fontSize: 13, color: '#D32F2F', marginTop: 4 },
  itemAksiContainer: { alignItems: 'flex-end', gap: 2 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 10, fontSize: 16, color: '#78909C' },
  headerContentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  headerContentSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    textAlign: 'left',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  sortOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#37474F',
    textAlign: 'center',
  },
});
```

Path: app/(tabs)/kategori.tsx

```tsx
// Path: ~/wifi-v3/app/(tabs)/kategori.tsx

import HeaderCustom from '@/components/header-custom';
import SafeAreaViewCustom from '@/components/komponen-react/safe-area-view-custom';
import { TombolHapus, TombolTambah } from '@/components/tombol';
import { Kategori, operasiKategori } from '@/database/operasi/kategori-operasi';
import { SubKategori, operasiSubKategori } from '@/database/operasi/sub-kategori-operasi';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HalamanKategori() {
  const [tipeAktif, setTipeAktif] = useState<'Pemasukan' | 'Pengeluaran'>('Pemasukan');
  const [daftarKategori, setDaftarKategori] = useState<Kategori[]>([]);
  const [kategoriAktif, setKategoriAktif] = useState<Kategori | null>(null);
  const [daftarSubKategori, setDaftarSubKategori] = useState<SubKategori[]>([]);
  const db = useSQLiteContext();

  const muatData = useCallback(async () => {
    try {
      // 1. Muat daftar kategori berdasarkan tipe yang aktif
      const kategori = await operasiKategori(db).getByType(tipeAktif);
      setDaftarKategori(kategori);

      // 2. Periksa apakah kategori yang aktif sebelumnya masih ada di daftar baru
      const kategoriAktifSaatIniMasihAda = kategori.some((k) => k.id === kategoriAktif?.id);
      let subKategoriBaru: SubKategori[] = [];

      if (kategoriAktifSaatIniMasihAda && kategoriAktif) {
        // 3. Jika masih ada, muat sub-kategorinya
        subKategoriBaru = await operasiSubKategori(db).getByKategoriId(kategoriAktif.id);
      } else {
        // 4. Jika tidak, reset pilihan
        setKategoriAktif(null);
      }
      setDaftarSubKategori(subKategoriBaru);
    } catch (error) {
      console.error('Gagal memuat data kategori:', error);
    }
  }, [db, tipeAktif, kategoriAktif]);

  // Gunakan useFocusEffect untuk memuat ulang data saat layar ini kembali aktif
  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [muatData])
  );

  const handlePilihKategori = async (kategori: Kategori) => {
    setKategoriAktif(kategori);
    const subKategori = await operasiSubKategori(db).getByKategoriId(kategori.id);
    setDaftarSubKategori(subKategori);
  };

  const renderItemKategori = ({ item }: { item: Kategori }) => {
    const isActive = kategoriAktif?.id === item.id;
    return (
      <Pressable
        style={[styles.itemKategori, isActive && styles.kategoriAktif]}
        onPress={() => handlePilihKategori(item)}
      >
        <Text style={[styles.teksKategori, isActive && styles.teksKategoriAktif]}>{item.nama}</Text>
      </Pressable>
    );
  };

  const renderItemSubKategori = ({ item }: { item: SubKategori }) => (
    <View style={styles.itemKategori}>
      <Text style={styles.teksKategori}>{item.nama}</Text>
    </View>
  );

  return (
    <SafeAreaViewCustom>
      <HeaderCustom
        title='Kategori'
        rightAccessory={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TombolHapus onPress={() => console.log('Hapus')} />
            <TombolTambah onPress={() => console.log('Tambah')} />
          </View>
        }
      />

      <View style={styles.wadahTombolTipe}>
        <Pressable
          style={[styles.tombolTipe, tipeAktif === 'Pemasukan' && styles.tombolTipeAktif]}
          onPress={() => setTipeAktif('Pemasukan')}
        >
          <Text
            style={[styles.teksPemasukan, tipeAktif === 'Pemasukan' && styles.teksTombolTipeAktif]}
          >
            Pemasukan
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tombolTipe, tipeAktif === 'Pengeluaran' && styles.tombolTipeAktif]}
          onPress={() => setTipeAktif('Pengeluaran')}
        >
          <Text
            style={[
              styles.teksPengeluaran,
              tipeAktif === 'Pengeluaran' && styles.teksTombolTipeAktif,
            ]}
          >
            Pengeluaran
          </Text>
        </Pressable>
      </View>

      <View style={styles.wadahKategoriDanSub}>
        {/* Kolom Kategori */}
        <View style={styles.wadahRincian}>
          <FlatList
            data={daftarKategori}
            renderItem={renderItemKategori}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={<Text style={styles.judulList}>Kategori</Text>}
            contentContainerStyle={{ gap: 8 }}
            ListEmptyComponent={<Text style={styles.teksKosong}>Tidak ada kategori.</Text>}
          />
        </View>

        {/* Kolom Sub Kategori */}
        <View style={styles.wadahRincian}>
          <FlatList
            data={daftarSubKategori}
            renderItem={renderItemSubKategori}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={<Text style={styles.judulList}>Sub-Kategori</Text>}
            contentContainerStyle={{ gap: 8 }}
            ListEmptyComponent={
              <Text style={styles.teksKosong}>
                {kategoriAktif ? 'Tidak ada sub-kategori.' : 'Pilih kategori untuk melihat sub.'}
              </Text>
            }
          />
        </View>
      </View>
    </SafeAreaViewCustom>
  );
}

const styles = StyleSheet.create({
  wadahTombolTipe: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  tombolTipe: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tombolTipeAktif: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  teksTombolTipeAktif: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  teksPemasukan: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  teksPengeluaran: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c62828',
  },
  wadahKategoriDanSub: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  wadahRincian: {
    flex: 1,
    flexDirection: 'column',
    gap: 12,
  },
  judulList: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 4,
  },
  itemKategori: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  teksKategori: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  kategoriAktif: {
    backgroundColor: '#EBF1FD',
    borderColor: '#2563EB',
  },
  teksKategoriAktif: {
    color: '#2563EB',
    fontWeight: '700',
  },
  teksKosong: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
```

Path: app/(tabs)/paket.tsx

```tsx
// Path: /home/user/wifi-v3/app/(tabs)/paket.tsx
// File Screen untuk manajemen Paket WiFi.
// Penjelasan: Menampilkan daftar paket dengan desain kartu profesional dan ringkasan total paket di header.

import TombolTambah from '@/components/tombol/tombol-tambah';
import { operasiPaket, Paket } from '@/database/operasi/paket-operasi';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// RenderItem diletakkan di luar untuk performa RAM Poco C40 yang lebih stabil
const RenderItemPaket = ({
  item,
  onPress,
  styles,
}: {
  item: Paket;
  onPress: (id: number) => void;
  styles: any;
}) => (
  <Pressable style={styles.card} onPress={() => onPress(item.id)}>
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>
        <MaterialIcons name='wifi' size={24} color='#1976D2' />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.namaPaket}>{item.nama}</Text>
        <Text style={styles.subText}>{item.durasi} Hari Masa Aktif</Text>
      </View>
      <View style={styles.speedBadge}>
        <Text style={styles.speedText}>{item.kecepatan} Mbps</Text>
      </View>
    </View>
    <View style={styles.cardFooter}>
      <Text style={styles.labelHarga}>Harga Paket</Text>
      <Text style={styles.hargaText}>Rp {item.harga.toLocaleString('id-ID')}</Text>
    </View>
  </Pressable>
);

export default function HalamanPaket() {
  const [totalPaket, setTotalPaket] = useState(0);
  const [daftarPaket, setDaftarPaket] = useState<Paket[]>([]);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);
  const db = useSQLiteContext();
  const router = useRouter();

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const muatData = useCallback(async () => {
    try {
      if (isMountedRef.current) setLoading(true);
      const repo = operasiPaket(db);

      // Mengambil data secara paralel agar lebih cepat di Poco C40/Chromebook
      const [paket, jumlah] = await Promise.all([repo.ambilSemuaPaket(), repo.hitungTotalPaket()]);

      if (!isMountedRef.current) return;
      setDaftarPaket(paket);
      setTotalPaket(jumlah);
    } catch (error) {
      console.error('Gagal mengambil data paket:', error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    muatData();
  }, [muatData]);

  const handleKeDetail = (id: number) => {
    // Navigasi ke file: app/detail/detail-paket/[id].tsx
    router.push(`/detail/detail-paket/${id}`);
  };
  // Komponen Header yang dipisahkan
  return (
    <SafeAreaView style={styles.container} edges={['left', 'top', 'right']}>
      {/* Header Seksi */}
      <View style={styles.header}>
        <View style={styles.infoHeader}>
          <Text style={styles.titleHeader}>Manajemen Paket</Text>
          <Text style={styles.subtitleHeader}>Total Tersedia: {totalPaket} Layanan</Text>
        </View>
        <View style={styles.actionHeader}>
          <Pressable style={styles.iconBtn} onPress={muatData}>
            <MaterialIcons name='refresh' size={24} color='#1976D2' />
          </Pressable>
          <Pressable style={[styles.iconBtn, styles.btnDelete]}>
            <MaterialIcons name='delete-outline' size={24} color='#D32F2F' />
          </Pressable>
        </View>
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size='large' color='#1976D2' />
        </View>
      ) : (
        <FlatList
          data={daftarPaket}
          renderItem={({ item }) => (
            <RenderItemPaket item={item} onPress={handleKeDetail} styles={styles} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialIcons name='inventory' size={48} color='#BDBDBD' />
              <Text style={styles.emptyText}>Belum ada paket wifi dibuat.</Text>
            </View>
          }
        />
      )}
      <TombolTambah onPress={() => router.push('/form/form-paket')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  infoHeader: {
    flex: 1,
  },
  titleHeader: {
    fontSize: 22,
    fontWeight: '800',
    color: '#212121',
    letterSpacing: -0.5,
  },
  subtitleHeader: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  actionHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    padding: 10,
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
  },
  btnDelete: {
    backgroundColor: '#FFF1F1',
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  namaPaket: {
    fontSize: 16,
    fontWeight: '700',
    color: '#263238',
  },
  subText: {
    fontSize: 12,
    color: '#90A4AE',
    marginTop: 2,
  },
  speedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  speedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  labelHarga: {
    fontSize: 12,
    color: '#78909C',
  },
  hargaText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1976D2',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 12,
    color: '#9E9E9E',
    fontSize: 14,
  },
});
```

Path: app/(tabs)/pelanggan.tsx

```tsx
// Path: ~/wifi-v3/app/(tabs)/pelanggan.tsx

import { TombolTambah } from '@/components/tombol';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { operasiPelanggan, Pelanggan } from '../../database/operasi/pelanggan-operasi';

export default function HalamanPelanggan() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [daftarPelanggan, setDaftarPelanggan] = useState<Pelanggan[]>([]);
  // Ubah default loading ke false jika data default diharapkan sudah ada dari provider
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Gunakan useMemo agar instance operasi tidak dibuat ulang setiap render
  const pelangganDb = useMemo(() => operasiPelanggan(db), [db]);

  const muatDataPelanggan = useCallback(async () => {
    try {
      // Pastikan db tersedia
      const data = await pelangganDb.ambilSemuaPelanggan();
      if (!isMountedRef.current) return;
      setDaftarPelanggan(data);
    } catch (error) {
      console.error('Gagal memuat pelanggan:', error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [pelangganDb]);

  // Gunakan useFocusEffect untuk sinkronisasi data
  useFocusEffect(
    useCallback(() => {
      muatDataPelanggan();
    }, [muatDataPelanggan])
  );

  const renderItemPelanggan = ({ item }: { item: Pelanggan }) => (
    <Pressable style={styles.card} onPress={() => router.push(`/detail/pelanggan/${item.id}`)}>
      <View style={styles.cardInfo}>
        <Text style={styles.namaText}>{item.nama}</Text>
        <Text style={styles.alamatText}>{item.alamat}</Text>
      </View>
      <View style={styles.cardContact}>
        <View style={styles.phoneBadge}>
          <MaterialIcons name='phone' size={14} color={'#007AFF'} />
          <Text style={styles.noHpText}>{item.no_hp || '-'}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerTextWrapper}>
          <Text style={styles.headerTitle}>Daftar Pelanggan</Text>
          <Text style={styles.headerSubtitle}>
            {loading ? 'Mengambil data...' : `${daftarPelanggan.length} Total Pelanggan`}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={styles.iconButton}
            onPress={() => {
              setLoading(true);
              muatDataPelanggan();
            }}
          >
            <MaterialIcons name='refresh' size={24} color={'#333'} />
          </Pressable>
        </View>
      </View>

      {loading && daftarPelanggan.length === 0 ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size='large' color='#007AFF' />
        </View>
      ) : (
        <FlatList
          data={daftarPelanggan}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItemPelanggan}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={muatDataPelanggan}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name='person-off' size={60} color='#CCC' />
              <Text style={styles.emptyText}>Belum ada data pelanggan.</Text>
            </View>
          }
        />
      )}
      <TombolTambah onPress={() => router.push('/form/form-pelanggan-aktif')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerTextWrapper: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  headerSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 10, padding: 8, backgroundColor: '#F0F0F0', borderRadius: 20 },
  listContent: { padding: 16, paddingBottom: 100 },
  centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#999', fontSize: 16, marginTop: 10 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardInfo: { flex: 1, marginRight: 10 },
  namaText: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 4 },
  alamatText: { fontSize: 13, color: '#888', lineHeight: 18 },
  cardContact: { alignItems: 'flex-end' },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  noHpText: { fontSize: 13, fontWeight: '600', color: '#007AFF', marginLeft: 4 },
  tombolTambah: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
});
```

Path: app/(tabs)/transaksi.tsx

```tsx
// path: app/(tabs)/transaksi.tsx
// File Screen untuk manajemen Transaksi WiFi dengan teks loading.

import TombolTambah from '@/components/tombol/tombol-tambah';
import { operasiTransaksi, TransaksiLengkap } from '@/database/operasi/transaksi-operasi';
import { formatAngka } from '@/utils/format/format-angka';
import { formatTanggal } from '@/utils/format/format-tanggal';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransaksiScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [transaksi, setTransaksi] = useState<TransaksiLengkap[]>([]);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  type SectionData = {
    title: string; // Tanggal sebagai judul section
    total: number; // Total transaksi untuk tanggal tersebut
    data: TransaksiLengkap[]; // Data transaksi untuk tanggal tersebut
  };

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fungsi untuk mengelompokkan transaksi berdasarkan tanggal
  const groupByDate = (items: TransaksiLengkap[]): SectionData[] => {
    // Kelompokkan items berdasarkan tanggal
    const grouped = items.reduce((acc: { [key: string]: TransaksiLengkap[] }, item) => {
      // Format tanggal untuk dijadikan key
      const date = item.tanggal ? formatTanggal(new Date(item.tanggal)) : 'Tanpa Tanggal';

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    // Konversi ke array section dan urutkan
    return Object.keys(grouped)
      .sort((a, b) => {
        // Sorting berdasarkan tanggal (terbaru ke terlama)
        const dateA = new Date(grouped[a][0]?.tanggal || '');
        const dateB = new Date(grouped[b][0]?.tanggal || '');
        return dateB.getTime() - dateA.getTime();
      })
      .map((title) => {
        // Hitung total untuk tanggal ini
        const totalPerTanggal = grouped[title].reduce((sum, item) => {
          return item.tipe === 'pemasukan' ? sum + (item.jumlah || 0) : sum - (item.jumlah || 0);
        }, 0);

        return {
          title,
          total: totalPerTanggal, // Tambahkan total
          data: grouped[title].sort(
            (a, b) =>
              // Urutkan transaksi dalam satu hari (terbaru ke terlama)
              new Date(b.tanggal || '').getTime() - new Date(a.tanggal || '').getTime()
          ),
        };
      });
  };
  const muatData = useCallback(async () => {
    if (transaksi.length === 0 && isMountedRef.current) setIsLoading(true);

    try {
      const [data, total] = await Promise.all([
        operasiTransaksi.ambilSemuaLengkap(db),
        operasiTransaksi.hitungTotalTransaksi(db),
      ]);

      if (!isMountedRef.current) return;
      setTransaksi(data || []);
      setSections(groupByDate(data || [])); // Tambahkan ini untuk grouping
      setTotalTransaksi(total);
    } catch (error) {
      console.error('Gagal memuat transaksi:', error);
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [db, transaksi.length]);

  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [muatData])
  );
  // Render header untuk setiap section (tanggal)
  const renderSectionHeader = ({ section }: { section: SectionData }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text
        style={[
          styles.sectionTotal,
          section.total >= 0 ? styles.sectionTotalPlus : styles.sectionTotalMinus,
        ]}
      >
        {section.total >= 0 ? '+' : '-'} {formatAngka(Math.abs(section.total))}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: TransaksiLengkap }) => (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/detail/detail-transaksi/[id]',
          params: { id: item.id },
        })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.namaPelanggan} numberOfLines={1}>
          {item.nama_pelanggan || 'Transaksi Umum'}
        </Text>
        {/* HAPUS bagian tanggal dari sini karena sudah ada di section header */}
        {/* <Text style={styles.tanggal}>
        {item.tanggal ? formatTanggal(new Date(item.tanggal)) : '-'}
      </Text> */}
      </View>

      <View style={styles.cardBody}>
        <View style={styles.descWrapper}>
          <MaterialIcons
            name={item.id_pelanggan ? 'wifi' : 'receipt'}
            size={16}
            color='#888'
            style={{ marginRight: 6 }}
          />
          <Text style={styles.namaPaket} numberOfLines={1}>
            {item.nama_paket || item.deskripsi}
          </Text>
        </View>
        <Text style={[styles.hargaPaket, item.tipe === 'pengeluaran' && styles.hargaPengeluaran]}>
          {item.tipe === 'pemasukan' ? '+' : '-'} {formatAngka(item.jumlah || 0)}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={[styles.status, item.tipe === 'pengeluaran' && styles.statusPengeluaran]}>
          <Text
            style={[styles.statusText, item.tipe === 'pengeluaran' && styles.statusTextPengeluaran]}
          >
            {item.tipe}
          </Text>
        </View>
        {item.catatan && <MaterialIcons name='notes' size={14} color='#BBB' />}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Riwayat Transaksi</Text>
          <Text style={styles.subtitle}>{totalTransaksi} Total Catatan</Text>
        </View>
      </View>

      {isLoading && transaksi.length === 0 ? (
        <View style={styles.centerLoader}>
          <Text style={styles.loadingText}>Memuat data transaksi...</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={true} // Membuat header tetap di atas saat scroll
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name='receipt-long' size={64} color='#E0E0E0' />
              <Text style={styles.emptyText}>Belum ada riwayat transaksi.</Text>
            </View>
          }
          onRefresh={muatData}
          refreshing={isLoading}
        />
      )}

      <TombolTambah onPress={() => router.push('/form/form-transaksi')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  namaPelanggan: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  tanggal: {
    fontSize: 12,
    color: '#999',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  descWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  namaPaket: {
    fontSize: 14,
    color: '#666',
  },
  hargaPaket: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  hargaPengeluaran: {
    color: '#C62828',
  },
  cardFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
  },
  statusPengeluaran: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statusTextPengeluaran: {
    color: '#C62828',
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 15,
    color: '#999',
  },
  sectionHeader: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row', // TAMBAHKAN INI
    justifyContent: 'space-between', // TAMBAHKAN INI
    alignItems: 'center', // TAMBAHKAN INI
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    flex: 1, // TAMBAHKAN INI (opsional, untuk memastikan title tidak terpotong)
  },
  sectionTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionTotalPlus: {
    color: '#2E7D32',
  },
  sectionTotalMinus: {
    color: '#C62828',
  },
});
```

Path: app/detail/\_layout.tsx

```tsx
// Path: ~/wifi-v3/app/detail/_layout.tsx
// File layout untuk grup folder detail.
// Penjelasan: Mengatur header dan transisi untuk semua layar detail agar seragam.

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';

export default function DetailLayout() {
  const colorScheme = useColorScheme();
  const activeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <Stack
      screenOptions={{
        // Pengaturan Header Global untuk folder detail
        headerStyle: {
          backgroundColor: activeColors.background,
        },
        headerTintColor: activeColors.tint,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerShadowVisible: false, // Tampilan bersih tanpa garis bawah tebal
        headerBackTitle: 'Kembali',

        // Animasi transisi profesional
        animation: 'slide_from_right',

        // Agar status bar menyesuaikan dengan tema saat berada di layar detail
        contentStyle: {
          backgroundColor: activeColors.background,
        },
      }}
    >
      {/* PERBAIKAN: Menghapus ekstensi .tsx dari nama rute */}
      <Stack.Screen
        name='detail-transaksi/[id]'
        options={{
          title: 'Detail Transaksi',
        }}
      />

      <Stack.Screen
        name='detail-paket/[id]'
        options={{
          title: 'Informasi Paket',
        }}
      />

      <Stack.Screen
        name='pelanggan/[id]'
        options={{
          title: 'Profil Pelanggan',
        }}
      />

      <Stack.Screen
        name='pelanggan-aktif/[id]'
        options={{
          title: 'Status Berlangganan',
        }}
      />
    </Stack>
  );
}
```

Path: app/form/\_layout.tsx

```tsx
// Path: app/form/_layout.tsx
import { Stack } from 'expo-router';

/**
 * FUNGSI:
 * Mengatur tata letak navigasi untuk semua layar dalam direktori (form).
 * Komponen ini menggunakan Stack Navigator dari Expo Router untuk mendefinisikan
 * setiap layar form. Opsi `headerShown: false` digunakan untuk menyembunyikan
 * header default agar bisa diganti dengan header kustom jika diperlukan.
 */
export default function LayoutForm() {
  return (
    <Stack>
      <Stack.Screen name='form-paket' options={{ headerShown: false }} />
      <Stack.Screen name='form-pelanggan' options={{ headerShown: false }} />
      {/* PERBAIKAN: Menambahkan layar form lainnya ke dalam stack navigasi */}
      <Stack.Screen name='form-pelanggan-aktif' options={{ headerShown: false }} />
      <Stack.Screen name='form-transaksi' options={{ headerShown: false }} />
      <Stack.Screen name='form-kategori' options={{ headerShown: false }} />
    </Stack>
  );
}
```

Path: app/detail/detail-paket/[id].tsx

```tsx
// Path: ~/wifi-v3/app/detail/detail-paket/[id].tsx
// File Screen Detail Paket.
// Penjelasan: Mengambil ID dari URL dan mencari data paket di SQLite secara otomatis.

import { Paket } from '@/database/operasi/paket-operasi';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HalamanDetailPaket() {
  // 1. Ambil ID dari parameter URL ([id])
  const { id } = useLocalSearchParams<{ id: string }>();

  const db = useSQLiteContext();
  const router = useRouter();

  const [paket, setPaket] = useState<Paket | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Fungsi untuk mengambil data detail berdasarkan ID
  useEffect(() => {
    let isCancelled = false;

    async function ambilDetail() {
      try {
        if (!isCancelled) setLoading(true);
        // Kita gunakan query langsung atau tambahkan fungsi di operasiPaket
        const result = await db.getFirstAsync<Paket>('SELECT * FROM paket WHERE id = ?', [id]);
        if (!isCancelled) setPaket(result);
      } catch (error) {
        console.error('Gagal memuat detail paket:', error);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    if (id) ambilDetail();

    return () => {
      isCancelled = true;
    };
  }, [id, db]);

  // Fungsi kembali agar lebih rapi
  const handleBack = () => router.back();

  return (
    <SafeAreaView style={styles.container} edges={['left', 'top', 'right']}>
      {/* Sembunyikan header bawaan agar kita bisa pakai header custom */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Custom */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.iconBtn}>
          <MaterialIcons name='chevron-left' size={28} color={'#1976D2'} />
        </Pressable>
        <Text style={styles.titleHeader}>Detail Layanan</Text>
        <Pressable style={styles.iconBtn}>
          <MaterialIcons name='edit' size={24} color={'#424242'} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size='large' color='#1976D2' />
        </View>
      ) : paket ? (
        <View style={styles.content}>
          {/* Card Info Utama */}
          <View style={styles.card}>
            <Text style={styles.label}>Nama Paket WiFi</Text>
            <Text style={styles.valueNama}>{paket.nama}</Text>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View>
                <Text style={styles.label}>Kecepatan</Text>
                <Text style={styles.valueSmall}>{paket.kecepatan} Mbps</Text>
              </View>
              <View>
                <Text style={styles.label}>Durasi</Text>
                <Text style={styles.valueSmall}>{paket.durasi} Hari</Text>
              </View>
            </View>
          </View>

          {/* Card Harga */}
          <View style={[styles.card, styles.cardHarga]}>
            <Text style={styles.labelHarga}>Biaya Langganan</Text>
            <Text style={styles.valueHarga}>Rp {paket.harga.toLocaleString('id-ID')}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.center}>
          <Text>Data paket tidak ditemukan.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  titleHeader: { fontSize: 18, fontWeight: 'bold', color: '#212121' },
  iconBtn: { padding: 8 },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Styling Card Profesional
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHarga: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  label: { fontSize: 12, color: '#757575', marginBottom: 4, textTransform: 'uppercase' },
  labelHarga: { fontSize: 14, color: '#1976D2', fontWeight: '600' },
  valueNama: { fontSize: 22, fontWeight: '800', color: '#263238' },
  valueSmall: { fontSize: 16, fontWeight: 'bold', color: '#424242' },
  valueHarga: { fontSize: 28, fontWeight: '900', color: '#0D47A1', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});
```

Path: app/detail/detail-transaksi/[id].tsx

```tsx
// path: app/detail/detail-transaksi/[id].tsx

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
// PERBAIKAN: Impor fungsi operasiTransaksi
import { operasiTransaksi, TransaksiLengkap } from '@/database/operasi/transaksi-operasi';
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
    const validId = Array.isArray(id) ? id[0] : id;
    if (!validId) return;

    try {
      if (isMountedRef.current) setLoading(true);

      // PERBAIKAN: Menggunakan fungsi terpusat dari operasiTransaksi
      const result = await operasiTransaksi.ambilBerdasarkanId(db, validId);

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
          headerShown: true,
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
              // PERBAIKAN: Gunakan 'pengeluaran' (lowercase)
              data?.tipe === 'pengeluaran' ? styles.teksMerah : styles.teksHijau,
            ]}
          >
            {/* PERBAIKAN: Logika +/- disesuaikan */}
            {data?.tipe === 'pemasukan' ? '+ ' : '- '}
            {/* PERBAIKAN: Gunakan properti 'jumlah' */}
            {formatAngka(data?.jumlah || 0)}
          </Text>
          <View
            style={[
              styles.badgeTipe,
              // PERBAIKAN: Gunakan 'pengeluaran' (lowercase)
              data?.tipe === 'pengeluaran' ? styles.bgMerah : styles.bgHijau,
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
            value={data?.nama_kategori || 'Tanpa Kategori'}
            ikon='category'
          />
          <ItemDetail
            label='Sumber Dana / Dompet'
            value={data?.nama_dompet || 'Kas'}
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
```

Path: app/detail/pelanggan/[id].tsx

```tsx
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
```
