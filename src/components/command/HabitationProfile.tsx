import React, { useState } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { 
  Users, 
  AlertTriangle, 
  MapPin, 
  Building, 
  Route, 
  Truck, 
  HelpCircle, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  Clock,
  ExternalLink
} from 'lucide-react';
import { ExplainabilityModal } from './ExplainabilityModal';

export const HabitationProfile: React.FC = () => {
  const {
    selectedHabitation,
    shelters,
    routes,
    isR17Blocked,
    isS4Overloaded,
    approveOrder,
    isOrderApproved,
    exportSitRep
  } = useDisaster();

  const [isExplainOpen, setIsExplainOpen] = useState(false);

  if (!selectedHabitation) return null;

  const assignedShelter = shelters.find(s => s.id === selectedHabitation.calculatedShelterId);
  const assignedRoute = routes.find(r => r.id === selectedHabitation.calculatedRouteId);

  const isRed = selectedHabitation.riskCategory === 'RED';
  const isOrange = selectedHabitation.riskCategory === 'ORANGE';

  const factor = selectedHabitation.factorBreakdown;

  return (
    <div className="w-full flex flex-col h-full space-y-4">
      {/* Zone Header Badge */}
      <div className="p-4 rounded-xl glass-panel border-l-4 border-l-red-500 relative overflow-hidden">
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                {selectedHabitation.code}
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                isRed ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-orange-950 text-orange-400 border border-orange-800'
              }`}>
                RANK #{selectedHabitation.priorityRank} • {selectedHabitation.riskCategory} ZONE
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-white mt-1.5 leading-snug">
              {selectedHabitation.name}
            </h3>
          </div>

          {/* Score Circular Badge */}
          <div className="text-right">
            <div className="text-2xl font-mono font-extrabold text-red-400 leading-none">
              {selectedHabitation.finalPriorityScore}
              <span className="text-xs text-slate-500 font-normal">/100</span>
            </div>
            <span className="text-[10px] font-mono text-red-300 uppercase tracking-wider font-bold">
              {selectedHabitation.urgency}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          {selectedHabitation.notes}
        </p>
      </div>

      {/* Multi-Factor Priority Breakdown Bars (Prototype Multi-Factor Model) */}
      <div className="p-4 rounded-xl glass-panel text-xs font-mono space-y-2.5">
        <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800 pb-1.5">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>FACTOR CONTRIBUTION (AHP MODEL)</span>
          </span>
          <span className="text-[10px] text-slate-500">MCDM WEIGHTS</span>
        </div>

        {/* Hazard */}
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Hazard Intensity (w=0.35)</span>
            <span className="text-slate-200 font-bold">{factor.hazardScore}% &rarr; +{factor.hazardContrib} pts</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${factor.hazardScore}%` }} />
          </div>
        </div>

        {/* Vulnerability */}
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Social Vulnerability (w=0.30)</span>
            <span className="text-slate-200 font-bold">{factor.vulnerabilityScore}% &rarr; +{factor.vulnContrib} pts</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${factor.vulnerabilityScore}%` }} />
          </div>
        </div>

        {/* Exposure */}
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Population Exposure (w=0.20)</span>
            <span className="text-slate-200 font-bold">{factor.exposureScore}% &rarr; +{factor.exposureContrib} pts</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${factor.exposureScore}%` }} />
          </div>
        </div>

        {/* Accessibility Risk */}
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Accessibility Risk (w=0.15)</span>
            <span className="text-slate-200 font-bold">{factor.accessScore}% &rarr; +{factor.accessContrib} pts</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${factor.accessScore}%` }} />
          </div>
        </div>
      </div>

      {/* Demographic Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400 text-[10px] block">TOTAL POP</span>
          <span className="text-slate-200 font-bold text-sm">{selectedHabitation.population.toLocaleString()}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400 text-[10px] block">ELDERLY (&gt;65)</span>
          <span className="text-orange-400 font-bold text-sm">{selectedHabitation.vulnerablePop.elderly}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400 text-[10px] block">CHILDREN (&lt;10)</span>
          <span className="text-amber-400 font-bold text-sm">{selectedHabitation.vulnerablePop.children}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400 text-[10px] block">PwD RESIDENTS</span>
          <span className="text-red-400 font-bold text-sm">{selectedHabitation.vulnerablePop.disabilities}</span>
        </div>
      </div>

      {/* Actionable Dispatches: Shelter, Route, Rescue Unit */}
      <div className="p-3.5 rounded-xl glass-panel text-xs space-y-3">
        <div className="text-slate-300 font-mono font-bold uppercase text-[11px] tracking-wider border-b border-slate-800 pb-1.5 flex items-center justify-between">
          <span>AI RECOMMENDATION PACKAGE</span>
          <span className="text-emerald-400 font-mono text-[10px]">OPTIMIZED</span>
        </div>

        {/* Assigned Shelter */}
        <div className="flex items-start gap-2.5">
          <Building className="w-4 h-4 text-cyan-400 mt-0.5" />
          <div className="flex-1">
            <div className="text-slate-400 text-[10px] font-mono uppercase">ASSIGNED SAFE SHELTER</div>
            <div className="font-bold text-slate-200">{assignedShelter?.name} ({assignedShelter?.code})</div>
            <div className="text-[11px] text-slate-400">
              Capacity: {assignedShelter?.totalCapacity} | Occupancy: <span className={assignedShelter?.status === 'OVERLOAD' ? 'text-red-400 font-bold' : 'text-cyan-400'}>{assignedShelter?.occupancyPct}%</span> ({assignedShelter?.availableBeds} beds buffer)
            </div>
          </div>
        </div>

        {/* Assigned Route */}
        <div className="flex items-start gap-2.5">
          <Route className="w-4 h-4 text-emerald-400 mt-0.5" />
          <div className="flex-1">
            <div className="text-slate-400 text-[10px] font-mono uppercase">EVACUATION CORRIDOR</div>
            <div className="font-bold text-emerald-300">{assignedRoute?.code}: {assignedRoute?.name}</div>
            <div className="text-[11px] text-slate-400">
              Distance: {assignedRoute?.distanceKm} km | Est. Transit: {assignedRoute?.travelTimeMin} min | Risk: <span className="text-emerald-400 font-bold">{assignedRoute?.riskLevel}</span>
            </div>
          </div>
        </div>

        {/* Assigned Rescue Unit */}
        <div className="flex items-start gap-2.5">
          <Truck className="w-4 h-4 text-amber-400 mt-0.5" />
          <div className="flex-1">
            <div className="text-slate-400 text-[10px] font-mono uppercase">DISPATCHED RESCUE SQUAD</div>
            <div className="font-bold text-amber-300">{selectedHabitation.assignedUnit}</div>
            <div className="text-[11px] text-slate-400">
              ETA: 8-12 min &bull; Inflatable Rescue Boats (IRBs) + Emergency Triage
            </div>
          </div>
        </div>
      </div>

      {/* Decision Explainability & Commander Sign-Off Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <button
          onClick={() => setIsExplainOpen(true)}
          className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl font-mono text-xs font-semibold bg-slate-900 border border-cyan-500/50 hover:bg-cyan-950/60 text-cyan-300 transition-all shadow-glow-cyan"
        >
          <HelpCircle className="w-4 h-4" />
          <span>WHY THIS DECISION?</span>
        </button>

        <button
          onClick={approveOrder}
          disabled={isOrderApproved}
          className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
            isOrderApproved
              ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
              : 'bg-gradient-to-r from-red-600 to-orange-600 hover:brightness-110 text-white shadow-glow-red'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isOrderApproved ? 'ORDER AUTHORIZED ✓' : 'APPROVE DISPATCH'}</span>
        </button>
      </div>

      {/* Explainability Modal Drawer */}
      {isExplainOpen && (
        <ExplainabilityModal
          habitation={selectedHabitation}
          shelter={assignedShelter}
          route={assignedRoute}
          onClose={() => setIsExplainOpen(false)}
        />
      )}
    </div>
  );
};
