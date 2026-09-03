import * as THREE from 'three';

/**
 * Procedural 3D Structures for the Brahmaputra River Basin Disaster Zone (Guwahati, Assam, India)
 */

/**
 * Computes exact 3D terrain elevation at world coordinates (x, z)
 * matching the procedural terrain mesh algorithm.
 */
export function getTerrainHeight(x: number, z: number): number {
  const riverCenterZ = -40 + Math.sin(x * 0.024) * 30;
  const riverDist = Math.abs(z - riverCenterZ);
  const isRiver = Math.max(0, 1 - riverDist / 38);

  const charDist = Math.sqrt(Math.pow(x + 25, 2) + Math.pow(z + 10, 2));
  const isChar = Math.max(0, 1 - charDist / 20);

  const hillDist = Math.sqrt(Math.pow(x - 65, 2) + Math.pow(z + 60, 2));
  const hillElev = Math.max(0, 48 * Math.exp(-Math.pow(hillDist / 55, 2)));

  const southRidge = Math.max(0, 22 * Math.exp(-Math.pow((z - 70) / 42, 2)));

  let y = Math.sin(x * 0.015) * Math.cos(z * 0.015) * 5 + hillElev + southRidge + (isChar * 8) - (isRiver * 22);
  return Math.max(-16, y);
}

// 1. Saraighat Truss & Girder Bridge across the Brahmaputra River
export function createSaraighatBridge(): THREE.Group {
  const bridgeGroup = new THREE.Group();
  bridgeGroup.name = 'saraighatBridge';

  const pierMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.9,
    metalness: 0.1,
  });

  const trussMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.4,
    metalness: 0.7,
  });

  const deckMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.7,
    metalness: 0.2,
  });

  const railMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.3,
  });

  // Main roadway deck spanning x: -85 to +35 at z: -40, height y: 8.5
  const deckLength = 120;
  const deckWidth = 6;
  const deckHeight = 0.8;
  const deckGeo = new THREE.BoxGeometry(deckLength, deckHeight, deckWidth);
  const deckMesh = new THREE.Mesh(deckGeo, deckMat);
  deckMesh.position.set(-25, 8.5, -40);
  deckMesh.castShadow = true;
  deckMesh.receiveShadow = true;
  bridgeGroup.add(deckMesh);

  // Guardrails with illuminated warning lights
  const railGeo = new THREE.BoxGeometry(deckLength, 0.4, 0.2);
  const leftRail = new THREE.Mesh(railGeo, railMat);
  leftRail.position.set(-25, 9.3, -42.8);
  const rightRail = new THREE.Mesh(railGeo, railMat);
  rightRail.position.set(-25, 9.3, -37.2);
  bridgeGroup.add(leftRail, rightRail);

  // 4 Concrete River Piers rooted in the riverbed
  const pierPositions = [-70, -40, -10, 20];
  pierPositions.forEach(px => {
    const riverY = getTerrainHeight(px, -40);
    const topY = 8.5;
    const pHeight = Math.max(12, topY - riverY);
    const pierGeo = new THREE.CylinderGeometry(2.4, 3.2, pHeight, 12);
    const pier = new THREE.Mesh(pierGeo, pierMat);
    pier.position.set(px, riverY + pHeight / 2, -40);
    pier.castShadow = true;
    pier.receiveShadow = true;
    bridgeGroup.add(pier);

    // Steel Overhead Truss Arches
    const archGeo = new THREE.BoxGeometry(26, 6.5, 5.8);
    const arch = new THREE.Mesh(archGeo, trussMat);
    arch.position.set(px + 15, 12.5, -40);
    arch.castShadow = true;
    bridgeGroup.add(arch);

    // Diagonal support crossbeams
    for (let i = -10; i <= 10; i += 5) {
      const beamGeo = new THREE.CylinderGeometry(0.15, 0.15, 7.5, 6);
      const beam = new THREE.Mesh(beamGeo, trussMat);
      beam.position.set(px + 15 + i, 12.5, -40);
      beam.rotation.z = (i % 2 === 0 ? 0.35 : -0.35);
      bridgeGroup.add(beam);
    }
  });

  return bridgeGroup;
}

// 2. Concrete Embankment Wall and Critical Road R17 Culvert Breach
export function createRiverEmbankments(isR17Blocked: boolean): THREE.Group {
  const embankmentGroup = new THREE.Group();
  embankmentGroup.name = 'riverEmbankment';

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.85,
    metalness: 0.15,
  });

  const sandbagMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.95,
  });

  const breachWaterMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xb91c1c,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.8,
  });

  // Segment 1: West of breach
  const w1Y = getTerrainHeight(-48, 18);
  const wall1Geo = new THREE.BoxGeometry(45, 4.5, 2.5);
  const wall1 = new THREE.Mesh(wall1Geo, wallMat);
  wall1.position.set(-48, w1Y + 2.25, 18);
  wall1.rotation.y = 0.15;
  wall1.castShadow = true;
  embankmentGroup.add(wall1);

  // Segment 2: East of breach
  const w2Y = getTerrainHeight(6, 23);
  const wall2Geo = new THREE.BoxGeometry(50, 4.5, 2.5);
  const wall2 = new THREE.Mesh(wall2Geo, wallMat);
  wall2.position.set(6, w2Y + 2.25, 23);
  wall2.rotation.y = -0.12;
  wall2.castShadow = true;
  embankmentGroup.add(wall2);

  // The Breach Gap at Road R17 / Zone C (x: -20 to -14, z: 20)
  const breachY = getTerrainHeight(-17, 20);
  if (isR17Blocked) {
    // Fractured concrete rubble in the breach
    for (let i = 0; i < 6; i++) {
      const rubbleGeo = new THREE.BoxGeometry(1.5 + Math.random(), 1 + Math.random(), 1.2 + Math.random());
      const rubble = new THREE.Mesh(rubbleGeo, wallMat);
      rubble.position.set(-20 + (i * 1.3), breachY + 0.4 + Math.random() * 0.8, 19 + (Math.random() - 0.5) * 2);
      rubble.rotation.set(Math.random() * 0.8, Math.random() * 0.8, Math.random() * 0.8);
      embankmentGroup.add(rubble);
    }

    // Gushing Flood Inundation Cut
    const surgeGeo = new THREE.PlaneGeometry(8, 12);
    surgeGeo.rotateX(-Math.PI / 2);
    const surge = new THREE.Mesh(surgeGeo, breachWaterMat);
    surge.position.set(-17, breachY + 0.4, 21);
    embankmentGroup.add(surge);

    // Hazard Pulsing Alert Beacon at Breach
    const hazardPillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.9 })
    );
    hazardPillar.position.set(-17, breachY + 4, 20);
    embankmentGroup.add(hazardPillar);
  } else {
    // Intact culvert section with sandbags
    const culvertGeo = new THREE.BoxGeometry(8, 4.5, 2.5);
    const culvert = new THREE.Mesh(culvertGeo, wallMat);
    culvert.position.set(-17, breachY + 2.25, 20);
    embankmentGroup.add(culvert);

    // Stacks of sandbags along embankment crest
    for (let x = -21; x <= -13; x += 1.8) {
      const bag = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.5, 8), sandbagMat);
      bag.rotation.z = Math.PI / 2;
      bag.position.set(x, breachY + 4.5, 20);
      embankmentGroup.add(bag);
    }
  }

  return embankmentGroup;
}

// 3. Realistic Settlement Clusters & Indian Riverfront Architecture
export function createHabitationStructures(): THREE.Group {
  const structuresGroup = new THREE.Group();
  structuresGroup.name = 'habitationBuildings';

  const hutMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9 }), // weathered timber
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4, metalness: 0.6 }), // zinc tin roof
    new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85 }), // terracotta brick
    new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 }), // blue plastic tarp
    new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.7 }), // painted brick
  ];

  const concreteMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    roughness: 0.8,
    metalness: 0.1,
  });

  const roofTileMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    roughness: 0.7,
  });

  // Helper to build a single hut/house positioned accurately on terrain
  const createHut = (x: number, z: number, w: number, h: number, d: number, rotY: number, matIndex: number) => {
    const yGround = getTerrainHeight(x, z);
    const house = new THREE.Group();
    house.position.set(x, yGround, z);
    house.rotation.y = rotY;

    // Solid Concrete Foundation Slab (extends downward into terrain to prevent slope clipping)
    const foundationGeo = new THREE.BoxGeometry(w * 1.05, 1.0, d * 1.05);
    const foundationMesh = new THREE.Mesh(foundationGeo, concreteMat);
    foundationMesh.position.y = 0.1;
    house.add(foundationMesh);

    // Base Walls
    const wallGeo = new THREE.BoxGeometry(w, h, d);
    const wallMesh = new THREE.Mesh(wallGeo, hutMaterials[matIndex % hutMaterials.length]);
    wallMesh.position.y = 0.6 + h / 2;
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    house.add(wallMesh);

    // Lit Warm Window
    const winMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.55), winMat);
    win.position.set(0, 0.6 + h * 0.55, d / 2 + 0.01);
    house.add(win);

    // Wooden stilts for flooded shanties near water level
    if (yGround < 2.5) {
      const stiltMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
      for (const sx of [-w/2.3, w/2.3]) {
        for (const sz of [-d/2.3, d/2.3]) {
          const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 6), stiltMat);
          stilt.position.set(sx, -0.6, sz);
          house.add(stilt);
        }
      }
    }

    // Gabled Roof
    const roofGeo = new THREE.ConeGeometry(Math.max(w, d) * 0.75, h * 0.6, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roofMesh = new THREE.Mesh(roofGeo, roofTileMat);
    roofMesh.position.y = 0.6 + h + (h * 0.3);
    roofMesh.castShadow = true;
    house.add(roofMesh);

    // Solar Panel on rooftop
    if (matIndex % 3 === 0) {
      const solarMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 });
      const solar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 1.1), solarMat);
      solar.position.set(0, 0.6 + h + h * 0.4, 0);
      solar.rotation.x = 0.25;
      house.add(solar);
    }

    structuresGroup.add(house);
  };

  // Helper to build multi-story brick/concrete buildings (Wards)
  const createUrbanBlock = (x: number, z: number, w: number, h: number, d: number, rotY: number) => {
    const yGround = getTerrainHeight(x, z);
    const building = new THREE.Group();
    building.position.set(x, yGround, z);
    building.rotation.y = rotY;

    // Solid Deep Foundation Block
    const foundationGeo = new THREE.BoxGeometry(w * 1.04, 1.4, d * 1.04);
    const foundationMesh = new THREE.Mesh(foundationGeo, concreteMat);
    foundationMesh.position.y = 0.2;
    building.add(foundationMesh);

    const blockGeo = new THREE.BoxGeometry(w, h, d);
    const blockMesh = new THREE.Mesh(blockGeo, concreteMat);
    blockMesh.position.y = 0.9 + h / 2;
    blockMesh.castShadow = true;
    blockMesh.receiveShadow = true;
    building.add(blockMesh);

    // Windows Grid
    const winMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    for (let floor = 1; floor <= Math.floor(h / 1.5); floor++) {
      for (let col = -w/3; col <= w/3; col += 1.6) {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.6), winMat);
        win.position.set(col, 0.9 + floor * 1.3, d/2 + 0.01);
        building.add(win);
      }
    }

    // Rooftop water tank & antenna
    const tankGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.2, 8);
    const tankMesh = new THREE.Mesh(tankGeo, hutMaterials[1]);
    tankMesh.position.set(w * 0.25, 0.9 + h + 0.6, d * 0.25);
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3, 6), hutMaterials[1]);
    antenna.position.set(-w * 0.25, 0.9 + h + 1.5, -d * 0.25);
    building.add(tankMesh, antenna);

    structuresGroup.add(building);
  };

  // --- ZONE C: Riverside Slums / Lower Valley Ward 7 (Around x: -22, z: 9) ---
  // High-density tin-roof settlement directly exposed to river breach
  for (let i = 0; i < 18; i++) {
    const hx = -26 + (i % 6) * 3.2 + (Math.random() - 0.5) * 1.5;
    const hz = 5 + Math.floor(i / 6) * 3.4 + (Math.random() - 0.5) * 1.5;
    createHut(hx, hz, 2.2, 1.8, 2.0, (Math.random() - 0.5) * 0.5, i);
  }

  // --- ZONE A: Ghat Confluence Basti (Around x: -43, z: 27) ---
  // Riverside ghat steps leading into water + dense dwellings
  const ghatY = getTerrainHeight(-45, 23);
  const ghatStepsGroup = new THREE.Group();
  for (let s = 0; s < 5; s++) {
    const stepGeo = new THREE.BoxGeometry(14, 0.6, 1.8);
    const step = new THREE.Mesh(stepGeo, concreteMat);
    step.position.set(-45, ghatY + 0.3 - s * 0.4, 23 + s * 1.5);
    ghatStepsGroup.add(step);
  }
  structuresGroup.add(ghatStepsGroup);

  for (let i = 0; i < 12; i++) {
    const hx = -50 + (i % 4) * 3.5;
    const hz = 27 + Math.floor(i / 4) * 3.6;
    createHut(hx, hz, 2.5, 2.2, 2.4, 0.2, (i + 2));
  }

  // Small Ghat Temple with Shikhara Dome
  const templeY = getTerrainHeight(-42, 25);
  const templeGroup = new THREE.Group();
  templeGroup.position.set(-42, templeY, 25);
  const templeBase = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 4), concreteMat);
  templeBase.position.y = 1.5;
  const templeDome = new THREE.Mesh(new THREE.ConeGeometry(2.5, 4, 8), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 }));
  templeDome.position.y = 5;
  templeGroup.add(templeBase, templeDome);
  structuresGroup.add(templeGroup);

  // --- ZONE B: North Mandi & Transport Nagar (Around x: -9, z: -18) ---
  // Industrial storage sheds and stacked cargo containers
  for (let w = 0; w < 4; w++) {
    createUrbanBlock(-12 + w * 6, -20, 5, 4.5, 8, 0);
  }
  // Cargo containers (Red, Blue, Yellow)
  const containerColors = [0xb91c1c, 0x1d4ed8, 0xd97706, 0x047857];
  const containerBaseY = getTerrainHeight(-8, -14);
  for (let c = 0; c < 6; c++) {
    const cMat = new THREE.MeshStandardMaterial({ color: containerColors[c % 4], roughness: 0.5, metalness: 0.4 });
    const cMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 5.5), cMat);
    cMesh.position.set(-8 + (c % 3) * 2.8, containerBaseY + 1.1 + Math.floor(c / 3) * 2.2, -14);
    structuresGroup.add(cMesh);
  }

  // --- ZONE D: Hillside Shanti Nagar (Around x: 22, z: -32, High Elevation on hill) ---
  for (let i = 0; i < 10; i++) {
    const hx = 18 + (i % 3) * 4.5;
    const hz = -35 + Math.floor(i / 3) * 4.2;
    createHut(hx, hz, 2.8, 2.4, 2.6, 0.4, i + 1);
  }

  // --- ZONE F: River Island Hamlet (Char) in middle of river (x: -18, z: -8) ---
  for (let i = 0; i < 5; i++) {
    createHut(-22 + i * 2.5, -8 + (i % 2) * 2, 1.8, 1.5, 1.8, 0.1, 0);
  }

  return structuresGroup;
}

// 4. Real Relief Shelter Infrastructure Compounds
export function createShelterFacilities(isS4Overloaded: boolean): THREE.Group {
  const shelterFacilitiesGroup = new THREE.Group();
  shelterFacilitiesGroup.name = 'shelterFacilities';

  const buildingMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.6,
    metalness: 0.2,
  });

  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.5,
  });

  const tentMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.8,
  });

  // --- Shelter S1: Govt Polytechnic Campus (x: -54, z: 32) ---
  const s1Y = getTerrainHeight(-54, 32);
  const s1Campus = new THREE.Group();
  s1Campus.position.set(-54, s1Y, 32);
  
  // Foundation Footing
  const s1Base = new THREE.Mesh(new THREE.BoxGeometry(16, 1.4, 12), buildingMat);
  s1Base.position.y = 0.2;
  s1Campus.add(s1Base);

  const s1Main = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 6), buildingMat);
  s1Main.position.y = 3.6;
  const s1Wing = new THREE.Mesh(new THREE.BoxGeometry(6, 5, 8), buildingMat);
  s1Wing.position.set(6, 3.1, 2);
  s1Campus.add(s1Main, s1Wing);

  // Red Cross Emergency Medical Tents in S1 Courtyard
  for (let t = 0; t < 3; t++) {
    const tent = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.8, 4), tentMat);
    tent.position.set(-4 + t * 3.5, 1.5, -6);
    s1Campus.add(tent);
  }
  shelterFacilitiesGroup.add(s1Campus);

  // --- Shelter S2: Nehru Indoor Sports Complex (x: -18, z: 2) ---
  const s2Y = getTerrainHeight(-18, 2);
  const s2Stadium = new THREE.Group();
  s2Stadium.position.set(-18, s2Y, 2);
  const domeGeo = new THREE.SphereGeometry(6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, roofMat);
  dome.position.y = 3.1;
  const domeBase = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 3.0, 16), buildingMat);
  domeBase.position.y = 1.5;
  s2Stadium.add(domeBase, dome);
  shelterFacilitiesGroup.add(s2Stadium);

  // --- Shelter S4: Town Community Hall (x: -11, z: 27) --- Overloaded Warning
  const s4Y = getTerrainHeight(-11, 27);
  const s4Hall = new THREE.Group();
  s4Hall.position.set(-11, s4Y, 27);
  const s4Base = new THREE.Mesh(new THREE.BoxGeometry(9, 1.2, 9), buildingMat);
  s4Base.position.y = 0.2;
  const s4Main = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 8), buildingMat);
  s4Main.position.y = 2.6;
  s4Hall.add(s4Base, s4Main);

  if (isS4Overloaded) {
    // Rooftop flashing amber/red overload beacon
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    beacon.position.y = 5.6;
    s4Hall.add(beacon);
  }
  shelterFacilitiesGroup.add(s4Hall);

  // --- Shelter S6: Elevated High-Ground Cyclone/Flood Shelter (x: 18, z: -45) ---
  const s6Y = getTerrainHeight(18, -45);
  const s6SafeHub = new THREE.Group();
  s6SafeHub.position.set(18, s6Y, -45);
  // Heavy reinforced concrete pillar platform
  const platform = new THREE.Mesh(new THREE.BoxGeometry(14, 3, 14), buildingMat);
  platform.position.y = 1.5;
  const superStructure = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 10), buildingMat);
  superStructure.position.y = 6;
  s6SafeHub.add(platform, superStructure);

  // Green Helipad on S6 Roof
  const helipadGeo = new THREE.RingGeometry(2, 3.8, 16);
  helipadGeo.rotateX(-Math.PI / 2);
  const helipadMat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide });
  const helipad = new THREE.Mesh(helipadGeo, helipadMat);
  helipad.position.y = 9.1;
  s6SafeHub.add(helipad);

  // Glowing Green Safe AI Corridor beacon
  const safePillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 30, 8),
    new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.65 })
  );
  safePillar.position.y = 24;
  s6SafeHub.add(safePillar);

  shelterFacilitiesGroup.add(s6SafeHub);

  return shelterFacilitiesGroup;
}

// 5. Environmental Foliage & Trees (Banyan, Sal, Palms along Indian river valleys)
export function createRiverineVegetation(): THREE.Group {
  const foliageGroup = new THREE.Group();
  foliageGroup.name = 'riverineTrees';

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
  const palmFoliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
  const banyanFoliageMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });

  const createTree = (x: number, z: number, isPalm: boolean) => {
    const yGround = getTerrainHeight(x, z);
    const tree = new THREE.Group();
    tree.position.set(x, yGround, z);

    if (isPalm) {
      // Slender curved trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 4.5, 6), trunkMat);
      trunk.position.y = 2.25;
      trunk.rotation.z = (Math.random() - 0.5) * 0.2;
      tree.add(trunk);

      // Frond canopy
      const canopy = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.8, 6), palmFoliageMat);
      canopy.position.y = 4.8;
      tree.add(canopy);
    } else {
      // Broadleaf Banyan tree
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 3, 6), trunkMat);
      trunk.position.y = 1.5;
      tree.add(trunk);

      const foliage = new THREE.Mesh(new THREE.SphereGeometry(2.2, 8, 8), banyanFoliageMat);
      foliage.position.y = 3.6;
      foliage.scale.set(1.2, 0.8, 1.2);
      tree.add(foliage);
    }

    foliageGroup.add(tree);
  };

  // Plant trees on safe hill slopes and river verges (avoiding deep water)
  const treeLocations = [
    // Hillside forest (x: 10 to 40, z: -60 to -20)
    { x: 12, y: 11, z: -35, palm: false },
    { x: 16, y: 13, z: -40, palm: true },
    { x: 26, y: 17, z: -48, palm: false },
    { x: 30, y: 19, z: -38, palm: true },
    { x: 35, y: 22, z: -50, palm: false },
    { x: 8, y: 8, z: -25, palm: true },
    { x: 22, y: 15, z: -28, palm: false },
    // South bank verges (z: 35 to 50)
    { x: -60, y: 3.5, z: 38, palm: true },
    { x: -50, y: 3.0, z: 42, palm: false },
    { x: -35, y: 3.2, z: 40, palm: true },
    { x: -20, y: 3.8, z: 36, palm: false },
    { x: -5, y: 3.5, z: 38, palm: true },
    { x: 10, y: 4.2, z: 35, palm: false },
    { x: 25, y: 5.0, z: 32, palm: true },
    { x: -45, y: 2.8, z: 48, palm: false },
  ];

  treeLocations.forEach(loc => {
    createTree(loc.x, loc.z, loc.palm);
  });

  return foliageGroup;
}

// 6. Asphalt Road Network with Streetlights
export function createRoadNetwork(): THREE.Group {
  const roadGroup = new THREE.Group();
  roadGroup.name = 'roadNetwork';

  const asphaltMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.9,
    metalness: 0.1,
  });

  const lampLightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

  // Main East-West Highway 31 along Embankment
  const mainRoadPoints: THREE.Vector3[] = [];
  for (let x = -70; x <= 45; x += 5) {
    const y = getTerrainHeight(x, 18) + 0.15;
    mainRoadPoints.push(new THREE.Vector3(x, y, 18));
  }
  const curve = new THREE.CatmullRomCurve3(mainRoadPoints);
  const roadGeo = new THREE.TubeGeometry(curve, 64, 1.6, 8, false);
  const roadMesh = new THREE.Mesh(roadGeo, asphaltMat);
  roadGroup.add(roadMesh);

  // Evacuation Road up Nilachal Hill to Shelter S6
  const hillRoadPoints: THREE.Vector3[] = [];
  for (let t = 0; t <= 1; t += 0.08) {
    const x = -10 + t * 28;
    const z = 18 - t * 63;
    const y = getTerrainHeight(x, z) + 0.18;
    hillRoadPoints.push(new THREE.Vector3(x, y, z));
  }
  const hillCurve = new THREE.CatmullRomCurve3(hillRoadPoints);
  const hillRoadGeo = new THREE.TubeGeometry(hillCurve, 48, 1.4, 8, false);
  const hillRoadMesh = new THREE.Mesh(hillRoadGeo, asphaltMat);
  roadGroup.add(hillRoadMesh);

  // Streetlight Posts along highway
  for (let x = -60; x <= 40; x += 18) {
    const yGround = getTerrainHeight(x, 19.5);
    const pole = new THREE.Group();
    pole.position.set(x, yGround, 19.5);

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 5, 8), asphaltMat);
    post.position.y = 2.5;

    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), lampLightMat);
    lamp.position.set(0, 5, 0.4);

    pole.add(post, lamp);
    roadGroup.add(pole);
  }

  return roadGroup;
}

// 7. Mobile Disaster Assets: NDRF Orange Rescue Boats, Drone & SAR Helicopter
export function createMobileRescueAssets(): {
  group: THREE.Group;
  update: (time: number, targetHabPos?: { x: number; y: number; z: number }) => void;
} {
  const assetsGroup = new THREE.Group();
  assetsGroup.name = 'mobileRescueAssets';

  const boatMat = new THREE.MeshStandardMaterial({
    color: 0xea580c, // NDRF High-Visibility Orange
    roughness: 0.4,
    metalness: 0.3,
  });

  const droneBodyMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.8,
    roughness: 0.2,
  });

  const lightBeamMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
  });

  const wakeMat = new THREE.MeshBasicMaterial({
    color: 0xf8fafc,
    transparent: true,
    opacity: 0.6,
  });

  // --- Boat 1: Patrolling near river breach ---
  const boat1 = new THREE.Group();
  const hull1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 4.5), boatMat);
  hull1.position.y = 0.35;
  const cabin1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 1.8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  cabin1.position.set(0, 1.0, -0.6);

  // Boat 1 Water Wake
  const wake1 = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 7), wakeMat);
  wake1.rotateX(-Math.PI / 2);
  wake1.position.set(0, 0.05, 4.5);
  boat1.add(hull1, cabin1, wake1);
  assetsGroup.add(boat1);

  // --- Boat 2: Patrolling near Saraighat Bridge piers ---
  const boat2 = new THREE.Group();
  const hull2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.7, 4.0), boatMat);
  hull2.position.y = 0.35;

  const wake2 = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 6), wakeMat);
  wake2.rotateX(-Math.PI / 2);
  wake2.position.set(0, 0.05, 4.0);
  boat2.add(hull2, wake2);
  assetsGroup.add(boat2);

  // --- HAL Dhruv NDRF SAR Helicopter Hovering over S6 Helipad ---
  const chopper = new THREE.Group();
  chopper.name = 'rescueChopper';

  const copterBodyMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.3, metalness: 0.5 });
  const copterGlassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, metalness: 0.9 });
  const rotorBladeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b, transparent: true, opacity: 0.85 });

  // Fuselage
  const fuselage = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 6), copterBodyMat);
  fuselage.position.y = 0.9;
  const nose = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 12), copterGlassMat);
  nose.position.set(0, 0.9, 3.1);
  nose.scale.set(1, 0.8, 1.2);
  const tailBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, 5, 8), copterBodyMat);
  tailBoom.rotation.x = Math.PI / 2;
  tailBoom.position.set(0, 1.1, -4.5);
  chopper.add(fuselage, nose, tailBoom);

  // Main Rotor Hub & 4 Blades
  const mainRotorGroup = new THREE.Group();
  mainRotorGroup.position.set(0, 2.2, 0);
  for (let r = 0; r < 4; r++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 7), rotorBladeMat);
    blade.rotation.y = (r * Math.PI) / 2;
    mainRotorGroup.add(blade);
  }
  chopper.add(mainRotorGroup);

  // Tail Rotor
  const tailRotor = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.6, 0.25), rotorBladeMat);
  tailRotor.position.set(0.4, 1.5, -6.8);
  chopper.add(tailRotor);

  // Downward Searchlight
  const chopperLight = new THREE.Mesh(
    new THREE.ConeGeometry(6, 22, 16, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.22, side: THREE.DoubleSide })
  );
  chopperLight.rotateX(Math.PI);
  chopperLight.position.set(0, -10, 1.5);
  chopper.add(chopperLight);

  assetsGroup.add(chopper);

  // --- Search & Rescue Drone with Downward Conical Spotlight ---
  const drone = new THREE.Group();
  drone.name = 'rescueDrone';

  // Drone Quadcopter Chassis
  const droneChassis = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.5, 2.5), droneBodyMat);
  drone.add(droneChassis);

  // 4 Rotors
  const rotorGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.05, 8);
  const rotorMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.7 });
  const rotors: THREE.Mesh[] = [];
  [[-1.4, -1.4], [1.4, -1.4], [-1.4, 1.4], [1.4, 1.4]].forEach(([rx, rz]) => {
    const rotor = new THREE.Mesh(rotorGeo, rotorMat);
    rotor.position.set(rx, 0.3, rz);
    drone.add(rotor);
    rotors.push(rotor);
  });

  // Flashing Navigation Strobe
  const strobe = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xef4444 })
  );
  strobe.position.y = 0.4;
  drone.add(strobe);

  // Conical Spotlight Beam pointing down to ground
  const spotlightGeo = new THREE.ConeGeometry(7, 24, 16, 1, true);
  spotlightGeo.rotateX(Math.PI);
  const spotlightMesh = new THREE.Mesh(spotlightGeo, lightBeamMat);
  spotlightMesh.position.y = -12;
  drone.add(spotlightMesh);

  assetsGroup.add(drone);

  // Update loop for boat movement, rotor spin, chopper hover, and drone tracking
  const update = (time: number, targetHabPos?: { x: number; y: number; z: number }) => {
    // Boat 1 gentle river patrol motion
    boat1.position.x = -24 + Math.sin(time * 0.6) * 8;
    boat1.position.z = 12 + Math.cos(time * 0.4) * 5;
    boat1.position.y = -1.2 + Math.sin(time * 2) * 0.15;
    boat1.rotation.y = Math.sin(time * 0.6) * 0.4;
    boat1.rotation.z = Math.sin(time * 1.5) * 0.05;

    // Boat 2 bridge approach patrol
    boat2.position.x = -45 + Math.cos(time * 0.5) * 12;
    boat2.position.z = -30 + Math.sin(time * 0.5) * 6;
    boat2.position.y = -1.2 + Math.cos(time * 1.8) * 0.15;
    boat2.rotation.y = -time * 0.5;

    // Chopper hovering above Nilachal Helipad S6
    const s6Y = getTerrainHeight(18, -45);
    chopper.position.set(18 + Math.sin(time * 0.8) * 2, s6Y + 28 + Math.cos(time * 1.5) * 1.2, -45 + Math.cos(time * 0.8) * 2);
    chopper.rotation.y = time * 0.2;
    chopper.rotation.z = Math.sin(time * 1.5) * 0.04;
    mainRotorGroup.rotation.y += 0.8;
    tailRotor.rotation.x += 1.2;

    // Spin drone rotors
    rotors.forEach(r => {
      r.rotation.y += 0.4;
    });

    // Drone tracks target habitation or patrols Zone C breach
    const targetX = targetHabPos ? targetHabPos.x : -22;
    const targetZ = targetHabPos ? targetHabPos.z : 12;
    const targetY = targetHabPos ? targetHabPos.y + 24 : 26;

    drone.position.x += (targetX + Math.sin(time * 1.2) * 4 - drone.position.x) * 0.05;
    drone.position.z += (targetZ + Math.cos(time * 1.2) * 4 - drone.position.z) * 0.05;
    drone.position.y += (targetY + Math.sin(time * 2) * 1.2 - drone.position.y) * 0.05;

    drone.rotation.z = Math.sin(time * 1.2) * 0.1;
    drone.rotation.x = Math.cos(time * 1.2) * 0.1;
  };

  return { group: assetsGroup, update };
}
