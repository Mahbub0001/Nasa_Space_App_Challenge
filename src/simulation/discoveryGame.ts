import type { MissionConfiguration, ScienceDiscovery, InstrumentId } from '../types/mission';

interface DiscoveryDefinition {
  instrumentId: InstrumentId;
  instrumentName: string;
  mars: {
    title: string;
    headline: string;
    evidence: string;
    scientificImpact: string;
    sciencePoints: number;
    rarity: 'Common' | 'Breakthrough' | 'Historic';
  };
  lunar_orbit: {
    title: string;
    headline: string;
    evidence: string;
    scientificImpact: string;
    sciencePoints: number;
    rarity: 'Common' | 'Breakthrough' | 'Historic';
  };
  asteroid_belt: {
    title: string;
    headline: string;
    evidence: string;
    scientificImpact: string;
    sciencePoints: number;
    rarity: 'Common' | 'Breakthrough' | 'Historic';
  };
}

const DISCOVERY_DEFINITIONS: Record<InstrumentId, DiscoveryDefinition> = {
  radar: {
    instrumentId: 'radar',
    instrumentName: 'Synthetic Aperture Radar (SAR)',
    mars: {
      title: 'Subsurface Glacial Ice Sheet Discovered',
      headline: 'Permittivity reflections reveal a 45-meter thick cryogenic ice slab beneath 2m of Martian regolith.',
      evidence: 'Low-loss radar echo returns at 15 MHz penetration frequency, indicating high dielectric contrast typical of pure water-ice deposits.',
      scientificImpact: 'Confirms abundant localized in-situ water resources (ISRU) for future crewed Artemis/Mars surface expeditions.',
      sciencePoints: 34,
      rarity: 'Historic',
    },
    lunar_orbit: {
      title: 'Permanently Shadowed Volatile Ice Slab',
      headline: 'Deep radar penetration inside polar cold traps confirms hydrogen-rich subsurface cryogenic deposits.',
      evidence: 'Circular polarization ratio (CPR) values exceeding 1.2 across lunar crater interior slopes matching pure water-ice signatures.',
      scientificImpact: 'Provides direct operational validation of lunar ice reservoirs accessible for life support and propellant electrolysis.',
      sciencePoints: 32,
      rarity: 'Historic',
    },
    asteroid_belt: {
      title: 'Internal Structural Porosity & Rubble Cohesion',
      headline: 'Radar tomographic slice reveals multi-density rubble-pile core with 42% internal macroporosity.',
      evidence: 'Multi-static delay-Doppler imaging showing absence of monolithic basaltic core.',
      scientificImpact: 'Transforms understanding of asteroid collision dynamics and kinetic impact deflection physics.',
      sciencePoints: 28,
      rarity: 'Breakthrough',
    },
  },
  spectrometer: {
    instrumentId: 'spectrometer',
    instrumentName: 'High-Resolution Infrared Spectrometer',
    mars: {
      title: 'Prebiotic Polycyclic Carbon Biomarkers',
      headline: 'Characteristic spectral peaks indicate complex aromatic carbon rings in delta mudstones.',
      evidence: 'Strong D and G vibrational band shifts at 1350 and 1600 cm⁻¹ matching terrestrial kerogen biosignatures.',
      scientificImpact: 'Strongest evidence yet of ancient organic molecular preservation inside a 3.5-billion-year-old lacustrine ecosystem.',
      sciencePoints: 38,
      rarity: 'Historic',
    },
    lunar_orbit: {
      title: 'Solar Wind Implanted Volatiles & OH/H2O Peaks',
      headline: 'Infrared absorption bands reveal hydroxyl and molecular water bound inside lunar regolith grain lattices.',
      evidence: 'Prominent 2.8 to 3.0 micrometer spectral absorption dip across high-latitude highlands.',
      scientificImpact: 'Maps the global dynamic water cycle driven by space weathering and continuous solar wind proton bombardment.',
      sciencePoints: 26,
      rarity: 'Breakthrough',
    },
    asteroid_belt: {
      title: 'Hydrated Phyllosilicates & Amino Acid Precursors',
      headline: 'Spectral identification of serpentinized clays and complex organo-nitrogen compounds in surface regolith.',
      evidence: 'Broad 2.7 micrometer metal-OH stretching vibration paired with 3.4 micrometer organic C-H stretching signatures.',
      scientificImpact: 'Confirms asteroids as the primary delivery vectors of organic carbon and water to the early inner Solar System.',
      sciencePoints: 36,
      rarity: 'Historic',
    },
  },
  imaging_system: {
    instrumentId: 'imaging_system',
    instrumentName: 'Multispectral Camera Suite',
    mars: {
      title: 'Stratified Fluvial Delta Channel Facies',
      headline: '0.15 m/pixel ultra-HD false-color cartography reveals rhythmic sedimentary layering of ancient river floods.',
      evidence: 'Cross-bedded sandstone formations and inverted paleochannels indicating continuous multi-millennial water discharge.',
      scientificImpact: 'Provides high-resolution chronostratigraphy of the transition from a warm, wet early Mars to modern hyper-arid desiccation.',
      sciencePoints: 30,
      rarity: 'Breakthrough',
    },
    lunar_orbit: {
      title: 'Pyroclastic Volcanic Vent & Lava Tube Skylights',
      headline: 'High-incidence illumination imaging maps cavernous subsurface basalt conduits over 80 meters wide.',
      evidence: 'Sharp shadow geometries revealing intact sub-surface lava tubes offering radiation-shielded human habitat sites.',
      scientificImpact: 'Pinpoints prime locations for subterranean lunar exploration bases sheltered from galactic cosmic rays.',
      sciencePoints: 28,
      rarity: 'Breakthrough',
    },
    asteroid_belt: {
      title: 'Micro-Crater Size Distribution & Regolith Sorting',
      headline: 'Stereo-photogrammetric reconstruction maps sub-centimeter boulder sorting across microgravity slopes.',
      evidence: 'Thermal inertia mapping reveals electrostatic dust levitation and thermal fatigue boulder fracturing.',
      scientificImpact: 'Establishes fundamental mechanics of low-gravity grain cohesion and space weathering on airless planetary bodies.',
      sciencePoints: 24,
      rarity: 'Common',
    },
  },
  radiation_detector: {
    instrumentId: 'radiation_detector',
    instrumentName: 'Cosmic Ray & Radiation Sensor',
    mars: {
      title: 'Crustal Magnetic Umbrella & Solar Wind Cavity',
      headline: 'Identification of remnant paleomagnetic dipole cusps deflecting energetic solar proton flux.',
      evidence: 'Localized magnetic intensity spikes creating atmospheric mini-magnetospheres against solar stripping.',
      scientificImpact: 'Uncovers localized radiation sanctuaries that may have sheltered surface life long after the global dynamo shut down.',
      sciencePoints: 30,
      rarity: 'Breakthrough',
    },
    lunar_orbit: {
      title: 'Lunar Swirl Albedo Shielding & Magnetic Anomalies',
      headline: 'Dosimeter vector measurements show mini-magnetospheres protecting high-albedo swirls from solar weathering.',
      evidence: 'Crustal magnetic anomalies correlating with the Reiner Gamma optical swirl morphology.',
      scientificImpact: 'Resolves decades-long mystery of lunar albedo swirls and localized magnetic field origin.',
      sciencePoints: 26,
      rarity: 'Breakthrough',
    },
    asteroid_belt: {
      title: 'Core Remnant Paleomagnetism & Early Dynamo Evidence',
      headline: 'Detection of remnant ferromagnetic magnetization acquired in an ancient molten planetesimal dynamo.',
      evidence: 'Stable dipole signature indicating parental body differentiation before catastrophic impact disruption.',
      scientificImpact: 'Proves small planetesimals in the early solar nebula generated active molten core dynamos within 5 Ma of solar formation.',
      sciencePoints: 32,
      rarity: 'Historic',
    },
  },
  atmospheric_sensor: {
    instrumentId: 'atmospheric_sensor',
    instrumentName: 'Atmospheric Gas & Aerosol Spectrometer',
    mars: {
      title: 'Episodic Methane Plume & Trace Gas Detection',
      headline: 'Tunable laser spectrometry registers background methane concentration variations with seasonal solar flux.',
      evidence: 'Repeatable localized methane spikes up to 21 ppbv at the planetary boundary layer during Martian summer.',
      scientificImpact: 'Indicates either active subsurface serpentinization or methanogenic microbial biological processes.',
      sciencePoints: 36,
      rarity: 'Historic',
    },
    lunar_orbit: {
      title: 'Lunar Surface Exosphere Sputtering Dynamics',
      headline: 'Quadrupole mass detection reveals transient argon-40 and helium degassing pulses from the lunar interior.',
      evidence: 'Radiogenic 40Ar release spikes correlating with deep moonquake tidal stresses.',
      scientificImpact: 'Demonstrates ongoing deep-mantle tectonic breathing and volatile release inside the Moon.',
      sciencePoints: 26,
      rarity: 'Common',
    },
    asteroid_belt: {
      title: 'Volatile Outgassing & Sublimation Sheath',
      headline: 'Mass spectrometer measures faint water vapor sublimating from exposed subsurface ice patches.',
      evidence: 'Water molecule production rate of 1.4 kg/s detected during perihelion solar heating.',
      scientificImpact: 'Directly validates mainstream comet-asteroid continuum theory in the main asteroid belt.',
      sciencePoints: 30,
      rarity: 'Breakthrough',
    },
  },
};

export function generateDiscoveries(
  config: MissionConfiguration,
  _siteId: string = 'jezero',
  _packetsReturned: number = 3
): ScienceDiscovery[] {
  const destination = config.destinationId;
  const instruments = config.selectedInstrumentIds;

  return instruments.map((instId, index) => {
    const def = DISCOVERY_DEFINITIONS[instId];
    const details = def ? def[destination] : null;

    if (!details) {
      return {
        id: `disc_${instId}_${index}`,
        instrumentId: instId,
        instrumentName: 'Science Payload',
        title: 'Geological Reconnaissance Discovery',
        headline: 'Comprehensive sensor telemetry analyzed successfully.',
        evidence: 'Spectral and telemetry signals verified by science ground station.',
        scientificImpact: 'Advances regional understanding of target planetary body.',
        unlockedAt: `Sol ${42 + index * 12}`,
        rarity: 'Common',
        sciencePoints: 20,
      };
    }

    return {
      id: `disc_${instId}_${index}`,
      instrumentId: instId,
      instrumentName: def.instrumentName,
      title: details.title,
      headline: details.headline,
      evidence: details.evidence,
      scientificImpact: details.scientificImpact,
      unlockedAt: `Sol ${38 + index * 14}`,
      rarity: details.rarity,
      sciencePoints: details.sciencePoints,
    };
  });
}

export function calculateTotalDiscoveryScore(discoveries: ScienceDiscovery[]): number {
  return discoveries.reduce((sum, d) => sum + d.sciencePoints, 0);
}
