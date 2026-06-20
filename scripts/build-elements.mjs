/**
 * Data pipeline: merges open chemistry datasets into our canonical elements.json.
 *
 * Sources (downloaded into data-sources/):
 *  - bowserinator.json — https://github.com/Bowserinator/Periodic-Table-JSON (CC BY-SA 3.0)
 *  - pubchem.csv      — https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/CSV (public domain, NLM/NCBI)
 *  - ptable-complete.json — https://github.com/sweaver2112/periodic-table-data-complete/blob/main/pTable.json
 *    (MIT; aggregates pTable.com + others)
 *  - wikidata-elements.json — generated from Wikidata SPARQL (CC0)
 *
 * Output: src/data/elements.json (118 elements)
 * Run: node scripts/build-elements.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const bowser = JSON.parse(readFileSync(join(root, 'data-sources/bowserinator.json'), 'utf8')).elements;
const ptable = JSON.parse(readFileSync(join(root, 'data-sources/ptable-complete.json'), 'utf8'));
const ptableByNumber = new Map(ptable.map((el) => [el.atomic_number, el]));
let priceByNumber = new Map();
try {
  const prices = JSON.parse(readFileSync(join(root, 'data-sources/leonland-prices.json'), 'utf8'));
  priceByNumber = new Map(prices.map((row) => [row.number, row]));
} catch {
  // Price data is optional because many elements have no meaningful market price.
}

let wikidataByNumber = new Map();
try {
  const wikidata = JSON.parse(readFileSync(join(root, 'data-sources/wikidata-elements.json'), 'utf8'));
  wikidataByNumber = new Map(wikidata.map((row) => [row.number, row]));
} catch {
  // Wikidata enrichment is optional; run scripts/fetch-wikidata-elements.mjs to refresh it.
}

// --- tiny CSV parser (handles quoted fields) ---
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const csvRows = parseCsv(readFileSync(join(root, 'data-sources/pubchem.csv'), 'utf8'));
const csvHeader = csvRows[0];
const pubchem = new Map(
  csvRows.slice(1).filter((r) => r.length === csvHeader.length).map((r) => {
    const o = Object.fromEntries(csvHeader.map((h, i) => [h, r[i]]));
    return [Number(o.AtomicNumber), o];
  })
);

const HALOGENS = new Set([9, 17, 35, 53, 85, 117]);

function normalizeCategory(el) {
  if (HALOGENS.has(el.number)) return 'halogen';
  const c = el.category;
  if (c.startsWith('unknown')) return 'unknown';
  if (c === 'diatomic nonmetal' || c === 'polyatomic nonmetal' || c === 'nonmetal') return 'nonmetal';
  return c.replace(/ /g, '-');
}

const num = (v) => {
  const n = Number(v);
  return v === '' || v == null || Number.isNaN(n) ? null : n;
};

const stableOrNum = (v) => {
  if (v == null || v === '' || v === 'Stable') return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

const firstNumber = (...values) => {
  for (const value of values) {
    const parsed = num(value);
    if (parsed != null) return parsed;
  }
  return null;
};

const firstString = (...values) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value;
  }
  return null;
};

const stripPrefix = (value, prefix) => {
  if (!value || typeof value !== 'string') return null;
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
};

const discoveryYear = (pubChemYear, ptableYear) => {
  const ptableNumericYear = num(ptableYear);
  if (pubChemYear === 'Ancient') return ptableNumericYear ?? 'Ancient';
  return firstNumber(pubChemYear, ptableNumericYear);
};

const elements = bowser
  .filter((el) => el.number <= 118)
  .map((el) => {
    const pc = pubchem.get(el.number) ?? {};
    const pt = ptableByNumber.get(el.number) ?? {};
    const yearRaw = pc.YearDiscovered ?? '';
    const magnetic = pt.magnetic_susceptibility ?? {};
    const radius = pt.radius ?? {};
    const hardness = pt.hardness ?? {};
    const modulus = pt.modulus ?? {};
    const classifications = pt.classifications ?? {};
    const price = priceByNumber.get(el.number);
    const wd = wikidataByNumber.get(el.number) ?? {};

    const halfLife = stableOrNum(pt.half_life);
    const lifetime = stableOrNum(pt.lifetime);
    const isStable = pt.half_life === 'Stable' && pt.lifetime === 'Stable';
    const isRadioactive = isStable ? false : halfLife != null || lifetime != null ? true : null;

    return {
      number: el.number,
      symbol: el.symbol,
      name: el.name,
      atomicMass: el.atomic_mass,
      category: normalizeCategory(el),
      group: el.group,
      period: el.period,
      block: el.block,
      xpos: el.xpos,
      ypos: el.ypos,
      phase: el.phase,
      densityValue: firstNumber(pc.Density, el.density, pt.density?.stp == null ? null : pt.density.stp / 1000),
      melt: firstNumber(el.melt, pc.MeltingPoint, pt.melting_point),
      boil: firstNumber(el.boil, pc.BoilingPoint, pt.boiling_point),
      molarHeat: firstNumber(el.molar_heat, pt.heat?.molar),
      shells: el.shells,
      electronConfiguration: el.electron_configuration_semantic,
      electronConfigurationFull: el.electron_configuration,
      electronegativity: firstNumber(pc.Electronegativity, el.electronegativity_pauling, pt.electronegativity_pauling),
      electronAffinity: el.electron_affinity,
      ionizationEnergies: el.ionization_energies,
      atomicRadius: num(pc.AtomicRadius),
      oxidationStates: pc.OxidationStates || null,
      cpkHex: firstString(el['cpk-hex'], pc.CPKHexColor?.toLowerCase(), pt.cpk_hex),
      discoveredBy: firstString(el.discovered_by, pt.discovered?.by, wd.discoverers),
      namedBy: el.named_by,
      yearDiscovered: discoveryYear(yearRaw, pt.discovered?.year),
      appearance: el.appearance,
      summary: el.summary,
      wikipediaUrl: el.source,
      bohrModelImage: el.bohr_model_image,
      bohrModel3d: el.bohr_model_3d ?? null,
      spectralImage: el.spectral_img ?? null,
      image: el.image
        ? { url: el.image.url, title: el.image.title, attribution: el.image.attribution }
        : null,

      // CC0 Wikidata enrichment.
      wikidataId: wd.wikidataId ?? null,
      wikidataUrl: wd.wikidataUrl ?? null,
      nameOrigin: wd.nameOrigin ?? null,

      // Extended properties (periodic-table-data-complete, MIT)
      discoveryLocation: firstString(pt.discovered?.location, wd.discoveryLocations, yearRaw === 'Ancient' ? 'Known since antiquity' : null),
      casNumber: stripPrefix(classifications.cas_number, 'CAS'),
      priceUsdPerKg: num(price?.usdPerKg),
      priceUsdPer100g: num(price?.usdPer100g),
      priceReference: price
        ? {
            value: price.referencePrice || null,
            unit: price.referenceUnit || null,
            date: price.date || null,
            source: price.source || null,
            url: 'http://www.leonland.de/elements_by_price/en/list',
          }
        : null,
      valenceElectrons: num(pt.valence_electrons),
      isotopesKnown: pt.isotopes_known ?? null,
      isotopesStable: pt.isotopes_stable ?? null,
      isotopicAbundances: pt.isotopic_abundances ?? null,
      empiricalRadius: num(radius.empirical),
      calculatedRadius: num(radius.calculated),
      covalentRadius: num(radius.covalent),
      vanDerWaalsRadius: num(radius.vanderwaals),
      abundanceUniverse: num(pt.abundance?.universe),
      abundanceSolar: num(pt.abundance?.solar),
      abundanceMeteor: num(pt.abundance?.meteor),
      abundanceCrust: num(pt.abundance?.crust),
      abundanceOcean: num(pt.abundance?.ocean),
      abundanceHuman: num(pt.abundance?.human),
      thermalConductivity: num(pt.conductivity?.thermal),
      speedOfSound: num(pt.speed_of_sound),
      liquidDensity: firstNumber(pt.density?.liquid == null ? null : pt.density.liquid / 1000),
      criticalTemperature: num(pt.critical_temperature),
      criticalPressure: num(pt.critical_pressure),
      crystalStructure: pt.crystal_structure ?? null,
      gasPhase: pt.gas_phase ?? null,
      magneticType: pt.magnetic_type ?? null,
      refractiveIndex: num(pt.refractive_index),
      neutronMassAbsorption: num(pt.neutron_mass_absorption),
      volumeMagneticSusceptibility: num(magnetic.volume),
      massMagneticSusceptibility: num(magnetic.mass),
      molarMagneticSusceptibility: num(magnetic.molar),
      resistivity: num(pt.resistivity),
      cidNumber: stripPrefix(classifications.cid_number, 'CID'),
      rtecNumber: stripPrefix(classifications.rtecs_number, 'RTECS'),
      brinellHardness: num(hardness.brinell),
      mohsHardness: num(hardness.mohs),
      vickersHardness: num(hardness.vickers),
      bulkModulus: num(modulus.bulk),
      youngsModulus: num(modulus.young),
      shearModulus: num(modulus.shear),
      molarVolume: num(pt.molar_volume),
      poissonsRatio: num(pt.poisson_ratio),
      radioactive: isRadioactive,
      halfLife,
      lifetime,
      neutronCrossSection: num(pt.neutron_cross_section),
    };
  });

const outDir = join(root, 'src/data');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'elements.json'), JSON.stringify(elements, null, 1) + '\n');

const cats = [...new Set(elements.map((e) => e.category))];
console.log(`Wrote ${elements.length} elements to src/data/elements.json`);
console.log('Categories:', cats.join(', '));
console.log('Max xpos:', Math.max(...elements.map((e) => e.xpos)), 'Max ypos:', Math.max(...elements.map((e) => e.ypos)));
