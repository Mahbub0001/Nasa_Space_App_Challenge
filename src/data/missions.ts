import { MissionBaselineConstraints, MissionConfiguration } from '../types/mission';

export const BASELINE_CONSTRAINTS: MissionBaselineConstraints = {
  maxBudgetBillion: 2.4,       // $2.4B
  maxMassKg: 4500,             // 4,500 kg baseline spacecraft mass limit
  basePowerCapacity: 100,      // 100 power units base budget
  missionWindowDays: 18,       // 18 days launch window
  baseRiskPct: 20,             // 20% baseline program risk
  baseScienceValue: 40         // 40 baseline science units
};

export const DEFAULT_MISSION_CONFIG: MissionConfiguration = {
  destinationId: 'mars',
  launchVehicleId: 'heavy_lift',
  propulsionId: 'hybrid',
  powerSystemId: 'advanced_solar',
  communicationId: 'deep_space',
  selectedInstrumentIds: ['imaging_system', 'spectrometer']
};
