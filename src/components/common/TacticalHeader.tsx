import React from 'react';
import { useDisaster, ActiveTab } from '../../context/DisasterContext';
import {
  ShieldAlert,
  Radio,
  Sliders,
  Compass,
  Building2,
  Route as RouteIcon,
  Truck,
  Users,
  Cpu,
  BarChart3,
  Layers,
  Volume2,
  VolumeX,
  Play,
  FileText,
  HelpCircle,
  Clock,
  Sun,
  Moon
} from 'lucide-react';

export const TacticalHeader: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    isMuted,
    toggleMute,
    startDemo,
    isDemoRunning,
    toggleJudgeMode,
    exportSitRep,
    isR17Blocked,
    isS4Overloaded,
    topPriorityHabitation,
  } = useDisaster();

  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'LANDING', label: 'Overview', icon: <Compass className="w-3.5 h-3.5" /> },
    { tab: 'COMMAND', label: 'Command Center', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { tab: 'WHAT_IF', label: 'What-If Simulator', icon: <Sliders className="w-3.5 h-3.5" /> },
    { tab: 'TWIN', label: '3D Digital Twin', icon: <Radio className="w-3.5 h-3.5" /> },
    { tab: 'SHELTERS', label: 'Shelters', icon: <Building2 className="w-3.5 h-3.5" /> },
    { tab: 'ROUTES', label: 'Evacuation Routes', icon: <RouteIcon className="w-3.5 h-3.5" /> },
    { tab: 'RESOURCES', label: 'Resources', icon: <Truck className="w-3.5 h-3.5" /> },
    { tab: 'DEMOGRAPHICS', label: 'Vulnerability', icon: <Users className="w-3.5 h-3.5" /> },
    { tab: 'ARCHITECTURE', label: 'Architecture', icon: <Cpu className="w-3.5 h-3.5" /> },
    { tab: 'TIMELINE', label: 'Live Timeline', icon: <Clock className="w-3.5 h-3.5" /> },
    { tab: 'SCENARIOS', label: 'Scenarios', icon: <Layers className="w-3.5 h-3.5" /> },
    { tab: 'IMPACT', label: 'Impact & ROI', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { tab: 'TEAM', label: 'Team RESILIX', icon: <HelpCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-tactical-border/80 bg-tactical-bg/95 backdrop-blur-md">
      {/* Top Telemetry Status Bar */}
      <div className="w-full bg-tactical-surface/90 border-b border-tactical-border/50 px-4 py-1 text-[11px] font-mono flex items-center justify-between text-slate-400 overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-bold">SYSTEM: ONLINE</span>
          </div>

          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">AI ENGINE: ACTIVE (PROTOTYPE v2.4)</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">GIS: BHUVAN / OSM SYNCED</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">WEATHER: IMD MONITORING</span>
          <span className="text-slate-600">|</span>
          <span className={isS4Overloaded ? 'text-amber-400 font-bold animate-pulse' : 'text-slate-300'}>
            SHELTERS: 6 ACTIVE {isS4Overloaded && '(S4 CRITICAL)'}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">RESPONSE UNITS: 8 DEPLOYED</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-red-950/50 border border-red-800/80 px-2 py-0.5 rounded text-red-400 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
            TOP RISK: {topPriorityHabitation?.code} ({topPriorityHabitation?.finalPriorityScore}/100)
          </div>
          {isR17Blocked && (
            <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-600/80 px-2 py-0.5 rounded text-amber-300 font-semibold animate-pulse">
              ROAD R17: BLOCKED
            </div>
          )}
          <span className="text-slate-600">|</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
            theme === 'dark' 
              ? 'bg-amber-950/50 text-amber-300 border border-amber-800/60' 
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}>
            {theme === 'dark' ? 'DARK HUD' : 'LIGHT HUD'}
          </span>
          <span className="text-cyan-400/80">SIH 2026 • SIH26191</span>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Theme */}
        <div 
          onClick={() => setActiveTab('LANDING')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded-lg bg-slate-900 border border-cyan-500/50 flex items-center justify-center shadow-glow-cyan overflow-hidden group-hover:border-cyan-400 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-red-500/20" />
            <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg tracking-wider text-slate-100 group-hover:text-cyan-300 transition-colors">
                RESCUE-ZONE <span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-300">
                DDMA
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 tracking-tight">
              TEAM RESILIX • DISASTER DECISION PLATFORM
            </div>
          </div>
        </div>

        {/* Action Controls: Guided Demo, Judge Mode, SitRep, Theme Toggle, Mute */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* 90-Second Guided Demo Button */}
          <button
            onClick={startDemo}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all shadow-md ${
              isDemoRunning
                ? 'bg-amber-500 text-slate-950 shadow-glow-amber animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 hover:shadow-glow-orange'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isDemoRunning ? 'DEMO IN PROGRESS' : '90-SEC DEMO'}</span>
          </button>

          {/* Judge Mode Button */}
          <button
            onClick={toggleJudgeMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 transition-all"
            title="Press 'J' to toggle Judge Quick-Evaluation HUD"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">JUDGE MODE</span>
          </button>

          {/* SITREP PDF Export */}
          <button
            onClick={exportSitRep}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-mono text-xs text-slate-300 bg-slate-900 border border-slate-700 hover:border-slate-500 hover:text-white transition-all"
            title="Generate Official DDMA Situation Report"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>SITREP</span>
          </button>

          {/* Light / Dark Mode Toggle Icon */}
          <button
            onClick={toggleTheme}
            id="theme-mode-toggle"
            className={`p-2 rounded-lg border transition-all duration-300 flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-slate-700/80 text-amber-400 hover:text-amber-300 hover:border-amber-400/80 hover:shadow-glow-amber'
                : 'bg-amber-50 border-amber-300 text-amber-600 hover:text-amber-800 hover:border-amber-400 shadow-sm'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode (Press T)' : 'Switch to Dark Mode (Press T)'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 transition-transform hover:rotate-90 duration-300" />
            ) : (
              <Moon className="w-4 h-4 transition-transform hover:-rotate-45 duration-300" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg border transition-colors ${
              !isMuted 
                ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-glow-cyan' 
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={isMuted ? 'Unmute tactical audio feedback (M)' : 'Mute audio (M)'}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Enter Command Center CTA */}
          <button
            onClick={() => setActiveTab('COMMAND')}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
              activeTab === 'COMMAND'
                ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30'
            }`}
          >
            COMMAND CENTER
          </button>
        </div>
      </div>

      {/* Navigation Tabs Horizontal Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto scrollbar-none py-1 text-xs font-mono">
        {navItems.map(item => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/60 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.tab === 'WHAT_IF' && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
