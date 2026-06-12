import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PeriodicTable, TABLE_HEIGHT, TABLE_WIDTH } from '@/components/periodic-table';
import { Zoomable } from '@/components/zoomable';
import {
  CATEGORY_ORDER,
  CategoryColors,
  CategoryLabels,
  Palette,
  withAlpha,
} from '@/constants/theme';
import { DISPLAY_MODES } from '@/lib/display-modes';
import type { ElementCategory } from '@/types/element';

export default function TableScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [modeId, setModeId] = useState('categories');
  const [highlight, setHighlight] = useState<ElementCategory | null>(null);

  const mode = DISPLAY_MODES.find((m) => m.id === modeId)!;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Periodic Table</Text>
        <Text style={styles.subtitle}>118 elements</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.modeBar}
        contentContainerStyle={styles.modeBarContent}>
        {DISPLAY_MODES.map((m) => {
          const active = m.id === modeId;
          return (
            <Pressable
              key={m.id}
              onPress={() => {
                setModeId(m.id);
                if (m.id !== 'categories') setHighlight(null);
              }}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{m.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Zoomable contentWidth={TABLE_WIDTH} contentHeight={TABLE_HEIGHT} minScaleFactor={0.95} maxScale={2}>
        <PeriodicTable
          mode={mode}
          highlightCategory={modeId === 'categories' ? highlight : null}
          onPressElement={(el) => router.push(`/element/${el.number}`)}
        />
      </Zoomable>

      {modeId === 'categories' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.legend, { marginBottom: 8 }]}
          contentContainerStyle={styles.modeBarContent}>
          {CATEGORY_ORDER.map((cat) => {
            const color = CategoryColors[cat];
            const active = highlight === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setHighlight(active ? null : cat)}
                style={[
                  styles.legendChip,
                  { borderColor: withAlpha(color, 0.5), backgroundColor: withAlpha(color, active ? 0.35 : 0.12) },
                ]}>
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={[styles.legendText, active && { color: Palette.text }]}>
                  {CategoryLabels[cat]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.background },
  header: { paddingHorizontal: 16, paddingBottom: 4 },
  title: { color: Palette.text, fontSize: 26, fontWeight: '800' },
  subtitle: { color: Palette.textTertiary, fontSize: 13, marginTop: 2 },
  modeBar: { flexGrow: 0, marginTop: 8 },
  modeBarContent: { paddingHorizontal: 12, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  chipActive: { backgroundColor: withAlpha(Palette.accent, 0.18), borderColor: Palette.accent },
  chipText: { color: Palette.textSecondary, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: Palette.accent },
  legend: { flexGrow: 0 },
  legendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: Palette.textSecondary, fontSize: 12, fontWeight: '600' },
});
