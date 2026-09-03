import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { BeforeAfterSplit } from './BeforeAfterSplit';
import { 
  Sliders, 
  RotateCcw, 
  CloudRain, 
  Waves, 
  Car, 
  Building, 
  Flame, 
  Mountain, 
  Users,
  Sparkles,
  Play,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const {
    params,
    updateParams,
    resetToBaseline,
    topPriorityHabitation,
    isR17Blocked,
    isS4Overloaded,
    setActiveTab
  } = useDisaster();

  // Quick Preset Handlers for Judges
  const triggerCriticalFloodPreset = () => {
    updateParams({
      rainfallPct: 45,
      riverStage: 'DANGER',
      roadR17Blocked: true,
      shelterSurgePct: 30,
      vulnerableExposureMult: 1.5,
      landslideRisk: 'MODERATE'
    });
  };

  const triggerLandslidePreset = () => {
    updateParams({
      rainfallPct: 75,
      riverStage: 'WARNING',
      roadR17Blocked: false,
      landslideRisk: 'EXTREME',
      vulnerableExposureMult: 1.8
    });
  };

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header Deck */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-xs mb-3 shadow-glow-amber">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HERO DEMONSTRATION FEATURE</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase mb-4">
          WHAT IF THE DISASTER GETS WORSE?
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Move any slider below to stress-test the district in real time. The mathematical engine instantaneously recalculates spatial risk, identifies newly cut-off habitations, reroutes transit corridors, and reallocates rescue assets.
        </p>
      </div>

      {/* Quick Trigger Buttons for Evaluator */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={triggerCriticalFloodPreset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold bg-red-950 border border-red-500 text-red-300 hover:bg-red-900/60 transition-all shadow-glow-red"
        >
          <CloudRain className="w-4 h-4 text-red-400" />
          <span>TRIGGER CRITICAL FLOOD (+45% RAIN + R17 BLOCKED)</span>
        </button>

        <button
          onClick={triggerLandslidePreset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold bg-amber-950 border border-amber-500 text-amber-300 hover:bg-amber-900/60 transition-all shadow-glow-amber"
        >
          <Mountain className="w-4 h-4 text-amber-400" />
          <span>TRIGGER LANDSLIDE SPIKE (EXTREME SLOPE HAZARD)</span>
        </button>

        <button
          onClick={resetToBaseline}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RESET TO BASELINE</span>
        </button>
      </div>

      {/* Interactive Controls Deck */}
      <div className="p-6 rounded-2xl glass-panel border border-tactical-border/80">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Slider 1: Rainfall (0% to +100%) */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <CloudRain className="w-4 h-4" />
                <span>PRECIPITATION SURGE</span>
              </span>
              <span className="text-white font-bold text-sm">+{params.rainfallPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={params.rainfallPct}
              onChange={e => updateParams({ rainfallPct: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0% Baseline</span>
              <span>+40% Threshold</span>
              <span>+100% Catastrophic</span>
            </div>
          </div>

          {/* Control 2: River Hydrological Level */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                <Waves className="w-4 h-4" />
                <span>RIVER GAUGE STAGE</span>
              </span>
              <span className={`font-bold text-xs px-2 py-0.5 rounded ${
                params.riverStage === 'BREACH' ? 'bg-red-950 text-red-400 border border-red-800' :
                params.riverStage === 'DANGER' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                params.riverStage === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-slate-900 text-emerald-400'
              }`}>
                {params.riverStage}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
              {(['NORMAL', 'WARNING', 'DANGER', 'BREACH'] as const).map(stage => (
                <button
                  key={stage}
                  onClick={() => updateParams({ riverStage: stage })}
                  className={`py-1.5 rounded transition-all ${
                    params.riverStage === stage
                      ? 'bg-blue-600 text-white font-bold shadow-glow-blue'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              CWC Telemetry Gauge #04 (Mandakini)
            </div>
          </div>

          {/* Control 3: Road R17 Culvert Causeway Status */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Car className="w-4 h-4" />
                <span>ROAD R17 CULVERT</span>
              </span>
              <span className={isR17Blocked ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {isR17Blocked ? 'BLOCKED (>75cm)' : 'OPEN'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <button
                onClick={() => updateParams({ roadR17Blocked: false })}
                className={`py-1.5 rounded-lg border transition-all ${
                  !params.roadR17Blocked
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                OPEN / CLEAR
              </button>
              <button
                onClick={() => updateParams({ roadR17Blocked: true })}
                className={`py-1.5 rounded-lg border transition-all ${
                  params.roadR17Blocked
                    ? 'bg-red-950 border-red-500 text-red-300 font-bold shadow-glow-red'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                BREACHED / BLOCKED
              </button>
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Cuts off primary valley route B to Shelter S4
            </div>
          </div>

          {/* Slider 4: Shelter Surge Pressure (0% to +50%) */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Building className="w-4 h-4" />
                <span>SHELTER OCCUPANCY SURGE</span>
              </span>
              <span className="text-white font-bold text-sm">+{params.shelterSurgePct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={params.shelterSurgePct}
              onChange={e => updateParams({ shelterSurgePct: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0% Baseline</span>
              <span>+35% (S4 Overload Threshold)</span>
              <span>+50% Max</span>
            </div>
          </div>

          {/* Control 5: Landslide Risk Level */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Mountain className="w-4 h-4" />
                <span>SLOPE / LANDSLIDE RISK</span>
              </span>
              <span className="text-amber-400 font-bold text-xs">{params.landslideRisk}</span>
            </div>
            <div className="grid grid-cols-4 gap-1 font-mono text-[10px]">
              {(['LOW', 'MODERATE', 'HIGH', 'EXTREME'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => updateParams({ landslideRisk: lvl })}
                  className={`py-1.5 rounded transition-all ${
                    params.landslideRisk === lvl
                      ? 'bg-amber-600 text-slate-950 font-bold shadow-glow-amber'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Impacts Zone D Hillside Shanti Nagar
            </div>
          </div>

          {/* Slider 6: Vulnerability Exposure Multiplier */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-orange-400 font-bold">
                <Users className="w-4 h-4" />
                <span>VULNERABILITY WEIGHT MULT</span>
              </span>
              <span className="text-white font-bold text-sm">{params.vulnerableExposureMult.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.2"
              step="0.1"
              value={params.vulnerableExposureMult}
              onChange={e => updateParams({ vulnerableExposureMult: parseFloat(e.target.value) })}
              className="w-full accent-orange-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>1.0x Standard Census</span>
              <span>1.5x Night-Time Dense</span>
              <span>2.2x Max Exposure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Before / After Comparative Split */}
      <BeforeAfterSplit />

      {/* Jump to Command Center to view live changes on map */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-display font-bold text-lg text-white uppercase">
            WANT TO SEE THESE CHANGES VISUALLY ON THE GIS MAP?
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            The command center shows glowing red zones, the blocked causeway at R17, and Route D illuminated in green.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('COMMAND')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-glow-cyan flex-shrink-0"
        >
          <span>VIEW IN COMMAND CENTER</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
