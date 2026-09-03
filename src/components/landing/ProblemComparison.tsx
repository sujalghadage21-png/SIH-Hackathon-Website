import React, { useState } from 'react';
import { 
  FileWarning, 
  Sparkles, 
  MapPin, 
  Route, 
  Users, 
  Clock, 
  Check, 
  X,
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const ProblemComparison: React.FC = () => {
  const [isTransformed, setIsTransformed] = useState(true);

  const traditionalPoints = [
    { title: 'Static Risk Maps', desc: 'Pre-season flood hazard maps updated every 3-5 years; blind to current cloudburst peaks.' },
    { title: 'Manual Prioritization', desc: 'Control room relying on phone calls and subjective triage without weighted vulnerability.' },
    { title: 'Delayed Route Updates', desc: 'No knowledge that culverts (like R17) are breached until vehicles are already trapped.' },
    { title: 'Blind Shelter Selection', desc: 'All evacuees rushed to the nearest facility, causing severe overcrowding and secondary panic.' },
    { title: 'Broad Generic Zones', desc: 'Entire tehsils marked yellow/red without identifying which slum cluster has disabled elders.' },
  ];

  const rescueZonePoints = [
    { title: 'Dynamic Real-Time Scoring', desc: 'Calculates live composite risk every second as rainfall and river stages shift.' },
    { title: 'Vulnerability-Aware Prioritization', desc: 'Weighs elderly, infants, PwD, and non-pucca housing directly into rescue ranking.' },
    { title: 'Adaptive Evacuation Routing', desc: 'Instantly identifies breached culverts and switches to elevated ridge bypasses.' },
    { title: 'Live Carrying Capacity', desc: 'Guards shelter capacity limits with automatic overflow diversion to Apex bases.' },
    { title: 'What-If Disaster Simulation', desc: 'Incident Commanders can test "what if rainfall increases +40%" before it happens.' },
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-tactical-border/60">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>PARADIGM SHIFT IN DISASTER MANAGEMENT</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase mb-4">
          FROM STATIC MAPS TO DYNAMIC DECISIONS
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Traditional disaster maps are static PDF snapshots drawn months before disaster strikes. When rain hits 90mm/hr and roads submerge, static maps fail. RESCUE-ZONE AI turns continuous telemetry into immediate life-saving action.
        </p>

        {/* Interactive Transformation Switch */}
        <div className="mt-8 inline-flex items-center p-1.5 rounded-xl glass-panel border border-cyan-500/40 font-mono text-xs">
          <button
            onClick={() => setIsTransformed(false)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              !isTransformed 
                ? 'bg-slate-800 text-red-300 border border-red-500/40 shadow-glow-red' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            TRADITIONAL STATIC MAP
          </button>
          <button
            onClick={() => setIsTransformed(true)}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              isTransformed 
                ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>RESCUE-ZONE AI (DYNAMIC)</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Traditional Panel */}
        <div className={`p-6 sm:p-8 rounded-2xl border transition-all duration-500 ${
          !isTransformed 
            ? 'bg-slate-950/90 border-red-500/50 shadow-glow-red' 
            : 'bg-slate-950/40 border-slate-800/80 opacity-70 hover:opacity-100'
        }`}>
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-red-950/50 border border-red-800/60 text-red-400">
                <FileWarning className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-mono font-bold text-base text-slate-200 uppercase">TRADITIONAL APPROACH</h3>
                <span className="text-[11px] font-mono text-slate-500">Static GIS & Manual Coordination</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-red-950/80 border border-red-700/60 text-red-400 text-xs font-mono font-semibold">
              LAG: 3 - 6 HOURS
            </span>
          </div>

          <div className="space-y-4">
            {traditionalPoints.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/80">
                <div className="p-1 rounded bg-red-950 text-red-400 mt-0.5">
                  <X className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-200">{item.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-xs text-red-300 font-mono">
            RESULT: Severe rescue delays, misallocated rescue boats, overcrowded flood shelters, and trapped evacuees.
          </div>
        </div>

        {/* RESCUE-ZONE AI Panel */}
        <div className={`p-6 sm:p-8 rounded-2xl border transition-all duration-500 ${
          isTransformed 
            ? 'bg-tactical-panel border-cyan-500/60 shadow-glow-cyan' 
            : 'bg-slate-950/40 border-slate-800/80 opacity-70 hover:opacity-100'
        }`}>
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/60 text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-mono font-bold text-base text-cyan-300 uppercase">RESCUE-ZONE AI</h3>
                <span className="text-[11px] font-mono text-slate-400">Deterministic Real-Time Decision Support</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500 text-cyan-300 text-xs font-mono font-semibold">
              LATENCY: &lt; 15 SECONDS
            </span>
          </div>

          <div className="space-y-4">
            {rescueZonePoints.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/80 border border-cyan-950/80 hover:border-cyan-500/40 transition-colors">
                <div className="p-1 rounded bg-emerald-950 text-emerald-400 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-cyan-200">{item.title}</div>
                  <div className="text-xs text-slate-300 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-xs text-cyan-200 font-mono">
            RESULT: 68% faster decision dispatch, zero shelter overloads, automated safe bypasses, and mathematically defensible prioritization.
          </div>
        </div>
      </div>
    </section>
  );
};
