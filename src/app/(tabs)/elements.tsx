import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { searchElements } from '@/data/elements';
import { CategoryColors, CategoryLabels, Palette, withAlpha } from '@/constants/theme';
import { fmt } from '@/lib/format';
import type { PeriodicElement } from '@/types/element';

export default function ElementsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchElements(query), [query]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={Palette.textTertiary} />
        <TextInput
          style={styles.input}
          placeholder="Search by name, symbol or number"
          placeholderTextColor={Palette.textTertiary}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>
      <FlatList
        data={results}
        keyExtractor={(el) => String(el.number)}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <ElementRow el={item} onPress={() => router.push(`/element/${item.number}`)} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No elements match “{query.trim()}”</Text>
        }
      />
    </View>
  );
}

function ElementRow({ el, onPress }: { el: PeriodicElement; onPress: () => void }) {
  const color = CategoryColors[el.category];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
      <View style={[styles.tile, { backgroundColor: withAlpha(color, 0.16), borderColor: withAlpha(color, 0.55) }]}>
        <Text style={[styles.tileSymbol, { color }]}>{el.symbol}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowName}>{el.name}</Text>
        <Text style={styles.rowMeta}>
          {CategoryLabels[el.category]} · {fmt(el.atomicMass, 5)} u
        </Text>
      </View>
      <Text style={styles.rowNumber}>{el.number}</Text>
      <Ionicons name="chevron-forward" size={16} color={Palette.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.background },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  input: { flex: 1, color: Palette.text, fontSize: 15, paddingVertical: 11 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
  },
  tile: {
    width: 46,
    height: 46,
    borderRadius: 10,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileSymbol: { fontSize: 18, fontWeight: '800' },
  rowBody: { flex: 1 },
  rowName: { color: Palette.text, fontSize: 16, fontWeight: '700' },
  rowMeta: { color: Palette.textTertiary, fontSize: 12.5, marginTop: 2 },
  rowNumber: { color: Palette.textSecondary, fontSize: 15, fontWeight: '700' },
  empty: { color: Palette.textTertiary, textAlign: 'center', marginTop: 48, fontSize: 14 },
});
