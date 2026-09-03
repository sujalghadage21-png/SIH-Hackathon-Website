import React from 'react';
import { ShieldCheck, ExternalLink, Info } from 'lucide-react';

export const TacticalFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-tactical-border/80 bg-tactical-surface/90 backdrop-blur-md py-8 px-4 sm:px-6 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div>
          <div className="flex items-center gap-2 text-slate-200 font-display font-bold text-base mb-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>RESCUE-ZONE AI</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            AI-Powered Disaster Intelligence & Emergency Decision Platform for District Disaster Management Authorities. Intelligent identification of hazard-based red zones, carrying capacity assessment, and immediate relocation needs.
          </p>
          <div className="mt-3 text-[11px] font-mono text-cyan-400">
            Smart India Hackathon 2026 • Problem SIH26191
          </div>
        </div>

        <div>
          <div className="font-mono text-slate-200 uppercase tracking-wider font-bold mb-2">Team & Governance</div>
          <p className="text-[11px] text-slate-300 font-semibold mb-1">TEAM RESILIX</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Engineered with Human-in-the-Loop decision governance: "AI Recommends, Incident Authorities Decide." Compliant with NDMA Standard Operating Procedures.
          </p>
        </div>

        <div>
          <div className="font-mono text-slate-200 uppercase tracking-wider font-bold mb-2">Data & Standard Alignment</div>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
              <span>ISRO Bhuvan Geospatial Services (NRSC)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
              <span>NDMA Guidelines on Flood Management</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
              <span>OpenStreetMap Road Network Topology</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
              <span>Analytic Hierarchy Process (MCDM / AHP)</span>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-slate-200 uppercase tracking-wider font-bold mb-2">Prototype Notice</div>
          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>Illustrative Simulation</span>
            </div>
            Demonstration numbers, spatial contours, and telemetry values are deterministic synthetic test cases modeled for hackathon evaluation.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono">
        <div>
          © 2026 RESCUE-ZONE AI • Developed by <strong className="text-cyan-400">Team RESILIX</strong> for Smart India Hackathon 2026.
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>LATENCY: 12ms</span>
          <span>•</span>
          <span>WebGL 2.0 3D ENGINE</span>
          <span>•</span>
          <span>HUMAN-IN-THE-LOOP ACTIVE</span>
        </div>
      </div>
    </footer>
  );
};
