import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { getPalette, type PaletteColors } from '@/constants/theme';

const PaletteContext = createContext<PaletteColors>(getPalette('dark'));

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const palette = useMemo(() => getPalette(colorScheme), [colorScheme]);

  return <PaletteContext.Provider value={palette}>{children}</PaletteContext.Provider>;
}

export function usePalette(): PaletteColors {
  return useContext(PaletteContext);
}
