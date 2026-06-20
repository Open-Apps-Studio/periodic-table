/**
 * Builds the isotope/nuclide browser dataset from the IAEA LiveChart API CSV.
 *
 * Source file:
 *   data-sources/iaea-ground-states.csv
 *
 * Refresh command:
 *   curl -L -A 'Mozilla/5.0 (Macintosh; Intel Mac OS X) PeriodicTableOpenSource/1.0' \
 *     'https://nds.iaea.org/relnsd/v1/data?fields=ground_states&nuclides=all' \
 *     -o data-sources/iaea-ground-states.csv
 *
 * Output:
 *   src/data/nuclides.json
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c !== '\r') field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const num = (value) => {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const str = (value) => (typeof value === 'string' && value.trim() ? value.trim() : null);

const decayModes = (row) =>
  [1, 2, 3]
    .map((index) => ({
      mode: str(row[`decay_${index}`]),
      intensityPercent: num(row[`decay_${index}_%`]),
      uncertainty: str(row[`unc_${index}`]),
    }))
    .filter((item) => item.mode);

const source = readFileSync(join(root, 'data-sources/iaea-ground-states.csv'), 'utf8');
const [header, ...rows] = parseCsv(source);

const rawNuclides = rows
  .filter((row) => row.length === header.length)
  .map((row) => Object.fromEntries(header.map((key, index) => [key, row[index] ?? ''])));

const nuclides = rawNuclides
  .map((row) => {
    const z = num(row.z);
    const n = num(row.n);
    if (z == null || n == null || z < 1 || z > 118) return null;
    const symbol = str(row.symbol);
    if (!symbol) return null;
    const massNumber = z + n;
    const halfLife = str(row.half_life);
    const halfLifeSeconds = num(row.half_life_sec);
    const stable = halfLife === 'STABLE';
    return {
      id: `${massNumber}${symbol}`,
      z,
      n,
      massNumber,
      symbol,
      display: `${massNumber}${symbol}`,
      stable,
      halfLife: stable ? 'Stable' : halfLife,
      halfLifeOperator: str(row.operator_hl),
      halfLifeUnit: str(row.unit_hl),
      halfLifeSeconds,
      abundancePercent: num(row.abundance),
      spinParity: str(row.jp),
      decayModes: decayModes(row),
      atomicMass: num(row.atomic_mass) == null ? null : num(row.atomic_mass) / 1_000_000,
      massExcessKev: num(row.massexcess),
      bindingEnergyPerNucleonKev: num(row.binding),
      chargeRadiusFm: num(row.radius),
      magneticDipole: num(row.magnetic_dipole),
      electricQuadrupole: num(row.electric_quadrupole),
      neutronSeparationEnergyKev: num(row.sn),
      protonSeparationEnergyKev: num(row.sp),
      qAlphaKev: num(row.qa),
      qElectronCaptureKev: num(row.qec),
      discoveryYear: num(row.discovery),
      extractionDate: str(row.Extraction_date),
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.z - b.z || a.massNumber - b.massNumber);

const outDir = join(root, 'src/data');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'nuclides.json'), JSON.stringify(nuclides, null, 1) + '\n');

const stableCount = nuclides.filter((n) => n.stable).length;
const naturalCount = nuclides.filter((n) => n.abundancePercent != null).length;
console.log(`Wrote ${nuclides.length} nuclides to src/data/nuclides.json`);
console.log(`Stable: ${stableCount}, natural abundance rows: ${naturalCount}`);
