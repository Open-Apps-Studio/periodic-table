/**
 * Element quiz: pure question generation for the Quiz screen.
 *
 * A round is QUESTIONS_PER_ROUND multiple-choice questions drawn from an element
 * pool. Distractors come from elements close in atomic number, so "Na" is asked
 * against Mg/Ne/K instead of Uranium, which keeps the quiz honest.
 */
import { CategoryLabels } from '@/constants/theme';
import { ELEMENTS } from '@/data/elements';
import type { ElementCategory, PeriodicElement } from '@/types/element';

export type QuizMode = 'symbol-to-name' | 'name-to-symbol' | 'number-to-element' | 'category';
export type QuizPool = 20 | 36 | 118;

export const QUIZ_MODES: { id: QuizMode; title: string; subtitle: string }[] = [
  { id: 'symbol-to-name', title: 'Symbol → Name', subtitle: 'Fe is… iron' },
  { id: 'name-to-symbol', title: 'Name → Symbol', subtitle: 'Sodium is… Na' },
  { id: 'number-to-element', title: 'Atomic number', subtitle: 'Element 6 is… carbon' },
  { id: 'category', title: 'Element families', subtitle: 'Neon is a… noble gas' },
];

export const QUIZ_POOLS: { id: QuizPool; label: string }[] = [
  { id: 20, label: 'First 20' },
  { id: 36, label: 'First 36' },
  { id: 118, label: 'All 118' },
];

export const QUESTIONS_PER_ROUND = 10;
const OPTION_COUNT = 4;

export interface QuizQuestion {
  element: PeriodicElement;
  prompt: string;
  /** Large text shown above the prompt (a symbol, name, or number). */
  cue: string;
  options: string[];
  answer: string;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Up to `count` elements nearest in atomic number to `target`, excluding it. */
function neighbors(target: PeriodicElement, pool: PeriodicElement[], count: number, random: () => number) {
  const nearest = pool
    .filter((el) => el.number !== target.number)
    .sort((a, b) => Math.abs(a.number - target.number) - Math.abs(b.number - target.number))
    .slice(0, count * 2);
  return shuffle(nearest, random).slice(0, count);
}

const QUIZ_CATEGORIES = (Object.keys(CategoryLabels) as ElementCategory[]).filter((c) => c !== 'unknown');

function buildQuestion(element: PeriodicElement, mode: QuizMode, pool: PeriodicElement[], random: () => number): QuizQuestion {
  if (mode === 'category') {
    const answer = CategoryLabels[element.category];
    const others = shuffle(
      QUIZ_CATEGORIES.filter((c) => c !== element.category),
      random,
    )
      .slice(0, OPTION_COUNT - 1)
      .map((c) => CategoryLabels[c]);
    return {
      element,
      cue: element.name,
      prompt: 'Which family does this element belong to?',
      options: shuffle([answer, ...others], random),
      answer,
    };
  }

  const distractors = neighbors(element, pool, OPTION_COUNT - 1, random);
  const label = (el: PeriodicElement) => (mode === 'name-to-symbol' ? el.symbol : el.name);
  const answer = label(element);
  return {
    element,
    cue: mode === 'symbol-to-name' ? element.symbol : mode === 'name-to-symbol' ? element.name : String(element.number),
    prompt:
      mode === 'symbol-to-name'
        ? 'Which element has this symbol?'
        : mode === 'name-to-symbol'
          ? 'What is the symbol for this element?'
          : 'Which element has this atomic number?',
    options: shuffle([answer, ...distractors.map(label)], random),
    answer,
  };
}

/**
 * Builds one round. Category questions skip elements whose family is unknown
 * (the superheavy 109+), since there's no fair answer for them.
 */
export function buildRound(mode: QuizMode, poolSize: QuizPool, random: () => number = Math.random): QuizQuestion[] {
  const pool = ELEMENTS.filter((el) => el.number <= poolSize);
  const askable = mode === 'category' ? pool.filter((el) => el.category !== 'unknown') : pool;
  return shuffle(askable, random)
    .slice(0, QUESTIONS_PER_ROUND)
    .map((el) => buildQuestion(el, mode, pool, random));
}

/** Storage key for the best score of a mode + pool combination. */
export function bestScoreKey(mode: QuizMode, pool: QuizPool) {
  return `${mode}:${pool}`;
}
