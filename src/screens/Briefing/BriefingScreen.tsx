import React from 'react';
import { useMission } from '../../hooks/useMission';
import { TrajectoryCanvas } from '../../components/simulation/TrajectoryCanvas';
import { AerospaceCard } from '../../components/common/AerospaceCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  ArrowRight, 
  Clock, 
  DollarSign, 
  Weight, 
  Zap, 
  Radio, 
  Atom, 
  AlertCircle 
} from 'lucide-react';
import { BASELINE_CONSTRAINTS } from '../../data/missions';

export const BriefingScreen: React.FC = () => {
  const { setPhase, config } = useMission();

  return (
    <div className="max-w-[1520px] mx-auto w-full p-4 sm:p-6 space-y-5 font-sans select-none">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-medium bg-sky-500/10 text-sky-400 px-2 py-0.5 border border-sky-500/20 rounded">
              DIRECTIVE ACT 01
            </span>
            <span className="text-xs text-slate-400 font-sans tracking-wide uppercase">
              Deep-Space Exploration Directive
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 uppercase">
            PROJECT AURORA // MISSION BRIEFING
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="nominal">
            LAUNCH WINDOW OPEN
          </Badge>
          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => setPhase('mission_control')}
          >
            ENTER MISSION CONTROL
          </Button>
        </div>
      </div>

      {/* Main Grid: Mission Narrative & Baseline Constraints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left 5 Cols: Narrative Directive & Constraints Grid */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Directive Briefing Card */}
          <AerospaceCard
            code="DIR-2045"
            title="DIRECTORATE MANDATE"
            subtitle="APPOINTMENT AS MISSION DIRECTOR"
          >
            <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-white/[0.02] border-l-2 border-sky-400 border border-white/[0.06] rounded-r-md italic text-slate-300">
                "Director, we have one launch window. One spacecraft. Limited resources. And a target worth reaching. Your mission is to decide what we take, what we sacrifice, and what we are willing to risk."
              </div>
              <p className="text-slate-400">
                A narrow orbital transfer opportunity has opened to reach a high-value planetary target.
                Your directive is to design, configure, and operate the Project Aurora exploration spacecraft to maximize scientific return without breaching strict mass, electrical, or budget margins.
              </p>
            </div>
          </AerospaceCard>

          {/* Programmatic Constraints Grid */}
          <AerospaceCard
            code="PRG-LIMS"
            title="PRIMARY MISSION CONSTRAINTS"
            subtitle="SAFETY-OF-FLIGHT THROW-WEIGHT & FISCAL LIMITS"
          >
            <div className="grid grid-cols-2 gap-2.5">
              
              <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-md transition-colors hover:border-white/[0.12]">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1 font-sans">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>MISSION WINDOW</span>
                </div>
                <div className="text-sm font-semibold text-slate-100 font-mono tabular-nums">
                  {BASELINE_CONSTRAINTS.missionWindowDays} DAYS
                </div>
                <div className="text-[10px] text-slate-500 font-sans mt-0.5">Optimal planetary alignment</div>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-md transition-colors hover:border-white/[0.12]">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1 font-sans">
                  <DollarSign className="w-3.5 h-3.5 text-sky-400" />
                  <span>TOTAL BUDGET</span>
                </div>
                <div className="text-sm font-semibold text-slate-100 font-mono tabular-nums">
                  ${BASELINE_CONSTRAINTS.maxBudgetBillion}B MAX
                </div>
                <div className="text-[10px] text-slate-500 font-sans mt-0.5">Lifecycle appropriations</div>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-md transition-colors hover:border-white/[0.12]">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1 font-sans">
                  <Weight className="w-3.5 h-3.5 text-sky-400" />
                  <span>MAXIMUM MASS</span>
                </div>
                <div className="text-sm font-semibold text-slate-100 font-mono tabular-nums">
                  {BASELINE_CONSTRAINTS.maxMassKg.toLocaleString()} KG
                </div>
                <div className="text-[10px] text-slate-500 font-sans mt-0.5">Trans-injection envelope</div>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-md transition-colors hover:border-white/[0.12]">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1 font-sans">
                  <Zap className="w-3.5 h-3.5 text-sky-400" />
                  <span>POWER BUDGET</span>
                </div>
                <div className="text-sm font-semibold text-slate-100 font-mono tabular-nums">
                  {BASELINE_CONSTRAINTS.basePowerCapacity} UNITS
                </div>
                <div className="text-[10px] text-slate-500 font-sans mt-0.5">Peak simultaneous draw</div>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-md transition-colors hover:border-white/[0.12]">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1 font-sans">
                  <Radio className="w-3.5 h-3.5 text-sky-400" />
                  <span>TELEMETRY LINK</span>
                </div>
                <div className="text-sm font-semibold text-slate-100 font-mono tabular-nums">
                  DEEP-SPACE DSN
                </div>
                <div className="text-[10px] text-slate-500 font-sans mt-0.5">Interplanetary bandwidth</div>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-md transition-colors hover:border-white/[0.12]">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1 font-sans">
                  <Atom className="w-3.5 h-3.5 text-sky-400" />
                  <span>SCIENCE PRIORITY</span>
                </div>
                <div className="text-sm font-semibold text-sky-300 font-mono tabular-nums">
                  CRITICAL HIGH
                </div>
                <div className="text-[10px] text-slate-500 font-sans mt-0.5">Atmosphere & geology</div>
              </div>

            </div>

            <div className="mt-3 p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-md text-[11px] text-slate-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                Note: Prototype simulation parameters. Real-world missions scale with complex orbital launch windows and flight opportunities.
              </span>
            </div>
          </AerospaceCard>

        </div>

        {/* Right 7 Cols: Mission Trajectory Visual & CTA */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <AerospaceCard
            code="NAV-PLN"
            title="TRANSFER TRAJECTORY PROFILE"
            subtitle="EARTH INJECTION → INTERPLANETARY CRUISE → MARS CAPTURE"
            className="flex-1 flex flex-col"
          >
            <div className="w-full flex-1 min-h-[360px]">
              <TrajectoryCanvas
                destinationId={config.destinationId}
                progressPct={0}
                isSimulating={false}
                className="h-full"
              />
            </div>
            
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/[0.06]">
              <span>Hohmann Heliocentric Transfer Arc: 210 Days transit</span>
              <span className="text-sky-400 font-mono font-medium">Target Corridor: Mars Orbit</span>
            </div>
          </AerospaceCard>

          {/* Bottom Navigation CTA */}
          <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-100 uppercase tracking-wide">
                READY TO COMMENCE SPACECRAFT ARCHITECTURE?
              </div>
              <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                Proceed to Mission Control to configure booster, propulsion, power, and comms.
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setPhase('mission_control')}
            >
              ENTER MISSION CONTROL
            </Button>
          </div>
        </div>

      </div>

    </div>
  );
};
