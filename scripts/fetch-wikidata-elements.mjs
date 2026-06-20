/**
 * Downloads CC0 chemical-element metadata from Wikidata.
 *
 * Output: data-sources/wikidata-elements.json
 * Run: node scripts/fetch-wikidata-elements.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const query = `
SELECT
  ?element
  ?elementLabel
  ?atomicNumber
  ?symbol
  (GROUP_CONCAT(DISTINCT ?namedAfterLabel; separator="; ") AS ?nameOrigin)
  (GROUP_CONCAT(DISTINCT ?discovererLabel; separator="; ") AS ?discoverers)
  (GROUP_CONCAT(DISTINCT ?locationLabel; separator="; ") AS ?discoveryLocations)
WHERE {
  ?element wdt:P31 wd:Q11344;
           wdt:P1086 ?atomicNumber.
  OPTIONAL { ?element wdt:P246 ?symbol. }
  OPTIONAL {
    ?element wdt:P138 ?namedAfter.
    FILTER(STRSTARTS(STR(?namedAfter), "http://www.wikidata.org/entity/"))
  }
  OPTIONAL {
    ?element wdt:P61 ?discoverer.
    FILTER(STRSTARTS(STR(?discoverer), "http://www.wikidata.org/entity/"))
  }
  OPTIONAL {
    ?element wdt:P189 ?location.
    FILTER(STRSTARTS(STR(?location), "http://www.wikidata.org/entity/"))
  }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en".
    ?element rdfs:label ?elementLabel.
    ?namedAfter rdfs:label ?namedAfterLabel.
    ?discoverer rdfs:label ?discovererLabel.
    ?location rdfs:label ?locationLabel.
  }
}
GROUP BY ?element ?elementLabel ?atomicNumber ?symbol
ORDER BY xsd:integer(?atomicNumber)
`;

const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`;
const response = await fetch(url, {
  headers: {
    Accept: 'application/sparql-results+json',
    'User-Agent': 'periodic-table-open-source/1.0 (data refresh; https://github.com/)',
  },
});

if (!response.ok) {
  throw new Error(`Wikidata request failed: ${response.status} ${response.statusText}`);
}

const json = await response.json();
const rows = json.results.bindings
  .map((binding) => {
    const number = Number(binding.atomicNumber?.value);
    const id = binding.element?.value?.split('/').pop() ?? null;
    return {
      number,
      symbol: binding.symbol?.value || null,
      wikidataId: id,
      wikidataUrl: id ? `https://www.wikidata.org/wiki/${id}` : null,
      wikidataLabel: binding.elementLabel?.value || null,
      nameOrigin: binding.nameOrigin?.value || null,
      discoverers: binding.discoverers?.value || null,
      discoveryLocations: binding.discoveryLocations?.value || null,
    };
  })
  .filter((row) => Number.isInteger(row.number) && row.number >= 1 && row.number <= 118)
  .sort((a, b) => a.number - b.number);

if (rows.length !== 118) {
  throw new Error(`Expected 118 Wikidata element rows, received ${rows.length}`);
}

mkdirSync(join(root, 'data-sources'), { recursive: true });
writeFileSync(join(root, 'data-sources/wikidata-elements.json'), JSON.stringify(rows, null, 2) + '\n');
console.log('Wrote 118 Wikidata element rows to data-sources/wikidata-elements.json');
