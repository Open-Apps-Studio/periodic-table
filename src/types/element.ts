export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export interface ElementImage {
  url: string;
  title: string;
  attribution: string;
}

export interface PeriodicElement {
  number: number;
  symbol: string;
  name: string;
  atomicMass: number;
  category: ElementCategory;
  group: number;
  period: number;
  block: string;
  /** Column (1-18) and row (1-10) in the standard layout; rows 9-10 are the f-block. */
  xpos: number;
  ypos: number;
  phase: 'Solid' | 'Liquid' | 'Gas' | string;
  /** g/cm³ */
  densityValue: number | null;
  /** Kelvin */
  melt: number | null;
  /** Kelvin */
  boil: number | null;
  /** J/(mol·K) */
  molarHeat: number | null;
  shells: number[];
  electronConfiguration: string;
  electronConfigurationFull: string;
  electronegativity: number | null;
  /** kJ/mol */
  electronAffinity: number | null;
  /** kJ/mol */
  ionizationEnergies: number[];
  /** pm (van der Waals) */
  atomicRadius: number | null;
  oxidationStates: string | null;
  cpkHex: string | null;
  discoveredBy: string | null;
  namedBy: string | null;
  yearDiscovered: number | 'Ancient' | null;
  appearance: string | null;
  summary: string;
  wikipediaUrl: string;
  bohrModelImage: string | null;
  image: ElementImage | null;
}
