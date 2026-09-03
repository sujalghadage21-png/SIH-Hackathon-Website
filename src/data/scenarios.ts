import { ScenarioPreset } from '../types/disaster';

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'flash-flood',
    name: 'Flash Flood & River Confluence Breach',
    hazardType: 'FLOOD',
    badge: 'SIH26191 PRIMARY',
    location: 'Mandakini River Basin / Brahmaputra Tributary',
    description: 'Catastrophic cloudburst upstream causing immediate surge (+3.2m), inundating lower wards and cutting off culvert causeway R17.',
    params: {
      rainfallPct: 65,
      riverStage: 'BREACH',
      roadR17Blocked: true,
      shelterSurgePct: 35,
      landslideRisk: 'MODERATE',
      vulnerableExposureMult: 1.6
    }
  },
  {
    id: 'monsoon-landslide',
    name: 'Monsoon Slope Failure & Landslide Hazard',
    hazardType: 'LANDSLIDE',
    badge: 'WESTERN GHATS / SHIMLA',
    location: 'Zone D Hillside Ridge / Escarpment Escort',
    description: 'Continuous torrential rains destabilize hillside slopes. High threat to informal habitations along steep drainage pathways.',
    params: {
      rainfallPct: 80,
      riverStage: 'WARNING',
      roadR17Blocked: false,
      shelterSurgePct: 20,
      landslideRisk: 'EXTREME',
      vulnerableExposureMult: 1.8
    }
  },
  {
    id: 'urban-conflagration',
    name: 'Dense Settlement Urban Fire & Hazmat Threat',
    hazardType: 'URBAN_FIRE',
    badge: 'METRO DENSE CORE',
    location: 'Zone G Old Fort & Zone H Industrial Buffer',
    description: 'Electrical transformer explosion during heavy winds spreading through non-pucca clusters with narrow inaccessible corridors.',
    params: {
      rainfallPct: 0,
      riverStage: 'NORMAL',
      roadR17Blocked: false,
      shelterSurgePct: 15,
      landslideRisk: 'LOW',
      vulnerableExposureMult: 1.4
    }
  },
  {
    id: 'cyclone-storm-surge',
    name: 'Severe Cyclonic Storm Surge & Coastal Inundation',
    hazardType: 'CYCLONE',
    badge: 'BAY OF BENGAL COASTAL',
    location: 'Zone F East Creek & Zone I South Wetland',
    description: 'Category 4 cyclonic landfall accompanied by 4.5m astronomical storm tide submerging low-elevation fishing hamlets.',
    params: {
      rainfallPct: 90,
      riverStage: 'BREACH',
      roadR17Blocked: true,
      shelterSurgePct: 45,
      landslideRisk: 'HIGH',
      vulnerableExposureMult: 2.0
    }
  }
];
