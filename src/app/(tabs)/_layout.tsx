import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Palette } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Palette.background },
        headerShadowVisible: false,
        headerTintColor: Palette.text,
        tabBarStyle: { backgroundColor: Palette.surface, borderTopColor: Palette.border },
        tabBarActiveTintColor: Palette.accent,
        tabBarInactiveTintColor: Palette.textTertiary,
        sceneStyle: { backgroundColor: Palette.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Table',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="elements"
        options={{
          title: 'Elements',
          tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Tools',
          tabBarIcon: ({ color, size }) => <Ionicons name="flask-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
