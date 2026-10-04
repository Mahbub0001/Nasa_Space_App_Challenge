import React, { useState } from 'react';
import { 
  Atom, 
  Weight, 
  Zap, 
  DollarSign, 
  Plus, 
  Trash2, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Instrument } from '../../types/mission';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface InstrumentCardProps {
  instrument: Instrument;
  isInstalled: boolean;
  onToggle: () => void;
  willExceedPower?: boolean;
  willExceedMass?: boolean;
}

export const InstrumentCard: React.FC<InstrumentCardProps> = ({
  instrument,
  isInstalled,
  onToggle,
  willExceedPower = false,
  willExceedMass = false
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`p-3.5 rounded-md border transition-all duration-200 font-sans relative ${
      isInstalled
        ? 'bg-sky-950/25 border-sky-400/80 ring-1 ring-sky-400/30 shadow-[0_2px_12px_rgba(56,189,248,0.12)]'
        : 'bg-space-850/80 border-white/[0.07] hover:border-white/[0.15]'
    }`}>
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-mono text-[9px] text-slate-400 bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.2 rounded font-medium">
              {instrument.visualBay.toUpperCase()} BAY
            </span>
            <span className="text-[11px] text-slate-400 font-sans truncate">{instrument.category}</span>
          </div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wide truncate font-sans">
            {instrument.name}
          </h4>
        </div>

        <Badge variant={isInstalled ? 'nominal' : 'neutral'} size="sm">
          {isInstalled ? 'INSTALLED' : 'STOWED'}
        </Badge>
      </div>

      {/* Purpose Description */}
      <p className="text-[11px] font-sans text-slate-400 line-clamp-2 mb-3 leading-relaxed">
        {instrument.purpose}
      </p>

      {/* Resource Trade-Off Grid */}
      <div className="grid grid-cols-4 gap-1.5 p-2 rounded bg-white/[0.02] border border-white/[0.05] mb-3 text-[10px]">
        {/* Science */}
        <div className="flex flex-col">
          <span className="text-slate-500 text-[9px] flex items-center gap-0.5 font-medium">
            <Atom className="w-2.5 h-2.5 text-sky-400" /> SCI
          </span>
          <span className="font-mono font-bold text-sky-300 tabular-nums">+{instrument.scienceImpact}</span>
        </div>

        {/* Mass */}
        <div className="flex flex-col">
          <span className="text-slate-500 text-[9px] flex items-center gap-0.5 font-medium">
            <Weight className="w-2.5 h-2.5 text-amber-400" /> MASS
          </span>
          <span className="font-mono font-semibold text-slate-200 tabular-nums">+{instrument.massKg} kg</span>
        </div>

        {/* Power */}
        <div className="flex flex-col">
          <span className="text-slate-500 text-[9px] flex items-center gap-0.5 font-medium">
            <Zap className="w-2.5 h-2.5 text-amber-400" /> PWR
          </span>
          <span className="font-mono font-semibold text-slate-200 tabular-nums">+{instrument.powerDraw} U</span>
        </div>

        {/* Cost */}
        <div className="flex flex-col">
          <span className="text-slate-500 text-[9px] flex items-center gap-0.5 font-medium">
            <DollarSign className="w-2.5 h-2.5 text-slate-400" /> COST
          </span>
          <span className="font-mono font-semibold text-slate-200 tabular-nums">+${instrument.costBillion.toFixed(2)}B</span>
        </div>
      </div>

      {/* Exceed Warnings if not installed yet */}
      {!isInstalled && (willExceedPower || willExceedMass) && (
        <div className="mb-2.5 p-2 rounded bg-amber-950/40 border border-amber-500/30 text-[10px] text-amber-300 flex items-center gap-1.5 font-medium">
          <span className="font-mono uppercase font-bold text-amber-400">WARNING:</span>
          <span>Will exceed {willExceedPower ? 'power capacity' : 'mass envelope'}.</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.06]">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-[11px] text-slate-400 hover:text-sky-300 flex items-center gap-1 transition-colors font-medium"
        >
          <Info className="w-3.5 h-3.5" />
          <span>SPECS</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <Button
          variant={isInstalled ? 'secondary' : 'primary'}
          size="sm"
          onClick={onToggle}
          icon={isInstalled ? <Trash2 className="w-3 h-3 text-rose-400" /> : <Plus className="w-3 h-3" />}
        >
          {isInstalled ? 'REMOVE' : 'INSTALL PAYLOAD'}
        </Button>
      </div>

      {/* Detailed Spec Drawer */}
      {showDetails && (
        <div className="mt-2.5 pt-2 border-t border-white/[0.06] text-[11px] font-sans text-slate-400 leading-relaxed animate-fade-in">
          <p>{instrument.description}</p>
          <div className="mt-1.5 font-mono text-[9px] text-sky-400">
            BUS INTERFACE: HIGH-BANDWIDTH SERDES // TELEMETRY PRIORITY 01
          </div>
        </div>
      )}
    </div>
  );
};
