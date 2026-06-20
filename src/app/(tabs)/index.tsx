import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryPicker } from '@/components/category-picker';
import { CellFieldPicker } from '@/components/cell-field-picker';
import { PeriodicTable, TABLE_HEIGHT, TABLE_WIDTH } from '@/components/periodic-table';
import { Zoomable } from '@/components/zoomable';
import { withAlpha } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { DEFAULT_CELL_FIELD_ID } from '@/lib/cell-fields';
import { DISPLAY_MODES } from '@/lib/display-modes';
import type { ElementCategory } from '@/types/element';

export default function TableScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = usePalette();
  const styles = useThemedStyles((p) => ({
    container: { flex: 1, backgroundColor: p.background },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingBottom: 4,
    },
    headerText: { flex: 1 },
    title: { color: p.text, fontSize: 26, fontWeight: '800' },
    subtitle: { color: p.textTertiary, fontSize: 13, marginTop: 2 },
    headerActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
    headerButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
    },
    headerButtonActive: { backgroundColor: withAlpha(p.accent, 0.18), borderColor: p.accent },
    modeBar: { flexGrow: 0, marginTop: 8 },
    modeBarContent: { paddingHorizontal: 12, gap: 8 },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 18,
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
    },
    chipActive: { backgroundColor: withAlpha(p.accent, 0.18), borderColor: p.accent },
    chipText: { color: p.textSecondary, fontSize: 13, fontWeight: '600' },
    chipTextActive: { color: p.accent },
  }));

  const [modeId, setModeId] = useState('categories');
  const [highlight, setHighlight] = useState<ElementCategory | null>(null);
  const [cellFieldId, setCellFieldId] = useState(DEFAULT_CELL_FIELD_ID);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const mode = DISPLAY_MODES.find((m) => m.id === modeId)!;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Periodic Table</Text>
          <Text style={styles.subtitle}>118 elements</Text>
        </View>
        <View style={styles.headerActions}>
          {modeId === 'categories' && (
            <Pressable
              onPress={() => setCategoryOpen(true)}
              style={[styles.headerButton, highlight && styles.headerButtonActive]}
              accessibilityLabel="Filter by category"
              hitSlop={6}>
              <Ionicons
                name="color-filter-outline"
                size={20}
                color={highlight ? palette.accent : palette.text}
              />
            </Pressable>
          )}
          <Pressable
            onPress={() => setPickerOpen(true)}
            style={styles.headerButton}
            accessibilityLabel="Choose cell detail"
            hitSlop={6}>
            <Ionicons name="options-outline" size={20} color={palette.text} />
          </Pressable>
        </View>
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
          cellFieldId={cellFieldId}
          highlightCategory={modeId === 'categories' ? highlight : null}
          onPressElement={(el) => router.push(`/element/${el.number}`)}
        />
      </Zoomable>

      <CategoryPicker
        visible={categoryOpen}
        selected={highlight}
        onSelect={setHighlight}
        onClose={() => setCategoryOpen(false)}
      />

      <CellFieldPicker
        visible={pickerOpen}
        selectedId={cellFieldId}
        onSelect={setCellFieldId}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}
