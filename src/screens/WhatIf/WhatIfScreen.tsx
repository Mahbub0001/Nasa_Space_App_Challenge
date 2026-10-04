import React, { useState } from 'react';
import { useMission } from '../../hooks/useMission';
import { AerospaceCard } from '../../components/common/AerospaceCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { WhatIfScenario } from '../../types/simulation';
import { 
  Split, 
  RotateCcw, 
  Atom, 
  Weight, 
  Zap, 
  DollarSign, 
  ShieldAlert, 
  Wifi, 
  ArrowRight
} from 'lucide-react';

export const WhatIfScreen: React.FC = () => {
  const { missionResult, config, resources, resetMission, setPhase } = useMission();
  const scenarios = missionResult?.whatIfScenarios || [];
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);

  const activeScenario: WhatIfScenario | undefined = scenarios[selectedScenarioIdx];

  const yourScore = missionResult?.scoreBreakdown.finalScore ?? 85;
  const altScore = activeScenario?.scoreBreakdown.finalScore ?? 80;

  return (
    <div className="max-w-[1520px] mx-auto w-full p-4 sm:p-6 space-y-6 font-sans select-none">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-medium bg-sky-500/10 text-sky-400 px-2 py-0.5 border border-sky-500/20 rounded">
              ANALYSIS ACT 08
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wide">
              Counterfactual Mission Trade-Off Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 uppercase">
            WHAT IF? // ARCHITECTURAL COMPARISON
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            "Every mission has another possible path. Different priorities create different missions."
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => setPhase('results')}
          >
            BACK TO RESULTS
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={resetMission}
          >
            START NEW MISSION
          </Button>
        </div>
      </div>

      {/* Alternative Scenario Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-white/[0.08] pb-3">
        <span className="text-xs text-slate-400 font-medium tracking-wide shrink-0">COMPARE AGAINST:</span>
        <div className="flex flex-wrap gap-2">
          {scenarios.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenarioIdx(idx)}
              className={`px-3 py-1.5 text-xs font-sans font-medium rounded-md border transition-all flex items-center gap-2 ${
                selectedScenarioIdx === idx
                  ? 'bg-sky-500/15 border-sky-400/40 text-sky-300 shadow-sm'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Split className="w-3 h-3 text-sky-400" />
              <span>{sc.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left Column: Your Actual Mission */}
        <AerospaceCard
          code="YOUR-MISSION"
          title="YOUR MISSION ARCHITECTURE"
          subtitle={`FINAL SCORE: ${yourScore} / 100 [${missionResult?.scoreBreakdown.classification}]`}
          badge={<Badge variant="info">EXECUTED FLIGHT</Badge>}
        >
          {/* Subsystems Summary */}
          <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-md mb-4 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Booster:</span>
              <span className="text-slate-100 font-semibold">{config.launchVehicleId.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Propulsion:</span>
              <span className="text-slate-100 font-semibold">{config.propulsionId.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Power System:</span>
              <span className="text-slate-100 font-semibold">{config.powerSystemId.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Comms Downlink:</span>
              <span className="text-slate-100 font-semibold">{config.communicationId.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Instruments:</span>
              <span className="text-sky-300 font-semibold font-mono">{config.selectedInstrumentIds.length} PAYLOADS</span>
            </div>
          </div>

          {/* Metric telemetry comparison meters */}
          <div className="space-y-3.5 text-xs">
            {/* Mass */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium"><Weight className="w-3.5 h-3.5 text-sky-400" /> Total Mass</span>
                <span className="text-slate-100 font-mono font-semibold tabular-nums">{resources.massKg.toLocaleString()} KG</span>
              </div>
              <div className="w-full bg-slate-900 border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (resources.massKg / 5500) * 100)}%` }} />
              </div>
            </div>

            {/* Power */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium"><Zap className="w-3.5 h-3.5 text-sky-400" /> Power Demand</span>
                <span className="text-slate-100 font-mono font-semibold tabular-nums">{resources.powerUnits} / {resources.maxPowerUnits} U</span>
              </div>
              <div className="w-full bg-slate-900 border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (resources.powerUnits / 100) * 100)}%` }} />
              </div>
            </div>

            {/* Science */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium"><Atom className="w-3.5 h-3.5 text-sky-400" /> Scientific Score</span>
                <span className="text-sky-300 font-mono font-semibold tabular-nums">{resources.scienceScore} PTS</span>
              </div>
              <div className="w-full bg-slate-900 border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (resources.scienceScore / 100) * 100)}%` }} />
              </div>
            </div>

            {/* Risk */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium"><ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Flight Risk</span>
                <span className="text-amber-300 font-mono font-semibold tabular-nums">{resources.riskPct}%</span>
              </div>
              <div className="w-full bg-slate-900 border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, resources.riskPct)}%` }} />
              </div>
            </div>

            {/* Budget */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium"><DollarSign className="w-3.5 h-3.5 text-teal-400" /> Lifecycle Budget</span>
                <span className="text-slate-100 font-mono font-semibold tabular-nums">${resources.budgetBillion.toFixed(2)}B</span>
              </div>
              <div className="w-full bg-slate-900 border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
                <div className="bg-teal-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (resources.budgetBillion / 2.4) * 100)}%` }} />
              </div>
            </div>

            {/* Data Return */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium"><Wifi className="w-3.5 h-3.5 text-sky-400" /> Data Return</span>
                <span className="text-sky-300 font-mono font-semibold tabular-nums">{resources.dataReturnScore} PTS</span>
              </div>
              <div className="w-full bg-slate-900 border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, resources.dataReturnScore)}%` }} />
              </div>
            </div>
          </div>
        </AerospaceCard>

        {/* Right Column: Alternative Scenario */}
        {activeScenario && (
          <AerospaceCard
            code="ALT-PATH"
            title={activeScenario.name}
            subtitle={`COUNTERFACTUAL SCORE: ${altScore} / 100 [${activeScenario.scoreBreakdown.classification}]`}
            badge={<Badge variant="neutral">ALTERNATIVE</Badge>}
          >
            {/* Alternative Subsystems Summary */}
            <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-md mb-4 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Booster:</span>
                <span className="text-slate-100 font-semibold">{activeScenario.configuration.launchVehicleId.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Propulsion:</span>
                <span className="text-slate-100 font-semibold">{activeScenario.configuration.propulsionId.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Power System:</span>
                <span className="text-slate-100 font-semibold">{activeScenario.configuration.powerSystemId.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Comms Downlink:</span>
                <span className="text-slate-100 font-semibold">{activeScenario.configuration.communicationId.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Instruments:</span>
                <span className="text-amber-300 font-semibold font-mono">{activeScenario.configuration.selectedInstrumentIds.length} PAYLOADS</span>
              </div>
            </div>

            {/* Metric telemetry comparison meters */}
            <div className="space-y-3.5 text-xs">
              {/* Mass */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium"><Weight className="w-3.5 h-3.5 text-sky-400" /> Total Mass</span>
                  <span className="text-slate-100 font-mono font-semibold tabular-nums">{activeScenario.resources.massKg.toLocaleString()} KG</span>
                </div>
                <div className="w-full bg-slate-900 border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (activeScenario.resources.massKg / 5500) * 100)}%` }} />
                </div>
              </div>

              {/* Power */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium"><Zap className="w-3.5 h-3.5 text-sky-400" /> Power Demand</span>
                  <span className="text-slate-100 font-mono font-semibold tabular-nums">{activeScenario.resources.powerUnits} / {activeScenario.resources.maxPowerUnits} U</span>
                </div>
                <div className="w-full bg-slate-900 border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (activeScenario.resources.powerUnits / 100) * 100)}%` }} />
                </div>
              </div>

              {/* Science */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium"><Atom className="w-3.5 h-3.5 text-sky-400" /> Scientific Score</span>
                  <span className="text-slate-200 font-mono font-semibold tabular-nums">{activeScenario.resources.scienceScore} PTS</span>
                </div>
                <div className="w-full bg-slate-900 border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (activeScenario.resources.scienceScore / 100) * 100)}%` }} />
                </div>
              </div>

              {/* Risk */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium"><ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Flight Risk</span>
                  <span className="text-amber-300 font-mono font-semibold tabular-nums">{activeScenario.resources.riskPct}%</span>
                </div>
                <div className="w-full bg-slate-900 border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, activeScenario.resources.riskPct)}%` }} />
                </div>
              </div>

              {/* Budget */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium"><DollarSign className="w-3.5 h-3.5 text-teal-400" /> Lifecycle Budget</span>
                  <span className="text-slate-100 font-mono font-semibold tabular-nums">${activeScenario.resources.budgetBillion.toFixed(2)}B</span>
                </div>
                <div className="w-full bg-slate-900 border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (activeScenario.resources.budgetBillion / 2.4) * 100)}%` }} />
                </div>
              </div>

              {/* Data Return */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium"><Wifi className="w-3.5 h-3.5 text-sky-400" /> Data Return</span>
                  <span className="text-slate-200 font-mono font-semibold tabular-nums">{activeScenario.resources.dataReturnScore} PTS</span>
                </div>
                <div className="w-full bg-slate-900 border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, activeScenario.resources.dataReturnScore)}%` }} />
                </div>
              </div>
            </div>

            {/* Narrative Comparison */}
            <div className="mt-4 p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-md text-xs font-sans text-slate-300">
              <strong className="text-slate-100 block text-[11px] mb-1 font-semibold uppercase tracking-wider">ARCHITECTURAL LESSON:</strong>
              {activeScenario.narrativeComparison}
            </div>
          </AerospaceCard>
        )}

      </div>

      {/* Synthesis Conclusion */}
      <div className="p-4 sm:p-5 bg-white/[0.02] border border-white/[0.08] rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
            MISSION SIMULATION CONCLUSION
          </h4>
          <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-2xl">
            Mission Forge proves that aerospace engineering is not a linear puzzle with a single solution, but an ongoing balance of constraints, risks, and scientific return.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          icon={<RotateCcw className="w-4 h-4" />}
          onClick={resetMission}
        >
          START A NEW MISSION
        </Button>
      </div>

    </div>
  );
};
