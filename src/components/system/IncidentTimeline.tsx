import React, { useState } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { 
  Clock, 
  AlertTriangle, 
  Cpu, 
  CheckCircle2, 
  Info, 
  Filter,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const IncidentTimeline: React.FC = () => {
  const { timeline, setSelectedHabitationId, setActiveTab } = useDisaster();
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'RECALCULATED' | 'WARNING'>('ALL');

  const filteredTimeline = timeline.filter(t => {
    if (filter === 'ALL') return true;
    return t.severity === filter;
  });

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>CHRONOLOGICAL INCIDENT TELEMETRY</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            REAL-TIME EVENT TIMELINE
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mt-1">
            Real-time audit log of sensor alerts, mathematical recalculation triggers, culvert breaches, and incident dispatch orders.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl glass-panel border border-slate-700 font-mono text-xs">
          {(['ALL', 'CRITICAL', 'RECALCULATED', 'WARNING'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === sev
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="max-w-3xl mx-auto space-y-4">
        {filteredTimeline.map((item, idx) => {
          const isCritical = item.severity === 'CRITICAL';
          const isRecalc = item.severity === 'RECALCULATED';
          const isWarning = item.severity === 'WARNING';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl glass-panel border transition-all flex items-start gap-4 ${
                isCritical
                  ? 'border-red-500/80 shadow-glow-red bg-red-950/20'
                  : (isRecalc ? 'border-cyan-400 shadow-glow-cyan bg-cyan-950/20' : 'border-slate-800')
              }`}
            >
              {/* Time Badge */}
              <div className="flex-shrink-0 text-center font-mono">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 font-bold text-sm">
                  {item.time}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">IST</span>
              </div>

              {/* Event Body */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isCritical ? 'bg-red-950 text-red-400 border border-red-800' :
                    isRecalc ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' :
                    'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {item.severity}
                  </span>
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {item.zoneId && (
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedHabitationId(item.zoneId!);
                        setActiveTab('COMMAND');
                      }}
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline font-semibold"
                    >
                      Focus Habitation on Map &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
