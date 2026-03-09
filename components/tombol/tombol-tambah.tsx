// Path: components/tombol/tombol-tambah.tsx
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';

interface TombolTambahProps  extends PressableProps{
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

/**
 * Komponen tombol tambah yang dapat digunakan kembali.
 * Menggunakan ikon tambah (+) dan menyediakan prop onPress untuk menangani aksi.
 * Warna ikon akan menyesuaikan dengan tema aplikasi.
 */
export default function TombolTambah({ style, onPress, ...props }: TombolTambahProps) {
  const iconColor = useThemeColor({}, 'text');

  return (
    <Pressable onPress={onPress} style={[styles.container, style]} {...props}>
      <MaterialIcons name='add' size={28} color={iconColor} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 30,
  },
});
