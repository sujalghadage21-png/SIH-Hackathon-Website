import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useDisaster } from '../../context/DisasterContext';
import {
  Layers,
  MapPin,
  ShieldAlert,
  Building,
  Navigation,
  Globe,
  Crosshair,
  Satellite,
  Map as MapIcon,
  AlertTriangle,
  RotateCcw,
  Compass,
  CheckCircle2,
  Waves,
  Maximize2
} from 'lucide-react';
import {
  INDIA_NATIONAL_HOTSPOTS,
  REAL_INDIA_HABITATION_COORDS,
  REAL_INDIA_SHELTER_COORDS,
  REAL_INDIA_ROADS,
  REAL_INDIA_ROUTES,
  BRAHMAPUTRA_RIVER_POLYGON,
  INDIA_BOUNDARY_COORDS
} from '../../data/indiaGeoJson';

export type BasemapType = 'SATELLITE' | 'DARK' | 'LIGHT' | 'STREET';

export const TacticalGISMap: React.FC = () => {
  const {
    habitations,
    shelters,
    selectedHabitationId,
    setSelectedHabitationId,
    demographicFilter,
    setDemographicFilter,
    isR17Blocked,
    isS4Overloaded,
    params,
    theme
  } = useDisaster();

  // Container and Leaflet Map references
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Feature layer groups
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const boundaryLayerRef = useRef<L.LayerGroup | null>(null);
  const riverLayerRef = useRef<L.LayerGroup | null>(null);
  const hazardLayerRef = useRef<L.LayerGroup | null>(null);
  const roadsLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const habitationsLayerRef = useRef<L.LayerGroup | null>(null);
  const sheltersLayerRef = useRef<L.LayerGroup | null>(null);
  const hotspotsLayerRef = useRef<L.LayerGroup | null>(null);

  // User UI controls
  const [activeBasemap, setActiveBasemap] = useState<BasemapType>('SATELLITE');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('assam');
  const [showZones, setShowZones] = useState<boolean>(true);
  const [showShelters, setShowShelters] = useState<boolean>(true);
  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [showInundation, setShowInundation] = useState<boolean>(true);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Sync default basemap with global theme unless manually toggled
  useEffect(() => {
    if (activeBasemap === 'DARK' && theme === 'light') {
      setActiveBasemap('LIGHT');
    } else if (activeBasemap === 'LIGHT' && theme === 'dark') {
      setActiveBasemap('DARK');
    }
  }, [theme]);

  // 1. Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Assam Brahmaputra flood basin by default
    const map = L.map(mapContainerRef.current, {
      center: [26.185, 91.745],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
      minZoom: 4,
      maxZoom: 18,
    });

    // Add standard Leaflet zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Track mouse coordinates for live tactical readout
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCursorCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    // Create Layer Groups
    boundaryLayerRef.current = L.layerGroup().addTo(map);
    riverLayerRef.current = L.layerGroup().addTo(map);
    hazardLayerRef.current = L.layerGroup().addTo(map);
    roadsLayerRef.current = L.layerGroup().addTo(map);
    routesLayerRef.current = L.layerGroup().addTo(map);
    habitationsLayerRef.current = L.layerGroup().addTo(map);
    sheltersLayerRef.current = L.layerGroup().addTo(map);
    hotspotsLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Update Basemap Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    let maxZoom = 18;
    let subdomains: string | string[] = 'abc';

    if (activeBasemap === 'DARK') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      subdomains = 'abcd';
      maxZoom = 19;
    } else if (activeBasemap === 'LIGHT') {
      url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      subdomains = 'abcd';
      maxZoom = 19;
    } else if (activeBasemap === 'STREET') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      subdomains = 'abc';
      maxZoom = 19;
    }

    const newTileLayer = L.tileLayer(url, {
      maxZoom,
      subdomains,
    }).addTo(map);

    // Ensure tiles stay behind vectors
    newTileLayer.bringToBack();
    tileLayerRef.current = newTileLayer;
  }, [activeBasemap]);

  // 3. Render National Boundary & India Hotspots
  useEffect(() => {
    const boundaryGroup = boundaryLayerRef.current;
    const hotspotsGroup = hotspotsLayerRef.current;
    if (!boundaryGroup || !hotspotsGroup) return;

    boundaryGroup.clearLayers();
    hotspotsGroup.clearLayers();

    // Draw India national boundary outline
    L.polyline(INDIA_BOUNDARY_COORDS, {
      color: theme === 'dark' ? '#06b6d4' : '#0284c7',
      weight: 2.5,
      dashArray: '8, 6',
      opacity: 0.85,
    }).addTo(boundaryGroup);

    // Draw National Disaster Hotspots across India
    INDIA_NATIONAL_HOTSPOTS.forEach(hotspot => {
      const isCurrentZone = hotspot.id === 'assam';

      const customIcon = L.divIcon({
        className: 'custom-hotspot-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group" style="transform: translate(-50%, -50%);">
            <span class="absolute w-8 h-8 rounded-full ${isCurrentZone ? 'animate-ping' : ''}" style="background-color: ${hotspot.color}; opacity: 0.4;"></span>
            <span class="relative flex items-center justify-center w-7 h-7 rounded-full border-2 border-slate-900 font-mono font-bold text-[10px] text-white shadow-lg" style="background-color: ${hotspot.color};">
              ${hotspot.score}
            </span>
            <div class="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono font-bold text-white shadow-md pointer-events-none">
              ${hotspot.name.split('(')[0]}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([hotspot.lat, hotspot.lng], { icon: customIcon }).addTo(hotspotsGroup);

      marker.on('click', () => {
        handleFlyToRegion(hotspot.id, [hotspot.lat, hotspot.lng], hotspot.zoom);
      });

      marker.bindPopup(`
        <div class="p-3 font-mono text-xs space-y-2 min-w-[220px]">
          <div class="flex items-center justify-between border-b border-slate-700 pb-1.5">
            <span class="font-bold text-cyan-400">${hotspot.name}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold" style="background: ${hotspot.color}33; color: ${hotspot.color}; border: 1px solid ${hotspot.color};">
              ${hotspot.risk}
            </span>
          </div>
          <div class="text-[11px] text-slate-300">
            <strong class="text-white">STATUS:</strong> ${hotspot.status}
          </div>
          <div class="text-[11px] text-slate-400">
            ${hotspot.details}
          </div>
          <button
            onclick="window.flyToIndiaHotspot && window.flyToIndiaHotspot('${hotspot.id}', ${hotspot.lat}, ${hotspot.lng}, ${hotspot.zoom})"
            class="w-full mt-2 py-1 px-2 text-center rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] transition-all"
          >
            FOCUS THIS DISASTER SECTOR &rarr;
          </button>
        </div>
      `, { className: 'tactical-leaflet-popup' });
    });
  }, [theme]);

  // Window helper for popup buttons
  useEffect(() => {
    (window as any).flyToIndiaHotspot = (id: string, lat: number, lng: number, zoom: number) => {
      handleFlyToRegion(id, [lat, lng], zoom);
    };
    return () => {
      delete (window as any).flyToIndiaHotspot;
    };
  }, []);

  // 4. Render River and Dynamic Inundation Hazard Polygon
  useEffect(() => {
    const riverGroup = riverLayerRef.current;
    const hazardGroup = hazardLayerRef.current;
    if (!riverGroup || !hazardGroup) return;

    riverGroup.clearLayers();
    hazardGroup.clearLayers();

    // 1. Permanent Brahmaputra River Channel
    L.polygon(BRAHMAPUTRA_RIVER_POLYGON, {
      color: params.rainfallPct >= 40 || params.riverStage === 'BREACH' ? '#ef4444' : '#0284c7',
      fillColor: params.rainfallPct >= 40 || params.riverStage === 'BREACH' ? '#991b1b' : '#0369a1',
      fillOpacity: 0.55,
      weight: 2,
    }).bindTooltip('BRAHMAPUTRA RIVER CHANNEL (SURGE: +' + (params.rainfallPct >= 40 ? '3.4m BREACH' : '1.2m') + ')', {
      className: 'font-mono text-xs',
      sticky: true,
    }).addTo(riverGroup);

    // 2. Dynamic Flood Inundation Hazard Polygon (scales with simulation parameters)
    if (showInundation) {
      const expansion = (params.rainfallPct / 100) * 0.008;
      const inundationCoords: [number, number][] = [
        [26.195 + expansion, 91.710 - expansion],
        [26.193 + expansion, 91.742 + expansion],
        [26.186 + expansion, 91.775 + expansion],
        [26.177 - expansion, 91.765 + expansion],
        [26.168 - expansion, 91.735 - expansion],
        [26.172 - expansion, 91.710 - expansion],
      ];

      const isBreach = params.rainfallPct >= 40 || params.riverStage === 'BREACH';

      L.polygon(inundationCoords, {
        color: isBreach ? '#ef4444' : '#f97316',
        fillColor: isBreach ? '#ef4444' : '#f97316',
        fillOpacity: isBreach ? 0.35 : 0.22,
        weight: 2.5,
        dashArray: isBreach ? '6, 4' : 'none',
      }).bindTooltip(
        `ACTIVE HAZARD INUNDATION EXTENT • RISK: ${isBreach ? 'CRITICAL BREACH' : 'HIGH SURGE'} (RAINFALL: +${params.rainfallPct}%)`,
        { className: 'font-mono text-xs', sticky: true }
      ).addTo(hazardGroup);
    }
  }, [params.rainfallPct, params.riverStage, showInundation]);

  // 5. Render Road Network & Evacuation Corridors
  useEffect(() => {
    const roadsGroup = roadsLayerRef.current;
    const routesGroup = routesLayerRef.current;
    if (!roadsGroup || !routesGroup) return;

    roadsGroup.clearLayers();
    routesGroup.clearLayers();

    // Road Links
    if (showRoads) {
      REAL_INDIA_ROADS.forEach(road => {
        const isBlocked = road.id === 'R17' && isR17Blocked;
        const color = isBlocked ? '#ef4444' : (road.bottleneck ? '#f59e0b' : '#64748b');

        const polyline = L.polyline(road.path, {
          color,
          weight: isBlocked ? 5 : 3.5,
          dashArray: isBlocked ? '6, 6' : undefined,
          opacity: 0.9,
        }).addTo(roadsGroup);

        if (isBlocked) {
          // Blocked marker icon on R17
          const midPoint = road.path[1];
          const blockedIcon = L.divIcon({
            className: 'custom-blocked-road-icon',
            html: `
              <div class="px-2 py-0.5 rounded bg-red-600 border border-white text-white font-mono text-[10px] font-bold shadow-lg animate-pulse whitespace-nowrap" style="transform: translate(-50%, -50%);">
                ⛔ ROAD ${road.id}: BLOCKED
              </div>
            `,
          });
          L.marker(midPoint, { icon: blockedIcon }).addTo(roadsGroup);
        }

        polyline.bindTooltip(`${road.name} • ${isBlocked ? 'STATUS: BLOCKED' : 'OPEN'}`, {
          className: 'font-mono text-xs',
          sticky: true,
        });
      });
    }

    // Evacuation Routes
    if (showRoutes) {
      REAL_INDIA_ROUTES.forEach(route => {
        const isRec = route.isRecommended;
        const color = isRec ? '#10b981' : (route.id === 'route-b' && isR17Blocked ? '#ef4444' : '#38bdf8');

        // Outer glow polyline for recommended corridor
        if (isRec) {
          L.polyline(route.path, {
            color: '#10b981',
            weight: 10,
            opacity: 0.3,
          }).addTo(routesGroup);
        }

        const polyline = L.polyline(route.path, {
          color,
          weight: isRec ? 4.5 : 3,
          dashArray: isRec ? '8, 6' : '6, 6',
          opacity: 0.95,
        }).addTo(routesGroup);

        if (isRec) {
          const midPoint = route.path[2];
          const recBadge = L.divIcon({
            className: 'custom-safe-route-badge',
            html: `
              <div class="px-2 py-0.5 rounded-full bg-emerald-600 text-slate-950 font-mono text-[10px] font-bold shadow-lg border border-emerald-300 whitespace-nowrap flex items-center gap-1" style="transform: translate(-50%, -50%);">
                <span>🛡️ AI SAFE ROUTE D</span>
              </div>
            `,
          });
          L.marker(midPoint, { icon: recBadge }).addTo(routesGroup);
        }

        polyline.bindTooltip(`${route.name} ${isRec ? '(AI OPTIMIZED SAFE CORRIDOR)' : ''}`, {
          className: 'font-mono text-xs',
          sticky: true,
        });
      });
    }
  }, [showRoads, showRoutes, isR17Blocked]);

  // 6. Render Habitation Markers
  useEffect(() => {
    const habitationsGroup = habitationsLayerRef.current;
    if (!habitationsGroup) return;

    habitationsGroup.clearLayers();
    if (!showZones) return;

    habitations.forEach(hab => {
      const realCoord = REAL_INDIA_HABITATION_COORDS[hab.id];
      if (!realCoord) return;

      const isSelected = hab.id === selectedHabitationId;
      const isRed = hab.riskCategory === 'RED';
      const isOrange = hab.riskCategory === 'ORANGE';
      const markerColor = isRed ? '#ef4444' : (isOrange ? '#f97316' : '#10b981');

      // Calculate relative size from demographic filter
      let demographicCount = hab.population;
      let filterLabel = 'Total Pop';
      if (demographicFilter === 'ELDERLY') {
        demographicCount = hab.vulnerablePop.elderly;
        filterLabel = 'Elderly';
      } else if (demographicFilter === 'CHILDREN') {
        demographicCount = hab.vulnerablePop.children;
        filterLabel = 'Children';
      } else if (demographicFilter === 'DISABILITY') {
        demographicCount = hab.vulnerablePop.disabilities;
        filterLabel = 'PwD';
      }

      const habIcon = L.divIcon({
        className: 'custom-hab-div-icon',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group" style="transform: translate(-50%, -50%);">
            <!-- Pulsing hazard halo -->
            <span class="absolute w-10 h-10 rounded-full ${isRed ? 'animate-pulse' : ''}" style="background-color: ${markerColor}; opacity: ${isSelected ? 0.45 : 0.25};"></span>
            
            <!-- Core Tactical Pin Badge -->
            <div class="relative px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold flex items-center gap-1 shadow-xl transition-transform group-hover:scale-110 ${
              isSelected ? 'ring-2 ring-cyan-400' : ''
            }" style="background-color: #0f172a; border-color: ${isSelected ? '#38bdf8' : markerColor}; color: ${markerColor};">
              <span>#${hab.priorityRank}</span>
              <span class="text-white">${hab.code}</span>
            </div>

            <!-- Priority score pill -->
            <div class="absolute -top-3.5 right-0 translate-x-1/2 px-1 py-0.2 rounded-full text-[9px] font-mono font-extrabold text-white shadow" style="background-color: ${markerColor};">
              ${hab.finalPriorityScore}
            </div>
          </div>
        `,
        iconSize: [48, 28],
        iconAnchor: [24, 14],
      });

      const marker = L.marker([realCoord.lat, realCoord.lng], { icon: habIcon }).addTo(habitationsGroup);

      marker.on('click', () => {
        setSelectedHabitationId(hab.id);
      });

      // Rich tactical popup
      marker.bindPopup(`
        <div class="p-3 font-mono text-xs space-y-2 min-w-[260px]">
          <div class="flex items-center justify-between border-b border-slate-700 pb-1.5">
            <div>
              <span class="font-bold text-white text-sm">${hab.code}</span>
              <div class="text-[10px] text-cyan-400">${realCoord.district}</div>
            </div>
            <div class="text-right">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold" style="background: ${markerColor}33; color: ${markerColor}; border: 1px solid ${markerColor};">
                ${hab.urgency}
              </span>
              <div class="text-[10px] text-slate-400 mt-0.5">SCORE: ${hab.finalPriorityScore}/100</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-2 rounded border border-slate-800">
            <div><span class="text-slate-400">Total Pop:</span> <strong class="text-white">${hab.population.toLocaleString()}</strong></div>
            <div><span class="text-slate-400">Elderly:</span> <strong class="text-amber-300">${hab.vulnerablePop.elderly}</strong></div>
            <div><span class="text-slate-400">Children:</span> <strong class="text-amber-300">${hab.vulnerablePop.children}</strong></div>
            <div><span class="text-slate-400">PwD Escort:</span> <strong class="text-red-400">${hab.vulnerablePop.disabilities}</strong></div>
          </div>

          <div class="text-[10px] space-y-1 text-slate-300 border-t border-slate-800 pt-1.5">
            <div><strong>NEAREST SHELTER:</strong> <span class="text-cyan-300">${hab.nearestShelterId.toUpperCase()}</span></div>
            <div><strong>AI EVACUATION CORRIDOR:</strong> <span class="text-emerald-400">${hab.alternateRouteId.toUpperCase()}</span></div>
            <div><strong>ASSIGNED UNIT:</strong> <span class="text-blue-300">${hab.assignedUnitId.toUpperCase()}</span></div>
          </div>

          <div class="pt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>Lat: ${realCoord.lat.toFixed(4)}°N</span>
            <span>Lng: ${realCoord.lng.toFixed(4)}°E</span>
          </div>
        </div>
      `, { className: 'tactical-leaflet-popup' });
    });
  }, [habitations, selectedHabitationId, showZones, demographicFilter]);

  // 7. Render Shelter Markers
  useEffect(() => {
    const sheltersGroup = sheltersLayerRef.current;
    if (!sheltersGroup) return;

    sheltersGroup.clearLayers();
    if (!showShelters) return;

    shelters.forEach(shelter => {
      const realCoord = REAL_INDIA_SHELTER_COORDS[shelter.id];
      if (!realCoord) return;

      const isOverloaded = shelter.status === 'OVERLOAD' || (shelter.id === 's4' && isS4Overloaded);
      const isWarning = shelter.status === 'WARNING';
      const shelterColor = isOverloaded ? '#ef4444' : (isWarning ? '#f59e0b' : '#06b6d4');

      const shelterIcon = L.divIcon({
        className: 'custom-shelter-div-icon',
        html: `
          <div class="relative flex flex-col items-center cursor-pointer group" style="transform: translate(-50%, -50%);">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center border-2 font-mono font-extrabold text-[10px] text-white shadow-xl ${
              isOverloaded ? 'bg-red-950/90 border-red-500 animate-pulse' : 'bg-slate-900/90 border-cyan-400'
            }">
              ${shelter.code}
            </div>
            <div class="mt-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold whitespace-nowrap shadow-md ${
              isOverloaded ? 'bg-red-600 text-white' : 'bg-slate-900 border border-slate-700 text-slate-300'
            }">
              ${shelter.occupancyPct}% (${shelter.availableBeds} beds)
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([realCoord.lat, realCoord.lng], { icon: shelterIcon }).addTo(sheltersGroup);

      marker.bindPopup(`
        <div class="p-3 font-mono text-xs space-y-2 min-w-[240px]">
          <div class="flex items-center justify-between border-b border-slate-700 pb-1.5">
            <div>
              <span class="font-bold text-white text-sm">${shelter.name}</span>
              <div class="text-[10px] text-slate-400">${realCoord.landmark}</div>
            </div>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${
              isOverloaded ? 'bg-red-500/20 text-red-400 border border-red-500' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
            }">
              ${isOverloaded ? 'OVERLOADED' : 'OPERATIONAL'}
            </span>
          </div>

          <div class="space-y-1 text-[11px]">
            <div class="flex justify-between"><span>Capacity:</span> <strong class="text-white">${shelter.totalCapacity} beds</strong></div>
            <div class="flex justify-between"><span>Occupancy:</span> <strong class="${isOverloaded ? 'text-red-400' : 'text-cyan-300'}">${shelter.currentOccupancy} (${shelter.occupancyPct}%)</strong></div>
            <div class="flex justify-between"><span>Available Beds:</span> <strong class="text-emerald-400">${shelter.availableBeds}</strong></div>
            <div class="flex justify-between"><span>Medical Bay:</span> <strong class="${shelter.medicalBay ? 'text-emerald-400' : 'text-slate-500'}">${shelter.medicalBay ? 'ACTIVE' : 'NONE'}</strong></div>
          </div>
        </div>
      `, { className: 'tactical-leaflet-popup' });
    });
  }, [shelters, showShelters, isS4Overloaded]);

  // Smooth camera navigation across Indian disaster sectors
  const handleFlyToRegion = (regionId: string, center: [number, number], zoom: number) => {
    setSelectedRegionId(regionId);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  };

  return (
    <div className="relative w-full h-[640px] rounded-2xl glass-panel border border-tactical-border/80 overflow-hidden select-none isolate">
      {/* 1. Top Regional Navigation Bar across India */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs font-mono shadow-xl max-w-[calc(100%-460px)] overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="flex items-center gap-1.5 px-2 py-1 text-cyan-400 font-bold border-r border-slate-800 shrink-0">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>INDIA GIS:</span>
        </div>

        {/* National All-India Macro View */}
        <button
          onClick={() => handleFlyToRegion('national', [22.59, 78.96], 5)}
          className={`px-2.5 py-1 rounded-lg transition-all border flex items-center gap-1 text-[11px] shrink-0 ${
            selectedRegionId === 'national'
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-glow-amber'
              : 'border-slate-700 text-amber-400 hover:bg-amber-950/40'
          }`}
          title="Zoom out to Full Map of India Overview"
        >
          <Compass className="w-3 h-3" />
          <span>ALL-INDIA (EOC)</span>
        </button>

        {/* Hotspot Sector Pills */}
        {INDIA_NATIONAL_HOTSPOTS.map(h => (
          <button
            key={h.id}
            onClick={() => handleFlyToRegion(h.id, [h.lat, h.lng], h.zoom)}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 text-[11px] shrink-0 ${
              selectedRegionId === h.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>{h.state.toUpperCase()}</span>
            {h.id === 'assam' && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />}
          </button>
        ))}
      </div>

      {/* 2. Top Right Basemap & Demographic HUD */}
      <div className="absolute top-3 right-3 z-30 flex flex-col items-end gap-2">
        {/* Basemap Tiles Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[11px] font-mono shadow-xl">
          <button
            onClick={() => setActiveBasemap('SATELLITE')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              activeBasemap === 'SATELLITE'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Satellite Basemap (Esri High-Resolution Topographic Imagery)"
          >
            <Satellite className="w-3 h-3" />
            <span>SATELLITE</span>
          </button>

          <button
            onClick={() => setActiveBasemap('DARK')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              activeBasemap === 'DARK'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tactical Dark Basemap (CartoDB Dark Matter)"
          >
            <span>🌑 DARK GIS</span>
          </button>

          <button
            onClick={() => setActiveBasemap('LIGHT')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              activeBasemap === 'LIGHT'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tactical Light Basemap (CartoDB Positron)"
          >
            <span>☀️ LIGHT GIS</span>
          </button>

          <button
            onClick={() => setActiveBasemap('STREET')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              activeBasemap === 'STREET'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
            title="OpenStreetMap Standard (Administrative road/street grid)"
          >
            <MapIcon className="w-3 h-3" />
            <span>STREETS</span>
          </button>
        </div>

        {/* Demographic Filter Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[11px] font-mono shadow-xl">
          <span className="px-2 text-slate-400">FILTER:</span>
          {(['ALL', 'ELDERLY', 'CHILDREN', 'DISABILITY', 'DENSITY'] as const).map(f => (
            <button
              key={f}
              onClick={() => setDemographicFilter(f)}
              className={`px-2 py-0.5 rounded transition-colors ${
                demographicFilter === f
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-glow-amber'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Layer Toggle Switcher HUD (Left side vertical floating bar) */}
      <div className="absolute top-14 left-3 z-30 flex flex-col gap-1.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[11px] font-mono shadow-xl">
        <button
          onClick={() => setShowZones(!showZones)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
            showZones ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle Habitation Red Zones"
        >
          <ShieldAlert className="w-3 h-3" />
          <span>ZONES ({habitations.length})</span>
        </button>

        <button
          onClick={() => setShowShelters(!showShelters)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
            showShelters ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle Relief Shelters"
        >
          <Building className="w-3 h-3" />
          <span>SHELTERS ({shelters.length})</span>
        </button>

        <button
          onClick={() => setShowRoads(!showRoads)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
            showRoads ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle Roads & Bottlenecks"
        >
          <Navigation className="w-3 h-3" />
          <span>ROADS ({REAL_INDIA_ROADS.length})</span>
        </button>

        <button
          onClick={() => setShowRoutes(!showRoutes)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
            showRoutes ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle AI Evacuation Corridors"
        >
          <Crosshair className="w-3 h-3" />
          <span>CORRIDORS</span>
        </button>

        <button
          onClick={() => setShowInundation(!showInundation)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
            showInundation ? 'bg-red-950/80 border border-red-500/60 text-red-300' : 'text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle River Inundation Hazard Polygon"
        >
          <Waves className="w-3 h-3" />
          <span>INUNDATION</span>
        </button>
      </div>

      {/* 4. Real Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 5. Bottom Telemetry & GIS Coordinates Status Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-3 p-2 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[11px] font-mono text-slate-300 shadow-2xl">
        {/* Tactical Map Legend */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span>RED ZONE (CRITICAL)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>ORANGE SURGE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>SAFE SECTOR</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-400" />
            <span>AI SAFE ROUTE D</span>
          </div>
          {isR17Blocked && (
            <div className="flex items-center gap-1.5 text-red-400 font-bold animate-pulse">
              <span>⛔ ROAD R17: BLOCKED</span>
            </div>
          )}
          {isS4Overloaded && (
            <div className="flex items-center gap-1.5 text-amber-400 font-bold animate-pulse">
              <span>⚠️ SHELTER S4: OVERLOADED</span>
            </div>
          )}
        </div>

        {/* Live Cursor Lat/Lng Readout & Source Sync */}
        <div className="flex items-center gap-3 text-slate-400">
          <div className="hidden sm:flex items-center gap-1.5 text-cyan-400 font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>BHUVAN / ISRO GIS SYNC</span>
          </div>

          <div className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-200">
            {cursorCoords
              ? `${cursorCoords.lat.toFixed(4)}° N, ${cursorCoords.lng.toFixed(4)}° E`
              : '26.1850° N, 91.7450° E'}
          </div>

          <button
            onClick={() => handleFlyToRegion('assam', [26.185, 91.745], 13)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 hover:border-cyan-400 transition-all flex items-center gap-1"
            title="Recenter Map on Assam Brahmaputra Simulation"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">RECENTER</span>
          </button>
        </div>
      </div>
    </div>
  );
};
