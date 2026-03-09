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
