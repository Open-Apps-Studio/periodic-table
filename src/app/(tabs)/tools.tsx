import { useMemo, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryColors, Palette, withAlpha } from '@/constants/theme';
import { getElementBySymbol } from '@/data/elements';
import { fmt } from '@/lib/format';
import { FormulaError, MolarMassResult, parseFormula } from '@/lib/molar-mass';

const EXAMPLES = ['H2O', 'H2SO4', 'NaCl', 'C6H12O6', 'CaCO3', 'Ca(OH)2', 'CuSO4·5H2O', 'C2H5OH'];

export default function ToolsScreen() {
  const [formula, setFormula] = useState('');

  const { result, error } = useMemo(() => {
    if (!formula.trim()) return { result: null, error: null };
    try {
      return { result: parseFormula(formula), error: null };
    } catch (e) {
      return { result: null, error: e instanceof FormulaError ? e.message : 'Invalid formula' };
    }
  }, [formula]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="calculator-outline" size={18} color={Palette.accent} />
          <Text style={styles.cardTitle}>Molar Mass Calculator</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter a formula, e.g. H2SO4 or Ca(OH)2"
          placeholderTextColor={Palette.textTertiary}
          value={formula}
          onChangeText={setFormula}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <View style={styles.examples}>
          {EXAMPLES.map((ex) => (
            <Pressable key={ex} onPress={() => setFormula(ex)} style={styles.exampleChip}>
              <Text style={styles.exampleText}>{ex}</Text>
            </Pressable>
          ))}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
        {result && <ResultCard result={result} />}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="construct-outline" size={18} color={Palette.textTertiary} />
          <Text style={styles.cardTitle}>Coming soon</Text>
        </View>
        {['Isotope browser', 'Solubility chart', 'Reaction search', 'Element compare', 'Chemistry dictionary'].map((tool) => (
          <View key={tool} style={styles.soonRow}>
            <Text style={styles.soonText}>{tool}</Text>
            <Ionicons name="time-outline" size={14} color={Palette.textTertiary} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function ResultCard({ result }: { result: MolarMassResult }) {
  return (
    <View style={styles.result}>
      <Text style={styles.resultMass}>
        {fmt(result.molarMass, 6)} <Text style={styles.resultUnit}>g/mol</Text>
      </Text>
      {result.parts.map((part) => {
        const el = getElementBySymbol(part.symbol)!;
        const color = CategoryColors[el.category];
        return (
          <View key={part.symbol} style={styles.partRow}>
            <View style={[styles.partTile, { backgroundColor: withAlpha(color, 0.16), borderColor: withAlpha(color, 0.55) }]}>
              <Text style={[styles.partSymbol, { color }]}>{part.symbol}</Text>
            </View>
            <View style={styles.partBody}>
              <Text style={styles.partName}>
                {part.name} × {part.count}
              </Text>
              <View style={styles.partBarTrack}>
                <View style={[styles.partBarFill, { width: `${part.percent}%`, backgroundColor: color }]} />
              </View>
            </View>
            <View style={styles.partNumbers}>
              <Text style={styles.partMass}>{fmt(part.mass, 5)} g</Text>
              <Text style={styles.partPercent}>{part.percent.toFixed(1)}%</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.background },
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  card: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 14,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  cardTitle: { color: Palette.text, fontSize: 16, fontWeight: '800' },
  input: {
    backgroundColor: Palette.surfaceRaised,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    color: Palette.text,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  examples: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  exampleChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: Palette.surfaceRaised,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  exampleText: { color: Palette.textSecondary, fontSize: 12.5, fontWeight: '600' },
  error: { color: Palette.danger, fontSize: 13, marginTop: 12 },
  result: { marginTop: 14, gap: 10 },
  resultMass: { color: Palette.text, fontSize: 30, fontWeight: '800' },
  resultUnit: { color: Palette.textSecondary, fontSize: 16, fontWeight: '600' },
  partRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  partTile: {
    width: 38,
    height: 38,
    borderRadius: 9,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partSymbol: { fontSize: 14, fontWeight: '800' },
  partBody: { flex: 1, gap: 5 },
  partName: { color: Palette.text, fontSize: 13.5, fontWeight: '600' },
  partBarTrack: { height: 4, borderRadius: 2, backgroundColor: Palette.surfaceRaised, overflow: 'hidden' },
  partBarFill: { height: 4, borderRadius: 2 },
  partNumbers: { alignItems: 'flex-end' },
  partMass: { color: Palette.text, fontSize: 13, fontWeight: '700' },
  partPercent: { color: Palette.textTertiary, fontSize: 11.5 },
  soonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
  soonText: { color: Palette.textSecondary, fontSize: 14 },
});
