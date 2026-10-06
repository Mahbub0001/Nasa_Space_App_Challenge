import React, { useState, useEffect } from 'react';
import { useMission } from '../../hooks/useMission';
import { AerospaceCard } from '../../components/common/AerospaceCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { sound } from '../../utils/sound';
import { MissionPatchCertificate } from '../../components/results/MissionPatchCertificate';
import { DESTINATIONS } from '../../data/destinations';
import { buildMissionResult } from '../../simulation/scoring';
import { 
  RotateCcw, 
  Split, 
  Atom, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  Wifi, 
  Lightbulb, 
  Compass, 
  Sparkles 
} from 'lucide-react';

export const ResultsScreen: React.FC = () => {
  const { missionResult, config, setPhase, retryFlight, resources, decisions } = useMission();
  const [revealIndex, setRevealIndex] = useState(0);

  useEffect(() => {
    sound.playSuccess();
    // Progressive score reveal sequence
    const timers = [
      setTimeout(() => setRevealIndex(1), 300),  // Science
      setTimeout(() => setRevealIndex(2), 650),  // Reliability
      setTimeout(() => setRevealIndex(3), 1000), // Resources
      setTimeout(() => setRevealIndex(4), 1350), // Budget
      setTimeout(() => setRevealIndex(5), 1700), // Data return
      setTimeout(() => setRevealIndex(6), 2100), // Final score & insight
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const activeResult = missionResult || buildMissionResult(config, resources, decisions);
  const { scoreBreakdown, missionInsight, keyDecision } = activeResult;

  const scoreBadgeVariant = {
    'EXCEPTIONAL MISSION': 'nominal' as const,
    'MISSION SUCCESS': 'nominal' as const,
    'PARTIAL SUCCESS': 'warning' as const,
    'HIGH RISK': 'alert' as const,
    'MISSION FAILURE': 'alert' as const
  }[scoreBreakdown.classification];

  return (
    <div className="max-w-[1520px] mx-auto w-full p-5 sm:p-8 space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-mono font-semibold">
              06 / Results
            </span>
            <span className="text-xs text-slate-400 font-sans">
              Project Aurora flight debrief
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-sans">
            Mission results
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            icon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
            onClick={() => setPhase('discovery')}
          >
            Science discoveries
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={retryFlight}
          >
            Replay mission
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<Split className="w-4 h-4" />}
            onClick={() => setPhase('what_if')}
          >
            What-if analysis
          </Button>
        </div>
      </div>

      {activeResult.flightOutcome && (
        <div className={`rounded-xl border p-5 sm:p-6 ${activeResult.flightOutcome.missionStatus === 'failed' ? 'border-rose-500/45 bg-rose-950/25' : 'border-emerald-500/35 bg-emerald-950/20'}`}>
          <div className="text-[10px] tracking-[.18em] font-mono text-slate-400 mb-2">FLIGHT DIRECTOR OUTCOME</div>
          <div className="text-xl sm:text-2xl font-semibold text-white">
            {activeResult.flightOutcome.missionStatus === 'full' ? 'Mission accomplished · science brought home' : activeResult.flightOutcome.missionStatus === 'partial' ? 'Partial success · more data was left behind' : 'Mission objective missed · revise and fly again'}
          </div>
          <div className="mt-2 text-sm text-slate-300">
            Orbit {activeResult.flightOutcome.orbitCaptured ? 'captured' : 'not captured'} · {activeResult.flightOutcome.packetsReturned}/{activeResult.flightOutcome.packetsAvailable} data packets returned · trajectory error {activeResult.flightOutcome.trajectoryError} m/s
          </div>
        </div>
      )}

      {/* Main Hero Score Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left 5 Cols: Final Overall Score Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <AerospaceCard
            code="FINAL-EVAL"
            title="DIRECTORATE FLIGHT RATING"
            subtitle="WEIGHTED MULTI-OBJECTIVE COMPOSITE SCORE"
            className="flex-1 flex flex-col justify-between"
          >
            <div className="p-6 rounded-lg bg-white/[0.02] border border-sky-400/20 text-center relative overflow-hidden">
              <div className="text-xs text-slate-400 tracking-wider uppercase mb-1 font-sans font-medium">
                OVERALL FLIGHT SCORE
              </div>

              {revealIndex >= 6 ? (
                <div className="animate-scale-up">
                  <div className="text-7xl font-bold font-mono text-sky-300 tracking-tight my-2 tabular-nums">
                    {scoreBreakdown.finalScore}
                    <span className="text-xl text-slate-400 font-normal"> / 100</span>
                  </div>
                  <Badge variant={scoreBadgeVariant} size="md" className="text-xs px-3 py-1 mt-1">
                    {scoreBreakdown.classification}
                  </Badge>
                </div>
              ) : (
                <div className="h-28 flex items-center justify-center text-slate-500 font-mono text-xs animate-pulse">
                  COMPUTING WEIGHTED TELEMETRY VECTORS...
                </div>
              )}
            </div>

            {/* Narrative Mission Insight */}
            <div className="mt-4 space-y-3 font-sans">
              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold uppercase mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-sky-400" />
                  <span>MISSION INSIGHT</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {missionInsight}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase mb-1">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>KEY SYSTEMS TRADEOFF</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {keyDecision}
                </p>
              </div>
            </div>
          </AerospaceCard>
        </div>

        {/* Right 7 Cols: Transparent 5-Metric Score Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <AerospaceCard
            code="SCORING-MATRIX"
            title="TRANSPARENT SCORING MATRIX"
            subtitle="PROJECT AURORA MISSION-SCORE WEIGHTINGS"
          >
            <div className="space-y-3 font-sans">
              
              {/* 1. Scientific Return (30%) */}
              <div className={`p-3.5 rounded-lg border transition-all duration-300 ${
                revealIndex >= 1 ? 'bg-white/[0.02] border-sky-400/40 opacity-100 shadow-sm' : 'bg-white/[0.01] border-white/[0.04] opacity-25'
              }`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-2 font-semibold text-white">
                    <Atom className="w-4 h-4 text-sky-400" />
                    SCIENTIFIC RETURN (30% WEIGHT)
                  </span>
                  <span className="text-sky-300 font-mono font-bold text-sm tabular-nums">
                    {scoreBreakdown.scientificReturn} / 100
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-400 mb-2 leading-relaxed">
                  Comprehensive chemical spectroscopy, subsurface radar penetration, and high-resolution optical surface cartography.
                </p>
                <div className="w-full bg-space-950 h-1.5 rounded-full overflow-hidden border border-white/[0.06]">
                  <div
                    className="bg-sky-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${revealIndex >= 1 ? scoreBreakdown.scientificReturn : 0}%` }}
                  />
                </div>
              </div>

              {/* 2. Mission Reliability (25%) */}
              <div className={`p-3.5 rounded-lg border transition-all duration-300 ${
                revealIndex >= 2 ? 'bg-white/[0.02] border-emerald-400/40 opacity-100 shadow-sm' : 'bg-white/[0.01] border-white/[0.04] opacity-25'
              }`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-2 font-semibold text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    MISSION RELIABILITY (25% WEIGHT)
                  </span>
                  <span className="text-emerald-300 font-mono font-bold text-sm tabular-nums">
                    {scoreBreakdown.missionReliability} / 100
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-400 mb-2 leading-relaxed">
                  Launch booster heritage, component maturity, fault containment, and effective anomaly resolution during cruise.
                </p>
                <div className="w-full bg-space-950 h-1.5 rounded-full overflow-hidden border border-white/[0.06]">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${revealIndex >= 2 ? scoreBreakdown.missionReliability : 0}%` }}
                  />
                </div>
              </div>

              {/* 3. Resource Efficiency (20%) */}
              <div className={`p-3.5 rounded-lg border transition-all duration-300 ${
                revealIndex >= 3 ? 'bg-white/[0.02] border-amber-400/40 opacity-100 shadow-sm' : 'bg-white/[0.01] border-white/[0.04] opacity-25'
              }`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-2 font-semibold text-white">
                    <Zap className="w-4 h-4 text-amber-400" />
                    RESOURCE EFFICIENCY (20% WEIGHT)
                  </span>
                  <span className="text-amber-300 font-mono font-bold text-sm tabular-nums">
                    {scoreBreakdown.resourceEfficiency} / 100
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-400 mb-2 leading-relaxed">
                  Optimized propellant delta-V expenditure, balanced structural mass envelope, and power generation management.
                </p>
                <div className="w-full bg-space-950 h-1.5 rounded-full overflow-hidden border border-white/[0.06]">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${revealIndex >= 3 ? scoreBreakdown.resourceEfficiency : 0}%` }}
                  />
                </div>
              </div>

              {/* 4. Budget Performance (15%) */}
              <div className={`p-3.5 rounded-lg border transition-all duration-300 ${
                revealIndex >= 4 ? 'bg-white/[0.02] border-teal-400/40 opacity-100 shadow-sm' : 'bg-white/[0.01] border-white/[0.04] opacity-25'
              }`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-2 font-semibold text-white">
                    <DollarSign className="w-4 h-4 text-teal-400" />
                    BUDGET PERFORMANCE (15% WEIGHT)
                  </span>
                  <span className="text-teal-300 font-mono font-bold text-sm tabular-nums">
                    {scoreBreakdown.budgetPerformance} / 100
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-400 mb-2 leading-relaxed">
                  Total mission lifecycle cost ($B) adherence within program appropriation thresholds with reserve contingency.
                </p>
                <div className="w-full bg-space-950 h-1.5 rounded-full overflow-hidden border border-white/[0.06]">
                  <div
                    className="bg-teal-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${revealIndex >= 4 ? scoreBreakdown.budgetPerformance : 0}%` }}
                  />
                </div>
              </div>

              {/* 5. Data Return (10%) */}
              <div className={`p-3.5 rounded-lg border transition-all duration-300 ${
                revealIndex >= 5 ? 'bg-white/[0.02] border-sky-400/40 opacity-100 shadow-sm' : 'bg-white/[0.01] border-white/[0.04] opacity-25'
              }`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-2 font-semibold text-white">
                    <Wifi className="w-4 h-4 text-sky-400" />
                    DATA RETURN (10% WEIGHT)
                  </span>
                  <span className="text-sky-300 font-mono font-bold text-sm tabular-nums">
                    {scoreBreakdown.dataReturn} / 100
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-400 mb-2 leading-relaxed">
                  Deep Space Network downlink throughput, dish aperture gain, and effective data return rate without loss.
                </p>
                <div className="w-full bg-space-950 h-1.5 rounded-full overflow-hidden border border-white/[0.06]">
                  <div
                    className="bg-sky-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${revealIndex >= 5 ? scoreBreakdown.dataReturn : 0}%` }}
                  />
                </div>
              </div>

            </div>
          </AerospaceCard>
        </div>

      </div>

      {/* Official NASA Mission Patch & Certificate of Accomplishment */}
      <MissionPatchCertificate
        destinationName={DESTINATIONS.find((d) => d.id === config.destinationId)?.name || 'Mars'}
        missionScore={scoreBreakdown.finalScore}
        sciencePoints={activeResult.finalResources.scienceScore}
        classification={scoreBreakdown.classification}
        launchVehicle={config.launchVehicleId.replace('_', ' ').toUpperCase()}
        propulsion={config.propulsionId.replace('_', ' ').toUpperCase()}
        missionStatus={activeResult.flightOutcome?.missionStatus}
      />

      {/* Decision History / Mission Log Timeline */}
      <AerospaceCard
        code="ACT-LOG"
        title="MISSION DECISION LOG // EXECUTIVE TIMELINE"
        subtitle="CHRONOLOGICAL RECORD OF CRITICAL DIRECTIVES & TACTICAL CONSEQUENCES"
      >
        {activeResult.decisions && activeResult.decisions.length > 0 ? (
          <div className="space-y-4 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeResult.decisions.map((dec, idx) => (
                <div
                  key={dec.eventId || idx}
                  className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.08] relative overflow-hidden flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-950 border border-sky-400/40 text-sky-300 text-[10px] flex items-center justify-center font-bold">
                          ✓
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-sky-300">
                          {dec.eventId}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {dec.timestamp || `MET +${(idx + 1) * 120}d`}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-white tracking-wide font-sans">
                        {dec.eventTitle}
                      </div>

                      <div className="text-xs text-amber-300 font-sans flex items-start gap-1.5 bg-amber-950/20 p-2.5 rounded border border-amber-500/20">
                        <span className="text-amber-400 font-bold shrink-0">→</span>
                        <span>{dec.choiceLabel}</span>
                      </div>

                      <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                        {dec.consequenceSummary}
                      </p>
                    </div>
                  </div>

                  {/* Delta badges */}
                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                    {dec.deltas.fuel !== 0 && (
                      <span className={`px-2 py-0.5 rounded border font-semibold ${dec.deltas.fuel > 0 ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/60 border-rose-500/30 text-rose-300'}`}>
                        FUEL {dec.deltas.fuel > 0 ? `+${dec.deltas.fuel}%` : `${dec.deltas.fuel}%`}
                      </span>
                    )}
                    {dec.deltas.power !== undefined && dec.deltas.power !== 0 && (
                      <span className={`px-2 py-0.5 rounded border font-semibold ${dec.deltas.power > 0 ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/60 border-rose-500/30 text-rose-300'}`}>
                        PWR {dec.deltas.power > 0 ? `+${dec.deltas.power}%` : `${dec.deltas.power}%`}
                      </span>
                    )}
                    {dec.deltas.science !== 0 && (
                      <span className={`px-2 py-0.5 rounded border font-semibold ${dec.deltas.science > 0 ? 'bg-sky-950/60 border-sky-400/30 text-sky-300' : 'bg-rose-950/60 border-rose-500/30 text-rose-300'}`}>
                        SCI {dec.deltas.science > 0 ? `+${dec.deltas.science}%` : `${dec.deltas.science}%`}
                      </span>
                    )}
                    {dec.deltas.risk !== 0 && (
                      <span className={`px-2 py-0.5 rounded border font-semibold ${dec.deltas.risk < 0 ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300' : 'bg-amber-950/60 border-amber-500/30 text-amber-300'}`}>
                        RISK {dec.deltas.risk > 0 ? `+${dec.deltas.risk}%` : `${dec.deltas.risk}%`}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Debrief closing quote banner */}
            <div className="p-3.5 rounded-lg bg-sky-950/30 border border-sky-400/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-300 text-xs">
                <span className="text-sky-400 font-bold">★</span>
                <span className="font-semibold uppercase tracking-wider font-sans">FLIGHT DIRECTOR EVALUATION</span>
              </div>
              <div className="text-xs text-slate-200 italic font-sans font-medium">
                “Your decisions shaped this mission.”
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-slate-500 text-xs font-sans">
            Nominal autonomous cruise trajectory executed with zero intervention overrides required.
          </div>
        )}
      </AerospaceCard>

      {/* Bottom Action Footer */}
      <div className="p-4 rounded-md bg-space-850/90 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm font-sans">
        <div className="text-xs text-slate-400">
          Compare your mission tradeoffs against counterfactual scenarios in the What-If analysis engine.
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            icon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
            onClick={() => setPhase('discovery')}
          >
            DISCOVERY LAB & CERTIFICATE
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={retryFlight}
          >
            REPLAY MISSION
          </Button>

          <Button
            variant="primary"
            size="lg"
            icon={<Split className="w-4 h-4" />}
            onClick={() => setPhase('what_if')}
          >
            EXPLORE WHAT-IF SCENARIOS
          </Button>
        </div>
      </div>

    </div>
  );
};
