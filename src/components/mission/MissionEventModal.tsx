import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Radio, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  ShieldAlert, 
  Fuel, 
  Zap, 
  Atom, 
  Cpu
} from 'lucide-react';
import { MissionEvent, EventChoice, ResourceState } from '../../types/simulation';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { sound } from '../../utils/sound';

interface MissionEventModalProps {
  event: MissionEvent;
  currentResources: ResourceState;
  onCommitDecision: (choice: EventChoice) => void;
}

type DecisionRoomStage = 'briefing' | 'uplink_transmitting' | 'consequence_reveal';

export const MissionEventModal: React.FC<MissionEventModalProps> = ({
  event,
  currentResources,
  onCommitDecision
}) => {
  const [stage, setStage] = useState<DecisionRoomStage>('briefing');
  const [selectedChoice, setSelectedChoice] = useState<EventChoice | null>(null);
  const [transmissionProgress, setTransmissionProgress] = useState(0);

  // Uplink transmission effect
  useEffect(() => {
    if (stage !== 'uplink_transmitting' || !selectedChoice) return;

    sound.playBeep(900, 0.05, 0.05);

    const interval = setInterval(() => {
      setTransmissionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStage('consequence_reveal');
          sound.playAlert();
          return 100;
        }
        sound.playBeep(700 + prev * 5, 0.03, 0.02);
        return prev + 25;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [stage, selectedChoice]);

  const handleSelect = (choice: EventChoice) => {
    sound.playClick();
    setSelectedChoice(choice);
    setTransmissionProgress(0);
    setStage('uplink_transmitting');
  };

  const handleFinalAcknowledge = () => {
    if (selectedChoice) {
      sound.playSuccess();
      onCommitDecision(selectedChoice);
    }
  };

  // Helper for trend badge color
  const getTrendClass = (tone: 'positive' | 'negative' | 'neutral') => {
    if (tone === 'positive') return 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40';
    if (tone === 'negative') return 'text-rose-300 bg-rose-950/60 border-rose-500/40';
    return 'text-telemetry-muted bg-space-900 border-white/10';
  };

  // Helper for tag color
  const getTagBadge = (tag: 'A' | 'B' | 'C', tagColor: 'emerald' | 'amber' | 'cyan') => {
    const colors = {
      emerald: 'bg-emerald-500 text-space-950 border-emerald-400',
      amber: 'bg-amber-400 text-space-950 border-amber-300',
      cyan: 'bg-cyan-400 text-space-950 border-cyan-300'
    }[tagColor];
    return (
      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-none text-xs font-black font-mono border ${colors}`}>
        {tag}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-space-950/90 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-3xl rounded-xl bg-[#0b1018] border border-amber-500/40 shadow-[0_10px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.12)] p-6 text-slate-200 font-sans">

        {/* ========================================================
            STAGE 1: BRIEFING & STRATEGIC INDICATORS
            ======================================================== */}
        {stage === 'briefing' && (
          <div className="space-y-4">
            
            {/* Mission Control Alert Banner */}
            <div className="pb-3 border-b border-white/[0.08] flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 animate-pulse mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-mono font-semibold">
                      {event.code}
                    </span>
                    <span className="text-[10px] text-amber-400 tracking-wider uppercase font-semibold font-sans">
                      MISSION CONTROL DECISION ROOM // CRITICAL ANOMALY
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase mt-1 font-sans">
                    {event.title}
                  </h2>
                </div>
              </div>
              <Badge variant="warning" className="shrink-0 hidden sm:inline-flex">
                INTERVENTION REQUIRED
              </Badge>
            </div>

            {/* Subsystem Under Stress Warning */}
            <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/25 text-xs font-sans space-y-1">
              <div className="font-sans text-[11px] font-semibold text-amber-300 uppercase flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>SYSTEM UNDER OPERATIONAL STRESS:</span>
              </div>
              <p className="text-white font-medium">{event.systemUnderStress}</p>
              <p className="text-slate-400 leading-relaxed">{event.description}</p>
            </div>

            {/* Current Real-Time Resource Status Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[11px] font-sans">
              {/* Power */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-sky-400" /> POWER</span>
                  <span className="text-white font-mono font-semibold">{currentResources.powerUnits} / {currentResources.maxPowerUnits} U</span>
                </div>
                <div className="w-full bg-space-950 h-1.5 rounded-full overflow-hidden border border-white/[0.06]">
                  <div className="bg-sky-400 h-full rounded-full" style={{ width: `${(currentResources.powerUnits / currentResources.maxPowerUnits) * 100}%` }} />
                </div>
              </div>

              {/* Fuel */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1"><Fuel className="w-3 h-3 text-sky-400" /> FUEL</span>
                  <span className="text-white font-mono font-semibold">{currentResources.fuelPct}%</span>
                </div>
                <div className="w-full bg-space-950 h-1.5 rounded-full overflow-hidden border border-white/[0.06]">
                  <div className="bg-sky-400 h-full rounded-full" style={{ width: `${currentResources.fuelPct}%` }} />
                </div>
              </div>

              {/* Science */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1"><Atom className="w-3 h-3 text-sky-400" /> SCIENCE</span>
                  <span className="text-white font-mono font-semibold">{currentResources.scienceScore} PTS</span>
                </div>
                <div className="w-full bg-space-950 h-1.5 rounded-full overflow-hidden border border-white/[0.06]">
                  <div className="bg-sky-400 h-full rounded-full" style={{ width: `${Math.min(100, currentResources.scienceScore)}%` }} />
                </div>
              </div>

              {/* Risk */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-amber-400" /> RISK</span>
                  <span className="text-amber-300 font-mono font-semibold">{currentResources.riskPct}%</span>
                </div>
                <div className="w-full bg-space-950 h-1.5 rounded-full overflow-hidden border border-white/[0.06]">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${currentResources.riskPct}%` }} />
                </div>
              </div>
            </div>

            {/* Strategic Options with Decision Preview Indicators */}
            <div className="space-y-2.5">
              <div className="text-[11px] text-sky-400 tracking-wider font-semibold uppercase flex items-center justify-between font-sans">
                <span>COMMAND DIRECTIVES (SELECT FLIGHT ACTION):</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  PREVIEW STRATEGIC DIRECTION BEFORE COMMIT
                </span>
              </div>

              {event.choices.map((choice) => (
                <div
                  key={choice.id}
                  onClick={() => handleSelect(choice)}
                  className="p-3.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.07] hover:border-sky-400/60 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5 shrink-0">
                        {getTagBadge(choice.tag, choice.tagColor)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-white group-hover:text-sky-300 transition-colors font-sans">
                          {choice.label}
                        </h4>
                        <p className="text-[11px] font-sans text-slate-400 mt-1 leading-relaxed">
                          {choice.rationale}
                        </p>

                        {/* Trade-off Trend Indicators (Arrows) */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2 font-mono text-[10px]">
                          <span className="text-[10px] text-slate-500 uppercase font-sans font-medium mr-1">
                            VECTOR IMPACT:
                          </span>
                          {choice.indicators.map((ind, i) => (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded border flex items-center gap-1 font-semibold ${getTrendClass(ind.tone)}`}
                            >
                              <span>{ind.metric}</span>
                              <span className="text-xs tracking-tight">{ind.symbol}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      className="shrink-0 mt-1 pointer-events-none group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors"
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      EXECUTE
                    </Button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================
            STAGE 2: COMMAND UPLINK TRANSMITTING (SUSPENSE)
            ======================================================== */}
        {stage === 'uplink_transmitting' && selectedChoice && (
          <div className="py-12 px-6 text-center space-y-6 animate-fade-in font-sans">
            <div className="inline-flex p-4 rounded-full bg-sky-950/70 border border-sky-400/40 text-sky-400 shadow-sm animate-pulse">
              <Radio className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <div className="text-[11px] text-sky-400 tracking-wider uppercase font-semibold mb-1 font-mono">
                COMMUNICATION UPLINK ACTIVE // 8.4 GHz X-BAND
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight font-sans">
                DECISION ACCEPTED: {selectedChoice.label}
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-2 max-w-md mx-auto leading-relaxed">
                Transmitting command telemetry packet to spacecraft navigation computer...
              </p>
            </div>

            {/* Uplink Progress Bar */}
            <div className="max-w-md mx-auto space-y-2">
              <div className="w-full bg-space-950 h-2 rounded-full border border-white/[0.08] overflow-hidden">
                <div
                  className="bg-sky-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${transmissionProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono tabular-nums">
                <span>PROPAGATION DELAY: 12.4s</span>
                <span className="text-sky-300 font-semibold">{transmissionProgress}% VERIFIED</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 italic font-sans">
              "Every command takes time to bridge the void. Stand by for telemetry confirmation."
            </div>
          </div>
        )}

        {/* ========================================================
            STAGE 3: CONSEQUENCE DETECTED REVEAL
            ======================================================== */}
        {stage === 'consequence_reveal' && selectedChoice && (
          <div className="space-y-5 animate-scale-up font-sans">
            
            {/* Header */}
            <div className="pb-3 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-amber-500/15 border border-amber-400/40 text-amber-300">
                  <Activity className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase block font-sans">
                    TELEMETRY CONFIRMED // DELAYED CONSEQUENCE
                  </span>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight font-sans">
                    ⚠️ CONSEQUENCE DETECTED
                  </h3>
                </div>
              </div>
              <Badge variant="warning">STATUS UPDATED</Badge>
            </div>

            {/* Consequence Detailed Card */}
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.08] space-y-3 shadow-sm">
              <div className="text-sm font-semibold text-sky-300 uppercase flex items-center gap-2 font-sans">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{selectedChoice.consequenceTitle}</span>
              </div>
              <p className="text-xs font-sans text-slate-300 leading-relaxed">
                {selectedChoice.consequenceDescription}
              </p>

              {/* Quantified Resource Shifts (Before → After) */}
              <div className="mt-3 pt-3 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
                {selectedChoice.fuelDelta !== 0 && (
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10px] text-slate-400 font-medium block">PROPELLANT:</span>
                    <span className="text-white font-mono font-semibold block mt-0.5 tabular-nums">
                      {currentResources.fuelPct}% → {currentResources.fuelPct + selectedChoice.fuelDelta}%
                    </span>
                    <span className="text-[10px] text-rose-400 font-mono font-bold block">
                      ({selectedChoice.fuelDelta}%)
                    </span>
                  </div>
                )}

                {selectedChoice.powerDelta && selectedChoice.powerDelta !== 0 && (
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10px] text-slate-400 font-medium block">BUS POWER:</span>
                    <span className="text-white font-mono font-semibold block mt-0.5 tabular-nums">
                      {currentResources.powerUnits} → {currentResources.powerUnits + selectedChoice.powerDelta} U
                    </span>
                    <span className="text-[10px] text-rose-400 font-mono font-bold block">
                      ({selectedChoice.powerDelta} U)
                    </span>
                  </div>
                )}

                {selectedChoice.riskDelta !== 0 && (
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10px] text-slate-400 font-medium block">FLIGHT RISK:</span>
                    <span className="text-white font-mono font-semibold block mt-0.5 tabular-nums">
                      {currentResources.riskPct}% → {currentResources.riskPct + selectedChoice.riskDelta}%
                    </span>
                    <span className={`text-[10px] font-mono font-bold block ${selectedChoice.riskDelta < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ({selectedChoice.riskDelta > 0 ? `+${selectedChoice.riskDelta}` : selectedChoice.riskDelta}%)
                    </span>
                  </div>
                )}

                {selectedChoice.scienceDelta !== 0 && (
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10px] text-slate-400 font-medium block">SCIENCE RETURN:</span>
                    <span className="text-white font-mono font-semibold block mt-0.5 tabular-nums">
                      {currentResources.scienceScore} → {currentResources.scienceScore + selectedChoice.scienceDelta} PTS
                    </span>
                    <span className={`text-[10px] font-mono font-bold block ${selectedChoice.scienceDelta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ({selectedChoice.scienceDelta > 0 ? `+${selectedChoice.scienceDelta}` : selectedChoice.scienceDelta})
                    </span>
                  </div>
                )}

                {selectedChoice.dataDelta && selectedChoice.dataDelta !== 0 && (
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10px] text-slate-400 font-medium block">DATA RETURN:</span>
                    <span className="text-white font-mono font-semibold block mt-0.5 tabular-nums">
                      {currentResources.dataReturnScore} → {currentResources.dataReturnScore + selectedChoice.dataDelta} PTS
                    </span>
                    <span className={`text-[10px] font-mono font-bold block ${selectedChoice.dataDelta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ({selectedChoice.dataDelta > 0 ? `+${selectedChoice.dataDelta}` : selectedChoice.dataDelta})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Simulation Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-sans">
                Trajectory nominal. Resuming heliocentric cruise simulation.
              </span>

              <Button
                variant="primary"
                size="md"
                onClick={handleFinalAcknowledge}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                ACKNOWLEDGE & RESUME FLIGHT
              </Button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
