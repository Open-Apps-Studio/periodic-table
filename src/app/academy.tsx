import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { withAlpha } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { ACADEMY_LESSONS, CATEGORY_LABELS, type AcademyLesson } from '@/data/learning';
import { useThemedStyles } from '@/hooks/use-themed-styles';

export default function AcademyScreen() {
  const palette = usePalette();
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(ACADEMY_LESSONS[0]?.id ?? '');
  const styles = useThemedStyles((p) => ({
    container: { flex: 1, backgroundColor: p.background },
    content: { padding: 14, gap: 10, paddingBottom: 28 },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
    },
    input: { flex: 1, color: p.text, fontSize: 15, paddingVertical: 11 },
    statRow: { flexDirection: 'row', gap: 8 },
    stat: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: p.border,
      backgroundColor: p.surface,
      padding: 10,
      gap: 2,
    },
    statValue: { color: p.text, fontSize: 17, fontWeight: '900' },
    statLabel: { color: p.textTertiary, fontSize: 11.5, fontWeight: '800' },
    lesson: {
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
      borderRadius: 14,
      padding: 12,
      gap: 10,
    },
    lessonActive: { borderColor: withAlpha(p.accent, 0.55), backgroundColor: withAlpha(p.accent, 0.08) },
    lessonTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconDisc: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    titleBody: { flex: 1, gap: 2 },
    title: { color: p.text, fontSize: 16, fontWeight: '900' },
    category: { color: p.textTertiary, fontSize: 12, fontWeight: '800' },
    summary: { color: p.textSecondary, fontSize: 13.5, lineHeight: 20 },
    keyList: { gap: 7 },
    keyRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
    bullet: { width: 7, height: 7, borderRadius: 4, marginTop: 6 },
    keyText: { color: p.textSecondary, fontSize: 13, lineHeight: 19, flex: 1 },
    example: {
      color: p.text,
      fontSize: 12.5,
      lineHeight: 18,
      backgroundColor: p.surfaceRaised,
      borderRadius: 10,
      padding: 9,
      fontWeight: '700',
    },
    checkCard: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: withAlpha(p.accent, 0.34),
      backgroundColor: withAlpha(p.accent, 0.1),
      padding: 10,
      gap: 5,
    },
    checkLabel: { color: p.accent, fontSize: 12, fontWeight: '900' },
    checkText: { color: p.text, fontSize: 13, lineHeight: 19, fontWeight: '800' },
    answer: { color: p.textSecondary, fontSize: 12.5, lineHeight: 18 },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    tag: { borderRadius: 9, borderWidth: 1, borderColor: p.border, paddingHorizontal: 7, paddingVertical: 3 },
    tagText: { color: p.textTertiary, fontSize: 11.5, fontWeight: '800' },
    empty: { color: p.textTertiary, textAlign: 'center', marginTop: 42, fontSize: 14 },
  }));

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ACADEMY_LESSONS;
    return ACADEMY_LESSONS.filter((lesson) =>
      [lesson.title, CATEGORY_LABELS[lesson.category], lesson.summary, lesson.example, lesson.keyIdeas.join(' '), lesson.tags.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  return (
    <>
      <Stack.Screen options={{ title: 'Academy' }} />
      <View style={styles.container}>
        <FlatList
          data={rows}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color={palette.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="Search trends, ions, bonding..."
                  placeholderTextColor={palette.textTertiary}
                  value={query}
                  onChangeText={setQuery}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.statRow}>
                <Stat value={String(ACADEMY_LESSONS.length)} label="lessons" styles={styles} />
                <Stat value={String(ACADEMY_LESSONS.reduce((sum, lesson) => sum + lesson.keyIdeas.length, 0))} label="key ideas" styles={styles} />
                <Stat value={String(ACADEMY_LESSONS.length)} label="quick checks" styles={styles} />
              </View>
            </>
          }
          renderItem={({ item }) => (
            <LessonRow
              lesson={item}
              open={item.id === openId}
              styles={styles}
              onPress={() => setOpenId(item.id === openId ? '' : item.id)}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No academy cards match your search.</Text>}
        />
      </View>
    </>
  );
}

function Stat({
  value,
  label,
  styles,
}: {
  value: string;
  label: string;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function LessonRow({
  lesson,
  open,
  styles,
  onPress,
}: {
  lesson: AcademyLesson;
  open: boolean;
  styles: ReturnType<typeof useThemedStyles<Record<string, object>>>;
  onPress: () => void;
}) {
  const color = colorForLesson(lesson.category);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.lesson, open && styles.lessonActive, pressed && { opacity: 0.66 }]}>
      <View style={styles.lessonTop}>
        <View style={[styles.iconDisc, { backgroundColor: withAlpha(color, 0.16) }]}>
          <Ionicons name={iconForLesson(lesson.category)} size={18} color={color} />
        </View>
        <View style={styles.titleBody}>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.category}>{CATEGORY_LABELS[lesson.category]}</Text>
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={17} color="#7B8794" />
      </View>
      <Text style={styles.summary}>{lesson.summary}</Text>
      {open && (
        <>
          <View style={styles.keyList}>
            {lesson.keyIdeas.map((idea) => (
              <View key={idea} style={styles.keyRow}>
                <View style={[styles.bullet, { backgroundColor: color }]} />
                <Text style={styles.keyText}>{idea}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.example}>{lesson.example}</Text>
          <View style={styles.checkCard}>
            <Text style={styles.checkLabel}>Quick check</Text>
            <Text style={styles.checkText}>{lesson.check.prompt}</Text>
            <Text style={styles.answer}>{lesson.check.answer}</Text>
          </View>
          <View style={styles.tagRow}>
            {lesson.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </Pressable>
  );
}

function colorForLesson(category: AcademyLesson['category']) {
  if (category === 'periodic-table') return '#2F9E44';
  if (category === 'bonding') return '#7950F2';
  if (category === 'reactions') return '#E8590C';
  if (category === 'solutions') return '#0B7285';
  if (category === 'nuclear') return '#495057';
  return '#228BE6';
}

function iconForLesson(category: AcademyLesson['category']): keyof typeof Ionicons.glyphMap {
  if (category === 'periodic-table') return 'grid-outline';
  if (category === 'bonding') return 'git-network-outline';
  if (category === 'reactions') return 'flask-outline';
  if (category === 'solutions') return 'water-outline';
  if (category === 'nuclear') return 'radio-outline';
  return 'school-outline';
}
