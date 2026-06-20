import type { PeriodicElement } from '@/types/element';
import { fmt, fmtYear } from './format';
import {
  displayAtomicRadius,
  displayVanDerWaalsRadius,
  fmtGpa,
  fmtMolarVolume,
  fmtPercent,
  fmtPm,
  fmtResistivity,
  fmtSci,
  fmtUsd,
} from './format-properties';

export interface PropertyField {
  id: string;
  label: string;
  unit?: string;
  accent: string;
  value: (el: PeriodicElement) => number | null;
  display: (el: PeriodicElement) => string | null;
}

export interface SearchScope {
  id: string;
  label: string;
  matches: (el: PeriodicElement, query: string, asNumber: number) => boolean;
}

const numberText = (value: number | null | undefined, digits = 4): string | null =>
  value == null ? null : fmt(value, digits);

const countElectrons = (el: PeriodicElement): number =>
  el.shells.reduce((sum, shell) => sum + shell, 0);

const estimateNeutrons = (el: PeriodicElement): number =>
  Math.max(0, Math.round(el.atomicMass) - el.number);

const conductivity = (el: PeriodicElement): number | null =>
  el.resistivity == null || el.resistivity === 0 ? null : 1 / el.resistivity;

export const PROPERTY_FIELDS: PropertyField[] = [
  {
    id: 'atomicMass',
    label: 'Atomic weight (Relative atomic mass)',
    unit: 'g/mol',
    accent: '#118AB2',
    value: (el) => el.atomicMass,
    display: (el) => fmt(el.atomicMass, 6),
  },
  {
    id: 'electrons',
    label: 'Electrons',
    accent: '#FFB703',
    value: countElectrons,
    display: (el) => String(countElectrons(el)),
  },
  {
    id: 'electronegativity',
    label: 'Electronegativity',
    accent: '#118AB2',
    value: (el) => el.electronegativity,
    display: (el) => numberText(el.electronegativity, 3),
  },
  {
    id: 'density',
    label: 'Density',
    unit: 'g/cm³',
    accent: '#588157',
    value: (el) => el.densityValue,
    display: (el) => numberText(el.densityValue, 4),
  },
  {
    id: 'priceUsdPer100g',
    label: 'Cost per 100 grams',
    unit: 'USD/100g',
    accent: '#2F9E44',
    value: (el) => el.priceUsdPer100g,
    display: (el) => fmtUsd(el.priceUsdPer100g),
  },
  {
    id: 'protons',
    label: 'Protons',
    accent: '#FB5607',
    value: (el) => el.number,
    display: (el) => String(el.number),
  },
  {
    id: 'neutrons',
    label: 'Neutrons',
    accent: '#2D936C',
    value: estimateNeutrons,
    display: (el) => String(estimateNeutrons(el)),
  },
  {
    id: 'atomicRadius',
    label: 'Atomic radius',
    unit: 'pm',
    accent: '#FF8C00',
    value: (el) => el.empiricalRadius ?? el.calculatedRadius ?? el.atomicRadius,
    display: displayAtomicRadius,
  },
  {
    id: 'vanDerWaalsRadius',
    label: 'Van der Waals radius',
    unit: 'pm',
    accent: '#8E6C88',
    value: (el) => el.vanDerWaalsRadius ?? el.atomicRadius,
    display: displayVanDerWaalsRadius,
  },
  {
    id: 'covalentRadius',
    label: 'Covalent radius',
    unit: 'pm',
    accent: '#DB3A34',
    value: (el) => el.covalentRadius,
    display: (el) => fmtPm(el.covalentRadius),
  },
  {
    id: 'molarVolume',
    label: 'Molar volume',
    unit: 'm³/mol',
    accent: '#2A9D8F',
    value: (el) => el.molarVolume,
    display: (el) => fmtMolarVolume(el.molarVolume),
  },
  {
    id: 'conductivity',
    label: 'Electrical conductivity',
    unit: 'S/m',
    accent: '#4361EE',
    value: conductivity,
    display: (el) => {
      const value = conductivity(el);
      return value == null ? null : fmtSci(value, 2);
    },
  },
  {
    id: 'thermalConductivity',
    label: 'Thermal conductivity',
    unit: 'W/(m·K)',
    accent: '#F77F00',
    value: (el) => el.thermalConductivity,
    display: (el) => numberText(el.thermalConductivity, 4),
  },
  {
    id: 'speedOfSound',
    label: 'Speed of sound transmission',
    unit: 'm/s',
    accent: '#00B4D8',
    value: (el) => el.speedOfSound,
    display: (el) => numberText(el.speedOfSound, 5),
  },
  {
    id: 'liquidDensity',
    label: 'Liquid density',
    unit: 'g/cm³',
    accent: '#5C7CFA',
    value: (el) => el.liquidDensity,
    display: (el) => numberText(el.liquidDensity, 4),
  },
  {
    id: 'mohsHardness',
    label: 'Mohs hardness',
    accent: '#A7C957',
    value: (el) => el.mohsHardness,
    display: (el) => numberText(el.mohsHardness, 2),
  },
  {
    id: 'brinellHardness',
    label: 'Brinell hardness',
    accent: '#277DA1',
    value: (el) => el.brinellHardness,
    display: (el) => numberText(el.brinellHardness, 4),
  },
  {
    id: 'youngsModulus',
    label: "Young's modulus",
    unit: 'GPa',
    accent: '#F4A261',
    value: (el) => el.youngsModulus,
    display: (el) => fmtGpa(el.youngsModulus),
  },
  {
    id: 'bulkModulus',
    label: 'Bulk modulus',
    unit: 'GPa',
    accent: '#E76F51',
    value: (el) => el.bulkModulus,
    display: (el) => fmtGpa(el.bulkModulus),
  },
  {
    id: 'shearModulus',
    label: 'Shear modulus',
    unit: 'GPa',
    accent: '#D62828',
    value: (el) => el.shearModulus,
    display: (el) => fmtGpa(el.shearModulus),
  },
  {
    id: 'resistivity',
    label: 'Resistivity',
    unit: 'Ω·m',
    accent: '#3A86FF',
    value: (el) => el.resistivity,
    display: (el) => fmtResistivity(el.resistivity),
  },
  {
    id: 'yearDiscovered',
    label: 'Year discovered',
    accent: '#9B5DE5',
    value: (el) => (el.yearDiscovered === 'Ancient' ? 0 : el.yearDiscovered),
    display: (el) => (el.yearDiscovered == null ? null : fmtYear(el.yearDiscovered)),
  },
  {
    id: 'neutronCrossSection',
    label: 'Neutron cross-section',
    unit: 'barn',
    accent: '#00B4D8',
    value: (el) => el.neutronCrossSection,
    display: (el) => (el.neutronCrossSection == null ? null : fmt(el.neutronCrossSection, 3)),
  },
  {
    id: 'abundanceCrust',
    label: 'Crust abundance',
    unit: '%',
    accent: '#7950F2',
    value: (el) => el.abundanceCrust,
    display: (el) => fmtPercent(el.abundanceCrust),
  },
  {
    id: 'abundanceUniverse',
    label: 'Universe abundance',
    unit: '%',
    accent: '#3BC9DB',
    value: (el) => el.abundanceUniverse,
    display: (el) => fmtPercent(el.abundanceUniverse),
  },
  {
    id: 'refractiveIndex',
    label: 'Refractive index',
    accent: '#15AABF',
    value: (el) => el.refractiveIndex,
    display: (el) => numberText(el.refractiveIndex, 6),
  },
  {
    id: 'neutronMassAbsorption',
    label: 'Neutron mass absorption',
    unit: 'm²/kg',
    accent: '#1098AD',
    value: (el) => el.neutronMassAbsorption,
    display: (el) => numberText(el.neutronMassAbsorption, 4),
  },
];

export const DEFAULT_PROPERTY_FIELD_ID = 'atomicMass';

export function getPropertyField(id: string): PropertyField {
  return PROPERTY_FIELDS.find((field) => field.id === id) ?? PROPERTY_FIELDS[0];
}

export const SEARCH_SCOPES: SearchScope[] = [
  {
    id: 'all',
    label: 'All parameters',
    matches: (el, query, asNumber) =>
      baseElementMatch(el, query, asNumber) ||
      searchText(el).includes(query) ||
      PROPERTY_FIELDS.some((field) => field.display(el)?.toLowerCase().includes(query)),
  },
  { id: 'symbol', label: 'Element symbol', matches: (el, query) => el.symbol.toLowerCase().startsWith(query) },
  { id: 'name', label: 'Name', matches: (el, query) => el.name.toLowerCase().includes(query) },
  { id: 'number', label: 'Atomic number', matches: (el, _query, asNumber) => el.number === asNumber },
  {
    id: 'weight',
    label: 'Weight',
    matches: (el, query) => fmt(el.atomicMass, 8).includes(query),
  },
  {
    id: 'year',
    label: 'Year',
    matches: (el, query) => (el.yearDiscovered == null ? false : fmtYear(el.yearDiscovered).toLowerCase().includes(query)),
  },
  {
    id: 'electrons',
    label: 'Number of electrons',
    matches: (el, _query, asNumber) => countElectrons(el) === asNumber,
  },
  {
    id: 'density',
    label: 'Density',
    matches: (el, query) => (el.densityValue == null ? false : fmt(el.densityValue, 8).includes(query)),
  },
  {
    id: 'electronegativity',
    label: 'Electronegativity',
    matches: (el, query) => (el.electronegativity == null ? false : fmt(el.electronegativity, 4).includes(query)),
  },
  {
    id: 'conductivity',
    label: 'Conductivity',
    matches: (el, query) => {
      const value = conductivity(el);
      return value == null ? false : fmtSci(value, 3)?.toLowerCase().includes(query) ?? false;
    },
  },
  {
    id: 'price',
    label: 'Cost per 100 grams',
    matches: (el, query) => fmtUsd(el.priceUsdPer100g)?.toLowerCase().includes(query) ?? false,
  },
  {
    id: 'atomicRadius',
    label: 'Atomic radius',
    matches: (el, query) => displayAtomicRadius(el)?.toLowerCase().includes(query) ?? false,
  },
  {
    id: 'registry',
    label: 'CAS / CID / RTEC',
    matches: (el, query) =>
      [el.casNumber, el.cidNumber, el.rtecNumber].some((value) => value?.toLowerCase().includes(query)),
  },
  {
    id: 'isotopes',
    label: 'Isotopes',
    matches: (el, query) =>
      [el.isotopesKnown, el.isotopesStable, el.isotopicAbundances].some((value) =>
        value?.toLowerCase().includes(query),
      ),
  },
];

export function filterElementsByScope(
  elements: PeriodicElement[],
  query: string,
  scopeId: string,
): PeriodicElement[] {
  const q = query.trim().toLowerCase();
  const scope = SEARCH_SCOPES.find((item) => item.id === scopeId) ?? SEARCH_SCOPES[0];
  const sorted = [...elements].sort((a, b) => a.symbol.localeCompare(b.symbol));
  if (!q) return sorted;
  const asNumber = Number(q);
  return sorted.filter((el) => scope.matches(el, q, asNumber));
}

function baseElementMatch(el: PeriodicElement, query: string, asNumber: number): boolean {
  return (
    el.name.toLowerCase().includes(query) ||
    el.symbol.toLowerCase().startsWith(query) ||
    (!Number.isNaN(asNumber) && el.number === asNumber)
  );
}

function searchText(el: PeriodicElement): string {
  return [
    el.category,
    el.phase,
    el.block,
    el.discoveredBy,
    el.namedBy,
    el.appearance,
    el.oxidationStates,
    el.electronConfiguration,
    el.discoveryLocation,
    el.nameOrigin,
    el.wikidataId,
    el.casNumber,
    el.isotopesKnown,
    el.isotopesStable,
    el.isotopicAbundances,
    el.crystalStructure,
    el.gasPhase,
    el.magneticType,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}
