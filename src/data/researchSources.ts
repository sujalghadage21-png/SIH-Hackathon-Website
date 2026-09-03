export interface ResearchSource {
  id: string;
  category: 'GOVERNMENT' | 'ACADEMIC' | 'DATA_STANDARD';
  title: string;
  organization: string;
  year: string;
  tag: string;
  relevance: string;
  linkText: string;
}

export const RESEARCH_SOURCES: ResearchSource[] = [
  {
    id: 'ndma-guidelines',
    category: 'GOVERNMENT',
    title: 'National Disaster Management Guidelines: Management of Floods & Urban Flooding',
    organization: 'National Disaster Management Authority (NDMA), Govt. of India',
    year: '2020 Guidelines Update',
    tag: 'Standard Framework',
    relevance: 'Provides statutory protocols for Early Warning Dissemination, Inundation Mapping, Standard Operating Procedures for EOCs, and Evacuation Shelter Minimum Standards.',
    linkText: 'ndma.gov.in/Governance/Guidelines'
  },
  {
    id: 'isro-bhuvan',
    category: 'DATA_STANDARD',
    title: 'Disaster Management Support Programme (DMSP) & Bhuvan Geo-Portal',
    organization: 'National Remote Sensing Centre (NRSC) / ISRO',
    year: 'Continuous Geospatial Service',
    tag: 'Geospatial Standard',
    relevance: 'High-resolution CartoDEM digital elevation models, satellite flood extent layers, and spatial decision support infrastructure for district emergency planning.',
    linkText: 'bhuvan.nrsc.gov.in/disaster'
  },
  {
    id: 'imd-radar',
    category: 'DATA_STANDARD',
    title: 'Operational Hydrometeorological & Doppler Weather Radar Network Data Protocols',
    organization: 'India Meteorological Department (IMD), Ministry of Earth Sciences',
    year: '2023 Nowcast Standards',
    tag: 'Meteorological Data',
    relevance: 'Quantitative Precipitation Estimates (QPE), convective storm cell tracking, and automated flash flood guidance system (FFGS) telemetry integration.',
    linkText: 'mausam.imd.gov.in'
  },
  {
    id: 'mcdm-ahp',
    category: 'ACADEMIC',
    title: 'Multi-Criteria Decision Analysis (AHP/TOPSIS) for Disaster Vulnerability Assessment',
    organization: 'Operational Research in Disaster Management Literature',
    year: 'Methodological Foundation',
    tag: 'Algorithmic Model',
    relevance: 'Multi-factor weight derivation for balancing hazard severity against social vulnerability (elderly, infants, PwD) and geographic isolation factors.',
    linkText: 'Potential research source: MCDM / AHP operational framework'
  },
  {
    id: 'shelter-capacity',
    category: 'ACADEMIC',
    title: 'Dynamic Carrying-Capacity Modeling & Congestion Avoidance in Evacuation Transit',
    organization: 'Transportation & Disaster Logistics Research',
    year: 'Logistical Architecture',
    tag: 'Capacity Optimization',
    relevance: 'Prevents secondary disaster bottlenecks by setting multi-tier threshold buffers (75% warning, 90% divert) and dynamically re-allocating arriving populations to secondary relief bases.',
    linkText: 'Potential research source: Evacuation Logistics & Capacity Routing'
  },
  {
    id: 'osm-roads',
    category: 'DATA_STANDARD',
    title: 'OpenStreetMap Road Network Topology & Overpass API Geospatial Specs',
    organization: 'OpenStreetMap Foundation & Humanitarian OpenStreetMap Team (HOT)',
    year: 'Open Spatial Standard',
    tag: 'Routing Graph',
    relevance: 'Graph representation of arterial roadways, culverts, bridges, and topological connectivity for multi-objective evacuation routing algorithms.',
    linkText: 'openstreetmap.org'
  }
];
