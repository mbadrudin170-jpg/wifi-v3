// Path: ~/wifi-v3/app/(tabs)/_layout.tsx

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[(colorScheme ?? 'light') as 'light' | 'dark'].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        headerShown: false,
        tabBarButton: HapticTab, // Menggunakan feedback getaran saat ditekan
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name='statistik'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol name='house.fill' size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol name='house.fill' size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name='paket'
        options={{
          title: 'Paket',
          tabBarIcon: ({ color }) => <IconSymbol name='inventory.fill' size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name='pelanggan'
        options={{
          title: 'Pelanggan',
          tabBarIcon: ({ color }) => <IconSymbol name='person.2.fill' size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name='transaksi'
        options={{
          title: 'Transaksi',
          tabBarIcon: ({ color }) => <IconSymbol name='banknote.fill' size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name='dompet'
        options={{
          title: 'Dompet',
          tabBarIcon: ({ color }) => <IconSymbol name='wallet.pass.fill' size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name='kategori'
        options={{
          title: 'Kategori',
          tabBarIcon: ({ color }) => (
            <IconSymbol name='rectangle.stack.fill' size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
