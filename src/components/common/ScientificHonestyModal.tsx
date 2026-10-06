import React from 'react';
import { X, ShieldAlert, Database, Cpu, Compass } from 'lucide-react';
import { Button } from './Button';

interface ScientificHonestyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScientificHonestyModal: React.FC<ScientificHonestyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-2xl bg-slate-950/95 border border-white/[0.1] rounded-xl shadow-2xl p-6 text-slate-200 backdrop-blur-xl">
        
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
                SCIENTIFIC BASIS & PROTOTYPE DISCLOSURE
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">
                DOC-REF: MF-2026-ARCH-01 // PROJECT AURORA
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors rounded"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs font-sans text-slate-300 leading-relaxed">
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-200">
            <span className="font-semibold tracking-wide uppercase block text-[11px] mb-1">
              Scientific Honesty Statement
            </span>
            MISSION FORGE is an independent educational game prototype for NASA Space Apps Challenge participation.
            The flight challenges use fictional, game-balanced parameters inspired by aerospace trade-offs. The burn, storm and downlink encounters are decision models, not mission-grade orbital or radio simulations.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-md">
              <div className="flex items-center gap-2 mb-1.5 text-sky-400 font-semibold text-[11px]">
                <Database className="w-4 h-4" />
                <span>DATA PROVENANCE</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Numbers and event timing in this prototype are authored game parameters, not live NASA telemetry. The 3D route and planet view are illustrative and not to scale.
              </p>
            </div>

            <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-md">
              <div className="flex items-center gap-2 mb-1.5 text-sky-400 font-semibold text-[11px]">
                <Cpu className="w-4 h-4" />
                <span>ENGINEERING PRINCIPLES</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Preflight calculations approximate mass, power, budget and propulsion trade-offs. Flight challenges connect those configuration choices to limited fuel, storm power capacity, data-window capacity and arrival risk.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-md">
            <div className="flex items-center gap-2 mb-1.5 text-sky-400 font-semibold text-[11px]">
              <Compass className="w-4 h-4" />
              <span>FUTURE SCIENCE INTEGRATION</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
              <li>Ingest verified Horizons ephemerides and SPICE trajectory kernels.</li>
              <li>Integrate real instrumentation mass/power profiles from Mars Reconnaissance Orbiter & Europa Clipper.</li>
              <li>Expose Python FastAPI microservice for high-precision orbital numerical integration.</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/[0.08]">
          <Button variant="primary" size="sm" onClick={onClose}>
            ACKNOWLEDGE & RETURN
          </Button>
        </div>
      </div>
    </div>
  );
};
