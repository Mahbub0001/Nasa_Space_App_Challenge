import { lazy, Suspense, useId, useState } from 'react';
import { Box, PanelsTopLeft } from 'lucide-react';
import type { InstrumentId, MissionConfiguration } from '../../types/mission';
import { SpacecraftSVG } from './SpacecraftSVG';
import './spacecraft.css';

const Spacecraft3DCanvas = lazy(() => import('./Spacecraft3DCanvas'));

interface SpacecraftVisualizerProps {
  configuration: MissionConfiguration;
  installedInstruments: InstrumentId[];
  compact?: boolean;
}

export function SpacecraftVisualizer({ configuration, installedInstruments, compact = false }: SpacecraftVisualizerProps) {
  const [view, setView] = useState<'2d' | '3d'>('3d');
  const viewerId = useId();

  return (
    <section aria-label="Spacecraft visualizer" className="w-full min-w-0 border border-white/[0.08] rounded-md overflow-hidden bg-space-950">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-white/[0.08] bg-white/[0.02] p-2" role="group" aria-label="Spacecraft view mode">
        <button type="button" aria-pressed={view === '2d'} aria-controls={viewerId} onClick={() => setView('2d')} className="spacecraft-view-button">
          <PanelsTopLeft size={13} /> 2D CAD SCHEMATIC
        </button>
        <button type="button" aria-pressed={view === '3d'} aria-controls={viewerId} onClick={() => setView('3d')} className="spacecraft-view-button">
          <Box size={13} /> 3D ORBITAL VIEW
        </button>
      </div>
      <div id={viewerId} className={compact ? 'h-[300px] sm:h-[340px]' : 'h-[380px] sm:h-[460px]'}>
        <div key={view} className="spacecraft-view-enter h-full w-full">
          {view === '3d' ? (
            <Suspense fallback={<div role="status" className="flex h-full items-center justify-center font-mono text-xs text-cyan-300">INITIALIZING ORBITAL VIEW…</div>}>
              <Spacecraft3DCanvas configuration={configuration} installedInstruments={installedInstruments} onFallback={() => setView('2d')} />
            </Suspense>
          ) : (
            <div className="h-full p-2">
              <SpacecraftSVG propulsion={configuration.propulsionId} power={configuration.powerSystemId} comms={configuration.communicationId} instruments={installedInstruments} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
