import { Fragment } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ShellDiagram } from '@/components/shell-diagram';
import { CategoryColors, CategoryLabels, Palette, withAlpha } from '@/constants/theme';
import { getElement } from '@/data/elements';
import { fmt, fmtKelvin, fmtYear } from '@/lib/format';

export default function ElementScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ number: string }>();
  const number = Number(params.number);
  const el = getElement(number);

  if (!el) {
    return (
      <View style={styles.center}>
        <Text style={styles.sectionTitle}>Element not found</Text>
      </View>
    );
  }

  const color = CategoryColors[el.category];
  const goTo = (n: number) => router.setParams({ number: String(n) });

  return (
    <>
      <Stack.Screen
        options={{
          title: el.name,
          headerRight: () => (
            <View style={styles.navButtons}>
              <NavButton icon="chevron-back" disabled={el.number <= 1} onPress={() => goTo(el.number - 1)} />
              <NavButton icon="chevron-forward" disabled={el.number >= 118} onPress={() => goTo(el.number + 1)} />
            </View>
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={[styles.hero, { borderColor: withAlpha(color, 0.45), backgroundColor: withAlpha(color, 0.1) }]}>
          <View style={[styles.heroTile, { borderColor: withAlpha(color, 0.6), backgroundColor: withAlpha(color, 0.18) }]}>
            <Text style={styles.heroNumber}>{el.number}</Text>
            <Text style={[styles.heroSymbol, { color }]}>{el.symbol}</Text>
            <Text style={styles.heroMass}>{fmt(el.atomicMass, 5)}</Text>
          </View>
          <View style={styles.heroBody}>
            <Text style={styles.heroName}>{el.name}</Text>
            <View style={[styles.categoryChip, { backgroundColor: withAlpha(color, 0.2), borderColor: withAlpha(color, 0.5) }]}>
              <Text style={[styles.categoryChipText, { color }]}>{CategoryLabels[el.category]}</Text>
            </View>
            <Text style={styles.heroMeta}>
              Group {el.group} · Period {el.period} · {el.block}-block · {el.phase}
            </Text>
          </View>
        </View>

        {/* Photo */}
        {el.image && (
          <View style={styles.card}>
            <Image source={{ uri: el.image.url }} style={styles.photo} contentFit="cover" transition={200} />
            <Text style={styles.photoCaption}>{el.image.title}</Text>
            <Text style={styles.attribution}>{el.image.attribution}</Text>
          </View>
        )}

        {/* Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.summary}>{el.summary}</Text>
          {el.appearance && <PropertyRow label="Appearance" value={el.appearance} />}
        </View>

        {/* Electron shells */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Electron Shells</Text>
          <ShellDiagram shells={el.shells} color={color} />
          <PropertyRow label="Configuration" value={el.electronConfiguration} />
          <PropertyRow label="Shells" value={el.shells.join(', ')} />
          <PropertyRow label="Oxidation states" value={el.oxidationStates ?? '—'} />
        </View>

        <Section
          title="Physical Properties"
          rows={[
            ['Phase (STP)', el.phase],
            ['Density', el.densityValue == null ? '—' : `${fmt(el.densityValue, 4)} g/cm³`],
            ['Melting point', fmtKelvin(el.melt)],
            ['Boiling point', fmtKelvin(el.boil)],
            ['Molar heat', el.molarHeat == null ? '—' : `${fmt(el.molarHeat, 4)} J/(mol·K)`],
          ]}
        />

        <Section
          title="Atomic Properties"
          rows={[
            ['Atomic mass', `${fmt(el.atomicMass, 7)} u`],
            ['Atomic radius', el.atomicRadius == null ? '—' : `${el.atomicRadius} pm`],
            ['Electronegativity', el.electronegativity == null ? '—' : `${el.electronegativity} (Pauling)`],
            ['Electron affinity', el.electronAffinity == null ? '—' : `${fmt(el.electronAffinity, 4)} kJ/mol`],
            ['1st ionization energy', el.ionizationEnergies[0] == null ? '—' : `${fmt(el.ionizationEnergies[0], 5)} kJ/mol`],
          ]}
        />

        <Section
          title="Discovery"
          rows={[
            ['Discovered by', el.discoveredBy ?? '—'],
            ['Named by', el.namedBy ?? '—'],
            ['Year', fmtYear(el.yearDiscovered)],
          ]}
        />

        <Pressable style={styles.wikiButton} onPress={() => Linking.openURL(el.wikipediaUrl)}>
          <Ionicons name="globe-outline" size={16} color={Palette.accent} />
          <Text style={styles.wikiText}>Read more on Wikipedia</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

function NavButton({ icon, disabled, onPress }: { icon: 'chevron-back' | 'chevron-forward'; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} hitSlop={6} style={[styles.navButton, disabled && { opacity: 0.3 }]}>
      <Ionicons name={icon} size={20} color={Palette.text} />
    </Pressable>
  );
}

function Section({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {rows.map(([label, value]) => (
        <Fragment key={label}>
          <PropertyRow label={label} value={value} />
        </Fragment>
      ))}
    </View>
  );
}

function PropertyRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.propRow}>
      <Text style={styles.propLabel}>{label}</Text>
      <Text style={styles.propValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.background },
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navButtons: { flexDirection: 'row', gap: 4 },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: { flexDirection: 'row', gap: 14, padding: 14, borderRadius: 16, borderWidth: 1.2 },
  heroTile: {
    width: 96,
    height: 96,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroNumber: { position: 'absolute', top: 6, left: 8, color: Palette.textSecondary, fontSize: 12, fontWeight: '700' },
  heroSymbol: { fontSize: 38, fontWeight: '800' },
  heroMass: { position: 'absolute', bottom: 6, color: Palette.textSecondary, fontSize: 11 },
  heroBody: { flex: 1, justifyContent: 'center', gap: 6 },
  heroName: { color: Palette.text, fontSize: 24, fontWeight: '800' },
  categoryChip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  categoryChipText: { fontSize: 12, fontWeight: '700' },
  heroMeta: { color: Palette.textSecondary, fontSize: 12.5 },
  card: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 14,
  },
  photo: { width: '100%', height: 190, borderRadius: 10, backgroundColor: Palette.surfaceRaised },
  photoCaption: { color: Palette.textSecondary, fontSize: 12.5, marginTop: 8 },
  attribution: { color: Palette.textTertiary, fontSize: 10.5, marginTop: 3 },
  sectionTitle: { color: Palette.text, fontSize: 16, fontWeight: '800', marginBottom: 6 },
  summary: { color: Palette.textSecondary, fontSize: 14, lineHeight: 21 },
  propRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 7,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
  propLabel: { color: Palette.textTertiary, fontSize: 13.5 },
  propValue: { color: Palette.text, fontSize: 13.5, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  wikiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: withAlpha('#4DABF7', 0.12),
    borderWidth: 1,
    borderColor: withAlpha('#4DABF7', 0.4),
  },
  wikiText: { color: Palette.accent, fontSize: 14, fontWeight: '700' },
});
