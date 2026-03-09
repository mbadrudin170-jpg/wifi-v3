// Path: /home/user/wifi-v3/components/header-custom.tsx
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from './themed-view';

interface HeaderCustomProps {
  children: ReactNode;
  leftAccessory?: ReactNode;
  rightAccessory?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function HeaderCustom({
  children,
  leftAccessory,
  rightAccessory,
  style,
}: HeaderCustomProps) {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
        style,
      ]}
    >
      <ThemedView style={styles.content}>
        <ThemedView style={styles.leftAccessory}>{leftAccessory}</ThemedView>

        {/* PERBAIKAN: Gunakan <View> sebagai wadah agar bisa menampung banyak komponen */}
        <ThemedView style={styles.centerContainer}>{children}</ThemedView>

        <ThemedView style={styles.rightAccessory}>{rightAccessory}</ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  leftAccessory: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // PERBAIKAN: Mengganti nama dan properti style agar lebih fleksibel
  centerContainer: {
    flex: 2,
    alignItems: 'center', // Memusatkan konten di dalamnya (seperti teks)
  },
  rightAccessory: {
    flex: 1,
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
});
