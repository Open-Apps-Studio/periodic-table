import type { Nuclide } from '@/types/nuclide';
import nuclidesJson from './nuclides.json';

export const NUCLIDES = nuclidesJson as Nuclide[];

const byElement = new Map<number, Nuclide[]>();

for (const nuclide of NUCLIDES) {
  const rows = byElement.get(nuclide.z) ?? [];
  rows.push(nuclide);
  byElement.set(nuclide.z, rows);
}

export function getNuclidesForElement(atomicNumber: number): Nuclide[] {
  return byElement.get(atomicNumber) ?? [];
}

export function getNuclide(id: string): Nuclide | undefined {
  return NUCLIDES.find((nuclide) => nuclide.id.toLowerCase() === id.toLowerCase());
}
