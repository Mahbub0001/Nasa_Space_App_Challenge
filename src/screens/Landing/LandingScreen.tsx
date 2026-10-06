import React from 'react';
import { ArrowRight, Box, ChartNoAxesCombined, Orbit, Play } from 'lucide-react';
import { useMission } from '../../hooks/useMission';
import { Button } from '../../components/common/Button';
import { sound } from '../../utils/sound';
import { MissionJourney } from '../../components/simulation/MissionJourney';

export const LandingScreen: React.FC = () => {
  const { setPhase, applyDemoPreset } = useMission();

  const start = () => {
    sound.playClick();
    setPhase('briefing');
  };

  const quickDemo = () => {
    applyDemoPreset();
    setPhase('simulation');
  };

  return (
    <div className="relative flex-1 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_78%_40%,rgba(81,121,150,0.18),transparent_44%)]" />
      <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 pt-16 pb-20 lg:pt-24">
        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.9fr)] gap-14 lg:gap-20 items-center min-h-[540px]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300" />
              Space Apps Challenge 2026 <span className="text-slate-600">/</span> Mission design game
            </div>
            <h1 className="max-w-[700px] text-[clamp(3.4rem,7vw,6.3rem)] leading-[0.98] font-semibold tracking-[-0.065em] text-[#EEF3F5]">
              Build the craft. <span className="text-[#94B6CB]">Fly the mission.</span>
            </h1>
            <p className="mt-8 max-w-[570px] text-lg leading-relaxed text-slate-400">
              Take command of Aurora. Design its systems, steer through deep-space emergencies, and bring a discovery home from Mars.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button size="lg" onClick={start} icon={<ArrowRight className="w-4 h-4" />}>Design your mission</Button>
              <Button size="lg" variant="outline" onClick={quickDemo} icon={<Play className="w-4 h-4" />}>Play demo mission</Button>
            </div>
            <p className="mt-5 text-xs text-slate-500">An interactive educational prototype. No aerospace experience required.</p>
          </div>

          <div className="relative max-w-[500px] w-full mx-auto lg:mr-0">
            <div className="absolute -inset-8 rounded-full border border-white/[0.05]" />
            <div className="relative rounded-[22px] border border-space-border bg-[#14212D]/95 shadow-[0_28px_80px_rgba(0,0,0,0.25)] overflow-hidden">
              <div className="px-6 py-5 flex items-center justify-between border-b border-space-border">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Mission dossier</div>
                  <div className="text-lg font-semibold tracking-tight text-slate-100">Aurora / Mars orbiter</div>
                </div>
                <span className="font-mono text-[10px] text-slate-400 border border-space-border rounded-md px-2 py-1">CONCEPT 01</span>
              </div>
              <MissionJourney destinationId="mars" progressPct={38} isPlaying compact />
              <div className="grid grid-cols-3 border-t border-space-border divide-x divide-space-border">
                <div className="p-4"><Box className="w-4 h-4 text-[#9AB9CA] mb-2" /><div className="text-sm font-medium text-slate-200">Configure</div><div className="text-[11px] text-slate-500 mt-1">Spacecraft systems</div></div>
                <div className="p-4"><ChartNoAxesCombined className="w-4 h-4 text-[#9AB9CA] mb-2" /><div className="text-sm font-medium text-slate-200">Balance</div><div className="text-[11px] text-slate-500 mt-1">Mass, power, budget</div></div>
                <div className="p-4"><Orbit className="w-4 h-4 text-[#9AB9CA] mb-2" /><div className="text-sm font-medium text-slate-200">Fly</div><div className="text-[11px] text-slate-500 mt-1">3 playable encounters</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
