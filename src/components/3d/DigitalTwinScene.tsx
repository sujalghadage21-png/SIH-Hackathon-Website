import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useDisaster } from '../../context/DisasterContext';
import {
  createSaraighatBridge,
  createRiverEmbankments,
  createHabitationStructures,
  createShelterFacilities,
  createRiverineVegetation,
  createMobileRescueAssets,
  createRoadNetwork,
  getTerrainHeight
} from './structureBuilders';

export type CameraPreset = 'DEFAULT' | 'BRIDGE' | 'BREACH' | 'SHELTER_S6' | 'DRONE';

interface DigitalTwinSceneProps {
  interactive?: boolean;
  cameraDistance?: number;
  height?: string;
  showLayerToggles?: boolean;
  cameraPreset?: CameraPreset;
}

export const DigitalTwinScene: React.FC<DigitalTwinSceneProps> = ({
  interactive = true,
  cameraDistance = 190,
  height = '100%',
  showLayerToggles = false,
  cameraPreset = 'DEFAULT',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    habitations,
    shelters,
    routes,
    params,
    isR17Blocked,
    isS4Overloaded,
    selectedHabitationId,
    setSelectedHabitationId,
    setActiveTab,
    theme
  } = useDisaster();

  // Layer toggles
  const [showTerrain, setShowTerrain] = useState(true);
  const [showWater, setShowWater] = useState(true);
  const [showStructures, setShowStructures] = useState(true);
  const [showBridge, setShowBridge] = useState(true);
  const [showAssets, setShowAssets] = useState(true);
  const [showVegetation, setShowVegetation] = useState(true);
  const [showHabitations, setShowHabitations] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);

  // 3D Projected Screen HUD Callout Badges
  const [hudBadges, setHudBadges] = useState<
    { id: string; code: string; name: string; type: 'habitation' | 'shelter'; x: number; y: number; color: string; info: string }[]
  >([]);

  // Hover state for 3D marker
  const [hoveredEntity, setHoveredEntity] = useState<{
    type: 'habitation' | 'shelter';
    id: string;
    name: string;
    code: string;
    score?: number;
    occupancy?: number;
    x: number;
    y: number;
  } | null>(null);

  // Refs for three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const markerGroupRef = useRef<THREE.Group | null>(null);
  const routesGroupRef = useRef<THREE.Group | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const bridgeRef = useRef<THREE.Group | null>(null);
  const embankmentRef = useRef<THREE.Group | null>(null);
  const structuresRef = useRef<THREE.Group | null>(null);
  const shelterFacilitiesRef = useRef<THREE.Group | null>(null);
  const vegetationRef = useRef<THREE.Group | null>(null);
  const roadNetworkRef = useRef<THREE.Group | null>(null);
  const mobileAssetsRef = useRef<ReturnType<typeof createMobileRescueAssets> | null>(null);

  // Smooth camera target state
  const cameraTargetRef = useRef({
    pos: new THREE.Vector3(0, 110, cameraDistance),
    lookAt: new THREE.Vector3(0, 0, 0),
  });

  const controlsRef = useRef<OrbitControls | null>(null);
  const isUserInteractingRef = useRef(false);

  // Camera preset handler
  useEffect(() => {
    const target = cameraTargetRef.current;
    if (cameraPreset === 'BRIDGE') {
      target.pos.set(-65, 40, 10);
      target.lookAt.set(-25, 8.5, -45);
    } else if (cameraPreset === 'BREACH') {
      const breachY = getTerrainHeight(-17, 20);
      target.pos.set(-40, breachY + 24, 65);
      target.lookAt.set(-18, breachY + 2, 18);
    } else if (cameraPreset === 'SHELTER_S6') {
      const s6Y = getTerrainHeight(18, -50);
      target.pos.set(50, s6Y + 30, -20);
      target.lookAt.set(18, s6Y + 4, -50);
    } else if (cameraPreset === 'DRONE') {
      target.pos.set(-20, 80, 60);
      target.lookAt.set(-25, 14, 15);
    } else {
      // Default overview — wider to see the 350m terrain
      target.pos.set(0, 140, cameraDistance);
      target.lookAt.set(0, 4, 0);
    }
    isUserInteractingRef.current = false;
  }, [cameraPreset, cameraDistance]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const heightPx = container.clientHeight || 500;

    // 1. Scene setup
    const isLight = theme === 'light';
    const bgColor = isLight ? 0xf1f5f9 : 0x040711;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, 0.0022);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 1, 1800);
    camera.position.copy(cameraTargetRef.current.pos);
    camera.lookAt(cameraTargetRef.current.lookAt);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Tactical & Environmental Lighting
    const ambientLight = new THREE.AmbientLight(isLight ? 0xffffff : 0x38bdf8, isLight ? 1.0 : 0.65);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    sunLight.position.set(90, 150, 70);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 400;
    sunLight.shadow.camera.left = -180;
    sunLight.shadow.camera.right = 180;
    sunLight.shadow.camera.top = 180;
    sunLight.shadow.camera.bottom = -180;
    scene.add(sunLight);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 2, 220);
    cyanPointLight.position.set(-60, 45, -40);
    scene.add(cyanPointLight);

    const hazardPointLight = new THREE.PointLight(0xef4444, 2.5, 200);
    hazardPointLight.position.set(-18, 25, 20); // Focused at breach
    scene.add(hazardPointLight);

    // Atmospheric Haze & Cloud Group
    const cloudGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xffffff : 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      roughness: 1.0,
    });
    for (let c = 0; c < 8; c++) {
      const cloud = new THREE.Mesh(new THREE.SphereGeometry(18 + Math.random() * 12, 12, 12), cloudMat);
      cloud.position.set(-100 + c * 30, 85 + Math.random() * 10, -80 + (c % 3) * 50);
      cloud.scale.set(2, 0.4, 1.2);
      cloudGroup.add(cloud);
    }
    scene.add(cloudGroup);

    // 5. Realistic Brahmaputra River Basin Topographic Terrain Mesh
    const terrainSize = 350;
    const terrainSegments = 110;
    const terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSegments, terrainSegments);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      let y = getTerrainHeight(x, z);
      pos.setY(i, y);

      const color = new THREE.Color();
      const riverCenterZ = -40 + Math.sin(x * 0.024) * 30;
      const riverDist = Math.abs(z - riverCenterZ);

      if (y < -3) {
        // Deep riverbed
        color.setHex(isLight ? 0x94a3b8 : 0x0f172a);
      } else if (y < 2 && riverDist < 42) {
        // Sandy riverbank
        color.setHex(isLight ? 0xcbd5e1 : 0x1e293b);
      } else if (y > 14) {
        // Hill slopes
        color.setHex(isLight ? 0x64748b : 0x0f291e);
      } else {
        // Floodplain
        color.setHex(isLight ? 0xcbd5e1 : 0x0a1628);
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: false,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);
    terrainMeshRef.current = terrainMesh;

    // Grid wireframe overlay for tactical GIS elevation contour aesthetic
    const gridWireframeMat = new THREE.MeshBasicMaterial({
      color: isLight ? 0x94a3b8 : 0x1e3a5f,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.25 : 0.4,
    });
    const terrainWireframe = new THREE.Mesh(terrainGeo, gridWireframeMat);
    terrainWireframe.position.y += 0.15;
    scene.add(terrainWireframe);

    // 6. Dynamic Flood Water Plane with Realistic Wave Physics & Royal Ocean Blue Color
    const waterGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, 110, 110);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0077b6, // Luminous Royal River Blue
      emissive: 0x0096c7, // Glowing azure cyan highlight
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.90,
      roughness: 0.05,
      metalness: 0.65,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = -1.0; // Baseline visible river height
    scene.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // 7. REAL PLACE STRUCTURES INTEGRATION
    // Saraighat Bridge across Brahmaputra
    const bridge = createSaraighatBridge();
    scene.add(bridge);
    bridgeRef.current = bridge;

    // Road Network
    const roads = createRoadNetwork();
    scene.add(roads);
    roadNetworkRef.current = roads;

    // River Embankment Walls & Breach Point
    const embankment = createRiverEmbankments(isR17Blocked);
    scene.add(embankment);
    embankmentRef.current = embankment;

    // Habitation Settlement Clusters (Slum shanties, brick wards, ghats, temple)
    const structures = createHabitationStructures();
    scene.add(structures);
    structuresRef.current = structures;

    // Relief Shelters & Compounds (Schools, Sports Arena, Elevated Cyclone Shelter S6)
    const shelterFacilities = createShelterFacilities(isS4Overloaded);
    scene.add(shelterFacilities);
    shelterFacilitiesRef.current = shelterFacilities;

    // Riverine Trees & Vegetation
    const vegetation = createRiverineVegetation();
    scene.add(vegetation);
    vegetationRef.current = vegetation;

    // Mobile Disaster Assets (NDRF Orange Boats & Searchlight Drone)
    const mobileAssets = createMobileRescueAssets();
    scene.add(mobileAssets.group);
    mobileAssetsRef.current = mobileAssets;

    // 8. Groups for dynamic tactical markers and routes
    const markerGroup = new THREE.Group();
    scene.add(markerGroup);
    markerGroupRef.current = markerGroup;

    const routesGroup = new THREE.Group();
    scene.add(routesGroup);
    routesGroupRef.current = routesGroup;

    // 9. OrbitControls & Raycasting Interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent camera sinking under ground
    controls.minDistance = 20;
    controls.maxDistance = 380;
    controls.enabled = interactive;
    controlsRef.current = controls;

    controls.addEventListener('start', () => {
      isUserInteractingRef.current = true;
    });

    const onMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / heightPx) * 2 + 1;

      // Raycast check for marker hover
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObjects(markerGroup.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.entityId && obj.parent) {
          obj = obj.parent;
        }
        if (obj?.userData?.entityId) {
          setHoveredEntity({
            type: obj.userData.type,
            id: obj.userData.entityId,
            name: obj.userData.name,
            code: obj.userData.code,
            score: obj.userData.score,
            occupancy: obj.userData.occupancy,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          container.style.cursor = 'pointer';
        }
      } else {
        setHoveredEntity(null);
        container.style.cursor = 'default';
      }
    };

    const onClick = () => {
      if (hoveredEntity && hoveredEntity.type === 'habitation') {
        setSelectedHabitationId(hoveredEntity.id);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onClick);

    // 10. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation to target when not actively dragging
      if (!isUserInteractingRef.current) {
        camera.position.lerp(cameraTargetRef.current.pos, 0.04);
        controls.target.lerp(cameraTargetRef.current.lookAt, 0.04);
      }

      controls.update();

      // Real oceanic / river fluid wave physics displacement
      if (waterMeshRef.current) {
        const waterPos = waterMeshRef.current.geometry.attributes.position;
        const time = elapsedTime * 2.2;
        for (let i = 0; i < waterPos.count; i++) {
          const u = waterPos.getX(i);
          const v = waterPos.getY(i);

          const w1 = Math.sin(u * 0.045 + time * 1.3) * 0.85;
          const w2 = Math.cos(v * 0.065 + time * 1.6) * 0.65;
          const w3 = Math.sin((u + v) * 0.08 + time * 2.4) * 0.45;

          waterPos.setZ(i, w1 + w2 + w3);
        }
        waterPos.needsUpdate = true;
      }

      // Update NDRF Boats, Rotor Spin, Chopper & Drone Tracking
      if (mobileAssetsRef.current) {
        let targetPos: { x: number; y: number; z: number } | undefined;
        const targetHab = habitations.find(h => h.id === selectedHabitationId);
        if (targetHab) {
          const worldX = (targetHab.coords.x - 50) * 2.6;
          const worldZ = (targetHab.coords.y - 50) * 2.6;
          targetPos = {
            x: worldX,
            y: getTerrainHeight(worldX, worldZ) + 1,
            z: worldZ,
          };
        }
        mobileAssetsRef.current.update(elapsedTime, targetPos);
      }

      // Pulse beacon rings and rotate floating diamond heads
      if (markerGroupRef.current) {
        markerGroupRef.current.children.forEach(child => {
          const ring = child.getObjectByName('pulseRing');
          if (ring) {
            const scale = 1 + (Math.sin(elapsedTime * 3.5 + child.position.x) * 0.5 + 0.5) * 0.7;
            ring.scale.set(scale, scale, scale);
          }
          const head = child.getObjectByName('beaconHead');
          if (head) {
            head.rotation.y = elapsedTime * 1.5;
            head.position.y = 20 + Math.sin(elapsedTime * 2.5 + child.position.z) * 1.2;
          }
        });
      }

      // Update projected 2D HUD badges above 3D beacons
      if (container && camera) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        const projVec = new THREE.Vector3();
        const nextBadges: { id: string; code: string; name: string; type: 'habitation' | 'shelter'; x: number; y: number; color: string; info: string }[] = [];

        if (showHabitations) {
          const keyHabs = habitations.filter(h => ['zone-c', 'zone-a', 'zone-e', 'zone-b'].includes(h.id));
          keyHabs.forEach(hab => {
            const wx = (hab.coords.x - 50) * 2.6;
            const wz = (hab.coords.y - 50) * 2.6;
            const wy = getTerrainHeight(wx, wz) + 24;
            projVec.set(wx, wy, wz).project(camera);

            if (projVec.z < 1.0) {
              const sx = (projVec.x * 0.5 + 0.5) * w;
              const sy = (-projVec.y * 0.5 + 0.5) * h;
              let c = '#10b981';
              if (hab.riskCategory === 'RED') c = '#ef4444';
              else if (hab.riskCategory === 'ORANGE') c = '#f97316';
              else if (hab.riskCategory === 'YELLOW') c = '#eab308';

              nextBadges.push({
                id: hab.id,
                code: hab.code,
                name: hab.name,
                type: 'habitation',
                x: sx,
                y: sy,
                color: c,
                info: `RISK ${hab.riskCategory}`,
              });
            }
          });
        }

        if (showShelters) {
          const keyShelters = shelters.filter(s => ['s4', 's6'].includes(s.id));
          keyShelters.forEach(shelter => {
            const wx = (shelter.coords.x - 50) * 2.6;
            const wz = (shelter.coords.y - 50) * 2.6;
            const wy = getTerrainHeight(wx, wz) + 26;
            projVec.set(wx, wy, wz).project(camera);

            if (projVec.z < 1.0) {
              const sx = (projVec.x * 0.5 + 0.5) * w;
              const sy = (-projVec.y * 0.5 + 0.5) * h;
              const isOverloaded = shelter.status === 'OVERLOAD' || (shelter.id === 's4' && isS4Overloaded);
              const c = isOverloaded ? '#ef4444' : (shelter.status === 'WARNING' ? '#f59e0b' : '#06b6d4');

              nextBadges.push({
                id: shelter.id,
                code: shelter.code,
                name: shelter.name,
                type: 'shelter',
                x: sx,
                y: sy,
                color: c,
                info: isOverloaded ? 'OVERLOAD' : `${shelter.occupancyPct}% OCC`,
              });
            }
          });
        }
        setHudBadges(nextBadges);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', onClick);
      controls.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };

  }, [cameraDistance, interactive, theme]);

  // Update Dynamic Flood Water Level based on Precipitation and River Gauge
  useEffect(() => {
    if (!waterMeshRef.current) return;

    let baseHeight = -1.0;
    if (params.riverStage === 'WARNING') baseHeight = 2.5;
    if (params.riverStage === 'DANGER') baseHeight = 5.5;
    if (params.riverStage === 'BREACH') baseHeight = 9.0;

    const floodHeight = baseHeight + (params.rainfallPct / 100) * 7.5;
    waterMeshRef.current.position.y = floodHeight;

    const mat = waterMeshRef.current.material as THREE.MeshStandardMaterial;
    if (params.riverStage === 'BREACH' || params.rainfallPct > 60) {
      mat.color.setHex(0xdc2626); // Crimson danger breach
      mat.emissive.setHex(0x991b1b);
      mat.emissiveIntensity = 0.55;
      mat.opacity = 0.92;
    } else {
      mat.color.setHex(theme === 'light' ? 0x0284c7 : 0x00b4d8); // Bright luminous river cyan
      mat.emissive.setHex(0x0369a1);
      mat.emissiveIntensity = 0.35;
      mat.opacity = 0.88;
    }
  }, [params.rainfallPct, params.riverStage, theme]);

  // Update Embankment Breach State when R17 status changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (embankmentRef.current) {
      scene.remove(embankmentRef.current);
    }
    const newEmbankment = createRiverEmbankments(isR17Blocked);
    scene.add(newEmbankment);
    embankmentRef.current = newEmbankment;
  }, [isR17Blocked]);

  // Toggle Visibility of Individual Real World Feature Layers
  useEffect(() => {
    if (terrainMeshRef.current) terrainMeshRef.current.visible = showTerrain;
    if (waterMeshRef.current) waterMeshRef.current.visible = showWater;
    if (structuresRef.current) structuresRef.current.visible = showStructures;
    if (bridgeRef.current) bridgeRef.current.visible = showBridge;
    if (embankmentRef.current) embankmentRef.current.visible = showBridge;
    if (shelterFacilitiesRef.current) shelterFacilitiesRef.current.visible = showShelters;
    if (vegetationRef.current) vegetationRef.current.visible = showVegetation;
    if (mobileAssetsRef.current) mobileAssetsRef.current.group.visible = showAssets;
  }, [showTerrain, showWater, showStructures, showBridge, showShelters, showVegetation, showAssets]);

  // Render High-Visibility 3D Sky Beacons for Habitations and Shelters
  useEffect(() => {
    const group = markerGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (showHabitations) {
      const keyHabs = habitations.filter(h => ['zone-c', 'zone-a', 'zone-e', 'zone-b'].includes(h.id));
      keyHabs.forEach(hab => {
        const worldX = (hab.coords.x - 50) * 2.6;
        const worldZ = (hab.coords.y - 50) * 2.6;
        const worldY = getTerrainHeight(worldX, worldZ);

        const habObj = new THREE.Group();
        habObj.position.set(worldX, worldY, worldZ);
        habObj.userData = {
          type: 'habitation',
          entityId: hab.id,
          name: hab.name,
          code: hab.code,
          score: hab.finalPriorityScore,
        };

        let colorHex = 0x10b981;
        if (hab.riskCategory === 'RED') colorHex = 0xef4444;
        else if (hab.riskCategory === 'ORANGE') colorHex = 0xf97316;
        else if (hab.riskCategory === 'YELLOW') colorHex = 0xeab308;

        // 1. Towering Sky Light Beam Pillar (42 meters tall)
        const pillarGeo = new THREE.CylinderGeometry(0.35, 1.0, 42, 16);
        const pillarMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.65,
        });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.y = 21;
        habObj.add(pillar);

        // 2. Floating Glowing 3D Diamond Head (Hovering high at y=20m above buildings)
        const diamondGeo = new THREE.OctahedronGeometry(2.5, 0);
        const diamondMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 1.35,
          metalness: 0.2,
          roughness: 0.1,
        });
        const diamond = new THREE.Mesh(diamondGeo, diamondMat);
        diamond.name = 'beaconHead';
        diamond.position.y = 20;
        habObj.add(diamond);

        // 3. Concrete Base Anchor Pin
        const basePinGeo = new THREE.CylinderGeometry(0.8, 1.4, 4.5, 12);
        const basePinMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 0.8,
          roughness: 0.2,
        });
        const basePin = new THREE.Mesh(basePinGeo, basePinMat);
        basePin.position.y = 2.25;
        habObj.add(basePin);

        // 4. Ground Pulsing Outer Ring
        const ringGeo = new THREE.RingGeometry(3.5, 5.2, 28);
        ringGeo.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.75,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.name = 'pulseRing';
        ring.position.y = 0.65;
        habObj.add(ring);

        group.add(habObj);
      });
    }

    if (showShelters) {
      const keyShelters = shelters.filter(s => ['s4', 's6'].includes(s.id));
      keyShelters.forEach(shelter => {
        const worldX = (shelter.coords.x - 50) * 2.6;
        const worldZ = (shelter.coords.y - 50) * 2.6;
        const worldY = getTerrainHeight(worldX, worldZ);

        const shelterObj = new THREE.Group();
        shelterObj.position.set(worldX, worldY, worldZ);
        shelterObj.userData = {
          type: 'shelter',
          entityId: shelter.id,
          name: shelter.name,
          code: shelter.code,
          occupancy: shelter.occupancyPct,
        };

        const isOverloaded = shelter.status === 'OVERLOAD' || (shelter.id === 's4' && isS4Overloaded);
        const colorHex = isOverloaded ? 0xef4444 : (shelter.status === 'WARNING' ? 0xf59e0b : 0x06b6d4);

        // 1. Shelter Sky Light Beam (48 meters tall)
        const pillarGeo = new THREE.CylinderGeometry(0.5, 1.2, 48, 16);
        const pillarMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.75,
        });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.y = 24;
        shelterObj.add(pillar);

        // 2. Floating 3D Crest Ring (Hovering at y=23m)
        const crestGeo = new THREE.TorusGeometry(2.4, 0.45, 12, 24);
        crestGeo.rotateX(Math.PI / 2);
        const crestMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 1.5,
          roughness: 0.1,
        });
        const crest = new THREE.Mesh(crestGeo, crestMat);
        crest.name = 'beaconHead';
        crest.position.y = 23;
        shelterObj.add(crest);

        // 3. Elevated Shelter Tower Block
        const cubeGeo = new THREE.BoxGeometry(4.2, 5.5, 4.2);
        const cubeMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 0.85,
          roughness: 0.2,
        });
        const cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.position.y = 2.75;
        shelterObj.add(cube);

        // 4. Ground Pulse Ring
        const ringGeo = new THREE.RingGeometry(4.0, 6.0, 32);
        ringGeo.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.name = 'pulseRing';
        ring.position.y = 0.65;
        shelterObj.add(ring);

        group.add(shelterObj);
      });
    }
  }, [habitations, shelters, showHabitations, showShelters, selectedHabitationId, isS4Overloaded]);

  // Evacuation Corridors 3D Splines
  useEffect(() => {
    const routesGroup = routesGroupRef.current;
    if (!routesGroup) return;

    while (routesGroup.children.length > 0) {
      routesGroup.remove(routesGroup.children[0]);
    }

    if (!showRoutes) return;

    routes.forEach(route => {
      const points = route.path.map(pt => {
        const x = (pt[0] - 50) * 2.6;
        const z = (pt[1] - 50) * 2.6;
        const groundY = getTerrainHeight(x, z);
        return new THREE.Vector3(x, groundY + (route.isRecommended ? 1.8 : 1.2), z);
      });

      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, route.isRecommended ? 0.8 : 0.4, 8, false);

      let routeColor = 0x64748b;
      if (route.id === 'route-b') {
        routeColor = isR17Blocked ? 0xef4444 : 0xf59e0b;
      } else if (route.id === 'route-d' && route.isRecommended) {
        routeColor = 0x10b981; // Safe AI Green Bypass
      } else if (route.id === 'route-a') {
        routeColor = 0xf97316;
      }

      const tubeMat = new THREE.MeshStandardMaterial({
        color: routeColor,
        emissive: routeColor,
        emissiveIntensity: route.isRecommended ? 0.75 : 0.35,
        roughness: 0.2,
      });

      const routeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      routesGroup.add(routeMesh);
    });
  }, [routes, showRoutes, isR17Blocked]);

  return (
    <div className="relative w-full overflow-hidden select-none bg-tactical-bg" style={{ height }}>
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Real Structure & GIS Layer Toggles HUD */}
      {showLayerToggles && (
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 p-2 rounded-xl glass-panel text-[11px] font-mono max-w-xl shadow-xl">
          <button
            onClick={() => setShowTerrain(!showTerrain)}
            className={`px-2 py-1 rounded border transition-colors ${showTerrain ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
          >
            TERRAIN
          </button>
          <button
            onClick={() => setShowWater(!showWater)}
            className={`px-2 py-1 rounded border transition-colors ${showWater ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
          >
            FLOOD PLANE
          </button>
          <button
            onClick={() => setShowBridge(!showBridge)}
            className={`px-2 py-1 rounded border transition-colors ${showBridge ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
          >
            BRIDGE & DIKES
          </button>
          <button
            onClick={() => setShowStructures(!showStructures)}
            className={`px-2 py-1 rounded border transition-colors ${showStructures ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
          >
            SETTLEMENTS
          </button>
          <button
            onClick={() => setShowVegetation(!showVegetation)}
            className={`px-2 py-1 rounded border transition-colors ${showVegetation ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
          >
            TREES
          </button>
          <button
            onClick={() => setShowAssets(!showAssets)}
            className={`px-2 py-1 rounded border transition-colors ${showAssets ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
          >
            NDRF BOATS & DRONE
          </button>
          <button
            onClick={() => setShowHabitations(!showHabitations)}
            className={`px-2 py-1 rounded border transition-colors ${showHabitations ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
          >
            BEACONS
          </button>
          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-2 py-1 rounded border transition-colors ${showRoutes ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
          >
            ROUTES
          </button>
        </div>
      )}

      {/* 3D Projected Floating Tactical HUD Callout Badges */}
      {hudBadges.map(badge => (
        <div
          key={badge.id}
          onClick={() => {
            if (badge.type === 'habitation') setSelectedHabitationId(badge.id);
          }}
          className="absolute z-20 -translate-x-1/2 -translate-y-full pointer-events-auto cursor-pointer group transition-transform hover:scale-110"
          style={{ left: `${badge.x}px`, top: `${badge.y}px` }}
        >
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-display shadow-2xl border-2 backdrop-blur-xl transition-all duration-200 group-hover:-translate-y-1"
            style={{ 
              borderColor: `${badge.color}88`,
              backgroundColor: 'rgba(4, 7, 17, 0.85)', // Dark robust background guaranteed to stand out
              boxShadow: `0 4px 20px -2px ${badge.color}40, inset 0 0 12px ${badge.color}20`
            }}
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: badge.color }} />
              <span className="relative w-2 h-2 rounded-full" style={{ backgroundColor: badge.color, boxShadow: `0 0 8px ${badge.color}` }} />
            </div>
            
            <div className="flex flex-col drop-shadow-md">
              <span className="font-bold text-[13px] tracking-wide text-white leading-tight">
                {badge.code}
              </span>
              <span className="text-[10px] font-bold tracking-wider" style={{ color: badge.color }}>
                {badge.info}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Hover Entity HUD Tooltip */}
      {hoveredEntity && (
        <div
          className="absolute z-30 pointer-events-none p-3 rounded-xl glass-panel text-xs font-mono space-y-1 shadow-2xl border border-cyan-500/60 backdrop-blur-md"
          style={{
            left: `${Math.min(window.innerWidth - 240, hoveredEntity.x + 15)}px`,
            top: `${Math.min(window.innerHeight - 150, hoveredEntity.y + 15)}px`,
          }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-1">
            <span className="font-bold text-white text-sm">{hoveredEntity.code}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
              {hoveredEntity.type.toUpperCase()}
            </span>
          </div>
          <div className="text-slate-300 text-[11px]">{hoveredEntity.name}</div>
          {hoveredEntity.score !== undefined && (
            <div className="flex justify-between text-slate-400">
              <span>Risk Score:</span>
              <strong className="text-amber-400">{hoveredEntity.score}/100</strong>
            </div>
          )}
          {hoveredEntity.occupancy !== undefined && (
            <div className="flex justify-between text-slate-400">
              <span>Occupancy:</span>
              <strong className="text-cyan-400">{hoveredEntity.occupancy}%</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
