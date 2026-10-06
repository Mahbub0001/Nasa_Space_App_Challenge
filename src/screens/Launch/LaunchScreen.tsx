import React, { useState, useEffect } from 'react';
import { useMission } from '../../hooks/useMission';
import { Button } from '../../components/common/Button';
import { sound } from '../../utils/sound';
import { Rocket, FastForward, Flame, CheckCircle } from 'lucide-react';
import { LaunchScene } from '../../components/simulation/LaunchScene';

export const LaunchScreen: React.FC = () => {
  const { setPhase, config } = useMission();
  const [seconds, setSeconds] = useState(10);
  const [stageMessage, setStageMessage] = useState('FINAL COUNTDOWN SEQUENCE');
  const [subMessage, setSubMessage] = useState('ALL RANGE RADARS GREEN // TERMINAL COUNTDOWN ACTIVE');
  const [isIgnited, setIsIgnited] = useState(false);
  const [telemetryAltitudeKm, setTelemetryAltitudeKm] = useState(0);
  const [telemetryVelocityKms, setTelemetryVelocityKms] = useState(0);

  useEffect(() => {
    // Play subtle countdown beeps & rumble
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev > 1) {
          sound.playBeep(400 + (10 - prev) * 50, 0.05, 0.03);
          return prev - 1;
        } else if (prev === 1) {
          sound.playLaunchRumble(6.0);
          setIsIgnited(true);
          setStageMessage('SYSTEMS GO // MAIN ENGINE IGNITION');
          setSubMessage('CHAMBER PRESSURE NOMINAL // FULL THRUST CONFIRMED');
          return 0;
        } else {
          return 0;
        }
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  // Post-T0 sequence progression
  useEffect(() => {
    if (!isIgnited) return;

    const milestones = [
      { delay: 1000, stage: 'LIFTOFF // TOWER CLEARED', sub: 'LAUNCH VEHICLE COMMENCES GRAVITY TURN ROLL PROGRAM', alt: 14, vel: 1.2 },
      { delay: 2400, stage: 'MAX-Q // TRANSONIC FLIGHT', sub: 'AERODYNAMIC PRESSURE MAXIMUM // VEHICLE INTEGRITY NOMINAL', alt: 48, vel: 2.8 },
      { delay: 4000, stage: 'STAGE 1 SEPARATION // ORBIT INSERTION', sub: 'VACUUM UPPER STAGE IGNITION // PARKING ORBIT ACHIEVED', alt: 185, vel: 7.8 },
      { delay: 5800, stage: 'TRANS-MISSION INJECTION (TMI)', sub: 'ESCAPE CORRIDOR ACHIEVED // CRUISE ORIENTATION CONFIRMED', alt: 450, vel: 11.2 },
      { delay: 7200, stage: 'TRANSITIONING TO INTERPLANETARY SIMULATION...', sub: 'HANDING OVER TO DEEP SPACE NETWORK', alt: 1200, vel: 11.4 }
    ];

    const timeouts = milestones.map((m) =>
      setTimeout(() => {
        setStageMessage(m.stage);
        setSubMessage(m.sub);
        setTelemetryAltitudeKm(m.alt);
        setTelemetryVelocityKms(m.vel);
        sound.playBeep(800, 0.04, 0.04);
      }, m.delay)
    );

    // Auto transition to simulation after sequence completes
    const autoTransition = setTimeout(() => {
      setPhase('simulation');
    }, 7800);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(autoTransition);
    };
  }, [isIgnited, setPhase]);

  const handleSkip = () => {
    sound.playClick();
    setPhase('simulation');
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 overflow-hidden select-none font-sans">
      {/* Background Star Trails and Exhaust Plume Glow */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isIgnited ? 'opacity-80' : 'opacity-20'}`}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-t from-sky-500/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* Central Launch Console */}
      <div className={`max-w-3xl w-full text-center z-10 space-y-5 ${isIgnited ? 'animate-pulse-subtle' : ''}`}>
        <LaunchScene ignited={isIgnited} altitudeKm={telemetryAltitudeKm} />
        
        {/* Top Status Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border border-white/[0.08] rounded-md text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span className="text-sky-300 font-sans font-semibold tracking-wide uppercase">
              PROJECT AURORA // LAUNCH SEQUENCE
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon={<FastForward className="w-3.5 h-3.5" />}
            onClick={handleSkip}
          >
            SKIP TO SIMULATION
          </Button>
        </div>

        {/* Central Giant Countdown Display */}
        <div className="p-8 sm:p-10 bg-white/[0.02] border border-white/[0.08] rounded-xl shadow-2xl relative backdrop-blur-sm">
          <div className="text-xs font-mono text-slate-400 tracking-[0.25em] uppercase mb-2">
            MISSION CLOCK [UTC-T]
          </div>

          <div className={`text-6xl sm:text-8xl font-black font-mono tracking-tight tabular-nums ${
            seconds > 0 ? 'text-slate-100' : 'text-sky-300'
          }`}>
            {seconds > 0 ? `T-${String(seconds).padStart(2, '0')}` : 'T+00:00:08'}
          </div>

          {/* Milestone Status Message */}
          <div className="mt-5 pt-5 border-t border-white/[0.08]">
            <div className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wide flex items-center justify-center gap-2">
              {isIgnited ? (
                <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
              ) : (
                <Rocket className="w-5 h-5 text-sky-400" />
              )}
              <span>{stageMessage}</span>
            </div>
            <div className="text-xs text-slate-400 font-sans mt-1">
              {subMessage}
            </div>
          </div>
        </div>

        {/* Live Flight Telemetry Gauge Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-md transition-colors hover:border-white/[0.12]">
            <span className="text-[11px] font-sans font-medium text-slate-400 block mb-1">ALTITUDE</span>
            <span className="text-xl font-bold font-mono tabular-nums text-sky-300 block">
              {telemetryAltitudeKm.toLocaleString()} <span className="text-xs text-slate-400 font-normal">KM</span>
            </span>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-md transition-colors hover:border-white/[0.12]">
            <span className="text-[11px] font-sans font-medium text-slate-400 block mb-1">VELOCITY</span>
            <span className="text-xl font-bold font-mono tabular-nums text-sky-300 block">
              {telemetryVelocityKms.toFixed(1)} <span className="text-xs text-slate-400 font-normal">KM/S</span>
            </span>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-md transition-colors hover:border-white/[0.12]">
            <span className="text-[11px] font-sans font-medium text-slate-400 block mb-1">BOOSTER STAGE</span>
            <span className="text-xl font-bold font-mono tabular-nums text-slate-100 block truncate">
              {config.launchVehicleId.toUpperCase()}
            </span>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-md transition-colors hover:border-white/[0.12]">
            <span className="text-[11px] font-sans font-medium text-slate-400 block mb-1">RANGE SAFETY</span>
            <span className="text-xl font-bold font-mono text-emerald-400 block flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 inline shrink-0" /> NOMINAL
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
