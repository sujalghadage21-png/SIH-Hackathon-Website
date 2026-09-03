import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { 
  CloudRain, 
  Users, 
  Car, 
  Building, 
  Cpu, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle, 
  Route, 
  Truck,
  Sparkles
} from 'lucide-react';

export const CorePrioritizationFlow: React.FC = () => {
  const { topPriorityHabitation, isR17Blocked, isS4Overloaded } = useDisaster();

  return (
    <section className="w-full py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-tactical-border/60">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ALGORITHMIC ARCHITECTURE</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase mb-4">
          AI RESCUE PRIORITIZATION ENGINE
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          The engine fuses four non-linear real-time telemetry inputs into a singular, transparently weighted life-safety priority score that dictates physical resource dispatches.
        </p>
      </div>

      {/* Visual Mathematical Formula Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center mb-12">
        {/* Left: 4 Input Cards (5 cols on lg) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>INPUT TELEMETRY FEEDS</span>
            <span className="text-[10px] text-slate-400">Continuous Stream</span>
          </div>

          {/* Input 1: Hazard Intensity */}
          <div className="p-3.5 rounded-xl glass-panel-interactive border-l-4 border-l-red-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-red-400" />
                <span className="font-mono font-bold text-xs text-slate-200">1. HAZARD INTENSITY</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300">WEIGHT: 35%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Rainfall index, river telemetry stage, flash flood velocity & landslide slope index.
            </div>
          </div>

          {/* Input 2: Population Vulnerability */}
          <div className="p-3.5 rounded-xl glass-panel-interactive border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-400" />
                <span className="font-mono font-bold text-xs text-slate-200">2. POPULATION VULNERABILITY</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-950 text-orange-300">WEIGHT: 30%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Elderly (&gt;65), infants (&lt;10), persons with disabilities (PwD) & dense slum housing.
            </div>
          </div>

          {/* Input 3: Accessibility */}
          <div className="p-3.5 rounded-xl glass-panel-interactive border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-400" />
                <span className="font-mono font-bold text-xs text-slate-200">3. ACCESSIBILITY RISK</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">WEIGHT: 15%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Road water depth, breached culverts (R17), bridge stability & transit delays.
            </div>
          </div>

          {/* Input 4: Shelter Capacity */}
          <div className="p-3.5 rounded-xl glass-panel-interactive border-l-4 border-l-cyan-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-400" />
                <span className="font-mono font-bold text-xs text-slate-200">4. SHELTER PRESSURE</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">WEIGHT: 20%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Live occupancy %, remaining beds, medical bay support & distance matrix.
            </div>
          </div>
        </div>

        {/* Center: Glowing AI Engine Node (3 cols on lg) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-6 text-center">
          <div className="relative w-28 h-28 rounded-full bg-cyan-950 border-2 border-cyan-400 flex flex-col items-center justify-center shadow-glow-cyan animate-pulse">
            <div className="absolute inset-1 rounded-full border border-dashed border-cyan-300/40 animate-spin" style={{ animationDuration: '15s' }} />
            <Cpu className="w-8 h-8 text-cyan-300 mb-1" />
            <span className="font-mono font-extrabold text-[11px] text-white tracking-widest">AI CORE</span>
            <span className="font-mono text-[9px] text-cyan-400">MCDM / AHP</span>
          </div>

          <div className="mt-4 text-xs font-mono text-cyan-300 font-semibold tracking-wider">
            PRIORITIZATION ENGINE
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
            Latency &lt; 15 ms • Deterministic
          </div>

          <div className="mt-3 flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-700/60">
            <CheckCircle className="w-3 h-3" />
            <span>Human-in-the-Loop Verified</span>
          </div>
        </div>

        {/* Right: 4 Output Decision Cards (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>ACTIONABLE DECISION OUTPUTS</span>
            <span className="text-[10px] text-slate-400">Dispatched to EOC</span>
          </div>

          {/* Output 1: Zone Priority */}
          <div className="p-3.5 rounded-xl glass-panel border border-red-500/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400 font-semibold">1. ZONE PRIORITY</span>
              <span className="px-2 py-0.5 rounded bg-red-950 border border-red-500 text-red-400 font-mono font-bold text-xs">
                RANK #{topPriorityHabitation?.priorityRank} • {topPriorityHabitation?.code}
              </span>
            </div>
            <div className="font-bold text-sm text-slate-200 mt-1">
              {topPriorityHabitation?.name}
            </div>
            <div className="text-[11px] text-red-300 mt-0.5">
              Priority Score: {topPriorityHabitation?.finalPriorityScore}/100 (CRITICAL RED ZONE)
            </div>
          </div>

          {/* Output 2: Rescue Team */}
          <div className="p-3.5 rounded-xl glass-panel border border-cyan-500/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400 font-semibold">2. RESCUE ASSET</span>
              <Truck className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="font-bold text-sm text-cyan-300 mt-1">
              {topPriorityHabitation?.assignedUnit}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Equipped with shallow-draft IRBs & emergency medical triage kits.
            </div>
          </div>

          {/* Output 3: Shelter */}
          <div className="p-3.5 rounded-xl glass-panel border border-cyan-500/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400 font-semibold">3. ASSIGNED SAFE SHELTER</span>
              <Building className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="font-bold text-sm text-slate-200 mt-1">
              {topPriorityHabitation?.calculatedShelterId === 's6' 
                ? 'SHELTER S6 (Central Apex Safe Haven)' 
                : 'SHELTER S4 (Govt Polytech Campus)'}
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">
              {topPriorityHabitation?.calculatedShelterId === 's6' 
                ? 'Automated overflow divert active (Buffer: 780 beds)' 
                : 'Primary shelter capacity adequate'}
            </div>
          </div>

          {/* Output 4: Evacuation Route */}
          <div className="p-3.5 rounded-xl glass-panel border border-emerald-500/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400 font-semibold">4. OPTIMAL EVACUATION CORRIDOR</span>
              <Route className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="font-bold text-sm text-emerald-300 mt-1">
              {topPriorityHabitation?.calculatedRouteId === 'route-d'
                ? 'ROUTE D (Ridge Corridor Elevated Bypass)'
                : 'ROUTE B (Direct Culvert Link)'}
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              {isR17Blocked ? 'Bypasses inundated culvert at R17; zero water hazard' : 'Direct arterial operational'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
