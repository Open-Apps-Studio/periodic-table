/**
 * Fetches GHS hazard classification (signal word, pictograms, H-statements)
 * for every element from PubChem PUG-View.
 *
 * Source preference per element: the EU harmonised classification
 * (Regulation (EC) No 1272/2008, CC BY 4.0), then ECHA's C&L inventory
 * (reuse permitted with acknowledgement). Elements with neither get no entry.
 *
 * Output: data-sources/pubchem-ghs.json, consumed by build-elements.mjs.
 * Run: node scripts/fetch-ghs.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const elements = JSON.parse(readFileSync(join(root, 'src/data/elements.json'), 'utf8'));

const SOURCE_PREFERENCE = ['Regulation (EC) No 1272/2008', 'European Chemicals Agency (ECHA)'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findSection(node, heading) {
  if (Array.isArray(node)) {
    for (const child of node) {
      const hit = findSection(child, heading);
      if (hit) return hit;
    }
  } else if (node && typeof node === 'object') {
    if (node.TOCHeading === heading) return node;
    for (const value of Object.values(node)) {
      const hit = findSection(value, heading);
      if (hit) return hit;
    }
  }
  return null;
}

async function fetchGhs(cid) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=GHS+Classification`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url);
    if (res.status === 404) return null;
    if (res.ok) return res.json();
    await sleep(1000 * (attempt + 1));
  }
  return null;
}

function parse(record) {
  const section = findSection(record, 'GHS Classification');
  if (!section) return null;
  const references = new Map((record.Record?.Reference ?? []).map((r) => [r.ReferenceNumber, r]));

  // Group the Information rows by the source they came from.
  const bySource = new Map();
  for (const info of section.Information ?? []) {
    const ref = references.get(info.ReferenceNumber);
    if (!ref) continue;
    const key = SOURCE_PREFERENCE.find((p) => ref.SourceName.startsWith(p));
    if (!key) continue;
    const entry = bySource.get(key) ?? { source: ref.SourceName, sourceUrl: ref.URL, substance: ref.Name, rows: [] };
    entry.rows.push(info);
    bySource.set(key, entry);
  }
  const chosen = SOURCE_PREFERENCE.map((p) => bySource.get(p)).find(Boolean);
  if (!chosen) return null;

  const strings = (info) => (info.Value?.StringWithMarkup ?? []);
  const row = (name) => chosen.rows.find((r) => r.Name === name);

  const harmonised = chosen.source.startsWith('Regulation');

  // ECHA aggregates supplier notifications: each H-statement carries the share of
  // reports that list it (often a fine powder form). Keep only majority hazards,
  // and record when most suppliers report no hazard at all.
  let notClassified = null;
  const m = JSON.stringify(chosen.rows).match(/not meeting GHS hazard criteria per (\d+) of (\d+) reports/);
  if (m) notClassified = { reports: Number(m[1]), total: Number(m[2]) };
  const hazards = [];
  for (const s of strings(row('GHS Hazard Statements') ?? {})) {
    const match = s.String.match(/^(H\d{3}[A-Za-z+H\d]*)\s*\**(?:\s*\(([\d.]+)%\))?:\s*([^[]+)/);
    if (!match || hazards.some((h) => h.code === match[1])) continue;
    const share = match[2] == null ? null : Number(match[2]);
    if (!harmonised && share != null && share < 50) continue;
    hazards.push({ code: match[1], text: match[3].trim() });
  }
  if (hazards.length === 0) {
    return notClassified && notClassified.reports * 2 > notClassified.total
      ? { source: chosen.source, sourceUrl: chosen.sourceUrl, substance: chosen.substance, signal: null, pictograms: [], hazards: [], notClassified }
      : null;
  }

  const pictograms = pictogramsFor(hazards.map((h) => h.code));
  const signal = harmonised
    ? strings(row('Signal') ?? {})[0]?.String?.trim() || signalFor(hazards.map((h) => h.code))
    : signalFor(hazards.map((h) => h.code));
  return { source: chosen.source, sourceUrl: chosen.sourceUrl, substance: chosen.substance, signal, pictograms, hazards, notClassified };
}

// Standard GHS pictogram per hazard statement (UN GHS Annex 3).
const PICTOGRAMS = [
  ['GHS01', 'Explosive', /^H(20[0-5]|24[01])/],
  ['GHS02', 'Flammable', /^H(22[0-8]|24[12]|25[0-2]|26[01])/],
  ['GHS03', 'Oxidizer', /^H27[0-2]/],
  ['GHS04', 'Compressed gas', /^H28[01]/],
  ['GHS05', 'Corrosive', /^H(290|314|318)/],
  ['GHS06', 'Acute toxic', /^H(30[01]|31[01]|33[01])/],
  ['GHS07', 'Irritant', /^H(302|312|315|317|319|332|335|336|420)/],
  ['GHS08', 'Health hazard', /^H(304|334|34[01]|35[01]|36[0-2]|37[0-3])/],
  ['GHS09', 'Environmental hazard', /^H(400|41[01])/],
];

function pictogramsFor(codes) {
  const out = PICTOGRAMS.filter(([, , re]) => codes.some((c) => re.test(c))).map(([code, label]) => ({ code, label }));
  // GHS rule: the exclamation mark is dropped when the skull is shown.
  return out.some((p) => p.code === 'GHS06') ? out.filter((p) => p.code !== 'GHS07') : out;
}

// "Danger" for the severe categories, otherwise "Warning".
function signalFor(codes) {
  const danger = /^H(20[0-2]|220|222|224|225|228|240|241|250|251|260|270|271|280|300|301|310|311|314|318|330|331|334|340|350|360|370|372)/;
  return codes.some((c) => danger.test(c)) ? 'Danger' : 'Warning';
}

const out = {};
for (const el of elements) {
  const cid = String(el.cidNumber ?? '').replace(/^CID/i, '');
  if (!cid) continue;
  const record = await fetchGhs(cid);
  const ghs = record ? parse(record) : null;
  if (ghs) out[el.number] = ghs;
  process.stdout.write(`${el.number} ${el.symbol}: ${ghs ? `${ghs.signal ?? '-'} ${ghs.pictograms.map((p) => p.code).join(',')}` : 'none'}\n`);
  await sleep(250); // PubChem asks for <= 5 requests/second
}

writeFileSync(join(root, 'data-sources/pubchem-ghs.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote GHS data for ${Object.keys(out).length} elements.`);
