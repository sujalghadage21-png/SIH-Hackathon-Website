import React from 'react';
import { useDisaster, ActiveTab } from '../../context/DisasterContext';
import { 
  BarChart3, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Compass, 
  Sliders, 
  Cpu, 
  Building, 
  Route, 
  Truck, 
  Users, 
  TrendingUp, 
  Layers
} from 'lucide-react';

export const JudgeModeHUD: React.FC = () => {
  const { isJudgeModeOpen, toggleJudgeMode, setActiveTab } = useDisaster();

  if (!isJudgeModeOpen) return null;

  const rubricPoints: {
    number: number;
    title: string;
    rubricTag: string;
    tab: ActiveTab;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      number: 1,
      title: 'The Problem: Static Maps vs Dynamic AI',
      rubricTag: 'PROBLEM UNDERSTANDING',
      tab: 'LANDING',
      desc: 'Demonstrates why traditional 3-year flood maps fail in cloudburst crises.',
      icon: <Compass className="w-4 h-4 text-cyan-400" />
    },
    {
      number: 2,
      title: 'Deterministic AI Prioritization Engine',
      rubricTag: 'ALGORITHMIC RIGOR',
      tab: 'LANDING',
      desc: 'Hazard (35%) + Vulnerability (30%) + Exposure (20%) + Access (15%) = Priority.',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />
    },
    {
      number: 3,
      title: 'Interactive GIS & 3D Digital Twin',
      rubricTag: 'SPATIAL VISUALIZATION',
      tab: 'COMMAND',
      desc: 'Synchronized WebGL 3D terrain elevation and 2D GIS isochrones.',
      icon: <Layers className="w-4 h-4 text-cyan-400" />
    },
    {
      number: 4,
      title: 'Hero "What-If" Disaster Simulator',
      rubricTag: 'CORE INNOVATION',
      tab: 'WHAT_IF',
      desc: 'Change rainfall +40% & watch Zone C jump to #1 while R17 blocks in real time.',
      icon: <Sliders className="w-4 h-4 text-amber-400" />
    },
    {
      number: 5,
      title: 'AI Resource Allocation & Gap Analysis',
      rubricTag: 'OPERATIONAL VALUE',
      tab: 'RESOURCES',
      desc: 'Deficit analysis for boats, teams, and ambulances with optimal dispatching.',
      icon: <Truck className="w-4 h-4 text-cyan-400" />
    },
    {
      number: 6,
      title: 'Shelter Carrying Capacity & Overflow Divert',
      rubricTag: 'LOGISTICAL SAFETY',
      tab: 'SHELTERS',
      desc: 'Automated 90% threshold guard that reroutes evacuees to Apex Shelter S6.',
      icon: <Building className="w-4 h-4 text-cyan-400" />
    },
    {
      number: 7,
      title: 'Evacuation Route Optimization',
      rubricTag: 'GRAPH ROUTING',
      tab: 'ROUTES',
      desc: 'Dynamic bypass via Route D avoiding flooded culverts at R17.',
      icon: <Route className="w-4 h-4 text-emerald-400" />
    },
    {
      number: 8,
      title: 'Transparent AI Explainability',
      rubricTag: 'AI ETHICS & TRUST',
      tab: 'COMMAND',
      desc: 'Deconstructs exact scoring attribution for "Why Zone C is #1".',
      icon: <CheckCircle2 className="w-4 h-4 text-cyan-400" />
    },
    {
      number: 9,
      title: 'Quantifiable Impact Dashboard',
      rubricTag: 'BENCHMARK METRICS',
      tab: 'IMPACT',
      desc: 'Simulated 68% response speedup and 100% shelter overload prevention.',
      icon: <TrendingUp className="w-4 h-4 text-cyan-400" />
    },
    {
      number: 10,
      title: '5-Phase Scalability & Institutional Roadmap',
      rubricTag: 'NATIONAL SCALE',
      tab: 'ARCHITECTURE',
      desc: 'From SIH prototype to district pilots and pan-India NDMA NEOC grid.',
      icon: <Award className="w-4 h-4 text-cyan-400" />
    },
  ];

  const handleJump = (tab: ActiveTab) => {
    setActiveTab(tab);
    toggleJudgeMode();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl glass-panel border-2 border-cyan-500 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-950 border border-cyan-500 text-cyan-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                SMART INDIA HACKATHON 2026 &bull; EVALUATOR QUICK-JUMP
              </span>
              <h3 className="font-display font-extrabold text-2xl text-white">
                JUDGE MODE & CRITERIA NAVIGATOR
              </h3>
            </div>
          </div>
          <button
            onClick={toggleJudgeMode}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 font-mono leading-relaxed">
          Evaluate all 10 core SIH criteria in 2–3 minutes. Click any row below to immediately jump to that interactive functional component:
        </p>

        {/* 10 Criteria Rows */}
        <div className="space-y-2.5">
          {rubricPoints.map(point => (
            <button
              key={point.number}
              onClick={() => handleJump(point.tab)}
              className="w-full text-left p-3.5 rounded-xl glass-panel-interactive border border-slate-800 hover:border-cyan-500/60 flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                  {point.number}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {point.title}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 uppercase">
                      {point.rubricTag}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{point.desc}</div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-mono text-cyan-400 flex-shrink-0">
                <span>INSPECT</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
