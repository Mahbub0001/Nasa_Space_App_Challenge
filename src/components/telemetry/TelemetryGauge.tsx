import React, { useEffect, useState } from 'react';
import { Badge } from '../common/Badge';

interface TelemetryGaugeProps {
  label: string;
  code: string;
  currentValue: number;
  maxValue?: number;
  unit?: string;
  isPercentage?: boolean;
  isCurrency?: boolean;
  reverseRisk?: boolean; // higher is worse (like Risk, Budget, Mass, Power)
  warningThreshold?: number; // ratio where warning starts (e.g. 0.85)
  dangerThreshold?: number; // ratio where danger starts (e.g. 1.0)
  icon?: React.ReactNode;
}

export const TelemetryGauge: React.FC<TelemetryGaugeProps> = ({
  label,
  code,
  currentValue,
  maxValue,
  unit = '',
  isPercentage = false,
  isCurrency = false,
  reverseRisk = false,
  warningThreshold = 0.85,
  dangerThreshold = 1.0,
  icon
}) => {
  const [displayValue, setDisplayValue] = useState(currentValue);
  const [deltaHighlight, setDeltaHighlight] = useState<'increase' | 'decrease' | null>(null);

  // Smooth interpolation / feedback when telemetry changes
  useEffect(() => {
    if (currentValue !== displayValue) {
      setDeltaHighlight(currentValue > displayValue ? 'increase' : 'decrease');
      
      const timer = setTimeout(() => {
        setDisplayValue(currentValue);
        const clearTimer = setTimeout(() => setDeltaHighlight(null), 600);
        return () => clearTimeout(clearTimer);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [currentValue, displayValue]);

  // Compute ratio & status
  let ratio = maxValue ? displayValue / maxValue : displayValue / 100;
  if (isPercentage) ratio = displayValue / 100;

  let status: 'nominal' | 'warning' | 'alert' = 'nominal';
  let statusText = 'NOMINAL';

  if (reverseRisk) {
    if (ratio > dangerThreshold) {
      status = 'alert';
      statusText = 'EXCEEDED';
    } else if (ratio > warningThreshold) {
      status = 'warning';
      statusText = 'ELEVATED';
    } else {
      status = 'nominal';
      statusText = 'NOMINAL';
    }
  } else {
    // Standard (higher is better, e.g. Fuel, Reliability, Science)
    if (ratio < 0.25) {
      status = 'alert';
      statusText = 'CRITICAL';
    } else if (ratio < 0.45) {
      status = 'warning';
      statusText = 'LOW MARGIN';
    } else {
      status = 'nominal';
      statusText = 'NOMINAL';
    }
  }

  const formatVal = (v: number) => {
    if (isCurrency) return `$${v.toFixed(2)}B`;
    if (isPercentage) return `${Math.round(v)}%`;
    return new Intl.NumberFormat('en-US').format(Math.round(v));
  };

  const barColor = {
    nominal: 'bg-cyan-400',
    warning: 'bg-amber-400',
    alert: 'bg-rose-500'
  }[status];

  const highlightBorder = deltaHighlight === 'increase'
    ? 'border-cyan-400 ring-1 ring-cyan-400/30'
    : deltaHighlight === 'decrease'
    ? 'border-amber-400 ring-1 ring-amber-400/30'
    : 'border-white/5';

  return (
    <div className={`p-3 rounded-md bg-space-850/90 border transition-all duration-300 shadow-sm ${highlightBorder}`}>
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {icon && <span className="text-sky-400 shrink-0">{icon}</span>}
          <div className="truncate flex items-center">
            <span className="font-mono text-[9px] text-slate-400 bg-white/[0.04] border border-white/[0.06] px-1 py-0.2 rounded mr-1.5 shrink-0">
              {code}
            </span>
            <span className="font-sans text-xs font-medium tracking-wide text-slate-200 uppercase truncate">
              {label}
            </span>
          </div>
        </div>
        <Badge variant={status} size="sm">
          {statusText}
        </Badge>
      </div>

      {/* Main Value Display */}
      <div className="flex items-baseline justify-between mt-1 mb-2 font-mono tabular-nums">
        <div className="flex items-baseline gap-1">
          <span className={`text-base font-bold tracking-tight transition-colors duration-200 ${
            status === 'alert' ? 'text-rose-400' : status === 'warning' ? 'text-amber-300' : 'text-sky-300'
          }`}>
            {formatVal(displayValue)}
          </span>
          {unit && <span className="text-[10px] text-slate-400 font-sans">{unit}</span>}
        </div>

        {maxValue !== undefined && (
          <span className="text-[10px] text-slate-400 font-mono">
            / {formatVal(maxValue)} {unit}
          </span>
        )}
      </div>

      {/* Visual Telemetry Bar */}
      <div className="relative w-full h-1.5 bg-space-950 rounded-full overflow-hidden border border-white/[0.06]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(0, ratio * 100))}%` }}
        />
        {/* Warning threshold marker */}
        {warningThreshold < 1.0 && (
          <div 
            className="absolute top-0 bottom-0 w-[1px] bg-amber-400/50 pointer-events-none"
            style={{ left: `${warningThreshold * 100}%` }}
          />
        )}
      </div>
    </div>
  );
};
