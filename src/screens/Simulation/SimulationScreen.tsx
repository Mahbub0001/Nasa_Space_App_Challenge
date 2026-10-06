import React, { useEffect, useMemo, useState } from 'react';
import { FastForward, Pause, Play, Sparkles } from 'lucide-react';
import { useMission } from '../../hooks/useMission';
import { MissionJourney } from '../../components/simulation/MissionJourney';
import { FlightScene } from '../../components/simulation/FlightScene';
import { FlightChallenge } from '../../components/simulation/FlightChallenge';
import { availablePackets, calculateFlightOutcome, type FlightChallengeId, type FlightResolution, type FlightOutcome } from '../../simulation/flightGame';
import type { ResolvedDecision, ResourceState } from '../../types/simulation';
import { sound } from '../../utils/sound';
import { AnimatedGuide } from '../../components/narrative/AnimatedGuide';
import { CHARACTERS } from '../../data/characters';

const ENCOUNTERS: { id: FlightChallengeId; at: number; name: string }[] = [
  { id: 'trajectory', at: 35, name: 'Course correction' },
  { id: 'power', at: 64, name: 'Solar storm' },
  { id: 'downlink', at: 88, name: 'Signal blackout' },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function applyResolution(resources: ResourceState, result: FlightResolution): ResourceState {
  const powerUnits = Math.max(0, resources.powerUnits + result.powerDelta);
  return {
    ...resources,
    fuelPct: clamp(resources.fuelPct + result.fuelDelta, 0, 100),
    riskPct: clamp(resources.riskPct + result.riskDelta, 0, 100),
    scienceScore: Math.max(0, resources.scienceScore + result.scienceDelta),
    powerUnits,
    powerMarginUnits: resources.maxPowerUnits - powerUnits,
    dataReturnScore: clamp(resources.dataReturnScore + result.dataDelta, 0, 100),
  };
}

export const SimulationScreen: React.FC = () => {
  const { config, resources, decisions, recordDecision, finalizeMission } = useMission();
  const [progress, setProgress] = useState(12);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  const [challenge, setChallenge] = useState<FlightChallengeId | null>(null);
  const [completed, setCompleted] = useState<FlightChallengeId[]>([]);
  const [liveResources, setLiveResources] = useState(resources);
  const [lastResult, setLastResult] = useState<FlightResolution | null>(null);
  const [lastChallenge, setLastChallenge] = useState<FlightChallengeId | null>(null);
  const [trajectoryError, setTrajectoryError] = useState(99);
  const [packetsReturned, setPacketsReturned] = useState(0);
  const [previewBurn, setPreviewBurn] = useState(12);
  const [outcome, setOutcome] = useState<FlightOutcome | null>(null);

  useEffect(() => {
    if (!playing || challenge || outcome) return;
    const timer = window.setInterval(() => setProgress(previous => Math.min(100, previous + .17 * speed)), 100);
    return () => window.clearInterval(timer);
  }, [playing, challenge, outcome, speed]);

  useEffect(() => {
    if (challenge || outcome) return;
    const next = ENCOUNTERS.find(encounter => !completed.includes(encounter.id));
    if (next && progress >= next.at) {
      setProgress(next.at);
      setChallenge(next.id);
      setPlaying(false);
      sound.playAlert();
    } else if (!next && progress >= 100) {
      const result = calculateFlightOutcome(liveResources, trajectoryError, packetsReturned, availablePackets(config).length);
      setOutcome(result);
      setPlaying(false);
      if (result.missionStatus === 'failed') sound.playAlert(); else sound.playSuccess();
    }
  }, [progress, challenge, completed, outcome, liveResources, trajectoryError, packetsReturned, config]);

  const target = config.destinationId === 'mars' ? 'Mars' : config.destinationId === 'lunar_orbit' ? 'the Moon' : 'the asteroid';
  const nextEncounter = ENCOUNTERS.find(encounter => !completed.includes(encounter.id));
  const daysTotal = config.destinationId === 'mars' ? 210 : config.destinationId === 'lunar_orbit' ? 4 : 480;
  const day = Math.round(daysTotal * progress / 100);
  const chapter = challenge === 'trajectory' ? 'Course correction' : challenge === 'power' ? 'Solar storm' : challenge === 'downlink' ? 'Blackout window' : outcome ? outcome.missionStatus === 'failed' ? 'Orbit missed' : 'Mission complete' : progress >= 88 ? 'Final approach' : progress >= 64 ? 'Deep-space cruise' : 'Departure cruise';
  const courseChoice = decisions.find(decision => decision.eventId === 'trajectory')?.choiceId;
  const nextAction = useMemo(() => nextEncounter ? `Next encounter: ${nextEncounter.name} at ${nextEncounter.at}%` : 'All encounters resolved · approaching target', [nextEncounter]);

  const handleCommit = (result: FlightResolution, label: string, meta: { trajectoryError?: number; packetsReturned?: number }) => {
    if (!challenge) return;
    const updated = applyResolution(liveResources, result);
    const decision: ResolvedDecision = {
      eventId: challenge,
      eventCode: `PLAY-${completed.length + 1}`,
      eventTitle: ENCOUNTERS.find(encounter => encounter.id === challenge)!.name,
      choiceId: challenge === 'trajectory' ? result.quality === 'excellent' ? 'correction_burn' : 'maintain_trajectory' : result.quality,
      choiceTag: result.quality === 'excellent' ? 'A' : result.quality === 'compromised' ? 'B' : 'C',
      choiceLabel: label,
      consequenceSummary: `${result.title} · ${result.detail}`,
      timestamp: new Date().toISOString(),
      deltas: { fuel: result.fuelDelta, risk: result.riskDelta, science: result.scienceDelta, power: result.powerDelta, data: result.dataDelta },
      beforeState: { fuel: liveResources.fuelPct, power: liveResources.powerUnits, risk: liveResources.riskPct, science: liveResources.scienceScore },
      afterState: { fuel: updated.fuelPct, power: updated.powerUnits, risk: updated.riskPct, science: updated.scienceScore },
    };
    setLiveResources(updated);
    recordDecision(decision);
    if (meta.trajectoryError !== undefined) setTrajectoryError(meta.trajectoryError);
    if (meta.packetsReturned !== undefined) setPacketsReturned(meta.packetsReturned);
    setCompleted(previous => [...previous, challenge]);
    setLastResult(result);
    setLastChallenge(challenge);
    setChallenge(null);
    setPlaying(true);
    sound.playSuccess();
  };

  const jumpToEncounter = () => {
    if (challenge || outcome) return;
    setProgress(nextEncounter ? nextEncounter.at : 100);
    setPlaying(true);
  };

  return <main className="flight-game">
    <header className="flight-game__header"><div><span className="flight-game__eyebrow">AURORA · FLIGHT DIRECTOR MODE</span><h1>{chapter}</h1><p>Mission day {day} / {daysTotal} · {nextAction}</p></div><div className="flight-game__controls">{!outcome && <><button type="button" onClick={() => setPlaying(!playing)} disabled={!!challenge}>{playing ? <Pause size={13} /> : <Play size={13} />} {playing ? 'PAUSE' : 'RESUME'}</button><button type="button" onClick={() => setSpeed(current => current === 1 ? 2 : current === 2 ? 4 : 1)}>{speed}× SPEED</button><button type="button" onClick={jumpToEncounter} disabled={!!challenge}><FastForward size={13} /> NEXT ENCOUNTER</button></>}</div></header>
    <div className="flight-game__chapter" aria-label={`${Math.round(progress)} percent mission progress`}><label>FLIGHT {Math.round(progress)}%</label><span><i style={{ width: `${progress}%` }} /></span><label>{target.toUpperCase()}</label></div>
    <div className="flight-game__grid"><div className="flight-game__stage"><FlightScene config={config} progress={progress} challenge={challenge} playing={playing} burn={challenge === 'trajectory' ? previewBurn : 0} stormActive={challenge === 'power'} failed={outcome?.missionStatus === 'failed'} speed={speed} /><MissionJourney destinationId={config.destinationId} progressPct={progress} isPlaying={playing} compact courseChoice={courseChoice} /></div><div className="flight-game__side"><section className="flight-game__mission"><span>THE OBJECTIVE</span><h2>Bring the discovery home.</h2><p>Reach orbit around {target}, protect Aurora through deep space, then return science data before the signal blackout.</p><dl><div><dt>PROPELLANT</dt><dd>{liveResources.fuelPct}%</dd></div><div><dt>FLIGHT RISK</dt><dd>{liveResources.riskPct}%</dd></div><div><dt>POWER DRAW</dt><dd>{liveResources.powerUnits}/{liveResources.maxPowerUnits} U</dd></div><div><dt>SCIENCE RETURN</dt><dd>{liveResources.scienceScore}</dd></div></dl><span>FLIGHT RECORD</span><ul>{completed.length ? decisions.map((decision, index) => <li key={`${decision.eventId}-${index}`}>{decision.eventTitle}: {decision.choiceLabel}</li>) : <li>Awaiting first encounter</li>}</ul></section>
      {challenge && <FlightChallenge key={challenge} id={challenge} config={config} resources={liveResources} onBurnChange={setPreviewBurn} onCommit={handleCommit} />}
      {!challenge && !outcome && <div className="flight-game__prompt"><strong>{playing ? 'Autopilot cruising' : 'Mission paused'}</strong><br />{nextAction}. Use Next encounter to advance quickly, or let the journey run.<br /><button type="button" onClick={jumpToEncounter}>ADVANCE TO DECISION →</button></div>}
      {!challenge && lastResult && !outcome && <div className={`flight-game__result ${lastResult.quality === 'critical' ? 'is-critical' : ''}`}><div className="flight-game__reaction"><AnimatedGuide character={CHARACTERS[lastChallenge === 'trajectory' ? 'marcus' : lastChallenge === 'power' ? 'elena' : 'maya']} compact speaking mood={lastResult.quality === 'excellent' ? 'relieved' : lastResult.quality === 'critical' ? 'worried' : 'focused'} /><div><strong>{lastResult.title}</strong><p>{lastResult.detail}</p><small>{lastResult.quality === 'excellent' ? 'Crew response: clean execution. Aurora is ready for the next phase.' : lastResult.quality === 'critical' ? 'Crew response: the next encounter now carries higher risk.' : 'Crew response: the mission continues with a narrower margin.'}</small></div></div></div>}
      {outcome && <div className={`flight-game__result ${outcome.missionStatus === 'failed' ? 'is-critical' : ''}`}>
        <strong>{outcome.missionStatus === 'full' ? 'Arrival corridor established' : outcome.missionStatus === 'partial' ? 'Arrival corridor reached' : 'Mission objectives missed'}</strong>
        <p>{outcome.orbitCaptured ? `Target approach confirmed. ${outcome.packetsReturned} of ${outcome.packetsAvailable} telemetry packets returned to Earth.` : 'The spacecraft could not enter a stable target orbit. Review the burn and resource decisions.'}</p>
        {outcome.orbitCaptured ? (
          <button className="flight-challenge__commit" type="button" onClick={() => { sound.playSuccess(); finalizeMission(outcome, 'arrival'); }}>
            <Sparkles size={15} /> INITIATE ORBITAL INSERTION & TOUCHDOWN →
          </button>
        ) : (
          <button className="flight-challenge__commit" type="button" onClick={() => finalizeMission(outcome)}>
            <Sparkles size={15} /> VIEW MISSION DEBRIEF
          </button>
        )}
      </div>}
    </div></div>
  </main>;
};
