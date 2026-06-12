import { StyleSheet, Text, View } from 'react-native';
import { Palette, withAlpha } from '@/constants/theme';

const SIZE = 190;
const NUCLEUS = 26;

/** Concentric-ring Bohr diagram with the electron count badged on each shell. */
export function ShellDiagram({ shells, color }: { shells: number[]; color: string }) {
  const maxRadius = SIZE / 2 - 14;
  const step = shells.length > 1 ? (maxRadius - NUCLEUS / 2 - 14) / (shells.length - 1) : 0;

  return (
    <View style={styles.wrap}>
      <View style={{ width: SIZE, height: SIZE }}>
        {shells.map((count, i) => {
          const r = shells.length === 1 ? maxRadius : NUCLEUS / 2 + 14 + i * step;
          return (
            <View key={i}>
              <View
                style={[
                  styles.ring,
                  {
                    width: r * 2,
                    height: r * 2,
                    borderRadius: r,
                    left: SIZE / 2 - r,
                    top: SIZE / 2 - r,
                    borderColor: withAlpha(color, 0.45),
                  },
                ]}
              />
              <View style={[styles.badge, { left: SIZE / 2 - 11, top: SIZE / 2 - r - 9, backgroundColor: withAlpha(color, 0.25), borderColor: withAlpha(color, 0.6) }]}>
                <Text style={[styles.badgeText, { color }]}>{count}</Text>
              </View>
            </View>
          );
        })}
        <View style={[styles.nucleus, { left: SIZE / 2 - NUCLEUS / 2, top: SIZE / 2 - NUCLEUS / 2, backgroundColor: withAlpha(color, 0.35), borderColor: color }]} />
      </View>
      <Text style={styles.caption}>electrons per shell</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 8 },
  ring: { position: 'absolute', borderWidth: 1.2 },
  nucleus: { position: 'absolute', width: NUCLEUS, height: NUCLEUS, borderRadius: NUCLEUS / 2, borderWidth: 1.5 },
  badge: {
    position: 'absolute',
    width: 22,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 10, fontWeight: '800' },
  caption: { color: Palette.textTertiary, fontSize: 11, marginTop: 6 },
});
