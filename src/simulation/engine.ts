import { MissionConfiguration } from '../types/mission';
import { ResourceState } from '../types/simulation';
import { DESTINATIONS } from '../data/destinations';
import { LAUNCH_VEHICLES } from '../data/launchVehicles';
import { PROPULSION_SYSTEMS } from '../data/propulsion';
import { POWER_SYSTEMS } from '../data/powerSystems';
import { COMMUNICATION_SYSTEMS } from '../data/communication';
import { INSTRUMENTS } from '../data/instruments';
import { BASELINE_CONSTRAINTS } from '../data/missions';

export const BASE_BUS_DRY_MASS_KG = 2150;
export const BASE_BUS_POWER_DRAW = 28;
export const BASE_PROGRAM_COST_BILLION = 0.35;

export function calculateMass(config: MissionConfiguration): { totalMassKg: number; maxMassKg: number; marginKg: number } {
  const launcher = LAUNCH_VEHICLES.find(l => l.id === config.launchVehicleId) ?? LAUNCH_VEHICLES[1];
  const propulsion = PROPULSION_SYSTEMS.find(p => p.id === config.propulsionId) ?? PROPULSION_SYSTEMS[2];
  const power = POWER_SYSTEMS.find(p => p.id === config.powerSystemId) ?? POWER_SYSTEMS[1];
  const comms = COMMUNICATION_SYSTEMS.find(c => c.id === config.communicationId) ?? COMMUNICATION_SYSTEMS[2];
  const dest = DESTINATIONS.find(d => d.id === config.destinationId) ?? DESTINATIONS[1];

  // Instrument masses
  const instrumentsMass = config.selectedInstrumentIds.reduce((sum, id) => {
    const inst = INSTRUMENTS.find(i => i.id === id);
    return sum + (inst ? inst.massKg : 0);
  }, 0);

  // Propellant mass required based on delta-V and propulsion Isp
  // Rocket equation approximation: delta-V = g0 * Isp * ln(m0 / mf)
  // Higher Isp = less propellant needed
  const deltaV = dest.deltaVRequiredKms * 1000;
  const g0 = 9.80665;
  const effectiveIsp = propulsion.ispSeconds;
  const massRatio = Math.exp(deltaV / (effectiveIsp * g0));
  
  // Dry mass before propellant
  const hardwareDryMass = BASE_BUS_DRY_MASS_KG + propulsion.massKg + power.massKg + comms.massKg + instrumentsMass;
  
  // Estimate propellant mass needed for trajectory maneuvers with safety factor
  const propellantMass = Math.min(1800, Math.round(hardwareDryMass * (massRatio - 1) * 0.45));
  
  const totalMassKg = hardwareDryMass + propellantMass;
  // Maximum mass allowed is constrained both by Project Aurora baseline (4500 kg) and launcher capability
  const maxMassKg = Math.min(BASELINE_CONSTRAINTS.maxMassKg, launcher.payloadCapacityKg);
  const marginKg = maxMassKg - totalMassKg;

  return { totalMassKg, maxMassKg, marginKg };
}

export function calculatePower(config: MissionConfiguration): { powerDemand: number; powerCapacity: number; powerMargin: number } {
  const power = POWER_SYSTEMS.find(p => p.id === config.powerSystemId) ?? POWER_SYSTEMS[1];
  const comms = COMMUNICATION_SYSTEMS.find(c => c.id === config.communicationId) ?? COMMUNICATION_SYSTEMS[2];

  const instrumentsPower = config.selectedInstrumentIds.reduce((sum, id) => {
    const inst = INSTRUMENTS.find(i => i.id === id);
    return sum + (inst ? inst.powerDraw : 0);
  }, 0);

  const powerDemand = BASE_BUS_POWER_DRAW + comms.powerDraw + instrumentsPower;
  const powerCapacity = power.outputUnits;
  const powerMargin = powerCapacity - powerDemand;

  return { powerDemand, powerCapacity, powerMargin };
}

export function calculateBudget(config: MissionConfiguration): { totalCostBillion: number; maxBudgetBillion: number; marginBillion: number } {
  const launcher = LAUNCH_VEHICLES.find(l => l.id === config.launchVehicleId) ?? LAUNCH_VEHICLES[1];
  const propulsion = PROPULSION_SYSTEMS.find(p => p.id === config.propulsionId) ?? PROPULSION_SYSTEMS[2];
  const power = POWER_SYSTEMS.find(p => p.id === config.powerSystemId) ?? POWER_SYSTEMS[1];
  const comms = COMMUNICATION_SYSTEMS.find(c => c.id === config.communicationId) ?? COMMUNICATION_SYSTEMS[2];

  const instrumentsCost = config.selectedInstrumentIds.reduce((sum, id) => {
    const inst = INSTRUMENTS.find(i => i.id === id);
    return sum + (inst ? inst.costBillion : 0);
  }, 0);

  const totalCostBillion = Number((BASE_PROGRAM_COST_BILLION + launcher.baseCostBillion + propulsion.costBillion + power.costBillion + comms.costBillion + instrumentsCost).toFixed(2));
  const maxBudgetBillion = BASELINE_CONSTRAINTS.maxBudgetBillion;
  const marginBillion = Number((maxBudgetBillion - totalCostBillion).toFixed(2));

  return { totalCostBillion, maxBudgetBillion, marginBillion };
}

export function calculateFuel(config: MissionConfiguration): number {
  const propulsion = PROPULSION_SYSTEMS.find(p => p.id === config.propulsionId) ?? PROPULSION_SYSTEMS[2];
  const dest = DESTINATIONS.find(d => d.id === config.destinationId) ?? DESTINATIONS[1];
  
  // Base fuel rating modified by destination distance and propulsion efficiency
  const destFactor = dest.id === 'lunar_orbit' ? 1.15 : dest.id === 'mars' ? 1.0 : 0.85;
  const fuelRating = Math.round(propulsion.fuelCapacityPct * destFactor);
  return Math.min(99, Math.max(10, fuelRating));
}

export function calculateScience(config: MissionConfiguration): number {
  const dest = DESTINATIONS.find(d => d.id === config.destinationId) ?? DESTINATIONS[1];
  
  const rawInstrumentScience = config.selectedInstrumentIds.reduce((sum, id) => {
    const inst = INSTRUMENTS.find(i => i.id === id);
    return sum + (inst ? inst.scienceImpact : 0);
  }, 0);

  const totalScience = Math.round((BASELINE_CONSTRAINTS.baseScienceValue + rawInstrumentScience) * dest.scienceMultiplier);
  return totalScience;
}

export function calculateRisk(config: MissionConfiguration): number {
  const launcher = LAUNCH_VEHICLES.find(l => l.id === config.launchVehicleId) ?? LAUNCH_VEHICLES[1];
  const propulsion = PROPULSION_SYSTEMS.find(p => p.id === config.propulsionId) ?? PROPULSION_SYSTEMS[2];
  const power = POWER_SYSTEMS.find(p => p.id === config.powerSystemId) ?? POWER_SYSTEMS[1];
  const comms = COMMUNICATION_SYSTEMS.find(c => c.id === config.communicationId) ?? COMMUNICATION_SYSTEMS[2];
  const dest = DESTINATIONS.find(d => d.id === config.destinationId) ?? DESTINATIONS[1];

  let risk = BASELINE_CONSTRAINTS.baseRiskPct;
  // Launcher reliability effect: 93% is baseline
  risk += (93 - launcher.reliabilityPct) * 1.5;
  // Propulsion & power factors
  risk = risk * propulsion.riskFactor * power.riskFactor * dest.riskFactor;
  // Comms risk mitigation
  risk -= comms.riskReduction;
  // Complex payloads add small integration risk
  risk += config.selectedInstrumentIds.length * 2.5;

  return Math.min(85, Math.max(12, Math.round(risk)));
}

export function calculateReliability(config: MissionConfiguration, riskPct: number): number {
  const launcher = LAUNCH_VEHICLES.find(l => l.id === config.launchVehicleId) ?? LAUNCH_VEHICLES[1];
  // Derived from launcher reliability and overall risk
  const baseline = launcher.reliabilityPct;
  const riskPenalty = riskPct * 0.25;
  return Math.min(98, Math.max(40, Math.round(baseline - riskPenalty + 5)));
}

export function calculateDataReturn(config: MissionConfiguration): number {
  const comms = COMMUNICATION_SYSTEMS.find(c => c.id === config.communicationId) ?? COMMUNICATION_SYSTEMS[2];
  // Large payloads increase potential raw science data
  const instrumentCount = config.selectedInstrumentIds.length;
  const dataMultiplier = 0.8 + (instrumentCount * 0.05);
  return Math.min(100, Math.round(comms.dataReturnRate * dataMultiplier));
}

export function calculateAllResources(config: MissionConfiguration): ResourceState {
  const { totalMassKg, maxMassKg, marginKg } = calculateMass(config);
  const { powerDemand, powerCapacity, powerMargin } = calculatePower(config);
  const { totalCostBillion, maxBudgetBillion, marginBillion } = calculateBudget(config);
  const fuelPct = calculateFuel(config);
  const scienceScore = calculateScience(config);
  const riskPct = calculateRisk(config);
  const reliabilityPct = calculateReliability(config, riskPct);
  const dataReturnScore = calculateDataReturn(config);

  return {
    massKg: totalMassKg,
    maxMassKg,
    massMarginKg: marginKg,
    powerUnits: powerDemand,
    maxPowerUnits: powerCapacity,
    powerMarginUnits: powerMargin,
    budgetBillion: totalCostBillion,
    maxBudgetBillion,
    budgetMarginBillion: marginBillion,
    fuelPct,
    riskPct,
    scienceScore,
    reliabilityPct,
    dataReturnScore
  };
}
