import { FormulaError, parseFormula } from '@/lib/molar-mass';

type Counts = Record<string, number>;

export interface EquationCompound {
  raw: string;
  formula: string;
  state: string | null;
  counts: Counts;
}

export interface BalancedEquation {
  input: string;
  left: EquationCompound[];
  right: EquationCompound[];
  coefficients: number[];
  equation: string;
  elementTotals: Array<{ symbol: string; left: number; right: number }>;
}

export class EquationError extends Error {}

class Fraction {
  n: bigint;
  d: bigint;

  constructor(n: bigint | number, d: bigint | number = 1) {
    this.n = BigInt(n);
    this.d = BigInt(d);
    if (this.d === 0n) throw new Error('Zero denominator');
    if (this.d < 0n) {
      this.n = -this.n;
      this.d = -this.d;
    }
    const g = gcd(abs(this.n), this.d);
    this.n /= g;
    this.d /= g;
  }

  static zero() {
    return new Fraction(0);
  }

  static one() {
    return new Fraction(1);
  }

  add(other: Fraction) {
    return new Fraction(this.n * other.d + other.n * this.d, this.d * other.d);
  }

  sub(other: Fraction) {
    return new Fraction(this.n * other.d - other.n * this.d, this.d * other.d);
  }

  mul(other: Fraction) {
    return new Fraction(this.n * other.n, this.d * other.d);
  }

  div(other: Fraction) {
    return new Fraction(this.n * other.d, this.d * other.n);
  }

  neg() {
    return new Fraction(-this.n, this.d);
  }

  isZero() {
    return this.n === 0n;
  }
}

const abs = (n: bigint) => (n < 0n ? -n : n);

function gcd(a: bigint, b: bigint): bigint {
  while (b !== 0n) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1n;
}

function lcm(a: bigint, b: bigint): bigint {
  return (a / gcd(abs(a), abs(b))) * b;
}

function parseCompound(raw: string): EquationCompound {
  const trimmed = raw.trim();
  if (!trimmed) throw new EquationError('Empty compound in equation');

  const withoutCoefficient = trimmed.replace(/^\d+\s*/, '');
  const stateMatch = withoutCoefficient.match(/^(.*?)(\((?:aq|s|l|g)\))$/i);
  const formula = (stateMatch ? stateMatch[1] : withoutCoefficient).trim();
  const state = stateMatch ? stateMatch[2] : null;
  if (!formula) throw new EquationError(`Missing formula in ${trimmed}`);

  try {
    const parsed = parseFormula(formula);
    return {
      raw: trimmed,
      formula,
      state,
      counts: Object.fromEntries(parsed.parts.map((part) => [part.symbol, part.count])),
    };
  } catch (error) {
    if (error instanceof FormulaError) throw new EquationError(`${formula}: ${error.message}`);
    throw error;
  }
}

function parseSide(side: string): EquationCompound[] {
  return side.split('+').map(parseCompound);
}

function parseEquation(input: string): Pick<BalancedEquation, 'left' | 'right'> {
  const normalized = input.replace(/[⇌↔]/g, '->').replace(/[=→]/g, '->');
  const pieces = normalized.split('->');
  if (pieces.length !== 2) throw new EquationError('Use one arrow, for example H2 + O2 -> H2O');
  const left = parseSide(pieces[0]);
  const right = parseSide(pieces[1]);
  if (!left.length || !right.length) throw new EquationError('Equation needs reactants and products');
  return { left, right };
}

function rref(matrix: Fraction[][]) {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const pivots: number[] = [];
  let r = 0;

  for (let c = 0; c < cols && r < rows; c++) {
    let pivot = r;
    while (pivot < rows && matrix[pivot][c].isZero()) pivot++;
    if (pivot === rows) continue;

    [matrix[r], matrix[pivot]] = [matrix[pivot], matrix[r]];
    const divisor = matrix[r][c];
    matrix[r] = matrix[r].map((value) => value.div(divisor));

    for (let i = 0; i < rows; i++) {
      if (i === r || matrix[i][c].isZero()) continue;
      const factor = matrix[i][c];
      matrix[i] = matrix[i].map((value, j) => value.sub(factor.mul(matrix[r][j])));
    }

    pivots.push(c);
    r++;
  }

  return pivots;
}

function solveCoefficients(matrix: number[][]): number[] {
  const fractions = matrix.map((row) => row.map((value) => new Fraction(value)));
  const pivots = rref(fractions);
  const cols = fractions[0]?.length ?? 0;
  const free = [...Array(cols).keys()].filter((col) => !pivots.includes(col));
  if (!free.length) throw new EquationError('Could not balance this equation');

  const solution = Array.from({ length: cols }, () => Fraction.zero());
  for (const col of free) solution[col] = Fraction.one();

  pivots.forEach((pivotCol, row) => {
    let sum = Fraction.zero();
    for (const freeCol of free) sum = sum.add(fractions[row][freeCol].mul(solution[freeCol]));
    solution[pivotCol] = sum.neg();
  });

  let commonDenominator = 1n;
  for (const value of solution) commonDenominator = lcm(commonDenominator, value.d);

  let integers = solution.map((value) => Number(value.n * (commonDenominator / value.d)));
  if (integers.every((value) => value <= 0)) integers = integers.map((value) => -value);
  if (integers.some((value) => value < 0) || integers.every((value) => value === 0)) {
    throw new EquationError('Could not find a positive balance for this equation');
  }

  const divisor = integers.reduce((current, value) => Number(gcd(BigInt(Math.abs(current)), BigInt(Math.abs(value)))));
  return integers.map((value) => value / divisor);
}

function formatTerm(compound: EquationCompound, coefficient: number): string {
  const prefix = coefficient === 1 ? '' : `${coefficient}`;
  return `${prefix}${compound.formula}${compound.state ?? ''}`;
}

function totals(compounds: EquationCompound[], coefficients: number[]) {
  const result = new Map<string, number>();
  compounds.forEach((compound, index) => {
    const coefficient = coefficients[index];
    Object.entries(compound.counts).forEach(([symbol, count]) => {
      result.set(symbol, (result.get(symbol) ?? 0) + count * coefficient);
    });
  });
  return result;
}

export function balanceEquation(input: string): BalancedEquation {
  const trimmed = input.trim();
  if (!trimmed) throw new EquationError('Enter a chemical equation');

  const { left, right } = parseEquation(trimmed);
  const compounds = [...left, ...right];
  const elements = [...new Set(compounds.flatMap((compound) => Object.keys(compound.counts)))].sort();
  const matrix = elements.map((symbol) =>
    compounds.map((compound, index) => {
      const sign = index < left.length ? 1 : -1;
      return (compound.counts[symbol] ?? 0) * sign;
    }),
  );
  const coefficients = solveCoefficients(matrix);
  const leftCoefficients = coefficients.slice(0, left.length);
  const rightCoefficients = coefficients.slice(left.length);
  const leftTotals = totals(left, leftCoefficients);
  const rightTotals = totals(right, rightCoefficients);

  return {
    input: trimmed,
    left,
    right,
    coefficients,
    equation: [
      left.map((compound, index) => formatTerm(compound, leftCoefficients[index])).join(' + '),
      right.map((compound, index) => formatTerm(compound, rightCoefficients[index])).join(' + '),
    ].join(' -> '),
    elementTotals: elements.map((symbol) => ({
      symbol,
      left: leftTotals.get(symbol) ?? 0,
      right: rightTotals.get(symbol) ?? 0,
    })),
  };
}
