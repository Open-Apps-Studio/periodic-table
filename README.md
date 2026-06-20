# Periodic Table

A free, open-source, ad-less periodic table app for iOS and Android, built with Expo / React Native. Inspired by the commercial "Periodic Table 2026" apps, powered entirely by open chemistry data.

## Features

- **Interactive periodic table** — pinch to zoom, pan, double-tap to zoom, all 118 elements in the standard 18-column layout with the f-block split out.
- **Property overlays** — color the table by category, atomic mass, density, electronegativity, melting/boiling point, atomic radius, year discovered, phase, or block. Numeric modes render as a heatmap.
- **Category legend** — tap a category (alkali metals, noble gases, …) to highlight just those elements.
- **Element cards** — photo with attribution, overview, Bohr shell diagram, physical/atomic/discovery properties, isotope counts, previous/next navigation, Wikipedia link.
- **Search** — find elements by name, symbol, or atomic number.
- **Isotope browser** — 3,383 IAEA LiveChart nuclides with half-life, decay modes, abundance, spin/parity, mass, binding energy, and discovery year.
- **Trend graphs** — chart element properties across the table, individual periods, or the f-block with tap-to-inspect bars and log-scale normalization.
- **Reactions & equations** — balance molecular equations and search common reaction examples with conditions, observations, and explanations.
- **Dictionary & Academy** — searchable glossary entries plus compact lesson cards with quick checks.
- **Molar mass calculator** — handles nested groups and hydrates: `H2SO4`, `Ca(OH)2`, `[Cu(NH3)4]SO4`, `CuSO4·5H2O`, with a per-element mass breakdown.
- **Reference tools** — offline solubility rules, common ions, organic/hydrocarbon series, and core chemistry constants.

## Running

```bash
npm install
npx expo start        # then press i / a, or scan with Expo Go
```

## Data

Element data is generated into [src/data/elements.json](src/data/elements.json) by the pipeline in [scripts/build-elements.mjs](scripts/build-elements.mjs), which merges:

- [Bowserinator/Periodic-Table-JSON](https://github.com/Bowserinator/Periodic-Table-JSON) (CC BY-SA 3.0)
- [PubChem Periodic Table](https://pubchem.ncbi.nlm.nih.gov/periodic-table/) (public domain, NLM/NCBI)
- [periodic-table-data-complete](https://github.com/sweaver2112/periodic-table-data-complete) (MIT; pTable-derived extended properties)
- [Chemical elements by market price](http://www.leonland.de/elements_by_price/en/list) (CC BY-SA 4.0; indicative market prices)
- [Wikidata](https://www.wikidata.org/wiki/Wikidata:Data_access) (CC0; name-origin and identifier/discovery metadata)

Nuclide/isotope data is generated into [src/data/nuclides.json](src/data/nuclides.json) by [scripts/build-nuclides.mjs](scripts/build-nuclides.mjs) from the [IAEA LiveChart API](https://www-nds.iaea.org/relnsd/vcharthtml/api_v0_guide.html).

To rebuild: re-download the sources into `data-sources/`, optionally refresh Wikidata with `node scripts/fetch-wikidata-elements.mjs`, then run `node scripts/build-elements.mjs` and `node scripts/build-nuclides.mjs`. See [ATTRIBUTION.md](ATTRIBUTION.md) for full credits.

## Roadmap

- Compound solubility predictor
- Offline image pack
- Localization

## License

MIT for the code. Element data and images keep their upstream licenses — see [ATTRIBUTION.md](ATTRIBUTION.md).
