import type { DestinationId, LandingSite } from '../types/mission';

export interface InsertionResolution {
  quality: 'excellent' | 'compromised' | 'critical';
  periapsisKm: number;
  fuelDelta: number;
  riskDelta: number;
  title: string;
  detail: string;
  statusBadge: string;
}

export interface TouchdownResolution {
  success: boolean;
  touchdownVelocityMs: number;
  fuelConsumedPct: number;
  hazardEncountered: boolean;
  scienceYield: number;
  title: string;
  detail: string;
}

export const DESTINATION_LANDING_SITES: Record<DestinationId, LandingSite[]> = {
  mars: [
    {
      id: 'jezero',
      destinationId: 'mars',
      name: 'Jezero Crater',
      tagline: 'Ancient River Delta & Lakebed',
      coordinates: '18.38°N, 77.58°E',
      elevationKm: -2.5,
      scienceMultiplier: 1.45,
      hazardLevel: 'Medium',
      description: 'An ancient crater flooded with river water 3.5 billion years ago. Clay minerals preserve past prebiotic environments, though delta scarps and boulder fields pose landing hazards.',
      terrainType: 'Fluvial fan delta & clay lacustrine mudstones',
      scientificObjectives: ['Astrobiology biosignatures', 'Clay mineralogy', 'Ancient sedimentary layering'],
    },
    {
      id: 'valles_marineris',
      destinationId: 'mars',
      name: 'Valles Marineris',
      tagline: 'Solar System Grand Canyon',
      coordinates: '13.9°S, 59.2°W',
      elevationKm: -7.0,
      scienceMultiplier: 1.35,
      hazardLevel: 'High',
      description: 'Deep tectonic rift canyon exposing billions of years of crustal history. Deep atmosphere provides natural radiation shielding, but steep slopes and katabatic wind gusts challenge touchdown.',
      terrainType: 'Stratified canyon wall scarps & landslide debris',
      scientificObjectives: ['Deep crustal stratigraphy', 'Tectonic evolution', 'Subterranean radiation shelter'],
    },
    {
      id: 'elysium',
      destinationId: 'mars',
      name: 'Elysium Planitia',
      tagline: 'Smooth Volcanic Plains',
      coordinates: '4.5°N, 135.6°E',
      elevationKm: -1.2,
      scienceMultiplier: 1.15,
      hazardLevel: 'Low',
      description: 'Extensive, flat basaltic volcanic plains with sparse craters and boulders. Offers the highest probability of safe touchdown with minimal hazard margin.',
      terrainType: 'Smooth lava flood sheets & thin eolian dust veneer',
      scientificObjectives: ['Planetary seismic structure', 'Mantle thermal evolution', 'Basalt geochemistry'],
    },
  ],
  lunar_orbit: [
    {
      id: 'shackleton',
      destinationId: 'lunar_orbit',
      name: 'Shackleton Crater',
      tagline: 'Lunar South Pole Cold Trap',
      coordinates: '89.9°S, 0.0°E',
      elevationKm: -4.2,
      scienceMultiplier: 1.5,
      hazardLevel: 'High',
      description: 'Permanently shadowed crater interior holding billion-year-old water ice volatiles. Extreme cold and steep rim elevation challenge optical guidance.',
      terrainType: 'Permanently shadowed cryogenic regolith & icy breccia',
      scientificObjectives: ['Cryogenic volatile ice sampling', 'Solar wind isotopic capture', 'Artemis base feasibility'],
    },
    {
      id: 'tranquility',
      destinationId: 'lunar_orbit',
      name: 'Sea of Tranquility',
      tagline: 'Historic Mare Basalt Plain',
      coordinates: '0.67°N, 23.47°E',
      elevationKm: -1.5,
      scienceMultiplier: 1.15,
      hazardLevel: 'Low',
      description: 'Historic Apollo 11 landing zone featuring flat titanium-rich mare basalts. Low slope variance provides optimal touchdown reliability.',
      terrainType: 'Titanium-rich flood basalt & fine impact regolith',
      scientificObjectives: ['Ilmenite titanium extraction', 'Regolith space weathering', 'Lunar geological baseline'],
    },
    {
      id: 'procellarum',
      destinationId: 'lunar_orbit',
      name: 'Oceanus Procellarum',
      tagline: 'KREEP Volcanic Basin',
      coordinates: '18.4°N, 57.4°W',
      elevationKm: -1.8,
      scienceMultiplier: 1.25,
      hazardLevel: 'Medium',
      description: 'The largest lunar mare, enriched in incompatible elements (potassium, rare earth elements, phosphorus). Reveals late-stage thermal activity.',
      terrainType: 'Silica-rich volcanic dome terrain & rilles',
      scientificObjectives: ['KREEP element mapping', 'Late-stage lunar magmatism', 'Pyroclastic vent analysis'],
    },
  ],
  asteroid_belt: [
    {
      id: 'nightingale',
      destinationId: 'asteroid_belt',
      name: 'Nightingale Crater',
      tagline: 'Carbonaceous Regolith Crater',
      coordinates: '56.0°N, 42.0°E',
      elevationKm: -0.05,
      scienceMultiplier: 1.4,
      hazardLevel: 'High',
      description: 'Small impact crater exposing pristine, dark carbon-rich boulders. Narrow target ellipse surrounded by high-relief boulder hazards.',
      terrainType: 'Porous carbonaceous chondrite rubble & fine grit',
      scientificObjectives: ['Prebiotic organic amino acids', 'Solar nebula primitive grains', 'Water-bearing clay phyllosilicates'],
    },
    {
      id: 'osprey',
      destinationId: 'asteroid_belt',
      name: 'Osprey Sampling Zone',
      tagline: 'Fine Regolith Patch',
      coordinates: '11.0°N, 88.0°E',
      elevationKm: -0.02,
      scienceMultiplier: 1.2,
      hazardLevel: 'Medium',
      description: 'A crater floor with a uniform patch of fine-grained regolith. Moderate hazard profile suitable for touch-and-go sampling arms.',
      terrainType: 'Fine gravel matrix with low boulder concentration',
      scientificObjectives: ['Bulk chemical composition', 'Micro-meteorite impact kinetics', 'Asteroid cohesion physics'],
    },
  ],
};

export function evaluateInsertionBurn(
  entryAngleDeg: number,
  burnDurationSec: number,
  destinationId: DestinationId
): InsertionResolution {
  const nominalAngle =
    destinationId === 'mars' ? -12.2 : destinationId === 'lunar_orbit' ? -15.0 : -4.0;
  const nominalDuration =
    destinationId === 'mars' ? 240 : destinationId === 'lunar_orbit' ? 180 : 90;

  const angleDiff = entryAngleDeg - nominalAngle;
  const durationDiff = burnDurationSec - nominalDuration;

  // Mars specifics:
  // nominal angle: -12.2° (nominal corridor is -13.0° to -11.5°)
  // If > -10.5°: too shallow, skip off atmosphere into deep space
  // If < -14.0°: too steep, severe aerodynamic thermal overload
  if (destinationId === 'mars') {
    if (entryAngleDeg > -10.5) {
      return {
        quality: 'critical',
        periapsisKm: Math.round(350 + (entryAngleDeg + 10.5) * 45),
        fuelDelta: -16,
        riskDelta: 18,
        title: 'Atmospheric Skip / Orbit Missed',
        detail: 'Entry flight path angle was too shallow (-' + Math.abs(entryAngleDeg).toFixed(1) + '°). Spacecraft skipped off the upper Martian atmosphere. Emergency propellant expenditure was required for secondary capture.',
        statusBadge: 'TRAJECTORY SKIP',
      };
    }
    if (entryAngleDeg < -14.2) {
      return {
        quality: 'critical',
        periapsisKm: Math.round(65 - (Math.abs(entryAngleDeg) - 14.2) * 15),
        fuelDelta: -12,
        riskDelta: 22,
        title: 'Thermal Overload / Steep Entry',
        detail: 'Entry angle was dangerously steep (-' + Math.abs(entryAngleDeg).toFixed(1) + '°). Aerodynamic deceleration peaked at 14 Gs, causing severe heat shield ablation and telemetry degradation.',
        statusBadge: 'HEAT SHIELD OVERHEAT',
      };
    }
  }

  // Calculate overall error
  const angleError = Math.abs(angleDiff);
  const durationError = Math.abs(durationDiff) / nominalDuration;

  if (angleError <= 1.2 && durationError <= 0.15) {
    return {
      quality: 'excellent',
      periapsisKm: destinationId === 'mars' ? 245 : destinationId === 'lunar_orbit' ? 100 : 15,
      fuelDelta: destinationId === 'mars' ? -8 : destinationId === 'lunar_orbit' ? -6 : -4,
      riskDelta: -6,
      title: 'Nominal Orbital Capture Confirmed',
      detail: 'Precision retrograde deceleration burn captured Aurora into the intended arrival orbit. Thermal protection and avionics telemetry remain within nominal flight tolerances.',
      statusBadge: 'CAPTURE NOMINAL',
    };
  }

  if (angleError <= 2.2 && durationError <= 0.3) {
    return {
      quality: 'compromised',
      periapsisKm: destinationId === 'mars' ? 180 : destinationId === 'lunar_orbit' ? 70 : 8,
      fuelDelta: destinationId === 'mars' ? -11 : destinationId === 'lunar_orbit' ? -9 : -6,
      riskDelta: 6,
      title: 'Offset Orbital Insertion',
      detail: 'Slight deviation in burn cut-off time created an eccentric parking orbit. Attitude control thrusters expended additional reserve propellant to circularize.',
      statusBadge: 'ECCENTRIC ORBIT',
    };
  }

  return {
    quality: 'critical',
    periapsisKm: destinationId === 'mars' ? 110 : destinationId === 'lunar_orbit' ? 45 : 4,
    fuelDelta: destinationId === 'mars' ? -15 : destinationId === 'lunar_orbit' ? -12 : -8,
    riskDelta: 16,
    title: 'Severe Orbital Insertion Stress',
    detail: 'Large thrust timing discrepancy resulted in near-critical deceleration loads. Fuel reserves are depleted near emergency reserve levels.',
    statusBadge: 'BURN ANOMALY',
  };
}

export function evaluateTouchdown(
  site: LandingSite,
  throttlePct: number,
  fuelRemainingPct: number
): TouchdownResolution {
  // Optimal throttle is between 65% and 82%
  const optimalThrottle = 74;
  const throttleError = Math.abs(throttlePct - optimalThrottle);

  // Velocity calculation: 1.2 m/s base + error
  const touchdownVelocityMs = Number(
    Math.max(0.6, (throttlePct < 55 ? 12.5 - throttlePct * 0.14 : 1.2 + throttleError * 0.14)).toFixed(2)
  );

  const fuelCostPct = Math.round(12 + (throttlePct / 100) * 14);
  const outOfFuel = fuelCostPct > fuelRemainingPct;

  // Hazard calculation
  const hazardFactor =
    site.hazardLevel === 'High' ? 0.35 : site.hazardLevel === 'Medium' ? 0.18 : 0.05;
  const hazardEncountered = Math.random() < hazardFactor && throttleError > 8;

  if (touchdownVelocityMs > 6.0 || outOfFuel) {
    return {
      success: false,
      touchdownVelocityMs: outOfFuel ? 14.8 : touchdownVelocityMs,
      fuelConsumedPct: Math.min(fuelRemainingPct, fuelCostPct),
      hazardEncountered: true,
      scienceYield: Math.round(site.scienceMultiplier * 8),
      title: outOfFuel ? 'Propellant Depletion Before Touchdown' : 'Hard Landing / Kinetic Impact',
      detail: outOfFuel
        ? 'Descent engines flamed out at 40 meters altitude due to propellant starvation. Lander sustained structural damage.'
        : `Terminal velocity of ${touchdownVelocityMs} m/s exceeded lander gear dampener limits. Critical instrumentation damaged.`,
    };
  }

  const baseScience = 28;
  const scienceYield = Math.round(baseScience * site.scienceMultiplier);

  return {
    success: true,
    touchdownVelocityMs,
    fuelConsumedPct: fuelCostPct,
    hazardEncountered,
    scienceYield,
    title: 'Touchdown Confirmed · Surface Operational',
    detail: `Aurora successfully set down inside ${site.name} at ${touchdownVelocityMs} m/s. Solar panels deployed, radio link established with Earth.`,
  };
}
