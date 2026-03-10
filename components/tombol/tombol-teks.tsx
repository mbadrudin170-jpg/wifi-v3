// Path: components/tombol/tombol-teks.tsx
import { useThemeColor } from '@/hooks/use-theme-color';
import { Pressable, PressableProps } from 'react-native';
import { ThemedText } from '../themed-text';

interface TombolTeksProps extends PressableProps {
  teks: string;
}

/**
 * FUNGSI:
 * Komponen tombol berbasis teks yang dapat digunakan kembali, cocok untuk header.
 * Menerima properti `onPress` untuk aksi dan `teks` untuk label tombol.
 * Warnanya akan otomatis menyesuaikan dengan tema (terang/gelap).
 */
export default function TombolTeks({ teks, ...props }: TombolTeksProps) {
  const color = useThemeColor({}, 'tint');

  return (
    <Pressable {...props}>
      <ThemedText style={{ color, fontSize: 16 }}>{teks}</ThemedText>
    </Pressable>
  );
}
