import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  HelpCircle, 
  Sparkles,
  Menu
} from 'lucide-react';
import { useMission } from '../../hooks/useMission';
import { Button } from '../common/Button';
import { sound } from '../../utils/sound';
import { ScientificHonestyModal } from '../common/ScientificHonestyModal';
import { MissionPhase } from '../../types/mission';

export const Header: React.FC = () => {
  const { phase, setPhase, resetMission, applyDemoPreset, missionResult } = useMission();
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [showHonesty, setShowHonesty] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
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
    { phase: 'briefing', label: 'Briefing', code: '01' },
    { phase: 'mission_control', label: 'Spacecraft', code: '02' },
    { phase: 'payload', label: 'Payload', code: '03' },
    { phase: 'readiness', label: 'Readiness', code: '04' },
    { phase: 'simulation', label: 'Cruise', code: '05' },
    { phase: 'arrival', label: 'Landing', code: '06' },
    { phase: 'discovery', label: 'Discovery', code: '07' },
    { phase: 'results', label: 'Debrief', code: '08' }
  ];

  const canNavigateTo = (targetPhase: MissionPhase): boolean => {
    if (phase === 'landing') return false;
    if (targetPhase === 'simulation' && missionResult) return false;
    if ((targetPhase === 'results' || targetPhase === 'what_if') && !missionResult) return false;
    // Don't allow jumping into simulation or late phases if not launched yet
    if ((targetPhase === 'simulation' || targetPhase === 'arrival' || targetPhase === 'discovery' || targetPhase === 'results' || targetPhase === 'what_if') && 
        (phase === 'briefing' || phase === 'mission_control' || phase === 'payload' || phase === 'readiness')) {
      return false;
    }
    return true;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-space-950/95 backdrop-blur-md border-b border-space-border">
        <div className="max-w-[1720px] mx-auto px-3 sm:px-5 lg:px-8 h-[68px] flex items-center justify-between gap-2 sm:gap-5">
          
          {/* Logo & Mission Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setPhase('landing')}
              className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90"
            >
              <div className="w-9 h-9 rounded-lg bg-[#243849] border border-space-border flex items-center justify-center">
                <Rocket className="w-4 h-4 text-[#B9D5E4]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-sans text-sm font-semibold tracking-tight text-slate-100">
                    Mission Forge
                  </span>
                  <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border-l border-space-border ml-1 pl-2.5">
                    Aurora 2045
                  </span>
                </div>
                <div className="hidden sm:block text-[11px] text-slate-500 font-sans">Mission design workspace</div>
              </div>
            </button>
          </div>

          {/* Mission Phase Navigation / Breadcrumb */}
          {phase !== 'landing' && (
            <nav aria-label="Mission phases" className="hidden xl:flex items-center gap-0.5 font-sans text-xs font-medium">
              {navItems.map((item) => {
                const isActive = phase === item.phase || (item.phase === 'simulation' && phase === 'launch');
                const isNavigable = canNavigateTo(item.phase);

                return (
                  <button
                    key={item.phase}
                    disabled={!isNavigable}
                    onClick={() => setPhase(item.phase)}
                    className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white/[0.08] text-white'
                        : isNavigable
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                        : 'text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-slate-500">{item.code}</span>
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Tools & Mission Clock */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div className="hidden 2xl:flex text-right pr-3 border-r border-space-border font-mono">
              <span className="text-[11px] text-slate-400">{timeString}</span>
            </div>

            {/* Demo Quick Preset Button */}
            {phase !== 'landing' && (phase === 'mission_control' || phase === 'payload' || phase === 'readiness') && (
              <Button
                variant="outline"
                size="sm"
                icon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={applyDemoPreset}
                title="Apply exact PRD Demo configuration (Mars + Heavy Lift + Hybrid + Adv Solar + Deep Space + 4 Instruments)"
              >
                Demo preset
              </Button>
            )}

            {/* Scientific Basis / Honesty */}
            <button
              onClick={() => setShowHonesty(true)}
              className="p-2 rounded-lg text-telemetry-muted hover:text-slate-100 hover:bg-space-800 transition-colors"
              title="Scientific Basis & Honesty Statement"
              aria-label="Scientific Basis"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-lg transition-colors ${
                isMuted ? 'text-telemetry-dim hover:text-telemetry-muted' : 'text-slate-400 hover:bg-space-800'
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
                Reset
              </Button>
            )}
            {phase !== 'landing' && (
              <button className="xl:hidden p-2 rounded-lg text-slate-300 hover:bg-space-800" aria-label="Open mission navigation" aria-expanded={showMobileNav} onClick={() => setShowMobileNav(!showMobileNav)}>
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        {showMobileNav && phase !== 'landing' && (
          <nav aria-label="Mission phases" className="xl:hidden px-5 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-space-border pt-3">
            {navItems.map(item => (
              <button key={item.phase} disabled={!canNavigateTo(item.phase)} onClick={() => { setPhase(item.phase); setShowMobileNav(false); }} className={`text-left px-3 py-2 rounded-lg text-sm ${phase === item.phase ? 'bg-space-700 text-white' : 'text-slate-300 hover:bg-space-800'} disabled:opacity-40`}>
                <span className="font-mono text-xs text-slate-500 mr-2">{item.code}</span>{item.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      <ScientificHonestyModal
        isOpen={showHonesty}
        onClose={() => setShowHonesty(false)}
      />
    </>
  );
};
