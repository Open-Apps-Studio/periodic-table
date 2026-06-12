# Periodic Table

A free, open-source, ad-less periodic table app for iOS and Android, built with Expo / React Native. Inspired by the commercial "Periodic Table 2026" apps, powered entirely by open chemistry data.

## Features

- **Interactive periodic table** — pinch to zoom, pan, double-tap to zoom, all 118 elements in the standard 18-column layout with the f-block split out.
- **Property overlays** — color the table by category, atomic mass, density, electronegativity, melting/boiling point, atomic radius, year discovered, phase, or block. Numeric modes render as a heatmap.
- **Category legend** — tap a category (alkali metals, noble gases, …) to highlight just those elements.
- **Element cards** — photo with attribution, overview, Bohr shell diagram, physical/atomic/discovery properties, previous/next navigation, Wikipedia link.
- **Search** — find elements by name, symbol, or atomic number.
- **Molar mass calculator** — handles nested groups and hydrates: `H2SO4`, `Ca(OH)2`, `[Cu(NH3)4]SO4`, `CuSO4·5H2O`, with a per-element mass breakdown.

## Running

```bash
npm install
npx expo start        # then press i / a, or scan with Expo Go
```

## Data

All element data is generated into [src/data/elements.json](src/data/elements.json) by the pipeline in [scripts/build-elements.mjs](scripts/build-elements.mjs), which merges:

- [Bowserinator/Periodic-Table-JSON](https://github.com/Bowserinator/Periodic-Table-JSON) (CC BY-SA 3.0)
- [PubChem Periodic Table](https://pubchem.ncbi.nlm.nih.gov/periodic-table/) (public domain, NLM/NCBI)

To rebuild: re-download the sources into `data-sources/` and run `node scripts/build-elements.mjs`. See [ATTRIBUTION.md](ATTRIBUTION.md) for full credits.

## Roadmap

- Isotope browser (IAEA LiveChart / NUBASE)
- Solubility chart, reaction search, chemistry dictionary
- Element compare and property trend graphs
- Favorites and notes
- Offline image pack
- Localization

## License

MIT for the code. Element data and images keep their upstream licenses — see [ATTRIBUTION.md](ATTRIBUTION.md).
