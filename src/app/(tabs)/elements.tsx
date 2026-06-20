import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryColors, CategoryLabels, withAlpha } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { ELEMENTS } from '@/data/elements';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { fmt } from '@/lib/format';
import { filterElementsByScope, SEARCH_SCOPES } from '@/lib/property-fields';
import type { PeriodicElement } from '@/types/element';

export default function ElementsScreen() {
  const router = useRouter();
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles((p) => ({
    container: { flex: 1, backgroundColor: p.background },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginHorizontal: 16,
      marginTop: 10,
      marginBottom: 4,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
    },
    input: { flex: 1, color: p.text, fontSize: 15, paddingVertical: 11 },
    filterButton: {
      width: 34,
      height: 34,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: withAlpha(p.accent, 0.1),
    },
    filterHint: {
      color: p.textTertiary,
      fontSize: 12,
      fontWeight: '700',
      marginHorizontal: 18,
      marginBottom: 4,
    },
    list: { paddingHorizontal: 16, paddingBottom: Math.max(insets.bottom, 14) + 74 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 9,
      borderBottomWidth: 0.5,
      borderBottomColor: p.border,
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
    rowName: { color: p.text, fontSize: 16, fontWeight: '700' },
    rowMeta: { color: p.textTertiary, fontSize: 12.5, marginTop: 2 },
    rowNumber: { color: p.textSecondary, fontSize: 15, fontWeight: '700' },
    empty: { color: p.textTertiary, textAlign: 'center', marginTop: 48, fontSize: 14 },
    backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: withAlpha('#000000', 0.38) },
    sheet: {
      backgroundColor: p.surface,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      paddingBottom: Math.max(insets.bottom, 16),
    },
    handle: {
      alignSelf: 'center',
      width: 42,
      height: 4,
      borderRadius: 2,
      backgroundColor: p.border,
      marginTop: 10,
      marginBottom: 12,
    },
    sheetTitle: { color: p.text, fontSize: 20, fontWeight: '900', paddingHorizontal: 18, marginBottom: 8 },
    scopeRow: {
      minHeight: 46,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 18,
      borderTopWidth: 0.5,
      borderTopColor: p.border,
    },
    scopeText: { flex: 1, color: p.textSecondary, fontSize: 14.5, fontWeight: '800' },
    scopeTextActive: { color: p.text },
  }));

  const [query, setQuery] = useState('');
  const [scopeId, setScopeId] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const scope = SEARCH_SCOPES.find((item) => item.id === scopeId) ?? SEARCH_SCOPES[0];
  const results = useMemo(() => filterElementsByScope(ELEMENTS, query, scopeId), [query, scopeId]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={palette.textTertiary} />
        <TextInput
          style={styles.input}
          placeholder="Search by name, symbol, number or property"
          placeholderTextColor={palette.textTertiary}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        <Pressable
          onPress={() => setFilterOpen(true)}
          style={styles.filterButton}
          accessibilityLabel="Choose search property">
          <Ionicons name="filter" size={17} color={palette.accent} />
        </Pressable>
      </View>
      <Text style={styles.filterHint}>Search: {scope.label}</Text>
      <FlatList
        data={results}
        keyExtractor={(el) => String(el.number)}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <ElementRow el={item} styles={styles} onPress={() => router.push(`/element/${item.number}`)} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No elements match {query.trim()}</Text>}
      />
      <SearchScopePicker
        visible={filterOpen}
        selectedId={scopeId}
        styles={styles}
        palette={palette}
        onSelect={(id) => {
          setScopeId(id);
          setFilterOpen(false);
        }}
        onClose={() => setFilterOpen(false)}
      />
    </View>
  );
}

function ElementRow({
  el,
  styles,
  onPress,
}: {
  el: PeriodicElement;
  styles: {
    row: object;
    tile: object;
    tileSymbol: object;
    rowBody: object;
    rowName: object;
    rowMeta: object;
    rowNumber: object;
  };
  onPress: () => void;
}) {
  const palette = usePalette();
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
      <Ionicons name="chevron-forward" size={16} color={palette.textTertiary} />
    </Pressable>
  );
}

function SearchScopePicker({
  visible,
  selectedId,
  styles,
  palette,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selectedId: string;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  palette: ReturnType<typeof usePalette>;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Properties</Text>
          {SEARCH_SCOPES.map((scope) => {
            const active = scope.id === selectedId;
            return (
              <Pressable key={scope.id} onPress={() => onSelect(scope.id)} style={styles.scopeRow}>
                <Text style={[styles.scopeText, active && styles.scopeTextActive]}>{scope.label}</Text>
                {active && <Ionicons name="checkmark" size={18} color={palette.accent} />}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
