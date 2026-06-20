import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { CategoryColors, CategoryLabels, withAlpha } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { ELEMENTS, getElement } from '@/data/elements';
import { NUCLIDES } from '@/data/nuclides';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { fmt, fmtYear } from '@/lib/format';
import { fmtDuration, fmtPercent } from '@/lib/format-properties';
import type { Nuclide } from '@/types/nuclide';

type FilterId = 'all' | 'stable' | 'radioactive' | 'natural';

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'stable', label: 'Stable' },
  { id: 'radioactive', label: 'Radioactive' },
  { id: 'natural', label: 'Natural' },
];

const STABLE_COUNT = NUCLIDES.filter((nuclide) => nuclide.stable).length;
const NATURAL_COUNT = NUCLIDES.filter((nuclide) => nuclide.abundancePercent != null).length;

export default function IsotopesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const palette = usePalette();
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
    stats: { flexDirection: 'row', gap: 8 },
    stat: {
      flex: 1,
      minHeight: 62,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: p.border,
      backgroundColor: p.surface,
      padding: 10,
      justifyContent: 'center',
      gap: 2,
    },
    statValue: { color: p.text, fontSize: 17, fontWeight: '900' },
    statLabel: { color: p.textTertiary, fontSize: 11.5, fontWeight: '800' },
    filterRow: { flexDirection: 'row', gap: 8 },
    filter: {
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
      width: 54,
      height: 54,
      borderRadius: 12,
      borderWidth: 1.2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    massNumber: { position: 'absolute', top: 5, left: 7, fontSize: 10.5, fontWeight: '900' },
    symbol: { fontSize: 18, fontWeight: '900' },
    body: { flex: 1 },
    name: { color: p.text, fontSize: 15.5, fontWeight: '900' },
    meta: { color: p.textTertiary, fontSize: 12, fontWeight: '700', marginTop: 2 },
    badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
    badgeText: { fontSize: 11, fontWeight: '900' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    fact: {
      width: '48%',
      borderRadius: 10,
      backgroundColor: p.surfaceRaised,
      paddingHorizontal: 9,
      paddingVertical: 7,
      gap: 2,
    },
    factWide: { width: '100%' },
    label: { color: p.textTertiary, fontSize: 11.5, fontWeight: '900' },
    value: { color: p.textSecondary, fontSize: 12.5, lineHeight: 17, fontWeight: '700' },
    empty: { color: p.textTertiary, textAlign: 'center', marginTop: 42, fontSize: 14 },
  }));

  const [query, setQuery] = useState(params.q ?? '');
  const [filter, setFilter] = useState<FilterId>('all');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^([a-z]+)-(\d+)$/i, '$2$1');
    return NUCLIDES.filter((nuclide) => {
      if (filter === 'stable' && !nuclide.stable) return false;
      if (filter === 'radioactive' && nuclide.stable) return false;
      if (filter === 'natural' && nuclide.abundancePercent == null) return false;
      if (!q) return true;
      const element = getElement(nuclide.z);
      const compact = `${nuclide.massNumber}${nuclide.symbol}`.toLowerCase();
      return [
        compact,
        `${nuclide.symbol}-${nuclide.massNumber}`,
        nuclide.symbol,
        nuclide.z,
        nuclide.n,
        element?.name,
        element ? CategoryLabels[element.category] : null,
        nuclide.halfLife,
        nuclide.spinParity,
        nuclide.decayModes.map((mode) => mode.mode).join(' '),
        nuclide.discoveryYear,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [filter, query]);

  return (
    <>
      <Stack.Screen options={{ title: 'Isotopes' }} />
      <View style={styles.container}>
        <FlatList
          data={rows}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color={palette.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="Search C-14, uranium, beta, spin..."
                  placeholderTextColor={palette.textTertiary}
                  value={query}
                  onChangeText={setQuery}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.stats}>
                <Stat value={NUCLIDES.length.toLocaleString('en-US')} label="nuclides" styles={styles} />
                <Stat value={STABLE_COUNT.toLocaleString('en-US')} label="stable" styles={styles} />
                <Stat value={NATURAL_COUNT.toLocaleString('en-US')} label="natural" styles={styles} />
              </View>
              <View style={styles.filterRow}>
                {FILTERS.map((item) => {
                  const active = filter === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => setFilter(item.id)}
                      style={[styles.filter, active && styles.filterActive]}>
                      <Text style={[styles.filterText, active && styles.filterTextActive]}>{item.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          }
          renderItem={({ item }) => (
            <NuclideRow
              nuclide={item}
              styles={styles}
              onPress={() => router.push(`/element/${item.z}`)}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No isotope data matches your search.</Text>}
        />
      </View>
    </>
  );
}

function Stat({
  value,
  label,
  styles,
}: {
  value: string;
  label: string;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function NuclideRow({
  nuclide,
  styles,
  onPress,
}: {
  nuclide: Nuclide;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  onPress: () => void;
}) {
  const element = getElement(nuclide.z) ?? ELEMENTS[nuclide.z - 1];
  const color = CategoryColors[element.category];
  const badgeColor = nuclide.stable ? '#2F9E44' : '#FF6B6B';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.65 }]}>
      <View style={styles.rowTop}>
        <View style={[styles.tile, { backgroundColor: withAlpha(color, 0.15), borderColor: withAlpha(color, 0.55) }]}>
          <Text style={[styles.massNumber, { color }]}>{nuclide.massNumber}</Text>
          <Text style={[styles.symbol, { color }]}>{nuclide.symbol}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.name}>
            {element.name}-{nuclide.massNumber}
          </Text>
          <Text style={styles.meta}>
            Z={nuclide.z} · N={nuclide.n} · {CategoryLabels[element.category]}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: withAlpha(badgeColor, 0.16) }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>
            {nuclide.stable ? 'Stable' : 'Radioactive'}
          </Text>
        </View>
      </View>
      <View style={styles.grid}>
        <Fact label="Half-life" value={formatHalfLife(nuclide)} styles={styles} />
        <Fact label="Abundance" value={fmtPercent(nuclide.abundancePercent) ?? '—'} styles={styles} />
        <Fact label="Decay" value={formatDecay(nuclide)} styles={styles} wide />
        <Fact label="Spin / parity" value={nuclide.spinParity ?? '—'} styles={styles} />
        <Fact label="Atomic mass" value={nuclide.atomicMass == null ? '—' : `${fmt(nuclide.atomicMass, 9)} u`} styles={styles} />
        <Fact label="Binding / nucleon" value={nuclide.bindingEnergyPerNucleonKev == null ? '—' : `${fmt(nuclide.bindingEnergyPerNucleonKev, 5)} keV`} styles={styles} />
        <Fact label="Discovery" value={fmtYear(nuclide.discoveryYear)} styles={styles} />
      </View>
    </Pressable>
  );
}

function Fact({
  label,
  value,
  styles,
  wide,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  wide?: boolean;
}) {
  return (
    <View style={[styles.fact, wide && styles.factWide]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function formatHalfLife(nuclide: Nuclide): string {
  if (nuclide.stable) return 'Stable';
  const raw = [nuclide.halfLifeOperator, nuclide.halfLife, nuclide.halfLifeUnit].filter(Boolean).join(' ');
  if (nuclide.halfLifeSeconds == null) return raw || '—';
  const seconds = fmtDuration(nuclide.halfLifeSeconds);
  return raw ? `${raw} · ${seconds}` : seconds;
}

function formatDecay(nuclide: Nuclide): string {
  if (nuclide.stable) return '—';
  if (!nuclide.decayModes.length) return 'Unknown';
  return nuclide.decayModes
    .map((mode) => {
      const intensity = mode.intensityPercent == null ? '' : ` ${fmt(mode.intensityPercent, 4)}%`;
      return `${mode.mode}${intensity}`;
    })
    .join(' · ');
}
