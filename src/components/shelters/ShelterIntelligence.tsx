import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { 
  Building, 
  AlertTriangle, 
  CheckCircle2, 
  Utensils, 
  Droplet, 
  Zap, 
  Activity, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const ShelterIntelligence: React.FC = () => {
  const { shelters, isS4Overloaded } = useDisaster();

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-2">
            <Building className="w-3.5 h-3.5" />
            <span>CARRYING CAPACITY & LOGISTICS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            SHELTER INTELLIGENCE NETWORK
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mt-1">
            Real-time occupancy tracking, resource buffers, and automatic overflow diversion to prevent secondary shelter disasters.
          </p>
        </div>

        {/* System Alert if S4 Overloaded */}
        {isS4Overloaded && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-500 text-xs font-mono text-red-200 max-w-md shadow-glow-red animate-pulse">
            <div className="flex items-center gap-2 font-bold text-red-300 mb-1">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>AUTOMATED OVERFLOW BALANCING ACTIVE</span>
            </div>
            Shelter S4 has crossed 90% carrying capacity. Influx from Zone C is automatically diverted to Central Apex Safe Haven (S6).
          </div>
        )}
      </div>

      {/* 6 Shelter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shelters.map(shelter => {
          const isOverload = shelter.status === 'OVERLOAD';
          const isWarning = shelter.status === 'WARNING';
          const isNormal = shelter.status === 'NORMAL';

          return (
            <div
              key={shelter.id}
              className={`p-6 rounded-2xl glass-panel border transition-all ${
                isOverload
                  ? 'border-red-500 shadow-glow-red bg-red-950/20'
                  : (isWarning ? 'border-amber-500/60 shadow-glow-amber bg-amber-950/10' : 'border-tactical-border/80 hover:border-cyan-500/40')
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                    {shelter.code}
                  </span>
                  <h3 className="font-bold text-base text-white mt-1.5 leading-snug">
                    {shelter.name}
                  </h3>
                </div>

                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                  isOverload ? 'bg-red-950 text-red-400 border border-red-800' :
                  isWarning ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {shelter.status}
                </span>
              </div>

              {/* Occupancy Circular Progress Gauge */}
              <div className="flex items-center gap-4 mb-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#1e293b"
                      strokeWidth="5"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke={isOverload ? '#ef4444' : (isWarning ? '#f59e0b' : '#06b6d4')}
                      strokeWidth="5"
                      fill="none"
                      strokeDasharray={`${(shelter.occupancyPct / 100) * 163} 163`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute font-mono font-bold text-xs text-white">
                    {shelter.occupancyPct}%
                  </span>
                </div>

                <div className="text-xs font-mono space-y-1">
                  <div className="text-slate-300">
                    Occupancy: <strong>{shelter.currentOccupancy}</strong> / {shelter.totalCapacity}
                  </div>
                  <div className="text-slate-400">
                    Available Buffer: <strong className={shelter.availableBeds === 0 ? 'text-red-400' : 'text-emerald-400'}>{shelter.availableBeds} beds</strong>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Distance from Valley: {shelter.distanceFromC} km
                  </div>
                </div>
              </div>

              {/* Resource Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <Utensils className="w-3.5 h-3.5 text-amber-400" />
                  <span>Food: <strong>{shelter.foodStockPct}%</strong></span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <Droplet className="w-3.5 h-3.5 text-blue-400" />
                  <span>Water: <strong>{shelter.waterStockPct}%</strong></span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Power: <strong>{shelter.powerGenPct}%</strong></span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-red-400" />
                  <span>Medical: <strong>{shelter.medicalBay ? 'TRIAGE' : 'BASIC'}</strong></span>
                </div>
              </div>

              {/* Reroute Recommendation Banner if Overloaded */}
              {isOverload && (
                <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-[11px] font-mono text-red-300 flex items-center justify-between">
                  <span>AI ACTION: DIVERT &rarr; SHELTER S6</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
