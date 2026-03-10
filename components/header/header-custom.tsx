// Path: /home/user/wifi-v3/components/header-custom.tsx
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

interface HeaderCustomProps {
  children?: ReactNode;
  leftAccessory?: ReactNode;
  rightAccessory?: ReactNode;
  style?: StyleProp<ViewStyle>;
  title?: string;
}

/**
 * FUNGSI:
 * HeaderCustom adalah komponen header serbaguna yang dapat dikonfigurasi.
 * Komponen ini secara otomatis menangani "safe area" di bagian atas layar.
 * Terdiri dari tiga bagian utama: kiri (leftAccessory), tengah (title, children),
 * dan kanan (rightAccessory) untuk fleksibilitas tata letak maksimum.
 */ export default function HeaderCustom({
  children,
  leftAccessory,
  rightAccessory,
  style,
  title,
}: HeaderCustomProps) {
  return (
    <ThemedView style={[styles.container, style]}>
      <ThemedView style={styles.content}>
        {/* Bagian Kiri - Hanya render jika ada konten */}
        {leftAccessory && (
          <ThemedView style={styles.accessoryContainer}>{leftAccessory}</ThemedView>
        )}

        {/* Bagian Tengah - Akan mengisi ruang yang tersedia */}
        <ThemedView
          style={[
            styles.centerContainer,
            // Penyesuaian flex berdasarkan aksesori yang ada
            !leftAccessory && !rightAccessory && styles.centerContainerFull,
            !leftAccessory && styles.centerContainerNoLeft,
            !rightAccessory && styles.centerContainerNoRight,
          ]}
        >
          {title && <ThemedText>{title}</ThemedText>}
          {children}
        </ThemedView>

        {/* Bagian Kanan - Hanya render jika ada konten */}
        {rightAccessory && (
          <ThemedView style={[styles.accessoryContainer, styles.rightAccessory]}>
            {rightAccessory}
          </ThemedView>
        )}
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
    backgroundColor: 'transparent',
  },
  accessoryContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  centerContainer: {
    flex: 3,
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  centerContainerFull: {
    flex: 1, // Full width jika tidak ada aksesori
  },
  centerContainerNoLeft: {
    marginLeft: 0, // Mulai dari kiri jika tidak ada left accessory
  },
  centerContainerNoRight: {
    marginRight: 0,
  },
  rightAccessory: {
    alignItems: 'flex-end',
  },
});
