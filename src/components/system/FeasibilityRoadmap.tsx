import React from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Compass, 
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const FeasibilityRoadmap: React.FC = () => {
  const feasibilityPillars = [
    {
      title: 'TECHNICAL FEASIBILITY',
      points: [
        'Built entirely with open standard frameworks (React, WebGL 3D, WASM, GeoJSON).',
        'Deterministic MCDM mathematical models eliminate hallucination risks.',
        'Graph-based A* routing executes in < 25 ms in client memory.',
      ]
    },
    {
      title: 'INFRASTRUCTURE FEASIBILITY',
      points: [
        'Leverages existing ISRO Bhuvan geospatial servers and IMD automated radar.',
        'Cloud-native edge architecture runs smoothly in field command centers with intermittent 4G.',
        'Zero proprietary GIS license fees—built on open spatial primitives.',
      ]
    },
    {
      title: 'OPERATIONAL FEASIBILITY',
      points: [
        'Seamlessly slots into District Disaster Management Authority (DDMA) EOC protocols.',
        'Enforces Human-in-the-Loop review: Incident Commanders retain total authority.',
        'Generates statutory Situation Reports (SitReps) matching NDMA standards.',
      ]
    },
    {
      title: 'FINANCIAL & COST FEASIBILITY',
      points: [
        'Software-first approach requires zero new heavy sensor procurement.',
        'Scales elastically with standard district IT budgets.',
        'Dramatically curtails equipment loss and relief misallocation expenses.',
      ]
    }
  ];

  const roadmapPhases = [
    {
      phase: 'PHASE 1',
      title: 'SIH PROTOTYPE (CURRENT)',
      timeline: 'Q1 2026',
      status: 'COMPLETED & FUNCTIONAL',
      desc: 'Multi-factor priority scoring engine, 3D Digital Twin, interactive What-If simulator, and automated 90-second guided evaluation demo.',
    },
    {
      phase: 'PHASE 2',
      title: 'DISTRICT EOC PILOT',
      timeline: 'Q3 2026',
      status: 'PROPOSED',
      desc: 'Deployment in a flood-prone district (e.g., Cachar or Mandakini Basin) connecting live IMD API feeds and verified ward registries.',
    },
    {
      phase: 'PHASE 3',
      title: 'DISTRICT SCALE ROLLOUT',
      timeline: 'Q1 2027',
      status: 'PLANNED',
      desc: 'Simultaneous multi-basin coordination, live GPS tracking of NDRF/SDRF vehicles, and automated SMS broadcast generation.',
    },
    {
      phase: 'PHASE 4',
      title: 'STATE EOC INTEGRATION',
      timeline: 'Q4 2027',
      status: 'FUTURE VISION',
      desc: 'Cross-district mutual aid resource pooling and upstream dam discharge predictive flood forecasting across state boundaries.',
    },
    {
      phase: 'PHASE 5',
      title: 'NATIONAL NDMA INTELLIGENCE GRID',
      timeline: '2028+',
      status: 'NATIONAL HORIZON',
      desc: 'Pan-India multi-hazard digital twin connecting all 700+ district EOCs to the National Emergency Operations Centre (NEOC).',
    }
  ];

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-3 shadow-glow-cyan">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>VIABILITY & HORIZON STRATEGY</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase mb-4">
          FEASIBILITY & 5-PHASE ROADMAP
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Engineered for realistic institutional adoption by District Disaster Management Authorities with minimal capital expenditure and zero proprietary software dependencies.
        </p>
      </div>

      {/* 4 Feasibility Pillars */}
      <div>
        <h3 className="font-mono font-bold text-sm text-cyan-400 uppercase tracking-wider mb-4 text-center">
          INSTITUTIONAL FEASIBILITY ASSESSMENT
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {feasibilityPillars.map((pillar, idx) => (
            <div key={idx} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
              <h4 className="font-mono font-bold text-sm text-white uppercase border-b border-slate-800 pb-2">
                {pillar.title}
              </h4>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                {pillar.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Phase Futuristic Roadmap */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-cyan-500/40 shadow-glow-cyan space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              DEPLOYMENT TRAJECTORY
            </span>
            <h3 className="font-display font-extrabold text-2xl text-white uppercase">
              FIVE-PHASE SCALE ROADMAP
            </h3>
          </div>
          <span className="px-3 py-1 rounded bg-cyan-950 border border-cyan-500 text-cyan-300 font-mono text-xs font-bold">
            2026 - 2028+
          </span>
        </div>

        <div className="space-y-4">
          {roadmapPhases.map((rp, idx) => {
            const isCurrent = idx === 0;

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isCurrent
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-glow-cyan'
                    : 'bg-slate-950/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className={`p-2.5 rounded-xl font-mono font-bold text-xs flex-shrink-0 text-center w-20 ${
                    isCurrent ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-700'
                  }`}>
                    {rp.phase}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{rp.title}</h4>
                      <span className="text-[10px] font-mono text-slate-500">({rp.timeline})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
                      {rp.desc}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold whitespace-nowrap flex-shrink-0 ${
                  isCurrent
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border border-slate-800 text-slate-500'
                }`}>
                  {rp.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
