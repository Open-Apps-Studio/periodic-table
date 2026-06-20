import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { CategoryColors, CategoryLabels, withAlpha } from '@/constants/theme';
import { useElementNotes } from '@/context/element-notes-context';
import { usePalette } from '@/context/theme-context';
import { ELEMENTS, getElement } from '@/data/elements';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import type { PeriodicElement } from '@/types/element';

type FilterId = 'saved' | 'favorites' | 'all';

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: 'saved', label: 'Saved' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'all', label: 'All elements' },
];

export default function NotesScreen() {
  const router = useRouter();
  const palette = usePalette();
  const { entries, getEntry, loaded, toggleFavorite } = useElementNotes();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterId>('saved');
  const styles = useThemedStyles((p) => ({
    container: { flex: 1, backgroundColor: p.background },
    content: { padding: 14, gap: 10, paddingBottom: 28 },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
    },
    input: { flex: 1, color: p.text, fontSize: 15, paddingVertical: 11 },
    filterRow: { flexDirection: 'row', gap: 8 },
    filterButton: {
      paddingHorizontal: 11,
      paddingVertical: 7,
      borderRadius: 14,
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
    },
    filterActive: { backgroundColor: withAlpha(p.accent, 0.16), borderColor: p.accent },
    filterText: { color: p.textSecondary, fontSize: 12.5, fontWeight: '800' },
    filterTextActive: { color: p.accent },
    intro: {
      color: p.textSecondary,
      fontSize: 12.5,
      lineHeight: 18,
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
      borderRadius: 12,
      padding: 12,
    },
    row: {
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
      borderRadius: 14,
      padding: 12,
      gap: 8,
    },
    rowTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    tile: {
      width: 46,
      height: 46,
      borderRadius: 11,
      borderWidth: 1.2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    symbol: { fontSize: 18, fontWeight: '900' },
    body: { flex: 1 },
    name: { color: p.text, fontSize: 15.5, fontWeight: '900' },
    meta: { color: p.textTertiary, fontSize: 12, fontWeight: '700', marginTop: 2 },
    favoriteButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: p.surfaceRaised,
    },
    note: { color: p.textSecondary, fontSize: 13, lineHeight: 19 },
    noteEmpty: { color: p.textTertiary, fontSize: 13, fontStyle: 'italic' },
    empty: { color: p.textTertiary, textAlign: 'center', marginTop: 42, fontSize: 14, lineHeight: 20 },
  }));

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const savedNumbers = new Set(entries.map((entry) => entry.elementNumber));
    const source =
      filter === 'all'
        ? ELEMENTS
        : filter === 'favorites'
          ? entries.filter((entry) => entry.favorite).map((entry) => getElement(entry.elementNumber)).filter(Boolean)
          : ELEMENTS.filter((el) => savedNumbers.has(el.number));

    return (source as PeriodicElement[]).filter((el) => {
      if (!q) return true;
      const entry = getEntry(el.number);
      return [el.name, el.symbol, el.number, CategoryLabels[el.category], entry.note].join(' ').toLowerCase().includes(q);
    });
  }, [entries, filter, getEntry, query]);

  return (
    <>
      <Stack.Screen options={{ title: 'Element Notes' }} />
      <View style={styles.container}>
        <FlatList
          data={rows}
          keyExtractor={(item) => String(item.number)}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color={palette.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="Search notes or elements"
                  placeholderTextColor={palette.textTertiary}
                  value={query}
                  onChangeText={setQuery}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.filterRow}>
                {FILTERS.map((item) => {
                  const active = filter === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => setFilter(item.id)}
                      style={[styles.filterButton, active && styles.filterActive]}>
                      <Text style={[styles.filterText, active && styles.filterTextActive]}>{item.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.intro}>
                Favorites and notes stay local on this device. Open an element to edit its note.
              </Text>
            </>
          }
          renderItem={({ item }) => (
            <NoteRow
              el={item}
              note={getEntry(item.number).note}
              favorite={getEntry(item.number).favorite}
              styles={styles}
              onFavorite={() => toggleFavorite(item.number)}
              onPress={() => router.push(`/element/${item.number}`)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {loaded ? 'No saved notes yet. Open an element and tap the heart or write a note.' : 'Loading notes...'}
            </Text>
          }
        />
      </View>
    </>
  );
}

function NoteRow({
  el,
  note,
  favorite,
  styles,
  onFavorite,
  onPress,
}: {
  el: PeriodicElement;
  note: string;
  favorite: boolean;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  onFavorite: () => void;
  onPress: () => void;
}) {
  const color = CategoryColors[el.category];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.65 }]}>
      <View style={styles.rowTop}>
        <View style={[styles.tile, { backgroundColor: withAlpha(color, 0.15), borderColor: withAlpha(color, 0.55) }]}>
          <Text style={[styles.symbol, { color }]}>{el.symbol}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.name}>{el.name}</Text>
          <Text style={styles.meta}>
            {el.number} · {CategoryLabels[el.category]}
          </Text>
        </View>
        <Pressable onPress={onFavorite} hitSlop={8} style={styles.favoriteButton}>
          <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={19} color={favorite ? '#E64980' : '#7B8794'} />
        </Pressable>
      </View>
      {note.trim() ? <Text style={styles.note}>{note.trim()}</Text> : <Text style={styles.noteEmpty}>No note yet.</Text>}
    </Pressable>
  );
}
