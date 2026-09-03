import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  SimulationParameters,
  CalculatedHabitationState,
  CalculatedShelterState,
  RoadLink,
  EvacuationRoute,
  ResourceSummary,
  ScenarioPreset,
  TimelineEvent,
} from '../types/disaster';
import {
  INITIAL_HABITATIONS,
  INITIAL_SHELTERS,
  INITIAL_ROADS,
  INITIAL_ROUTES,
  INITIAL_TIMELINE
} from '../data/syntheticData';
import { SCENARIO_PRESETS } from '../data/scenarios';
import { calculateDisasterState } from '../utils/priorityEngine';
import { soundFx } from '../utils/audio';
import { exportSituationReport } from '../utils/pdfExport';
import { DisasterIntelEvent } from '../types/intel';
import { useLiveIntelFeed } from '../data/liveIntelSimulation';

export type ActiveTab = 
  | 'LANDING'
  | 'COMMAND'
  | 'TWIN'
  | 'WHAT_IF'
  | 'SHELTERS'
  | 'ROUTES'
  | 'RESOURCES'
  | 'DEMOGRAPHICS'
  | 'ARCHITECTURE'
  | 'TIMELINE'
  | 'IMPACT'
  | 'SCENARIOS'
  | 'TEAM';

export type DemographicFilter = 'ALL' | 'ELDERLY' | 'CHILDREN' | 'DISABILITY' | 'DENSITY';
export type ThemeMode = 'dark' | 'light';

interface DisasterContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  params: SimulationParameters;
  updateParams: (newParams: Partial<SimulationParameters>) => void;
  resetToBaseline: () => void;
  
  // Theme (Dark / Light Mode)
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  
  // Calculated reactive data
  habitations: CalculatedHabitationState[];
  shelters: CalculatedShelterState[];
  roads: RoadLink[];
  routes: EvacuationRoute[];
  resources: ResourceSummary[];
  isR17Blocked: boolean;
  isS4Overloaded: boolean;
  topPriorityHabitation: CalculatedHabitationState;
  
  // OSINT & Satellite Live Feed
  intelEvents: DisasterIntelEvent[];
  
  // Baseline data for Before/After split
  baselineState: ReturnType<typeof calculateDisasterState>;

  // Selection & UI
  selectedHabitationId: string | null;
  setSelectedHabitationId: (id: string | null) => void;
  selectedHabitation: CalculatedHabitationState | undefined;
  demographicFilter: DemographicFilter;
  setDemographicFilter: (filter: DemographicFilter) => void;
  
  // Scenario
  activeScenario: ScenarioPreset;
  loadScenario: (scenarioId: string) => void;

  // Timeline
  timeline: TimelineEvent[];
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;

  // Recalculation Alert Banner
  showRecalcBanner: boolean;
  recalcTriggerText: string;
  dismissRecalcBanner: () => void;

  // Sound
  isMuted: boolean;
  toggleMute: () => void;

  // Guided 90-second Demo
  isDemoRunning: boolean;
  demoStep: number;
  demoPlaying: boolean;
  startDemo: () => void;
  pauseDemo: () => void;
  resumeDemo: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  restartDemo: () => void;
  stopDemo: () => void;

  // Judge Mode HUD
  isJudgeModeOpen: boolean;
  toggleJudgeMode: () => void;

  // DDMA Approval / Order
  isOrderApproved: boolean;
  approveOrder: () => void;
  exportSitRep: () => void;
}

const BASELINE_PARAMS: SimulationParameters = {
  rainfallPct: 10,
  riverStage: 'NORMAL',
  roadR17Blocked: false,
  shelterSurgePct: 10,
  landslideRisk: 'LOW',
  vulnerableExposureMult: 1.0
};

const DisasterContext = createContext<DisasterContextType | undefined>(undefined);

export const DisasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('LANDING');
  const [params, setParams] = useState<SimulationParameters>(BASELINE_PARAMS);
  const [selectedHabitationId, setSelectedHabitationId] = useState<string | null>('zone-c');
  const [demographicFilter, setDemographicFilter] = useState<DemographicFilter>('ALL');
  const [activeScenario, setActiveScenario] = useState<ScenarioPreset>(SCENARIO_PRESETS[0]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(INITIAL_TIMELINE);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isOrderApproved, setIsOrderApproved] = useState<boolean>(false);
  const [isJudgeModeOpen, setIsJudgeModeOpen] = useState<boolean>(false);

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rescue_zone_theme') as ThemeMode | null;
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  // Simulated Live OSINT/Satellite Feed
  const { intelEvents } = useLiveIntelFeed(true);

  // Apply theme class to <html> element whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    localStorage.setItem('rescue_zone_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      return next;
    });
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  // Recalculation toast
  const [showRecalcBanner, setShowRecalcBanner] = useState<boolean>(false);
  const [recalcTriggerText, setRecalcTriggerText] = useState<string>('Dynamic Disaster Update');

  // Demo mode state
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);
  const [demoPlaying, setDemoPlaying] = useState<boolean>(false);

  // Calculate baseline once
  const baselineState = useMemo(() => {
    return calculateDisasterState(
      INITIAL_HABITATIONS,
      INITIAL_SHELTERS,
      INITIAL_ROADS,
      INITIAL_ROUTES,
      BASELINE_PARAMS
    );
  }, []);

  // Reactive state calculated from active parameters
  const currentState = useMemo(() => {
    return calculateDisasterState(
      INITIAL_HABITATIONS,
      INITIAL_SHELTERS,
      INITIAL_ROADS,
      INITIAL_ROUTES,
      params
    );
  }, [params]);

  const selectedHabitation = useMemo(() => {
    return currentState.habitations.find(h => h.id === selectedHabitationId) || currentState.habitations[0];
  }, [currentState.habitations, selectedHabitationId]);

  const updateParams = useCallback((newParams: Partial<SimulationParameters>) => {
    setParams(prev => {
      const updated = { ...prev, ...newParams };
      return updated;
    });

    // Sound effect & Recalculation banner
    soundFx.playRecalculate();
    setRecalcTriggerText('AI PRIORITIES RECALCULATED');
    setShowRecalcBanner(true);
  }, []);

  const resetToBaseline = useCallback(() => {
    setParams(BASELINE_PARAMS);
    soundFx.playBeep(440, 0.05);
  }, []);

  const toggleMute = useCallback(() => {
    const next = soundFx.toggleMute();
    setIsMuted(next);
  }, []);

  const toggleJudgeMode = useCallback(() => {
    setIsJudgeModeOpen(prev => !prev);
    soundFx.playBeep(720, 0.04);
  }, []);

  const approveOrder = useCallback(() => {
    setIsOrderApproved(true);
    soundFx.playSuccess();
  }, []);

  const exportSitRep = useCallback(() => {
    exportSituationReport(
      currentState.habitations,
      currentState.shelters,
      currentState.resources,
      params,
      activeScenario.name
    );
  }, [currentState, params, activeScenario]);

  const loadScenario = useCallback((scenarioId: string) => {
    const sc = SCENARIO_PRESETS.find(s => s.id === scenarioId);
    if (sc) {
      setActiveScenario(sc);
      setParams(sc.params);
      soundFx.playAlert();
      setRecalcTriggerText(`SCENARIO ACTIVATED: ${sc.name.toUpperCase()}`);
      setShowRecalcBanner(true);
    }
  }, []);

  const addTimelineEvent = useCallback((event: Omit<TimelineEvent, 'id'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: `t-${Date.now()}`
    };
    setTimeline(prev => [newEvent, ...prev]);
  }, []);

  const dismissRecalcBanner = useCallback(() => {
    setShowRecalcBanner(false);
  }, []);

  // 90-Second Guided Demo Logic
  const startDemo = useCallback(() => {
    setIsDemoRunning(true);
    setDemoStep(1);
    setDemoPlaying(true);
    setActiveTab('COMMAND');
    setParams(BASELINE_PARAMS);
    soundFx.playBeep(880, 0.1);
  }, []);

  const pauseDemo = useCallback(() => {
    setDemoPlaying(false);
  }, []);

  const resumeDemo = useCallback(() => {
    setDemoPlaying(true);
  }, []);

  const stopDemo = useCallback(() => {
    setIsDemoRunning(false);
    setDemoPlaying(false);
  }, []);

  const restartDemo = useCallback(() => {
    setDemoStep(1);
    setDemoPlaying(true);
    setParams(BASELINE_PARAMS);
  }, []);

  const applyDemoStepParams = useCallback((step: number) => {
    switch (step) {
      case 1:
        // Baseline Normal
        setParams(BASELINE_PARAMS);
        setSelectedHabitationId('zone-c');
        break;
      case 2:
        // Heavy Rainfall Alert
        setParams(prev => ({ ...prev, rainfallPct: 35, riverStage: 'WARNING' }));
        break;
      case 3:
        // Risk Map Changes
        setParams(prev => ({ ...prev, rainfallPct: 50, riverStage: 'DANGER' }));
        break;
      case 4:
        // Zone C Becomes Critical
        setParams(prev => ({ ...prev, rainfallPct: 65, riverStage: 'DANGER', vulnerableExposureMult: 1.4 }));
        setSelectedHabitationId('zone-c');
        soundFx.playAlert();
        break;
      case 5:
        // Road R17 Becomes Blocked
        setParams(prev => ({ ...prev, roadR17Blocked: true }));
        soundFx.playAlert();
        break;
      case 6:
        // AI Recalculates Priorities
        soundFx.playRecalculate();
        break;
      case 7:
        // Rescue Team 3 Reassigned
        setSelectedHabitationId('zone-c');
        break;
      case 8:
        // Shelter S4 Overloaded
        setParams(prev => ({ ...prev, shelterSurgePct: 35 }));
        break;
      case 9:
        // AI Recommends Shelter S6
        break;
      case 10:
        // Evacuation Route Changes to Route D
        break;
      case 11:
        // Final Command: Immediate Evacuation
        setIsOrderApproved(true);
        soundFx.playSuccess();
        break;
      default:
        break;
    }
  }, []);

  const nextDemoStep = useCallback(() => {
    setDemoStep(prev => {
      const next = Math.min(11, prev + 1);
      applyDemoStepParams(next);
      return next;
    });
  }, [applyDemoStepParams]);

  const prevDemoStep = useCallback(() => {
    setDemoStep(prev => {
      const prevStep = Math.max(1, prev - 1);
      applyDemoStepParams(prevStep);
      return prevStep;
    });
  }, [applyDemoStepParams]);

  // Demo auto-advance timer when playing
  useEffect(() => {
    let timer: number;
    if (isDemoRunning && demoPlaying) {
      timer = window.setTimeout(() => {
        if (demoStep < 11) {
          setDemoStep(prev => {
            const next = prev + 1;
            applyDemoStepParams(next);
            return next;
          });
        } else {
          setDemoPlaying(false);
        }
      }, 7000); // 7-8 seconds per step (~80-90 seconds total)
    }
    return () => clearTimeout(timer);
  }, [isDemoRunning, demoPlaying, demoStep, applyDemoStepParams]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ' && isDemoRunning) {
        e.preventDefault();
        setDemoPlaying(prev => !prev);
      } else if (e.key === 'j' || e.key === 'J') {
        toggleJudgeMode();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 't' || e.key === 'T') {
        toggleTheme();
      } else if (e.key === 'Escape' && isDemoRunning) {
        stopDemo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDemoRunning, toggleJudgeMode, toggleMute, toggleTheme, stopDemo]);

  return (
    <DisasterContext.Provider
      value={{
        activeTab,
        setActiveTab,
        params,
        updateParams,
        resetToBaseline,
        theme,
        toggleTheme,
        setTheme,
        habitations: currentState.habitations,
        shelters: currentState.shelters,
        roads: currentState.roads,
        routes: currentState.routes,
        resources: currentState.resources,
        isR17Blocked: currentState.isR17Blocked,
        isS4Overloaded: currentState.isS4Overloaded,
        topPriorityHabitation: currentState.topPriorityHabitation,
        intelEvents,
        baselineState,
        selectedHabitationId,
        setSelectedHabitationId,
        selectedHabitation,
        demographicFilter,
        setDemographicFilter,
        activeScenario,
        loadScenario,
        timeline,
        addTimelineEvent,
        showRecalcBanner,
        recalcTriggerText,
        dismissRecalcBanner,
        isMuted,
        toggleMute,
        isDemoRunning,
        demoStep,
        demoPlaying,
        startDemo,
        pauseDemo,
        resumeDemo,
        nextDemoStep,
        prevDemoStep,
        restartDemo,
        stopDemo,
        isJudgeModeOpen,
        toggleJudgeMode,
        isOrderApproved,
        approveOrder,
        exportSitRep
      }}
    >
      {children}
    </DisasterContext.Provider>
  );
};

export const useDisaster = () => {
  const context = useContext(DisasterContext);
  if (!context) {
    throw new Error('useDisaster must be used within a DisasterProvider');
  }
  return context;
};
