// Real Geographical Data for India GIS Integration
// Coordinates: Latitude, Longitude (WGS84)

export interface IndiaHotspot {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  risk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'MONITOR';
  score: number;
  type: string;
  status: string;
  details: string;
  color: string;
  zoom: number;
}

export const INDIA_NATIONAL_HOTSPOTS: IndiaHotspot[] = [
  {
    id: 'assam',
    name: 'Brahmaputra Flood Basin (Guwahati)',
    state: 'Assam',
    lat: 26.185,
    lng: 91.745,
    risk: 'CRITICAL',
    score: 89,
    type: 'RIVERINE FLOOD & EMBANKMENT BREACH',
    status: 'ACTIVE SIMULATION ZONE',
    details: '12 Habitations, 6 Relief Shelters, Live EOC Telemetry',
    color: '#ef4444',
    zoom: 13,
  },
  {
    id: 'uttarakhand',
    name: 'Chamoli / Alaknanda Valley',
    state: 'Uttarakhand',
    lat: 30.405,
    lng: 79.332,
    risk: 'HIGH',
    score: 79,
    type: 'HIMALAYAN FLASH FLOOD & LANDSLIDE',
    status: 'WATCH ALERT (NH-58)',
    details: 'High-gradient glacial valley, 9 vulnerable villages',
    color: '#f97316',
    zoom: 12,
  },
  {
    id: 'bihar',
    name: 'Kosi River Embankment Basin',
    state: 'Bihar',
    lat: 25.920,
    lng: 86.820,
    risk: 'HIGH',
    score: 76,
    type: 'MAJOR RIVER EMBANKMENT BREACH',
    status: 'SDMA INUNDATION ALERT',
    details: 'High population density alluvial flood zone',
    color: '#f97316',
    zoom: 12,
  },
  {
    id: 'kerala',
    name: 'Wayanad Hill Slopes',
    state: 'Kerala',
    lat: 11.685,
    lng: 76.132,
    risk: 'MODERATE',
    score: 65,
    type: 'MONSOON DEBRIS FLOW & SLIPPAGE',
    status: 'WESTERN GHATS WARNING',
    details: 'Steep plantation hamlet vulnerability, 18 settlements',
    color: '#eab308',
    zoom: 13,
  },
  {
    id: 'odisha',
    name: 'Kendrapara / Paradip Coast',
    state: 'Odisha',
    lat: 20.316,
    lng: 86.611,
    risk: 'MONITOR',
    score: 54,
    type: 'BAY OF BENGAL CYCLONE SURGE',
    status: 'OSDMA PREPAREDNESS',
    details: 'Multi-purpose cyclone shelters activated along coast',
    color: '#06b6d4',
    zoom: 12,
  },
  {
    id: 'himachal',
    name: 'Kullu / Beas River Basin',
    state: 'Himachal Pradesh',
    lat: 31.950,
    lng: 77.100,
    risk: 'MODERATE',
    score: 68,
    type: 'MOUNTAIN CLOUDBURST & TORRENT',
    status: 'BEAS VALLEY ALERT',
    details: 'Flash flooding risk along riverbed habitations',
    color: '#eab308',
    zoom: 12,
  },
  {
    id: 'gujarat',
    name: 'Kutch / Kandla Port Belt',
    state: 'Gujarat',
    lat: 23.010,
    lng: 70.210,
    risk: 'MONITOR',
    score: 46,
    type: 'SEISMIC ZONE V & SALINE INGRESS',
    status: 'GSDMA MONITORING',
    details: 'Critical industrial & coastal settlement zone',
    color: '#10b981',
    zoom: 11,
  },
];

// Real Geographic Coordinates for Habitations in Guwahati - Brahmaputra Basin, Assam, India
export const REAL_INDIA_HABITATION_COORDS: Record<string, { lat: number; lng: number; district: string }> = {
  'zone-c': { lat: 26.1845, lng: 91.7380, district: 'Kamrup Metro • Ward 7 Riverside Slums' },
  'zone-a': { lat: 26.1770, lng: 91.7240, district: 'Ghat Confluence Basti' },
  'zone-b': { lat: 26.1960, lng: 91.7510, district: 'North Mandi & Transport Hub' },
  'zone-d': { lat: 26.2090, lng: 91.7780, district: 'Hillside Shanti Nagar Ridge' },
  'zone-e': { lat: 26.1690, lng: 91.7160, district: 'Old Saraighat Pier Colony' },
  'zone-f': { lat: 26.1590, lng: 91.7060, district: 'East Creek Fishermen Basti' },
  'zone-g': { lat: 26.1890, lng: 91.7670, district: 'Old Fort Heritage Enclave' },
  'zone-h': { lat: 26.1630, lng: 91.7580, district: 'Industrial Lowlands & Warehouses' },
  'zone-i': { lat: 26.1730, lng: 91.7440, district: 'Canal Bank Basti' },
  'zone-j': { lat: 26.1560, lng: 91.7400, district: 'South Ring Settlement' },
  'zone-k': { lat: 26.1830, lng: 91.7600, district: 'Timber Market Dense Hamlet' },
  'zone-l': { lat: 26.2160, lng: 91.7640, district: 'High Ridge Model Township' },
};

// Real Geographic Coordinates for Shelters in Guwahati - Brahmaputra Basin
export const REAL_INDIA_SHELTER_COORDS: Record<string, { lat: number; lng: number; landmark: string }> = {
  's1': { lat: 26.1720, lng: 91.7090, landmark: 'Assam Engineering Institute Campus' },
  's2': { lat: 26.1900, lng: 91.7290, landmark: 'Nehru Stadium Sports Complex' },
  's3': { lat: 26.2030, lng: 91.7520, landmark: 'Kendriya Vidyalaya Mega Center' },
  's4': { lat: 26.1790, lng: 91.7460, landmark: 'Town Community Hall (S4 Overloaded)' },
  's5': { lat: 26.2130, lng: 91.7830, landmark: 'St. Jude Mission School' },
  's6': { lat: 26.2190, lng: 91.7560, landmark: 'New Multi-purpose District Shelter (Safe S6)' },
};

// Real Road Coordinates along actual road alignments
export const REAL_INDIA_ROADS: { id: string; name: string; path: [number, number][]; bottleneck: boolean }[] = [
  {
    id: 'R12',
    name: 'Ghat Riverside Link (SH-4)',
    path: [
      [26.1770, 91.7240],
      [26.1800, 91.7320],
      [26.1845, 91.7380]
    ],
    bottleneck: false,
  },
  {
    id: 'R17',
    name: 'Embankment Road (Critical Bottleneck)',
    path: [
      [26.1845, 91.7380],
      [26.1820, 91.7420],
      [26.1790, 91.7460]
    ],
    bottleneck: true,
  },
  {
    id: 'R24',
    name: 'North Ridge Bypass (NH-27 Arterial)',
    path: [
      [26.1845, 91.7380],
      [26.1920, 91.7440],
      [26.2000, 91.7490],
      [26.2100, 91.7530],
      [26.2190, 91.7560]
    ],
    bottleneck: false,
  },
  {
    id: 'R08',
    name: 'Pier Highway Link',
    path: [
      [26.1690, 91.7160],
      [26.1730, 91.7200],
      [26.1770, 91.7240]
    ],
    bottleneck: false,
  },
  {
    id: 'R31',
    name: 'East Creek Elevated Cause-way',
    path: [
      [26.1590, 91.7060],
      [26.1650, 91.7080],
      [26.1720, 91.7090]
    ],
    bottleneck: false,
  }
];

// Evacuation Corridor Polylines
export const REAL_INDIA_ROUTES: { id: string; name: string; path: [number, number][]; isRecommended?: boolean }[] = [
  {
    id: 'route-a',
    name: 'Corridor A: Ghat to Shelter S1',
    path: [
      [26.1770, 91.7240],
      [26.1750, 91.7180],
      [26.1720, 91.7090]
    ],
  },
  {
    id: 'route-b',
    name: 'Corridor B: Zone C to Shelter S4 (via R17)',
    path: [
      [26.1845, 91.7380],
      [26.1820, 91.7420],
      [26.1790, 91.7460]
    ],
  },
  {
    id: 'route-d',
    name: 'AI Safe Route D: Zone C to Shelter S6 (Safe Bypass)',
    path: [
      [26.1845, 91.7380],
      [26.1920, 91.7440],
      [26.2000, 91.7490],
      [26.2100, 91.7530],
      [26.2190, 91.7560]
    ],
    isRecommended: true,
  },
];

// Brahmaputra River Channel Polygon
export const BRAHMAPUTRA_RIVER_POLYGON: [number, number][] = [
  [26.215, 91.660],
  [26.208, 91.690],
  [26.202, 91.720],
  [26.196, 91.750],
  [26.188, 91.780],
  [26.178, 91.810],
  [26.168, 91.835],
  [26.158, 91.830],
  [26.166, 91.800],
  [26.174, 91.770],
  [26.182, 91.740],
  [26.188, 91.710],
  [26.196, 91.680],
  [26.205, 91.655]
];

// India Official Border Outline (Simplified Polygon for National View Boundary Display)
export const INDIA_BOUNDARY_COORDS: [number, number][] = [
  [37.05, 74.45],
  [36.85, 75.30],
  [35.50, 77.00],
  [34.50, 78.50],
  [33.00, 79.30],
  [31.20, 78.80],
  [30.20, 80.80],
  [29.00, 80.20],
  [27.30, 88.00],
  [27.80, 88.90],
  [27.20, 89.80],
  [28.00, 92.00],
  [28.30, 94.50],
  [28.20, 97.00],
  [27.00, 96.50],
  [25.00, 94.50],
  [24.00, 93.30],
  [22.80, 92.50],
  [21.80, 92.70],
  [21.50, 88.80],
  [21.80, 87.00],
  [19.80, 85.80],
  [17.70, 83.30],
  [15.80, 80.40],
  [13.10, 80.30],
  [10.80, 79.80],
  [9.30, 79.10],
  [8.10, 77.55], // Kanyakumari
  [8.80, 76.50],
  [11.50, 75.75],
  [13.50, 74.80],
  [15.50, 73.80],
  [18.90, 72.80], // Mumbai
  [20.50, 72.80],
  [21.70, 72.20],
  [22.50, 69.00], // Dwarka
  [23.70, 68.20],
  [24.50, 70.00],
  [25.00, 71.20],
  [27.50, 71.00],
  [29.80, 73.50],
  [31.50, 74.60],
  [32.80, 74.80],
  [34.50, 74.00],
  [37.05, 74.45]
];
