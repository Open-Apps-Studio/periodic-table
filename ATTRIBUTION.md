# Data & Asset Attribution

| Source | Used for | License | Notes |
|---|---|---|---|
| [Bowserinator/Periodic-Table-JSON](https://github.com/Bowserinator/Periodic-Table-JSON) | Core element data: categories, grid positions, shells, electron configurations, ionization energies, summaries, image links | CC BY-SA 3.0 | `src/data/elements.json` is a derivative; treat the data file as CC BY-SA 3.0 |
| [PubChem Periodic Table](https://pubchem.ncbi.nlm.nih.gov/periodic-table/) (NLM/NCBI) | Density, atomic radius, oxidation states, year discovered | Public domain (US government work) | Fetched from the PUG REST `periodictable/CSV` endpoint |
| [images-of-elements.com](https://images-of-elements.com) ("Chemical Elements: A Virtual Museum") | Element photographs | CC BY 3.0 | Per-image attribution is stored in `elements.json` (`image.attribution`) and shown in the app under each photo |
| Wikipedia | Element summaries (via Bowserinator), "read more" links | CC BY-SA 4.0 | |
| [Ionicons](https://ionic.io/ionicons) via `@expo/vector-icons` | UI icons | MIT | |

## Audit notes

- The Bohr model images/GLB models referenced by Bowserinator's dataset are hosted on Google's `search-ar-edu` storage with unclear licensing. The URLs are kept in `elements.json` (`bohrModelImage`) but **not displayed in the app** until the license is verified.
- GPL-licensed apps (Atomic Periodic Table for Android, PocketChem) were used as **product inspiration only** — no code or assets were copied.
