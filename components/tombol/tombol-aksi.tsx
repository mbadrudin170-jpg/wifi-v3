// path: components/tombol/tombol-aksi.tsx
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

interface TombolAksiProps extends PressableProps {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary';
}

/**
 * FUNGSI:
 * Komponen tombol aksi yang dapat digunakan kembali dengan beberapa varian visual.
 * Didesain untuk aksi utama (seperti 'Simpan') atau aksi sekunder.
 * Tombol ini akan mengisi lebar kontainernya.
 */
export default function TombolAksi({
  title,
  onPress,
  style,
  variant = 'primary',
  ...props
}: TombolAksiProps) {
  return (
    <Pressable
      style={[
        styles.wadah,
        variant === 'primary' ? styles.primaryWadah : styles.secondaryWadah,
        style,
      ]}
      onPress={onPress}
      {...props}
    >
      <Text style={[styles.teks, variant === 'primary' ? styles.primaryTeks : styles.secondaryTeks]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wadah: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Tombol akan mengisi lebar parent
  },
  primaryWadah: {
    backgroundColor: '#2E7D32', // Warna hijau primer
  },
  secondaryWadah: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  teks: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryTeks: {
    color: '#FFFFFF',
  },
  secondaryTeks: {
    color: '#2E7D32',
  },
});
