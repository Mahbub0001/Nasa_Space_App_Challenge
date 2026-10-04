import { LaunchVehicle } from '../types/mission';

export const LAUNCH_VEHICLES: LaunchVehicle[] = [
  {
    id: 'medium_lift',
    name: 'Medium Lift (Class II)',
    classification: 'Commercial Heritage Booster',
    payloadCapacityKg: 3500,
    baseCostBillion: 0.45,
    reliabilityPct: 88,
    fuelEfficiency: 'Medium',
    description: 'Cost-effective launch configuration with proven flight heritage. Limited trans-Mars injection payload capacity enforces strict mass discipline.'
  },
  {
    id: 'heavy_lift',
    name: 'Heavy Lift (Class IV)',
    classification: 'High-Energy Exploration Booster',
    payloadCapacityKg: 5500,
    baseCostBillion: 0.65,
    reliabilityPct: 93,
    fuelEfficiency: 'Medium',
    description: 'Balanced dual-stage launcher offering ample payload envelope for multi-instrument science suites and robust interplanetary propellant load.'
  },
  {
    id: 'heavy_lift_plus',
    name: 'Heavy Lift Plus (Class V)',
    classification: 'Super-Heavy Exploration Stack',
    payloadCapacityKg: 8000,
    baseCostBillion: 0.95,
    reliabilityPct: 97,
    fuelEfficiency: 'Very High',
    description: 'Maximum throw-weight configuration providing extensive mass margins. Substantially absorbs program budget but guarantees redundant capability.'
  }
];
