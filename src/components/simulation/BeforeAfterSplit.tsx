import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  Building, 
  Route, 
  Truck, 
  CloudRain,
  Car
} from 'lucide-react';

export const BeforeAfterSplit: React.FC = () => {
  const { 
    baselineState, 
    habitations, 
    shelters, 
    roads, 
    routes, 
    params,
    isR17Blocked,
    isS4Overloaded
  } = useDisaster();

  const baselineZoneC = baselineState.habitations.find(h => h.id === 'zone-c');
  const activeZoneC = habitations.find(h => h.id === 'zone-c');

  const baselineS4 = baselineState.shelters.find(s => s.id === 's4');
  const activeS4 = shelters.find(s => s.id === 's4');

  const baselineR17 = baselineState.roads.find(r => r.id === 'R17');
  const activeR17 = roads.find(r => r.id === 'R17');

  return (
    <div className="w-full rounded-2xl glass-panel border border-tactical-border/80 overflow-hidden p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
            COMPARATIVE SITUATION ANALYSIS
          </span>
          <h3 className="font-display font-extrabold text-2xl text-white uppercase">
            BEFORE VS. AFTER DISASTER ESCALATION
          </h3>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
            RAINFALL DELTA: +{params.rainfallPct}%
          </span>
          <span className="px-3 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300">
            RIVER: {params.riverStage}
          </span>
        </div>
      </div>

      {/* Split Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left: Before Scenario */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-mono font-bold text-sm text-slate-400 uppercase tracking-wider">
              1. BASELINE CONDITIONS
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
              STABLE STAGE
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            {/* Rainfall */}
            <div className="p-3 rounded-lg bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                <span>Precipitation:</span>
              </div>
              <span className="text-slate-200 font-bold">10% Normal Baseline</span>
            </div>

            {/* Zone C Rank */}
            <div className="p-3 rounded-lg bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Zone C Status:</span>
              </div>
              <div className="text-right">
                <div className="text-amber-400 font-bold">PRIORITY #{baselineZoneC?.priorityRank} (Moderate)</div>
                <div className="text-[10px] text-slate-400">Score: {baselineZoneC?.finalPriorityScore}/100</div>
              </div>
            </div>

            {/* Road R17 */}
            <div className="p-3 rounded-lg bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Car className="w-4 h-4 text-emerald-400" />
                <span>Road R17 Causeway:</span>
              </div>
              <span className="text-emerald-400 font-bold">OPEN (Passable)</span>
            </div>

            {/* Shelter S4 */}
            <div className="p-3 rounded-lg bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>Shelter S4 Occupancy:</span>
              </div>
              <span className="text-cyan-300 font-bold">62% (310 / 500 beds)</span>
            </div>

            {/* Evacuation Route */}
            <div className="p-3 rounded-lg bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Route className="w-4 h-4 text-slate-400" />
                <span>Active Route:</span>
              </div>
              <span className="text-slate-200 font-bold">ROUTE B (Direct Culvert)</span>
            </div>
          </div>
        </div>

        {/* Right: After Disaster Change */}
        <div className="p-5 rounded-xl bg-slate-950/90 border border-cyan-500/60 shadow-glow-cyan space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-mono font-bold text-sm text-cyan-300 uppercase tracking-wider">
              2. AFTER DISASTER ESCALATION
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-bold animate-pulse">
              LIVE ESCALATION ACTIVE
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            {/* Rainfall */}
            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-950 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <CloudRain className="w-4 h-4 text-red-400" />
                <span>Precipitation:</span>
              </div>
              <span className="text-red-400 font-bold">+{params.rainfallPct}% Inundation Surge</span>
            </div>

            {/* Zone C Rank */}
            <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Zone C Status:</span>
              </div>
              <div className="text-right">
                <div className="text-red-400 font-bold text-sm">PRIORITY #{activeZoneC?.priorityRank} (CRITICAL)</div>
                <div className="text-[10px] text-red-300 font-bold">Score: {activeZoneC?.finalPriorityScore}/100</div>
              </div>
            </div>

            {/* Road R17 */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Car className="w-4 h-4 text-red-400" />
                <span>Road R17 Causeway:</span>
              </div>
              <span className={isR17Blocked ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                {isR17Blocked ? 'BLOCKED (>75cm Inundated)' : 'OPEN'}
              </span>
            </div>

            {/* Shelter S4 */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Building className="w-4 h-4 text-amber-400" />
                <span>Shelter S4 Occupancy:</span>
              </div>
              <span className={isS4Overloaded ? 'text-amber-400 font-bold' : 'text-cyan-300'}>
                {activeS4?.occupancyPct}% &rarr; <span className="text-cyan-400">REROUTE TO S6</span>
              </span>
            </div>

            {/* Evacuation Route */}
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Route className="w-4 h-4 text-emerald-400" />
                <span>AI Recommended Route:</span>
              </div>
              <span className="text-emerald-400 font-bold">ROUTE D (ELEVATED RIDGE)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
