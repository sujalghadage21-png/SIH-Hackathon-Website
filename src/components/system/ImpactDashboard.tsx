import React from 'react';
import { 
  BarChart3, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Info, 
  CheckCircle2,
  Users,
  Building
} from 'lucide-react';

export const ImpactDashboard: React.FC = () => {
  const benchmarks = [
    {
      title: 'DECISION RESPONSE TIME',
      unit: 'Minutes to First Rescue Dispatch',
      manual: 45,
      manualLabel: '45 mins (Manual Phone & Radio Triage)',
      ai: 0.2,
      aiLabel: '12 seconds (AI MCDM Model)',
      improvement: '-99% Latency Reduction',
      manualBar: '100%',
      aiBar: '5%',
    },
    {
      title: 'EVACUATION ROUTE ADAPTATION',
      unit: 'Time to Identify Causeway Inundation',
      manual: 60,
      manualLabel: '60 mins (After Vehicles Trapped)',
      ai: 0.25,
      aiLabel: '15 seconds (Immediate Culvert Sensor Reroute)',
      improvement: 'Immediate Threat Avoidance',
      manualBar: '100%',
      aiBar: '4%',
    },
    {
      title: 'SHELTER OVERCROWDING INCIDENTS',
      unit: 'Facilities Exceeding Max Carrying Capacity',
      manual: 42,
      manualLabel: '42% Overcrowded (Secondary Crisis)',
      ai: 0,
      aiLabel: '0% Overload (Auto-Diverted to S6 Apex)',
      improvement: '100% Bottleneck Elimination',
      manualBar: '42%',
      aiBar: '2%',
    },
    {
      title: 'RESOURCE ALLOCATION MISMATCH',
      unit: 'Boats/Ambulances Dispatched to Wrong Zones',
      manual: 28,
      manualLabel: '28% Misallocated (No Vulnerability Weight)',
      ai: 3,
      aiLabel: '3% Residual Gap (Demographic-Aligned)',
      improvement: '-89% Wastage Reduction',
      manualBar: '28%',
      aiBar: '3%',
    }
  ];

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>QUANTIFIABLE OPERATIONAL VALUE</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            IMPACT & BENCHMARK DASHBOARD
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mt-1">
            Comparative performance simulations demonstrating operational velocity, resource optimization, and life-safety carrying capacity guarantees.
          </p>
        </div>

        {/* Prototype Simulation Disclaimer Badge */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-400 max-w-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-0.5">
            <Info className="w-3.5 h-3.5" />
            <span>Illustrative Prototype Simulation</span>
          </div>
          Synthetic benchmark data modeled after published disaster logistics literature for SIH 2026 evaluation.
        </div>
      </div>

      {/* Comparative Benchmark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benchmarks.map((item, idx) => (
          <div key={idx} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-mono font-bold text-sm text-white uppercase tracking-wide">
                  {item.title}
                </h4>
                <span className="text-[11px] font-mono text-slate-400">{item.unit}</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-mono text-xs font-bold">
                {item.improvement}
              </span>
            </div>

            {/* Visual Bars */}
            <div className="space-y-3 pt-2 font-mono text-xs">
              {/* Manual */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Traditional Manual Workflow</span>
                  <span className="text-red-400 font-bold">{item.manualLabel}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-red-500/80 rounded-full" style={{ width: item.manualBar }} />
                </div>
              </div>

              {/* AI Assisted */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="text-cyan-400 font-bold">RESCUE-ZONE AI Workflow</span>
                  <span className="text-emerald-400 font-bold">{item.aiLabel}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full shadow-glow-emerald" style={{ width: item.aiBar }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
