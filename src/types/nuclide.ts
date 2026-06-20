export interface NuclideDecayMode {
  mode: string;
  intensityPercent: number | null;
  uncertainty: string | null;
}

export interface Nuclide {
  id: string;
  z: number;
  n: number;
  massNumber: number;
  symbol: string;
  display: string;
  stable: boolean;
  halfLife: string | null;
  halfLifeOperator: string | null;
  halfLifeUnit: string | null;
  /** Seconds, when IAEA provides a normalized value. */
  halfLifeSeconds: number | null;
  /** Natural abundance in percent, when known. */
  abundancePercent: number | null;
  spinParity: string | null;
  decayModes: NuclideDecayMode[];
  /** Atomic mass in unified atomic mass units. */
  atomicMass: number | null;
  /** keV */
  massExcessKev: number | null;
  /** keV */
  bindingEnergyPerNucleonKev: number | null;
  /** fm */
  chargeRadiusFm: number | null;
  magneticDipole: number | null;
  electricQuadrupole: number | null;
  /** keV */
  neutronSeparationEnergyKev: number | null;
  /** keV */
  protonSeparationEnergyKev: number | null;
  /** keV */
  qAlphaKev: number | null;
  /** keV */
  qElectronCaptureKev: number | null;
  discoveryYear: number | null;
  extractionDate: string | null;
}
