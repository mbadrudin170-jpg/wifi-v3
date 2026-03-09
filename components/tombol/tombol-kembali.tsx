// Path: components/tombol/tombol-kembali.tsx
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

interface TombolKembaliProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * Komponen tombol kembali yang dapat digunakan kembali.
 * Menggunakan ikon panah kembali dan secara otomatis menangani navigasi kembali.
 * Warna ikon akan menyesuaikan dengan tema aplikasi.
 */
export default function TombolKembali({ style, ...props }: TombolKembaliProps) {
  const iconColor = useThemeColor({}, 'text');

  return (
    <Pressable onPress={() => router.back()} style={style} {...props}>
      <MaterialIcons name='arrow-back' size={24} color={iconColor} />
    </Pressable>
  );
}
