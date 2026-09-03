import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  X, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

export const GuidedDemoOverlay: React.FC = () => {
  const {
    isDemoRunning,
    demoStep,
    demoPlaying,
    pauseDemo,
    resumeDemo,
    nextDemoStep,
    prevDemoStep,
    restartDemo,
    stopDemo,
  } = useDisaster();

  if (!isDemoRunning) return null;

  const demoStepsInfo = [
    {
      step: 1,
      title: 'NORMAL CONDITIONS (BASELINE)',
      desc: 'Normal weather baseline. All 6 shelters operating under 65% capacity. Road causeway R17 is completely dry and passable. Zone C is ranked #3.',
      cue: 'Notice the baseline risk level across the river valley.',
    },
    {
      step: 2,
      title: 'HEAVY RAINFALL DETECTED',
      desc: 'IMD Doppler Radar alerts severe convective storm (+35% precipitation). River stage crosses Warning Stage. Catchment runoff accelerates.',
      cue: 'Rainfall telemetry streams into the central engine.',
    },
    {
      step: 3,
      title: 'RISK MAP ESCALATES',
      desc: 'The mathematical scoring model begins elevating threat indices for habitations below 20m elevation. Low-lying slum clusters are highlighted.',
      cue: 'Dynamic isochrone polygons expand in the valley.',
    },
    {
      step: 4,
      title: 'ZONE C BECOMES CRITICAL (#1)',
      desc: 'Lower Valley Ward 7 (Zone C) escalates to PRIORITY #1 RED ZONE (Score: 96/100) due to 1,232 vulnerable elders, infants and PwD residents.',
      cue: 'Zone C turns pulsing red with Immediate Urgency.',
    },
    {
      step: 5,
      title: 'ROAD R17 CULVERT BREACHED & BLOCKED',
      desc: 'Culvert causeway R17 water depth crosses 75 cm, submerging vehicles. Primary arterial link to Shelter S4 is declared IMPASSABLE.',
      cue: 'Road R17 illuminates red with BLOCKED status.',
    },
    {
      step: 6,
      title: 'AI RECALCULATES PRIORITIES',
      desc: 'AI Prioritization Engine recalculates accessibility penalties, factoring in the road severance without human manual delay (<15ms).',
      cue: 'Recalculation banner flashes across the EOC.',
    },
    {
      step: 7,
      title: 'RESCUE TEAM 3 REASSIGNED',
      desc: 'SDRF Alpha 3 unit is immediately reassigned from standby to Zone C with 6x Inflatable Rescue Boats (IRBs) and emergency trauma kits.',
      cue: 'Unit assignment shifts in the decision drawer.',
    },
    {
      step: 8,
      title: 'SHELTER S4 OVERLOADED (94%)',
      desc: 'Shelter S4 capacity reaches 94% (470 / 500 beds). Automated carrying-capacity guard triggers an OVERFLOW warning to prevent secondary crisis.',
      cue: 'Shelter S4 gauge hits the red danger threshold.',
    },
    {
      step: 9,
      title: 'AI RECOMMENDS SHELTER S6 (APEX)',
      desc: 'System automatically diverts evacuee flow from overloaded S4 to Central Apex Safe Haven (S6), which possesses 820 available buffer beds.',
      cue: 'Assigned safe destination switches to S6.',
    },
    {
      step: 10,
      title: 'EVACUATION ROUTE SHIFTED TO ROUTE D',
      desc: 'Route B is marked UNSAFE. Engine activates Route D (Ridge Corridor Elevated Bypass), guaranteeing zero flood water exposure.',
      cue: 'Green bypass Route D is illuminated on the map.',
    },
    {
      step: 11,
      title: 'IMMEDIATE EVACUATION ORDER EXECUTED',
      desc: 'Incident Commander signs and executes the prioritized operational dispatch packet. Life-saving relocation underway with total transparency.',
      cue: 'Order authorized and SitRep available for print.',
    }
  ];

  const currentInfo = demoStepsInfo[demoStep - 1] || demoStepsInfo[0];
  const progressPct = ((demoStep - 1) / 10) * 100;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-2xl animate-in slide-in-from-top-4 duration-300">
      <div className="p-5 rounded-2xl glass-panel border-2 border-amber-500 shadow-2xl bg-slate-950/95 backdrop-blur-xl space-y-3">
        {/* Top Progress & Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-500/60">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-mono text-xs font-bold text-amber-300 uppercase tracking-wider">
              90-SECOND GUIDED JUDGING TOUR
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-bold">
              STEP {demoStep} / 11
            </span>
            <button
              onClick={stopDemo}
              className="p-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
              title="Exit Demo Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 shadow-glow-orange"
            style={{ width: `${Math.max(5, progressPct)}%` }}
          />
        </div>

        {/* Current Step Content */}
        <div>
          <h4 className="font-display font-extrabold text-base sm:text-lg text-white uppercase tracking-tight">
            {currentInfo.title}
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {currentInfo.desc}
          </p>
          <div className="mt-2 text-[11px] font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>{currentInfo.cue}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-xs">
          <button
            onClick={restartDemo}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESTART</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={prevDemoStep}
              disabled={demoStep === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={demoPlaying ? pauseDemo : resumeDemo}
              className="px-4 py-1.5 rounded-xl font-bold bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-glow-amber hover:brightness-110"
            >
              {demoPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{demoPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={nextDemoStep}
              disabled={demoStep === 11}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <span className="text-[10px] text-slate-500 hidden sm:inline">
            PRESS [SPACE] TO PAUSE
          </span>
        </div>
      </div>
    </div>
  );
};
