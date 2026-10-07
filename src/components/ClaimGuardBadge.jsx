import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

export default function ClaimGuardBadge({ claims = [] }) {
  if (!claims || claims.length === 0) return null;

  const statusConfig = {
    VERIFIED: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
    SUPPORTED: { bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20', icon: ShieldCheck },
    NEEDS_HUMAN_VERIFICATION: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: AlertTriangle },
    PROHIBITED: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: XCircle }
  };

  return (
    <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-3">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Claim Guard Risk Verification
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
          {claims.length} Claims Inspected
        </span>
      </div>

      <div className="space-y-2 text-xs">
        {claims.map((item, idx) => {
          const cfg = statusConfig[item.status] || statusConfig.SUPPORTED;
          const Icon = cfg.icon;
          return (
            <div key={idx} className={`p-2.5 rounded-xl border ${cfg.bg} flex items-start gap-2 justify-between`}>
              <div className="flex items-start gap-2 min-w-0">
                <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="font-semibold block text-[var(--text-primary)] truncate">"{item.claim}"</span>
                  <span className="text-[10px] text-[var(--text-muted)] block">Source: {item.source}</span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 border">
                {item.status.replace(/_/g, ' ')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
