import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useDisaster } from '../../context/DisasterContext';
import {
  createSaraighatBridge,
  createRiverEmbankments,
  createHabitationStructures,
  createShelterFacilities,
  createRiverineVegetation,
  createMobileRescueAssets
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
  cameraDistance = 140,
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
  const mobileAssetsRef = useRef<ReturnType<typeof createMobileRescueAssets> | null>(null);

  // Smooth camera target state
  const cameraTargetRef = useRef({
    pos: new THREE.Vector3(0, 110, cameraDistance),
    lookAt: new THREE.Vector3(0, 0, 0),
  });

  // Camera preset handler
  useEffect(() => {
    const target = cameraTargetRef.current;
    if (cameraPreset === 'BRIDGE') {
      // Focus looking down the Saraighat River Bridge
      target.pos.set(-50, 32, 5);
      target.lookAt.set(-25, 8.5, -40);
    } else if (cameraPreset === 'BREACH') {
      // Dramatic close-up on Zone C embankment breach & slums
      target.pos.set(-30, 22, 52);
      target.lookAt.set(-18, 2.5, 18);
    } else if (cameraPreset === 'SHELTER_S6') {
      // Hilltop view of safe concrete multi-purpose shelter S6
      target.pos.set(38, 42, -18);
      target.lookAt.set(18, 16, -45);
    } else if (cameraPreset === 'DRONE') {
      // Close surveillance angle near current selected habitation
      target.pos.set(-15, 60, 45);
      target.lookAt.set(-22, 4, 12);
    } else {
      // Default overview
      target.pos.set(0, 110, cameraDistance);
      target.lookAt.set(0, 0, 0);
    }
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
    scene.fog = new THREE.FogExp2(bgColor, 0.0035);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 1, 1200);
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
    sunLight.shadow.camera.left = -120;
    sunLight.shadow.camera.right = 120;
    sunLight.shadow.camera.top = 120;
    sunLight.shadow.camera.bottom = -120;
    scene.add(sunLight);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 2, 220);
    cyanPointLight.position.set(-60, 45, -40);
    scene.add(cyanPointLight);

    const hazardPointLight = new THREE.PointLight(0xef4444, 2.5, 200);
    hazardPointLight.position.set(-18, 25, 20); // Focused at breach
    scene.add(hazardPointLight);

    // 5. Realistic Brahmaputra River Basin Topographic Terrain Mesh
    const terrainSize = 250;
    const terrainSegments = 90;
    const terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSegments, terrainSegments);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Real River Channel (Brahmaputra flowing S-curve through valley)
      const riverCenterZ = -30 + Math.sin(x * 0.032) * 22;
      const riverDist = Math.abs(z - riverCenterZ);
      const isRiver = Math.max(0, 1 - riverDist / 28);

      // Sandy River Island (Char) at x: -18, z: -8
      const charDist = Math.sqrt(Math.pow(x + 18, 2) + Math.pow(z + 8, 2));
      const isChar = Math.max(0, 1 - charDist / 14);

      // Nilachal / Kamakhya hills on north-east (x: 15 to 80, z: -80 to -20)
      const hillDist = Math.sqrt(Math.pow(x - 45, 2) + Math.pow(z + 45, 2));
      const hillElev = Math.max(0, 42 * Math.exp(-Math.pow(hillDist / 42, 2)));

      // South-eastern undulating ridge
      const southRidge = Math.max(0, 18 * Math.exp(-Math.pow((z - 50) / 30, 2)));

      // Elevation calculation
      let y = Math.sin(x * 0.02) * Math.cos(z * 0.02) * 4 + hillElev + southRidge + (isChar * 7) - (isRiver * 17);
      pos.setY(i, Math.max(-14, y));
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xe2e8f0 : 0x0a1120,
      roughness: 0.85,
      metalness: 0.15,
      flatShading: true,
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

    // 6. Dynamic Flood Water Plane with Wave Physics
    const waterGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, 64, 64);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.72,
      roughness: 0.08,
      metalness: 0.85,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = -6; // Baseline height
    scene.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // 7. REAL PLACE STRUCTURES INTEGRATION
    // Saraighat Bridge across Brahmaputra
    const bridge = createSaraighatBridge();
    scene.add(bridge);
    bridgeRef.current = bridge;

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

    // 9. Mouse Orbit & Raycasting Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0.35;
    let targetRotX = 0.45;

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / heightPx) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotY += deltaX * 0.005;
        targetRotX = Math.max(0.1, Math.min(1.3, targetRotX + deltaY * 0.005));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
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
          container.style.cursor = isDragging ? 'grabbing' : 'grab';
        }
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      if (container) container.style.cursor = 'grab';
    };

    const onWheel = (e: WheelEvent) => {
      if (!interactive) return;
      e.preventDefault();
      camera.position.multiplyScalar(1 + e.deltaY * 0.001);
      camera.position.clampLength(60, 320);
    };

    const onClick = () => {
      if (hoveredEntity && hoveredEntity.type === 'habitation') {
        setSelectedHabitationId(hoveredEntity.id);
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onClick);

    // 10. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation towards target or manual drag orbit
      if (isDragging) {
        const radius = camera.position.length();
        camera.position.x = radius * Math.sin(targetRotY) * Math.cos(targetRotX);
        camera.position.z = radius * Math.cos(targetRotY) * Math.cos(targetRotX);
        camera.position.y = radius * Math.sin(targetRotX);
        camera.lookAt(0, 0, 0);
      } else {
        camera.position.lerp(cameraTargetRef.current.pos, 0.04);
        camera.lookAt(cameraTargetRef.current.lookAt);
      }

      // Real water wave oscillation
      if (waterMeshRef.current) {
        const waterPos = waterMeshRef.current.geometry.attributes.position;
        for (let i = 0; i < waterPos.count; i++) {
          const u = waterPos.getX(i);
          const v = waterPos.getY(i);
          const wave = Math.sin(u * 0.06 + elapsedTime * 1.8) * Math.cos(v * 0.06 + elapsedTime * 1.4) * 0.35;
          waterPos.setZ(i, wave);
        }
        waterPos.needsUpdate = true;
      }

      // Update NDRF Boats, Rotor Spin, and Drone Searchlight Tracking
      if (mobileAssetsRef.current) {
        // Locate selected habitation 3D coordinates for drone tracking
        let targetPos: { x: number; y: number; z: number } | undefined;
        const targetHab = habitations.find(h => h.id === selectedHabitationId);
        if (targetHab) {
          targetPos = {
            x: (targetHab.coords.x - 50) * 1.8,
            y: (targetHab.elevationMeters / 80) * 26 + 1,
            z: (targetHab.coords.y - 50) * 1.8,
          };
        }
        mobileAssetsRef.current.update(elapsedTime, targetPos);
      }

      // Pulse beacon rings on markers
      if (markerGroupRef.current) {
        markerGroupRef.current.children.forEach(child => {
          const ring = child.getObjectByName('pulseRing');
          if (ring) {
            const scale = 1 + (Math.sin(elapsedTime * 3 + child.position.x) * 0.5 + 0.5) * 0.8;
            ring.scale.set(scale, scale, scale);
          }
        });
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
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [cameraDistance, interactive, theme]);

  // Update Dynamic Flood Water Level based on Precipitation and River Gauge
  useEffect(() => {
    if (!waterMeshRef.current) return;

    let baseHeight = -7;
    if (params.riverStage === 'WARNING') baseHeight = -3;
    if (params.riverStage === 'DANGER') baseHeight = 2;
    if (params.riverStage === 'BREACH') baseHeight = 7.5;

    const floodHeight = baseHeight + (params.rainfallPct / 100) * 8.5;
    waterMeshRef.current.position.y = floodHeight;

    const mat = waterMeshRef.current.material as THREE.MeshStandardMaterial;
    if (params.riverStage === 'BREACH' || params.rainfallPct > 60) {
      mat.color.setHex(0x991b1b); // Crimson danger breach
      mat.opacity = 0.82;
    } else {
      mat.color.setHex(0x0284c7); // Deep Brahmaputra river blue
      mat.opacity = 0.72;
    }
  }, [params.rainfallPct, params.riverStage]);

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

  // Render Habitation and Shelter Tactical Beacons
  useEffect(() => {
    const group = markerGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (showHabitations) {
      habitations.forEach(hab => {
        const worldX = (hab.coords.x - 50) * 1.8;
        const worldZ = (hab.coords.y - 50) * 1.8;
        const worldY = (hab.elevationMeters / 80) * 26 + 1;

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

        // Tactical Beacon Pin
        const beaconGeo = new THREE.CylinderGeometry(0.8, 1.4, 4.5, 12);
        const beaconMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 0.65,
          metalness: 0.5,
          roughness: 0.2,
        });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.y = 2.25;
        habObj.add(beacon);

        // Ground Pulsing Ring
        const ringGeo = new THREE.RingGeometry(2.4, 3.8, 24);
        ringGeo.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.75,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.name = 'pulseRing';
        ring.position.y = 0.25;
        habObj.add(ring);

        // Sky Pillar for selected habitation
        if (hab.id === selectedHabitationId) {
          const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 40, 8);
          const pillarMat = new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.85,
          });
          const pillar = new THREE.Mesh(pillarGeo, pillarMat);
          pillar.position.y = 20;
          habObj.add(pillar);
        }

        group.add(habObj);
      });
    }

    if (showShelters) {
      shelters.forEach(shelter => {
        const worldX = (shelter.coords.x - 50) * 1.8;
        const worldZ = (shelter.coords.y - 50) * 1.8;
        const worldY = 6;

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

        // Shelter Tower Cube
        const cubeGeo = new THREE.BoxGeometry(3.5, 4.5, 3.5);
        const cubeMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 0.5,
          roughness: 0.3,
        });
        const cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.position.y = 2.25;
        shelterObj.add(cube);

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
        const x = (pt[0] - 50) * 1.8;
        const z = (pt[1] - 50) * 1.8;
        return new THREE.Vector3(x, route.isRecommended ? 6.5 : 3.5, z);
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
