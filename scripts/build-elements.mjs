/**
 * Data pipeline: merges open chemistry datasets into our canonical elements.json.
 *
 * Sources (downloaded into data-sources/):
 *  - bowserinator.json — https://github.com/Bowserinator/Periodic-Table-JSON (CC BY-SA 3.0)
 *  - pubchem.csv      — https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/CSV (public domain, NLM/NCBI)
 *
 * Output: src/data/elements.json (118 elements)
 * Run: node scripts/build-elements.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const bowser = JSON.parse(readFileSync(join(root, 'data-sources/bowserinator.json'), 'utf8')).elements;

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
  return c.replace(/ /g, '-'); // e.g. "alkali metal" -> "alkali-metal"
}

const num = (v) => {
  const n = Number(v);
  return v === '' || v == null || Number.isNaN(n) ? null : n;
};

const elements = bowser
  .filter((el) => el.number <= 118)
  .map((el) => {
    const pc = pubchem.get(el.number) ?? {};
    const yearRaw = pc.YearDiscovered ?? '';
    return {
      number: el.number,
      symbol: el.symbol,
      name: el.name,
      atomicMass: el.atomic_mass,
      category: normalizeCategory(el),
      group: el.group,
      period: el.period,
      block: el.block,
      // grid position in the standard 18-column layout (lanthanides/actinides split out)
      xpos: el.xpos,
      ypos: el.ypos,
      phase: el.phase,
      densityValue: num(pc.Density) ?? el.density, // g/cm³
      melt: el.melt, // K
      boil: el.boil, // K
      molarHeat: el.molar_heat, // J/(mol·K)
      shells: el.shells,
      electronConfiguration: el.electron_configuration_semantic,
      electronConfigurationFull: el.electron_configuration,
      electronegativity: el.electronegativity_pauling,
      electronAffinity: el.electron_affinity, // kJ/mol
      ionizationEnergies: el.ionization_energies, // kJ/mol
      atomicRadius: num(pc.AtomicRadius), // pm (van der Waals)
      oxidationStates: pc.OxidationStates || null,
      cpkHex: el['cpk-hex'],
      discoveredBy: el.discovered_by,
      namedBy: el.named_by,
      yearDiscovered: yearRaw === 'Ancient' ? 'Ancient' : num(yearRaw),
      appearance: el.appearance,
      summary: el.summary,
      wikipediaUrl: el.source,
      bohrModelImage: el.bohr_model_image,
      image: el.image
        ? { url: el.image.url, title: el.image.title, attribution: el.image.attribution }
        : null,
    };
  });

const outDir = join(root, 'src/data');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'elements.json'), JSON.stringify(elements, null, 1) + '\n');

const cats = [...new Set(elements.map((e) => e.category))];
console.log(`Wrote ${elements.length} elements to src/data/elements.json`);
console.log('Categories:', cats.join(', '));
console.log('Max xpos:', Math.max(...elements.map((e) => e.xpos)), 'Max ypos:', Math.max(...elements.map((e) => e.ypos)));
