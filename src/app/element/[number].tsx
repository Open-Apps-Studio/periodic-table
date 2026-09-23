import { Fragment, useEffect, useRef } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { GhsCard } from '@/components/ghs-card';
import { ShellDiagram } from '@/components/shell-diagram';
import { CategoryColors, CategoryLabels, withAlpha } from '@/constants/theme';
import { useElementNotes } from '@/context/element-notes-context';
import { usePalette } from '@/context/theme-context';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { getElement, getElementBySymbol } from '@/data/elements';
import { getNuclidesForElement } from '@/data/nuclides';
import { fmt, fmtKelvin, fmtYear } from '@/lib/format';
import {
  displayAtomicRadius,
  displayVanDerWaalsRadius,
  fmtConductivity,
  fmtDuration,
  fmtGpa,
  fmtKjPerMol,
  fmtMolarVolume,
  fmtPercent,
  fmtResistivity,
  fmtSpecificHeat,
  fmtSusceptibility,
  fmtThermalExpansion,
  fmtUsd,
} from '@/lib/format-properties';

export default function ElementScreen() {
  const router = useRouter();
  const palette = usePalette();
  const { getEntry, setNote, toggleFavorite } = useElementNotes();
  const styles = useThemedStyles((p) => ({
    container: { flex: 1, backgroundColor: p.background },
    content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 16, paddingBottom: 40, gap: 14 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    navButtons: { flexDirection: 'row', gap: 4 },
    navButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: p.surfaceRaised,
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
    heroNumber: { position: 'absolute', top: 6, left: 8, color: p.textSecondary, fontSize: 12, fontWeight: '700' },
    heroSymbol: { fontSize: 38, fontWeight: '800' },
    heroMass: { position: 'absolute', bottom: 6, color: p.textSecondary, fontSize: 11 },
    heroBody: { flex: 1, justifyContent: 'center', gap: 6 },
    heroName: { color: p.text, fontSize: 24, fontWeight: '800' },
    categoryChip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
    categoryChipText: { fontSize: 12, fontWeight: '700' },
    heroMeta: { color: p.textSecondary, fontSize: 12.5 },
    noteActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    favoriteButton: {
      flex: 1,
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: withAlpha('#E64980', 0.45),
      backgroundColor: withAlpha('#E64980', 0.1),
    },
    favoriteText: { color: '#E64980', fontSize: 13, fontWeight: '900' },
    noteInput: {
      minHeight: 92,
      color: p.text,
      fontSize: 14,
      lineHeight: 20,
      textAlignVertical: 'top',
      backgroundColor: p.surfaceRaised,
      borderWidth: 1,
      borderColor: p.border,
      borderRadius: 12,
      padding: 12,
      marginTop: 10,
    },
    card: {
      backgroundColor: p.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: p.border,
      padding: 14,
    },
    photo: { width: '100%', height: 190, borderRadius: 10, backgroundColor: p.surfaceRaised },
    photoCaption: { color: p.textSecondary, fontSize: 12.5, marginTop: 8 },
    attribution: { color: p.textTertiary, fontSize: 10.5, marginTop: 3 },
    sectionTitle: { color: p.text, fontSize: 16, fontWeight: '800', marginBottom: 6 },
    summary: { color: p.textSecondary, fontSize: 14, lineHeight: 21 },
    propRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 16,
      paddingVertical: 7,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: p.border,
    },
    propLabel: { color: p.textSecondary, fontSize: 13.5, lineHeight: 19, flex: 1 },
    propValue: { color: p.text, fontSize: 13.5, lineHeight: 19, fontWeight: '600', flex: 1.35, textAlign: 'right' },
    wikiButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 13,
      borderRadius: 14,
      backgroundColor: withAlpha(p.accent, 0.12),
      borderWidth: 1,
      borderColor: withAlpha(p.accent, 0.4),
    },
    wikiText: { color: p.accent, fontSize: 14, fontWeight: '700' },
    particles: { flexDirection: 'row', gap: 8, marginTop: 10 },
    particle: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12, gap: 2 },
    particleValue: { fontSize: 22, fontWeight: '900' },
    particleLabel: { color: p.textSecondary, fontSize: 11.5, fontWeight: '800', textTransform: 'uppercase' },
    particleNote: { color: p.textTertiary, fontSize: 11.5, marginTop: 6, marginBottom: 4 },
    spectrum: { width: '100%', aspectRatio: 4, borderRadius: 8, backgroundColor: '#000000' },
  }));

  const params = useLocalSearchParams<{ number: string }>();
  // Prev/next reuse this screen, so jump back to the top when the element changes.
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [params.number]);
  const rawParam = params.number;
  const parsedNum = Number(rawParam);
  const el =
    (Number.isFinite(parsedNum) ? getElement(parsedNum) : undefined) ??
    (rawParam ? getElementBySymbol(rawParam) : undefined);

  if (!el) {
    return (
      <View style={styles.center}>
        <Text style={styles.sectionTitle}>Element not found</Text>
      </View>
    );
  }

  const color = CategoryColors[el.category];
  const goTo = (n: number) => router.setParams({ number: String(n) });
  const price = el.priceUsdPer100g == null ? '—' : `${fmtUsd(el.priceUsdPer100g) ?? '—'} / 100 g`;
  const priceSource = el.priceReference
    ? [el.priceReference.source, el.priceReference.date].filter(Boolean).join(' · ')
    : null;
  const noteEntry = getEntry(el.number);
  const nuclides = getNuclidesForElement(el.number);
  const stableNuclides = nuclides.filter((nuclide) => nuclide.stable).length;
  const naturalNuclides = nuclides.filter((nuclide) => nuclide.abundancePercent != null).length;
  // Neutron count for the most common isotope (or the longest-lived one for
  // radioactive elements), so the particle row matches what textbooks show.
  const referenceNuclide =
    [...nuclides].filter((n) => n.abundancePercent != null).sort((a, b) => (b.abundancePercent ?? 0) - (a.abundancePercent ?? 0))[0] ??
    [...nuclides].filter((n) => n.halfLifeSeconds != null).sort((a, b) => (b.halfLifeSeconds ?? 0) - (a.halfLifeSeconds ?? 0))[0];
  // Wikipedia "File:" pages redirect to the image itself through Special:FilePath.
  const spectrumUri = el.spectralImage?.includes('/wiki/File:')
    ? `https://commons.wikimedia.org/wiki/Special:FilePath/${el.spectralImage.split('/wiki/File:')[1]}?width=1000`
    : null;

  return (
    <>
      <Stack.Screen
        options={{
          title: el.name,
          headerRight: () => (
            <View style={styles.navButtons}>
              <NavButton styles={styles} palette={palette} label={noteEntry.favorite ? `Remove ${el.name} from favorites` : `Add ${el.name} to favorites`} icon={noteEntry.favorite ? 'heart' : 'heart-outline'} disabled={false} onPress={() => toggleFavorite(el.number)} color={noteEntry.favorite ? '#E64980' : undefined} />
              <NavButton styles={styles} palette={palette} label={`Compare ${el.name}`} icon="git-compare-outline" disabled={false} onPress={() => router.push(`/compare?left=${el.number}` as never)} />
              <NavButton styles={styles} palette={palette} label="Previous element" icon="chevron-back" disabled={el.number <= 1} onPress={() => goTo(el.number - 1)} />
              <NavButton styles={styles} palette={palette} label="Next element" icon="chevron-forward" disabled={el.number >= 118} onPress={() => goTo(el.number + 1)} />
            </View>
          ),
        }}
      />
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic">
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
          <Text style={styles.summary} selectable>{el.summary}</Text>
          {el.appearance && <PropertyRow styles={styles} label="Appearance" value={el.appearance} />}
          <PropertyRow styles={styles} label="CAS Number" value={el.casNumber ?? '—'} />
          <PropertyRow styles={styles} label="Cost per 100 grams" value={price} />
          {priceSource && <PropertyRow styles={styles} label="Price source" value={priceSource} />}
        </View>

        {/* Electron shells */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Electron Shells</Text>
          <ShellDiagram shells={el.shells} color={color} />
          <View style={styles.particles}>
            <Particle styles={styles} label="Protons" value={String(el.number)} color="#F59F00" />
            <Particle styles={styles} label="Neutrons" value={referenceNuclide ? String(referenceNuclide.n) : '—'} color="#4DABF7" />
            <Particle styles={styles} label="Electrons" value={String(el.number)} color="#FF6B6B" />
          </View>
          {referenceNuclide && (
            <Text style={styles.particleNote}>Neutrons shown for {el.symbol}-{referenceNuclide.massNumber}, its {referenceNuclide.abundancePercent != null ? 'most common' : 'longest-lived'} isotope.</Text>
          )}
          <PropertyRow styles={styles} label="Configuration" value={el.electronConfiguration} />
          <PropertyRow styles={styles} label="Full configuration" value={el.electronConfigurationFull} />
          <PropertyRow styles={styles} label="Shells" value={el.shells.join(', ')} />
          <PropertyRow styles={styles} label="Oxidation states" value={el.oxidationStates ?? '—'} />
          <PropertyRow styles={styles} label="Valence electrons" value={el.valenceElectrons == null ? '—' : String(el.valenceElectrons)} />
        </View>

        <Section
          styles={styles}
          title="Physical Properties"
          rows={[
            ['Phase (STP)', el.phase],
            ['Density', el.densityValue == null ? '—' : `${fmt(el.densityValue, 4)} g/cm³`],
            ['Liquid density', el.liquidDensity == null ? '—' : `${fmt(el.liquidDensity, 4)} g/cm³`],
            ['Melting point', fmtKelvin(el.melt)],
            ['Boiling point', fmtKelvin(el.boil)],
            ['Critical temperature', fmtKelvin(el.criticalTemperature)],
            ['Critical pressure', el.criticalPressure == null ? '—' : `${fmt(el.criticalPressure, 4)} MPa`],
            ['Curie point', fmtKelvin(el.curiePoint)],
            ['Molar heat', el.molarHeat == null ? '—' : `${fmt(el.molarHeat, 4)} J/(mol·K)`],
            ['Specific heat', fmtSpecificHeat(el.specificHeat) ?? '—'],
            ['Heat of fusion', fmtKjPerMol(el.heatOfFusion) ?? '—'],
            ['Heat of vaporization', fmtKjPerMol(el.heatOfVaporization) ?? '—'],
            ['Thermal expansion', fmtThermalExpansion(el.thermalExpansion) ?? '—'],
            ['Molar volume', fmtMolarVolume(el.molarVolume) ?? '—'],
            ['Gas phase', el.gasPhase ?? '—'],
          ]}
        />

        <Section
          styles={styles}
          title="Atomic Properties"
          rows={[
            ['Atomic mass', `${fmt(el.atomicMass, 7)} u`],
            ['Atomic radius', displayAtomicRadius(el) ?? '—'],
            ['Calculated radius', el.calculatedRadius == null ? '—' : `${el.calculatedRadius} pm`],
            ['Covalent radius', el.covalentRadius == null ? '—' : `${el.covalentRadius} pm`],
            ['Van der Waals radius', displayVanDerWaalsRadius(el) ?? '—'],
            ['Electronegativity', el.electronegativity == null ? '—' : `${el.electronegativity} (Pauling)`],
            ['Electron affinity', el.electronAffinity == null ? '—' : `${fmt(el.electronAffinity, 4)} kJ/mol`],
            ['1st ionization energy', el.ionizationEnergies[0] == null ? '—' : `${fmt(el.ionizationEnergies[0], 5)} kJ/mol`],
          ]}
        />

        <Section
          styles={styles}
          title="Material Properties"
          rows={[
            ['Crystal structure', el.crystalStructure ?? '—'],
            ['Magnetic type', el.magneticType == null ? '—' : el.magneticType.charAt(0).toUpperCase() + el.magneticType.slice(1)],
            ['Electrical type', el.electricalType ?? '—'],
            ['Thermal conductivity', el.thermalConductivity == null ? '—' : `${fmt(el.thermalConductivity, 5)} W/(m·K)`],
            ['Electrical conductivity', fmtConductivity(el.electricalConductivity) ?? '—'],
            ['Electrical resistivity', fmtResistivity(el.resistivity) ?? '—'],
            ['Speed of sound', el.speedOfSound == null ? '—' : `${fmt(el.speedOfSound, 5)} m/s`],
            ['Refractive index', el.refractiveIndex == null ? '—' : fmt(el.refractiveIndex, 6)],
            ['Bulk modulus', fmtGpa(el.bulkModulus) ?? '—'],
            ["Young's modulus", fmtGpa(el.youngsModulus) ?? '—'],
            ['Shear modulus', fmtGpa(el.shearModulus) ?? '—'],
            ["Poisson's ratio", el.poissonsRatio == null ? '—' : fmt(el.poissonsRatio, 3)],
            ['Mohs hardness', el.mohsHardness == null ? '—' : fmt(el.mohsHardness, 3)],
            ['Brinell hardness', el.brinellHardness == null ? '—' : fmt(el.brinellHardness, 4)],
            ['Vickers hardness', el.vickersHardness == null ? '—' : fmt(el.vickersHardness, 4)],
          ]}
        />

        <Section
          styles={styles}
          title="Abundance"
          rows={[
            ['Universe', fmtPercent(el.abundanceUniverse) ?? '—'],
            ['Solar', fmtPercent(el.abundanceSolar) ?? '—'],
            ['Meteorites', fmtPercent(el.abundanceMeteor) ?? '—'],
            ["Earth's crust", fmtPercent(el.abundanceCrust) ?? '—'],
            ['Ocean', fmtPercent(el.abundanceOcean) ?? '—'],
            ['Human body', fmtPercent(el.abundanceHuman) ?? '—'],
          ]}
        />

        <Section
          styles={styles}
          title="Isotopes & Nuclear"
          rows={[
            ['Known nuclides (IAEA)', String(nuclides.length)],
            ['Stable nuclides (IAEA)', String(stableNuclides)],
            ['Naturally abundant nuclides', String(naturalNuclides)],
            ['Known isotopes', el.isotopesKnown ?? '—'],
            ['Stable isotopes', el.isotopesStable ?? '—'],
            ['Natural abundance', el.isotopicAbundances ?? '—'],
            ['Radioactive', el.radioactive == null ? '—' : el.radioactive ? 'Yes' : 'No'],
            ['Half-life', el.halfLife == null ? (el.radioactive === false ? 'Stable' : '—') : fmtDuration(el.halfLife)],
            ['Lifetime', el.lifetime == null ? (el.radioactive === false ? 'Stable' : '—') : fmtDuration(el.lifetime)],
            ['Neutron cross-section', el.neutronCrossSection == null ? '—' : `${fmt(el.neutronCrossSection, 4)} barn`],
            ['Neutron mass absorption', el.neutronMassAbsorption == null ? '—' : `${fmt(el.neutronMassAbsorption, 4)} m²/kg`],
          ]}
        />
        <Pressable accessibilityRole="button" style={styles.wikiButton} onPress={() => router.push(`/isotopes?q=${encodeURIComponent(el.name)}` as never)}>
          <Ionicons name="radio-outline" size={16} color={palette.accent} />
          <Text style={styles.wikiText}>Browse {el.symbol} isotopes</Text>
        </Pressable>

        <Section
          styles={styles}
          title="Electromagnetic Properties"
          rows={[
            ['Volume magnetic susceptibility', fmtSusceptibility(el.volumeMagneticSusceptibility) ?? '—'],
            ['Mass magnetic susceptibility', fmtSusceptibility(el.massMagneticSusceptibility) ?? '—'],
            ['Molar magnetic susceptibility', fmtSusceptibility(el.molarMagneticSusceptibility) ?? '—'],
          ]}
        />

        <Section
          styles={styles}
          title="Discovery"
          rows={[
            ['Discovered by', el.discoveredBy ?? '—'],
            ['Discovery location', el.discoveryLocation ?? '—'],
            ['Name origin', el.nameOrigin ?? '—'],
            ['Named by', el.namedBy ?? '—'],
            ['Year', fmtYear(el.yearDiscovered)],
            ['CID Number', el.cidNumber ?? '—'],
            ['Wikidata', el.wikidataId ?? '—'],
            ['RTEC Number', el.rtecNumber ?? '—'],
          ]}
        />

        <GhsCard ghs={el.ghs} elementName={el.name} />

        {spectrumUri && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Emission spectrum</Text>
            <Image
              source={{ uri: spectrumUri }}
              style={styles.spectrum}
              contentFit="contain"
              transition={200}
              accessibilityLabel={`Emission spectrum of ${el.name}`}
            />
            <Text style={styles.attribution}>Wikimedia Commons</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notes & Favorites</Text>
          <View style={styles.noteActions}>
            <Pressable accessibilityRole="button" style={styles.favoriteButton} onPress={() => toggleFavorite(el.number)}>
              <Ionicons name={noteEntry.favorite ? 'heart' : 'heart-outline'} size={17} color="#E64980" />
              <Text style={styles.favoriteText}>{noteEntry.favorite ? 'Favorited' : 'Add favorite'}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.favoriteButton} onPress={() => router.push('/notes' as never)}>
              <Ionicons name="reader-outline" size={17} color="#E64980" />
              <Text style={styles.favoriteText}>All notes</Text>
            </Pressable>
          </View>
          <TextInput
            style={styles.noteInput}
            placeholder={`Private note for ${el.name}`}
            placeholderTextColor={palette.textTertiary}
            value={noteEntry.note}
            onChangeText={(text) => setNote(el.number, text)}
            multiline
            autoCorrect
          />
        </View>

        <Pressable accessibilityRole="link" style={styles.wikiButton} onPress={() => Linking.openURL(el.wikipediaUrl)}>
          <Ionicons name="globe-outline" size={16} color={palette.accent} />
          <Text style={styles.wikiText}>Read more on Wikipedia</Text>
        </Pressable>
        {el.spectralImage && (
          <Pressable accessibilityRole="link" style={styles.wikiButton} onPress={() => Linking.openURL(el.spectralImage!)}>
            <Ionicons name="analytics-outline" size={16} color={palette.accent} />
            <Text style={styles.wikiText}>Open spectral image</Text>
          </Pressable>
        )}
        {el.bohrModel3d && (
          <Pressable
            accessibilityRole="button"
            accessibilityHint="Opens an interactive model viewer"
            style={styles.wikiButton}
            onPress={() => router.push(`/model/${el.number}` as never)}>
            <Ionicons name="cube-outline" size={16} color={palette.accent} />
            <Text style={styles.wikiText}>View interactive 3D model</Text>
          </Pressable>
        )}
      </ScrollView>
    </>
  );
}

function NavButton({
  styles,
  palette,
  label,
  icon,
  disabled,
  onPress,
  color,
}: {
  styles: { navButton: object };
  palette: ReturnType<typeof usePalette>;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  disabled: boolean;
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      style={[styles.navButton, disabled && { opacity: 0.3 }]}>
      <Ionicons name={icon} size={20} color={color ?? palette.text} />
    </Pressable>
  );
}

function Section({
  styles,
  title,
  rows,
}: {
  styles: { card: object; sectionTitle: object; propRow: object; propLabel: object; propValue: object };
  title: string;
  rows: [string, string][];
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {rows.map(([label, value]) => (
        <Fragment key={label}>
          <PropertyRow styles={styles} label={label} value={value} />
        </Fragment>
      ))}
    </View>
  );
}

function PropertyRow({
  styles,
  label,
  value,
}: {
  styles: { propRow: object; propLabel: object; propValue: object };
  label: string;
  value: string;
}) {
  return (
    <View style={styles.propRow}>
      <Text style={styles.propLabel} selectable>{label}</Text>
      <Text style={styles.propValue} selectable>{value}</Text>
    </View>
  );
}

function Particle({
  label,
  value,
  color,
  styles,
}: {
  label: string;
  value: string;
  color: string;
  styles: { particle: object; particleValue: object; particleLabel: object };
}) {
  return (
    <View style={[styles.particle, { backgroundColor: withAlpha(color, 0.12) }]} accessible accessibilityLabel={`${value} ${label.toLowerCase()}`}>
      <Text style={[styles.particleValue, { color }]}>{value}</Text>
      <Text style={styles.particleLabel}>{label}</Text>
    </View>
  );
}
