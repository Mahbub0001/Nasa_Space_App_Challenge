import { MissionConfiguration } from '../types/mission';
import { ResourceState, ScoreBreakdown, ScoreClassification, MissionResult, ResolvedDecision, WhatIfScenario } from '../types/simulation';
import { DESTINATIONS } from '../data/destinations';
import { calculateAllResources } from './engine';

export function calculateScoreBreakdown(
  resources: ResourceState,
  decisions: ResolvedDecision[]
): ScoreBreakdown {
  // Apply decision modifiers if any accumulated
  let finalScience = resources.scienceScore;
  let finalRisk = resources.riskPct;
  let finalFuel = resources.fuelPct;
  let finalData = resources.dataReturnScore;

  for (const dec of decisions) {
    finalScience += dec.deltas.science;
    finalRisk += dec.deltas.risk;
    finalFuel += dec.deltas.fuel;
    if (dec.deltas.data) finalData += dec.deltas.data;
  }

  // Bound variables
  finalScience = Math.max(0, finalScience);
  finalRisk = Math.min(100, Math.max(0, finalRisk));
  finalFuel = Math.min(100, Math.max(0, finalFuel));
  finalData = Math.min(100, Math.max(0, finalData));

  // 1. Scientific Return (30%)
  // Baseline is 40, excellent is 90+
  const scientificReturn = Math.min(100, Math.round((finalScience / 95) * 100));

  // 2. Mission Reliability (25%)
  // High reliability and low risk reward higher scores
  const missionReliability = Math.min(100, Math.max(10, Math.round(resources.reliabilityPct - (finalRisk * 0.25))));

  // 3. Resource Efficiency (20%)
  // Evaluates fuel remaining + mass and power margin utilization without waste
  const massUtilization = Math.min(1, resources.massKg / resources.maxMassKg);
  const powerUtilization = Math.min(1, resources.powerUnits / resources.maxPowerUnits);
  const fuelBonus = finalFuel;
  const resourceEfficiency = Math.min(100, Math.max(20, Math.round(
    (fuelBonus * 0.5) + (massUtilization * 25) + (powerUtilization * 25)
  )));

  // 4. Budget Performance (15%)
  // Staying under budget while fulfilling objectives
  const budgetRatio = resources.budgetBillion / resources.maxBudgetBillion;
  const budgetPerformance = Math.min(100, Math.max(10, Math.round(
    100 - (budgetRatio > 1 ? (budgetRatio - 1) * 200 : (budgetRatio - 0.7) * 50)
  )));

  // 5. Data Return (10%)
  const dataReturn = Math.min(100, Math.max(10, Math.round(finalData)));

  // Weighted calculation (PRD Section 7)
  const rawScore = 
    (scientificReturn * 0.30) +
    (missionReliability * 0.25) +
    (resourceEfficiency * 0.20) +
    (budgetPerformance * 0.15) +
    (dataReturn * 0.10);

  const finalScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  let classification: ScoreClassification;
  if (finalScore >= 90) {
    classification = 'EXCEPTIONAL MISSION';
  } else if (finalScore >= 75) {
    classification = 'MISSION SUCCESS';
  } else if (finalScore >= 60) {
    classification = 'PARTIAL SUCCESS';
  } else if (finalScore >= 40) {
    classification = 'HIGH RISK';
  } else {
    classification = 'MISSION FAILURE';
  }

  return {
    scientificReturn,
    missionReliability,
    resourceEfficiency,
    budgetPerformance,
    dataReturn,
    finalScore,
    classification
  };
}

export function generateWhatIfScenarios(currentConfig: MissionConfiguration): WhatIfScenario[] {
  // Scenario 1: Conservative High-Reliability Architecture (RTG + Heavy Lift Plus + Focused Payload)
  const conservativeConfig: MissionConfiguration = {
    destinationId: currentConfig.destinationId,
    launchVehicleId: 'heavy_lift_plus',
    propulsionId: 'chemical',
    powerSystemId: 'long_duration_power',
    communicationId: 'deep_space',
    selectedInstrumentIds: ['spectrometer', 'imaging_system']
  };
  const conservativeResources = calculateAllResources(conservativeConfig);
  const conservativeScore = calculateScoreBreakdown(conservativeResources, []);

  // Scenario 2: Maximum Science Exploration Configuration (Advanced Solar + Heavy Lift + All Instruments)
  const maxScienceConfig: MissionConfiguration = {
    destinationId: currentConfig.destinationId,
    launchVehicleId: 'heavy_lift',
    propulsionId: 'hybrid',
    powerSystemId: 'advanced_solar',
    communicationId: 'high_gain',
    selectedInstrumentIds: ['imaging_system', 'spectrometer', 'radar', 'radiation_detector', 'atmospheric_sensor']
  };
  const maxScienceResources = calculateAllResources(maxScienceConfig);
  const maxScienceScore = calculateScoreBreakdown(maxScienceResources, []);

  return [
    {
      id: 'conservative_rtg',
      name: 'Conservative Deep-Space RTG Architecture',
      subtitle: 'Long-Duration Power + Focused Science Suite',
      configuration: conservativeConfig,
      resources: conservativeResources,
      scoreBreakdown: conservativeScore,
      narrativeComparison: 'Prioritized electrical autonomy and proven chemical propulsion at the expense of launch cost and payload diversity.'
    },
    {
      id: 'max_science',
      name: 'Maximized Scientific Survey Suite',
      subtitle: '5-Instrument Full Spectrum Planetary Profiling',
      configuration: maxScienceConfig,
      resources: maxScienceResources,
      scoreBreakdown: maxScienceScore,
      narrativeComparison: 'Maximized planetary science return while operating at the very limit of thermal and bus electrical reserves.'
    }
  ];
}

export function buildMissionResult(
  config: MissionConfiguration,
  resources: ResourceState,
  decisions: ResolvedDecision[]
): MissionResult {
  const dest = DESTINATIONS.find(d => d.id === config.destinationId) ?? DESTINATIONS[1];
  const scoreBreakdown = calculateScoreBreakdown(resources, decisions);

  // Analyze decisions for contextual narrative insights
  let missionInsight = '';
  if (scoreBreakdown.finalScore >= 85) {
    missionInsight = 'Your configuration demonstrated master-class systems engineering: maximizing scientific observation return while maintaining sufficient propellant and electrical margins to withstand deep-space anomalies.';
  } else if (scoreBreakdown.finalScore >= 70) {
    missionInsight = 'Your configuration prioritized scientific return while accepting moderate resource risk. In-flight corrective decisions successfully prevented mission-critical failures.';
  } else {
    missionInsight = 'High subsystem complexity and narrow resource reserves pressured the spacecraft during cruise operations, forcing compromises in data downlinks.';
  }

  // Key Decision Analysis
  const hasRadar = config.selectedInstrumentIds.includes('radar');
  const hasDeepComms = config.communicationId === 'deep_space';
  let keyDecision = '';

  if (hasRadar && hasDeepComms) {
    keyDecision = 'Installing Synthetic Aperture Radar coupled with Deep-Space Optical Communications maximized planetary science fidelity, at the trade-off of 180 kg mass and 24 power units.';
  } else if (hasRadar) {
    keyDecision = 'Subsurface radar yielded breakthroughs in subsurface dielectric mapping, though it pushed power demands close to the generation threshold.';
  } else {
    keyDecision = 'Opting for focused optical and infrared spectroscopy protected power margins and lowered overall mission risk.';
  }

  const whatIfScenarios = generateWhatIfScenarios(config);

  return {
    missionId: 'AURORA-2045-A',
    destinationName: dest.name,
    scoreBreakdown,
    finalResources: resources,
    decisions,
    missionInsight,
    keyDecision,
    installedInstruments: config.selectedInstrumentIds,
    whatIfScenarios
  };
}
