import type { InstrumentId, MissionConfiguration } from '../types/mission';
import type { ResourceState } from '../types/simulation';

export type FlightChallengeId = 'trajectory' | 'power' | 'downlink';
export type FlightPacketId = 'navigation' | 'imaging' | 'spectra' | 'subsurface' | 'radiation' | 'atmosphere';

export interface FlightResolution {
  title: string;
  detail: string;
  fuelDelta: number;
  riskDelta: number;
  scienceDelta: number;
  powerDelta: number;
  dataDelta: number;
  quality: 'excellent' | 'compromised' | 'critical';
}

export interface FlightOutcome {
  orbitCaptured: boolean;
  packetsReturned: number;
  packetsAvailable: number;
  trajectoryError: number;
  missionStatus: 'full' | 'partial' | 'failed';
}

export const FLIGHT_PACKETS: { id: FlightPacketId; name: string; size: number; value: number; instrument?: InstrumentId }[] = [
  { id: 'navigation', name: 'Navigation & health', size: 2, value: 4 },
  { id: 'imaging', name: 'Surface imagery', size: 3, value: 10, instrument: 'imaging_system' },
  { id: 'spectra', name: 'Mineral spectra', size: 3, value: 12, instrument: 'spectrometer' },
  { id: 'subsurface', name: 'Subsurface echoes', size: 4, value: 17, instrument: 'radar' },
  { id: 'radiation', name: 'Particle measurements', size: 2, value: 8, instrument: 'radiation_detector' },
  { id: 'atmosphere', name: 'Atmosphere profiles', size: 3, value: 11, instrument: 'atmospheric_sensor' },
];

export function availablePackets(config: MissionConfiguration) {
  return FLIGHT_PACKETS.filter(packet => !packet.instrument || config.selectedInstrumentIds.includes(packet.instrument));
}

export function downlinkCapacity(config: MissionConfiguration) {
  return config.communicationId === 'deep_space' ? 9 : config.communicationId === 'high_gain' ? 7 : 5;
}

export function evaluateTrajectory(burn: number, config: MissionConfiguration): FlightResolution & { error: number } {
  const ideal = config.destinationId === 'lunar_orbit' ? 9 : config.destinationId === 'asteroid_belt' ? 16 : 12;
  const error = Math.abs(burn - ideal);
  const fuelCost = Math.round(burn * (config.propulsionId === 'electric' ? .28 : config.propulsionId === 'hybrid' ? .43 : .56));
  const riskDelta = Math.round(error * 2.2 - (error <= 2 ? 7 : 0));
  return {
    title: error <= 2 ? 'Arrival corridor locked' : error <= 6 ? 'Arrival corridor degraded' : 'Capture window endangered',
    detail: error <= 2 ? 'The trim burn places Aurora inside the target corridor.' : 'The remaining navigation error will raise orbit insertion risk.',
    fuelDelta: -fuelCost, riskDelta, scienceDelta: 0, powerDelta: 0, dataDelta: 0,
    quality: error <= 2 ? 'excellent' : error <= 6 ? 'compromised' : 'critical', error,
  };
}

export function stormCapacity(config: MissionConfiguration, resources: ResourceState) {
  const factor = config.powerSystemId === 'long_duration_power' ? .92 : config.powerSystemId === 'advanced_solar' ? .77 : .67;
  return Math.round(resources.maxPowerUnits * factor);
}

export function evaluatePower(config: MissionConfiguration, resources: ResourceState, scienceOn: boolean, relayOn: boolean): FlightResolution & { load: number; capacity: number } {
  const capacity = stormCapacity(config, resources);
  const load = 28 + 14 + (scienceOn ? 22 : 0) + (relayOn ? 16 : 0);
  const overloaded = load > capacity;
  return {
    title: overloaded ? 'Power bus overloaded' : scienceOn && relayOn ? 'All priority systems sustained' : 'Power budget stabilized',
    detail: overloaded ? 'The storm-damaged array cannot sustain this load. Battery and attitude control reliability fall.' : scienceOn ? 'Science observations continue within the reduced electrical budget.' : 'The spacecraft survives the storm, but some observations are lost.',
    fuelDelta: 0,
    riskDelta: overloaded ? 17 + Math.round((load - capacity) / 2) : scienceOn && relayOn ? -3 : -7,
    scienceDelta: scienceOn ? 7 : -10,
    powerDelta: scienceOn && relayOn ? 0 : -((scienceOn ? 0 : 8) + (relayOn ? 0 : 6)),
    dataDelta: relayOn ? 0 : -4,
    quality: overloaded ? 'critical' : scienceOn ? 'excellent' : 'compromised',
    load, capacity,
  };
}

export function evaluateDownlink(config: MissionConfiguration, selected: FlightPacketId[]): FlightResolution & { used: number; capacity: number; valid: boolean } {
  const packets = availablePackets(config).filter(packet => selected.includes(packet.id));
  const used = packets.reduce((sum, packet) => sum + packet.size, 0);
  const capacity = downlinkCapacity(config);
  const valid = used <= capacity && packets.length > 0;
  const includesNav = selected.includes('navigation');
  const value = packets.reduce((sum, packet) => sum + packet.value, 0);
  return {
    title: !valid ? 'Transmission plan exceeds window' : includesNav && packets.length > 1 ? 'Science received on Earth' : 'Partial telemetry received',
    detail: !valid ? 'Reduce the data package before the signal disappears behind the target.' : includesNav ? 'Navigation telemetry and selected science packets reached Earth.' : 'Science was received, but the mission health packet was omitted.',
    fuelDelta: 0, riskDelta: includesNav ? -2 : 8, scienceDelta: valid ? Math.round(value / 3) : 0,
    powerDelta: valid ? Math.round(used * .8) : 0,
    dataDelta: valid ? value - 13 : 0,
    quality: !valid || !includesNav ? 'critical' : packets.length >= 3 ? 'excellent' : 'compromised',
    used, capacity, valid,
  };
}

export function calculateFlightOutcome(resources: ResourceState, trajectoryError: number, packetsReturned: number, packetsAvailable: number): FlightOutcome {
  const orbitCaptured = resources.fuelPct > 4 && resources.riskPct < 65 && trajectoryError <= 8;
  const missionStatus = !orbitCaptured || packetsReturned === 0 ? 'failed' : packetsReturned >= Math.min(3, packetsAvailable) ? 'full' : 'partial';
  return { orbitCaptured, packetsReturned, packetsAvailable, trajectoryError, missionStatus };
}
