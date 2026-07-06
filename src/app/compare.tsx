import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { CategoryColors, CategoryLabels, withAlpha } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { ELEMENTS, getElement } from '@/data/elements';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { fmt, fmtKelvinShort, fmtYear } from '@/lib/format';
import {
  displayAtomicRadius,
  displayVanDerWaalsRadius,
  fmtGpa,
  fmtPercent,
  fmtResistivity,
  fmtUsd,
} from '@/lib/format-properties';
import type { PeriodicElement } from '@/types/element';

type Side = 'left' | 'right';

export default function CompareScreen() {
  const params = useLocalSearchParams<{ left?: string; right?: string }>();
  const palette = usePalette();
  const router = useRouter();
  const initialLeft = getElement(Number(params.left)) ?? getElement(1)!;
  const initialRight = getElement(Number(params.right)) ?? getElement(8)!;
  const [left, setLeft] = useState(initialLeft);
  const [right, setRight] = useState(initialRight);
  const [side, setSide] = useState<Side>('left');
  const [query, setQuery] = useState('');
  const styles = useThemedStyles((p) => ({
    container: { flex: 1, backgroundColor: p.background },
    content: { padding: 14, gap: 12, paddingBottom: 34 },
    selectorRow: { flexDirection: 'row', gap: 10 },
    selectedCard: {
      flex: 1,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: p.border,
      backgroundColor: p.surface,
      padding: 10,
      gap: 6,
    },
    selectedActive: { borderColor: p.accent, backgroundColor: withAlpha(p.accent, 0.1) },
    selectedTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    tile: {
      width: 42,
      height: 42,
      borderRadius: 10,
      borderWidth: 1.2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    symbol: { fontSize: 17, fontWeight: '900' },
    selectedName: { color: p.text, fontSize: 14, fontWeight: '900', flex: 1 },
    selectedMeta: { color: p.textTertiary, fontSize: 11.5, fontWeight: '700' },
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
    input: { flex: 1, color: p.text, fontSize: 15, paddingVertical: 10 },
    pickList: { maxHeight: 190, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: p.border },
    pickRow: {
      minHeight: 46,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 10,
      backgroundColor: p.surface,
      borderBottomWidth: 0.5,
      borderBottomColor: p.border,
    },
    miniTile: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    miniSymbol: { fontSize: 13, fontWeight: '900' },
    pickName: { color: p.text, fontSize: 13.5, fontWeight: '800', flex: 1 },
    compareCard: {
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
      borderRadius: 14,
      overflow: 'hidden',
    },
    compareHeader: {
      flexDirection: 'row',
      backgroundColor: p.surfaceRaised,
      borderBottomWidth: 1,
      borderBottomColor: p.border,
      paddingVertical: 10,
      paddingHorizontal: 12,
      gap: 10,
    },
    headerText: { flex: 1, color: p.text, fontSize: 13, fontWeight: '900', textAlign: 'center' },
    compareRow: {
      flexDirection: 'row',
      gap: 10,
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderBottomWidth: 0.5,
      borderBottomColor: p.border,
    },
    compareLabel: { width: 116, color: p.textTertiary, fontSize: 12.5, fontWeight: '800' },
    compareValue: { flex: 1, color: p.text, fontSize: 12.5, fontWeight: '700', lineHeight: 18, textAlign: 'center' },
    actionRow: { flexDirection: 'row', gap: 10 },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: withAlpha(p.accent, 0.4),
      backgroundColor: withAlpha(p.accent, 0.1),
    },
    actionText: { color: p.accent, fontSize: 13, fontWeight: '900' },
  }));

  const picks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ELEMENTS;
    const n = Number(q);
    return ELEMENTS.filter(
      (el) =>
        el.name.toLowerCase().includes(q) ||
        el.symbol.toLowerCase().startsWith(q) ||
        (!Number.isNaN(n) && el.number === n),
    );
  }, [query]);

  const setSelected = (el: PeriodicElement) => {
    if (side === 'left') setLeft(el);
    else setRight(el);
    setQuery('');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Compare Elements' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.selectorRow}>
          <SelectedElement side="left" active={side === 'left'} el={left} styles={styles} onPress={() => setSide('left')} />
          <SelectedElement side="right" active={side === 'right'} el={right} styles={styles} onPress={() => setSide('right')} />
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={palette.textTertiary} />
          <TextInput
            style={styles.input}
            placeholder={`Choose ${side === 'left' ? 'left' : 'right'} element`}
            placeholderTextColor={palette.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.pickList}>
          <FlatList
            data={picks.slice(0, 24)}
            keyExtractor={(item) => String(item.number)}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable onPress={() => setSelected(item)} style={({ pressed }) => [styles.pickRow, pressed && { opacity: 0.65 }]}>
                <MiniTile el={item} styles={styles} />
                <Text style={styles.pickName}>{item.name}</Text>
                <Text style={styles.selectedMeta}>{item.number}</Text>
              </Pressable>
            )}
          />
        </View>

        <View style={styles.compareCard}>
          <View style={styles.compareHeader}>
            <Text style={styles.compareLabel}>Property</Text>
            <Text style={styles.headerText}>{left.symbol}</Text>
            <Text style={styles.headerText}>{right.symbol}</Text>
          </View>
          {comparisonRows(left, right).map(([label, a, b]) => (
            <View key={label} style={styles.compareRow}>
              <Text style={styles.compareLabel}>{label}</Text>
              <Text style={styles.compareValue}>{a}</Text>
              <Text style={styles.compareValue}>{b}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.actionButton} onPress={() => router.push(`/element/${left.number}`)}>
            <Ionicons name="open-outline" size={16} color={palette.accent} />
            <Text style={styles.actionText}>Open {left.symbol}</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => router.push(`/element/${right.number}`)}>
            <Ionicons name="open-outline" size={16} color={palette.accent} />
            <Text style={styles.actionText}>Open {right.symbol}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

function SelectedElement({
  side,
  active,
  el,
  styles,
  onPress,
}: {
  side: Side;
  active: boolean;
  el: PeriodicElement;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  onPress: () => void;
}) {
  const color = CategoryColors[el.category];
  return (
    <Pressable onPress={onPress} style={[styles.selectedCard, active && styles.selectedActive]}>
      <View style={styles.selectedTop}>
        <View style={[styles.tile, { backgroundColor: withAlpha(color, 0.16), borderColor: withAlpha(color, 0.55) }]}>
          <Text style={[styles.symbol, { color }]}>{el.symbol}</Text>
        </View>
        <Text style={styles.selectedName}>{el.name}</Text>
      </View>
      <Text style={styles.selectedMeta}>{side === 'left' ? 'Left' : 'Right'} · {CategoryLabels[el.category]}</Text>
    </Pressable>
  );
}

function MiniTile({
  el,
  styles,
}: {
  el: PeriodicElement;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
}) {
  const color = CategoryColors[el.category];
  return (
    <View style={[styles.miniTile, { backgroundColor: withAlpha(color, 0.16) }]}>
      <Text style={[styles.miniSymbol, { color }]}>{el.symbol}</Text>
    </View>
  );
}

function comparisonRows(left: PeriodicElement, right: PeriodicElement): [string, string, string][] {
  const row = (label: string, fn: (el: PeriodicElement) => string): [string, string, string] => [
    label,
    fn(left),
    fn(right),
  ];
  return [
    row('Atomic number', (el) => String(el.number)),
    row('Category', (el) => CategoryLabels[el.category]),
    row('Group / Period', (el) => `${el.group} / ${el.period}`),
    row('Block / Phase', (el) => `${el.block}-block / ${el.phase}`),
    row('Atomic mass', (el) => `${fmt(el.atomicMass, 7)} u`),
    row('Density', (el) => (el.densityValue == null ? '—' : `${fmt(el.densityValue, 4)} g/cm³`)),
    row('Melting point', (el) => fmtKelvinShort(el.melt)),
    row('Boiling point', (el) => fmtKelvinShort(el.boil)),
    row('Electronegativity', (el) => (el.electronegativity == null ? '—' : fmt(el.electronegativity, 3))),
    row('Atomic radius', (el) => displayAtomicRadius(el) ?? '—'),
    row('Van der Waals', (el) => displayVanDerWaalsRadius(el) ?? '—'),
    row('Ionization 1st', (el) => (el.ionizationEnergies[0] == null ? '—' : `${fmt(el.ionizationEnergies[0], 5)} kJ/mol`)),
    row('Thermal cond.', (el) => (el.thermalConductivity == null ? '—' : `${fmt(el.thermalConductivity, 4)} W/mK`)),
    row('Resistivity', (el) => fmtResistivity(el.resistivity) ?? '—'),
    row('Crystal', (el) => el.crystalStructure ?? '—'),
    row('Crust abundance', (el) => fmtPercent(el.abundanceCrust) ?? '—'),
    row('Cost / 100g', (el) => fmtUsd(el.priceUsdPer100g) ?? '—'),
    row('Stable isotopes', (el) => el.isotopesStable ?? '—'),
    row('CAS', (el) => (el.casNumber == null ? '—' : `CAS${el.casNumber}`)),
    row('Discovered', (el) => `${fmtYear(el.yearDiscovered)} · ${el.discoveryLocation ?? '—'}`),
    row('Name origin', (el) => el.nameOrigin ?? '—'),
    row('Bulk modulus', (el) => fmtGpa(el.bulkModulus) ?? '—'),
  ];
}
