import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-space-border bg-space-950/80 py-2.5 px-4 font-mono text-[10px] text-telemetry-muted">
      <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="tracking-widest uppercase font-semibold text-cyan-300">
            MISSION FORGE v1.0
          </span>
          <span className="text-telemetry-dim">|</span>
          <span>CONCEPTUAL AEROSPACE MISSION-DESIGN SIMULATOR</span>
        </div>

        <div className="flex items-center gap-4 text-telemetry-muted">
          <span>NASA SPACE APPS 2026 SHORTLIST PROTOTYPE</span>
          <span className="hidden md:inline text-telemetry-dim">|</span>
          <span className="hidden md:inline text-telemetry-dim">BALANCED DETERMINISTIC MODEL</span>
        </div>
      </div>
    </footer>
  );
};
