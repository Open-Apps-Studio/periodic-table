import { getElementBySymbol } from '@/data/elements';

export interface FormulaPart {
  symbol: string;
  name: string;
  count: number;
  atomicMass: number;
  /** count * atomicMass */
  mass: number;
  /** Mass percent of the whole formula, 0-100. */
  percent: number;
}

export interface MolarMassResult {
  formula: string;
  molarMass: number;
  parts: FormulaPart[];
}

export class FormulaError extends Error {}

type Counts = Map<string, number>;

function addCounts(target: Counts, source: Counts, multiplier: number) {
  for (const [symbol, count] of source) {
    target.set(symbol, (target.get(symbol) ?? 0) + count * multiplier);
  }
}

/**
 * Parses a chemical formula like `H2SO4`, `Ca(OH)2`, `[Cu(NH3)4]SO4` or the
 * hydrate `CuSO4·5H2O` (also accepts `.` or `*` as the hydrate dot).
 */
export function parseFormula(input: string): MolarMassResult {
  const formula = input.replace(/\s+/g, '');
  if (!formula) throw new FormulaError('Enter a formula');

  // Hydrate / adduct segments: CuSO4·5H2O -> CuSO4 + 5×(H2O)
  const segments = formula.split(/[·.*]/);
  const total: Counts = new Map();

  for (const rawSegment of segments) {
    if (!rawSegment) throw new FormulaError('Empty segment around the dot');
    const coefMatch = rawSegment.match(/^(\d+)/);
    const coefficient = coefMatch ? Number(coefMatch[1]) : 1;
    const segment = coefMatch ? rawSegment.slice(coefMatch[1].length) : rawSegment;
    addCounts(total, parseGroup(segment), coefficient);
  }

  let molarMass = 0;
  const parts: FormulaPart[] = [];
  for (const [symbol, count] of total) {
    const el = getElementBySymbol(symbol);
    if (!el) throw new FormulaError(`Unknown element: ${symbol}`);
    const mass = el.atomicMass * count;
    molarMass += mass;
    parts.push({ symbol: el.symbol, name: el.name, count, atomicMass: el.atomicMass, mass, percent: 0 });
  }
  for (const part of parts) part.percent = (part.mass / molarMass) * 100;
  parts.sort((a, b) => b.mass - a.mass);

  return { formula: input.trim(), molarMass, parts };
}

function parseGroup(segment: string): Counts {
  // Stack of counts per nesting level.
  const stack: Counts[] = [new Map()];
  let i = 0;

  const readNumber = () => {
    let digits = '';
    while (i < segment.length && /\d/.test(segment[i])) digits += segment[i++];
    return digits ? Number(digits) : 1;
  };

  while (i < segment.length) {
    const ch = segment[i];
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(new Map());
      i++;
    } else if (ch === ')' || ch === ']' || ch === '}') {
      if (stack.length === 1) throw new FormulaError(`Unmatched ${ch}`);
      const group = stack.pop()!;
      i++;
      addCounts(stack[stack.length - 1], group, readNumber());
    } else if (/[A-Z]/.test(ch)) {
      let symbol = ch;
      i++;
      while (i < segment.length && /[a-z]/.test(segment[i])) symbol += segment[i++];
      if (!getElementBySymbol(symbol)) throw new FormulaError(`Unknown element: ${symbol}`);
      const count = readNumber();
      const top = stack[stack.length - 1];
      top.set(symbol, (top.get(symbol) ?? 0) + count);
    } else {
      throw new FormulaError(`Unexpected character: ${ch}`);
    }
  }

  if (stack.length > 1) throw new FormulaError('Unclosed parenthesis');
  if (stack[0].size === 0) throw new FormulaError('Enter a formula');
  return stack[0];
}
