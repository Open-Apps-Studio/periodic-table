import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import { getPalette, type PaletteColors } from '@/constants/theme';

const STORAGE_KEY = 'periodic-table:theme-preference';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ThemeScheme = 'light' | 'dark';

interface ThemeContextValue {
  palette: PaletteColors;
  scheme: ThemeScheme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  palette: getPalette('dark'),
  scheme: 'dark',
  preference: 'system',
  setPreference: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setPreferenceState(stored);
        }
      })
      .catch(() => {});
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const scheme: ThemeScheme =
    preference === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : preference;

  const value = useMemo(
    () => ({ palette: getPalette(scheme), scheme, preference, setPreference }),
    [scheme, preference, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function usePalette(): PaletteColors {
  return useContext(ThemeContext).palette;
}

export function useThemeScheme(): ThemeScheme {
  return useContext(ThemeContext).scheme;
}

export function useThemePreference(): {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
} {
  const { preference, setPreference } = useContext(ThemeContext);
  return { preference, setPreference };
}
