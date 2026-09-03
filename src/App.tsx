import React from 'react';
import { DisasterProvider, useDisaster } from './context/DisasterContext';
import { TacticalHeader } from './components/common/TacticalHeader';
import { TacticalFooter } from './components/common/TacticalFooter';
import { HeroSection } from './components/landing/HeroSection';
import { ProblemComparison } from './components/landing/ProblemComparison';
import { CorePrioritizationFlow } from './components/landing/CorePrioritizationFlow';
import { CommandCenter } from './components/command/CommandCenter';
import { WhatIfSimulator } from './components/simulation/WhatIfSimulator';
import { DigitalTwinView } from './components/twin/DigitalTwinView';
import { ShelterIntelligence } from './components/shelters/ShelterIntelligence';
import { RouteOptimization } from './components/routes/RouteOptimization';
import { ResourceAllocation } from './components/resources/ResourceAllocation';
import { VulnerabilityHeatmap } from './components/demographics/VulnerabilityHeatmap';
import { SystemArchitecture } from './components/system/SystemArchitecture';
import { IncidentTimeline } from './components/system/IncidentTimeline';
import { ScenarioLibrary } from './components/system/ScenarioLibrary';
import { ImpactDashboard } from './components/system/ImpactDashboard';
import { GovernanceHITL } from './components/system/GovernanceHITL';
import { FailsafeReliability } from './components/system/FailsafeReliability';
import { DataSources } from './components/system/DataSources';
import { FeasibilityRoadmap } from './components/system/FeasibilityRoadmap';
import { TeamSection } from './components/system/TeamSection';
import { SourcesReferences } from './components/system/SourcesReferences';
import { RecalculationBanner } from './components/simulation/RecalculationBanner';
import { GuidedDemoOverlay } from './components/demo/GuidedDemoOverlay';
import { JudgeModeHUD } from './components/demo/JudgeModeHUD';

const AppContent: React.FC = () => {
  const { activeTab } = useDisaster();

  return (
    <div className="min-h-screen bg-tactical-bg text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Tactical EOC Header */}
      <TacticalHeader />

      {/* Main View Router */}
      <main className="flex-1 w-full pb-16">
        {activeTab === 'LANDING' && (
          <div>
            <HeroSection />
            <ProblemComparison />
            <CorePrioritizationFlow />
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <WhatIfSimulator />
            </div>
            <GovernanceHITL />
            <FailsafeReliability />
          </div>
        )}

        {activeTab === 'COMMAND' && <CommandCenter />}
        {activeTab === 'WHAT_IF' && <WhatIfSimulator />}
        {activeTab === 'TWIN' && <DigitalTwinView />}
        {activeTab === 'SHELTERS' && <ShelterIntelligence />}
        {activeTab === 'ROUTES' && <RouteOptimization />}
        {activeTab === 'RESOURCES' && <ResourceAllocation />}
        {activeTab === 'DEMOGRAPHICS' && <VulnerabilityHeatmap />}

        {activeTab === 'ARCHITECTURE' && (
          <div className="space-y-8">
            <SystemArchitecture />
            <DataSources />
            <FeasibilityRoadmap />
          </div>
        )}

        {activeTab === 'TIMELINE' && <IncidentTimeline />}
        {activeTab === 'SCENARIOS' && <ScenarioLibrary />}
        {activeTab === 'IMPACT' && <ImpactDashboard />}

        {activeTab === 'TEAM' && (
          <div className="space-y-8">
            <TeamSection />
            <SourcesReferences />
          </div>
        )}
      </main>

      {/* Global Overlays */}
      <RecalculationBanner />
      <GuidedDemoOverlay />
      <JudgeModeHUD />

      {/* Tactical Footer */}
      <TacticalFooter />
    </div>
  );
};

export function App() {
  return (
    <DisasterProvider>
      <AppContent />
    </DisasterProvider>
  );
}

export default App;
