import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  active = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-sans font-medium text-xs tracking-wide rounded-md transition-all duration-150 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40';

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-[11px] gap-1.5',
    md: 'px-3.5 py-2 text-xs gap-2',
    lg: 'px-5 py-2.5 text-sm font-semibold tracking-wide gap-2.5'
  }[size];

  const variantClasses = {
    primary: 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold shadow-[0_2px_12px_rgba(56,189,248,0.25)] border border-sky-400/40 active:scale-[0.98]',
    secondary: 'bg-space-750 hover:bg-space-700 text-slate-200 border border-white/10 hover:border-slate-500/50 shadow-sm active:scale-[0.98]',
    outline: 'bg-transparent hover:bg-white/[0.04] text-sky-400 border border-sky-500/30 hover:border-sky-400/60 active:scale-[0.98]',
    danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:border-rose-400/50 active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-white/[0.05] text-slate-400 hover:text-slate-200 border border-transparent'
  }[variant];

  const activeClasses = active ? 'border-sky-400 ring-1 ring-sky-400/40 bg-space-700 text-sky-300' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${activeClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
