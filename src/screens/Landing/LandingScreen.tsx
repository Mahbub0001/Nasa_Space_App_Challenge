import React, { useRef, useEffect } from 'react';
import { useMission } from '../../hooks/useMission';
import { Button } from '../../components/common/Button';
import { Rocket, Sparkles } from 'lucide-react';
import { sound } from '../../utils/sound';

export const LandingScreen: React.FC = () => {
  const { setPhase, applyDemoPreset } = useMission();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Generate deterministic stars
    const starCount = 140;
    const stars = Array.from({ length: starCount }, (_, i) => ({
      x: ((i * 73) % width),
      y: ((i * 127) % height),
      radius: (i % 3 === 0 ? 1.5 : 0.8),
      alpha: 0.2 + ((i % 5) * 0.15),
      speed: 0.05 + ((i % 4) * 0.03)
    }));

    let tick = 0;
    const draw = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Deep space gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#030508');
      bgGrad.addColorStop(0.5, '#05080D');
      bgGrad.addColorStop(1, '#080E17');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle celestial orbital paths
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 1.1, height * 0.8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.03)';
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 1.1, height * 1.1, 0, Math.PI * 2);
      ctx.stroke();

      // Draw restrained stars with slow subtle drift
      for (let i = 0; i < starCount; i++) {
        const s = stars[i];
        s.y -= s.speed;
        if (s.y < 0) s.y = height;

        const twinkle = Math.sin(tick * 0.02 + i) * 0.2;
        ctx.fillStyle = `rgba(242, 245, 247, ${Math.max(0.1, s.alpha + twinkle)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleStart = () => {
    sound.playClick();
    setPhase('briefing');
  };

  const handleQuickDemo = () => {
    applyDemoPreset();
    setPhase('mission_control');
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 overflow-hidden select-none">
      {/* Background Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Subtle Aerospace Silhouette & Orbit Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <svg viewBox="0 0 800 800" className="w-[800px] h-[800px]">
          <circle cx="400" cy="400" r="320" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="6 6" fill="none" />
          <circle cx="400" cy="400" r="240" stroke="#38BDF8" strokeWidth="0.8" fill="none" opacity="0.4" />
          <line x1="80" y1="400" x2="720" y2="400" stroke="#38BDF8" strokeWidth="0.5" opacity="0.3" />
          <line x1="400" y1="80" x2="400" y2="720" stroke="#38BDF8" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-4xl w-full text-center py-12 px-6 flex flex-col items-center">
        
        {/* Aerospace Mission Identifier Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 font-mono text-[11px] uppercase tracking-wider mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span>NASA SPACE APPS 2026 // FLIGHT CANDIDATE DEMO</span>
        </div>

        {/* Primary Title */}
        <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-slate-100 mb-3">
          MISSION FORGE
        </h1>

        {/* Sub-Header */}
        <p className="font-sans text-xs sm:text-sm text-sky-400 font-semibold tracking-[0.25em] uppercase mb-4">
          DESIGN. DECIDE. EXPLORE.
        </p>

        {/* Tagline & Supporting Copy */}
        <div className="max-w-xl mx-auto space-y-2 mb-10">
          <blockquote className="font-sans italic text-lg sm:text-xl text-slate-200 font-normal">
            "Every mission is a trade-off."
          </blockquote>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Build a deep-space scientific spacecraft. Allocate mass, electrical power, and lifecycle budget under strict constraints. 
            Balance operational risk against planetary science return, then test whether your mission survives deep-space reality.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            icon={<Rocket className="w-4 h-4 text-space-950" />}
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-3 text-sm shadow-lg shadow-sky-500/10"
          >
            START MISSION
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={<Sparkles className="w-4 h-4 text-sky-400" />}
            onClick={handleQuickDemo}
            className="w-full sm:w-auto px-6 py-3 text-sm"
          >
            QUICK DEMO SETUP
          </Button>
        </div>

        {/* Technical Architecture Footnote */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl pt-8 border-t border-white/[0.08] text-left">
          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-md transition-colors hover:border-white/[0.12]">
            <span className="text-[10px] text-sky-400 font-mono font-semibold block">01 // CONSTRAINTS</span>
            <span className="text-xs text-slate-200 font-sans font-semibold block mt-1">MASS & POWER</span>
            <span className="text-[11px] text-slate-400 font-sans block mt-0.5">Strict launch throw-weight</span>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-md transition-colors hover:border-white/[0.12]">
            <span className="text-[10px] text-sky-400 font-mono font-semibold block">02 // SUBSYSTEMS</span>
            <span className="text-xs text-slate-200 font-sans font-semibold block mt-1">MODULAR BUS</span>
            <span className="text-[11px] text-slate-400 font-sans block mt-0.5">Custom CAD & 3D visual</span>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-md transition-colors hover:border-white/[0.12]">
            <span className="text-[10px] text-sky-400 font-mono font-semibold block">03 // SIMULATION</span>
            <span className="text-xs text-slate-200 font-sans font-semibold block mt-1">ORBITAL CORRIDOR</span>
            <span className="text-[11px] text-slate-400 font-sans block mt-0.5">In-flight anomaly room</span>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-md transition-colors hover:border-white/[0.12]">
            <span className="text-[10px] text-sky-400 font-mono font-semibold block">04 // OUTCOME</span>
            <span className="text-xs text-slate-200 font-sans font-semibold block mt-1">WHAT-IF ANALYSIS</span>
            <span className="text-[11px] text-slate-400 font-sans block mt-0.5">Comparative debrief</span>
          </div>
        </div>

      </div>
    </div>
  );
};
