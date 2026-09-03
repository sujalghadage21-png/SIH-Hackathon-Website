import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { DigitalTwinScene } from '../3d/DigitalTwinScene';
import { 
  ShieldAlert, 
  ArrowRight, 
  Play, 
  Sliders, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  Truck
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { 
    setActiveTab, 
    startDemo, 
    habitations, 
    shelters, 
    topPriorityHabitation, 
    isR17Blocked 
  } = useDisaster();

  const redZonesCount = habitations.filter(h => h.riskCategory === 'RED').length;
  const totalVulnerableCount = habitations.reduce(
    (sum, h) => sum + h.vulnerablePop.elderly + h.vulnerablePop.children + h.vulnerablePop.disabilities, 
    0
  );

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-center overflow-hidden pt-6 pb-12">
      {/* Background 3D Digital Twin with Gradient Vignette */}
      <div className="absolute inset-0 z-0 opacity-45 pointer-events-auto">
        <DigitalTwinScene interactive={true} cameraDistance={155} height="100%" />
      </div>

      {/* Cyber-Tactical Grid Vignette Overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-tactical-bg via-tactical-bg/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-tactical-bg via-transparent to-tactical-bg pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 font-mono text-xs shadow-glow-cyan backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>SMART INDIA HACKATHON 2026 • SIH26191</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 font-mono text-xs backdrop-blur-md">
            <span>TEAM RESILIX</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">DISASTER DECISION SUPPORT</span>
          </div>
        </div>

        {/* Cinematic Hero Headlines */}
        <div className="max-w-3xl">
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-none tracking-tight text-white mb-6 uppercase">
            WHEN DISASTER CHANGES, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-red-400">
              THE PLAN MUST CHANGE FASTER.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl">
            <strong className="text-cyan-300 font-semibold">RESCUE-ZONE AI</strong> transforms real-time disaster conditions, population vulnerability, road accessibility and shelter capacity into actionable rescue priorities.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={() => setActiveTab('COMMAND')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-mono text-sm font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-glow-cyan transform hover:-translate-y-0.5"
            >
              <span>ENTER COMMAND CENTER</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={startDemo}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-mono text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 transition-all shadow-glow-orange transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START 90-SEC DEMO</span>
            </button>

            <button
              onClick={() => setActiveTab('WHAT_IF')}
              className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-mono text-sm font-semibold bg-slate-900/90 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 transition-all backdrop-blur-md"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>WHAT-IF SIMULATOR</span>
            </button>
          </div>
        </div>

        {/* Live-Looking Status Telemetry Grid (Illustrative Sample Values) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl glass-panel text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>SYSTEM STATUS</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-emerald-400 font-bold text-sm">ONLINE</div>
            <div className="text-[10px] text-slate-400">DDMA Grid Active</div>
          </div>

          <div className="p-3.5 rounded-xl glass-panel text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>AI ENGINE</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-cyan-400 font-bold text-sm">ACTIVE v2.4</div>
            <div className="text-[10px] text-slate-400">Deterministic MCDM</div>
          </div>

          <div className="p-3.5 rounded-xl glass-panel text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>ACTIVE RED ZONES</span>
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="text-red-400 font-bold text-sm">{redZonesCount} HABITATIONS</div>
            <div className="text-[10px] text-slate-400">Immediate Relocation</div>
          </div>

          <div className="p-3.5 rounded-xl glass-panel text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>VULNERABLE POP</span>
              <span className="text-amber-400 font-bold">TOTAL</span>
            </div>
            <div className="text-amber-300 font-bold text-sm">{totalVulnerableCount.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400">Elderly, Children, PwD</div>
          </div>

          <div className="p-3.5 rounded-xl glass-panel text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>SHELTERS</span>
              <Building className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-cyan-300 font-bold text-sm">{shelters.length} ACTIVE</div>
            <div className="text-[10px] text-slate-400">Carrying Cap Monitored</div>
          </div>

          <div className="p-3.5 rounded-xl glass-panel text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>RESPONSE ASSETS</span>
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-emerald-400 font-bold text-sm">8 UNITS</div>
            <div className="text-[10px] text-slate-400">NDRF / SDRF / Boats</div>
          </div>
        </div>

        {/* Tactical 3D Hint Banner */}
        <div className="mt-4 flex items-center justify-between px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Interactive 3D Digital Twin running live in background. Click and drag anywhere to orbit terrain.</span>
          </div>
          <button
            onClick={() => setActiveTab('TWIN')}
            className="text-cyan-400 hover:text-cyan-300 underline font-semibold"
          >
            Open Dedicated 3D Twin &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};
