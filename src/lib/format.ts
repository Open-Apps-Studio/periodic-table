/** Round to a sensible number of digits for display. */
export function fmt(value: number | null | undefined, digits = 3): string {
  if (value == null) return '—';
  if (Number.isInteger(value)) return String(value);
  return value.toPrecision(Math.max(digits, String(Math.trunc(Math.abs(value))).length));
}

const oneDecimal = (n: number): string => {
  const cents = Math.round(n * 100);
  if (cents === 0) return '0';
  if (cents % 100 === 0) return (cents / 100).toFixed(0);
  if (cents % 10 === 0) return (cents / 100).toFixed(1);
  return (cents / 100).toFixed(2);
};

/** Temperatures are stored in Kelvin; show all three common scales like the reference apps. */
export function fmtKelvin(k: number | null | undefined): string {
  if (k == null) return '—';
  const c = k - 273.15;
  const f = c * 1.8 + 32;
  return `${fmt(k, 4)} K · ${oneDecimal(c)} °C · ${oneDecimal(f)} °F`;
}

/** Compact K (°C) form for tight layouts like the side-by-side compare table. */
export function fmtKelvinShort(k: number | null | undefined): string {
  if (k == null) return '—';
  const c = k - 273.15;
  return `${fmt(k, 4)} K (${oneDecimal(c)} °C)`;
}

export function fmtYear(year: number | 'Ancient' | null): string {
  if (year == null) return '—';
  if (year === 'Ancient') return 'Ancient';
  return year < 0 ? `${-year} BC` : String(year);
}
