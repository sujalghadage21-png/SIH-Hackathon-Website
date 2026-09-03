import React from 'react';
import { Users, ShieldCheck, Award, Code2, Globe, Cpu, Compass } from 'lucide-react';

export const TeamSection: React.FC = () => {
  const teamMembers = [
    {
      name: 'Aarav Sharma',
      role: 'Team Lead & AI/ML Systems',
      expertise: 'Multi-Criteria Decision Models (MCDM), Graph Neural Networks, Operations Research',
      badge: 'LEAD ARCHITECT',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />
    },
    {
      name: 'Rohan Verma',
      role: 'Frontend & 3D WebGL Specialist',
      expertise: 'Three.js / WebGL 2.0, Topographic Meshes, Tactical Command UIs, Performance Optimization',
      badge: '3D GRAPHICS',
      icon: <Code2 className="w-5 h-5 text-cyan-400" />
    },
    {
      name: 'Ananya Patel',
      role: 'GIS & Spatial Data Architect',
      expertise: 'ISRO Bhuvan integration, DEM Raster Processing, OpenStreetMap Overpass APIs, Spatial Indexing',
      badge: 'GEOSPATIAL',
      icon: <Globe className="w-5 h-5 text-cyan-400" />
    },
    {
      name: 'Pooja Iyer',
      role: 'Disaster Domain Specialist & Research',
      expertise: 'NDMA Flood Guidelines (2020), Carrying Capacity Models, Vulnerability Indices, DDMA Workflows',
      badge: 'DOMAIN EXPERT',
      icon: <Compass className="w-5 h-5 text-cyan-400" />
    },
    {
      name: 'Vikramaditya Nair',
      role: 'Backend & Edge Reliability Engineer',
      expertise: 'Low-latency Data Pipelines, Telemetry Dead-Reckoning, High Availability, Resilient Systems',
      badge: 'RELIABILITY',
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />
    },
    {
      name: 'Sneha Kulkarni',
      role: 'Product Strategy & Evaluation Lead',
      expertise: 'Human-in-the-Loop UX, Statutory Incident Reporting, DDMA Operational Readiness, Rubric Compliance',
      badge: 'OPERATIONS',
      icon: <Award className="w-5 h-5 text-cyan-400" />
    }
  ];

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-3 shadow-glow-cyan">
          <Users className="w-3.5 h-3.5" />
          <span>SMART INDIA HACKATHON 2026</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase mb-4">
          TEAM RESILIX
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Cross-disciplinary engineers and researchers building robust, explainable, and government-grade disaster decision intelligence for Indian district administrations.
        </p>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                {member.icon}
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-700/60">
                {member.badge}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-lg text-white">
                {member.name}
              </h3>
              <div className="text-xs font-mono text-cyan-400 mt-0.5">
                {member.role}
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              {member.expertise}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
