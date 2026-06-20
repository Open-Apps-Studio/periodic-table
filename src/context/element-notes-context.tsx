import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'periodic-table.element-notes.v1';

export interface ElementNoteEntry {
  elementNumber: number;
  favorite: boolean;
  note: string;
  updatedAt: string;
}

type ElementNoteMap = Record<string, ElementNoteEntry>;

interface ElementNotesContextValue {
  loaded: boolean;
  entries: ElementNoteEntry[];
  getEntry: (elementNumber: number) => ElementNoteEntry;
  setNote: (elementNumber: number, note: string) => void;
  toggleFavorite: (elementNumber: number) => void;
}

const EMPTY_ENTRY = (elementNumber: number): ElementNoteEntry => ({
  elementNumber,
  favorite: false,
  note: '',
  updatedAt: '',
});

const ElementNotesContext = createContext<ElementNotesContextValue | null>(null);

export function ElementNotesProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [notes, setNotes] = useState<ElementNoteMap>({});

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active || !raw) return;
        const parsed = JSON.parse(raw) as ElementNoteMap;
        setNotes(parsed);
      })
      .catch(() => {
        if (active) setNotes({});
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes)).catch(() => {});
  }, [loaded, notes]);

  const updateEntry = useCallback((elementNumber: number, updater: (entry: ElementNoteEntry) => ElementNoteEntry) => {
    setNotes((current) => {
      const key = String(elementNumber);
      const nextEntry = updater(current[key] ?? EMPTY_ENTRY(elementNumber));
      const shouldKeep = nextEntry.favorite || nextEntry.note.trim().length > 0;
      if (!shouldKeep) {
        const rest = { ...current };
        delete rest[key];
        return rest;
      }
      return { ...current, [key]: nextEntry };
    });
  }, []);

  const getEntry = useCallback((elementNumber: number) => notes[String(elementNumber)] ?? EMPTY_ENTRY(elementNumber), [notes]);

  const setNote = useCallback(
    (elementNumber: number, note: string) => {
      updateEntry(elementNumber, (entry) => ({
        ...entry,
        note,
        updatedAt: new Date().toISOString(),
      }));
    },
    [updateEntry],
  );

  const toggleFavorite = useCallback(
    (elementNumber: number) => {
      updateEntry(elementNumber, (entry) => ({
        ...entry,
        favorite: !entry.favorite,
        updatedAt: new Date().toISOString(),
      }));
    },
    [updateEntry],
  );

  const entries = useMemo(
    () =>
      Object.values(notes).sort((a, b) => {
        if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      }),
    [notes],
  );

  const value = useMemo(
    () => ({ loaded, entries, getEntry, setNote, toggleFavorite }),
    [entries, getEntry, loaded, setNote, toggleFavorite],
  );

  return <ElementNotesContext.Provider value={value}>{children}</ElementNotesContext.Provider>;
}

export function useElementNotes() {
  const context = useContext(ElementNotesContext);
  if (!context) throw new Error('useElementNotes must be used inside ElementNotesProvider');
  return context;
}
