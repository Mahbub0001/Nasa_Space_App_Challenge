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
    nominal: 'border-emerald-500/25',
    warning: 'border-amber-500/30',
    alert: 'border-rose-500/30',
    none: selected 
      ? 'border-sky-300/50 ring-1 ring-sky-300/20' 
      : 'border-space-border hover:border-white/[0.20]'
  }[statusBorder];

  const interactiveClasses = isInteractive 
    ? 'cursor-pointer transition-colors duration-150 hover:bg-space-800' 
    : '';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl bg-space-850 border ${borderClass} ${interactiveClasses} ${className} shadow-[0_6px_24px_rgba(0,0,0,0.12)]`}
    >
      {(title || code || badge || headerAction) && (
        <div className="flex items-center justify-between border-b border-space-border px-5 py-4">
          <div className="flex items-center gap-2.5 min-w-0">
            {code && (
              <span className="font-mono text-[10px] text-slate-400 bg-white/[0.04] px-1.5 py-0.5 rounded font-medium shrink-0">
                {code}
              </span>
            )}
            <div className="truncate">
              {title && (
                <h3 className="font-sans text-sm font-semibold tracking-tight text-slate-100 truncate">
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

      <div className="p-5">
        {children}
      </div>
    </div>
  );
};
