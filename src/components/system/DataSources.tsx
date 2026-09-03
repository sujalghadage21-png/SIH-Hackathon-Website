import React from 'react';
import { 
  Database, 
  Radio, 
  Layers, 
  Map, 
  Users, 
  Building, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const DataSources: React.FC = () => {
  const integrations = [
    {
      title: 'ISRO Bhuvan Spatial Services',
      org: 'National Remote Sensing Centre (NRSC)',
      type: 'GEOSPATIAL ELEVATION & FLOOD EXTENT',
      protocol: 'OGC WMS / WFS REST Endpoints',
      currentStatus: 'PROTOTYPE SIMULATION',
      futureStatus: 'PROPOSED LIVE INTEGRATION',
      desc: 'CartoDEM 10m Digital Elevation Models for catchment basin contouring and satellite synthetic aperture radar (SAR) flood inundation polygons.',
    },
    {
      title: 'India Meteorological Department (IMD)',
      org: 'Ministry of Earth Sciences, Govt. of India',
      type: 'NOWCAST PRECIPITATION TELEMETRY',
      protocol: 'Automated Weather Station (AWS) API / GeoTIFF',
      currentStatus: 'PROTOTYPE SIMULATION',
      futureStatus: 'PROPOSED LIVE INTEGRATION',
      desc: 'Continuous Quantitative Precipitation Forecasts (QPF), Doppler weather radar cloudburst tracking, and automated flash flood guidance (FFGS).',
    },
    {
      title: 'OpenStreetMap Road Network Topology',
      org: 'Humanitarian OpenStreetMap Team (HOT)',
      type: 'TRANSIT GRAPH & CULVERT NODES',
      protocol: 'Overpass QL / GraphHopper Engine',
      currentStatus: 'PROTOTYPE SIMULATION',
      futureStatus: 'PROPOSED LIVE INTEGRATION',
      desc: 'Topologically connected road segments, bridge deck elevations, culvert markers, and heavy rescue vehicle axle clearance ratings.',
    },
    {
      title: 'Census of India & Socio-Economic Registry',
      org: 'Registrar General & Census Commissioner',
      type: 'SOCIO-DEMOGRAPHIC VULNERABILITY',
      protocol: 'Encrypted District Geo-Database / PostGIS',
      currentStatus: 'PROTOTYPE SIMULATION',
      futureStatus: 'PROPOSED LIVE INTEGRATION',
      desc: 'Disaggregated household micro-data identifying proportion of senior citizens (>65), infants, persons with disabilities (PwD), and kutchha dwellings.',
    },
    {
      title: 'Central Water Commission (CWC)',
      org: 'Ministry of Jal Shakti, Govt. of India',
      type: 'HYDROLOGICAL RIVER GAUGES',
      protocol: 'MQTT Sensor Telemetry / Hydro-Portal',
      currentStatus: 'PROTOTYPE SIMULATION',
      futureStatus: 'PROPOSED LIVE INTEGRATION',
      desc: 'Telemetry gauges along river channels tracking Warning Stage, Danger Stage, and Dam Outflow release advisories in real time.',
    },
    {
      title: 'DDMA District Shelter Registry',
      org: 'State Disaster Management Authority (SDMA)',
      type: 'FACILITY INVENTORY & MEDICAL TRIAGE',
      protocol: 'Restful JSON APIs / Offline SQLite',
      currentStatus: 'PROTOTYPE SIMULATION',
      futureStatus: 'PROPOSED LIVE INTEGRATION',
      desc: 'Audited shelter capacity limits, standby generator fuel levels, potable water stocks, and mobile medical surgical container availability.',
    }
  ];

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>INTEROPERABLE DATA FABRIC</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            BUILT TO CONNECT WITH REAL-WORLD DATA
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mt-1">
            Standardized API adapters architected to plug directly into government geospatial layers, meteorological sensors, and open transit graphs.
          </p>
        </div>

        {/* Current vs Future Status Clarification */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300">
            CURRENT DEMO: SIMULATED DATA
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/50 text-cyan-300">
            FUTURE: LIVE API INTEGRATION
          </span>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item, idx) => (
          <div key={idx} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  {item.type}
                </span>
                <h3 className="font-bold text-base text-white mt-1">
                  {item.title}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">{item.org}</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {item.desc}
            </p>

            <div className="pt-3 border-t border-slate-800 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Protocol:</span>
                <span className="text-slate-200 font-semibold">{item.protocol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-cyan-300 font-bold">{item.futureStatus}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
