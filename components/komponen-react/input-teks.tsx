// Path: components/komponen-react/input-teks.tsx
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

interface InputTeksProps extends TextInputProps {
  label: string;
  style?: TextInputProps['style'];
}

const InputTeks = forwardRef<TextInput, InputTeksProps>(({ label, style, ...props }, ref) => {
  const borderColor = useThemeColor({ light: '#ccc', dark: '#555' }, 'text');
  const color = useThemeColor({ light: '#000', dark: '#fff' }, 'text');

  return (
    <View style={styles.container}>
      <ThemedText type='default' style={styles.label}>
        {label}
      </ThemedText>
      <TextInput
        ref={ref}
        style={[styles.input, { borderColor, color }, style]}
        placeholderTextColor='#999'
        {...props}
      />
    </View>
  );
});

// PERBAIKAN: Menambahkan displayName untuk mematuhi aturan react/display-name.
InputTeks.displayName = 'InputTeks';

export default InputTeks;

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
