import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, Check, Radio, Zap } from 'lucide-react';
import type { MissionConfiguration } from '../../types/mission';
import type { ResourceState } from '../../types/simulation';
import { CHARACTERS } from '../../data/characters';
import { AnimatedGuide } from '../narrative/AnimatedGuide';
import { availablePackets, downlinkCapacity, evaluateDownlink, evaluatePower, evaluateTrajectory, stormCapacity, type FlightChallengeId, type FlightPacketId, type FlightResolution } from '../../simulation/flightGame';
import './flight.css';

interface FlightChallengeProps {
  id: FlightChallengeId;
  config: MissionConfiguration;
  resources: ResourceState;
  onBurnChange?: (burn: number) => void;
  onCommit: (result: FlightResolution, label: string, meta: { trajectoryError?: number; packetsReturned?: number }) => void;
}

const situations = {
  trajectory: { index: '01', title: 'Correct the approach', kicker: 'GUIDANCE / CRUISE DAY 82', character: 'marcus' as const, message: 'Aurora has drifted outside the center of its arrival corridor. Choose a trim burn. Too little misses the target; too much spends fuel and overshoots.' },
  power: { index: '02', title: 'Survive the storm', kicker: 'POWER / CRUISE DAY 146', character: 'elena' as const, message: 'A solar storm has reduced available power. Keep science online for a rare observation, or shed load to protect the spacecraft. The choice is yours.' },
  downlink: { index: '03', title: 'Beat the blackout', kicker: 'COMMS / FINAL APPROACH', character: 'maya' as const, message: 'The target will block our signal to Earth soon. Choose which packets to send before the link disappears. Your antenna sets the capacity.' },
};

export const FlightChallenge: React.FC<FlightChallengeProps> = ({ id, config, resources, onCommit, onBurnChange }) => {
  const [burn, setBurn] = useState(12);
  const [scienceOn, setScienceOn] = useState(true);
  const [relayOn, setRelayOn] = useState(true);
  const [selectedPackets, setSelectedPackets] = useState<FlightPacketId[]>(['navigation']);
  const situation = situations[id];
  const trajectory = useMemo(() => evaluateTrajectory(burn, config), [burn, config]);
  const power = useMemo(() => evaluatePower(config, resources, scienceOn, relayOn), [config, resources, scienceOn, relayOn]);
  const downlink = useMemo(() => evaluateDownlink(config, selectedPackets), [config, selectedPackets]);
  const prediction = id === 'trajectory' ? trajectory : id === 'power' ? power : downlink;
  const packets = availablePackets(config);
  const togglePacket = (packet: FlightPacketId) => setSelectedPackets(previous => previous.includes(packet) ? previous.filter(id => id !== packet) : [...previous, packet]);
  const commit = () => {
    if (id === 'trajectory') onCommit(trajectory, `${burn} m/s course trim`, { trajectoryError: trajectory.error });
    if (id === 'power') onCommit(power, `Storm load: ${power.load}/${power.capacity} units`, {});
    if (id === 'downlink' && downlink.valid) onCommit(downlink, `${selectedPackets.length} packets downlinked`, { packetsReturned: selectedPackets.length });
  };

  return <section className="flight-challenge" aria-label={situation.title}>
    <div className="flight-challenge__heading"><span>ENCOUNTER {situation.index} / 03</span><span className="flight-challenge__alert"><AlertTriangle size={13} /> ACTION REQUIRED</span></div>
    <div className="flight-challenge__intro"><div><p className="flight-challenge__kicker">{situation.kicker}</p><h2>{situation.title}</h2></div><div className="flight-challenge__crew"><AnimatedGuide character={CHARACTERS[situation.character]} speaking compact /><p><strong>{CHARACTERS[situation.character].name}</strong><span>{situation.message}</span></p></div></div>

    {id === 'trajectory' && <div className="flight-challenge__workbench">
      <div className="flight-challenge__diagram" aria-hidden="true"><div className="flight-challenge__target"><span>ARRIVAL CORRIDOR</span></div><div className="flight-challenge__aim" style={{ left: `${Math.min(90, Math.max(10, 50 + (burn - (config.destinationId === 'mars' ? 12 : config.destinationId === 'lunar_orbit' ? 9 : 16)) * 4))}%` }} /><div className="flight-challenge__targetline" /></div>
      <label className="flight-challenge__slider"><span>TRIM BURN</span><strong>{burn} m/s</strong><input type="range" min="0" max="24" step="1" value={burn} onChange={event => { const value = Number(event.target.value); setBurn(value); onBurnChange?.(value); }} aria-label="Trim burn in meters per second" /></label>
      <div className="flight-challenge__hint">Navigation estimate: correction target {config.destinationId === 'mars' ? '10–14' : config.destinationId === 'lunar_orbit' ? '7–11' : '14–18'} m/s. Larger burns consume more propellant.</div>
    </div>}

    {id === 'power' && <div className="flight-challenge__workbench">
      <div className="flight-challenge__meter"><span>STORM CAPACITY <strong>{stormCapacity(config, resources)} U</strong></span><div><i style={{ width: `${Math.min(100, power.load / power.capacity * 100)}%`, background: power.load > power.capacity ? '#ef927f' : '#80cfb1' }} /></div><span>SELECTED LOAD <strong>{power.load} U</strong></span></div>
      <div className="flight-challenge__systems"><div className="flight-challenge__system is-locked"><Zap size={16} /><div><strong>Avionics & thermal</strong><span>42 U · essential</span></div><Check size={16} /></div><button type="button" className={`flight-challenge__system ${scienceOn ? 'is-active' : ''}`} onClick={() => setScienceOn(!scienceOn)} aria-pressed={scienceOn}><Zap size={16} /><div><strong>Science instruments</strong><span>22 U · observations</span></div><span>{scienceOn ? 'ON' : 'OFF'}</span></button><button type="button" className={`flight-challenge__system ${relayOn ? 'is-active' : ''}`} onClick={() => setRelayOn(!relayOn)} aria-pressed={relayOn}><Radio size={16} /><div><strong>Continuous relay</strong><span>16 U · telemetry</span></div><span>{relayOn ? 'ON' : 'OFF'}</span></button></div>
      <div className="flight-challenge__hint">Your {config.powerSystemId.replace(/_/g, ' ')} system sets this storm capacity. Running over capacity is allowed, but raises mission risk.</div>
    </div>}

    {id === 'downlink' && <div className="flight-challenge__workbench">
      <div className="flight-challenge__meter"><span>LINK WINDOW <strong>{downlinkCapacity(config)} SLOTS</strong></span><div><i style={{ width: `${Math.min(100, downlink.used / downlink.capacity * 100)}%`, background: downlink.used > downlink.capacity ? '#ef927f' : '#80cfb1' }} /></div><span>PACKED <strong>{downlink.used} SLOTS</strong></span></div>
      <div className="flight-challenge__systems">{packets.map(packet => <button key={packet.id} type="button" className={`flight-challenge__system ${selectedPackets.includes(packet.id) ? 'is-active' : ''}`} onClick={() => togglePacket(packet.id)} aria-pressed={selectedPackets.includes(packet.id)}><Radio size={16} /><div><strong>{packet.name}</strong><span>{packet.size} slots · {packet.value} science value</span></div><span>{selectedPackets.includes(packet.id) ? 'QUEUED' : 'ADD'}</span></button>)}</div>
      <div className="flight-challenge__hint">Your {config.communicationId.replace(/_/g, ' ')} link controls capacity. Packets come from the instruments you installed before launch.</div>
    </div>}

    <div className={`flight-challenge__prediction is-${prediction.quality}`}><div><span>PROJECTED OUTCOME</span><strong>{prediction.title}</strong><p>{prediction.detail}</p></div><div className="flight-challenge__deltas"><span>FUEL {prediction.fuelDelta > 0 ? '+' : ''}{prediction.fuelDelta}%</span><span>RISK {prediction.riskDelta > 0 ? '+' : ''}{prediction.riskDelta}%</span><span>SCIENCE {prediction.scienceDelta > 0 ? '+' : ''}{prediction.scienceDelta}</span><span>DATA {prediction.dataDelta > 0 ? '+' : ''}{prediction.dataDelta}</span></div></div>
    <button className="flight-challenge__commit" type="button" disabled={id === 'downlink' && !downlink.valid} onClick={commit}>{id === 'downlink' && !downlink.valid ? 'SELECT A VALID DATA PACKAGE' : 'COMMIT FLIGHT DIRECTIVE'} <ArrowRight size={16} /></button>
  </section>;
};
