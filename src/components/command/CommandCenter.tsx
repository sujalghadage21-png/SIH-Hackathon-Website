import React, { useState } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { TacticalGISMap } from './TacticalGISMap';
import { DigitalTwinScene } from '../3d/DigitalTwinScene';
import { HabitationProfile } from './HabitationProfile';
import { 
  ShieldAlert, 
  Map, 
  Radio, 
  Clock, 
  Sliders, 
  AlertCircle, 
  CheckCircle,
  FileText,
  Building,
  Truck
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const {
    habitations,
    selectedHabitationId,
    setSelectedHabitationId,
    isR17Blocked,
    isS4Overloaded,
    activeScenario,
    setActiveTab,
    exportSitRep
  } = useDisaster();

  // Switch between 2D GIS Map and 3D Digital Twin inside Command Center
  const [mapMode, setMapMode] = useState<'GIS' | '3D'>('GIS');

  return (
    <div className="w-full py-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-4">
      {/* Top EOC Command Telemetry Banner */}
      <div className="p-4 rounded-2xl glass-panel border border-tactical-border/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-700/80 text-red-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>DISASTER MODE: {activeScenario.name.toUpperCase()}</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            RISK LEVEL: <strong className="text-red-400">CRITICAL</strong>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            AI CONFIDENCE: <strong className="text-cyan-400">94%</strong>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            LAST UPDATE: <span className="text-emerald-400 font-bold">LIVE SIMULATION</span>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2">
          {/* 2D / 3D Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setMapMode('GIS')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                mapMode === 'GIS' ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>2D GIS</span>
            </button>
            <button
              onClick={() => setMapMode('3D')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                mapMode === '3D' ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>3D TWIN</span>
            </button>
          </div>

          <button
            onClick={() => setActiveTab('WHAT_IF')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30 transition-all shadow-glow-amber"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>WHAT-IF</span>
          </button>
        </div>
      </div>

      {/* Main Command Split: Map (65%) vs Habitation Inspector (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Map Viewer */}
        <div className="lg:col-span-8 space-y-3">
          <div className="w-full">
            {mapMode === 'GIS' ? (
              <TacticalGISMap />
            ) : (
              <div className="w-full h-[620px] rounded-2xl glass-panel border border-tactical-border/80 overflow-hidden relative">
                <DigitalTwinScene interactive={true} cameraDistance={140} height="100%" showLayerToggles={true} />
              </div>
            )}
          </div>

          {/* Habitation Quick Selector Carousel */}
          <div className="p-3 rounded-xl glass-panel">
            <div className="text-[11px] font-mono text-slate-400 uppercase font-bold mb-2 flex items-center justify-between">
              <span>PRIORITIZED HABITATIONS QUEUE</span>
              <span>CLICK TO FOCUS PROFILE</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {habitations.map(hab => {
                const isSelected = hab.id === selectedHabitationId;
                const isRed = hab.riskCategory === 'RED';
                const isOrange = hab.riskCategory === 'ORANGE';

                return (
                  <button
                    key={hab.id}
                    onClick={() => setSelectedHabitationId(hab.id)}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl text-left font-mono transition-all border ${
                      isSelected
                        ? 'bg-cyan-950/90 border-cyan-400 shadow-glow-cyan'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-slate-200">{hab.code}</span>
                      <span className={`text-[10px] font-bold px-1 rounded ${
                        isRed ? 'bg-red-950 text-red-400' : (isOrange ? 'bg-orange-950 text-orange-400' : 'bg-emerald-950 text-emerald-400')
                      }`}>
                        #{hab.priorityRank}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[110px]">{hab.name}</div>
                    <div className="text-[11px] font-bold text-red-400 mt-0.5">{hab.finalPriorityScore}/100</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: AI Decision Panel & Habitation Profile */}
        <div className="lg:col-span-4">
          <HabitationProfile />
        </div>
      </div>
    </div>
  );
};
