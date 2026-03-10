// path: components/tombol/tombol-hapus.tsx
import { MaterialIcons } from '@expo/vector-icons';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

// 1. Definisikan interface untuk props yang diterima
interface TombolHapusProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

/**
 * Komponen tombol hapus yang dapat digunakan kembali.
 * Menampilkan ikon tempat sampah (delete) dan menangani aksi hapus melalui prop onPress.
 * Warna ikon diatur ke merah untuk menandakan aksi yang berpotensi merusak data.
 *
 * @param {TombolHapusProps} props - Properti untuk komponen tombol hapus.
 */
// 2. Terima dan gunakan props di dalam fungsi komponen
export default function TombolHapus({
  style,
  onPress,
  ...props
}: TombolHapusProps) {
  return (
    // 3. Terapkan style dan event handler onPress dari props
    <Pressable onPress={onPress} style={[styles.tombolHapus, style]} {...props}>
      <MaterialIcons name='delete' size={24} color={'red'} />
    </Pressable>
  );
}

// Mengubah nama variabel agar sesuai dengan konvensi (styles plural)
const styles = StyleSheet.create({
  tombolHapus: {
    padding: 10,
  },
});
