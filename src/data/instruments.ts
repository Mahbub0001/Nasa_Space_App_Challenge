import { Instrument } from '../types/mission';

export const INSTRUMENTS: Instrument[] = [
  {
    id: 'spectrometer',
    name: 'Infrared & UV Spectrometer Suite',
    category: 'Mineralogy & Chemical Composition',
    purpose: 'Analyze elemental and mineralogical surface signatures, atmospheric volatiles, and signature absorption bands.',
    scienceImpact: 18,
    massKg: 120,
    powerDraw: 12,
    costPct: 8,
    costBillion: 0.19,
    description: 'High-dispersion optical diffraction gratings for detecting hydrated minerals, clays, and volatile traces from orbit.',
    visualBay: 'port'
  },
  {
    id: 'radar',
    name: 'Synthetic Aperture Subsurface Radar',
    category: 'Geophysics & Subsurface Sounding',
    purpose: 'Penetrate planetary regolith to map buried structures, subsurface ice horizons, and structural tectonic faults.',
    scienceImpact: 22,
    massKg: 180,
    powerDraw: 18,
    costPct: 10,
    costBillion: 0.24,
    description: 'Dual-frequency dipole antenna array capable of transmitting high-power RF pulses to map dielectric permittivity underground.',
    visualBay: 'ventral'
  },
  {
    id: 'imaging_system',
    name: 'High-Resolution Multispectral Imager',
    category: 'Cartography & Geomorphology',
    purpose: 'Capture sub-meter topographic stereoscopic photography to assess surface dynamics, morphology, and landing hazards.',
    scienceImpact: 14,
    massKg: 80,
    powerDraw: 8,
    costPct: 6,
    costBillion: 0.14,
    description: 'Folded-Cassegrain optical telescope with time-delay integration CCD sensors offering panchromatic 25cm/pixel resolution.',
    visualBay: 'bow'
  },
  {
    id: 'radiation_detector',
    name: 'Energetic Particle & Gamma Spectrometer',
    category: 'Space Environment & Astrobiology',
    purpose: 'Measure galactic cosmic rays, solar energetic particle flux, and surface-induced neutron radiation.',
    scienceImpact: 10,
    massKg: 40,
    powerDraw: 5,
    costPct: 3,
    costBillion: 0.07,
    description: 'Silicon solid-state detectors with bismuth germanate scintillators mapping interplanetary and orbital biological radiation hazard doses.',
    visualBay: 'starboard'
  },
  {
    id: 'atmospheric_sensor',
    name: 'Atmospheric Sounder & Mass Spectrometer',
    category: 'Aeronomy & Climate Science',
    purpose: 'Profile atmospheric pressure, isotopic ratios, trace organic compounds, and temperature inversion layers.',
    scienceImpact: 16,
    massKg: 70,
    powerDraw: 9,
    costPct: 5,
    costBillion: 0.12,
    description: 'Quadrupole mass analyzer and limb-sounding radiometer studying seasonal carbon dioxide cycles and upper atmosphere atmospheric escape.',
    visualBay: 'dorsal'
  }
];
