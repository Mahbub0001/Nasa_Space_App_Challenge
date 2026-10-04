import { CommunicationSystem } from '../types/mission';

export const COMMUNICATION_SYSTEMS: CommunicationSystem[] = [
  {
    id: 'standard',
    name: 'S-Band / X-Band Medium Antenna',
    dataReturnRate: 52,
    powerDraw: 8,
    massKg: 85,
    costBillion: 0.08,
    riskReduction: 0,
    dishDiameterMeters: 1.2,
    description: 'Compact gimballed horn and parabolic dish. Adequate for housekeeping telemetry and compressed science packets, but creates bandwidth bottlenecks for high-res imagery.'
  },
  {
    id: 'high_gain',
    name: 'Ka-Band High-Gain Steerable Reflector',
    dataReturnRate: 78,
    powerDraw: 16,
    massKg: 145,
    costBillion: 0.15,
    riskReduction: 5,
    dishDiameterMeters: 2.4,
    description: 'Dual Ka/X-band 2.4-meter high-gain parabolic reflector. Balances high telemetry downlink throughput with moderate electrical power and gimbal mass demands.'
  },
  {
    id: 'deep_space',
    name: 'Deep-Space Optical & High-Gain Hybrid',
    dataReturnRate: 96,
    powerDraw: 24,
    massKg: 215,
    costBillion: 0.22,
    riskReduction: 10,
    dishDiameterMeters: 3.5,
    description: 'Combined optical laser communications package + 3.5m deployable high-frequency mesh dish. Unlocks gigabit-class raw science transmission back to the Deep Space Network.'
  }
];
