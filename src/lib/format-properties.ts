import { fmt } from './format';

/** Compact scientific notation for tiny/huge property values in table cells. */
export function fmtSci(value: number | null | undefined, sig = 2): string | null {
  if (value == null) return null;
  if (value === 0) return '0';
  const exp = Math.floor(Math.log10(Math.abs(value)));
  const mantissa = value / 10 ** exp;
  return `${mantissa.toFixed(sig)}e${exp}`;
}

/** Human-readable duration from seconds (half-life, lifetime). */
export function fmtDuration(seconds: number): string {
  const units = [
    [3.1536e7, 'y'],
    [86400, 'd'],
    [3600, 'h'],
    [60, 'm'],
    [1, 's'],
  ] as const;
  for (const [size, label] of units) {
    if (seconds >= size) {
      const v = seconds / size;
      return v >= 100 ? `${v.toExponential(2)} ${label}` : `${fmt(v, 3)} ${label}`;
    }
  }
  return `${fmt(seconds, 3)} s`;
}

export function fmtPm(value: number | null | undefined): string | null {
  return value == null ? null : `${value} pm`;
}

export function fmtGpa(value: number | null | undefined): string | null {
  return value == null ? null : `${fmt(value, 3)} GPa`;
}

export function fmtMolarVolume(value: number | null | undefined): string | null {
  if (value == null) return null;
  return `${fmtSci(value, 2)} m³/mol`;
}

export function fmtResistivity(value: number | null | undefined): string | null {
  if (value == null) return null;
  return `${fmtSci(value, 2)} Ω·m`;
}

export function fmtSusceptibility(value: number | null | undefined): string | null {
  if (value == null) return null;
  return fmtSci(value, 2);
}

export function fmtUsd(value: number | null | undefined): string | null {
  if (value == null) return null;
  if (value >= 1000) return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  if (value >= 10) return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 3 })}`;
}

export function fmtPercent(value: number | null | undefined): string | null {
  if (value == null) return null;
  return `${fmt(value, 3)}%`;
}

export function displayAtomicRadius(el: {
  empiricalRadius: number | null;
  calculatedRadius: number | null;
  atomicRadius: number | null;
}): string | null {
  return fmtPm(el.empiricalRadius ?? el.calculatedRadius ?? el.atomicRadius);
}

export function displayVanDerWaalsRadius(el: {
  vanDerWaalsRadius: number | null;
  atomicRadius: number | null;
}): string | null {
  return fmtPm(el.vanDerWaalsRadius ?? el.atomicRadius);
}
