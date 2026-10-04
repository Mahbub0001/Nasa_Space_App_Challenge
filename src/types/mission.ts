export type MissionPhase = 
  | 'landing'
  | 'briefing'
  | 'mission_control'
  | 'payload'
  | 'readiness'
  | 'launch'
  | 'simulation'
  | 'arrival'
  | 'results'
  | 'what_if';

export type DestinationId = 'lunar_orbit' | 'mars' | 'asteroid_belt';

export interface Destination {
  id: DestinationId;
  name: string;
  tagline: string;
  distanceKm: string;
  flightDurationDays: number;
  riskFactor: number; // base risk adder/multiplier
  scienceMultiplier: number;
  deltaVRequiredKms: number;
  description: string;
  isPrimaryDemo?: boolean;
}

export type LaunchVehicleId = 'medium_lift' | 'heavy_lift' | 'heavy_lift_plus';

export interface LaunchVehicle {
  id: LaunchVehicleId;
  name: string;
  classification: string;
  payloadCapacityKg: number;
  baseCostBillion: number;
  reliabilityPct: number;
  fuelEfficiency: 'Medium' | 'High' | 'Very High';
  description: string;
}

export type PropulsionId = 'chemical' | 'electric' | 'hybrid';

export interface PropulsionSystem {
  id: PropulsionId;
  name: string;
  type: string;
  ispSeconds: number; // Specific impulse
  thrustClass: 'High' | 'Medium' | 'Low';
  massKg: number;
  costBillion: number;
  fuelCapacityPct: number;
  riskFactor: number;
  advantages: string[];
  disadvantages: string[];
}

export type PowerSystemId = 'solar_array' | 'advanced_solar' | 'long_duration_power';

export interface PowerSystem {
  id: PowerSystemId;
  name: string;
  outputUnits: number;
  massKg: number;
  costBillion: number;
  riskFactor: number;
  sunlightDependent: boolean;
  advantages: string[];
  disadvantages: string[];
}

export type CommunicationId = 'standard' | 'high_gain' | 'deep_space';

export interface CommunicationSystem {
  id: CommunicationId;
  name: string;
  dataReturnRate: number; // base data return points
  powerDraw: number;
  massKg: number;
  costBillion: number;
  riskReduction: number;
  dishDiameterMeters: number;
  description: string;
}

export type InstrumentId = 
  | 'spectrometer'
  | 'radar'
  | 'imaging_system'
  | 'radiation_detector'
  | 'atmospheric_sensor';

export interface Instrument {
  id: InstrumentId;
  name: string;
  category: string;
  purpose: string;
  scienceImpact: number;
  massKg: number;
  powerDraw: number;
  costPct: number; // cost contribution
  costBillion: number;
  description: string;
  visualBay: 'bow' | 'port' | 'starboard' | 'dorsal' | 'ventral';
}

export interface MissionConfiguration {
  destinationId: DestinationId;
  launchVehicleId: LaunchVehicleId;
  propulsionId: PropulsionId;
  powerSystemId: PowerSystemId;
  communicationId: CommunicationId;
  selectedInstrumentIds: InstrumentId[];
}

export interface MissionBaselineConstraints {
  maxBudgetBillion: number;
  maxMassKg: number;
  basePowerCapacity: number;
  missionWindowDays: number;
  baseRiskPct: number;
  baseScienceValue: number;
}
