import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { SCENARIO_PRESETS } from '../../data/scenarios';
import { 
  Layers, 
  Play, 
  MapPin, 
  CloudRain, 
  Mountain, 
  Flame, 
  Waves,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const ScenarioLibrary: React.FC = () => {
  const { activeScenario, loadScenario, setActiveTab } = useDisaster();

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case 'FLOOD': return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'LANDSLIDE': return <Mountain className="w-5 h-5 text-amber-400" />;
      case 'URBAN_FIRE': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'CYCLONE': return <Waves className="w-5 h-5 text-cyan-400" />;
      default: return <Layers className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleRunScenario = (id: string) => {
    loadScenario(id);
    setActiveTab('COMMAND');
  };

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>DISASTER SCENARIO PRESETS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            MULTI-HAZARD SCENARIO LIBRARY
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mt-1">
            Pre-configured incident environments testing hydrometeorological surges, slope destabilization, dense urban fires, and coastal storm tides.
          </p>
        </div>
      </div>

      {/* 4 Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SCENARIO_PRESETS.map(scenario => {
          const isActive = activeScenario.id === scenario.id;

          return (
            <div
              key={scenario.id}
              className={`p-6 rounded-2xl glass-panel border transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-cyan-400 shadow-glow-cyan bg-cyan-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      {getScenarioIcon(scenario.hazardType)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                        {scenario.badge}
                      </span>
                      <h3 className="font-bold text-lg text-white mt-1">
                        {scenario.name}
                      </h3>
                    </div>
                  </div>

                  {isActive && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{scenario.location}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {scenario.description}
                </p>

                {/* Scenario Parameter Snapshot */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono p-3 rounded-xl bg-slate-950/80 border border-slate-800 mb-6 text-slate-300">
                  <div>
                    <span className="text-slate-500 text-[9px] block">PRECIPITATION</span>
                    <strong>+{scenario.params.rainfallPct}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] block">RIVER STAGE</span>
                    <strong className="text-cyan-300">{scenario.params.riverStage}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] block">ROAD R17</span>
                    <strong className={scenario.params.roadR17Blocked ? 'text-red-400' : 'text-emerald-400'}>
                      {scenario.params.roadR17Blocked ? 'BLOCKED' : 'OPEN'}
                    </strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRunScenario(scenario.id)}
                className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                    : 'bg-slate-900 hover:bg-cyan-950/60 text-cyan-300 border border-cyan-500/40'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isActive ? 'CURRENTLY SIMULATING &bull; VIEW MAP' : 'RUN THIS SCENARIO'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
