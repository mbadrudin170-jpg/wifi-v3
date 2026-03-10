// Path: components/tombol/tombol-tambah.tsx
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';

interface TombolTambahProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

/**
 * Komponen tombol tambah yang dapat digunakan kembali, didesain sebagai Floating Action Button (FAB).
 * Menggunakan ikon tambah (+) dan menyediakan prop onPress untuk menangani aksi.
 * Warna tombol dan ikon akan menyesuaikan dengan tema aplikasi untuk kontras yang baik.
 */
export default function TombolTambah({ style, onPress, ...props }: TombolTambahProps) {
  const backgroundColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'background');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor, opacity: pressed ? 0.8 : 1 },
        style,
      ]}
      {...props}
    >
      <MaterialIcons name='add' size={32} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    // Style untuk membuat tombol menjadi lingkaran
    width: 60,
    height: 60,
    borderRadius: 30,
    // Memposisikan ikon di tengah tombol
    justifyContent: 'center',
    alignItems: 'center',
    // Efek bayangan (shadow) untuk tampilan "melayang"
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // untuk Android
  },
});
