import React, { useEffect } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { Cpu, CheckCircle2, ArrowRight, X } from 'lucide-react';

export const RecalculationBanner: React.FC = () => {
  const { 
    showRecalcBanner, 
    recalcTriggerText, 
    dismissRecalcBanner, 
    topPriorityHabitation,
    isR17Blocked,
    isS4Overloaded
  } = useDisaster();

  useEffect(() => {
    if (showRecalcBanner) {
      const timer = setTimeout(() => {
        dismissRecalcBanner();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [showRecalcBanner, dismissRecalcBanner]);

  if (!showRecalcBanner) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-4 rounded-2xl glass-panel border-2 border-cyan-400 shadow-glow-cyan bg-slate-950/95 backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500 text-cyan-300 animate-pulse">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                RESCUE-ZONE AI TELEMETRY
              </span>
              <h4 className="font-display font-bold text-sm text-white uppercase">
                {recalcTriggerText}
              </h4>
            </div>
          </div>
          <button
            onClick={dismissRecalcBanner}
            className="p-1 rounded-md text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Changes Summary */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 text-xs font-mono space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span>Primary Critical Zone:</span>
            <strong className="text-red-400">{topPriorityHabitation?.code} (Rank #{topPriorityHabitation?.priorityRank})</strong>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Culvert Causeway R17:</span>
            <strong className={isR17Blocked ? 'text-red-400' : 'text-emerald-400'}>
              {isR17Blocked ? 'BLOCKED (>75cm)' : 'OPEN'}
            </strong>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Shelter S4 Carrying Cap:</span>
            <strong className={isS4Overloaded ? 'text-amber-400' : 'text-cyan-400'}>
              {isS4Overloaded ? '94% (OVERFLOW &rarr; S6)' : 'ADEQUATE'}
            </strong>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Assigned Corridor:</span>
            <strong className="text-emerald-400">
              {isR17Blocked ? 'ROUTE D (RIDGE BYPASS)' : 'ROUTE B'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
