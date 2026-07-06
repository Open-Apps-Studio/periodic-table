import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { withAlpha } from '@/constants/theme';
import {
  COMMON_IONS,
  ORGANIC_SERIES,
  PHYSICAL_CONSTANTS,
  SOLUBILITY_RULES,
  type SolubilityTone,
} from '@/data/reference-tables';
import { usePalette } from '@/context/theme-context';
import { useThemedStyles } from '@/hooks/use-themed-styles';

type TableId =
  | 'solubility'
  | 'configuration'
  | 'indicators'
  | 'alkanes'
  | 'polyaromatic'
  | 'qualitative'
  | 'ionization'
  | 'electrochemical'
  | 'neutron';

const TABLES: Array<{
  id: TableId;
  title: string;
  description: string;
  accent: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  {
    id: 'solubility',
    title: 'Solubility Table',
    description: "Find likely water solubility from common cation and anion families.",
    accent: '#FFB703',
    icon: 'water-outline',
  },
  {
    id: 'configuration',
    title: 'Electron configuration',
    description: 'Orbital filling order, shell notation, and common configuration shortcuts.',
    accent: '#4DABF7',
    icon: 'git-network-outline',
  },
  {
    id: 'indicators',
    title: 'Main indicators of color changes',
    description: 'Common acid-base indicators and their useful pH transition ranges.',
    accent: '#F4A261',
    icon: 'color-palette-outline',
  },
  {
    id: 'alkanes',
    title: 'Properties of some alkanes',
    description: 'Homologous hydrocarbon series, formulas, and first members.',
    accent: '#EF476F',
    icon: 'trail-sign-outline',
  },
  {
    id: 'polyaromatic',
    title: 'Polyaromatic carbons',
    description: 'Fused-ring aromatic molecules and compact formulas.',
    accent: '#B5179E',
    icon: 'aperture-outline',
  },
  {
    id: 'qualitative',
    title: 'Qualitative reactions',
    description: 'Classic classroom tests for ions, gases, and functional groups.',
    accent: '#2D936C',
    icon: 'flask-outline',
  },
  {
    id: 'ionization',
    title: 'Ionization energy',
    description: 'Trend notes and the physical meaning of first ionization energy.',
    accent: '#E76F51',
    icon: 'flash-outline',
  },
  {
    id: 'electrochemical',
    title: 'Electrochemical activity series',
    description: 'Metal reactivity ordering for displacement and redox predictions.',
    accent: '#48CAE4',
    icon: 'battery-charging-outline',
  },
  {
    id: 'neutron',
    title: 'Neutron cross-section of nuclei',
    description: 'Thermal neutron capture examples and why barns are used.',
    accent: '#90BE6D',
    icon: 'radio-outline',
  },
];

const SOLUBILITY_COLORS: Record<SolubilityTone, string> = {
  soluble: '#69DB7C',
  slightly: '#FFD43B',
  insoluble: '#FF8787',
  mixed: '#4DABF7',
};

const INDICATORS = [
  ['Litmus', '4.5-8.3', 'red in acid, blue in base'],
  ['Methyl orange', '3.1-4.4', 'red to yellow'],
  ['Bromothymol blue', '6.0-7.6', 'yellow to blue'],
  ['Phenolphthalein', '8.2-10.0', 'colorless to pink'],
  ['Universal indicator', '1-14', 'rainbow scale across pH'],
];

const QUALITATIVE_REACTIONS = [
  ['CO2 gas', 'Turns limewater milky', 'Ca(OH)2 + CO2 -> CaCO3 + H2O'],
  ['Chloride ion', 'White AgCl precipitate with AgNO3', 'Ag+ + Cl- -> AgCl(s)'],
  ['Sulfate ion', 'White BaSO4 precipitate with Ba2+', 'Ba2+ + SO4 2- -> BaSO4(s)'],
  ['Ammonium ion', 'Ammonia smell with warm alkali', 'NH4+ + OH- -> NH3 + H2O'],
  ['Unsaturation', 'Decolorizes bromine water', 'C=C addition reaction'],
];

const POLYAROMATICS = [
  ['Naphthalene', 'C10H8', 'two fused benzene rings'],
  ['Anthracene', 'C14H10', 'three linear fused rings'],
  ['Phenanthrene', 'C14H10', 'three angular fused rings'],
  ['Pyrene', 'C16H10', 'four fused aromatic rings'],
  ['Coronene', 'C24H12', 'seven-ring disk-like PAH'],
];

const ACTIVITY_SERIES = [
  'Li',
  'K',
  'Ba',
  'Ca',
  'Na',
  'Mg',
  'Al',
  'Zn',
  'Fe',
  'Ni',
  'Sn',
  'Pb',
  'H',
  'Cu',
  'Hg',
  'Ag',
  'Pt',
  'Au',
];

export default function TablesScreen() {
  const palette = usePalette();
  const styles = useThemedStyles((p) => ({
    container: { flex: 1, backgroundColor: p.background },
    content: { padding: 14, gap: 10, paddingBottom: 96 },
    tableCard: {
      minHeight: 86,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: p.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: p.border,
      padding: 12,
      overflow: 'hidden',
    },
    cardStripe: { width: 4, alignSelf: 'stretch', borderRadius: 2 },
    iconDisc: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    cardBody: { flex: 1, gap: 4 },
    cardTitle: { color: p.text, fontSize: 15, fontWeight: '900' },
    cardDescription: { color: p.textSecondary, fontSize: 12.5, lineHeight: 17 },
    detail: {
      backgroundColor: p.surfaceRaised,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: p.border,
      padding: 12,
      gap: 10,
    },
    detailTitle: { color: p.text, fontSize: 16, fontWeight: '900' },
    detailText: { color: p.textSecondary, fontSize: 13, lineHeight: 19 },
    chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
    chip: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4 },
    chipText: { fontSize: 12, fontWeight: '800' },
    factRow: {
      paddingVertical: 9,
      borderTopWidth: 0.5,
      borderTopColor: p.border,
      gap: 3,
    },
    factTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    factName: { color: p.text, fontSize: 13.5, fontWeight: '900', flex: 1 },
    factValue: { color: p.accent, fontSize: 12.5, fontWeight: '900', textAlign: 'right' },
    factNote: { color: p.textSecondary, fontSize: 12.5, lineHeight: 18 },
  }));

  const [openId, setOpenId] = useState<TableId>('solubility');
  const open = TABLES.find((item) => item.id === openId)!;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {TABLES.map((item) => {
        const active = item.id === openId;
        return (
          <Pressable
            key={item.id}
            onPress={() => setOpenId(active ? 'solubility' : item.id)}
            style={[
              styles.tableCard,
              active && { borderColor: withAlpha(item.accent, 0.7), backgroundColor: withAlpha(item.accent, 0.08) },
            ]}>
            <View style={[styles.cardStripe, { backgroundColor: item.accent }]} />
            <View style={[styles.iconDisc, { backgroundColor: withAlpha(item.accent, 0.16) }]}>
              <Ionicons name={item.icon} size={18} color={item.accent} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
            <Ionicons name={active ? 'chevron-up' : 'chevron-down'} size={18} color={palette.textTertiary} />
          </Pressable>
        );
      })}
      <View style={[styles.detail, { borderColor: withAlpha(open.accent, 0.4) }]}>
        <Text style={styles.detailTitle}>{open.title}</Text>
        <TableDetail id={openId} styles={styles} accent={open.accent} />
      </View>
    </ScrollView>
  );
}

function TableDetail({
  id,
  styles,
  accent,
}: {
  id: TableId;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  accent: string;
}) {
  if (id === 'solubility') {
    return (
      <>
        {SOLUBILITY_RULES.map((rule) => {
          const color = SOLUBILITY_COLORS[rule.tone];
          return (
            <View key={rule.family} style={styles.factRow}>
              <View style={styles.factTop}>
                <Text style={styles.factName}>{rule.family}</Text>
                <Text style={[styles.factValue, { color }]}>{rule.tone}</Text>
              </View>
              <View style={styles.chipWrap}>
                {rule.ions.map((ion) => (
                  <View key={ion} style={[styles.chip, { borderColor: withAlpha(color, 0.45) }]}>
                    <Text style={[styles.chipText, { color }]}>{ion}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.factNote}>{rule.rule} {rule.exceptions}</Text>
            </View>
          );
        })}
      </>
    );
  }

  if (id === 'configuration') {
    return (
      <>
        <Text style={styles.detailText}>Fill orbitals in increasing energy order, then use noble-gas shorthand for compact notation.</Text>
        <ChipList values={['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s']} styles={styles} accent={accent} />
        <ReferenceRows rows={COMMON_IONS.slice(0, 10).map((ion) => [ion.name, ion.formula, ion.charge])} styles={styles} />
      </>
    );
  }

  if (id === 'indicators') return <ReferenceRows rows={INDICATORS} styles={styles} />;
  if (id === 'alkanes') return <ReferenceRows rows={ORGANIC_SERIES.map((item) => [item.family, item.generalFormula, item.note])} styles={styles} />;
  if (id === 'polyaromatic') return <ReferenceRows rows={POLYAROMATICS} styles={styles} />;
  if (id === 'qualitative') return <ReferenceRows rows={QUALITATIVE_REACTIONS} styles={styles} />;
  if (id === 'electrochemical') {
    return (
      <>
        <Text style={styles.detailText}>Metals higher in the series tend to displace ions of metals lower in the series.</Text>
        <ChipList values={ACTIVITY_SERIES} styles={styles} accent={accent} />
      </>
    );
  }
  if (id === 'neutron') {
    return <ReferenceRows rows={PHYSICAL_CONSTANTS.concat([{ label: 'Neutron cross-section', value: '1 barn = 10^-28 m²', note: 'Used for nuclear interaction probabilities.' }]).map((item) => [item.label, item.value, item.note])} styles={styles} />;
  }

  return (
    <>
      <Text style={styles.detailText}>First ionization energy generally increases across a period and decreases down a group.</Text>
      <ChipList values={['noble gases: high', 'alkali metals: low', 'successive energies jump after valence electrons']} styles={styles} accent={accent} />
    </>
  );
}

function ReferenceRows({
  rows,
  styles,
}: {
  rows: string[][];
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
}) {
  return (
    <>
      {rows.map(([name, value, note]) => (
        <View key={`${name}-${value}`} style={styles.factRow}>
          <View style={styles.factTop}>
            <Text style={styles.factName}>{name}</Text>
            <Text style={styles.factValue}>{value}</Text>
          </View>
          <Text style={styles.factNote}>{note}</Text>
        </View>
      ))}
    </>
  );
}

function ChipList({
  values,
  styles,
  accent,
}: {
  values: string[];
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  accent: string;
}) {
  return (
    <View style={styles.chipWrap}>
      {values.map((value) => (
        <View key={value} style={[styles.chip, { borderColor: withAlpha(accent, 0.45), backgroundColor: withAlpha(accent, 0.08) }]}>
          <Text style={[styles.chipText, { color: accent }]}>{value}</Text>
        </View>
      ))}
    </View>
  );
}
