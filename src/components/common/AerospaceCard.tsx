import React from 'react';

interface AerospaceCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  code?: string;
  badge?: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  isInteractive?: boolean;
  selected?: boolean;
  statusBorder?: 'nominal' | 'warning' | 'alert' | 'none';
  onClick?: () => void;
}

export const AerospaceCard: React.FC<AerospaceCardProps> = ({
  children,
  title,
  subtitle,
  code,
  badge,
  className = '',
  headerAction,
  isInteractive = false,
  selected = false,
  statusBorder = 'none',
  onClick
}) => {
  const borderClass = {
    nominal: 'border-emerald-500/30',
    warning: 'border-amber-500/40',
    alert: 'border-rose-500/40',
    none: selected 
      ? 'border-sky-400/70 shadow-[0_0_12px_rgba(56,189,248,0.15)] ring-1 ring-sky-400/30' 
      : 'border-white/[0.07] hover:border-white/[0.14]'
  }[statusBorder];

  const interactiveClasses = isInteractive 
    ? 'cursor-pointer transition-all duration-150 hover:bg-space-800/90' 
    : '';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-md bg-space-850/85 backdrop-blur-md border ${borderClass} ${interactiveClasses} ${className} shadow-[0_1px_3px_rgba(0,0,0,0.35)]`}
    >
      {(title || code || badge || headerAction) && (
        <div className="flex items-center justify-between border-b border-white/[0.06] px-3.5 py-2.5 bg-white/[0.015] rounded-t-md">
          <div className="flex items-center gap-2.5 min-w-0">
            {code && (
              <span className="font-mono text-[10px] text-slate-400 bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded font-medium tracking-wider shrink-0">
                {code}
              </span>
            )}
            <div className="truncate">
              {title && (
                <h3 className="font-sans text-xs font-semibold tracking-wide text-slate-200 uppercase truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[11px] text-slate-400 truncate font-sans">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {badge}
            {headerAction}
          </div>
        </div>
      )}

      <div className="p-3.5">
        {children}
      </div>
    </div>
  );
};
