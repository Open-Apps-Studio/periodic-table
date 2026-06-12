/** Round to a sensible number of digits for display. */
export function fmt(value: number | null | undefined, digits = 3): string {
  if (value == null) return '—';
  if (Number.isInteger(value)) return String(value);
  return value.toPrecision(Math.max(digits, String(Math.trunc(Math.abs(value))).length));
}

export function fmtKelvin(k: number | null | undefined): string {
  if (k == null) return '—';
  const c = k - 273.15;
  return `${fmt(k, 4)} K  (${c.toFixed(c % 1 === 0 ? 0 : 1)} °C)`;
}

export function fmtYear(year: number | 'Ancient' | null): string {
  if (year == null) return '—';
  if (year === 'Ancient') return 'Ancient';
  return year < 0 ? `${-year} BC` : String(year);
}
