import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withAlpha } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { CELL_FIELD_SECTIONS } from '@/lib/cell-fields';

interface CellFieldPickerProps {
  visible: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function CellFieldPicker({ visible, selectedId, onSelect, onClose }: CellFieldPickerProps) {
  const insets = useSafeAreaInsets();
  const palette = usePalette();
  const styles = useThemedStyles((p) => ({
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: withAlpha('#000000', 0.45),
    },
    sheet: {
      maxHeight: '82%',
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
      borderBottomWidth: 1,
      borderBottomColor: p.border,
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
    scroll: { paddingHorizontal: 16 },
    sectionTitle: {
      color: p.text,
      fontSize: 15,
      fontWeight: '800',
      marginTop: 18,
      marginBottom: 6,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 44,
      borderBottomWidth: 1,
      borderBottomColor: p.border,
    },
    accentBar: { width: 3, height: 22, borderRadius: 2, marginRight: 12 },
    rowLabel: { flex: 1, color: p.textSecondary, fontSize: 14.5, fontWeight: '600' },
    rowLabelActive: { color: p.text, fontWeight: '800' },
    check: { marginLeft: 8 },
  }));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}
          onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Cell detail</Text>
            <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
              <Ionicons name="close" size={18} color={palette.textSecondary} />
            </Pressable>
          </View>
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator>
            {CELL_FIELD_SECTIONS.map((section) => (
              <View key={section.title}>
                <Text style={styles.sectionTitle}>{section.title}:</Text>
                {section.fields.map((field) => {
                  const active = field.id === selectedId;
                  return (
                    <Pressable
                      key={field.id}
                      onPress={() => {
                        onSelect(field.id);
                        onClose();
                      }}
                      style={styles.row}>
                      <View style={[styles.accentBar, { backgroundColor: field.accent }]} />
                      <Text style={[styles.rowLabel, active && styles.rowLabelActive]}>{field.label}</Text>
                      {active && <Ionicons name="checkmark" size={18} color={palette.accent} style={styles.check} />}
                    </Pressable>
                  );
                })}
              </View>
            ))}
            <View style={{ height: 24 }} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
