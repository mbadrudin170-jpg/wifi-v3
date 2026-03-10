// path: components/tombol/tombol-simpan.tsx
import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

interface TombolSimpanProps extends PressableProps {
  onPress?: () => void;
}

/**
 * Komponen tombol standar untuk aksi 'Simpan'.
 * @param {TombolSimpanProps} props - Properti untuk komponen tombol.
 */
export default function TombolSimpan({ onPress, ...props }: TombolSimpanProps) {
  return (
    <Pressable style={styles.wadah} onPress={onPress} {...props}>
      <Text style={styles.teks}>Simpan</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wadah: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teks: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32', // Warna hijau
  },
});
