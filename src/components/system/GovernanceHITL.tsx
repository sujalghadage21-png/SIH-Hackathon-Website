import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { 
  ShieldCheck, 
  UserCheck, 
  Cpu, 
  ArrowRight, 
  FileText, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const GovernanceHITL: React.FC = () => {
  const { isOrderApproved, approveOrder, exportSitRep } = useDisaster();

  const workflowSteps = [
    { step: '1', title: 'AI Detects', desc: 'Hydrometeorological sensors and DEM elevation rasters detect anomalous water stages and slope creep.' },
    { step: '2', title: 'AI Prioritizes', desc: 'MCDM model correlates hazard intensity with vulnerability registries to rank at-risk habitations.' },
    { step: '3', title: 'Authority Reviews', desc: 'District Disaster Management Authority (DDMA) Incident Commander inspects attribution scores and alternate corridors.' },
    { step: '4', title: 'Authority Approves', desc: 'Commander digitally authorizes official operational dispatch orders, modifying unit targets if field reports differ.' },
    { step: '5', title: 'Response Team Acts', desc: 'NDRF, SDRF, and Civil Defense units deploy with GPS telemetry back to the EOC.' },
    { step: '6', title: 'System Recalculates', desc: 'Field situational telemetry and shelter bed consumption feed back into the AI to continually re-optimize.' },
  ];

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs mb-3 shadow-glow-emerald">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>STATUTORY GOVERNANCE & ACCOUNTABILITY</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase mb-4">
          AI RECOMMENDS. AUTHORITIES DECIDE.
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          RESCUE-ZONE AI operates strictly as a decision-support platform under the statutory authority of the Disaster Management Act (2005). The system never autonomously issues field orders; it augments human command with instantaneous situational clarity.
        </p>
      </div>

      {/* 6-Step Closed Loop Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflowSteps.map((ws, idx) => (
          <div key={idx} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-900 text-cyan-400 border border-cyan-500/40">
                STEP {ws.step}
              </span>
              <span className="text-[10px] font-mono text-slate-500">CLOSED LOOP</span>
            </div>
            <h4 className="font-bold text-base text-white">{ws.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {ws.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Interactive Authorization Desk Simulation */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-cyan-500/60 shadow-glow-cyan">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              INCIDENT COMMANDER CONSOLE
            </span>
            <h3 className="font-display font-extrabold text-xl text-white">
              OFFICIAL DISPATCH AUTHORIZATION
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review AI recommendations, inspect legal mandates, and execute signed dispatch packet.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportSitRep}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-xs text-slate-300 bg-slate-900 border border-slate-700 hover:text-white"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXPORT SITREP (PDF)</span>
            </button>

            <button
              onClick={approveOrder}
              disabled={isOrderApproved}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                isOrderApproved
                  ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-glow-red hover:brightness-110'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isOrderApproved ? 'ORDER DIGITALLY SIGNED ✓' : 'EXECUTE AUTHORIZED ORDER'}</span>
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">AUTHORIZED SIGNER</span>
            <span className="text-slate-200 font-bold">District Magistrate / Collector</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">STATUTORY ACT</span>
            <span className="text-slate-200 font-bold">Disaster Management Act, 2005 (Sec 30)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">AUDIT HASH</span>
            <span className="text-cyan-400 font-bold truncate">DDMA-2026-X99-VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
