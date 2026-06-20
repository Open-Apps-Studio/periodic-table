import type { PeriodicElement } from '@/types/element';
import { fmt, fmtYear } from './format';
import {
  displayAtomicRadius,
  displayVanDerWaalsRadius,
  fmtDuration,
  fmtGpa,
  fmtMolarVolume,
  fmtPercent,
  fmtPm,
  fmtResistivity,
  fmtSci,
  fmtSusceptibility,
  fmtUsd,
} from './format-properties';

export interface CellField {
  id: string;
  label: string;
  /** Accent bar color in the picker list. */
  accent: string;
  format: (el: PeriodicElement) => string | null;
}

export interface CellFieldSection {
  title: string;
  fields: CellField[];
}

const field = (
  id: string,
  label: string,
  accent: string,
  format: (el: PeriodicElement) => string | null,
): CellField => ({ id, label, accent, format });

/** All cell detail options from the reference app, grouped like the picker screenshots. */
export const CELL_FIELD_SECTIONS: CellFieldSection[] = [
  {
    title: 'Overview',
    fields: [
      field('name', 'Element name', '#69DB7C', (el) => el.name),
      field('atomicMass', 'Atomic weight (Relative atomic mass)', '#FFA94D', (el) => fmt(el.atomicMass, 4)),
      field('yearDiscovered', 'Year discovered', '#B197FC', (el) =>
        el.yearDiscovered == null ? null : fmtYear(el.yearDiscovered),
      ),
      field('density', 'Density', '#4DABF7', (el) =>
        el.densityValue == null ? null : `${fmt(el.densityValue, 3)} g/cm³`,
      ),
      field('priceUsdPer100g', 'Cost per 100 grams', '#2F9E44', (el) =>
        el.priceUsdPer100g == null ? null : `${fmtUsd(el.priceUsdPer100g)} / 100g`,
      ),
      field('casNumber', 'CAS Number', '#FF6B6B', (el) => (el.casNumber == null ? null : `CAS${el.casNumber}`)),
    ],
  },
  {
    title: 'Properties',
    fields: [
      field('melt', 'Melting point', '#69DB7C', (el) => (el.melt == null ? null : `${Math.round(el.melt)} K`)),
      field('boil', 'Boiling point', '#FFA94D', (el) => (el.boil == null ? null : `${Math.round(el.boil)} K`)),
      field('valenceElectrons', 'Valence electrons', '#4DABF7', (el) =>
        el.valenceElectrons == null ? null : String(el.valenceElectrons),
      ),
      field('block', 'Block', '#FF6B6B', (el) => `${el.block}-block`),
      field('thermalConductivity', 'Thermal conductivity', '#F77F00', (el) =>
        el.thermalConductivity == null ? null : `${fmt(el.thermalConductivity, 3)} W/(m·K)`,
      ),
      field('speedOfSound', 'Speed of sound transmission', '#00B4D8', (el) =>
        el.speedOfSound == null ? null : `${fmt(el.speedOfSound, 4)} m/s`,
      ),
      field('liquidDensity', 'Liquid density', '#5C7CFA', (el) =>
        el.liquidDensity == null ? null : `${fmt(el.liquidDensity, 3)} g/cm³`,
      ),
    ],
  },
  {
    title: 'Atomic properties',
    fields: [
      field('atomicRadius', 'Atomic radius', '#74C0FC', displayAtomicRadius),
      field('covalentRadius', 'Covalent radius', '#F783AC', (el) => fmtPm(el.covalentRadius)),
      field('vanDerWaalsRadius', 'Van der Waals radius', '#FFA94D', displayVanDerWaalsRadius),
    ],
  },
  {
    title: 'Electromagnetic properties',
    fields: [
      field('volumeMagneticSusceptibility', 'Volume magnetic susceptibility', '#FFA94D', (el) =>
        fmtSusceptibility(el.volumeMagneticSusceptibility),
      ),
      field('massMagneticSusceptibility', 'Mass magnetic susceptibility', '#FF6B6B', (el) =>
        fmtSusceptibility(el.massMagneticSusceptibility),
      ),
      field('molarMagneticSusceptibility', 'Molar magnetic susceptibility', '#4DABF7', (el) =>
        fmtSusceptibility(el.molarMagneticSusceptibility),
      ),
      field('resistivity', 'Resistivity', '#69DB7C', (el) => fmtResistivity(el.resistivity)),
    ],
  },
  {
    title: 'Additional information',
    fields: [
      field('cidNumber', 'CID Number', '#FFA94D', (el) => el.cidNumber),
      field('rtecNumber', 'RTEC Number', '#FF6B6B', (el) => el.rtecNumber),
      field('brinellHardness', 'Brinell hardness', '#4DABF7', (el) =>
        el.brinellHardness == null ? null : String(el.brinellHardness),
      ),
      field('mohsHardness', 'Mohs hardness', '#69DB7C', (el) =>
        el.mohsHardness == null ? null : fmt(el.mohsHardness, 2),
      ),
      field('vickersHardness', 'Vickers hardness', '#B197FC', (el) =>
        el.vickersHardness == null ? null : String(el.vickersHardness),
      ),
      field('bulkModulus', 'Bulk modulus', '#F783AC', (el) => fmtGpa(el.bulkModulus)),
      field('youngsModulus', "Young's modulus", '#FFA94D', (el) => fmtGpa(el.youngsModulus)),
      field('molarVolume', 'Molar volume', '#4DABF7', (el) => fmtMolarVolume(el.molarVolume)),
      field('crystalStructure', 'Crystal structure', '#7950F2', (el) => el.crystalStructure),
      field('magneticType', 'Magnetic type', '#15AABF', (el) => el.magneticType),
      field('refractiveIndex', 'Refractive index', '#3BC9DB', (el) =>
        el.refractiveIndex == null ? null : fmt(el.refractiveIndex, 4),
      ),
      field('poissonsRatio', "Poisson's ratio", '#69DB7C', (el) =>
        el.poissonsRatio == null ? null : fmt(el.poissonsRatio, 2),
      ),
      field('shearModulus', 'Shear modulus', '#FF6B6B', (el) => fmtGpa(el.shearModulus)),
    ],
  },
  {
    title: 'Abundance',
    fields: [
      field('abundanceUniverse', 'Universe abundance', '#3BC9DB', (el) => fmtPercent(el.abundanceUniverse)),
      field('abundanceSolar', 'Solar abundance', '#4DABF7', (el) => fmtPercent(el.abundanceSolar)),
      field('abundanceMeteor', 'Meteorite abundance', '#FFA94D', (el) => fmtPercent(el.abundanceMeteor)),
      field('abundanceCrust', "Earth's crust abundance", '#7950F2', (el) => fmtPercent(el.abundanceCrust)),
      field('abundanceOcean', 'Ocean abundance', '#69DB7C', (el) => fmtPercent(el.abundanceOcean)),
      field('abundanceHuman', 'Human body abundance', '#F783AC', (el) => fmtPercent(el.abundanceHuman)),
    ],
  },
  {
    title: 'Nuclear properties',
    fields: [
      field('radioactive', 'Radioactive', '#69DB7C', (el) =>
        el.radioactive == null ? null : el.radioactive ? 'Yes' : 'No',
      ),
      field('halfLife', 'Half life', '#FFA94D', (el) =>
        el.halfLife == null ? (el.radioactive === false ? 'Stable' : null) : fmtDuration(el.halfLife),
      ),
      field('lifetime', 'Lifetime', '#FF6B6B', (el) =>
        el.lifetime == null ? (el.radioactive === false ? 'Stable' : null) : fmtDuration(el.lifetime),
      ),
      field('neutronCrossSection', 'Neutron cross section, barn', '#4DABF7', (el) =>
        el.neutronCrossSection == null ? null : `${fmt(el.neutronCrossSection, 3)} barn`,
      ),
      field('neutronMassAbsorption', 'Neutron mass absorption', '#1098AD', (el) =>
        el.neutronMassAbsorption == null ? null : `${fmt(el.neutronMassAbsorption, 3)} m²/kg`,
      ),
      field('isotopesStable', 'Stable isotopes', '#69DB7C', (el) => el.isotopesStable),
      field('electronegativity', 'Electronegativity', '#B197FC', (el) =>
        el.electronegativity == null ? null : fmt(el.electronegativity, 2),
      ),
    ],
  },
];

export const CELL_FIELDS = CELL_FIELD_SECTIONS.flatMap((s) => s.fields);

export const DEFAULT_CELL_FIELD_ID = 'name';

export function getCellField(id: string): CellField {
  return CELL_FIELDS.find((f) => f.id === id) ?? CELL_FIELDS[0];
}

export function formatCellField(id: string, el: PeriodicElement): string {
  const value = getCellField(id).format(el);
  return value ?? '—';
}
