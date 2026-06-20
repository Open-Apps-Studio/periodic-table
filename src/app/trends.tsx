import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryColors, CategoryLabels, withAlpha } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { ELEMENTS } from '@/data/elements';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import {
  DEFAULT_PROPERTY_FIELD_ID,
  getPropertyField,
  PROPERTY_FIELDS,
  type PropertyField,
} from '@/lib/property-fields';
import type { PeriodicElement } from '@/types/element';

type PeriodFilter = 'all' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | 'f';

const PERIOD_FILTERS: Array<{ id: PeriodFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: '1', label: 'P1' },
  { id: '2', label: 'P2' },
  { id: '3', label: 'P3' },
  { id: '4', label: 'P4' },
  { id: '5', label: 'P5' },
  { id: '6', label: 'P6' },
  { id: '7', label: 'P7' },
  { id: 'f', label: 'f-block' },
];

export default function TrendsScreen() {
  const router = useRouter();
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const [fieldId, setFieldId] = useState(DEFAULT_PROPERTY_FIELD_ID);
  const [period, setPeriod] = useState<PeriodFilter>('all');
  const [logScale, setLogScale] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(6);
  const [pickerOpen, setPickerOpen] = useState(false);
  const field = getPropertyField(fieldId);
  const styles = useThemedStyles((p) => ({
    container: { flex: 1, backgroundColor: p.background },
    content: { padding: 14, paddingBottom: 34, gap: 12 },
    headerCard: {
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
      borderRadius: 14,
      padding: 12,
      gap: 10,
    },
    propertyButton: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    dot: { width: 10, height: 10, borderRadius: 5 },
    propertyTitle: { flex: 1, color: p.text, fontSize: 17, fontWeight: '900' },
    propertyMeta: { color: p.textSecondary, fontSize: 12.5, lineHeight: 18 },
    controls: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      minHeight: 32,
      paddingHorizontal: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: p.border,
      backgroundColor: p.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipActive: { borderColor: p.accent, backgroundColor: withAlpha(p.accent, 0.16) },
    chipText: { color: p.textSecondary, fontSize: 12, fontWeight: '800' },
    chipTextActive: { color: p.accent },
    statsRow: { flexDirection: 'row', gap: 8 },
    stat: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: p.border,
      backgroundColor: p.surface,
      padding: 10,
      gap: 3,
    },
    statValue: { color: p.text, fontSize: 14, fontWeight: '900' },
    statLabel: { color: p.textTertiary, fontSize: 11.5, fontWeight: '800' },
    chartCard: {
      backgroundColor: p.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: p.border,
      overflow: 'hidden',
    },
    axisHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: p.surfaceRaised,
      borderBottomWidth: 1,
      borderBottomColor: p.border,
    },
    axisText: { color: p.textTertiary, fontSize: 11.5, fontWeight: '800' },
    chartScroll: { minHeight: 228 },
    chartInner: {
      height: 220,
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 4,
      paddingHorizontal: 12,
      paddingTop: 14,
      paddingBottom: 10,
    },
    barCol: { width: 28, height: 196, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
    barTrack: {
      width: 18,
      height: 150,
      borderRadius: 9,
      backgroundColor: p.surfaceRaised,
      justifyContent: 'flex-end',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: p.border,
    },
    barFill: { width: '100%', borderRadius: 9 },
    selectedBarTrack: { borderColor: p.text, borderWidth: 1.5 },
    symbol: { color: p.textSecondary, fontSize: 10.5, fontWeight: '900' },
    number: { color: p.textTertiary, fontSize: 9.5, fontWeight: '800' },
    missingDash: { color: p.textTertiary, fontSize: 16, fontWeight: '900', marginBottom: 64 },
    detailCard: {
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
      borderRadius: 14,
      padding: 12,
      gap: 10,
    },
    detailTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    tile: {
      width: 48,
      height: 48,
      borderRadius: 12,
      borderWidth: 1.2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tileNumber: { position: 'absolute', top: 5, left: 7, fontSize: 10, fontWeight: '900' },
    tileSymbol: { fontSize: 18, fontWeight: '900' },
    detailBody: { flex: 1 },
    detailName: { color: p.text, fontSize: 16, fontWeight: '900' },
    detailMeta: { color: p.textTertiary, fontSize: 12, fontWeight: '800', marginTop: 2 },
    detailValue: { color: p.text, fontSize: 24, fontWeight: '900' },
    detailLabel: { color: p.textSecondary, fontSize: 12.5, fontWeight: '800' },
    openButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 11,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: withAlpha(p.accent, 0.4),
      backgroundColor: withAlpha(p.accent, 0.1),
    },
    openText: { color: p.accent, fontSize: 13, fontWeight: '900' },
    backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: withAlpha('#000000', 0.38) },
    sheet: {
      maxHeight: '76%',
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
      marginBottom: 12,
    },
    sheetTitle: { color: p.text, fontSize: 20, fontWeight: '900', paddingHorizontal: 18, marginBottom: 8 },
    propertyRow: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 18,
      borderTopWidth: 0.5,
      borderTopColor: p.border,
    },
    propertyLabel: { flex: 1, color: p.textSecondary, fontSize: 14, fontWeight: '800' },
    propertyLabelActive: { color: p.text },
  }));

  const rows = useMemo(() => {
    const filtered = ELEMENTS.filter((el) => {
      if (period === 'all') return true;
      if (period === 'f') return el.block === 'f';
      return el.period === Number(period) && el.block !== 'f';
    });
    return filtered.map((el) => ({ el, value: field.value(el) }));
  }, [field, period]);

  const knownRows = rows.filter((row): row is { el: PeriodicElement; value: number } => row.value != null);
  const scaledRows = logScale ? knownRows.filter((row) => row.value > 0) : knownRows;
  const selected = rows.find((row) => row.el.number === selectedNumber)?.el ?? knownRows[0]?.el ?? ELEMENTS[0];
  const selectedValue = field.value(selected);
  const scale = getScale(scaledRows.map((row) => row.value), logScale);
  const minRow = getExtremeRow(scaledRows, 'min');
  const maxRow = getExtremeRow(scaledRows, 'max');
  const selectedDisplay = displayFieldValue(field, selected);

  return (
    <>
      <Stack.Screen options={{ title: 'Trends' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Pressable style={styles.propertyButton} onPress={() => setPickerOpen(true)}>
            <View style={[styles.dot, { backgroundColor: field.accent }]} />
            <Text style={styles.propertyTitle} numberOfLines={1}>{field.label}</Text>
            <Ionicons name="chevron-down" size={17} color={palette.textSecondary} />
          </Pressable>
          <Text style={styles.propertyMeta}>
            Tap a bar for element details. Use log scale when values span many orders of magnitude.
          </Text>
          <View style={styles.controls}>
            {PERIOD_FILTERS.map((item) => {
              const active = item.id === period;
              return (
                <Pressable key={item.id} onPress={() => setPeriod(item.id)} style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
            <Pressable onPress={() => setLogScale((value) => !value)} style={[styles.chip, logScale && styles.chipActive]}>
              <Text style={[styles.chipText, logScale && styles.chipTextActive]}>Log scale</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat label="known" value={`${knownRows.length}/${rows.length}`} styles={styles} />
          <Stat label="min" value={minRow ? `${minRow.el.symbol} ${displayFieldValue(field, minRow.el)}` : '—'} styles={styles} />
          <Stat label="max" value={maxRow ? `${maxRow.el.symbol} ${displayFieldValue(field, maxRow.el)}` : '—'} styles={styles} />
        </View>

        <View style={styles.chartCard}>
          <View style={styles.axisHeader}>
            <Text style={styles.axisText}>{logScale ? 'log normalized' : 'linear normalized'}</Text>
            <Text style={styles.axisText}>{field.unit ?? 'value'}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator style={styles.chartScroll}>
            <View style={styles.chartInner}>
              {rows.map(({ el, value }) => (
                <TrendBar
                  key={el.number}
                  el={el}
                  value={value}
                  field={field}
                  selected={el.number === selected.number}
                  height={value == null ? 0 : scale.height(value)}
                  styles={styles}
                  onPress={() => setSelectedNumber(el.number)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.detailTop}>
            <ElementTile el={selected} styles={styles} />
            <View style={styles.detailBody}>
              <Text style={styles.detailName}>{selected.name}</Text>
              <Text style={styles.detailMeta}>Group {selected.group} · Period {selected.period} · {CategoryLabels[selected.category]}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.detailValue}>{selectedDisplay}</Text>
            <Text style={styles.detailLabel}>{field.label}</Text>
          </View>
          <Pressable style={styles.openButton} onPress={() => router.push(`/element/${selected.number}`)}>
            <Ionicons name="open-outline" size={16} color={palette.accent} />
            <Text style={styles.openText}>Open {selected.symbol}</Text>
          </Pressable>
        </View>

        <PropertyPicker
          visible={pickerOpen}
          selectedId={field.id}
          styles={styles}
          palette={palette}
          onSelect={(id) => {
            setFieldId(id);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      </ScrollView>
    </>
  );
}

function getScale(values: number[], logScale: boolean) {
  const usable = logScale ? values.filter((value) => value > 0) : values;
  const transformed = usable.map((value) => (logScale ? Math.log10(value) : value));
  const min = transformed.length ? Math.min(...transformed) : 0;
  const max = transformed.length ? Math.max(...transformed) : 1;
  const span = max === min ? 1 : max - min;
  return {
    height(value: number) {
      if (logScale && value <= 0) return 0;
      const transformedValue = logScale ? Math.log10(value) : value;
      const normalized = (transformedValue - min) / span;
      return Math.max(4, Math.min(150, 8 + normalized * 142));
    },
  };
}

function getExtremeRow(rows: Array<{ el: PeriodicElement; value: number }>, mode: 'min' | 'max') {
  return rows.reduce<{ el: PeriodicElement; value: number } | null>((best, row) => {
    if (!best) return row;
    return mode === 'min'
      ? row.value < best.value ? row : best
      : row.value > best.value ? row : best;
  }, null);
}

function displayFieldValue(field: PropertyField, el: PeriodicElement) {
  const display = field.display(el);
  if (!display) return '—';
  if (!field.unit) return display;
  if (display.includes(field.unit) || display.startsWith('$') || display.endsWith('%')) return display;
  return `${display} ${field.unit}`;
}

function Stat({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function TrendBar({
  el,
  value,
  field,
  selected,
  height,
  styles,
  onPress,
}: {
  el: PeriodicElement;
  value: number | null;
  field: PropertyField;
  selected: boolean;
  height: number;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  onPress: () => void;
}) {
  const categoryColor = CategoryColors[el.category];
  const display = displayFieldValue(field, el);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.barCol, pressed && { opacity: 0.65 }]} accessibilityLabel={`${el.name} ${field.label} ${display}`}>
      {value == null ? (
        <Text style={styles.missingDash}>—</Text>
      ) : (
        <View style={[styles.barTrack, selected && styles.selectedBarTrack]}>
          <View style={[styles.barFill, { height, backgroundColor: withAlpha(field.accent, 0.86) }]} />
        </View>
      )}
      <Text style={[styles.symbol, selected && { color: categoryColor }]}>{el.symbol}</Text>
      <Text style={styles.number}>{el.number}</Text>
    </Pressable>
  );
}

function ElementTile({
  el,
  styles,
}: {
  el: PeriodicElement;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
}) {
  const color = CategoryColors[el.category];
  return (
    <View style={[styles.tile, { borderColor: withAlpha(color, 0.55), backgroundColor: withAlpha(color, 0.14) }]}>
      <Text style={[styles.tileNumber, { color }]}>{el.number}</Text>
      <Text style={[styles.tileSymbol, { color }]}>{el.symbol}</Text>
    </View>
  );
}

function PropertyPicker({
  visible,
  selectedId,
  styles,
  palette,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selectedId: string;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  palette: ReturnType<typeof usePalette>;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Graph property</Text>
          <ScrollView>
            {PROPERTY_FIELDS.map((item) => {
              const active = item.id === selectedId;
              return (
                <Pressable key={item.id} onPress={() => onSelect(item.id)} style={styles.propertyRow}>
                  <View style={[styles.dot, { backgroundColor: item.accent }]} />
                  <Text style={[styles.propertyLabel, active && styles.propertyLabelActive]}>{item.label}</Text>
                  {active && <Ionicons name="checkmark" size={18} color={palette.accent} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
