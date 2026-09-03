import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { 
  Route as RouteIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Navigation, 
  ArrowRight,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';

export const RouteOptimization: React.FC = () => {
  const { routes, isR17Blocked, setActiveTab } = useDisaster();

  const recommendedRoute = routes.find(r => r.isRecommended) || routes[3];

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-2">
            <RouteIcon className="w-3.5 h-3.5" />
            <span>MULTI-CRITERIA GRAPH ROUTING</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            EVACUATION ROUTE OPTIMIZATION
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mt-1">
            Dynamic graph re-weighting avoids flooded culverts, bridge scour risks, and bottleneck choke points while optimizing travel time vs life-safety exposure.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('COMMAND')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-glow-cyan"
        >
          <span>VIEW ROUTES ON GIS MAP</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hero AI Recommendation Banner */}
      <div className="p-6 rounded-2xl glass-panel border-2 border-emerald-500/80 shadow-glow-emerald bg-emerald-950/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                OPTIMIZED DECISION RECOMMENDATION
              </span>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                {recommendedRoute.code}: {recommendedRoute.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <div className="text-slate-400">Distance</div>
              <div className="text-white font-bold text-base">{recommendedRoute.distanceKm} km</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400">Est. Time</div>
              <div className="text-white font-bold text-base">{recommendedRoute.travelTimeMin} min</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400">Exposure Risk</div>
              <div className="text-emerald-400 font-bold text-base">LOW RISK</div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono">
          <strong className="text-emerald-400 uppercase">AI REASONING:</strong> {recommendedRoute.reasoning}
        </div>
      </div>

      {/* Multi-Route Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {routes.map(route => {
          const isRec = route.isRecommended;
          const isCritical = route.riskLevel === 'CRITICAL';
          const isHigh = route.riskLevel === 'HIGH';

          return (
            <div
              key={route.id}
              className={`p-5 rounded-xl glass-panel border transition-all flex flex-col justify-between ${
                isRec
                  ? 'border-emerald-500 shadow-glow-emerald bg-emerald-950/15'
                  : (isCritical ? 'border-red-500/60 bg-red-950/15' : 'border-slate-800')
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                    {route.code}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isCritical ? 'bg-red-950 text-red-400 border border-red-800' :
                    isHigh ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                    'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {route.riskLevel} RISK
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white mb-2 leading-snug">
                  {route.name}
                </h4>

                <div className="space-y-1.5 text-xs font-mono text-slate-300 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Distance:</span>
                    <span>{route.distanceKm} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transit Time:</span>
                    <span>{route.travelTimeMin} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className={route.status === 'UNSAFE' ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {route.status}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2 mb-4">
                  {route.reasoning}
                </p>
              </div>

              {isRec ? (
                <div className="py-2 px-3 rounded-lg bg-emerald-950 text-emerald-300 font-mono text-xs font-bold text-center border border-emerald-500/60">
                  SELECTED BY AI &bull; AUTHORIZED
                </div>
              ) : (
                <div className="py-2 px-3 rounded-lg bg-slate-900 text-slate-500 font-mono text-xs text-center border border-slate-800">
                  {route.status === 'UNSAFE' ? 'BYPASS REQUIRED' : 'SECONDARY CORRIDOR'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
