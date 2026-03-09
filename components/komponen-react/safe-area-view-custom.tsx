// Path: ~/wifi-v3/components/komponen-react/safe-area-view-custom.tsx
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaViewCustomProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function SafeAreaViewCustom({ children, style }: SafeAreaViewCustomProps) {
  return (
    <SafeAreaView style={[styles.container, style]} edges={['left', 'right', 'top']}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
