export interface ArchitectureNode {
  id: string;
  category: 'DATA_INGESTION' | 'PROCESSING' | 'AI_ENGINE' | 'DECISION' | 'DISPATCH';
  title: string;
  subtitle: string;
  description: string;
  specs: {
    latency: string;
    protocol: string;
    frequency: string;
    failsafe: string;
  };
  details: string[];
}

export const ARCHITECTURE_PIPELINE: ArchitectureNode[] = [
  {
    id: 'data-sources',
    category: 'DATA_INGESTION',
    title: 'Multi-Source Data Ingestion',
    subtitle: 'Sensors, Satellites & Government Registries',
    description: 'Continuous asynchronous aggregation of hydrometeorological, spatial, and demographic streams.',
    specs: {
      latency: '< 150 ms per stream',
      protocol: 'MQTT / REST GeoJSON / WMS',
      frequency: 'Near real-time (1 - 5 min)',
      failsafe: 'Cached local snapshot fallback + Dead Reckoning'
    },
    details: [
      'IMD Doppler Radar & Automated Weather Stations (AWS)',
      'Central Water Commission (CWC) River Gauges & Reservoir Telemetry',
      'ISRO Bhuvan High-Resolution Digital Elevation Models (DEM 10m)',
      'OpenStreetMap (OSM) Road Network Vectors & Bridge Nodes',
      'Census & Socio-Economic Caste Registry for Demographic Vulnerability'
    ]
  },
  {
    id: 'spatial-processing',
    category: 'PROCESSING',
    title: 'Spatial Normalization & GIS Engine',
    subtitle: 'Topographic Coordinate Transformation',
    description: 'Converts raw sensor vectors and elevation rasters into normalized risk meshes with terrain slope contours.',
    specs: {
      latency: '< 40 ms',
      protocol: 'WebGL Mesh Buffer / Web Workers',
      frequency: 'Continuous pipeline',
      failsafe: '2D fallback projection mode'
    },
    details: [
      'Catchment delineation and runoff accumulation indexing',
      'Dynamic flood inundation plane projection',
      'Road segment flood depth computation via cross-culvert elevation matching',
      'Demographic spatial binning into ward-level centroids'
    ]
  },
  {
    id: 'ai-risk-engine',
    category: 'AI_ENGINE',
    title: 'Multi-Factor Priority Scoring Engine',
    subtitle: 'Hazard × Vulnerability × Exposure × Accessibility',
    description: 'Deterministic Multi-Criteria Decision Analysis (MCDA / AHP) prioritizing habitations under dynamic disaster constraints.',
    specs: {
      latency: '< 15 ms recalculation cycle',
      protocol: 'In-Memory WASM / Optimized Matrix Calc',
      frequency: 'Event-driven on any telemetry shift',
      failsafe: 'Deterministic baseline ruleset'
    },
    details: [
      'Hazard Intensity Index: River gauge stage, rainfall rate, slope instability',
      'Vulnerability Weighting: Weighted proportion of elderly (>65), infants, PwD, kutchha housing',
      'Exposure Factor: Population density per hectare vs topological elevation',
      'Accessibility Risk: Cutoff probabilities, bridge vulnerability, transit delays'
    ]
  },
  {
    id: 'route-optimization',
    category: 'DECISION',
    title: 'Adaptive Route & Carrying Capacity Engine',
    subtitle: 'Constrained Multi-Objective Dijkstra / A*',
    description: 'Calculates safest evacuation corridors avoiding inundated bottlenecks while preventing shelter carrying capacity overshoots.',
    specs: {
      latency: '< 25 ms',
      protocol: 'Graph-based Priority Queue',
      frequency: 'Recalculates upon road status update',
      failsafe: 'Default master evacuation plan'
    },
    details: [
      'Dynamic hazard avoidance: Road weights increase exponentially with water depth',
      'Shelter Carrying Capacity: Monitored in real-time with threshold alerts at 75% and 90%',
      'Automated Overflow Diversion: Reroutes evacuees to secondary Apex Shelters before bottleneck occurs',
      'Multi-Route Comparison: Evaluates Distance vs Time vs Risk Exposure'
    ]
  },
  {
    id: 'command-dispatch',
    category: 'DISPATCH',
    title: 'Human-in-the-Loop Command & Dispatch',
    subtitle: 'Incident Commander Review & Common Operating Picture',
    description: 'Empowers District Disaster Management Authority (DDMA) incident commanders to review AI recommendations and issue official operational dispatch orders.',
    specs: {
      latency: 'Zero friction UI (< 200 ms render)',
      protocol: 'Secure WebSockets / TLS 1.3',
      frequency: 'Real-time alert push',
      failsafe: 'Offline SITREP PDF generation'
    },
    details: [
      'Interactive approval workflow: AI recommends, Incident Commander validates and authorizes',
      'Transparent Explainability: Step-by-step scoring attribution for every decision',
      'Automated Situation Report (SitRep) generation for state & national NDMA coordination',
      'NDRF / SDRF team assignment and communication dispatch packets'
    ]
  }
];
