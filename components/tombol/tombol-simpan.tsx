// path: components/tombol/tombol-simpan.tsx
import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

interface TombolSimpanProps extends PressableProps {
  onPress?: () => void;
}

/**
 * Komponen tombol standar untuk aksi 'Simpan' dengan gaya yang lebih modern.
 * @param {TombolSimpanProps} props - Properti untuk komponen tombol.
 */
export default function TombolSimpan({ onPress, ...props }: TombolSimpanProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.wadah, pressed && styles.wadahPressed]}
      onPress={onPress}
      {...props}
    >
      <Text style={styles.teks}>Simpan</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wadah: {
    backgroundColor: '#4CAF50', // Warna hijau yang cerah dan positif
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 16,
    marginHorizontal: 16,
    elevation: 4, // Bayangan untuk Android
    shadowColor: '#2E7D32', // Bayangan untuk iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  wadahPressed: {
    backgroundColor: '#43A047', // Warna sedikit lebih gelap saat ditekan
    elevation: 2, // Kurangi bayangan saat ditekan
  },
  teks: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // Teks putih untuk kontras
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
