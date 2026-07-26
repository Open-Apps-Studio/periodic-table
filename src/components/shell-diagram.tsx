import { Text, View } from 'react-native';
import { withAlpha } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-themed-styles';

const SIZE = 190;
const NUCLEUS = 26;
const SHELL_NAMES = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

/** Concentric-ring Bohr diagram with a readable shell-population legend. */
export function ShellDiagram({ shells, color }: { shells: number[]; color: string }) {
  const styles = useThemedStyles((p) => ({
    wrap: { alignItems: 'center', paddingVertical: 8, gap: 10 },
    ring: { position: 'absolute', borderWidth: 1.2 },
    nucleus: { position: 'absolute', width: NUCLEUS, height: NUCLEUS, borderRadius: NUCLEUS / 2, borderWidth: 1.5 },
    legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
    shellChip: {
      minWidth: 42,
      minHeight: 28,
      paddingHorizontal: 8,
      borderRadius: 14,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    shellName: { color: p.textSecondary, fontSize: 11, fontWeight: '700' },
    shellCount: { fontSize: 12, fontWeight: '800', fontVariant: ['tabular-nums'] },
    caption: { color: p.textSecondary, fontSize: 11 },
  }));

  const maxRadius = SIZE / 2 - 14;
  const step = shells.length > 1 ? (maxRadius - NUCLEUS / 2 - 14) / (shells.length - 1) : 0;

  return (
    <View
      style={styles.wrap}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Electron shells: ${shells.map((count, index) => `${SHELL_NAMES[index] ?? index + 1} shell ${count}`).join(', ')}`}>
      <View style={{ width: SIZE, height: SIZE }} importantForAccessibility="no-hide-descendants">
        {shells.map((count, i) => {
          const r = shells.length === 1 ? maxRadius : NUCLEUS / 2 + 14 + i * step;
          return (
            <View
              key={`${i}-${count}`}
              style={[
                styles.ring,
                {
                  width: r * 2,
                  height: r * 2,
                  borderRadius: r,
                  left: SIZE / 2 - r,
                  top: SIZE / 2 - r,
                  borderColor: withAlpha(color, 0.5),
                },
              ]}
            />
          );
        })}
        <View style={[styles.nucleus, { left: SIZE / 2 - NUCLEUS / 2, top: SIZE / 2 - NUCLEUS / 2, backgroundColor: withAlpha(color, 0.35), borderColor: color }]} />
      </View>
      <Text style={styles.caption}>Electrons per shell</Text>
      <View style={styles.legend}>
        {shells.map((count, index) => (
          <View
            key={`${SHELL_NAMES[index] ?? index + 1}-${count}`}
            style={[styles.shellChip, { backgroundColor: withAlpha(color, 0.12), borderColor: withAlpha(color, 0.45) }]}>
            <Text style={styles.shellName}>{SHELL_NAMES[index] ?? index + 1}</Text>
            <Text style={[styles.shellCount, { color }]}>{count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
