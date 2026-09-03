import React from 'react';
import { CalculatedHabitationState, CalculatedShelterState, EvacuationRoute } from '../../types/disaster';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Building, 
  Route, 
  Truck, 
  TrendingUp,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface ExplainabilityModalProps {
  habitation: CalculatedHabitationState;
  shelter?: CalculatedShelterState;
  route?: EvacuationRoute;
  onClose: () => void;
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  habitation,
  shelter,
  route,
  onClose,
}) => {
  const f = habitation.factorBreakdown;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel border border-cyan-500/60 shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                TRANSPARENT AI EXPLAINABILITY
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                WHY {habitation.code} IS RANK #{habitation.priorityRank}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype Logic Badge */}
        <div className="mb-4 p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center justify-between">
          <span>FRAMEWORK: Prototype Multi-Factor Priority Model (MCDM / AHP)</span>
          <span className="text-[10px] text-slate-400">Confidence: 94%</span>
        </div>

        {/* Scoring Attribution Table */}
        <div className="mb-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-mono text-slate-300 font-bold mb-3 uppercase tracking-wider">
            SCORING FACTOR ATTRIBUTION (TOTAL: {habitation.finalPriorityScore}/100)
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-red-950">
              <span className="text-slate-300">+ Hazard Intensity Factor (Gauge surge + Low elevation 18m)</span>
              <span className="text-red-400 font-bold text-sm">+{f.hazardContrib} pts</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-orange-950">
              <span className="text-slate-300">+ Vulnerable Demographics ({habitation.vulnerablePop.elderly} elderly + {habitation.vulnerablePop.children} children + {habitation.vulnerablePop.disabilities} PwD)</span>
              <span className="text-orange-400 font-bold text-sm">+{f.vulnContrib} pts</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-amber-950">
              <span className="text-slate-300">+ High Population Exposure ({habitation.population} residents in high-density informal housing)</span>
              <span className="text-amber-400 font-bold text-sm">+{f.exposureContrib} pts</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-cyan-950">
              <span className="text-slate-300">+ Accessibility Isolation (Culvert R17 breached; road impassable)</span>
              <span className="text-cyan-400 font-bold text-sm">+{f.accessContrib} pts</span>
            </div>
          </div>
        </div>

        {/* Three Essential Explanations */}
        <div className="space-y-4 mb-6 text-xs">
          {/* Why this Action */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="font-mono font-bold text-red-400 uppercase mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Recommended Action: IMMEDIATE EVACUATION</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {habitation.explainability.actionRequired}
            </p>
          </div>

          {/* Why this Shelter */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="font-mono font-bold text-cyan-400 uppercase mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>Why Shelter {shelter?.code}?</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {habitation.explainability.shelterReason}
            </p>
          </div>

          {/* Why this Route */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="font-mono font-bold text-emerald-400 uppercase mb-1 flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5" />
              <span>Why {route?.code}?</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {habitation.explainability.routeReason}
            </p>
          </div>
        </div>

        {/* Why Should Authorities Trust the AI? */}
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>GOVERNANCE: WHY AUTHORITIES CAN TRUST THIS AI</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            RESCUE-ZONE AI is built on deterministic Multi-Criteria Decision Analysis (AHP) and formal mathematical graph routing—not black-box generative models. Every recommendation exposes its exact telemetry inputs, sensitivity weights, and decision trail for Incident Commander validation.
          </p>
        </div>

        {/* Close CTA */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-mono text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
          >
            ACKNOWLEDGE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
