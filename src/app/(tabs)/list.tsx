import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryColors, withAlpha } from '@/constants/theme';
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

export default function PropertyListScreen() {
  const router = useRouter();
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles((p) => ({
    container: { flex: 1, backgroundColor: p.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 6,
    },
    fieldButton: { flex: 1, minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 10 },
    fieldDot: { width: 10, height: 10, borderRadius: 5 },
    fieldLabel: { flex: 1, color: p.text, fontSize: 15, fontWeight: '800' },
    iconButton: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
    },
    listContent: { paddingBottom: Math.max(insets.bottom, 14) + 74 },
    row: {
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: p.border,
    },
    miniCell: {
      width: 72,
      minHeight: 54,
      borderRightWidth: 2,
      justifyContent: 'center',
      paddingRight: 8,
    },
    number: { color: p.textTertiary, fontSize: 11, fontWeight: '700' },
    symbol: { color: p.text, fontSize: 24, fontWeight: '900', lineHeight: 27 },
    name: { color: p.textSecondary, fontSize: 11.5, fontWeight: '700' },
    valueWrap: { flex: 1, minHeight: 40, justifyContent: 'center' },
    valueBarTrack: {
      height: 28,
      borderRadius: 8,
      backgroundColor: p.surfaceRaised,
      overflow: 'hidden',
      justifyContent: 'center',
    },
    valueBar: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 8 },
    valueText: { color: p.text, fontSize: 16, fontWeight: '900', paddingHorizontal: 10 },
    unitText: { color: p.textSecondary, fontSize: 12.5, fontWeight: '700' },
    chevron: { width: 18, alignItems: 'flex-end' },
    emptyValue: { color: p.textTertiary, fontSize: 15, fontWeight: '800' },
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

  const [fieldId, setFieldId] = useState(DEFAULT_PROPERTY_FIELD_ID);
  const [ascending, setAscending] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const field = getPropertyField(fieldId);

  const rows = useMemo(() => {
    const withValues = ELEMENTS.map((el) => ({ el, value: field.value(el) }));
    return withValues.sort((a, b) => {
      if (a.value == null && b.value == null) return a.el.number - b.el.number;
      if (a.value == null) return 1;
      if (b.value == null) return -1;
      return ascending ? a.value - b.value : b.value - a.value;
    });
  }, [ascending, field]);

  const max = useMemo(() => {
    const values = rows.map((row) => row.value).filter((value): value is number => value != null);
    return values.length ? Math.max(...values.map((value) => Math.abs(value))) : 1;
  }, [rows]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => setPickerOpen(true)} style={styles.fieldButton}>
          <View style={[styles.fieldDot, { backgroundColor: field.accent }]} />
          <Text style={styles.fieldLabel} numberOfLines={1}>
            {field.label}
          </Text>
          <Ionicons name="chevron-down" size={16} color={palette.textSecondary} />
        </Pressable>
        <Pressable
          onPress={() => setAscending((value) => !value)}
          style={styles.iconButton}
          accessibilityLabel="Change sort direction">
          <Ionicons name={ascending ? 'filter-outline' : 'filter'} size={20} color={palette.text} />
        </Pressable>
      </View>

      <FlatList
        data={rows}
        keyExtractor={({ el }) => String(el.number)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PropertyRow
            el={item.el}
            field={field}
            value={item.value}
            max={max}
            styles={styles}
            onPress={() => router.push(`/element/${item.el.number}`)}
          />
        )}
      />

      <PropertyPicker
        visible={pickerOpen}
        selectedId={fieldId}
        styles={styles}
        palette={palette}
        onSelect={(id) => {
          setFieldId(id);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}

function PropertyRow({
  el,
  field,
  value,
  max,
  styles,
  onPress,
}: {
  el: PeriodicElement;
  field: PropertyField;
  value: number | null;
  max: number;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  onPress: () => void;
}) {
  const color = CategoryColors[el.category];
  const width = value == null ? '0%' : `${Math.max(3, Math.min(100, (Math.abs(value) / max) * 100))}%`;
  const display = field.display(el);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
      <View style={[styles.miniCell, { borderRightColor: color }]}>
        <Text style={styles.number}>{el.number}</Text>
        <Text style={styles.symbol}>{el.symbol}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {el.name}
        </Text>
      </View>
      <View style={styles.valueWrap}>
        {display ? (
          <View style={styles.valueBarTrack}>
            <View style={[styles.valueBar, { width, backgroundColor: withAlpha(field.accent, 0.74) }]} />
            <Text style={styles.valueText} numberOfLines={1}>
              {display} {field.unit ? <Text style={styles.unitText}>{field.unit}</Text> : null}
            </Text>
          </View>
        ) : (
          <Text style={styles.emptyValue}>—</Text>
        )}
      </View>
      <View style={styles.chevron}>
        <Ionicons name="chevron-forward" size={17} color={withAlpha('#687385', 0.7)} />
      </View>
    </Pressable>
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
          <Text style={styles.sheetTitle}>Select property</Text>
          <FlatList
            data={PROPERTY_FIELDS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const active = item.id === selectedId;
              return (
                <Pressable onPress={() => onSelect(item.id)} style={styles.propertyRow}>
                  <View style={[styles.fieldDot, { backgroundColor: item.accent }]} />
                  <Text style={[styles.propertyLabel, active && styles.propertyLabelActive]}>
                    {item.label}
                  </Text>
                  {active && <Ionicons name="checkmark" size={18} color={palette.accent} />}
                </Pressable>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
