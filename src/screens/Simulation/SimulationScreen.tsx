import React, { useState, useEffect } from 'react';
import { useMission } from '../../hooks/useMission';
import { TrajectoryCanvas } from '../../components/simulation/TrajectoryCanvas';
import { MissionTimeline } from '../../components/simulation/MissionTimeline';
import { MissionEventModal } from '../../components/mission/MissionEventModal';
import { AerospaceCard } from '../../components/common/AerospaceCard';
import { TelemetryGauge } from '../../components/telemetry/TelemetryGauge';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { MISSION_EVENTS } from '../../data/events';
import { TimelineStage, MissionEvent, EventChoice } from '../../types/simulation';
import { resolveDecisionEffect } from '../../simulation/eventResolver';
import { sound } from '../../utils/sound';
import { 
  Play, 
  Pause, 
  FastForward, 
  Radio, 
  CheckCircle, 
  ShieldAlert, 
  Fuel, 
  Zap, 
  Atom, 
  Wifi, 
  Sparkles 
} from 'lucide-react';

const INITIAL_STAGES: TimelineStage[] = [
  { id: 'launch', code: 'STG-01', label: 'LAUNCH & ASCENT', status: 'completed', daysOffset: 0, summary: 'Liftoff & nominal atmospheric exit' },
  { id: 'orbit_insertion', code: 'STG-02', label: 'PARKING ORBIT', status: 'completed', daysOffset: 1, summary: 'Low Earth orbit checkout pass' },
  { id: 'tmi', code: 'STG-03', label: 'TRANS-INJECTION', status: 'completed', daysOffset: 2, summary: 'Interplanetary departure burn' },
  { id: 'cruise', code: 'STG-04', label: 'INTERPLANETARY CRUISE', status: 'active', daysOffset: 45, summary: 'Heliocentric transfer arc' },
  { id: 'course_correction', code: 'STG-05', label: 'COURSE CORRECTION', status: 'pending', daysOffset: 110, summary: 'Mid-course trajectory trims' },
  { id: 'arrival', code: 'STG-06', label: 'TARGET ARRIVAL', status: 'pending', daysOffset: 205, summary: 'Capture orbit insertion' },
  { id: 'science_ops', code: 'STG-07', label: 'SCIENCE OPERATIONS', status: 'pending', daysOffset: 210, summary: 'Primary mapping & downlink' }
];

export const SimulationScreen: React.FC = () => {
  const { 
    config, 
    resources, 
    decisions,
    recordDecision, 
    finalizeMission, 
    showNotification 
  } = useMission();

  const [progressPct, setProgressPct] = useState(15);
  const [isPlaying, setIsPlaying] = useState(true);
  const [stages] = useState<TimelineStage[]>(INITIAL_STAGES);
  const [currentStageIdx, setCurrentStageIdx] = useState(3); // Cruise
  const [currentLiveResources, setCurrentLiveResources] = useState(resources);

  // Active event modal state
  const [activeEvent, setActiveEvent] = useState<MissionEvent | null>(null);
  const [firedEventIds, setFiredEventIds] = useState<string[]>([]);
  const [arrivalState, setArrivalState] = useState<'approaching' | 'acquired' | 'instruments_online' | 'downlink' | 'complete'>('approaching');

  // Sync initial resources
  useEffect(() => {
    setCurrentLiveResources(resources);
  }, [resources]);

  // Main simulation tick loop
  useEffect(() => {
    if (!isPlaying || activeEvent !== null || arrivalState === 'complete') return;

    const interval = setInterval(() => {
      setProgressPct((prev) => {
        const next = prev + 0.45;

        // Stage 4: Course Deviation Trigger at ~38%
        if (next >= 38 && !firedEventIds.includes('course_deviation')) {
          const evt = MISSION_EVENTS.find(e => e.id === 'course_deviation');
          if (evt) {
            setActiveEvent(evt);
            setFiredEventIds(old => [...old, 'course_deviation']);
            setIsPlaying(false);
            return 38;
          }
        }

        // Update stage to Course Correction
        if (next >= 50 && currentStageIdx < 4) {
          setCurrentStageIdx(4);
        }

        // Stage 5: Power Deficit Trigger at ~65%
        if (next >= 65 && !firedEventIds.includes('power_deficit')) {
          const evt = MISSION_EVENTS.find(e => e.id === 'power_deficit');
          if (evt) {
            setActiveEvent(evt);
            setFiredEventIds(old => [...old, 'power_deficit']);
            setIsPlaying(false);
            return 65;
          }
        }

        // Update stage to Target Arrival
        if (next >= 85 && currentStageIdx < 5) {
          setCurrentStageIdx(5);
        }

        // Stage 6: Comms Window Trigger at ~90%
        if (next >= 90 && !firedEventIds.includes('comms_window')) {
          const evt = MISSION_EVENTS.find(e => e.id === 'comms_window');
          if (evt) {
            setActiveEvent(evt);
            setFiredEventIds(old => [...old, 'comms_window']);
            setIsPlaying(false);
            return 90;
          }
        }

        // Target Reached (100%)
        if (next >= 100) {
          setCurrentStageIdx(6);
          setArrivalState('acquired');
          setIsPlaying(false);
          return 100;
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, activeEvent, firedEventIds, currentStageIdx, arrivalState]);

  // Handle Event Choice selection
  const handleCommitDecision = (choice: EventChoice) => {
    if (!activeEvent) return;

    const { updatedResources, decisionRecord } = resolveDecisionEffect(
      currentLiveResources,
      choice,
      activeEvent
    );

    setCurrentLiveResources(updatedResources);
    recordDecision(decisionRecord);
    setActiveEvent(null);
    setIsPlaying(true);

    showNotification(
      'info',
      `DIRECTIVE LOGGED: [${choice.tag}] ${choice.label}`,
      choice.consequenceTitle
    );
  };

  // Arrival Sequence Milestones
  useEffect(() => {
    if (arrivalState === 'acquired') {
      sound.playSuccess();
      const t1 = setTimeout(() => setArrivalState('instruments_online'), 1500);
      const t2 = setTimeout(() => setArrivalState('downlink'), 3000);
      const t3 = setTimeout(() => {
        setArrivalState('complete');
      }, 4800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [arrivalState]);

  const handleFinishMission = () => {
    sound.playClick();
    finalizeMission();
  };

  // Dynamic simulated telemetry values
  const simulatedDistanceRemaining = Math.max(0, Math.round(225000000 * (1 - progressPct / 100)));
  const simulatedVelocity = Number((18.4 + Math.sin(progressPct * 0.05) * 2.1).toFixed(1));

  return (
    <div className="max-w-[1720px] mx-auto w-full p-5 sm:p-8 space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-sky-950 text-sky-400 px-2 py-0.5 rounded border border-sky-500/30 font-mono font-semibold">
              05 / Simulation
            </span>
            <span className="text-xs text-slate-400 font-sans">
              Interplanetary mission in progress
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-sans">
            Flight simulation
          </h1>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {arrivalState !== 'complete' && (
            <Button
              variant="secondary"
              size="sm"
              icon={isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? 'PAUSE' : 'RESUME'}
            </Button>
          )}

          {progressPct < 98 && (
            <Button
              variant="outline"
              size="sm"
              icon={<FastForward className="w-3.5 h-3.5" />}
              onClick={() => setProgressPct(95)}
              title="Fast forward to orbital arrival corridor"
            >
              WARP TO ARRIVAL
            </Button>
          )}

          {arrivalState === 'complete' && (
            <Button
              variant="primary"
              size="md"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={handleFinishMission}
              className="animate-pulse"
            >
              VIEW FINAL MISSION RESULTS
            </Button>
          )}
        </div>
      </div>

      {/* Flight Timeline Sequence Component */}
      <MissionTimeline
        stages={stages}
        currentStageIndex={currentStageIdx}
      />

      {/* Main Grid: Trajectory Visualization + Live In-Flight Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 8 Cols: Interactive Trajectory Canvas & In-Flight Status */}
        <div className="lg:col-span-8 space-y-4">
          <AerospaceCard
            code="ORB-SIM"
            title="TRAJECTORY FLIGHT PATH"
            subtitle="KEPLERIAN HELIOCENTRIC INTERPLANETARY CORRIDOR"
            headerAction={
              <div className="flex items-center gap-2 text-xs font-sans">
                <span className="text-slate-400">PROGRESS:</span>
                <span className="text-sky-300 font-mono font-bold tabular-nums">
                  {Math.round(progressPct)}%
                </span>
              </div>
            }
          >
            <div className="h-[430px]">
              <TrajectoryCanvas
                destinationId={config.destinationId}
                progressPct={progressPct}
                isSimulating={isPlaying}
                className="h-full"
              />
            </div>

            {/* Flight Dynamics Bar */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-sans">
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400 block font-medium">HELIOCENTRIC VELOCITY</span>
                <span className="text-sky-300 font-mono font-bold text-xs mt-0.5 block tabular-nums">
                  {simulatedVelocity} KM/S
                </span>
              </div>
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400 block font-medium">RANGE TO TARGET</span>
                <span className="text-white font-mono font-bold text-xs mt-0.5 block tabular-nums">
                  {simulatedDistanceRemaining.toLocaleString()} KM
                </span>
              </div>
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400 block font-medium">TRANSFER PHASE</span>
                <span className="text-white font-mono font-semibold text-xs mt-0.5 block">
                  {currentStageIdx >= 5 ? 'ORBITAL CAPTURE' : 'HELIOCENTRIC CRUISE'}
                </span>
              </div>
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400 block font-medium">TELEMETRY LINK STATUS</span>
                <span className="text-emerald-400 font-mono font-semibold text-xs mt-0.5 block flex items-center gap-1">
                  <Radio className="w-3 h-3" /> CARRIER LOCKED
                </span>
              </div>
            </div>
          </AerospaceCard>

          {/* Arrival Sequence Modal / Overlay if arrived */}
          {arrivalState !== 'approaching' && (
            <div className="p-4 rounded-lg bg-space-850/95 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-fade-in font-sans">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                    TARGET ARRIVAL CONFIRMED // SCIENCE OPERATIONS COMMENCED
                  </h3>
                </div>
                <Badge variant="nominal">PHASE COMPLETE</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono mb-4">
                <div className="p-2 rounded border transition-colors bg-emerald-950/40 border-emerald-500/40 text-emerald-300">
                  [01] TARGET ACQUIRED
                </div>
                <div className={`p-2 rounded border transition-colors ${
                  arrivalState === 'instruments_online' || arrivalState === 'downlink' || arrivalState === 'complete'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/[0.02] border-white/[0.05] text-slate-500'
                }`}>
                  [02] INSTRUMENTS ONLINE
                </div>
                <div className={`p-2 rounded border transition-colors ${
                  arrivalState === 'downlink' || arrivalState === 'complete'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/[0.02] border-white/[0.05] text-slate-500'
                }`}>
                  [03] DATA COLLECTION
                </div>
                <div className={`p-2 rounded border transition-colors ${
                  arrivalState === 'complete'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/[0.02] border-white/[0.05] text-slate-500'
                }`}>
                  [04] DOWNLINK COMPLETE
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleFinishMission}
                >
                  PROCEED TO FINAL MISSION DEBRIEF & RESULTS
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Live Telemetry Dashboard */}
        <div className="lg:col-span-4 space-y-3">
          <AerospaceCard
            code="TLM-LIVE"
            title="IN-FLIGHT CONSUMABLES"
            subtitle="CURRENT TELEMETRY STATUS POST-ANOMALIES"
          >
            <div className="space-y-2.5">
              <TelemetryGauge
                label="Propellant Reserve"
                code="FUEL"
                currentValue={currentLiveResources.fuelPct}
                isPercentage={true}
                icon={<Fuel className="w-3.5 h-3.5" />}
              />

              <TelemetryGauge
                label="Flight Risk Index"
                code="RISK"
                currentValue={currentLiveResources.riskPct}
                isPercentage={true}
                reverseRisk={true}
                warningThreshold={0.45}
                dangerThreshold={0.60}
                icon={<ShieldAlert className="w-3.5 h-3.5" />}
              />

              <TelemetryGauge
                label="Scientific Return"
                code="SCI"
                currentValue={currentLiveResources.scienceScore}
                maxValue={100}
                icon={<Atom className="w-3.5 h-3.5" />}
              />

              <TelemetryGauge
                label="Bus Electrical Draw"
                code="PWR"
                currentValue={currentLiveResources.powerUnits}
                maxValue={currentLiveResources.maxPowerUnits}
                unit="U"
                reverseRisk={true}
                icon={<Zap className="w-3.5 h-3.5" />}
              />

              <TelemetryGauge
                label="Data Downlink Return"
                code="DATA"
                currentValue={currentLiveResources.dataReturnScore}
                maxValue={100}
                icon={<Wifi className="w-3.5 h-3.5" />}
              />
            </div>
          </AerospaceCard>

          {/* Mission Decision Log (War Room Flight Journal) */}
          <div className="p-3.5 rounded-md bg-space-850/90 border border-white/[0.08] text-xs font-sans shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/[0.06]">
              <span className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider font-sans">
                MISSION DECISION LOG ({decisions.length})
              </span>
              <span className="text-[9px] text-slate-500 font-mono">FLIGHT JOURNAL</span>
            </div>

            {decisions.length === 0 ? (
              <p className="text-[11px] font-sans text-slate-500 italic py-2">
                Awaiting in-flight anomaly interventions...
              </p>
            ) : (
              <div className="space-y-2">
                {decisions.map((dec, i) => (
                  <div key={i} className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05] text-[11px]">
                    <div className="flex items-center justify-between font-semibold text-white mb-1">
                      <span className="text-sky-300 font-mono text-[10px]">✓ {dec.eventId}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/10 border border-sky-400/20 text-sky-400 font-mono font-medium">
                        LOGGED
                      </span>
                    </div>
                    <div className="text-slate-300 font-sans text-xs">
                      → <strong className="text-white">{dec.choiceLabel}</strong>
                    </div>
                    <div className="text-amber-300/90 font-mono text-[10px] mt-1">
                      ⚡ {dec.consequenceSummary}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2.5 pt-1.5 border-t border-white/[0.05] text-[10px] text-slate-500 text-right italic font-sans">
              "Your decisions shape this mission."
            </div>
          </div>
        </div>

      </div>

      {/* Mission Control Decision Room Modal when triggered */}
      {activeEvent && (
        <MissionEventModal
          event={activeEvent}
          currentResources={currentLiveResources}
          onCommitDecision={handleCommitDecision}
        />
      )}

    </div>
  );
};
