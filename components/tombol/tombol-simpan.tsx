// Path: components/tombol/tombol-simpan.tsx
import { ReactNode } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

interface TombolSimpanProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  teks: ReactNode;
  children?: ReactNode;
}

/**
 * Komponen tombol simpan yang dapat digunakan kembali.
 * Menggunakan ikon simpan (save) dan menyediakan prop onPress untuk menangani aksi.
 * Warna ikon akan menyesuaikan dengan tema aplikasi.
 */
export default function TombolSimpan({
  style,
  onPress,
  teks,
  children,
  ...props
}: TombolSimpanProps) {
  return (
    <ThemedView style={styles.wadahTombolSimpan}>
      <Pressable onPress={onPress} style={[styles.tombolSimpan, style]} {...props}>
        <ThemedText type='subtitle' lightColor='white'>
          {teks}
        </ThemedText>
        {children}
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wadahTombolSimpan: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tombolSimpan: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
