import React from 'react';
import { useMission } from '../../hooks/useMission';
import { MissionConfigSelector } from '../../components/mission/MissionConfigSelector';
import { SpacecraftVisualizer } from '../../components/spacecraft/SpacecraftVisualizer';
import { TelemetryPanel } from '../../components/telemetry/TelemetryPanel';
import { AerospaceCard } from '../../components/common/AerospaceCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';

export const MissionControlScreen: React.FC = () => {
  const { config, audit, setPhase, applyDemoPreset } = useMission();

  return (
    <div className="max-w-[1720px] mx-auto w-full p-5 sm:p-8 space-y-6 font-sans">
      
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-sky-950 text-sky-400 px-2 py-0.5 rounded border border-sky-500/30 font-mono font-semibold">
              02 / Spacecraft
            </span>
            <span className="text-xs text-slate-400 font-sans">
              Choose the systems that power your mission
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-sans">
            Spacecraft design
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Sparkles className="w-3.5 h-3.5 text-sky-400" />}
            onClick={applyDemoPreset}
          >
            Load demo preset
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => setPhase('payload')}
          >
            Configure payload ({config.selectedInstrumentIds.length}/5)
          </Button>
        </div>
      </div>

      {/* Three-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT ZONE: Mission Configuration (4 cols) */}
        <div className="lg:col-span-4 h-full max-h-[740px] overflow-y-auto pr-1">
          <MissionConfigSelector />
        </div>

        {/* CENTER ZONE: Interactive Spacecraft Visualizer (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          <AerospaceCard
            code="SC-VIEW"
            title="SPACECRAFT VISUALIZER"
            subtitle="INTERACTIVE ASSEMBLY // REAL-TIME SUBSYSTEM COMPOSITION"
            className="flex-1"
          >
            <SpacecraftVisualizer configuration={config} installedInstruments={config.selectedInstrumentIds} />

            {/* Subsystem Specifications Footer */}
            <div className="mt-3 pt-3 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-[10px]">
              <div className="p-2 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400 block font-medium">PROPULSION:</span>
                <span className="text-white font-mono font-semibold uppercase truncate block">
                  {config.propulsionId}
                </span>
              </div>
              <div className="p-2 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400 block font-medium">POWER SOURCE:</span>
                <span className="text-white font-mono font-semibold uppercase truncate block">
                  {config.powerSystemId.replace('_', ' ')}
                </span>
              </div>
              <div className="p-2 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400 block font-medium">DOWNLINK:</span>
                <span className="text-white font-mono font-semibold uppercase truncate block">
                  {config.communicationId.replace('_', ' ')}
                </span>
              </div>
            </div>
          </AerospaceCard>

          {/* Quick Payload Access Bar */}
          <div className="p-3.5 rounded-md bg-space-850/90 border border-white/[0.08] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-sky-400" />
              <span className="text-xs text-slate-200 font-medium">
                SCIENTIFIC INSTRUMENTS ATTACHED: <span className="font-mono text-sky-300 font-bold">{config.selectedInstrumentIds.length}</span>
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowRight className="w-3 h-3" />}
              onClick={() => setPhase('payload')}
            >
              EDIT INSTRUMENTS
            </Button>
          </div>
        </div>

        {/* RIGHT ZONE: Live Telemetry HUD (3 cols) */}
        <div className="lg:col-span-3">
          <TelemetryPanel />
        </div>

      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="p-3.5 rounded-md bg-space-850/90 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Badge variant={audit.isReady ? 'nominal' : 'warning'}>
            {audit.isReady ? 'SYSTEMS NOMINAL' : 'MARGIN CONSTRAINTS ACTIVE'}
          </Badge>
          <span className="text-xs text-slate-400 font-sans">
            Next milestone: Scientific Payload Suite configuration & Pre-launch readiness audit.
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setPhase('briefing')}
          >
            BACK TO BRIEFING
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => setPhase('payload')}
            className="w-full sm:w-auto"
          >
            PROCEED TO PAYLOAD CONFIG
          </Button>
        </div>
      </div>

    </div>
  );
};
