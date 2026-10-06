import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { useMission } from '../../hooks/useMission';
import { ArrivalScene, type ArrivalStage } from '../../components/simulation/ArrivalScene';
import { 
  DESTINATION_LANDING_SITES, 
  evaluateInsertionBurn, 
  evaluateTouchdown, 
  type InsertionResolution, 
  type TouchdownResolution 
} from '../../simulation/landingGame';
import { AnimatedGuide, type GuideMood } from '../../components/narrative/AnimatedGuide';
import { CHARACTERS } from '../../data/characters';
import { sound } from '../../utils/sound';
import type { LandingSite } from '../../types/mission';

export const ArrivalScreen: React.FC = () => {
  const { config, setPhase, resources, recordDecision } = useMission();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [entryAngle, setEntryAngle] = useState(
    config.destinationId === 'mars' ? -12.2 : config.destinationId === 'lunar_orbit' ? -15.0 : -4.0
  );
  const [burnDuration, setBurnDuration] = useState(
    config.destinationId === 'mars' ? 240 : config.destinationId === 'lunar_orbit' ? 180 : 90
  );
  const [isBurning, setIsBurning] = useState(false);
  const [insertionResult, setInsertionResult] = useState<InsertionResolution | null>(null);

  // Stage 2: Site Selection
  const sites = DESTINATION_LANDING_SITES[config.destinationId] || DESTINATION_LANDING_SITES.mars;
  const [selectedSite, setSelectedSite] = useState<LandingSite>(sites[0]);

  // Stage 3: Terminal Descent & Touchdown
  const [throttle, setThrottle] = useState(74);
  const [descentActive, setDescentActive] = useState(false);
  const [descentProgress, setDescentProgress] = useState(0);
  const [touchdownResult, setTouchdownResult] = useState<TouchdownResolution | null>(null);

  const stage: ArrivalStage = step === 1 ? 'orbit' : step === 2 ? 'orbit' : descentProgress >= 100 ? 'surface' : 'descent';
  const targetName = config.destinationId === 'mars' ? 'Mars' : config.destinationId === 'lunar_orbit' ? 'the Moon' : 'the Asteroid';

  const previewInsertion = evaluateInsertionBurn(entryAngle, burnDuration, config.destinationId);
  const crewMood: GuideMood =
    step === 1
      ? previewInsertion.quality === 'excellent' ? 'relieved' : previewInsertion.quality === 'critical' ? 'worried' : 'focused'
      : step === 2
      ? selectedSite.hazardLevel === 'High' ? 'focused' : 'relieved'
      : touchdownResult
      ? touchdownResult.success ? 'relieved' : 'worried'
      : 'focused';

  const handleExecuteBurn = () => {
    sound.playRetroBurn(2.4);
    setIsBurning(true);
    setTimeout(() => {
      setIsBurning(false);
      setInsertionResult(previewInsertion);
      sound.playSuccess();
      recordDecision({
        eventId: 'orbital_insertion',
        eventCode: 'ARR-01',
        eventTitle: 'Orbital Insertion Burn',
        choiceId: previewInsertion.quality,
        choiceTag: 'A',
        choiceLabel: `${Math.abs(entryAngle).toFixed(1)}° at ${burnDuration}s burn`,
        consequenceSummary: `${previewInsertion.title} · ${previewInsertion.detail}`,
        timestamp: new Date().toISOString(),
        deltas: { fuel: previewInsertion.fuelDelta, risk: previewInsertion.riskDelta, science: 0, power: 0, data: 0 },
        beforeState: { fuel: resources.fuelPct, power: 85, risk: resources.riskPct, science: resources.scienceScore },
        afterState: { fuel: Math.max(0, resources.fuelPct + previewInsertion.fuelDelta), power: 85, risk: Math.min(100, resources.riskPct + previewInsertion.riskDelta), science: resources.scienceScore },
      });
      setTimeout(() => {
        setStep(2);
      }, 1400);
    }, 2400);
  };

  const handleSelectSite = (site: LandingSite) => {
    sound.playClick();
    setSelectedSite(site);
  };

  const handleInitiateDescent = () => {
    sound.playClick();
    setStep(3);
    setDescentActive(true);
    setDescentProgress(0);
    sound.playPlasmaEntry(3.0);
  };

  useEffect(() => {
    if (!descentActive) return;
    const interval = setInterval(() => {
      setDescentProgress(prev => {
        const next = prev + 3.5;
        if (next >= 100) {
          clearInterval(interval);
          setDescentActive(false);
          const result = evaluateTouchdown(selectedSite, throttle, resources.fuelPct);
          setTouchdownResult(result);
          if (result.success) {
            sound.playTouchdownCheer();
          } else {
            sound.playAlert();
          }
          recordDecision({
            eventId: 'surface_touchdown',
            eventCode: 'ARR-02',
            eventTitle: `Touchdown at ${selectedSite.name}`,
            choiceId: selectedSite.id,
            choiceTag: 'B',
            choiceLabel: `Site: ${selectedSite.name} (Throttle ${throttle}%)`,
            consequenceSummary: `${result.title} · ${result.detail}`,
            timestamp: new Date().toISOString(),
            deltas: { fuel: -result.fuelConsumedPct, risk: result.success ? -8 : 25, science: result.scienceYield, power: 0, data: 15 },
            beforeState: { fuel: resources.fuelPct, power: 85, risk: resources.riskPct, science: resources.scienceScore },
            afterState: { fuel: Math.max(0, resources.fuelPct - result.fuelConsumedPct), power: 85, risk: result.success ? 4 : 45, science: resources.scienceScore + result.scienceYield },
          });
          return 100;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [descentActive, selectedSite, throttle, resources, recordDecision]);

  return (
    <main className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-100">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <span className="font-mono text-[10px] tracking-widest text-[#80bbd7] uppercase">
            PHASE 06 · APPROACH & SURFACE OPERATIONS
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mt-1">
            {step === 1
              ? `Orbital Insertion · ${targetName}`
              : step === 2
              ? `Select Touchdown Site · ${targetName}`
              : touchdownResult
              ? `Surface Operations · ${selectedSite.name}`
              : `Terminal Descent & Touchdown`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {step === 1
              ? 'Execute retrograde deceleration burn to capture Aurora into stable planetary orbit.'
              : step === 2
              ? 'Select landing reconnaissance coordinates balancing science rewards against terrain hazards.'
              : 'Monitor terminal deceleration, aerodynamic heating, and touchdown telemetry.'}
          </p>
        </div>

        {/* Stage Indicator Pills */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className={`px-3 py-1.5 rounded-lg border ${step === 1 ? 'bg-sky-950/80 border-sky-400 text-sky-200' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
            01 INSERTION
          </span>
          <span className={`px-3 py-1.5 rounded-lg border ${step === 2 ? 'bg-sky-950/80 border-sky-400 text-sky-200' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
            02 SITE SELECTION
          </span>
          <span className={`px-3 py-1.5 rounded-lg border ${step === 3 ? 'bg-sky-950/80 border-sky-400 text-sky-200' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
            03 TOUCHDOWN
          </span>
        </div>
      </header>

      {/* Main Grid: 3D Scene Left, Interactive Operations Right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-5 items-start">
        {/* 3D Viewport */}
        <div>
          <ArrivalScene
            config={config}
            stage={stage}
            entryAngle={entryAngle}
            isBurning={isBurning}
            throttle={throttle}
            descentProgress={descentProgress}
            touchdownSuccess={touchdownResult?.success ?? true}
          />

          {/* Quick Mission Record Footer */}
          <div className="mt-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <span>TARGET: <strong className="text-slate-200">{targetName.toUpperCase()}</strong></span>
              <span>PROPELLANT: <strong className="text-slate-200">{resources.fuelPct}%</strong></span>
              <span>FLIGHT RISK: <strong className="text-slate-200">{resources.riskPct}%</strong></span>
            </div>
            <span className="text-[#73d9bc]">TELEMETRY NOMINAL</span>
          </div>
        </div>

        {/* Right Operations Panel */}
        <div className="flex flex-col gap-4">
          {/* Crew Commentary Header */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#122b3e] to-[#0a1826] border border-[#2c4e69] flex items-center gap-3.5">
            <AnimatedGuide
              character={CHARACTERS[step === 1 ? 'marcus' : step === 2 ? 'elena' : 'sterling']}
              speaking
              compact
              mood={crewMood}
            />
            <div className="flex-1">
              <strong className="block text-xs font-semibold text-slate-200">
                {CHARACTERS[step === 1 ? 'marcus' : step === 2 ? 'elena' : 'sterling'].name}
              </strong>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                {step === 1
                  ? 'We are on our final approach vector. Align the retrograde angle precisely with the arrival corridor.'
                  : step === 2
                  ? 'Reconnaissance scans are complete. Choose our primary science destination on the surface.'
                  : touchdownResult
                  ? touchdownResult.success
                    ? 'Sensors confirm stable touchdown! Power bus green, scientific instruments ready to deploy.'
                    : 'Impact velocity exceeded gear dampener tolerances. Reviewing structural integrity.'
                  : 'Holding steady through hypersonic entry. Monitor deceleration throttles carefully.'}
              </p>
            </div>
          </div>

          {/* STEP 1: Orbital Insertion Retro-Burn Controls */}
          {step === 1 && (
            <div className="p-5 rounded-xl bg-[#0b1b2a] border border-[#2b4d66] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-wider text-sky-400 font-semibold uppercase">
                  MANEUVER 01 · RETROGRADE ORBIT INSERTION
                </span>
                <span className="flex items-center gap-1.5 text-xs text-amber-300 font-mono">
                  <Flame className="w-3.5 h-3.5" /> DELTA-V BURN
                </span>
              </div>

              {/* Entry Angle Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">FLIGHT PATH ENTRY ANGLE</span>
                  <strong className="text-white">{entryAngle.toFixed(1)}°</strong>
                </div>
                <input
                  type="range"
                  min={config.destinationId === 'mars' ? -16.0 : -18.0}
                  max={config.destinationId === 'mars' ? -8.0 : -2.0}
                  step={0.1}
                  value={entryAngle}
                  disabled={isBurning}
                  onChange={e => {
                    sound.playClick();
                    setEntryAngle(Number(e.target.value));
                  }}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>TOO SHALLOW (SKIP)</span>
                  <span className="text-sky-300">NOMINAL CORRIDOR: {config.destinationId === 'mars' ? '-12.2°' : '-15.0°'}</span>
                  <span>TOO STEEP (BURN-UP)</span>
                </div>
              </div>

              {/* Burn Duration Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">RETRO-THRUSTER BURN TIME</span>
                  <strong className="text-white">{burnDuration} SECONDS</strong>
                </div>
                <input
                  type="range"
                  min={100}
                  max={340}
                  step={5}
                  value={burnDuration}
                  disabled={isBurning}
                  onChange={e => {
                    sound.playClick();
                    setBurnDuration(Number(e.target.value));
                  }}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              {/* Projected Outcome Card */}
              <div className={`p-3.5 rounded-lg border text-xs ${previewInsertion.quality === 'excellent' ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200' : previewInsertion.quality === 'compromised' ? 'bg-amber-950/40 border-amber-600/50 text-amber-200' : 'bg-rose-950/40 border-rose-600/50 text-rose-200'}`}>
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span>PROJECTED ORBIT: {previewInsertion.statusBadge}</span>
                  <span>PERIAPSIS: {previewInsertion.periapsisKm} KM</span>
                </div>
                <strong className="block text-sm font-semibold mt-1 text-white">{previewInsertion.title}</strong>
                <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{previewInsertion.detail}</p>
                <div className="flex gap-4 mt-2 font-mono text-[10px]">
                  <span>FUEL: {previewInsertion.fuelDelta}%</span>
                  <span>RISK: {previewInsertion.riskDelta > 0 ? '+' : ''}{previewInsertion.riskDelta}%</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isBurning}
                onClick={handleExecuteBurn}
                className="w-full py-3 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
              >
                {isBurning ? 'FIRING RETROGRADE ENGINES...' : 'EXECUTE ORBIT INSERTION BURN'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Landing Site Selection */}
          {step === 2 && (
            <div className="p-5 rounded-xl bg-[#0b1b2a] border border-[#2b4d66] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-wider text-sky-400 font-semibold uppercase">
                  MANEUVER 02 · TARGET LANDING RECONNAISSANCE
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  CHOOSE SITE
                </span>
              </div>

              {insertionResult && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center justify-between">
                  <span>{insertionResult.title}</span>
                  <span className="text-white font-bold">{insertionResult.statusBadge}</span>
                </div>
              )}

              <div className="space-y-2.5">
                {sites.map(site => {
                  const isSelected = selectedSite.id === site.id;
                  return (
                    <button
                      key={site.id}
                      type="button"
                      onClick={() => handleSelectSite(site)}
                      className={`w-full text-left p-3.5 rounded-lg border transition-all ${isSelected ? 'bg-sky-950/80 border-sky-400 ring-1 ring-sky-400/50' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-4 h-4 ${isSelected ? 'text-sky-300' : 'text-slate-500'}`} />
                          <strong className="text-sm font-semibold text-white">{site.name}</strong>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${site.hazardLevel === 'Low' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : site.hazardLevel === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
                          {site.hazardLevel} HAZARD
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{site.description}</p>
                      <div className="flex items-center gap-4 mt-2 font-mono text-[10px] text-slate-400">
                        <span>COORDINATES: <span className="text-slate-300">{site.coordinates}</span></span>
                        <span>SCIENCE: <span className="text-sky-300">{site.scienceMultiplier}× MULTIPLIER</span></span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleInitiateDescent}
                className="w-full py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
              >
                CONFIRM {selectedSite.name.toUpperCase()} & INITIATE ENTRY <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: Terminal Descent & Touchdown */}
          {step === 3 && (
            <div className="p-5 rounded-xl bg-[#0b1b2a] border border-[#2b4d66] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-wider text-sky-400 font-semibold uppercase">
                  MANEUVER 03 · ENTRY, DESCENT & LANDING
                </span>
                <span className="text-xs text-[#73d9bc] font-mono">
                  {touchdownResult ? 'TOUCHDOWN COMPLETE' : 'IN DESCENT'}
                </span>
              </div>

              {/* Descent Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">ATMOSPHERIC ENTRY PROFILE</span>
                  <strong className="text-white">{Math.round(descentProgress)}%</strong>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-sky-400 to-emerald-400 transition-all duration-150"
                    style={{ width: `${descentProgress}%` }}
                  />
                </div>
              </div>

              {/* Descent Throttle Control */}
              {!touchdownResult && (
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-300">DESCENT ENGINE THROTTLE</span>
                    <strong className="text-white">{throttle}% THROTTLE</strong>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    step={1}
                    value={throttle}
                    onChange={e => {
                      sound.playClick();
                      setThrottle(Number(e.target.value));
                    }}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>LOW THROTTLE (HARD IMPACT)</span>
                    <span className="text-sky-300">OPTIMAL: 70–78%</span>
                    <span>HIGH (FUEL STARVATION)</span>
                  </div>
                </div>
              )}

              {/* Touchdown Result Card */}
              {touchdownResult && (
                <div className={`p-4 rounded-xl border ${touchdownResult.success ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-100' : 'bg-rose-950/60 border-rose-500/70 text-rose-100'} space-y-2`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <strong className="text-base font-bold text-white">{touchdownResult.title}</strong>
                  </div>
                  <p className="text-xs opacity-90 leading-relaxed">{touchdownResult.detail}</p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 font-mono text-xs">
                    <div>TOUCHDOWN SPEED: <strong className="text-white">{touchdownResult.touchdownVelocityMs} M/S</strong></div>
                    <div>SCIENCE YIELD: <strong className="text-[#73d9bc]">+{touchdownResult.scienceYield} PTS</strong></div>
                  </div>
                </div>
              )}

              {/* Transition to Science Discovery Lab */}
              {touchdownResult && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playDiscoveryUnlock();
                    setPhase('discovery');
                  }}
                  className="w-full py-3.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-400/20"
                >
                  <Sparkles className="w-4 h-4" /> PROCEED TO SCIENCE DISCOVERY LAB <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
