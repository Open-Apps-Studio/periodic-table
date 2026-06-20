export type SolubilityTone = 'soluble' | 'slightly' | 'insoluble' | 'mixed';

export interface SolubilityRule {
  family: string;
  ions: string[];
  tone: SolubilityTone;
  rule: string;
  exceptions: string;
  examples: string[];
}

export interface IonReference {
  name: string;
  formula: string;
  charge: string;
  kind: 'cation' | 'anion';
}

export interface OrganicSeries {
  family: string;
  generalFormula: string;
  firstMembers: string[];
  note: string;
}

export interface PhysicalConstant {
  label: string;
  value: string;
  note: string;
}

export const SOLUBILITY_RULES: SolubilityRule[] = [
  {
    family: 'Group 1 and ammonium salts',
    ions: ['Li+', 'Na+', 'K+', 'Rb+', 'Cs+', 'NH4+'],
    tone: 'soluble',
    rule: 'Usually soluble in water.',
    exceptions: 'Few common exceptions.',
    examples: ['NaCl', 'K2SO4', 'NH4NO3'],
  },
  {
    family: 'Nitrates, acetates, chlorates',
    ions: ['NO3-', 'C2H3O2-', 'ClO3-', 'ClO4-'],
    tone: 'soluble',
    rule: 'Soluble with essentially all common cations.',
    exceptions: 'None common for introductory work.',
    examples: ['AgNO3', 'Pb(NO3)2', 'NaC2H3O2'],
  },
  {
    family: 'Chlorides, bromides, iodides',
    ions: ['Cl-', 'Br-', 'I-'],
    tone: 'soluble',
    rule: 'Usually soluble.',
    exceptions: 'Insoluble with Ag+, Pb2+, and Hg2 2+.',
    examples: ['NaCl', 'AgCl', 'PbI2'],
  },
  {
    family: 'Sulfates',
    ions: ['SO4 2-'],
    tone: 'mixed',
    rule: 'Usually soluble.',
    exceptions: 'BaSO4, SrSO4, PbSO4 are insoluble; CaSO4 and Ag2SO4 are only slightly soluble.',
    examples: ['CuSO4', 'BaSO4', 'CaSO4'],
  },
  {
    family: 'Hydroxides',
    ions: ['OH-'],
    tone: 'slightly',
    rule: 'Most are insoluble or only slightly soluble.',
    exceptions: 'Group 1 hydroxides are soluble; Ba(OH)2 is soluble; Ca(OH)2 and Sr(OH)2 are slightly soluble.',
    examples: ['NaOH', 'Ca(OH)2', 'Fe(OH)3'],
  },
  {
    family: 'Carbonates, phosphates, chromates',
    ions: ['CO3 2-', 'PO4 3-', 'CrO4 2-'],
    tone: 'insoluble',
    rule: 'Usually insoluble.',
    exceptions: 'Soluble with Group 1 cations and NH4+.',
    examples: ['CaCO3', 'Ag2CrO4', '(NH4)3PO4'],
  },
  {
    family: 'Sulfides',
    ions: ['S2-'],
    tone: 'insoluble',
    rule: 'Many transition-metal sulfides are insoluble.',
    exceptions: 'Group 1, Group 2, and NH4+ sulfides are more soluble in introductory solubility rules.',
    examples: ['Na2S', 'FeS', 'Ag2S'],
  },
];

export const COMMON_IONS: IonReference[] = [
  { name: 'Hydrogen', formula: 'H+', charge: '+1', kind: 'cation' },
  { name: 'Ammonium', formula: 'NH4+', charge: '+1', kind: 'cation' },
  { name: 'Lithium', formula: 'Li+', charge: '+1', kind: 'cation' },
  { name: 'Sodium', formula: 'Na+', charge: '+1', kind: 'cation' },
  { name: 'Potassium', formula: 'K+', charge: '+1', kind: 'cation' },
  { name: 'Magnesium', formula: 'Mg2+', charge: '+2', kind: 'cation' },
  { name: 'Calcium', formula: 'Ca2+', charge: '+2', kind: 'cation' },
  { name: 'Barium', formula: 'Ba2+', charge: '+2', kind: 'cation' },
  { name: 'Aluminum', formula: 'Al3+', charge: '+3', kind: 'cation' },
  { name: 'Silver', formula: 'Ag+', charge: '+1', kind: 'cation' },
  { name: 'Zinc', formula: 'Zn2+', charge: '+2', kind: 'cation' },
  { name: 'Iron(II)', formula: 'Fe2+', charge: '+2', kind: 'cation' },
  { name: 'Iron(III)', formula: 'Fe3+', charge: '+3', kind: 'cation' },
  { name: 'Copper(II)', formula: 'Cu2+', charge: '+2', kind: 'cation' },
  { name: 'Fluoride', formula: 'F-', charge: '-1', kind: 'anion' },
  { name: 'Chloride', formula: 'Cl-', charge: '-1', kind: 'anion' },
  { name: 'Bromide', formula: 'Br-', charge: '-1', kind: 'anion' },
  { name: 'Iodide', formula: 'I-', charge: '-1', kind: 'anion' },
  { name: 'Hydroxide', formula: 'OH-', charge: '-1', kind: 'anion' },
  { name: 'Nitrate', formula: 'NO3-', charge: '-1', kind: 'anion' },
  { name: 'Acetate', formula: 'C2H3O2-', charge: '-1', kind: 'anion' },
  { name: 'Carbonate', formula: 'CO3 2-', charge: '-2', kind: 'anion' },
  { name: 'Sulfate', formula: 'SO4 2-', charge: '-2', kind: 'anion' },
  { name: 'Phosphate', formula: 'PO4 3-', charge: '-3', kind: 'anion' },
];

export const ORGANIC_SERIES: OrganicSeries[] = [
  {
    family: 'Alkanes',
    generalFormula: 'CnH2n+2',
    firstMembers: ['CH4 methane', 'C2H6 ethane', 'C3H8 propane', 'C4H10 butane'],
    note: 'Saturated hydrocarbons with single C-C bonds.',
  },
  {
    family: 'Alkenes',
    generalFormula: 'CnH2n',
    firstMembers: ['C2H4 ethene', 'C3H6 propene', 'C4H8 butene'],
    note: 'Unsaturated hydrocarbons with at least one C=C bond.',
  },
  {
    family: 'Alkynes',
    generalFormula: 'CnH2n-2',
    firstMembers: ['C2H2 ethyne', 'C3H4 propyne', 'C4H6 butyne'],
    note: 'Unsaturated hydrocarbons with at least one C≡C bond.',
  },
  {
    family: 'Cycloalkanes',
    generalFormula: 'CnH2n',
    firstMembers: ['C3H6 cyclopropane', 'C4H8 cyclobutane', 'C6H12 cyclohexane'],
    note: 'Ring-shaped saturated hydrocarbons.',
  },
  {
    family: 'Alcohols',
    generalFormula: 'CnH2n+1OH',
    firstMembers: ['CH3OH methanol', 'C2H5OH ethanol', 'C3H7OH propanol'],
    note: 'Organic compounds containing a hydroxyl group.',
  },
  {
    family: 'Carboxylic acids',
    generalFormula: 'CnH2n+1COOH',
    firstMembers: ['HCOOH methanoic acid', 'CH3COOH ethanoic acid', 'C2H5COOH propanoic acid'],
    note: 'Organic acids containing a carboxyl group.',
  },
];

export const PHYSICAL_CONSTANTS: PhysicalConstant[] = [
  { label: 'Avogadro constant', value: '6.02214076 × 10^23 mol^-1', note: 'Particles per mole.' },
  { label: 'Ideal gas constant', value: '8.314462618 J mol^-1 K^-1', note: 'R in PV = nRT.' },
  { label: 'Faraday constant', value: '96485.33212 C mol^-1', note: 'Charge per mole of electrons.' },
  { label: 'Standard pressure', value: '100 kPa', note: 'IUPAC standard pressure.' },
  { label: 'STP molar volume', value: '22.711 L mol^-1', note: 'Ideal gas at 273.15 K and 100 kPa.' },
  { label: 'Room temperature', value: '298.15 K', note: '25 °C, common reference temperature.' },
];
