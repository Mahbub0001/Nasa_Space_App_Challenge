import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { TimelineStage } from '../../types/simulation';

interface MissionTimelineProps {
  stages: TimelineStage[];
  currentStageIndex: number;
}

export const MissionTimeline: React.FC<MissionTimelineProps> = ({
  stages,
  currentStageIndex
}) => {
  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.08] rounded-lg p-3 font-sans">
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs font-semibold tracking-wide text-slate-200 uppercase">
            FLIGHT TIMELINE SEQUENCE
          </span>
        </div>
        <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded font-medium">
          STAGE {Math.min(stages.length, currentStageIndex + 1)} OF {stages.length}
        </span>
      </div>

      {/* Horizontal Timeline Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
        {stages.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isActive = idx === currentStageIndex;

          return (
            <div
              key={stage.id}
              className={`p-2.5 rounded-md border transition-all ${
                isActive
                  ? 'bg-sky-500/15 border-sky-400/50 shadow-sm'
                  : isDone
                  ? 'bg-emerald-950/20 border-emerald-500/25 opacity-90'
                  : 'bg-white/[0.01] border-white/[0.04] opacity-40'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] mb-1 font-mono">
                <span className="text-slate-400">[{stage.code}]</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping shrink-0" />
                ) : (
                  <Circle className="w-2.5 h-2.5 text-slate-600 shrink-0" />
                )}
              </div>

              <div className="text-[11px] font-sans font-semibold text-slate-200 truncate uppercase tracking-tight">
                {stage.label}
              </div>

              <div className="text-[10px] text-slate-400 truncate mt-0.5 font-sans">
                {stage.summary}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
