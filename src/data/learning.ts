export type GlossaryCategory =
  | 'atoms'
  | 'periodic-table'
  | 'bonding'
  | 'reactions'
  | 'solutions'
  | 'nuclear'
  | 'measurement';

export interface GlossaryEntry {
  term: string;
  category: GlossaryCategory;
  definition: string;
  example: string;
  tags: string[];
}

export interface AcademyLesson {
  id: string;
  title: string;
  category: GlossaryCategory;
  summary: string;
  keyIdeas: string[];
  example: string;
  check: {
    prompt: string;
    answer: string;
  };
  tags: string[];
}

export const CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  atoms: 'Atoms',
  'periodic-table': 'Periodic table',
  bonding: 'Bonding',
  reactions: 'Reactions',
  solutions: 'Solutions',
  nuclear: 'Nuclear',
  measurement: 'Measurement',
};

export const GLOSSARY: GlossaryEntry[] = [
  { term: 'Atom', category: 'atoms', definition: 'Smallest unit of an element that keeps that element’s chemical identity.', example: 'A neutral carbon atom has 6 protons and 6 electrons.', tags: ['element', 'matter'] },
  { term: 'Atomic number', category: 'atoms', definition: 'Number of protons in an atom’s nucleus; it identifies the element.', example: 'All oxygen atoms have atomic number 8.', tags: ['protons', 'z'] },
  { term: 'Mass number', category: 'atoms', definition: 'Total number of protons plus neutrons in one atom or nuclide.', example: 'Carbon-14 has mass number 14.', tags: ['isotope', 'nucleons'] },
  { term: 'Proton', category: 'atoms', definition: 'Positively charged subatomic particle in the nucleus.', example: 'Hydrogen has one proton.', tags: ['nucleus', 'charge'] },
  { term: 'Neutron', category: 'atoms', definition: 'Uncharged subatomic particle in the nucleus.', example: 'Deuterium has one proton and one neutron.', tags: ['nucleus', 'isotope'] },
  { term: 'Electron', category: 'atoms', definition: 'Negatively charged particle occupying regions around the nucleus.', example: 'A neutral sodium atom has 11 electrons.', tags: ['charge', 'shell'] },
  { term: 'Ion', category: 'atoms', definition: 'Atom or group of atoms with a net electric charge.', example: 'Na+ and Cl- are ions.', tags: ['cation', 'anion'] },
  { term: 'Cation', category: 'atoms', definition: 'Positively charged ion formed by losing electrons.', example: 'Calcium commonly forms Ca2+.', tags: ['ion', 'positive'] },
  { term: 'Anion', category: 'atoms', definition: 'Negatively charged ion formed by gaining electrons.', example: 'Chlorine commonly forms Cl-.', tags: ['ion', 'negative'] },
  { term: 'Isotope', category: 'nuclear', definition: 'Atoms of the same element with different neutron counts.', example: 'Carbon-12 and carbon-14 are isotopes.', tags: ['nuclide', 'neutron'] },
  { term: 'Nuclide', category: 'nuclear', definition: 'A specific nucleus identified by proton number, neutron number, and energy state.', example: '14C is a nuclide of carbon.', tags: ['isotope', 'nucleus'] },
  { term: 'Half-life', category: 'nuclear', definition: 'Time required for half of a radioactive sample’s nuclei to decay.', example: 'Carbon-14 has a half-life of about 5730 years.', tags: ['radioactive', 'decay'] },
  { term: 'Alpha decay', category: 'nuclear', definition: 'Radioactive decay that emits a helium-4 nucleus.', example: 'Many heavy nuclei decay by alpha emission.', tags: ['radiation', 'helium'] },
  { term: 'Beta decay', category: 'nuclear', definition: 'Radioactive decay involving conversion between neutron and proton with beta particle emission.', example: 'Tritium decays by beta-minus emission.', tags: ['radiation', 'electron'] },
  { term: 'Gamma radiation', category: 'nuclear', definition: 'High-energy electromagnetic radiation emitted by an excited nucleus.', example: 'Gamma emission often follows nuclear decay.', tags: ['radiation', 'energy'] },
  { term: 'Molecule', category: 'bonding', definition: 'Two or more atoms held together as a discrete unit.', example: 'O2 and H2O are molecules.', tags: ['compound', 'covalent'] },
  { term: 'Compound', category: 'bonding', definition: 'Substance made from atoms of two or more elements in fixed ratios.', example: 'NaCl contains sodium and chlorine.', tags: ['formula', 'substance'] },
  { term: 'Ionic compound', category: 'bonding', definition: 'Compound made of cations and anions balanced to an overall neutral charge.', example: 'MgCl2 contains Mg2+ and Cl- ions.', tags: ['ion', 'salt'] },
  { term: 'Molecular compound', category: 'bonding', definition: 'Compound made of molecules formed by covalently bonded atoms.', example: 'CO2 is a molecular compound.', tags: ['covalent', 'molecule'] },
  { term: 'Covalent bond', category: 'bonding', definition: 'Bond formed when atoms share electron pairs.', example: 'The H-H bond in H2 is covalent.', tags: ['electron', 'sharing'] },
  { term: 'Ionic bond', category: 'bonding', definition: 'Electrostatic attraction between oppositely charged ions.', example: 'Na+ and Cl- attract in sodium chloride.', tags: ['salt', 'charge'] },
  { term: 'Electronegativity', category: 'bonding', definition: 'Tendency of an atom to attract shared electrons in a bond.', example: 'Fluorine is highly electronegative.', tags: ['polarity', 'bond'] },
  { term: 'Polar covalent bond', category: 'bonding', definition: 'Covalent bond with unequal sharing of electrons.', example: 'O-H bonds are polar.', tags: ['electronegativity', 'dipole'] },
  { term: 'Lewis structure', category: 'bonding', definition: 'Diagram showing valence electrons, lone pairs, and bonds.', example: 'Water has two O-H bonds and two lone pairs on oxygen.', tags: ['valence', 'octet'] },
  { term: 'Octet rule', category: 'bonding', definition: 'Main-group atoms often form arrangements with eight valence electrons around each atom.', example: 'Neon already has a filled octet.', tags: ['valence', 'lewis'] },
  { term: 'Resonance', category: 'bonding', definition: 'Situation where multiple Lewis structures describe one delocalized electron arrangement.', example: 'Nitrate has resonance forms.', tags: ['lewis', 'delocalized'] },
  { term: 'Valence electron', category: 'periodic-table', definition: 'Outer-shell electron most involved in bonding and ion formation.', example: 'Group 1 elements have one valence electron.', tags: ['shell', 'bonding'] },
  { term: 'Electron configuration', category: 'periodic-table', definition: 'Notation describing how electrons occupy atomic orbitals or shells.', example: 'Neon is 1s2 2s2 2p6.', tags: ['orbital', 'shell'] },
  { term: 'Atomic radius', category: 'periodic-table', definition: 'A measure of atomic size, often based on distances between bonded nuclei.', example: 'Atomic radius generally increases down a group.', tags: ['trend', 'size'] },
  { term: 'Ionization energy', category: 'periodic-table', definition: 'Energy required to remove an electron from a gaseous atom or ion.', example: 'Noble gases have high first ionization energies.', tags: ['trend', 'electron'] },
  { term: 'Electron affinity', category: 'periodic-table', definition: 'Energy change when an electron is added to a gaseous atom.', example: 'Halogens often have favorable electron affinities.', tags: ['trend', 'anion'] },
  { term: 'Periodic law', category: 'periodic-table', definition: 'Element properties repeat in patterns when elements are ordered by atomic number.', example: 'Alkali metals share similar reactions.', tags: ['trend', 'table'] },
  { term: 'Group', category: 'periodic-table', definition: 'Vertical column of the periodic table.', example: 'Group 18 contains noble gases.', tags: ['family', 'column'] },
  { term: 'Period', category: 'periodic-table', definition: 'Horizontal row of the periodic table.', example: 'Lithium through neon are in period 2.', tags: ['row', 'table'] },
  { term: 'Metal', category: 'periodic-table', definition: 'Element that is usually shiny, malleable, and a good conductor.', example: 'Copper is a metal.', tags: ['conductor', 'element'] },
  { term: 'Nonmetal', category: 'periodic-table', definition: 'Element that is usually a poor conductor and often forms anions or covalent bonds.', example: 'Sulfur is a nonmetal.', tags: ['element', 'anion'] },
  { term: 'Metalloid', category: 'periodic-table', definition: 'Element with properties between metals and nonmetals.', example: 'Silicon is a metalloid.', tags: ['semiconductor', 'element'] },
  { term: 'Mole', category: 'measurement', definition: 'Amount containing 6.02214076 x 10^23 specified particles.', example: 'One mole of carbon-12 atoms has mass 12 g.', tags: ['avogadro', 'amount'] },
  { term: 'Molar mass', category: 'measurement', definition: 'Mass of one mole of a substance.', example: 'Water is about 18.015 g/mol.', tags: ['formula', 'mass'] },
  { term: 'Empirical formula', category: 'measurement', definition: 'Formula showing the simplest whole-number ratio of atoms.', example: 'CH2O is the empirical formula of glucose.', tags: ['formula', 'ratio'] },
  { term: 'Molecular formula', category: 'measurement', definition: 'Formula showing actual atom counts in one molecule.', example: 'Glucose has molecular formula C6H12O6.', tags: ['formula', 'molecule'] },
  { term: 'Molarity', category: 'solutions', definition: 'Solution concentration measured as moles of solute per liter of solution.', example: '0.50 M NaCl has 0.50 mol NaCl per liter.', tags: ['concentration', 'solution'] },
  { term: 'Solute', category: 'solutions', definition: 'Substance dissolved in a solution.', example: 'Salt is the solute in salt water.', tags: ['solution', 'dissolve'] },
  { term: 'Solvent', category: 'solutions', definition: 'Substance that dissolves the solute.', example: 'Water is the solvent in salt water.', tags: ['solution', 'dissolve'] },
  { term: 'Solubility', category: 'solutions', definition: 'Amount of a substance that can dissolve under specified conditions.', example: 'AgCl has low solubility in water.', tags: ['solution', 'precipitate'] },
  { term: 'Precipitate', category: 'reactions', definition: 'Insoluble solid that forms from a reaction in solution.', example: 'AgCl(s) forms when Ag+ meets Cl-.', tags: ['solid', 'solution'] },
  { term: 'Acid', category: 'reactions', definition: 'Substance that donates H+ or increases hydronium in water.', example: 'HCl is a strong acid.', tags: ['base', 'ph'] },
  { term: 'Base', category: 'reactions', definition: 'Substance that accepts H+ or increases hydroxide in water.', example: 'NaOH is a strong base.', tags: ['acid', 'ph'] },
  { term: 'pH', category: 'solutions', definition: 'Logarithmic measure of hydrogen ion activity in a solution.', example: 'A solution with pH 2 is acidic.', tags: ['acid', 'base'] },
  { term: 'Redox reaction', category: 'reactions', definition: 'Reaction involving electron transfer and changes in oxidation state.', example: 'Magnesium burning in oxygen is redox.', tags: ['oxidation', 'reduction'] },
  { term: 'Oxidation state', category: 'reactions', definition: 'Bookkeeping charge assigned to an atom to track electron transfer.', example: 'Oxygen is usually -2 in compounds.', tags: ['redox', 'charge'] },
  { term: 'Catalyst', category: 'reactions', definition: 'Substance that speeds a reaction without being consumed overall.', example: 'MnO2 catalyzes KClO3 decomposition.', tags: ['rate', 'reaction'] },
  { term: 'Equilibrium', category: 'reactions', definition: 'State where forward and reverse reaction rates are equal.', example: 'Dissolution and precipitation can reach equilibrium.', tags: ['rate', 'reversible'] },
  { term: 'Hydrate', category: 'measurement', definition: 'Compound containing water molecules in a fixed ratio in its crystal structure.', example: 'CuSO4·5H2O is copper(II) sulfate pentahydrate.', tags: ['formula', 'water'] },
  { term: 'Allotrope', category: 'periodic-table', definition: 'Different structural form of the same element.', example: 'Diamond and graphite are carbon allotropes.', tags: ['element', 'structure'] },
];

export const ACADEMY_LESSONS: AcademyLesson[] = [
  {
    id: 'periodic-trends',
    title: 'Periodic Trends',
    category: 'periodic-table',
    summary: 'Element properties repeat because valence electron patterns repeat across the table.',
    keyIdeas: [
      'Atomic radius usually decreases left to right across a period.',
      'Atomic radius usually increases down a group.',
      'First ionization energy usually increases across a period and decreases down a group.',
      'Electron affinity and electronegativity are strongest near the upper-right nonmetals.',
    ],
    example: 'Fluorine is small and strongly attracts bonding electrons; cesium is large and readily loses its valence electron.',
    check: {
      prompt: 'Which is usually larger: chlorine or bromine?',
      answer: 'Bromine. It is below chlorine, so its outer electrons occupy a higher shell.',
    },
    tags: ['radius', 'ionization', 'electronegativity'],
  },
  {
    id: 'atoms-isotopes',
    title: 'Atoms, Isotopes, Nuclides',
    category: 'nuclear',
    summary: 'Atomic number identifies the element; neutron count distinguishes isotopes.',
    keyIdeas: [
      'Protons set the atomic number.',
      'Mass number equals protons plus neutrons.',
      'Isotopes of one element have the same proton count and different neutron counts.',
      'A nuclide names one exact nucleus, such as carbon-14.',
    ],
    example: 'Carbon-12 and carbon-14 both have 6 protons, but carbon-14 has two extra neutrons.',
    check: {
      prompt: 'How many neutrons are in oxygen-18?',
      answer: '10 neutrons: mass number 18 minus atomic number 8.',
    },
    tags: ['isotope', 'nuclide', 'mass number'],
  },
  {
    id: 'ion-formation',
    title: 'Ion Formation',
    category: 'atoms',
    summary: 'Main-group atoms often form ions that reach noble-gas-like electron counts.',
    keyIdeas: [
      'Metals commonly lose electrons and become cations.',
      'Nonmetals commonly gain electrons and become anions.',
      'Group 1 metals often form +1 ions; group 2 metals often form +2 ions.',
      'Halogens often form -1 ions.',
    ],
    example: 'Magnesium tends to form Mg2+; chlorine tends to form Cl-.',
    check: {
      prompt: 'What charge is common for a sodium ion?',
      answer: '+1, because sodium commonly loses one valence electron.',
    },
    tags: ['cation', 'anion', 'noble gas'],
  },
  {
    id: 'bonding-polarity',
    title: 'Bonding and Polarity',
    category: 'bonding',
    summary: 'Bond type depends strongly on how atoms share or transfer electrons.',
    keyIdeas: [
      'Covalent bonds share electrons.',
      'Ionic bonding comes from attraction between ions.',
      'Electronegativity difference helps predict bond polarity.',
      'Polar molecules have an uneven charge distribution overall.',
    ],
    example: 'H-Cl is polar covalent because chlorine attracts the shared electrons more strongly.',
    check: {
      prompt: 'Why is O2 nonpolar?',
      answer: 'Both atoms are oxygen, so the bond electrons are shared equally.',
    },
    tags: ['covalent', 'ionic', 'electronegativity'],
  },
  {
    id: 'reaction-types',
    title: 'Reaction Types',
    category: 'reactions',
    summary: 'Common reaction patterns help predict products and observations.',
    keyIdeas: [
      'Precipitation reactions form insoluble solids.',
      'Acid-base reactions transfer H+.',
      'Redox reactions transfer electrons or change oxidation states.',
      'Combustion of hydrocarbons with enough oxygen forms CO2 and H2O.',
    ],
    example: 'AgNO3 + NaCl forms solid AgCl, so it is a precipitation reaction.',
    check: {
      prompt: 'What type of reaction is CH4 + O2 -> CO2 + H2O?',
      answer: 'Combustion and redox.',
    },
    tags: ['precipitation', 'acid-base', 'redox'],
  },
  {
    id: 'moles-solutions',
    title: 'Moles and Solutions',
    category: 'solutions',
    summary: 'The mole connects particle counts, mass, and solution concentration.',
    keyIdeas: [
      'One mole is 6.02214076 x 10^23 particles.',
      'Molar mass converts between grams and moles.',
      'Molarity equals moles of solute per liter of solution.',
      'Formula subscripts control molar mass and percent composition.',
    ],
    example: '5.00 g NaCl is converted to moles by dividing by NaCl molar mass.',
    check: {
      prompt: 'What does 1.0 M NaCl mean?',
      answer: '1.0 mole of NaCl per liter of solution.',
    },
    tags: ['mole', 'molarity', 'molar mass'],
  },
  {
    id: 'solubility-rules',
    title: 'Solubility Rules',
    category: 'solutions',
    summary: 'Simple ion rules predict many precipitates in water.',
    keyIdeas: [
      'Nitrates and Group 1 salts are usually soluble.',
      'Many chlorides are soluble except with Ag+, Pb2+, and Hg2 2+.',
      'Many carbonates and phosphates are insoluble except with Group 1 or NH4+.',
      'Sulfates are often soluble, but BaSO4, SrSO4, and PbSO4 are insoluble.',
    ],
    example: 'Ba2+ plus SO4 2- gives BaSO4(s), a white precipitate.',
    check: {
      prompt: 'Why does AgCl form a solid in water?',
      answer: 'Silver chloride is an exception to the usual solubility of chlorides.',
    },
    tags: ['precipitate', 'ions', 'aqueous'],
  },
  {
    id: 'radioactivity',
    title: 'Radioactivity Basics',
    category: 'nuclear',
    summary: 'Unstable nuclei change over time by emitting particles or energy.',
    keyIdeas: [
      'Half-life is statistical: each interval halves the remaining radioactive nuclei.',
      'Alpha decay lowers mass number by 4 and atomic number by 2.',
      'Beta-minus decay converts a neutron into a proton.',
      'Gamma emission releases energy without changing atomic number or mass number.',
    ],
    example: 'Tritium decays by beta-minus emission to helium-3.',
    check: {
      prompt: 'After two half-lives, what fraction of a radioactive sample remains?',
      answer: 'One quarter remains.',
    },
    tags: ['half-life', 'decay', 'radiation'],
  },
];
