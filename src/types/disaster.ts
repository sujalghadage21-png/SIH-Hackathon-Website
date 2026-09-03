export type RiskCategory = 'RED' | 'ORANGE' | 'YELLOW' | 'SAFE';

export type RiverStage = 'NORMAL' | 'WARNING' | 'DANGER' | 'BREACH';
export type LandslideRisk = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
export type RoadStatus = 'OPEN' | 'PARTIAL' | 'BLOCKED';
export type EvacuationUrgency = 'IMMEDIATE' | 'HIGH' | 'STAGED' | 'MONITOR';

export interface Coordinates {
  x: number;
  y: number;
  elevation?: number;
}

export interface VulnerableDemographics {
  elderly: number;       // Age > 65
  children: number;      // Age < 10
  disabilities: number;  // PwD
  lowMobility: number;   // Dense / informal housing
}

export interface Habitation {
  id: string;
  code: string;
  name: string;
  coords: Coordinates;
  population: number;
  vulnerablePop: VulnerableDemographics;
  baseHazard: number;     // 0-100
  elevationMeters: number;
  nearestShelterId: string;
  backupShelterId: string;
  assignedUnitId: string;
  defaultRouteId: string;
  alternateRouteId: string;
  notes: string;
}

export interface FactorBreakdown {
  hazardScore: number;
  hazardContrib: number;
  vulnerabilityScore: number;
  vulnContrib: number;
  exposureScore: number;
  exposureContrib: number;
  accessScore: number;
  accessContrib: number;
}

export interface CalculatedHabitationState extends Habitation {
  currentHazard: number;
  vulnerabilityScore: number;
  exposureScore: number;
  accessibilityRisk: number;
  finalPriorityScore: number;
  riskCategory: RiskCategory;
  priorityRank: number;
  calculatedShelterId: string;
  calculatedRouteId: string;
  assignedUnit: string;
  urgency: EvacuationUrgency;
  factorBreakdown: FactorBreakdown;
  explainability: {
    primaryTrigger: string;
    actionRequired: string;
    routeReason: string;
    shelterReason: string;
  };
}

export interface Shelter {
  id: string;
  code: string;
  name: string;
  coords: Coordinates;
  totalCapacity: number;
  baseOccupancy: number;
  medicalBay: boolean;
  foodStockPct: number;
  waterStockPct: number;
  powerGenPct: number;
  accessibilityRating: 'HIGH' | 'MEDIUM' | 'LOW';
  distanceFromC: number; // km
}

export interface CalculatedShelterState extends Shelter {
  currentOccupancy: number;
  occupancyPct: number;
  status: 'NORMAL' | 'WARNING' | 'OVERLOAD';
  availableBeds: number;
  isOverloaded: boolean;
  incomingEvacuees: number;
}

export interface RoadLink {
  id: string;
  name: string;
  status: RoadStatus;
  waterDepthCm: number;
  isCriticalBottleneck: boolean;
  clearanceTimeMin: number;
  description: string;
  path: [number, number][];
}

export interface EvacuationRoute {
  id: string;
  code: string;
  name: string;
  fromZone: string;
  toShelter: string;
  distanceKm: number;
  travelTimeMin: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'SAFE' | 'RESTRICTED' | 'UNSAFE';
  isRecommended: boolean;
  reasoning: string;
  path: [number, number][];
}

export interface RescueUnit {
  id: string;
  name: string;
  type: 'NDRF' | 'SDRF' | 'BOAT_SQUAD' | 'FIRE_RESCUE' | 'ARMY_MEDICAL';
  personnel: number;
  equipment: string;
  status: 'STANDBY' | 'DISPATCHED' | 'ON_SITE';
  assignedZoneId: string;
  etaMinutes: number;
}

export interface ResourceSummary {
  name: string;
  category: string;
  available: number;
  required: number;
  unit: string;
  status: 'SUFFICIENT' | 'CRITICAL_GAP' | 'MODERATE_GAP';
}

export interface SimulationParameters {
  rainfallPct: number;          // 0 to 100%
  riverStage: RiverStage;       // NORMAL, WARNING, DANGER, BREACH
  roadR17Blocked: boolean;       // Road R17 culvert status
  shelterSurgePct: number;      // 0 to 50%
  landslideRisk: LandslideRisk; // LOW, MODERATE, HIGH, EXTREME
  vulnerableExposureMult: number; // 1.0 to 2.2x
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'RECALCULATED';
  zoneId?: string;
}

export interface ScenarioPreset {
  id: string;
  name: string;
  hazardType: 'FLOOD' | 'LANDSLIDE' | 'URBAN_FIRE' | 'CYCLONE';
  badge: string;
  location: string;
  description: string;
  params: SimulationParameters;
}
