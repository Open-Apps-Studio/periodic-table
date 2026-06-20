import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORY_ORDER, CategoryColors, CategoryLabels, withAlpha } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import type { ElementCategory } from '@/types/element';

interface CategoryPickerProps {
  visible: boolean;
  selected: ElementCategory | null;
  onSelect: (cat: ElementCategory | null) => void;
  onClose: () => void;
}

export function CategoryPicker({ visible, selected, onSelect, onClose }: CategoryPickerProps) {
  const insets = useSafeAreaInsets();
  const palette = usePalette();
  const styles = useThemedStyles((p) => ({
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: withAlpha('#000000', 0.45),
    },
    sheet: {
      backgroundColor: p.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: p.border,
      marginTop: 10,
      marginBottom: 6,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    title: { color: p.text, fontSize: 17, fontWeight: '800' },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: p.surfaceRaised,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      paddingBottom: 8,
      gap: 8,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      width: '47%',
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 12,
      borderWidth: 1,
    },
    dot: { width: 10, height: 10, borderRadius: 5 },
    label: { flex: 1, color: p.textSecondary, fontSize: 13, fontWeight: '600' },
    labelActive: { color: p.text, fontWeight: '800' },
  }));

  const pick = (cat: ElementCategory | null) => {
    onSelect(cat);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}
          onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Categories:</Text>
            <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
              <Ionicons name="close" size={18} color={palette.textSecondary} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {CATEGORY_ORDER.map((cat) => {
                const color = CategoryColors[cat];
                const active = selected === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => pick(active ? null : cat)}
                    style={[
                      styles.item,
                      {
                        borderColor: withAlpha(color, active ? 0.7 : 0.3),
                        backgroundColor: withAlpha(color, active ? 0.25 : 0.08),
                      },
                    ]}>
                    <View style={[styles.dot, { backgroundColor: color }]} />
                    <Text style={[styles.label, active && styles.labelActive]} numberOfLines={2}>
                      {CategoryLabels[cat]}
                    </Text>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={() => pick(null)}
                style={[
                  styles.item,
                  {
                    borderColor: withAlpha(palette.textTertiary, selected === null ? 0.7 : 0.3),
                    backgroundColor: withAlpha(palette.textTertiary, selected === null ? 0.15 : 0.06),
                  },
                ]}>
                <View style={[styles.dot, { backgroundColor: palette.textTertiary }]} />
                <Text style={[styles.label, selected === null && styles.labelActive]}>All elements</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
