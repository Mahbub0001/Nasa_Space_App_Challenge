import { Destination } from '../types/mission';

export const DESTINATIONS: Destination[] = [
  {
    id: 'lunar_orbit',
    name: 'Lunar Orbital Insertion',
    tagline: 'Cislunar proving grounds & orbital reconnaissance',
    distanceKm: '384,400 km',
    flightDurationDays: 4,
    riskFactor: 0.8,
    scienceMultiplier: 0.75,
    deltaVRequiredKms: 3.8,
    description: 'A low-latency orbital mission to verify deep-space systems in Earth-Moon cislunar space. Lower operational risk with rapid telemetry turnarounds.'
  },
  {
    id: 'mars',
    name: 'Mars Orbital Science (Demo)',
    tagline: 'Deep-space planetary exploration scenario',
    distanceKm: '225,000,000 km',
    flightDurationDays: 210,
    riskFactor: 1.0,
    scienceMultiplier: 1.0,
    deltaVRequiredKms: 5.6,
    description: 'Targeted interplanetary orbital insertion around Mars. Requires resilient autonomous power systems, high delta-V margins, and deep-space telemetry architecture.',
    isPrimaryDemo: true
  },
  {
    id: 'asteroid_belt',
    name: 'Main Belt Asteroid Rendezvous',
    tagline: 'Primitive Solar System spectroscopy',
    distanceKm: '415,000,000 km',
    flightDurationDays: 480,
    riskFactor: 1.35,
    scienceMultiplier: 1.3,
    deltaVRequiredKms: 7.2,
    description: 'Long-duration trajectory toward primitive carbonaceous asteroids. Severe illumination drop-off and communication latency demand superior power reliability.'
  }
];
