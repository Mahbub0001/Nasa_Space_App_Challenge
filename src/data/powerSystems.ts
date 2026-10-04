import { PowerSystem } from '../types/mission';

export const POWER_SYSTEMS: PowerSystem[] = [
  {
    id: 'solar_array',
    name: 'Standard Photovoltaic Arrays',
    outputUnits: 65,
    massKg: 220,
    costBillion: 0.12,
    riskFactor: 1.15,
    sunlightDependent: true,
    advantages: [
      'Low developmental cost and minimal mass impact',
      'Flight-tested multi-junction gallium arsenide cells',
      'Straightforward deployment kinematics'
    ],
    disadvantages: [
      'Output scales inversely with square of distance from Sun (1/r²)',
      'Marginal power budget when operating deep-space science payloads'
    ]
  },
  {
    id: 'advanced_solar',
    name: 'Advanced Concentrator Solar Arrays (ROSA)',
    outputUnits: 100,
    massKg: 310,
    costBillion: 0.18,
    riskFactor: 1.05,
    sunlightDependent: true,
    advantages: [
      'High-efficiency roll-out solar arrays with optical concentrators',
      'Capable of sustaining heavy radar & spectrometer simultaneous loads',
      'Excellent balance of mass, electrical capacity, and budget'
    ],
    disadvantages: [
      'Subject to pointing constraints and attitude control alignment',
      'Moderate cost premium over standard arrays'
    ]
  },
  {
    id: 'long_duration_power',
    name: 'Next-Gen Radioisotope Thermoelectric (RTG)',
    outputUnits: 90,
    massKg: 490,
    costBillion: 0.32,
    riskFactor: 0.9,
    sunlightDependent: false,
    advantages: [
      'Continuous uninterrupted power output invariant to distance or shadows',
      'Zero attitude/pointing solar dependency during science passes',
      'Decades of operational thermal and electrical stability'
    ],
    disadvantages: [
      'High radiological containment mass penalty (+490 kg)',
      'Substantial specialized acquisition and launch licensing cost'
    ]
  }
];
