// Path: /home/user/wifi-v3/components/ui/icon-symbol.tsx
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// Mapping dari nama "SF Symbols" (standar iOS) ke MaterialIcons (Android/Web)
const MAPPING = {
  'house.fill': 'dashboard',
  'inventory.fill': 'inventory',
  'person.2.fill': 'people-alt',
  'banknote.fill': 'payments', // Ikon yang lebih cocok untuk Transaksi
  'paperplane.fill': 'send',
  'chevron.right': 'chevron-right',
} as const;

type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
