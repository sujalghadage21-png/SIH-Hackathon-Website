import React, { useState } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { DigitalTwinScene, CameraPreset } from '../3d/DigitalTwinScene';
import { 
  Radio, 
  Layers, 
  Maximize2, 
  RotateCcw, 
  Sliders, 
  Eye, 
  Compass, 
  Waves, 
  ShieldCheck, 
  Building,
  Navigation,
  Crosshair,
  Camera,
  AlertTriangle
} from 'lucide-react';

export const DigitalTwinView: React.FC = () => {
  const { params, updateParams, habitations, shelters, isR17Blocked, isS4Overloaded } = useDisaster();
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('DEFAULT');

  const cameraButtons: { id: CameraPreset; label: string; icon: string; desc: string }[] = [
    { id: 'DEFAULT', label: 'EOC OVERVIEW', icon: '👁️', desc: 'Full river basin tactical overview' },
    { id: 'BRIDGE', label: 'SARAIGHAT BRIDGE', icon: '🌉', desc: 'Steel truss bridge & concrete river piers' },
    { id: 'BREACH', label: 'ZONE C BREACH', icon: '⚠️', desc: 'Embankment failure & submerged slum shanties' },
    { id: 'SHELTER_S6', label: 'HILLTOP SHELTER S6', icon: '⛰️', desc: 'Elevated multi-purpose shelter & helipad' },
    { id: 'DRONE', label: 'DRONE SEARCHLIGHT', icon: '🚁', desc: 'Active aerial search & rescue surveillance' },
  ];

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-2">
            <Radio className="w-3.5 h-3.5" />
            <span>BRAHMAPUTRA BASIN 3D PHYSICAL TWIN</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            DIGITAL TWIN OF THE DISASTER ZONE
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mt-1">
            Real-world 3D architectural recreation featuring the Saraighat River Bridge, riverside embankment levee cuts, informal slum settlements, high-ground cyclone shelters, and active NDRF rescue patrol boats.
          </p>
        </div>

        {/* Quick Water Flood Slider inside 3D View */}
        <div className="p-3 rounded-xl glass-panel border border-cyan-500/40 text-xs font-mono flex items-center gap-4">
          <div className="flex items-center gap-2 text-cyan-300">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span>FLOOD HEIGHT:</span>
            <strong className="text-white">+{params.rainfallPct}%</strong>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={params.rainfallPct}
            onChange={e => updateParams({ rainfallPct: parseInt(e.target.value) })}
            className="w-32 accent-cyan-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Camera Angle Presets Floating Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl glass-panel border border-tactical-border/80 font-mono text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-bold px-2">
          <Camera className="w-4 h-4" />
          <span>CINEMATIC CAMERA ANGLES:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {cameraButtons.map(btn => (
            <button
              key={btn.id}
              onClick={() => setCameraPreset(btn.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                cameraPreset === btn.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
              title={btn.desc}
            >
              <span>{btn.icon}</span>
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Full-Size 3D Canvas */}
      <div className="w-full h-[660px] rounded-3xl glass-panel border border-tactical-border/80 overflow-hidden relative shadow-2xl isolate">
        <DigitalTwinScene
          interactive={true}
          cameraDistance={135}
          height="100%"
          showLayerToggles={true}
          cameraPreset={cameraPreset}
        />

        {/* 3D Overlay Telemetry & Disaster Diagnostics Card */}
        <div className="absolute bottom-4 left-4 z-20 max-w-sm p-4 rounded-2xl glass-panel text-xs font-mono text-slate-300 space-y-2 pointer-events-none shadow-2xl border border-tactical-border">
          <div className="text-cyan-400 font-bold flex items-center justify-between border-b border-slate-700 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>DISASTER SITE TELEMETRY</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              GUWAHATI EOC
            </span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">River Basin:</span>
              <strong className="text-white">Brahmaputra Valley (S-Curve)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Saraighat Bridge:</span>
              <strong className="text-cyan-300">Operational (Pier Clr: +4.2m)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">R17 Embankment Cut:</span>
              <strong className={isR17Blocked ? 'text-red-400 font-bold animate-pulse' : 'text-emerald-400'}>
                {isR17Blocked ? 'ACTIVE SURGE BREACH (>75cm)' : 'FORTIFIED / CLEAR'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Shelter S4 (Town Hall):</span>
              <strong className={isS4Overloaded ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                {isS4Overloaded ? 'OVERLOADED (CRITICAL)' : 'OPERATIONAL'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Shelter S6 (Hilltop):</span>
              <strong className="text-emerald-400 font-bold">ACTIVE SAFE HAVEN (HELIPAD OK)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">NDRF Assets:</span>
              <strong className="text-orange-400">2 Motorized Boats • 1 SAR Drone</strong>
            </div>
          </div>
        </div>

        {/* Camera Preset Info Badge */}
        <div className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-xl glass-panel text-[11px] font-mono text-cyan-300 border border-cyan-500/40 pointer-events-none">
          CURRENT FOCUS: <strong className="text-white">{cameraButtons.find(b => b.id === cameraPreset)?.label}</strong>
        </div>
      </div>

      {/* Real Place Structures Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-2">
          <div className="font-bold text-cyan-400 flex items-center gap-1.5">
            <span>🌉</span>
            <span>SARAIGHAT RIVER BRIDGE</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Realistic steel lattice truss bridge with concrete river piers resting in the Brahmaputra riverbed, connecting north & south evacuation banks.
          </p>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-2">
          <div className="font-bold text-red-400 flex items-center gap-1.5">
            <span>⚠️</span>
            <span>R17 LEVEE BREACH CUT</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Eroded concrete retaining wall with broken rubble where rising river waters breach directly into Zone C informal settlements during flood stage.
          </p>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-2">
          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
            <span>⛰️</span>
            <span>HIGH-GROUND SHELTER S6</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Reinforced multi-story concrete cyclone/flood shelter on Nilachal hill ridge featuring an emergency rooftop helipad and AI safe evacuation corridor.
          </p>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-2">
          <div className="font-bold text-orange-400 flex items-center gap-1.5">
            <span>🚤</span>
            <span>NDRF DISASTER PATROL</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Live procedural orange rescue zodiac boats navigating river currents, accompanied by an aerial search & rescue drone with dynamic spotlight tracking.
          </p>
        </div>
      </div>
    </div>
  );
};
