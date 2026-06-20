import { DarkTheme, DefaultTheme, Stack, ThemeProvider as RouterThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ElementNotesProvider } from '@/context/element-notes-context';
import { ThemeProvider } from '@/context/theme-context';
import { getPalette } from '@/constants/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const palette = useMemo(() => getPalette(colorScheme), [colorScheme]);
  const isLight = colorScheme === 'light';
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ElementNotesProvider>
          <RouterThemeProvider value={routerTheme}>
            <StatusBar style="auto" />
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
              <Stack.Screen name="qr" options={{ title: 'QR-Code', headerBackTitle: 'Back' }} />
              <Stack.Screen name="reactions" options={{ title: 'Reactions', headerBackTitle: 'Back' }} />
              <Stack.Screen name="trends" options={{ title: 'Trends', headerBackTitle: 'Back' }} />
              <Stack.Screen name="dictionary" options={{ title: 'Dictionary', headerBackTitle: 'Back' }} />
              <Stack.Screen name="academy" options={{ title: 'Academy', headerBackTitle: 'Back' }} />
            </Stack>
          </RouterThemeProvider>
        </ElementNotesProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
