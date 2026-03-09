// Path: ~/wifi-v3/components/komponen-react/input-teks.tsx
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

interface InputTeksProps extends TextInputProps {
  label: string;
  style?: TextInputProps['style'];
}

export default function InputTeks({ label, style, ...props }: InputTeksProps) {
  const borderColor = useThemeColor({ light: '#ccc', dark: '#555' }, 'text');
  const color = useThemeColor({ light: '#000', dark: '#fff' }, 'text');

  return (
    <View style={styles.container}>
      <ThemedText type='default' style={styles.label}>
        {label}
      </ThemedText>
      <TextInput
        style={[styles.input, { borderColor, color }, style]}
        placeholderTextColor='#999'
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
