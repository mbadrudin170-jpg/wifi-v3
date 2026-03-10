// Path: ~/wifi-v3/components/tombol/tombol-urutkan.tsx

import { Ionicons } from '@expo/vector-icons';
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';

// 1. Definisikan interface untuk props yang diterima
interface TombolUrutkanProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

/**
 * Komponen tombol untuk aksi mengurutkan (sort).
 * Menampilkan ikon 'swap-vertical' untuk representasi visual dari aksi pengurutan.
 * Fungsi yang akan dijalankan saat tombol ditekan dapat di-passing melalui prop onPress.
 *
 * @param {TombolUrutkanProps} props - Properti untuk komponen tombol urutkan.
 */
// 2. Terima dan gunakan props di dalam fungsi komponen
export default function TombolUrutkan({ style, onPress, ...props }: TombolUrutkanProps) {
  return (
    // 3. Terapkan style dan event handler onPress dari props
    <Pressable onPress={onPress} style={[styles.tombol, style]} {...props}>
      <Ionicons name='swap-vertical' size={24} color={'black'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tombol: {
    padding: 10,
  },
});
