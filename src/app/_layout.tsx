import { DarkTheme, DefaultTheme, Stack, ThemeProvider as RouterThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ElementNotesProvider } from '@/context/element-notes-context';
import { ThemeProvider, usePalette, useThemeScheme } from '@/context/theme-context';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ElementNotesProvider>
          <ThemedNavigation />
        </ElementNotesProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function ThemedNavigation() {
  const palette = usePalette();
  const scheme = useThemeScheme();
  const isLight = scheme === 'light';
  const routerTheme = useMemo(
    () => ({
      ...(isLight ? DefaultTheme : DarkTheme),
      colors: {
        ...(isLight ? DefaultTheme : DarkTheme).colors,
        background: palette.background,
        card: palette.surface,
        border: palette.border,
        text: palette.text,
        primary: palette.accent,
      },
    }),
    [isLight, palette],
  );

  return (
    <RouterThemeProvider value={routerTheme}>
      <StatusBar style={isLight ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: palette.background },
          headerTintColor: palette.text,
          contentStyle: { backgroundColor: palette.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="element/[number]" options={{ title: '', headerBackTitle: 'Back' }} />
        <Stack.Screen name="isotopes" options={{ title: 'Isotopes', headerBackTitle: 'Back' }} />
        <Stack.Screen name="compare" options={{ title: 'Compare Elements', headerBackTitle: 'Back' }} />
        <Stack.Screen name="notes" options={{ title: 'Element Notes', headerBackTitle: 'Back' }} />
        <Stack.Screen name="qr" options={{ title: 'Share the App', headerBackTitle: 'Back' }} />
        <Stack.Screen name="reactions" options={{ title: 'Reactions', headerBackTitle: 'Back' }} />
        <Stack.Screen name="trends" options={{ title: 'Trends', headerBackTitle: 'Back' }} />
        <Stack.Screen name="dictionary" options={{ title: 'Dictionary', headerBackTitle: 'Back' }} />
        <Stack.Screen name="academy" options={{ title: 'Academy', headerBackTitle: 'Back' }} />
      </Stack>
    </RouterThemeProvider>
  );
}
