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

export interface ElementPriceReference {
  value: string | null;
  unit: string | null;
  date: string | null;
  source: string | null;
  url: string;
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
  /** J/(g·K) */
  specificHeat: number | null;
  /** kJ/mol */
  heatOfFusion: number | null;
  /** kJ/mol */
  heatOfVaporization: number | null;
  /** 1/K (linear coefficient of thermal expansion) */
  thermalExpansion: number | null;
  /** Kelvin; only defined for ferromagnetic elements */
  curiePoint: number | null;
  /** Conductor | Semiconductor | Insulator */
  electricalType: string | null;
  /** S/m */
  electricalConductivity: number | null;
  shells: number[];
  electronConfiguration: string;
  electronConfigurationFull: string;
  electronegativity: number | null;
  /** kJ/mol */
  electronAffinity: number | null;
  /** kJ/mol */
  ionizationEnergies: number[];
  /** pm (van der Waals, PubChem) */
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
  bohrModel3d: string | null;
  spectralImage: string | null;
  image: ElementImage | null;
  wikidataId: string | null;
  wikidataUrl: string | null;
  nameOrigin: string | null;

  /** Valence electron count (pTable dataset). */
  discoveryLocation: string | null;
  casNumber: string | null;
  /** Indicative market price from Leonland, USD/kg and USD/100g. */
  priceUsdPerKg: number | null;
  priceUsdPer100g: number | null;
  priceReference: ElementPriceReference | null;
  valenceElectrons: number | null;
  isotopesKnown: string | null;
  isotopesStable: string | null;
  isotopicAbundances: string | null;
  /** pm */
  empiricalRadius: number | null;
  /** pm */
  calculatedRadius: number | null;
  /** pm */
  covalentRadius: number | null;
  /** pm */
  vanDerWaalsRadius: number | null;
  /** Percent abundance by mass, where available. */
  abundanceUniverse: number | null;
  abundanceSolar: number | null;
  abundanceMeteor: number | null;
  abundanceCrust: number | null;
  abundanceOcean: number | null;
  abundanceHuman: number | null;
  /** W/(m·K) */
  thermalConductivity: number | null;
  /** m/s */
  speedOfSound: number | null;
  /** g/cm³ */
  liquidDensity: number | null;
  /** Kelvin */
  criticalTemperature: number | null;
  /** MPa */
  criticalPressure: number | null;
  crystalStructure: string | null;
  gasPhase: string | null;
  magneticType: string | null;
  refractiveIndex: number | null;
  /** m²/kg */
  neutronMassAbsorption: number | null;
  volumeMagneticSusceptibility: number | null;
  massMagneticSusceptibility: number | null;
  molarMagneticSusceptibility: number | null;
  /** Ω·m */
  resistivity: number | null;
  cidNumber: string | null;
  rtecNumber: string | null;
  brinellHardness: number | null;
  mohsHardness: number | null;
  vickersHardness: number | null;
  /** GPa */
  bulkModulus: number | null;
  /** GPa */
  youngsModulus: number | null;
  /** GPa */
  shearModulus: number | null;
  /** m³/mol */
  molarVolume: number | null;
  poissonsRatio: number | null;
  radioactive: boolean | null;
  /** seconds; null when stable or unknown */
  halfLife: number | null;
  /** seconds; null when stable or unknown */
  lifetime: number | null;
  /** barns */
  neutronCrossSection: number | null;
}
