import React from 'react';
import { useMission } from '../../hooks/useMission';
import { AerospaceCard } from '../common/AerospaceCard';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Rocket, 
  Wrench, 
  ShieldCheck 
} from 'lucide-react';

export const ReadinessAuditList: React.FC = () => {
  const { audit, setPhase } = useMission();

  return (
    <div className="space-y-4 font-sans">
      <AerospaceCard
        code="AUDIT-GO/NOGO"
        title="PRE-LAUNCH FLIGHT READINESS AUDIT"
        subtitle="VERIFYING MARGINS AGAINST SAFETY-OF-FLIGHT ENVELOPE"
        badge={
          <Badge variant={audit.isReady ? 'nominal' : 'alert'}>
            {audit.isReady ? 'ALL SYSTEMS GO FOR LAUNCH' : 'NO-GO: MARGIN VIOLATIONS'}
          </Badge>
        }
      >
        <div className="divide-y divide-white/[0.05]">
          {audit.checks.map((check) => {
            const isPass = check.status === 'PASS';
            const isWarn = check.status === 'WARN';

            return (
              <div key={check.id} className="py-3 px-2 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-white/[0.02] transition-colors rounded">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {isPass ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isWarn ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 animate-pulse" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white uppercase tracking-wide font-sans">
                        {check.name}
                      </span>
                      <span className="text-[11px] font-mono tabular-nums text-slate-400">
                        ({check.currentDisplay} / {check.limitDisplay})
                      </span>
                    </div>
                    <p className="text-[11px] font-sans text-slate-400 mt-0.5">
                      {check.details}
                    </p>
                    {check.remedy && (
                      <div className="mt-1.5 text-[11px] text-amber-300 font-sans flex items-center gap-1.5 font-medium">
                        <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Remedy: {check.remedy}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <Badge variant={isPass ? 'nominal' : isWarn ? 'warning' : 'alert'} size="sm">
                    {check.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Readiness Resolution Banner */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-sky-950/60 border border-sky-400/30 text-sky-400">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-sans font-medium tracking-wide">ESTIMATED MISSION RELIABILITY PREVIEW</span>
              <div className="text-sm font-semibold text-white font-sans">
                SCORE PREVIEW: <span className="text-sky-300 font-mono font-bold tabular-nums">{audit.scorePreview} / 100 PTS</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!audit.isReady && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => setPhase('payload')}
                icon={<Wrench className="w-3.5 h-3.5" />}
              >
                ADJUST PAYLOAD
              </Button>
            )}

            <Button
              variant={audit.isReady ? 'primary' : 'danger'}
              size="lg"
              disabled={!audit.isReady}
              onClick={() => setPhase('launch')}
              icon={<Rocket className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              {audit.isReady ? 'INITIATE LAUNCH SEQUENCE' : 'LAUNCH BLOCKED (FIX CONSTRAINTS)'}
            </Button>
          </div>
        </div>
      </AerospaceCard>
    </div>
  );
};
