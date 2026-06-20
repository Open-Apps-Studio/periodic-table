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
import { CategoryColors, withAlpha } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { getElementBySymbol } from '@/data/elements';
import {
  COMMON_IONS,
  ORGANIC_SERIES,
  PHYSICAL_CONSTANTS,
  SOLUBILITY_RULES,
  type SolubilityTone,
} from '@/data/reference-tables';
import { fmt } from '@/lib/format';
import { FormulaError, MolarMassResult, parseFormula } from '@/lib/molar-mass';

const EXAMPLES = ['H2O', 'H2SO4', 'NaCl', 'C6H12O6', 'CaCO3', 'Ca(OH)2', 'CuSO4·5H2O', 'C2H5OH'];
const TOOL_TABS = [
  { id: 'calculator', label: 'Mass', icon: 'calculator-outline' },
  { id: 'amount', label: 'Amount', icon: 'scale-outline' },
  { id: 'concentration', label: 'Conc.', icon: 'beaker-outline' },
  { id: 'solubility', label: 'Solubility', icon: 'water-outline' },
  { id: 'reference', label: 'Tables', icon: 'library-outline' },
] as const;

type ToolTab = (typeof TOOL_TABS)[number]['id'];

const SOLUBILITY_COLORS: Record<SolubilityTone, string> = {
  soluble: '#69DB7C',
  slightly: '#FFD43B',
  insoluble: '#FF8787',
  mixed: '#4DABF7',
};

export default function ToolsScreen() {
  const palette = usePalette();
  const styles = useThemedStyles((p) => ({
    container: { flex: 1, backgroundColor: p.background },
    content: { padding: 16, gap: 14, paddingBottom: 32 },
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
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    cardTitle: { color: p.text, fontSize: 16, fontWeight: '800' },
    cardIntro: { color: p.textSecondary, fontSize: 13, lineHeight: 19, marginBottom: 12 },
    input: {
      backgroundColor: p.surfaceRaised,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: p.border,
      color: p.text,
      fontSize: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    inputGroup: { gap: 8, marginTop: 10 },
    inputLabel: { color: p.textSecondary, fontSize: 12.5, fontWeight: '800' },
    examples: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
    exampleChip: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      backgroundColor: p.surfaceRaised,
      borderWidth: 1,
      borderColor: p.border,
    },
    exampleText: { color: p.textSecondary, fontSize: 12.5, fontWeight: '600' },
    error: { color: p.danger, fontSize: 13, marginTop: 12 },
    result: { marginTop: 14, gap: 10 },
    resultMass: { color: p.text, fontSize: 30, fontWeight: '800' },
    resultUnit: { color: p.textSecondary, fontSize: 16, fontWeight: '600' },
    formulaLine: { color: p.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 6 },
    calcResultBox: {
      marginTop: 14,
      padding: 12,
      borderRadius: 14,
      backgroundColor: withAlpha(p.accent, 0.1),
      borderWidth: 1,
      borderColor: withAlpha(p.accent, 0.35),
      gap: 6,
    },
    calcResultLabel: { color: p.textSecondary, fontSize: 12.5, fontWeight: '800' },
    calcResultValue: { color: p.text, fontSize: 24, fontWeight: '900' },
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
    partName: { color: p.text, fontSize: 13.5, fontWeight: '600' },
    partBarTrack: { height: 4, borderRadius: 2, backgroundColor: p.surfaceRaised, overflow: 'hidden' },
    partBarFill: { height: 4, borderRadius: 2 },
    partNumbers: { alignItems: 'flex-end' },
    partMass: { color: p.text, fontSize: 13, fontWeight: '700' },
    partPercent: { color: p.textTertiary, fontSize: 11.5 },
    referenceStack: { gap: 14 },
    ruleList: { gap: 10 },
    ruleCard: {
      backgroundColor: p.surfaceRaised,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: p.border,
      padding: 12,
      gap: 8,
    },
    ruleTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusDot: { width: 9, height: 9, borderRadius: 5 },
    ruleTitle: { color: p.text, fontSize: 14, fontWeight: '800', flex: 1 },
    ionWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    ionChip: {
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: p.surface,
    },
    ionChipText: { fontSize: 12, fontWeight: '800' },
    ruleText: { color: p.text, fontSize: 13, lineHeight: 18, fontWeight: '600' },
    exceptionText: { color: p.textSecondary, fontSize: 12.5, lineHeight: 18 },
    exampleTextMuted: { color: p.textTertiary, fontSize: 12, fontWeight: '700' },
    seriesGrid: { gap: 10 },
    seriesCard: {
      backgroundColor: p.surfaceRaised,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: p.border,
      padding: 12,
      gap: 8,
    },
    seriesTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    seriesTitle: { color: p.text, fontSize: 14.5, fontWeight: '800' },
    seriesFormula: { color: p.accent, fontSize: 13, fontWeight: '900' },
    seriesNote: { color: p.textSecondary, fontSize: 12.5, lineHeight: 18 },
    examplesColumn: { gap: 4 },
    memberText: { color: p.textTertiary, fontSize: 12.5, fontWeight: '700' },
    ionGrid: { gap: 8 },
    ionRow: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: p.surfaceRaised,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: p.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    ionName: { color: p.text, fontSize: 13.5, fontWeight: '800' },
    ionFormula: { color: p.textSecondary, fontSize: 12.5, marginTop: 2 },
    ionCharge: { color: p.accent, fontSize: 14, fontWeight: '900' },
    constantRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingVertical: 10,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: p.border,
    },
    constantBody: { flex: 1, gap: 2 },
    constantLabel: { color: p.text, fontSize: 13.5, fontWeight: '800' },
    constantNote: { color: p.textTertiary, fontSize: 12 },
    constantValue: { color: p.textSecondary, fontSize: 12.5, fontWeight: '800', textAlign: 'right', flex: 1 },
  }));

  const [formula, setFormula] = useState('');
  const [amountFormula, setAmountFormula] = useState('NaCl');
  const [amountMass, setAmountMass] = useState('5');
  const [concentrationFormula, setConcentrationFormula] = useState('NaCl');
  const [concentrationMass, setConcentrationMass] = useState('5');
  const [concentrationVolumeMl, setConcentrationVolumeMl] = useState('250');
  const [activeTab, setActiveTab] = useState<ToolTab>('calculator');

  const { result, error } = useMemo(() => {
    if (!formula.trim()) return { result: null, error: null };
    try {
      return { result: parseFormula(formula), error: null };
    } catch (e) {
      return { result: null, error: e instanceof FormulaError ? e.message : 'Invalid formula' };
    }
  }, [formula]);
  const amountResult = useMemo(
    () => solveAmount(amountFormula, amountMass),
    [amountFormula, amountMass],
  );
  const concentrationResult = useMemo(
    () => solveConcentration(concentrationFormula, concentrationMass, concentrationVolumeMl),
    [concentrationFormula, concentrationMass, concentrationVolumeMl],
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={styles.segmented}>
        {TOOL_TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.segment, active && styles.segmentActive]}>
              <Ionicons name={tab.icon} size={16} color={active ? palette.accent : palette.textTertiary} />
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {activeTab === 'calculator' && (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="calculator-outline" size={18} color={palette.accent} />
          <Text style={styles.cardTitle}>Molar Mass Calculator</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter a formula, e.g. H2SO4 or Ca(OH)2"
          placeholderTextColor={palette.textTertiary}
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
        {result && <ResultCard result={result} styles={styles} />}
      </View>
      )}

      {activeTab === 'amount' && (
        <AmountCalculator
          styles={styles}
          palette={palette}
          formula={amountFormula}
          mass={amountMass}
          result={amountResult}
          onFormulaChange={setAmountFormula}
          onMassChange={setAmountMass}
        />
      )}

      {activeTab === 'concentration' && (
        <ConcentrationCalculator
          styles={styles}
          palette={palette}
          formula={concentrationFormula}
          mass={concentrationMass}
          volumeMl={concentrationVolumeMl}
          result={concentrationResult}
          onFormulaChange={setConcentrationFormula}
          onMassChange={setConcentrationMass}
          onVolumeChange={setConcentrationVolumeMl}
        />
      )}

      {activeTab === 'solubility' && <SolubilityCard styles={styles} palette={palette} />}
      {activeTab === 'reference' && <ReferenceTables styles={styles} palette={palette} />}
    </ScrollView>
  );
}

interface AmountResult {
  molarMass: number;
  mass: number;
  moles: number;
  particles: number;
  error: string | null;
}

interface ConcentrationResult extends AmountResult {
  volumeL: number;
  molarity: number;
}

function parsePositiveNumber(value: string): number | null {
  const normalized = Number(value.replace(',', '.'));
  return Number.isFinite(normalized) && normalized > 0 ? normalized : null;
}

function solveAmount(formula: string, mass: string): AmountResult {
  const grams = parsePositiveNumber(mass);
  if (!formula.trim()) return { molarMass: 0, mass: grams ?? 0, moles: 0, particles: 0, error: 'Enter a formula.' };
  if (grams == null) return { molarMass: 0, mass: 0, moles: 0, particles: 0, error: 'Enter a positive mass in grams.' };
  try {
    const parsed = parseFormula(formula);
    const moles = grams / parsed.molarMass;
    return {
      molarMass: parsed.molarMass,
      mass: grams,
      moles,
      particles: moles * 6.02214076e23,
      error: null,
    };
  } catch (e) {
    return { molarMass: 0, mass: grams, moles: 0, particles: 0, error: e instanceof FormulaError ? e.message : 'Invalid formula' };
  }
}

function solveConcentration(formula: string, mass: string, volumeMl: string): ConcentrationResult {
  const amount = solveAmount(formula, mass);
  const ml = parsePositiveNumber(volumeMl);
  if (amount.error) return { ...amount, volumeL: ml == null ? 0 : ml / 1000, molarity: 0 };
  if (ml == null) return { ...amount, volumeL: 0, molarity: 0, error: 'Enter a positive volume in milliliters.' };
  const volumeL = ml / 1000;
  return { ...amount, volumeL, molarity: amount.moles / volumeL };
}

function AmountCalculator({
  styles,
  palette,
  formula,
  mass,
  result,
  onFormulaChange,
  onMassChange,
}: {
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  palette: ReturnType<typeof usePalette>;
  formula: string;
  mass: string;
  result: AmountResult;
  onFormulaChange: (value: string) => void;
  onMassChange: (value: string) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="scale-outline" size={18} color={palette.accent} />
        <Text style={styles.cardTitle}>Substance Amount Calculator</Text>
      </View>
      <Text style={styles.cardIntro}>Calculate moles from mass and formula mass.</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Formula</Text>
        <TextInput
          style={styles.input}
          value={formula}
          onChangeText={onFormulaChange}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="NaCl"
          placeholderTextColor={palette.textTertiary}
        />
        <Text style={styles.inputLabel}>Mass, g</Text>
        <TextInput
          style={styles.input}
          value={mass}
          onChangeText={onMassChange}
          keyboardType="decimal-pad"
          placeholder="5"
          placeholderTextColor={palette.textTertiary}
        />
      </View>
      {result.error ? <Text style={styles.error}>{result.error}</Text> : <AmountResultCard result={result} styles={styles} />}
    </View>
  );
}

function ConcentrationCalculator({
  styles,
  palette,
  formula,
  mass,
  volumeMl,
  result,
  onFormulaChange,
  onMassChange,
  onVolumeChange,
}: {
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  palette: ReturnType<typeof usePalette>;
  formula: string;
  mass: string;
  volumeMl: string;
  result: ConcentrationResult;
  onFormulaChange: (value: string) => void;
  onMassChange: (value: string) => void;
  onVolumeChange: (value: string) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="beaker-outline" size={18} color={palette.accent} />
        <Text style={styles.cardTitle}>Concentration Calculator</Text>
      </View>
      <Text style={styles.cardIntro}>Calculate molar concentration from solute mass, formula, and solution volume.</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Formula</Text>
        <TextInput style={styles.input} value={formula} onChangeText={onFormulaChange} autoCorrect={false} autoCapitalize="none" placeholder="NaCl" placeholderTextColor={palette.textTertiary} />
        <Text style={styles.inputLabel}>Solute mass, g</Text>
        <TextInput style={styles.input} value={mass} onChangeText={onMassChange} keyboardType="decimal-pad" placeholder="5" placeholderTextColor={palette.textTertiary} />
        <Text style={styles.inputLabel}>Solution volume, mL</Text>
        <TextInput style={styles.input} value={volumeMl} onChangeText={onVolumeChange} keyboardType="decimal-pad" placeholder="250" placeholderTextColor={palette.textTertiary} />
      </View>
      {result.error ? <Text style={styles.error}>{result.error}</Text> : <ConcentrationResultCard result={result} styles={styles} />}
    </View>
  );
}

function AmountResultCard({
  result,
  styles,
}: {
  result: AmountResult;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
}) {
  return (
    <View style={styles.calcResultBox}>
      <Text style={styles.calcResultLabel}>Amount of substance</Text>
      <Text style={styles.calcResultValue}>{fmt(result.moles, 6)} mol</Text>
      <Text style={styles.formulaLine}>M = {fmt(result.molarMass, 6)} g/mol · n = m / M = {fmt(result.mass, 5)} / {fmt(result.molarMass, 5)}</Text>
      <Text style={styles.formulaLine}>Particles ≈ {result.particles.toExponential(4)}</Text>
    </View>
  );
}

function ConcentrationResultCard({
  result,
  styles,
}: {
  result: ConcentrationResult;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
}) {
  return (
    <View style={styles.calcResultBox}>
      <Text style={styles.calcResultLabel}>Molar concentration</Text>
      <Text style={styles.calcResultValue}>{fmt(result.molarity, 6)} mol/L</Text>
      <Text style={styles.formulaLine}>c = n / V = {fmt(result.moles, 6)} mol / {fmt(result.volumeL, 5)} L</Text>
      <Text style={styles.formulaLine}>Formula mass: {fmt(result.molarMass, 6)} g/mol</Text>
    </View>
  );
}

function ResultCard({
  result,
  styles,
}: {
  result: MolarMassResult;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
}) {
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

function SolubilityCard({
  styles,
  palette,
}: {
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  palette: ReturnType<typeof usePalette>;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="water-outline" size={18} color={palette.accent} />
        <Text style={styles.cardTitle}>Solubility Rules</Text>
      </View>
      <Text style={styles.cardIntro}>
        Quick prediction rules for ionic compounds in water. These are classroom-style guidelines; borderline
        compounds can depend on concentration and temperature.
      </Text>
      <View style={styles.ruleList}>
        {SOLUBILITY_RULES.map((item) => {
          const color = SOLUBILITY_COLORS[item.tone];
          return (
            <View key={item.family} style={styles.ruleCard}>
              <View style={styles.ruleTop}>
                <View style={[styles.statusDot, { backgroundColor: color }]} />
                <Text style={styles.ruleTitle}>{item.family}</Text>
              </View>
              <View style={styles.ionWrap}>
                {item.ions.map((ion) => (
                  <View key={ion} style={[styles.ionChip, { borderColor: withAlpha(color, 0.45) }]}>
                    <Text style={[styles.ionChipText, { color }]}>{ion}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.ruleText}>{item.rule}</Text>
              <Text style={styles.exceptionText}>{item.exceptions}</Text>
              <Text style={styles.exampleTextMuted}>{item.examples.join('  ·  ')}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function ReferenceTables({
  styles,
  palette,
}: {
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  palette: ReturnType<typeof usePalette>;
}) {
  const cations = COMMON_IONS.filter((ion) => ion.kind === 'cation');
  const anions = COMMON_IONS.filter((ion) => ion.kind === 'anion');

  return (
    <View style={styles.referenceStack}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="git-network-outline" size={18} color={palette.accent} />
          <Text style={styles.cardTitle}>Hydrocarbon & Organic Series</Text>
        </View>
        <View style={styles.seriesGrid}>
          {ORGANIC_SERIES.map((series) => (
            <View key={series.family} style={styles.seriesCard}>
              <View style={styles.seriesTop}>
                <Text style={styles.seriesTitle}>{series.family}</Text>
                <Text style={styles.seriesFormula}>{series.generalFormula}</Text>
              </View>
              <Text style={styles.seriesNote}>{series.note}</Text>
              <View style={styles.examplesColumn}>
                {series.firstMembers.map((member) => (
                  <Text key={member} style={styles.memberText}>{member}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      <IonTable title="Common Cations" ions={cations} icon="add-circle-outline" styles={styles} palette={palette} />
      <IonTable title="Common Anions" ions={anions} icon="remove-circle-outline" styles={styles} palette={palette} />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="speedometer-outline" size={18} color={palette.accent} />
          <Text style={styles.cardTitle}>Constants</Text>
        </View>
        {PHYSICAL_CONSTANTS.map((constant) => (
          <View key={constant.label} style={styles.constantRow}>
            <View style={styles.constantBody}>
              <Text style={styles.constantLabel}>{constant.label}</Text>
              <Text style={styles.constantNote}>{constant.note}</Text>
            </View>
            <Text style={styles.constantValue}>{constant.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function IonTable({
  title,
  ions,
  icon,
  styles,
  palette,
}: {
  title: string;
  ions: typeof COMMON_IONS;
  icon: keyof typeof Ionicons.glyphMap;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  palette: ReturnType<typeof usePalette>;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={18} color={palette.accent} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.ionGrid}>
        {ions.map((ion) => (
          <View key={ion.name} style={styles.ionRow}>
            <View>
              <Text style={styles.ionName}>{ion.name}</Text>
              <Text style={styles.ionFormula}>{ion.formula}</Text>
            </View>
            <Text style={styles.ionCharge}>{ion.charge}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
