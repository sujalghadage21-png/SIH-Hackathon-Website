import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  ShieldCheck, 
  Layers,
  Activity,
  Anchor
} from 'lucide-react';
import { INITIAL_RESCUE_UNITS } from '../../data/syntheticData';

export const ResourceAllocation: React.FC = () => {
  const { resources, habitations, isOrderApproved, approveOrder } = useDisaster();

  const redZones = habitations.filter(h => h.riskCategory === 'RED');

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>INCIDENT LOGISTICS & OPTIMIZATION</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            AI RESOURCE ALLOCATION & GAP ANALYSIS
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mt-1">
            Optimizes rescue units, inflatable craft, and advanced medical transit assets across prioritized red zones to eliminate deployment bottlenecks.
          </p>
        </div>

        <button
          onClick={approveOrder}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
            isOrderApproved
              ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
              : 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-glow-red hover:brightness-110'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isOrderApproved ? 'DISPATCH ORDER SIGNED ✓' : 'AUTHORIZE FULL DISPATCH'}</span>
        </button>
      </div>

      {/* Available vs Required Resource Gap Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((res, idx) => {
          const isGap = res.status === 'CRITICAL_GAP';
          const isMod = res.status === 'MODERATE_GAP';
          const deficit = res.required - res.available;

          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl glass-panel border transition-all ${
                isGap ? 'border-red-500 shadow-glow-red bg-red-950/20' : 
                (isMod ? 'border-amber-500/60 bg-amber-950/15' : 'border-emerald-500/50 bg-emerald-950/10')
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-slate-400 font-bold uppercase">{res.category}</span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  isGap ? 'bg-red-950 text-red-400' : (isMod ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400')
                }`}>
                  {res.status.replace('_', ' ')}
                </span>
              </div>

              <h4 className="font-bold text-sm text-white mb-4">
                {res.name}
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">AVAILABLE</span>
                  <span className="text-slate-200 font-bold text-base">{res.available.toLocaleString()} {res.unit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">REQUIRED</span>
                  <span className="text-red-400 font-bold text-base">{res.required.toLocaleString()} {res.unit}</span>
                </div>
              </div>

              {deficit > 0 ? (
                <div className="mt-3 text-[11px] font-mono text-red-400 flex items-center justify-between">
                  <span>Deficit Gap:</span>
                  <strong className="text-sm">-{deficit} {res.unit}</strong>
                </div>
              ) : (
                <div className="mt-3 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                  <span>Surplus Buffer:</span>
                  <strong>+{Math.abs(deficit)} {res.unit}</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Recommended Allocation Matrix */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/50 shadow-glow-cyan">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-base text-cyan-300 uppercase">
                AI RECOMMENDED OPERATIONAL DISPATCH MATRIX
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Targeted allocation based on hazard depth and demographic fragility</span>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
            ACTIVE RED ZONES: {redZones.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_RESCUE_UNITS.slice(0, 4).map(unit => (
            <div key={unit.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-400">{unit.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                  {unit.type}
                </span>
              </div>
              <div className="text-slate-300">
                Assigned Target: <strong className="text-red-400">{unit.assignedZoneId.toUpperCase()}</strong>
              </div>
              <div className="text-[11px] text-slate-400 leading-snug">
                {unit.equipment}
              </div>
              <div className="pt-2 border-t border-slate-900 flex justify-between text-slate-500">
                <span>Personnel: {unit.personnel}</span>
                <span className="text-emerald-400 font-bold">ETA: {unit.etaMinutes} min</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
