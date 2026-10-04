import { PropulsionSystem } from '../types/mission';

export const PROPULSION_SYSTEMS: PropulsionSystem[] = [
  {
    id: 'chemical',
    name: 'Bipropellant Chemical Engine',
    type: 'Monomethylhydrazine / NTO',
    ispSeconds: 325,
    thrustClass: 'High',
    massKg: 420,
    costBillion: 0.15,
    fuelCapacityPct: 65,
    riskFactor: 1.0,
    advantages: [
      'High instantaneous thrust for rapid burns',
      'Proven heritage and high burn reliability',
      'Immediate trajectory correction responsiveness'
    ],
    disadvantages: [
      'Substantially higher fuel mass consumption',
      'Lower specific impulse reduces total delta-V margin'
    ]
  },
  {
    id: 'electric',
    name: 'Hall-Effect Ion Propulsion',
    type: 'Xenon Electrostatic Ion Engine',
    ispSeconds: 3100,
    thrustClass: 'Low',
    massKg: 280,
    costBillion: 0.22,
    fuelCapacityPct: 92,
    riskFactor: 1.15,
    advantages: [
      'Exceptionally high fuel efficiency (Isp > 3,000s)',
      'Substantially lower propellant mass penalty',
      'Continuous low-thrust trajectory optimization'
    ],
    disadvantages: [
      'Low instantaneous thrust requires extended burn durations',
      'Severe electrical power dependency from bus'
    ]
  },
  {
    id: 'hybrid',
    name: 'Dual-Mode Chemical / Electric Hybrid',
    type: 'Staged Chemical Insertion + Ion Cruise',
    ispSeconds: 1450,
    thrustClass: 'Medium',
    massKg: 360,
    costBillion: 0.20,
    fuelCapacityPct: 82,
    riskFactor: 1.05,
    advantages: [
      'Chemical thrust for critical injection & capture',
      'High-efficiency ion propulsion during heliocentric cruise',
      'Balanced delta-V and propellant envelope'
    ],
    disadvantages: [
      'Dual plumbing and power routing complexity',
      'Moderate engineering integration overhead'
    ]
  }
];
