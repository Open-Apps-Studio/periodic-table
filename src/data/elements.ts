import type { PeriodicElement } from '@/types/element';
import elementsJson from './elements.json';

export const ELEMENTS = elementsJson as PeriodicElement[];

const byNumber = new Map(ELEMENTS.map((el) => [el.number, el]));
const bySymbol = new Map(ELEMENTS.map((el) => [el.symbol.toLowerCase(), el]));

export function getElement(number: number): PeriodicElement | undefined {
  return byNumber.get(number);
}

export function getElementBySymbol(symbol: string): PeriodicElement | undefined {
  return bySymbol.get(symbol.toLowerCase());
}

export function searchElements(query: string): PeriodicElement[] {
  const q = query.trim().toLowerCase();
  if (!q) return ELEMENTS;
  const asNumber = Number(q);
  return ELEMENTS.filter(
    (el) =>
      el.name.toLowerCase().includes(q) ||
      el.symbol.toLowerCase().startsWith(q) ||
      (!Number.isNaN(asNumber) && el.number === asNumber)
  );
}
