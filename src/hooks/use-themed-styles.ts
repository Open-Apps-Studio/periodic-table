import { useMemo } from 'react';
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';
import { usePalette } from '@/context/theme-context';
import type { PaletteColors } from '@/constants/theme';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export function useThemedStyles<T extends NamedStyles<T>>(
  factory: (palette: PaletteColors) => T,
): T {
  const palette = usePalette();
  return useMemo(() => StyleSheet.create(factory(palette)), [palette]);
}
