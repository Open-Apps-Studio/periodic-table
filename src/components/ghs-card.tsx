import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Linking, Pressable, Text, View } from 'react-native';
import { withAlpha } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import type { ElementGhs } from '@/types/element';

/** GHS pictogram code -> closest MaterialCommunityIcons glyph (drawn in a red diamond). */
const PICTOGRAM_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  GHS01: 'bomb',
  GHS02: 'fire',
  GHS03: 'fire-circle',
  GHS04: 'gas-cylinder',
  GHS05: 'test-tube',
  GHS06: 'skull-crossbones',
  GHS07: 'exclamation-thick',
  GHS08: 'human-handsdown',
  GHS09: 'fish',
};

const GHS_RED = '#E03131';

/**
 * Safety section: GHS signal word, pictograms and hazard statements. Always
 * names the classified substance, because official entries often cover a
 * powder or dust rather than the bulk element.
 */
export function GhsCard({ ghs, elementName }: { ghs: ElementGhs | null; elementName: string }) {
  const styles = useThemedStyles((p) => ({
    card: { backgroundColor: p.surface, borderRadius: 16, borderWidth: 1, borderColor: p.border, padding: 14, gap: 10 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { color: p.text, fontSize: 16, fontWeight: '800' },
    signal: { fontSize: 12, fontWeight: '900', textTransform: 'uppercase', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden' },
    pictograms: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, paddingVertical: 4 },
    pictogram: { alignItems: 'center', width: 64, gap: 6 },
    diamond: {
      width: 40,
      height: 40,
      margin: 6,
      borderWidth: 3,
      borderColor: GHS_RED,
      backgroundColor: '#FFFFFF',
      transform: [{ rotate: '45deg' }],
      alignItems: 'center',
      justifyContent: 'center',
    },
    pictogramLabel: { color: p.textSecondary, fontSize: 10.5, fontWeight: '700', textAlign: 'center' },
    hazard: { flexDirection: 'row', gap: 8 },
    hazardCode: { color: p.text, fontSize: 13, fontWeight: '800', width: 52 },
    hazardText: { color: p.textSecondary, fontSize: 13, lineHeight: 18, flex: 1 },
    note: { color: p.textSecondary, fontSize: 13, lineHeight: 19 },
    source: { color: p.textTertiary, fontSize: 11, lineHeight: 15 },
  }));

  if (!ghs) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Safety</Text>
        <Text style={styles.note}>No GHS classification is published for {elementName.toLowerCase()}.</Text>
      </View>
    );
  }

  const signalColor = ghs.signal === 'Danger' ? GHS_RED : '#F08C00';
  const isEcha = ghs.source.startsWith('European Chemicals Agency');

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Safety (GHS)</Text>
        {ghs.signal && (
          <Text style={[styles.signal, { color: signalColor, backgroundColor: withAlpha(signalColor, 0.14) }]}>{ghs.signal}</Text>
        )}
      </View>

      {ghs.hazards.length === 0 ? (
        <Text style={styles.note}>
          Not classified as hazardous by most suppliers
          {ghs.notClassified ? ` (${ghs.notClassified.reports.toLocaleString()} of ${ghs.notClassified.total.toLocaleString()} reports)` : ''}.
          Fine powders and dusts can still be flammable or irritating.
        </Text>
      ) : (
        <>
          {ghs.pictograms.length > 0 && (
            <View style={styles.pictograms}>
              {ghs.pictograms.map((p) => (
                <View
                  key={p.code}
                  style={styles.pictogram}
                  accessible
                  accessibilityLabel={`${p.label} pictogram`}>
                  <View style={styles.diamond}>
                    <View style={{ transform: [{ rotate: '-45deg' }] }}>
                      <MaterialCommunityIcons name={PICTOGRAM_ICONS[p.code] ?? 'alert'} size={22} color="#111111" />
                    </View>
                  </View>
                  <Text style={styles.pictogramLabel}>{p.label}</Text>
                </View>
              ))}
            </View>
          )}
          {ghs.hazards.map((h) => (
            <View key={h.code} style={styles.hazard}>
              <Text style={styles.hazardCode}>{h.code}</Text>
              <Text style={styles.hazardText}>{h.text}</Text>
            </View>
          ))}
        </>
      )}

      <Pressable accessibilityRole="link" onPress={() => Linking.openURL(ghs.sourceUrl)}>
        <Text style={styles.source}>
          Applies to: {ghs.substance}.{'\n'}
          {isEcha
            ? 'Source: European Chemicals Agency, http://echa.europa.eu/ (hazards listed by at least half of supplier notifications).'
            : 'Source: EU harmonised classification, Regulation (EC) No 1272/2008 (CC BY 4.0).'}{' '}
          Via PubChem. Not a substitute for a safety data sheet.
        </Text>
      </Pressable>
    </View>
  );
}
