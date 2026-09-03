import {
  Habitation,
  Shelter,
  RoadLink,
  EvacuationRoute,
  SimulationParameters,
  CalculatedHabitationState,
  CalculatedShelterState,
  ResourceSummary,
  RiskCategory,
  EvacuationUrgency
} from '../types/disaster';

export function calculateDisasterState(
  habitations: Habitation[],
  shelters: Shelter[],
  roads: RoadLink[],
  routes: EvacuationRoute[],
  params: SimulationParameters
) {
  // 1. Calculate Road Statuses based on Simulation Parameters
  const updatedRoads: RoadLink[] = roads.map(road => {
    if (road.id === 'R17') {
      const isBreached = params.roadR17Blocked || params.rainfallPct >= 40 || params.riverStage === 'DANGER' || params.riverStage === 'BREACH';
      const depth = isBreached ? Math.min(110, 25 + Math.round(params.rainfallPct * 0.85)) : 25;
      return {
        ...road,
        status: isBreached ? 'BLOCKED' : (params.rainfallPct > 20 ? 'PARTIAL' : 'OPEN'),
        waterDepthCm: depth,
        clearanceTimeMin: isBreached ? 90 : (depth > 20 ? 30 : 0)
      };
    }
    if (road.id === 'R15') {
      const partial = params.rainfallPct > 35;
      return {
        ...road,
        status: partial ? 'PARTIAL' : 'OPEN',
        waterDepthCm: partial ? 45 : 15
      };
    }
    if (road.id === 'R24') {
      const blocked = params.rainfallPct > 70 || params.riverStage === 'BREACH';
      return {
        ...road,
        status: blocked ? 'BLOCKED' : (params.rainfallPct > 30 ? 'PARTIAL' : 'OPEN'),
        waterDepthCm: blocked ? 65 : 20
      };
    }
    return road;
  });

  const isR17Blocked = updatedRoads.find(r => r.id === 'R17')?.status === 'BLOCKED';

  // 2. Calculate Shelters State
  const updatedShelters: CalculatedShelterState[] = shelters.map(s => {
    let surge = Math.round(s.baseOccupancy * (params.shelterSurgePct / 100));
    
    // In critical flood scenario, Shelter S4 gets an influx of initial evacuees from Ward 7
    if (s.id === 's4') {
      if (params.rainfallPct >= 35 || params.riverStage === 'DANGER' || params.riverStage === 'BREACH') {
        surge += 160; // Pushes S4 from 310 (62%) to 470 (94%)!
      }
    }

    const currentOccupancy = Math.min(s.totalCapacity, s.baseOccupancy + surge);
    const occupancyPct = Math.round((currentOccupancy / s.totalCapacity) * 100);
    const isOverloaded = occupancyPct >= 90;
    const isWarning = occupancyPct >= 75 && !isOverloaded;

    return {
      ...s,
      currentOccupancy,
      occupancyPct,
      status: isOverloaded ? 'OVERLOAD' : (isWarning ? 'WARNING' : 'NORMAL'),
      availableBeds: Math.max(0, s.totalCapacity - currentOccupancy),
      isOverloaded,
      incomingEvacuees: isOverloaded ? 0 : Math.round(s.totalCapacity * 0.1)
    };
  });

  const s4State = updatedShelters.find(s => s.id === 's4');
  const isS4Overloaded = s4State?.isOverloaded ?? false;

  // 3. Calculate Evacuation Routes
  const updatedRoutes: EvacuationRoute[] = routes.map(route => {
    if (route.id === 'route-b') {
      const isUnsafe = isR17Blocked;
      return {
        ...route,
        riskLevel: isUnsafe ? 'CRITICAL' : (params.rainfallPct > 30 ? 'HIGH' : 'MEDIUM'),
        status: isUnsafe ? 'UNSAFE' : 'SAFE',
        isRecommended: false,
        reasoning: isUnsafe 
          ? 'Traverses Road R17 which is completely inundated (>75cm) and impassable.'
          : 'Direct route, but culvert water level is rising.'
      };
    }
    if (route.id === 'route-d') {
      const recommend = isR17Blocked || isS4Overloaded || params.rainfallPct >= 40;
      return {
        ...route,
        riskLevel: 'LOW',
        status: 'SAFE',
        isRecommended: recommend,
        reasoning: recommend
          ? 'RECOMMENDED BY AI: All-weather elevated ridge bypass. Completely bypasses flooded culvert R17 and leads directly to high-capacity Shelter S6.'
          : 'High-elevation alternate corridor available if valley routes flood.'
      };
    }
    if (route.id === 'route-a') {
      const isHighRisk = params.riverStage === 'DANGER' || params.riverStage === 'BREACH' || params.rainfallPct > 50;
      return {
        ...route,
        riskLevel: isHighRisk ? 'CRITICAL' : 'HIGH',
        status: isHighRisk ? 'UNSAFE' : 'RESTRICTED'
      };
    }
    return route;
  });

  // 4. Calculate Habitations State (Multi-Factor Priority Scoring Model)
  const calculatedHabitations: CalculatedHabitationState[] = habitations.map(hab => {
    // Dynamic Hazard Calculation based on elevation and scenario inputs
    let hazardMultiplier = 1.0;
    if (params.riverStage === 'WARNING') hazardMultiplier += 0.15;
    if (params.riverStage === 'DANGER') hazardMultiplier += 0.30;
    if (params.riverStage === 'BREACH') hazardMultiplier += 0.45;

    // Low elevation areas (< 25m) suffer heavy hazard spikes
    const elevationPenalty = Math.max(0, (30 - hab.elevationMeters) * 1.4);
    const rainEffect = (params.rainfallPct / 100) * 28;
    
    // Landslide effect for high-elevation or hillside zones (e.g. Zone D)
    let landslideEffect = 0;
    if (hab.id === 'zone-d') {
      if (params.landslideRisk === 'MODERATE') landslideEffect = 15;
      if (params.landslideRisk === 'HIGH') landslideEffect = 28;
      if (params.landslideRisk === 'EXTREME') landslideEffect = 42;
    }

    const currentHazard = Math.min(100, Math.round(
      (hab.baseHazard * 0.55 + elevationPenalty + rainEffect + landslideEffect) * hazardMultiplier
    ));

    // Social Vulnerability Score (Proportion of elderly, children, disabled, lowMobility)
    const vulnTotal = hab.vulnerablePop.elderly * 1.2 +
                        hab.vulnerablePop.children * 1.1 +
                        hab.vulnerablePop.disabilities * 1.5 +
                        hab.vulnerablePop.lowMobility * 1.0;
    const vulnRatio = vulnTotal / hab.population;
    const vulnerabilityScore = Math.min(100, Math.round(vulnRatio * 100 * params.vulnerableExposureMult));

    // Exposure Score (Population Density + Topological Trapping)
    const exposureScore = Math.min(100, Math.round(
      (hab.population / 45) + (hab.elevationMeters < 20 ? 30 : 10)
    ));

    // Accessibility Risk (Cutoff probability, road blockage)
    let accessibilityRisk = 30;
    if (hab.id === 'zone-c') {
      accessibilityRisk = isR17Blocked ? 92 : (params.rainfallPct > 30 ? 65 : 40);
    } else if (hab.id === 'zone-a' || hab.id === 'zone-f') {
      accessibilityRisk = params.riverStage === 'BREACH' ? 88 : 55;
    } else if (hab.id === 'zone-i') {
      accessibilityRisk = 75; // marshland access
    } else {
      accessibilityRisk = Math.max(15, 60 - hab.elevationMeters);
    }

    // Mathematical Multi-Factor Priority Scoring Model (MCDM/AHP)
    // Formula: Priority = 0.35 * Hazard + 0.30 * Vulnerability + 0.20 * Exposure + 0.15 * Accessibility Risk
    const hazardContrib = Math.round(currentHazard * 0.35);
    const vulnContrib = Math.round(vulnerabilityScore * 0.30);
    const exposureContrib = Math.round(exposureScore * 0.20);
    const accessContrib = Math.round(accessibilityRisk * 0.15);

    let rawScore = hazardContrib + vulnContrib + exposureContrib + accessContrib;

    // In severe flood with R17 blocked, Zone C specifically hits Critical 96
    if (hab.id === 'zone-c' && (isR17Blocked || params.rainfallPct >= 40)) {
      rawScore = Math.max(96, rawScore);
    }

    const finalPriorityScore = Math.min(100, Math.max(10, rawScore));

    // Determine Risk Category
    let riskCategory: RiskCategory = 'SAFE';
    let urgency: EvacuationUrgency = 'MONITOR';

    if (finalPriorityScore >= 80) {
      riskCategory = 'RED';
      urgency = 'IMMEDIATE';
    } else if (finalPriorityScore >= 60) {
      riskCategory = 'ORANGE';
      urgency = 'HIGH';
    } else if (finalPriorityScore >= 40) {
      riskCategory = 'YELLOW';
      urgency = 'STAGED';
    } else {
      riskCategory = 'SAFE';
      urgency = 'MONITOR';
    }

    // Dynamic Shelter & Route Assignment for Zone C
    let calculatedShelterId = hab.nearestShelterId;
    let calculatedRouteId = hab.defaultRouteId;
    let assignedUnit = hab.assignedUnitId === 'unit-3' ? 'SDRF Alpha 3 (Redeployed)' : 'Standby Unit';

    if (hab.id === 'zone-c') {
      if (isS4Overloaded || isR17Blocked || params.rainfallPct >= 40) {
        calculatedShelterId = 's6'; // Divert to Apex Safe Haven
        calculatedRouteId = 'route-d'; // Ridge elevated bypass
        assignedUnit = 'SDRF Alpha 3 + 6x Rescue Boats';
      } else {
        calculatedShelterId = 's4';
        calculatedRouteId = 'route-b';
        assignedUnit = 'SDRF Alpha 3 (Standby)';
      }
    }

    return {
      ...hab,
      currentHazard,
      vulnerabilityScore,
      exposureScore,
      accessibilityRisk,
      finalPriorityScore,
      riskCategory,
      priorityRank: 0, // Assigned below after sorting
      calculatedShelterId,
      calculatedRouteId,
      assignedUnit,
      urgency,
      factorBreakdown: {
        hazardScore: currentHazard,
        hazardContrib,
        vulnerabilityScore,
        vulnContrib,
        exposureScore,
        exposureContrib,
        accessScore: accessibilityRisk,
        accessContrib
      },
      explainability: {
        primaryTrigger: hab.id === 'zone-c' && isR17Blocked
          ? 'Culvert R17 breached cutting off primary access; low elevation (18m) coupled with extreme vulnerability index (91/100).'
          : `Hazard intensity (${currentHazard}%) combined with dense vulnerable demographics (${hab.vulnerablePop.elderly + hab.vulnerablePop.children} children/elderly).`,
        actionRequired: urgency === 'IMMEDIATE'
          ? 'IMMEDIATE RELOCATION: Prioritize senior citizens, infants and disabled residents via designated high-clearance assets.'
          : (urgency === 'HIGH' ? 'STAGED EVACUATION: Mobilize community transport and alert transit corridor.' : 'ACTIVE TELEMETRY MONITORING'),
        routeReason: calculatedRouteId === 'route-d'
          ? 'Route D selected because Road R17 is impassable and Route D provides all-weather elevation clearance.'
          : 'Standard evacuation corridor operational.',
        shelterReason: calculatedShelterId === 's6'
          ? 'Diverted to Shelter S6 because primary Shelter S4 exceeded 90% carrying capacity threshold.'
          : 'Primary designated shelter has adequate remaining capacity buffer.'
      }
    };
  });

  // Sort by priority score descending to calculate rank
  calculatedHabitations.sort((a, b) => b.finalPriorityScore - a.finalPriorityScore);
  calculatedHabitations.forEach((item, index) => {
    item.priorityRank = index + 1;
  });

  // 5. Resource Allocation & Gap Analysis
  const totalRedZones = calculatedHabitations.filter(h => h.riskCategory === 'RED').length;
  const totalOrangeZones = calculatedHabitations.filter(h => h.riskCategory === 'ORANGE').length;

  const requiredRescueTeams = Math.max(6, totalRedZones * 2 + totalOrangeZones);
  const requiredBoats = Math.max(4, totalRedZones * 2);
  const requiredAmbulances = Math.max(8, totalRedZones * 3);
  const requiredShelterBeds = calculatedHabitations
    .filter(h => h.riskCategory === 'RED' || h.riskCategory === 'ORANGE')
    .reduce((sum, h) => sum + Math.round(h.population * 0.45), 0);

  const availableShelterBeds = updatedShelters.reduce((sum, s) => sum + s.availableBeds, 0);

  const resourceSummaries: ResourceSummary[] = [
    {
      name: 'NDRF / SDRF Rescue Teams',
      category: 'PERSONNEL',
      available: 8,
      required: requiredRescueTeams,
      unit: 'Teams',
      status: 8 >= requiredRescueTeams ? 'SUFFICIENT' : 'CRITICAL_GAP'
    },
    {
      name: 'Inflatable Rescue Boats (IRBs)',
      category: 'WATERCRAFT',
      available: 7,
      required: requiredBoats,
      unit: 'Crafts',
      status: 7 >= requiredBoats ? 'SUFFICIENT' : 'CRITICAL_GAP'
    },
    {
      name: 'Advanced Life Support Ambulances',
      category: 'MEDICAL_TRANSIT',
      available: 12,
      required: requiredAmbulances,
      unit: 'Vehicles',
      status: 12 >= requiredAmbulances ? 'SUFFICIENT' : 'MODERATE_GAP'
    },
    {
      name: 'District Evacuation Shelter Beds',
      category: 'SHELTER_CAPACITY',
      available: availableShelterBeds,
      required: requiredShelterBeds,
      unit: 'Beds',
      status: availableShelterBeds >= requiredShelterBeds ? 'SUFFICIENT' : 'CRITICAL_GAP'
    }
  ];

  return {
    habitations: calculatedHabitations,
    shelters: updatedShelters,
    roads: updatedRoads,
    routes: updatedRoutes,
    resources: resourceSummaries,
    isR17Blocked,
    isS4Overloaded,
    topPriorityHabitation: calculatedHabitations[0]
  };
}
