import React from 'react';
import { 
  Weight, 
  Zap, 
  DollarSign, 
  Fuel, 
  ShieldAlert, 
  Atom, 
  Wifi, 
  Activity 
} from 'lucide-react';
import { useMission } from '../../hooks/useMission';
import { TelemetryGauge } from './TelemetryGauge';
import { AerospaceCard } from '../common/AerospaceCard';

export const TelemetryPanel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { resources, audit } = useMission();

  return (
    <AerospaceCard
      code="TLM-SYS"
      title="LIVE MISSION TELEMETRY"
      subtitle="REAL-TIME SUBSYSTEM BUDGET MARGINS"
      className="h-full flex flex-col justify-between"
    >
      <div className={`grid gap-2.5 ${compact ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
        
        {/* MASS */}
        <TelemetryGauge
          label="Spacecraft Mass"
          code="MASS"
          currentValue={resources.massKg}
          maxValue={resources.maxMassKg}
          unit="KG"
          reverseRisk={true}
          warningThreshold={0.92}
          dangerThreshold={1.0}
          icon={<Weight className="w-3.5 h-3.5" />}
        />

        {/* POWER */}
        <TelemetryGauge
          label="Power Capacity"
          code="PWR"
          currentValue={resources.powerUnits}
          maxValue={resources.maxPowerUnits}
          unit="U"
          reverseRisk={true}
          warningThreshold={0.92}
          dangerThreshold={1.0}
          icon={<Zap className="w-3.5 h-3.5" />}
        />

        {/* BUDGET */}
        <TelemetryGauge
          label="Lifecycle Budget"
          code="COST"
          currentValue={resources.budgetBillion}
          maxValue={resources.maxBudgetBillion}
          isCurrency={true}
          reverseRisk={true}
          warningThreshold={0.94}
          dangerThreshold={1.0}
          icon={<DollarSign className="w-3.5 h-3.5" />}
        />

        {/* FUEL */}
        <TelemetryGauge
          label="Delta-V Propellant"
          code="FUEL"
          currentValue={resources.fuelPct}
          isPercentage={true}
          reverseRisk={false}
          icon={<Fuel className="w-3.5 h-3.5" />}
        />

        {/* OPERATIONAL RISK */}
        <TelemetryGauge
          label="Operational Risk"
          code="RISK"
          currentValue={resources.riskPct}
          isPercentage={true}
          reverseRisk={true}
          warningThreshold={0.45}
          dangerThreshold={0.60}
          icon={<ShieldAlert className="w-3.5 h-3.5" />}
        />

        {/* SCIENCE VALUE */}
        <TelemetryGauge
          label="Scientific Score"
          code="SCI"
          currentValue={resources.scienceScore}
          maxValue={100}
          reverseRisk={false}
          icon={<Atom className="w-3.5 h-3.5" />}
        />

        {!compact && (
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans mb-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Activity className="w-3 h-3 text-sky-400" /> RELIABILITY
                </span>
                <span className="text-sky-300 font-mono font-semibold tabular-nums">{resources.reliabilityPct}%</span>
              </div>
              <div className="w-full bg-slate-900 border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-sky-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${resources.reliabilityPct}%` }}
                />
              </div>
            </div>

            <div className="p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans mb-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Wifi className="w-3 h-3 text-sky-400" /> DATA RETURN
                </span>
                <span className="text-sky-300 font-mono font-semibold tabular-nums">{resources.dataReturnScore}</span>
              </div>
              <div className="w-full bg-slate-900 border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-sky-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${resources.dataReturnScore}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Critical constraint warning status footer */}
      {audit.criticalIssues.length > 0 ? (
        <div className="mt-3 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-md text-[11px] font-sans text-rose-200 flex items-start gap-2">
          <span className="font-semibold text-rose-400 shrink-0 font-mono">[MARGIN ALERT]</span>
          <span>{audit.criticalIssues[0]}</span>
        </div>
      ) : (
        <div className="mt-3 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[11px] font-sans text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>ALL SUBSYSTEMS WITHIN FLIGHT ENVELOPE</span>
          </span>
          <span className="text-emerald-400 font-mono font-semibold text-[10px] bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">READY</span>
        </div>
      )}
    </AerospaceCard>
  );
};
