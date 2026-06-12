import type { ElementCategory } from '@/types/element';

export const Palette = {
  background: '#0C1016',
  surface: '#151B24',
  surfaceRaised: '#1C2430',
  border: '#27313F',
  text: '#F1F5F9',
  textSecondary: '#93A1B5',
  textTertiary: '#5C6B80',
  accent: '#4DABF7',
  danger: '#FF6B6B',
} as const;

export const CategoryColors: Record<ElementCategory, string> = {
  'alkali-metal': '#FF6B6B',
  'alkaline-earth-metal': '#FFA94D',
  'transition-metal': '#FFD43B',
  'post-transition-metal': '#69DB7C',
  metalloid: '#38D9A9',
  nonmetal: '#4DABF7',
  halogen: '#748FFC',
  'noble-gas': '#DA77F2',
  lanthanide: '#F783AC',
  actinide: '#B197FC',
  unknown: '#868E96',
};

export const CategoryLabels: Record<ElementCategory, string> = {
  'alkali-metal': 'Alkali metal',
  'alkaline-earth-metal': 'Alkaline earth metal',
  'transition-metal': 'Transition metal',
  'post-transition-metal': 'Post-transition metal',
  metalloid: 'Metalloid',
  nonmetal: 'Nonmetal',
  halogen: 'Halogen',
  'noble-gas': 'Noble gas',
  lanthanide: 'Lanthanide',
  actinide: 'Actinide',
  unknown: 'Unknown',
};

export const CATEGORY_ORDER: ElementCategory[] = [
  'alkali-metal',
  'alkaline-earth-metal',
  'transition-metal',
  'post-transition-metal',
  'metalloid',
  'nonmetal',
  'halogen',
  'noble-gas',
  'lanthanide',
  'actinide',
  'unknown',
];

/** Hex color + alpha (0-1) -> rgba string. */
export function withAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
