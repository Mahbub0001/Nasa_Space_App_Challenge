import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'nominal' | 'warning' | 'alert' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = true
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]';

  const variantClasses = {
    nominal: 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-950/50 text-amber-300 border border-amber-500/30',
    alert: 'bg-rose-950/50 text-rose-300 border border-rose-500/30',
    info: 'bg-sky-950/50 text-sky-300 border border-sky-500/30',
    neutral: 'bg-white/[0.04] text-slate-400 border border-white/[0.08]'
  }[variant];

  const dotColor = {
    nominal: 'bg-emerald-400',
    warning: 'bg-amber-400',
    alert: 'bg-rose-400',
    info: 'bg-sky-400',
    neutral: 'bg-slate-400'
  }[variant];

  return (
    <span className={`inline-flex items-center gap-1.5 font-sans font-medium rounded-full ${sizeClasses} ${variantClasses} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />}
      <span>{children}</span>
    </span>
  );
};
