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
  const baseClasses = 'inline-flex items-center justify-center font-sans font-medium rounded-lg transition-colors duration-150 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-sm font-semibold gap-2.5'
  }[size];

  const variantClasses = {
    primary: 'bg-[#C8DCE8] hover:bg-[#E1ECF2] text-[#152331] border border-transparent',
    secondary: 'bg-space-750 hover:bg-space-700 text-slate-100 border border-space-border',
    outline: 'bg-transparent hover:bg-white/[0.05] text-slate-200 border border-space-border',
    danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-200 border border-rose-500/25',
    ghost: 'bg-transparent hover:bg-white/[0.05] text-slate-400 hover:text-slate-100 border border-transparent'
  }[variant];

  const activeClasses = active ? 'border-sky-300/50 bg-space-700 text-sky-200' : '';

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
