import React from 'react';
import { useMission } from '../../hooks/useMission';
import { ReadinessAuditList } from '../../components/mission/ReadinessAuditList';
import { TelemetryPanel } from '../../components/telemetry/TelemetryPanel';
import { AerospaceCard } from '../../components/common/AerospaceCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ArrowLeft, Rocket, ShieldCheck, Atom, AlertTriangle, Layers } from 'lucide-react';
import { INSTRUMENTS } from '../../data/instruments';

export const ReadinessScreen: React.FC = () => {
  const { config, resources, audit, setPhase } = useMission();

  return (
    <div className="max-w-[1720px] mx-auto w-full p-5 sm:p-8 space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-sky-950 text-sky-400 px-2 py-0.5 rounded border border-sky-500/30 font-mono font-semibold">
              04 / Readiness
            </span>
            <span className="text-xs text-slate-400 font-sans">
              Review constraints before launch
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-sans">
            Mission readiness
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
            onClick={() => setPhase('payload')}
          >
            Modify payload
          </Button>

          <Button
            variant={audit.isReady ? 'primary' : 'danger'}
            size="md"
            disabled={!audit.isReady}
            icon={<Rocket className="w-3.5 h-3.5" />}
            onClick={() => setPhase('launch')}
          >
            Launch mission
          </Button>
        </div>
      </div>

      {/* Main Grid: Audit Checklist + Mission Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 8 Cols: Comprehensive Audit Checklist */}
        <div className="lg:col-span-8 space-y-4">
          <ReadinessAuditList />

          {/* Subsystem Configuration Summary */}
          <AerospaceCard
            code="CFG-SUM"
            title="SYSTEM ARCHITECTURE SUMMARY"
            subtitle="INTEGRATED EXPLORER SPECIFICATIONS"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-[10px] text-slate-400 font-medium block">DESTINATION:</span>
                <span className="text-white font-mono font-semibold uppercase truncate block mt-0.5">
                  {config.destinationId.replace('_', ' ')}
                </span>
              </div>
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-[10px] text-slate-400 font-medium block">LAUNCHER:</span>
                <span className="text-white font-mono font-semibold uppercase truncate block mt-0.5">
                  {config.launchVehicleId.replace('_', ' ')}
                </span>
              </div>
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-[10px] text-slate-400 font-medium block">PROPULSION:</span>
                <span className="text-white font-mono font-semibold uppercase truncate block mt-0.5">
                  {config.propulsionId}
                </span>
              </div>
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-[10px] text-slate-400 font-medium block">POWER SOURCE:</span>
                <span className="text-white font-mono font-semibold uppercase truncate block mt-0.5">
                  {config.powerSystemId.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Installed Instruments Badges */}
            <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium font-sans">
                <Layers className="w-3.5 h-3.5 text-sky-400" /> INSTALLED PAYLOAD:
              </span>
              {config.selectedInstrumentIds.map((id) => {
                const inst = INSTRUMENTS.find(i => i.id === id);
                return (
                  <span
                    key={id}
                    className="px-2 py-0.5 rounded bg-white/[0.03] text-sky-300 border border-sky-400/20 font-mono text-[10px]"
                  >
                    {inst?.name || id}
                  </span>
                );
              })}
            </div>
          </AerospaceCard>
        </div>

        {/* Right 4 Cols: Live Telemetry & Mission Score Preview */}
        <div className="lg:col-span-4 space-y-4">
          {/* Mission Score Preview Card */}
          <AerospaceCard
            code="SCORE-PRV"
            title="PRE-LAUNCH SCORE PROJECTION"
            subtitle="PROJECTED MISSION RATING UNDER CURRENT DESIGN"
          >
            <div className="p-4 rounded-md bg-white/[0.02] border border-sky-400/20 text-center">
              <span className="text-[10px] text-slate-400 font-sans tracking-wider uppercase block mb-1 font-medium">
                PROJECTED FLIGHT EFFICIENCY
              </span>
              <div className="text-4xl font-bold font-mono text-sky-300 tracking-tight tabular-nums">
                {audit.scorePreview} <span className="text-sm text-slate-400 font-normal">/ 100</span>
              </div>
              <Badge variant="nominal" className="mt-2.5">
                ESTIMATED RELIABILITY: {resources.reliabilityPct}%
              </Badge>
            </div>

            <div className="mt-3 space-y-2 text-xs font-sans">
              <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Atom className="w-3.5 h-3.5 text-sky-400" /> Scientific Potential:
                </span>
                <span className="text-white font-mono font-semibold tabular-nums">{resources.scienceScore} PTS</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Operational Reliability:
                </span>
                <span className="text-emerald-300 font-mono font-semibold tabular-nums">{resources.reliabilityPct}%</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Inherent Flight Risk:
                </span>
                <span className="text-amber-300 font-mono font-semibold tabular-nums">{resources.riskPct}%</span>
              </div>
            </div>
          </AerospaceCard>

          {/* Telemetry Panel */}
          <TelemetryPanel compact={true} />
        </div>

      </div>

    </div>
  );
};
