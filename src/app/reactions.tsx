import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { withAlpha } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { REACTION_EXAMPLES, REACTION_TYPE_LABELS, type ReactionExample } from '@/data/reactions';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { balanceEquation, EquationError, type BalancedEquation } from '@/lib/equation-balancer';

type Mode = 'balance' | 'library';

const EXAMPLE_EQUATIONS = [
  'CH4 + O2 -> CO2 + H2O',
  'KClO3 -> KCl + O2',
  'AgNO3 + NaCl -> AgCl + NaNO3',
  'CaCO3 + HCl -> CaCl2 + CO2 + H2O',
];

const TYPE_COLORS: Record<ReactionExample['type'], string> = {
  precipitation: '#228BE6',
  'acid-base': '#7950F2',
  redox: '#E8590C',
  combustion: '#F08C00',
  decomposition: '#7048E8',
  synthesis: '#2F9E44',
  'gas-forming': '#0B7285',
  qualitative: '#D6336C',
};

export default function ReactionsScreen() {
  const palette = usePalette();
  const [mode, setMode] = useState<Mode>('balance');
  const [equation, setEquation] = useState('CH4 + O2 -> CO2 + H2O');
  const [query, setQuery] = useState('');
  const styles = useThemedStyles((p) => ({
    container: { flex: 1, backgroundColor: p.background },
    content: { padding: 14, gap: 12, paddingBottom: 34 },
    segmented: {
      flexDirection: 'row',
      gap: 8,
      backgroundColor: p.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: p.border,
      padding: 5,
    },
    segment: {
      flex: 1,
      minHeight: 38,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    segmentActive: { backgroundColor: withAlpha(p.accent, 0.16) },
    segmentText: { color: p.textTertiary, fontSize: 12.5, fontWeight: '800' },
    segmentTextActive: { color: p.accent },
    card: {
      backgroundColor: p.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: p.border,
      padding: 14,
      gap: 10,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardTitle: { color: p.text, fontSize: 16, fontWeight: '900' },
    intro: { color: p.textSecondary, fontSize: 13, lineHeight: 19 },
    input: {
      backgroundColor: p.surfaceRaised,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: p.border,
      color: p.text,
      fontSize: 15,
      paddingHorizontal: 13,
      paddingVertical: 11,
    },
    examples: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      borderRadius: 11,
      borderWidth: 1,
      borderColor: p.border,
      backgroundColor: p.surfaceRaised,
      paddingHorizontal: 9,
      paddingVertical: 5,
    },
    chipText: { color: p.textSecondary, fontSize: 12, fontWeight: '800' },
    resultCard: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: withAlpha(p.accent, 0.35),
      backgroundColor: withAlpha(p.accent, 0.1),
      padding: 12,
      gap: 8,
    },
    balanced: { color: p.text, fontSize: 18, lineHeight: 26, fontWeight: '900' },
    error: { color: p.danger, fontSize: 13, lineHeight: 19 },
    tallyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tally: {
      minWidth: 84,
      borderRadius: 10,
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
      paddingHorizontal: 9,
      paddingVertical: 7,
      gap: 2,
    },
    tallySymbol: { color: p.text, fontSize: 13, fontWeight: '900' },
    tallyValue: { color: p.textTertiary, fontSize: 12, fontWeight: '800' },
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
    searchInput: { flex: 1, color: p.text, fontSize: 15, paddingVertical: 11 },
    row: {
      backgroundColor: p.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: p.border,
      padding: 12,
      gap: 9,
    },
    rowTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    typeIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    rowBody: { flex: 1, gap: 2 },
    rowTitle: { color: p.text, fontSize: 15, fontWeight: '900' },
    rowType: { color: p.textTertiary, fontSize: 12, fontWeight: '800' },
    equation: { color: p.text, fontSize: 13.5, lineHeight: 19, fontWeight: '800' },
    detail: { color: p.textSecondary, fontSize: 12.5, lineHeight: 18 },
    label: { color: p.textTertiary, fontSize: 11.5, fontWeight: '900', marginBottom: -4 },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    tag: {
      borderRadius: 9,
      borderWidth: 1,
      borderColor: p.border,
      paddingHorizontal: 7,
      paddingVertical: 3,
    },
    tagText: { color: p.textTertiary, fontSize: 11.5, fontWeight: '800' },
    empty: { color: p.textTertiary, textAlign: 'center', marginTop: 42, fontSize: 14 },
  }));

  const result = useMemo(() => {
    try {
      return { balanced: balanceEquation(equation), error: null };
    } catch (error) {
      return {
        balanced: null,
        error: error instanceof EquationError ? error.message : 'Could not balance this equation',
      };
    }
  }, [equation]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return REACTION_EXAMPLES;
    return REACTION_EXAMPLES.filter((item) =>
      [
        item.title,
        item.equation,
        item.type,
        REACTION_TYPE_LABELS[item.type],
        item.conditions,
        item.observation,
        item.explanation,
        item.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  return (
    <>
      <Stack.Screen options={{ title: 'Reactions' }} />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.segmented}>
            <ModeButton mode="balance" active={mode === 'balance'} label="Balance" icon="git-compare-outline" styles={styles} palette={palette} onPress={() => setMode('balance')} />
            <ModeButton mode="library" active={mode === 'library'} label="Library" icon="library-outline" styles={styles} palette={palette} onPress={() => setMode('library')} />
          </View>
        </View>
        {mode === 'balance' ? (
          <ScrollView contentContainerStyle={[styles.content, { paddingTop: 0 }]} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="git-compare-outline" size={18} color={palette.accent} />
                <Text style={styles.cardTitle}>Equation Balancer</Text>
              </View>
              <Text style={styles.intro}>Enter formulas with one arrow. States like (aq), (s), (l), and (g) are preserved.</Text>
              <TextInput
                style={styles.input}
                value={equation}
                onChangeText={setEquation}
                placeholder="H2 + O2 -> H2O"
                placeholderTextColor={palette.textTertiary}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <View style={styles.examples}>
                {EXAMPLE_EQUATIONS.map((example) => (
                  <Pressable key={example} onPress={() => setEquation(example)} style={styles.chip}>
                    <Text style={styles.chipText}>{example}</Text>
                  </Pressable>
                ))}
              </View>
              {result.balanced ? <BalanceResult result={result.balanced} styles={styles} /> : <Text style={styles.error}>{result.error}</Text>}
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.content, { paddingTop: 0 }]}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color={palette.textTertiary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search precipitate, combustion, sulfate..."
                  placeholderTextColor={palette.textTertiary}
                  value={query}
                  onChangeText={setQuery}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>
            }
            renderItem={({ item }) => (
              <ReactionRow
                item={item}
                styles={styles}
                onBalance={() => {
                  setEquation(item.equation);
                  setMode('balance');
                }}
              />
            )}
            ListEmptyComponent={<Text style={styles.empty}>No reactions match your search.</Text>}
          />
        )}
      </View>
    </>
  );
}

function ModeButton({
  active,
  label,
  icon,
  styles,
  palette,
  onPress,
}: {
  mode: Mode;
  active: boolean;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  palette: ReturnType<typeof usePalette>;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.segment, active && styles.segmentActive]}>
      <Ionicons name={icon} size={16} color={active ? palette.accent : palette.textTertiary} />
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </Pressable>
  );
}

function BalanceResult({
  result,
  styles,
}: {
  result: BalancedEquation;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
}) {
  return (
    <View style={styles.resultCard}>
      <Text style={styles.label}>Balanced equation</Text>
      <Text style={styles.balanced}>{result.equation}</Text>
      <View style={styles.tallyGrid}>
        {result.elementTotals.map((item) => (
          <View key={item.symbol} style={styles.tally}>
            <Text style={styles.tallySymbol}>{item.symbol}</Text>
            <Text style={styles.tallyValue}>
              {item.left} = {item.right}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ReactionRow({
  item,
  styles,
  onBalance,
}: {
  item: ReactionExample;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  onBalance: () => void;
}) {
  const color = TYPE_COLORS[item.type];
  const balanced = (() => {
    try {
      return balanceEquation(item.equation).equation;
    } catch {
      return item.equation;
    }
  })();

  return (
    <Pressable onPress={onBalance} style={({ pressed }) => [styles.row, pressed && { opacity: 0.65 }]}>
      <View style={styles.rowTop}>
        <View style={[styles.typeIcon, { backgroundColor: withAlpha(color, 0.16) }]}>
          <Ionicons name={iconForType(item.type)} size={18} color={color} />
        </View>
        <View style={styles.rowBody}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          <Text style={styles.rowType}>{REACTION_TYPE_LABELS[item.type]}</Text>
        </View>
        <Ionicons name="chevron-forward" size={17} color="#7B8794" />
      </View>
      <Text style={styles.equation}>{balanced}</Text>
      <Text style={styles.label}>Conditions</Text>
      <Text style={styles.detail}>{item.conditions}</Text>
      <Text style={styles.label}>Observation</Text>
      <Text style={styles.detail}>{item.observation}</Text>
      <Text style={styles.label}>Why it happens</Text>
      <Text style={styles.detail}>{item.explanation}</Text>
      <View style={styles.tagRow}>
        {item.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

function iconForType(type: ReactionExample['type']): keyof typeof Ionicons.glyphMap {
  if (type === 'combustion') return 'flame-outline';
  if (type === 'precipitation') return 'water-outline';
  if (type === 'acid-base') return 'beaker-outline';
  if (type === 'redox') return 'flash-outline';
  if (type === 'decomposition') return 'git-branch-outline';
  if (type === 'synthesis') return 'add-circle-outline';
  if (type === 'gas-forming') return 'cloud-outline';
  return 'flask-outline';
}
