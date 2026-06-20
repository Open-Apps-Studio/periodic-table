import { Modal, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withAlpha } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { useThemedStyles } from '@/hooks/use-themed-styles';

type FeatureId =
  | 'isotopes'
  | 'compare'
  | 'trends'
  | 'dictionary'
  | 'notes'
  | 'reactions'
  | 'qr'
  | 'calculators'
  | 'academy'
  | 'settings'
  | 'about';

interface FeatureCard {
  id: FeatureId;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  status: 'Free' | 'Local' | 'Info';
  route?: string;
  details: string[];
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'isotopes',
    title: 'Isotopes',
    subtitle: 'Stable and radioactive isotope notes for common classroom work.',
    icon: 'radio-outline',
    accent: '#495057',
    status: 'Free',
    route: '/isotopes',
    details: [
      '3,383 ground-state nuclides from the IAEA LiveChart API.',
      'Search by element, nuclide name, mass number, spin/parity, or decay mode.',
      'Filter stable, radioactive, and naturally abundant isotopes.',
      'Rows include half-life, abundance, decay modes, mass, binding energy, and discovery year.',
    ],
  },
  {
    id: 'compare',
    title: 'Compare Elements',
    subtitle: 'Pick any two elements and compare properties side-by-side.',
    icon: 'git-compare-outline',
    accent: '#7950F2',
    status: 'Free',
    route: '/compare',
    details: [
      'Compare atomic, physical, material, abundance, isotope, discovery, and market-price fields.',
    ],
  },
  {
    id: 'trends',
    title: 'Trend graphs',
    subtitle: 'Graph element properties across periods and the f-block.',
    icon: 'analytics-outline',
    accent: '#F77F00',
    status: 'Free',
    route: '/trends',
    details: [
      'Graph every numeric property exposed in the element list.',
      'Filter by period or f-block, tap bars to inspect elements, and open the full element card.',
      'Log scale is available for values that span many orders of magnitude.',
    ],
  },
  {
    id: 'dictionary',
    title: 'Dictionary',
    subtitle: 'A compact chemistry glossary without accounts or paid gates.',
    icon: 'book-outline',
    accent: '#6C757D',
    status: 'Free',
    route: '/dictionary',
    details: [
      'Search compact chemistry definitions by term, category, example, or tag.',
      'Covers atoms, periodic trends, bonding, reactions, solutions, nuclear chemistry, and measurement.',
      'Each entry includes a short example so the definition is usable while studying.',
    ],
  },
  {
    id: 'notes',
    title: 'Element notes',
    subtitle: 'Local study notes and favorites stored on this device.',
    icon: 'heart-outline',
    accent: '#E64980',
    status: 'Local',
    route: '/notes',
    details: [
      'Pin favorite elements from the element detail screen.',
      'Write local-only notes for study reminders and lab observations.',
      'Everything stays offline-first so it stays open-source and private.',
    ],
  },
  {
    id: 'reactions',
    title: 'Chemical reactions',
    subtitle: 'Qualitative reactions and prediction helpers are available for free.',
    icon: 'flask-outline',
    accent: '#2D936C',
    status: 'Free',
    route: '/reactions',
    details: [
      'Balance molecular equations from formulas.',
      'Search common precipitation, acid-base, redox, combustion, decomposition, synthesis, gas-forming, and qualitative reactions.',
      'Each reaction includes conditions, observations, and a short explanation.',
    ],
  },
  {
    id: 'qr',
    title: 'QR-Code',
    subtitle: 'Install and share the app from the same place.',
    icon: 'qr-code-outline',
    accent: '#118AB2',
    status: 'Free',
    route: '/qr',
    details: [
      'The project already includes assets/install-qr.png for install sharing.',
      'Release builds can update this card with the final App Store or TestFlight URL.',
      'The Share row below opens the native share sheet right now.',
    ],
  },
  {
    id: 'calculators',
    title: 'Calculators',
    subtitle: 'Molar mass, amount of substance, concentration, solubility, and reference tables.',
    icon: 'calculator-outline',
    accent: '#228BE6',
    status: 'Free',
    route: '/tools',
    details: [
      'Molar mass calculator parses nested groups and hydrate dots.',
      'Amount calculator solves n = m / M.',
      'Concentration calculator solves c = n / V from formula, mass, and volume.',
    ],
  },
  {
    id: 'academy',
    title: 'Academy',
    subtitle: 'Short learning cards without accounts, ads, or locked progress.',
    icon: 'school-outline',
    accent: '#2F9E44',
    status: 'Free',
    route: '/academy',
    details: [
      'Short lesson cards for trends, isotopes, ions, bonding, reactions, moles, solubility, and radioactivity.',
      'Each card includes key ideas, a worked-style example, and a quick check.',
      'No accounts, locked progress, or ads.',
    ],
  },
];

const SETTINGS = [
  ['Theme', 'Uses the device light/dark setting automatically.'],
  ['Table form', 'Full 18-column table is active. Compact 8-group mode is intentionally not on by default.'],
  ['Font size', 'System font scaling is respected where React Native exposes it.'],
];

export default function MoreScreen() {
  const router = useRouter();
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<FeatureCard | null>(null);
  const styles = useThemedStyles((p) => ({
    container: { flex: 1, backgroundColor: p.background },
    content: { padding: 14, paddingBottom: 96, gap: 14 },
    title: { color: p.text, fontSize: 18, fontWeight: '900', textAlign: 'center', marginBottom: 2 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    feature: {
      minHeight: 98,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: p.border,
      backgroundColor: p.surface,
      padding: 10,
      overflow: 'hidden',
    },
    wide: { width: '49%' },
    full: { width: '100%' },
    featureIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    featureTitle: { color: p.text, fontSize: 13.5, fontWeight: '900' },
    featureSubtitle: { color: p.textSecondary, fontSize: 11.5, lineHeight: 16, marginTop: 3, paddingRight: 4 },
    badge: {
      position: 'absolute',
      top: 8,
      right: 8,
      borderRadius: 8,
      paddingHorizontal: 6,
      paddingVertical: 3,
      backgroundColor: p.surfaceRaised,
    },
    badgeText: { color: p.textSecondary, fontSize: 10, fontWeight: '900' },
    section: {
      backgroundColor: p.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: p.border,
      overflow: 'hidden',
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: p.surfaceRaised,
    },
    sectionTitle: { color: p.text, fontSize: 15, fontWeight: '900' },
    settingRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 0.5, borderTopColor: p.border },
    settingIcon: { width: 30, alignItems: 'center', paddingTop: 2 },
    settingBody: { flex: 1, gap: 2 },
    settingName: { color: p.text, fontSize: 14, fontWeight: '900' },
    settingText: { color: p.textSecondary, fontSize: 12.5, lineHeight: 18 },
    aboutText: { color: p.textSecondary, fontSize: 13, lineHeight: 20, padding: 14 },
    linkRow: {
      minHeight: 50,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 14,
      borderTopWidth: 0.5,
      borderTopColor: p.border,
    },
    linkText: { flex: 1, color: p.text, fontSize: 14, fontWeight: '900' },
    backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: withAlpha('#000000', 0.42) },
    sheet: {
      maxHeight: '78%',
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
      marginBottom: 10,
    },
    sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 8 },
    sheetIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    sheetTitle: { color: p.text, fontSize: 18, fontWeight: '900', flex: 1 },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: p.surfaceRaised,
    },
    detailList: { paddingHorizontal: 18, paddingTop: 8, gap: 9 },
    detailRow: {
      flexDirection: 'row',
      gap: 10,
      padding: 10,
      borderRadius: 12,
      backgroundColor: p.surfaceRaised,
      borderWidth: 1,
      borderColor: p.border,
    },
    detailBullet: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
    detailText: { color: p.textSecondary, fontSize: 13, lineHeight: 19, flex: 1 },
  }));

  const openFeature = (item: FeatureCard) => {
    if (item.route) router.push(item.route as never);
    else setSelected(item);
  };

  const shareApp = async () => {
    await Share.share({
      title: 'Periodic Table',
      message: 'Free, open-source, ad-free periodic table app.',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Other</Text>
      <View style={styles.grid}>
        {FEATURE_CARDS.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={() => openFeature(item)}
            style={({ pressed }) => [
              styles.feature,
              index === 0 || index === 3 || item.title === 'QR-Code' ? styles.full : styles.wide,
              { backgroundColor: withAlpha(item.accent, 0.09), borderColor: withAlpha(item.accent, 0.24) },
              pressed && { opacity: 0.65 },
            ]}>
            <View style={[styles.featureIcon, { backgroundColor: withAlpha(item.accent, 0.18) }]}>
              <Ionicons name={item.icon} size={18} color={item.accent} />
            </View>
            <Text style={styles.featureTitle}>{item.title}</Text>
            <Text style={styles.featureSubtitle}>{item.subtitle}</Text>
            <View style={styles.badge}>
              <Text style={[styles.badgeText, item.status === 'Free' && { color: palette.accent }]}>{item.status}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="settings-outline" size={18} color={palette.accent} />
          <Text style={styles.sectionTitle}>Settings</Text>
        </View>
        {SETTINGS.map(([name, text]) => (
          <View key={name} style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons name="options-outline" size={17} color={palette.textTertiary} />
            </View>
            <View style={styles.settingBody}>
              <Text style={styles.settingName}>{name}</Text>
              <Text style={styles.settingText}>{text}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={18} color={palette.accent} />
          <Text style={styles.sectionTitle}>About</Text>
        </View>
        <Text style={styles.aboutText}>
          Periodic Table is a free, open-source, ad-free chemistry reference. Element data comes from open datasets with attribution, and premium-style features are treated as normal app features.
        </Text>
        <Pressable style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.6 }]} onPress={shareApp}>
          <Ionicons name="share-social-outline" size={18} color={palette.textTertiary} />
          <Text style={styles.linkText}>Share the app</Text>
          <Ionicons name="chevron-forward" size={16} color={palette.textTertiary} />
        </Pressable>
      </View>

      <FeatureSheet selected={selected} styles={styles} onClose={() => setSelected(null)} />
    </ScrollView>
  );
}

function FeatureSheet({
  selected,
  styles,
  onClose,
}: {
  selected: FeatureCard | null;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  onClose: () => void;
}) {
  return (
    <Modal visible={!!selected} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.handle} />
          {selected && (
            <>
              <View style={styles.sheetHeader}>
                <View style={[styles.sheetIcon, { backgroundColor: withAlpha(selected.accent, 0.18) }]}>
                  <Ionicons name={selected.icon} size={19} color={selected.accent} />
                </View>
                <Text style={styles.sheetTitle}>{selected.title}</Text>
                <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
                  <Ionicons name="close" size={18} color="#687385" />
                </Pressable>
              </View>
              <ScrollView contentContainerStyle={styles.detailList}>
                {selected.details.map((line) => (
                  <View key={line} style={styles.detailRow}>
                    <View style={[styles.detailBullet, { backgroundColor: selected.accent }]} />
                    <Text style={styles.detailText}>{line}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
