// Path: ~/wifi-v3/components/tombol/tombol-edit.tsx

import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';

// Perbaikan: Interface ini sekarang mewarisi semua properti dari PressableProps.
// Ini memungkinkan kita untuk meneruskan props seperti 'disabled', 'android_ripple', dll.
interface TombolEditProps extends PressableProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Komponen tombol edit yang dapat digunakan kembali.
 * Menggunakan ikon edit (pensil) dan menyediakan prop onPress untuk menangani aksi.
 * Warna ikon akan menyesuaikan dengan tema aplikasi.
 */
export default function TombolEdit({ style, onPress, ...props }: TombolEditProps) {
  const iconColor = useThemeColor({}, 'text');

  return (
    <Pressable onPress={onPress} style={[styles.tombolEdit, style]} {...props}>
      <MaterialIcons name='edit' size={24} color={iconColor} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  tombolEdit: {
    padding: 10,
  },
});
