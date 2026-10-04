import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  HelpCircle, 
  Sparkles,
  Radio
} from 'lucide-react';
import { useMission } from '../../hooks/useMission';
import { Button } from '../common/Button';
import { sound } from '../../utils/sound';
import { ScientificHonestyModal } from '../common/ScientificHonestyModal';
import { MissionPhase } from '../../types/mission';

export const Header: React.FC = () => {
  const { phase, setPhase, resetMission, applyDemoPreset } = useMission();
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [showHonesty, setShowHonesty] = useState(false);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(now.toISOString().substring(11, 19) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const navItems: { phase: MissionPhase; label: string; code: string }[] = [
    { phase: 'briefing', label: 'BRIEFING', code: '01' },
    { phase: 'mission_control', label: 'SPACECRAFT', code: '02' },
    { phase: 'payload', label: 'PAYLOAD', code: '03' },
    { phase: 'readiness', label: 'READINESS', code: '04' },
    { phase: 'simulation', label: 'SIMULATION', code: '05' },
    { phase: 'results', label: 'RESULTS', code: '06' }
  ];

  const canNavigateTo = (targetPhase: MissionPhase): boolean => {
    if (phase === 'landing') return false;
    // Don't allow jumping into simulation or results if not launched yet
    if ((targetPhase === 'simulation' || targetPhase === 'results' || targetPhase === 'what_if') && 
        (phase === 'briefing' || phase === 'mission_control' || phase === 'payload' || phase === 'readiness')) {
      return false;
    }
    return true;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-space-950/90 backdrop-blur-md border-b border-space-border">
        <div className="max-w-[1720px] mx-auto px-4 py-2 flex items-center justify-between gap-4">
          
          {/* Logo & Mission Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setPhase('landing')}
              className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90"
            >
              <div className="w-8 h-8 rounded-md bg-sky-950/80 border border-sky-400/40 flex items-center justify-center text-sky-400 group-hover:border-sky-300 shadow-sm">
                <Rocket className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs font-bold tracking-wider text-slate-100 uppercase">
                    MISSION FORGE
                  </span>
                  <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[9px] font-mono font-medium tracking-wide bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">
                    AURORA-2045
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-sans flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[9px] tracking-wider text-slate-400">SIM-CTRL ACTIVE</span>
                </div>
              </div>
            </button>
          </div>

          {/* Mission Phase Navigation / Breadcrumb */}
          {phase !== 'landing' && (
            <nav className="hidden lg:flex items-center gap-1 font-sans text-xs font-medium">
              {navItems.map((item) => {
                const isActive = phase === item.phase || (item.phase === 'simulation' && phase === 'launch');
                const isNavigable = canNavigateTo(item.phase);

                return (
                  <button
                    key={item.phase}
                    disabled={!isNavigable}
                    onClick={() => setPhase(item.phase)}
                    className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white/[0.08] text-white shadow-sm border border-white/[0.08]'
                        : isNavigable
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                        : 'text-slate-600 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-sky-400 font-semibold">{item.code}</span>
                    <span className="tracking-wide text-[11px]">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Tools & Mission Clock */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex flex-col text-right pr-2 border-r border-white/10 font-mono">
              <span className="text-[11px] text-cyan-300 font-semibold">{timeString}</span>
              <span className="text-[9px] text-telemetry-muted flex items-center justify-end gap-1">
                <Radio className="w-2.5 h-2.5 text-emerald-400" /> DSN SYNC
              </span>
            </div>

            {/* Demo Quick Preset Button */}
            {phase !== 'landing' && (phase === 'mission_control' || phase === 'payload' || phase === 'readiness') && (
              <Button
                variant="outline"
                size="sm"
                icon={<Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                onClick={applyDemoPreset}
                title="Apply exact PRD Demo configuration (Mars + Heavy Lift + Hybrid + Adv Solar + Deep Space + 4 Instruments)"
              >
                DEMO PRESET
              </Button>
            )}

            {/* Scientific Basis / Honesty */}
            <button
              onClick={() => setShowHonesty(true)}
              className="p-1.5 text-telemetry-muted hover:text-cyan-300 hover:bg-space-800 transition-colors border border-transparent hover:border-space-border"
              title="Scientific Basis & Honesty Statement"
              aria-label="Scientific Basis"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-1.5 transition-colors border border-transparent hover:border-space-border ${
                isMuted ? 'text-telemetry-dim hover:text-telemetry-muted' : 'text-cyan-400 hover:bg-space-800'
              }`}
              title={isMuted ? 'Unmute procedural sound FX' : 'Mute sound FX'}
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Reset Mission */}
            {phase !== 'landing' && (
              <Button
                variant="ghost"
                size="sm"
                icon={<RotateCcw className="w-3 h-3" />}
                onClick={resetMission}
                title="Reset simulation to initial state"
              >
                RESET
              </Button>
            )}
          </div>
        </div>
      </header>

      <ScientificHonestyModal
        isOpen={showHonesty}
        onClose={() => setShowHonesty(false)}
      />
    </>
  );
};
