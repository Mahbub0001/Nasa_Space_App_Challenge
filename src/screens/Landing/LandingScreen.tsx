import React from 'react';
import { ArrowRight, Box, ChartNoAxesCombined, Orbit, Play } from 'lucide-react';
import { useMission } from '../../hooks/useMission';
import { Button } from '../../components/common/Button';
import { sound } from '../../utils/sound';

export const LandingScreen: React.FC = () => {
  const { setPhase, applyDemoPreset } = useMission();

  const start = () => {
    sound.playClick();
    setPhase('briefing');
  };

  const quickDemo = () => {
    applyDemoPreset();
    setPhase('mission_control');
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
              Make the mission <span className="text-[#94B6CB]">work.</span>
            </h1>
            <p className="mt-8 max-w-[570px] text-lg leading-relaxed text-slate-400">
              Design a spacecraft, balance its limits, and see how your engineering decisions shape the journey to Mars.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button size="lg" onClick={start} icon={<ArrowRight className="w-4 h-4" />}>Start designing</Button>
              <Button size="lg" variant="outline" onClick={quickDemo} icon={<Play className="w-4 h-4" />}>Explore demo</Button>
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
              <div className="relative h-[245px] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(83,133,164,0.16),transparent_58%)]">
                <div className="absolute w-[300px] h-[300px] border border-[#729AB4]/20 rounded-full rotate-[-22deg] scale-y-[0.44]" />
                <div className="absolute w-[390px] h-[390px] border border-[#729AB4]/10 rounded-full rotate-[-22deg] scale-y-[0.44]" />
                <div className="w-[125px] h-[125px] rounded-full bg-[radial-gradient(circle_at_34%_30%,#B97859,#793F36_60%,#2C2935)] shadow-[inset_-20px_-20px_35px_rgba(0,0,0,0.35),0_0_65px_rgba(154,90,70,0.08)]" />
                <div className="absolute top-12 right-16 w-2 h-2 rounded-full bg-[#D8E3E8] shadow-[0_0_15px_#D8E3E8]" />
                <span className="absolute bottom-5 left-6 text-[11px] font-mono text-slate-500">EARTH → MARS</span>
                <span className="absolute bottom-5 right-6 text-[11px] font-mono text-slate-500">ORBITAL MISSION</span>
              </div>
              <div className="grid grid-cols-3 border-t border-space-border divide-x divide-space-border">
                <div className="p-4"><Box className="w-4 h-4 text-[#9AB9CA] mb-2" /><div className="text-sm font-medium text-slate-200">Configure</div><div className="text-[11px] text-slate-500 mt-1">Spacecraft systems</div></div>
                <div className="p-4"><ChartNoAxesCombined className="w-4 h-4 text-[#9AB9CA] mb-2" /><div className="text-sm font-medium text-slate-200">Balance</div><div className="text-[11px] text-slate-500 mt-1">Mass, power, budget</div></div>
                <div className="p-4"><Orbit className="w-4 h-4 text-[#9AB9CA] mb-2" /><div className="text-sm font-medium text-slate-200">Simulate</div><div className="text-[11px] text-slate-500 mt-1">Decisions & outcomes</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
