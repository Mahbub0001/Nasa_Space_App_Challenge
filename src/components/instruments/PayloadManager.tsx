import React from 'react';
import { useMission } from '../../hooks/useMission';
import { INSTRUMENTS } from '../../data/instruments';
import { InstrumentCard } from './InstrumentCard';
import { InstrumentId } from '../../types/mission';
import { AerospaceCard } from '../common/AerospaceCard';
import { Atom, AlertTriangle, CheckCircle } from 'lucide-react';

export const PayloadManager: React.FC = () => {
  const { config, resources, toggleInstrument, showNotification } = useMission();

  const handleToggle = (id: InstrumentId) => {
    const isCurrentlyInstalled = config.selectedInstrumentIds.includes(id);
    const inst = INSTRUMENTS.find(i => i.id === id);
    if (!inst) return;

    if (!isCurrentlyInstalled) {
      // Check if installing will breach constraints
      const projectedPower = resources.powerUnits + inst.powerDraw;
      const projectedMass = resources.massKg + inst.massKg;

      toggleInstrument(id);
      
      if (projectedPower > resources.maxPowerUnits) {
        showNotification('warning', 'POWER MARGIN EXCEEDED', `Adding ${inst.name} pushed power demand to ${projectedPower} / ${resources.maxPowerUnits} U. Consider upgrading power or removing other payloads.`);
      } else if (projectedMass > resources.maxMassKg) {
        showNotification('warning', 'MASS CEILING EXCEEDED', `Adding ${inst.name} pushed total mass to ${projectedMass} / ${resources.maxMassKg} KG. Upgrade launcher or optimize hardware.`);
      } else {
        showNotification('success', 'PAYLOAD INTEGRATED', `${inst.name} mounted to ${inst.visualBay.toUpperCase()} bay (+${inst.scienceImpact} Science).`);
      }
    } else {
      toggleInstrument(id);
      showNotification('info', 'PAYLOAD REMOVED', `${inst.name} removed from payload bay.`);
    }
  };

  return (
    <AerospaceCard
      code="SCI-BAY"
      title="SCIENTIFIC PAYLOAD INTEGRATION"
      subtitle="SELECT OBSERVATIONAL INSTRUMENTS UNDER RIGOROUS MASS & POWER CONSTRAINTS"
      headerAction={
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-sans text-xs">TOTAL SCIENCE:</span>
          <span className="text-sky-300 font-bold font-mono px-2 py-0.5 bg-sky-500/10 border border-sky-500/20 rounded tabular-nums">
            {resources.scienceScore} PTS
          </span>
        </div>
      }
    >
      <div className="mb-3.5 p-3 bg-white/[0.02] border border-white/[0.06] rounded-md font-sans text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-400">
          <Atom className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            Active Payload Suite: <strong className="text-slate-100 font-mono">{config.selectedInstrumentIds.length}</strong> / {INSTRUMENTS.length} Instruments
          </span>
        </div>

        {resources.powerMarginUnits < 0 ? (
          <div className="flex items-center gap-1.5 text-rose-400 font-semibold font-mono text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>POWER DEFICIT: {Math.abs(resources.powerMarginUnits)} U</span>
          </div>
        ) : resources.massMarginKg < 0 ? (
          <div className="flex items-center gap-1.5 text-rose-400 font-semibold font-mono text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>MASS EXCESS: {Math.abs(resources.massMarginKg)} KG</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>PAYLOAD MARGINS NOMINAL</span>
          </div>
        )}
      </div>

      {/* Grid of 5 Instruments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {INSTRUMENTS.map((inst) => {
          const isInstalled = config.selectedInstrumentIds.includes(inst.id);
          const willExceedPower = !isInstalled && (resources.powerUnits + inst.powerDraw > resources.maxPowerUnits);
          const willExceedMass = !isInstalled && (resources.massKg + inst.massKg > resources.maxMassKg);

          return (
            <InstrumentCard
              key={inst.id}
              instrument={inst}
              isInstalled={isInstalled}
              onToggle={() => handleToggle(inst.id)}
              willExceedPower={willExceedPower}
              willExceedMass={willExceedMass}
            />
          );
        })}
      </div>
    </AerospaceCard>
  );
};
