import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { withAlpha } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { CATEGORY_LABELS, GLOSSARY, type GlossaryCategory, type GlossaryEntry } from '@/data/learning';
import { useThemedStyles } from '@/hooks/use-themed-styles';

const CATEGORIES: Array<'all' | GlossaryCategory> = ['all', 'atoms', 'periodic-table', 'bonding', 'reactions', 'solutions', 'nuclear', 'measurement'];

const CATEGORY_COLORS: Record<GlossaryCategory, string> = {
  atoms: '#228BE6',
  'periodic-table': '#2F9E44',
  bonding: '#7950F2',
  reactions: '#E8590C',
  solutions: '#0B7285',
  nuclear: '#495057',
  measurement: '#C2255C',
};

export default function DictionaryScreen() {
  const palette = usePalette();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | GlossaryCategory>('all');
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
    filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    filter: {
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 14,
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
    },
    filterActive: { backgroundColor: withAlpha(p.accent, 0.16), borderColor: p.accent },
    filterText: { color: p.textSecondary, fontSize: 12, fontWeight: '800' },
    filterTextActive: { color: p.accent },
    count: { color: p.textTertiary, fontSize: 12.5, fontWeight: '800' },
    row: {
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
      borderRadius: 14,
      padding: 12,
      gap: 8,
    },
    rowTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconDisc: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    termBody: { flex: 1, gap: 2 },
    term: { color: p.text, fontSize: 16, fontWeight: '900' },
    category: { color: p.textTertiary, fontSize: 12, fontWeight: '800' },
    definition: { color: p.textSecondary, fontSize: 13.5, lineHeight: 20 },
    example: {
      color: p.text,
      fontSize: 12.5,
      lineHeight: 18,
      backgroundColor: p.surfaceRaised,
      borderRadius: 10,
      padding: 9,
      fontWeight: '700',
    },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    tag: { borderRadius: 9, borderWidth: 1, borderColor: p.border, paddingHorizontal: 7, paddingVertical: 3 },
    tagText: { color: p.textTertiary, fontSize: 11.5, fontWeight: '800' },
    empty: { color: p.textTertiary, textAlign: 'center', marginTop: 42, fontSize: 14 },
  }));

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((entry) => {
      if (category !== 'all' && entry.category !== category) return false;
      if (!q) return true;
      return [entry.term, CATEGORY_LABELS[entry.category], entry.definition, entry.example, entry.tags.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [category, query]);

  return (
    <>
      <Stack.Screen options={{ title: 'Dictionary' }} />
      <View style={styles.container}>
        <FlatList
          data={rows}
          keyExtractor={(item) => item.term}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color={palette.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="Search atom, molarity, redox..."
                  placeholderTextColor={palette.textTertiary}
                  value={query}
                  onChangeText={setQuery}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.filterRow}>
                {CATEGORIES.map((item) => {
                  const active = item === category;
                  return (
                    <Pressable key={item} onPress={() => setCategory(item)} style={[styles.filter, active && styles.filterActive]}>
                      <Text style={[styles.filterText, active && styles.filterTextActive]}>
                        {item === 'all' ? 'All' : CATEGORY_LABELS[item]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.count}>{rows.length} of {GLOSSARY.length} terms</Text>
            </>
          }
          renderItem={({ item }) => <GlossaryRow item={item} styles={styles} />}
          ListEmptyComponent={<Text style={styles.empty}>No dictionary terms match your search.</Text>}
        />
      </View>
    </>
  );
}

function GlossaryRow({
  item,
  styles,
}: {
  item: GlossaryEntry;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
}) {
  const color = CATEGORY_COLORS[item.category];
  return (
    <View style={styles.row}>
      <View style={styles.rowTop}>
        <View style={[styles.iconDisc, { backgroundColor: withAlpha(color, 0.16) }]}>
          <Ionicons name={iconForCategory(item.category)} size={17} color={color} />
        </View>
        <View style={styles.termBody}>
          <Text style={styles.term}>{item.term}</Text>
          <Text style={styles.category}>{CATEGORY_LABELS[item.category]}</Text>
        </View>
      </View>
      <Text style={styles.definition}>{item.definition}</Text>
      <Text style={styles.example}>{item.example}</Text>
      <View style={styles.tagRow}>
        {item.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function iconForCategory(category: GlossaryCategory): keyof typeof Ionicons.glyphMap {
  if (category === 'atoms') return 'radio-button-on-outline';
  if (category === 'periodic-table') return 'grid-outline';
  if (category === 'bonding') return 'git-network-outline';
  if (category === 'reactions') return 'flask-outline';
  if (category === 'solutions') return 'water-outline';
  if (category === 'nuclear') return 'radio-outline';
  return 'scale-outline';
}
