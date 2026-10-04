import React from 'react';
import { useMission } from '../../hooks/useMission';
import { PayloadManager } from '../../components/instruments/PayloadManager';
import { SpacecraftVisualizer } from '../../components/spacecraft/SpacecraftVisualizer';
import { TelemetryPanel } from '../../components/telemetry/TelemetryPanel';
import { AerospaceCard } from '../../components/common/AerospaceCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const PayloadScreen: React.FC = () => {
  const { config, audit, setPhase } = useMission();

  return (
    <div className="max-w-[1720px] mx-auto w-full p-4 space-y-4 font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-sky-950 text-sky-400 px-2 py-0.5 rounded border border-sky-500/30 font-mono font-semibold">
              SCI-03
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-sans font-medium">
              SCIENTIFIC PAYLOAD MANIFEST // TRADE-OFF ENGINE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase font-sans">
            SCIENTIFIC PAYLOAD INTEGRATION
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            "Every instrument increases what we can learn — and what the spacecraft must carry."
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
            onClick={() => setPhase('mission_control')}
          >
            SPACECRAFT BUS
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => setPhase('readiness')}
          >
            PRE-LAUNCH READINESS
          </Button>
        </div>
      </div>

      {/* Main Grid: Instruments Manager + Spacecraft Schematic + Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 8 Cols: Scientific Instruments Manifest */}
        <div className="lg:col-span-8 space-y-4">
          <PayloadManager />

          {/* Trade-Off Guidance Callout */}
          <div className="p-4 rounded-md bg-space-850/90 border border-white/[0.08] text-xs font-sans text-slate-300 shadow-sm">
            <h4 className="font-mono text-[11px] font-bold text-sky-300 uppercase mb-1">
              SYSTEMS ENGINEERING TRADE-OFF PRINCIPLE
            </h4>
            <p className="text-slate-400 leading-relaxed font-sans">
              Planetary science instruments carry compounding architectural consequences: adding the <strong className="text-white">Synthetic Aperture Radar</strong> adds 22 Science, but demands 180 kg structural mass and 18 units of continuous RF amplification power. If your bus exceeds capacity, upgrade to Advanced Concentrator Solar or deselect secondary payloads before launch.
            </p>
          </div>
        </div>

        {/* Right 4 Cols: Spacecraft SVG + Telemetry Panel */}
        <div className="lg:col-span-4 space-y-3">
          {/* Spacecraft Visual Showing Active Instrument Modules */}
          <AerospaceCard
            code="PAYLOAD-VIEW"
            title="PAYLOAD BAY VISUALIZER"
            subtitle="BAY ORIENTATION & SENSOR APERTURES"
          >
            <SpacecraftVisualizer configuration={config} installedInstruments={config.selectedInstrumentIds} compact />
          </AerospaceCard>

          {/* Live Telemetry Panel */}
          <div>
            <TelemetryPanel compact={true} />
          </div>
        </div>

      </div>

      {/* Bottom Action Footer */}
      <div className="p-3.5 rounded-md bg-space-850/90 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Badge variant={audit.isReady ? 'nominal' : 'warning'}>
            {audit.isReady ? 'PAYLOAD VERIFIED // READY FOR AUDIT' : 'MARGIN VIOLATIONS DETECTED'}
          </Badge>
          <span className="text-xs text-slate-400 font-sans">
            {config.selectedInstrumentIds.length} instrument(s) mounted.
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
            onClick={() => setPhase('mission_control')}
          >
            MODIFY BUS
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => setPhase('readiness')}
            className="w-full sm:w-auto"
          >
            PROCEED TO FLIGHT READINESS AUDIT
          </Button>
        </div>
      </div>

    </div>
  );
};
