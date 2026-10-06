import React, { useRef } from 'react';
import { Award, Download, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { sound } from '../../utils/sound';

interface MissionPatchCertificateProps {
  directorName?: string;
  destinationName: string;
  missionScore: number;
  sciencePoints: number;
  classification: string;
  launchVehicle: string;
  propulsion: string;
  missionStatus?: 'full' | 'partial' | 'failed';
}

export const MissionPatchCertificate: React.FC<MissionPatchCertificateProps> = ({
  directorName = 'CADET FLIGHT DIRECTOR',
  destinationName,
  missionScore,
  sciencePoints,
  classification,
  launchVehicle,
  propulsion,
  missionStatus,
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const isHighPerformer = missionScore >= 75;

  return (
    <div className="space-y-4 font-sans">
      {/* Fictional in-game mission record */}
      <div
        ref={certRef}
        className="relative overflow-hidden rounded-xl border-2 border-amber-500/40 bg-gradient-to-b from-slate-950 via-[#0a1120] to-slate-950 p-6 sm:p-8 text-slate-100 shadow-2xl print:border-black print:bg-white print:text-black"
        style={{
          boxShadow: '0 0 50px -10px rgba(245, 158, 11, 0.15), inset 0 0 30px rgba(56, 189, 248, 0.05)',
        }}
      >
        {/* Subtle decorative background stars and grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        {/* Gold Corner Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400"></div>

        {/* Certificate Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          
          {/* Project Aurora mission patch */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 group">
              {/* Outer Emblem Ring */}
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_4px_16px_rgba(56,189,248,0.3)]">
                <defs>
                  <linearGradient id="patchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0369a1" />
                    <stop offset="50%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#1e1b4b" />
                  </linearGradient>
                  <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <path id="textCircleTop" d="M 30,100 A 70,70 0 0,1 170,100" fill="none" />
                  <path id="textCircleBottom" d="M 170,100 A 70,70 0 0,1 30,100" fill="none" />
                </defs>

                {/* Outer Golden Border */}
                <circle cx="100" cy="100" r="96" fill="#0f172a" stroke="url(#goldBorder)" strokeWidth="4" />
                <circle cx="100" cy="100" r="88" fill="url(#patchGrad)" stroke="#38bdf8" strokeWidth="1.5" />

                {/* Stars in space */}
                <circle cx="50" cy="60" r="1.5" fill="#ffffff" opacity="0.9" />
                <circle cx="140" cy="50" r="1.5" fill="#ffffff" opacity="0.9" />
                <circle cx="160" cy="120" r="1.2" fill="#ffffff" opacity="0.7" />
                <circle cx="45" cy="135" r="1.2" fill="#ffffff" opacity="0.7" />
                <circle cx="100" cy="40" r="2" fill="#fbbf24" opacity="0.9" />

                {/* Destination Planet */}
                <circle cx="100" cy="100" r="32" fill="#ea580c" opacity="0.85" />
                <circle cx="95" cy="95" r="30" fill="#f97316" />
                {/* Planet Atmosphere Rim */}
                <circle cx="100" cy="100" r="33" fill="none" stroke="#fed7aa" strokeWidth="1" opacity="0.6" />

                {/* Orbital Trajectory Ellipse */}
                <ellipse cx="100" cy="100" rx="66" ry="24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" transform="rotate(-30 100 100)" />

                {/* Spacecraft Silhouette */}
                <g transform="translate(132, 70) rotate(45) scale(0.7)">
                  <polygon points="0,-16 6,10 -6,10" fill="#ffffff" />
                  <polygon points="-12,4 -6,0 -6,12 -12,10" fill="#38bdf8" />
                  <polygon points="12,4 6,0 6,12 12,10" fill="#38bdf8" />
                  <circle cx="0" cy="12" r="3" fill="#f59e0b" />
                </g>

                {/* Circular Text */}
                <text className="text-[9px] font-mono font-bold tracking-[0.25em] fill-amber-300 uppercase">
                  <textPath href="#textCircleTop" startOffset="50%" textAnchor="middle">
                    PROJECT AURORA
                  </textPath>
                </text>
                <text className="text-[8px] font-mono font-bold tracking-[0.2em] fill-sky-200 uppercase">
                  <textPath href="#textCircleBottom" startOffset="50%" textAnchor="middle">
                    FLIGHT SIMULATION
                  </textPath>
                </text>
              </svg>

              {/* Insignia destination sub-pill */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-amber-400 text-[10px] font-mono font-bold text-amber-300 tracking-wider shadow">
                {destinationName.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Flight report */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-white/[0.08] pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Award className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-mono tracking-widest text-amber-400 font-bold uppercase">
                  PROJECT AURORA · MISSION FORGE
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                IN-GAME FLIGHT RECORD
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase font-sans">
                {missionStatus === 'failed' ? 'MISSION REVIEW · OBJECTIVES MISSED' : missionStatus === 'partial' ? 'MISSION REVIEW · PARTIAL SUCCESS' : 'MISSION REVIEW · SCIENCE RETURN'}
              </h2>
              <p className="text-xs text-sky-300 font-mono mt-0.5">
                PROJECT AURORA DEEP-SPACE EXPLORATION CAMPAIGN
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              <strong className="text-white">{directorName}</strong> designed and flew the <strong className="text-sky-300">Project Aurora</strong> spacecraft toward <strong className="text-amber-300">{destinationName}</strong>. This report records the in-game engineering tradeoffs, flight choices, and science returned.
            </p>

            {/* Achievement Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2">
              <div className="p-2 rounded bg-white/[0.03] border border-white/[0.06] text-center">
                <span className="text-[9px] text-slate-400 uppercase block font-sans">OVERALL SCORE</span>
                <span className="text-base font-bold font-mono text-amber-300">{missionScore} / 100</span>
              </div>
              <div className="p-2 rounded bg-white/[0.03] border border-white/[0.06] text-center">
                <span className="text-[9px] text-slate-400 uppercase block font-sans">CLASSIFICATION</span>
                <span className="text-xs font-bold font-mono text-emerald-400 truncate block mt-0.5">{classification}</span>
              </div>
              <div className="p-2 rounded bg-white/[0.03] border border-white/[0.06] text-center">
                <span className="text-[9px] text-slate-400 uppercase block font-sans">SCIENCE DATA</span>
                <span className="text-base font-bold font-mono text-sky-300">{sciencePoints} PTS</span>
              </div>
              <div className="p-2 rounded bg-white/[0.03] border border-white/[0.06] text-center">
                <span className="text-[9px] text-slate-400 uppercase block font-sans">LAUNCH & PROPULSION</span>
                <span className="text-xs font-bold font-mono text-white truncate block mt-0.5" title={`${launchVehicle} // ${propulsion}`}>
                  {launchVehicle} / {propulsion}
                </span>
              </div>
            </div>

            {/* Fictional advisory crew */}
            <div className="pt-3 border-t border-white/[0.08] grid grid-cols-2 gap-4 text-left">
              <div>
                <div className="text-xs font-serif italic text-sky-300 tracking-wide">
                  Arthur Sterling
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                  Director Arthur Sterling
                </div>
                <div className="text-[8px] text-slate-500 font-sans">
                  Aurora Mission Directorate · fictional crew
                </div>
              </div>

              <div>
                <div className="text-xs font-serif italic text-emerald-300 tracking-wide">
                  Elena Vance, Ph.D.
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                  Dr. Elena Vance
                </div>
                <div className="text-[8px] text-slate-500 font-sans">
                  Aurora Science Team · fictional crew
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Action to Print / Export */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {isHighPerformer
              ? "Strong flight result. Save this in-game mission record and compare another design."
              : "Review your tradeoffs, then replay the mission with a new spacecraft design."}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Download className="w-3.5 h-3.5 text-amber-400" />}
          onClick={handlePrint}
          className="hover:border-amber-400/50 hover:text-amber-300"
        >
          PRINT / SAVE FLIGHT RECORD
        </Button>
      </div>
    </div>
  );
};
