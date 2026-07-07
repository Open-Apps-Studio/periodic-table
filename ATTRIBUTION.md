# Data & Asset Attribution

| Source | Used for | License | Notes |
|---|---|---|---|
| [Bowserinator/Periodic-Table-JSON](https://github.com/Bowserinator/Periodic-Table-JSON) | Core element data: categories, grid positions, shells, electron configurations, ionization energies, summaries, image links | CC BY-SA 3.0 | `src/data/elements.json` is a derivative; treat the data file as CC BY-SA 3.0 |
| [PubChem Periodic Table](https://pubchem.ncbi.nlm.nih.gov/periodic-table/) (NLM/NCBI) | Density, atomic radius, oxidation states, year discovered | Public domain (US government work) | Fetched from the PUG REST `periodictable/CSV` endpoint |
| [periodic-table-data-complete](https://github.com/sweaver2112/periodic-table-data-complete) (Scott Weaver) | Extended element properties: valence electrons, radii, hardness, moduli, magnetic susceptibility, resistivity, specific heat, heat of fusion/vaporization, thermal expansion, electrical type/conductivity, Curie point, nuclear data, CID/RTECS identifiers | MIT | Aggregates [pTable.com](https://ptable.com), Wikipedia, and Bowserinator; stored as `data-sources/ptable-complete.json` |
| [Chemical elements by market price](http://www.leonland.de/elements_by_price/en/list) (Leon Becker) | Indicative market prices converted to USD/kg and USD/100g, with reference unit/date/source metadata | CC BY-SA 4.0 | Prices vary heavily by purity, quantity, supplier, and date; stored as `data-sources/leonland-prices.json` |
| [Wikidata Query Service](https://query.wikidata.org/) | Element Wikidata IDs, name-origin labels, and supplemental discovery metadata | CC0 | Stored as `data-sources/wikidata-elements.json`; refreshed with `scripts/fetch-wikidata-elements.mjs` |
| [IAEA LiveChart Data Download API](https://www-nds.iaea.org/relnsd/vcharthtml/api_v0_guide.html) | 3,383 nuclide rows: half-life, decay modes, natural abundance, spin/parity, atomic mass, binding energy, nuclear moments, discovery year | IAEA website terms: free educational/informational database use with acknowledgement | Stored as `data-sources/iaea-ground-states.csv`; generated into `src/data/nuclides.json`. IAEA cites ENSDF, AME2020, NUBASE2020, Angeli/Marinova, and related nuclear-data evaluations for underlying fields. |
| [images-of-elements.com](https://images-of-elements.com) ("Chemical Elements: A Virtual Museum") | Element photographs | CC BY 3.0 | Per-image attribution is stored in `elements.json` (`image.attribution`) and shown in the app under each photo |
| Wikipedia | Element summaries (via Bowserinator), "read more" links | CC BY-SA 4.0 | |
| [OpenStax Chemistry 2e](https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions) | Introductory solubility-rule guidance and reaction category examples: precipitation, acid-base, redox, combustion, decomposition, synthesis, gas-forming reactions | CC BY 4.0 | Rules are summarized and adapted into `src/data/reference-tables.ts`; reaction examples are curated/adapted into `src/data/reactions.ts` |
| [OpenStax Chemistry 2e key terms and topic summaries](https://openstax.org/books/chemistry-2e/pages/2-key-terms) | Glossary categories, compact term definitions, and Academy lesson topics: atoms, periodic trends, bonding, reactions, solutions, and nuclear chemistry | CC BY 4.0 / OpenStax attribution terms | Content is summarized and adapted into `src/data/learning.ts` rather than copied as full textbook passages. |
| [NIST CODATA](https://physics.nist.gov/cuu/Constants/) and IUPAC standard-pressure guidance | Chemistry constants/reference values | Public domain / open reference data | Constants are copied as short factual values in `src/data/reference-tables.ts` |
| [Ionicons](https://ionic.io/ionicons) via `@expo/vector-icons` | UI icons | MIT | |

## Audit notes

- The Bohr model images/GLB models referenced by Bowserinator's dataset are hosted on Google's `search-ar-edu` storage. The app shows internally generated shell diagrams and links out to the hosted 3D model URL rather than bundling those models.
- GPL-licensed apps (Atomic Periodic Table for Android, PocketChem) were used as **product inspiration only** — no code or assets were copied.
