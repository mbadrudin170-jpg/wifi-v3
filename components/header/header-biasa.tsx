// Path: ~/wifi-v3/components/header/header-biasa.tsx
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface HeaderBiasaProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}
export default function HeaderBiasa({ children, style }: HeaderBiasaProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal:6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
});
