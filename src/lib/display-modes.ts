import type { PeriodicElement } from '@/types/element';
import { fmt, fmtYear } from './format';
import { fmtPercent, fmtUsd } from './format-properties';

export interface DisplayMode {
  id: string;
  label: string;
  /** Short value shown inside each table cell, or null when unknown. */
  cellValue: (el: PeriodicElement) => string | null;
  /** Numeric value used for the heatmap; null means "no heatmap" (category mode). */
  heatValue?: (el: PeriodicElement) => number | null;
  /** Use log scale for the heatmap (wide-range values like density). */
  log?: boolean;
}

const year = (el: PeriodicElement): number | null =>
  el.yearDiscovered === 'Ancient' ? 0 : el.yearDiscovered;

export const DISPLAY_MODES: DisplayMode[] = [
  {
    id: 'categories',
    label: 'Categories',
    cellValue: (el) => fmt(el.atomicMass, 4),
  },
  {
    id: 'mass',
    label: 'Atomic mass',
    cellValue: (el) => fmt(el.atomicMass, 4),
    heatValue: (el) => el.atomicMass,
  },
  {
    id: 'density',
    label: 'Density',
    cellValue: (el) => (el.densityValue == null ? null : fmt(el.densityValue, 3)),
    heatValue: (el) => el.densityValue,
    log: true,
  },
  {
    id: 'electronegativity',
    label: 'Electronegativity',
    cellValue: (el) => (el.electronegativity == null ? null : fmt(el.electronegativity, 2)),
    heatValue: (el) => el.electronegativity,
  },
  {
    id: 'price',
    label: 'Cost / 100g',
    cellValue: (el) => fmtUsd(el.priceUsdPer100g),
    heatValue: (el) => el.priceUsdPer100g,
    log: true,
  },
  {
    id: 'melt',
    label: 'Melting point',
    cellValue: (el) => (el.melt == null ? null : `${Math.round(el.melt)} K`),
    heatValue: (el) => el.melt,
  },
  {
    id: 'boil',
    label: 'Boiling point',
    cellValue: (el) => (el.boil == null ? null : `${Math.round(el.boil)} K`),
    heatValue: (el) => el.boil,
  },
  {
    id: 'thermal',
    label: 'Thermal conductivity',
    cellValue: (el) => (el.thermalConductivity == null ? null : `${fmt(el.thermalConductivity, 3)} W/mK`),
    heatValue: (el) => el.thermalConductivity,
    log: true,
  },
  {
    id: 'sound',
    label: 'Speed of sound',
    cellValue: (el) => (el.speedOfSound == null ? null : `${fmt(el.speedOfSound, 4)} m/s`),
    heatValue: (el) => el.speedOfSound,
  },
  {
    id: 'radius',
    label: 'Atomic radius',
    cellValue: (el) => (el.atomicRadius == null ? null : `${el.atomicRadius} pm`),
    heatValue: (el) => el.atomicRadius,
  },
  {
    id: 'year',
    label: 'Year discovered',
    cellValue: (el) => (el.yearDiscovered == null ? null : fmtYear(el.yearDiscovered)),
    heatValue: year,
  },
  {
    id: 'abundance',
    label: 'Crust abundance',
    cellValue: (el) => fmtPercent(el.abundanceCrust),
    heatValue: (el) => el.abundanceCrust,
    log: true,
  },
  {
    id: 'radioactive',
    label: 'Radioactive',
    cellValue: (el) => (el.radioactive == null ? null : el.radioactive ? 'Yes' : 'Stable'),
  },
  {
    id: 'phase',
    label: 'Phase',
    cellValue: (el) => el.phase,
  },
  {
    id: 'block',
    label: 'Block',
    cellValue: (el) => `${el.block}-block`,
  },
];

/** Min/max of a mode's heat values across all elements, for normalization. */
export function heatRange(mode: DisplayMode, elements: PeriodicElement[]): [number, number] | null {
  if (!mode.heatValue) return null;
  let min = Infinity;
  let max = -Infinity;
  for (const el of elements) {
    const v = mode.heatValue(el);
    if (v == null) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return min === Infinity ? null : [min, max];
}

/** Normalized 0-1 heat for an element under a mode, or null. */
export function heatOf(
  mode: DisplayMode,
  el: PeriodicElement,
  range: [number, number] | null
): number | null {
  if (!mode.heatValue || !range) return null;
  const v = mode.heatValue(el);
  if (v == null) return null;
  let [min, max] = range;
  let value = v;
  if (mode.log) {
    const floor = Math.max(min, 1e-6);
    value = Math.log(Math.max(v, 1e-6) / floor);
    max = Math.log(Math.max(max, 1e-6) / floor);
    min = 0;
  }
  if (max === min) return 1;
  return (value - min) / (max - min);
}
