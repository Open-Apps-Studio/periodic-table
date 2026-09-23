import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { CategoryColors, withAlpha } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import {
  bestScoreKey,
  buildRound,
  QUESTIONS_PER_ROUND,
  QUIZ_MODES,
  QUIZ_POOLS,
  type QuizMode,
  type QuizPool,
  type QuizQuestion,
} from '@/lib/quiz';

const BEST_SCORES_KEY = 'quiz-best-scores-v1';
const CORRECT = '#2F9E44';

type Phase = 'setup' | 'playing' | 'done';

export default function QuizScreen() {
  const router = useRouter();
  const palette = usePalette();
  const [mode, setMode] = useState<QuizMode>('symbol-to-name');
  const [pool, setPool] = useState<QuizPool>(20);
  const [phase, setPhase] = useState<Phase>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [missed, setMissed] = useState<QuizQuestion[]>([]);
  const [best, setBest] = useState<Record<string, number>>({});

  useEffect(() => {
    AsyncStorage.getItem(BEST_SCORES_KEY)
      .then((raw) => raw && setBest(JSON.parse(raw)))
      .catch(() => {});
  }, []);

  const styles = useThemedStyles((p) => ({
    container: { flex: 1, backgroundColor: p.background },
    content: { padding: 16, gap: 12, paddingBottom: 40 },
    sectionLabel: { color: p.textTertiary, fontSize: 12, fontWeight: '900', textTransform: 'uppercase', marginTop: 6 },
    modeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
      borderRadius: 14,
      padding: 14,
    },
    selected: { borderColor: p.accent, backgroundColor: withAlpha(p.accent, 0.1) },
    modeBody: { flex: 1, gap: 2 },
    modeTitle: { color: p.text, fontSize: 16, fontWeight: '900' },
    modeSubtitle: { color: p.textSecondary, fontSize: 13 },
    bestText: { color: p.textTertiary, fontSize: 12, fontWeight: '800' },
    poolRow: { flexDirection: 'row', gap: 8 },
    poolChip: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 11,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: p.border,
      backgroundColor: p.surface,
    },
    poolText: { color: p.text, fontSize: 14, fontWeight: '800' },
    primary: {
      marginTop: 8,
      backgroundColor: p.accent,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
    },
    primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
    progressTrack: { height: 6, borderRadius: 3, backgroundColor: p.surfaceRaised, overflow: 'hidden' },
    progressFill: { height: 6, borderRadius: 3, backgroundColor: p.accent },
    counter: { color: p.textTertiary, fontSize: 13, fontWeight: '800' },
    cueCard: {
      alignItems: 'center',
      gap: 8,
      paddingVertical: 28,
      borderRadius: 18,
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
    },
    cue: { color: p.text, fontSize: 52, fontWeight: '900' },
    prompt: { color: p.textSecondary, fontSize: 15, fontWeight: '700', textAlign: 'center', paddingHorizontal: 16 },
    option: {
      backgroundColor: p.surface,
      borderWidth: 1.5,
      borderColor: p.border,
      borderRadius: 14,
      paddingVertical: 15,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    optionText: { color: p.text, fontSize: 17, fontWeight: '800', flexShrink: 1 },
    scoreCard: {
      alignItems: 'center',
      gap: 6,
      paddingVertical: 26,
      borderRadius: 18,
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
    },
    score: { color: p.text, fontSize: 48, fontWeight: '900' },
    scoreLabel: { color: p.textSecondary, fontSize: 15, fontWeight: '700' },
    missRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
      borderRadius: 12,
      padding: 10,
    },
    missSymbol: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    missSymbolText: { fontSize: 18, fontWeight: '900' },
    missBody: { flex: 1, gap: 2 },
    missName: { color: p.text, fontSize: 15, fontWeight: '800' },
    missDetail: { color: p.textSecondary, fontSize: 12.5 },
    secondary: { alignItems: 'center', paddingVertical: 12 },
    secondaryText: { color: p.accent, fontSize: 15, fontWeight: '800' },
  }));

  const start = () => {
    setQuestions(buildRound(mode, pool));
    setIndex(0);
    setPicked(null);
    setMissed([]);
    setPhase('playing');
  };

  const current = questions[index];
  const score = questions.length - missed.length;

  const choose = (option: string) => {
    if (picked || !current) return;
    setPicked(option);
    if (option !== current.answer) setMissed((m) => [...m, current]);
  };

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setPicked(null);
      return;
    }
    const key = bestScoreKey(mode, pool);
    if (score > (best[key] ?? -1)) {
      const updated = { ...best, [key]: score };
      setBest(updated);
      AsyncStorage.setItem(BEST_SCORES_KEY, JSON.stringify(updated)).catch(() => {});
    }
    setPhase('done');
  };

  if (phase === 'playing' && current) {
    return (
      <>
        <Stack.Screen options={{ title: QUIZ_MODES.find((m) => m.id === mode)?.title ?? 'Quiz' }} />
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${((index + (picked ? 1 : 0)) / questions.length) * 100}%` }]} />
          </View>
          <Text style={styles.counter}>
            Question {index + 1} of {questions.length}
          </Text>
          <View style={styles.cueCard}>
            <Text style={styles.cue} maxFontSizeMultiplier={1.2} adjustsFontSizeToFit numberOfLines={1}>
              {current.cue}
            </Text>
            <Text style={styles.prompt}>{current.prompt}</Text>
          </View>
          {current.options.map((option) => {
            const isAnswer = option === current.answer;
            const isWrongPick = picked === option && !isAnswer;
            const reveal = picked !== null;
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ disabled: reveal, selected: picked === option }}
                onPress={() => choose(option)}
                style={({ pressed }) => [
                  styles.option,
                  reveal && isAnswer && { borderColor: CORRECT, backgroundColor: withAlpha(CORRECT, 0.14) },
                  isWrongPick && { borderColor: palette.danger, backgroundColor: withAlpha(palette.danger, 0.12) },
                  pressed && !reveal && { opacity: 0.7 },
                ]}>
                <Text style={styles.optionText}>{option}</Text>
                {reveal && isAnswer && <Ionicons name="checkmark-circle" size={22} color={CORRECT} />}
                {isWrongPick && <Ionicons name="close-circle" size={22} color={palette.danger} />}
              </Pressable>
            );
          })}
          {picked && (
            <Pressable accessibilityRole="button" style={styles.primary} onPress={next}>
              <Text style={styles.primaryText}>{index + 1 < questions.length ? 'Next' : 'See results'}</Text>
            </Pressable>
          )}
        </ScrollView>
      </>
    );
  }

  if (phase === 'done') {
    const bestScore = best[bestScoreKey(mode, pool)] ?? score;
    return (
      <>
        <Stack.Screen options={{ title: 'Results' }} />
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <View style={styles.scoreCard}>
            <Text style={styles.score}>
              {score}/{questions.length}
            </Text>
            <Text style={styles.scoreLabel}>
              {score === questions.length ? 'Perfect round!' : `Best: ${bestScore}/${QUESTIONS_PER_ROUND}`}
            </Text>
          </View>
          {missed.length > 0 && <Text style={styles.sectionLabel}>Review these</Text>}
          {missed.map((q) => (
            <Pressable
              key={q.element.number}
              accessibilityRole="button"
              accessibilityLabel={`View ${q.element.name} details. Correct answer was ${q.answer}`}
              onPress={() => router.push(`/element/${q.element.number}`)}
              style={({ pressed }) => [styles.missRow, pressed && { opacity: 0.7 }]}>
              <View style={[styles.missSymbol, { backgroundColor: withAlpha(CategoryColors[q.element.category], 0.16) }]}>
                <Text style={[styles.missSymbolText, { color: CategoryColors[q.element.category] }]}>{q.element.symbol}</Text>
              </View>
              <View style={styles.missBody}>
                <Text style={styles.missName}>
                  {q.element.number}. {q.element.name}
                </Text>
                <Text style={styles.missDetail}>Answer: {q.answer}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.textTertiary} />
            </Pressable>
          ))}
          <Pressable accessibilityRole="button" style={styles.primary} onPress={start}>
            <Text style={styles.primaryText}>Play again</Text>
          </Pressable>
          <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => setPhase('setup')}>
            <Text style={styles.secondaryText}>Change quiz</Text>
          </Pressable>
        </ScrollView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Element Quiz' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Quiz type</Text>
        {QUIZ_MODES.map((m) => {
          const bestScore = best[bestScoreKey(m.id, pool)];
          return (
            <Pressable
              key={m.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: mode === m.id }}
              onPress={() => setMode(m.id)}
              style={[styles.modeCard, mode === m.id && styles.selected]}>
              <View style={styles.modeBody}>
                <Text style={styles.modeTitle}>{m.title}</Text>
                <Text style={styles.modeSubtitle}>{m.subtitle}</Text>
              </View>
              {bestScore !== undefined && (
                <Text style={styles.bestText}>
                  Best {bestScore}/{QUESTIONS_PER_ROUND}
                </Text>
              )}
              <Ionicons
                name={mode === m.id ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={mode === m.id ? palette.accent : palette.textTertiary}
              />
            </Pressable>
          );
        })}
        <Text style={styles.sectionLabel}>Elements</Text>
        <View style={styles.poolRow}>
          {QUIZ_POOLS.map((p) => (
            <Pressable
              key={p.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: pool === p.id }}
              onPress={() => setPool(p.id)}
              style={[styles.poolChip, pool === p.id && styles.selected]}>
              <Text style={styles.poolText}>{p.label}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable accessibilityRole="button" style={styles.primary} onPress={start}>
          <Text style={styles.primaryText}>Start {QUESTIONS_PER_ROUND} questions</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}
