import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-space-border bg-space-950/80 py-4 px-5 text-xs text-telemetry-muted">
      <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Mission Forge</span>
          <span className="text-telemetry-dim">·</span>
          <span>An educational mission design simulation</span>
        </div>

        <div className="text-telemetry-dim">
          NASA Space Apps Challenge 2026 project
        </div>
      </div>
    </footer>
  );
};
