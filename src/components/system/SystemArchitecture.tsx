import React, { useState } from 'react';
import { ARCHITECTURE_PIPELINE, ArchitectureNode } from '../../data/architectureData';
import { 
  Cpu, 
  Database, 
  Layers, 
  Route, 
  ShieldCheck, 
  ArrowDown, 
  CheckCircle2,
  Clock,
  Radio,
  Server
} from 'lucide-react';

export const SystemArchitecture: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode>(ARCHITECTURE_PIPELINE[2]);

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>INTERACTIVE DATA PIPELINE</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            PLATFORM SYSTEM ARCHITECTURE
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mt-1">
            Click any node below to inspect its ingestion protocols, processing latencies, algorithmic models, and fault-tolerant failsafe mechanisms.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Node Pipeline List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
            SELECT PIPELINE STAGE (CLICK TO INSPECT)
          </div>

          {ARCHITECTURE_PIPELINE.map((node, idx) => {
            const isSelected = selectedNode.id === node.id;

            return (
              <div key={node.id} className="relative">
                <button
                  onClick={() => setSelectedNode(node)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-cyan-950/90 border-cyan-400 shadow-glow-cyan'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">
                      STAGE {idx + 1} &bull; {node.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{node.specs.latency}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{node.title}</h4>
                  <div className="text-xs text-slate-400 mt-0.5">{node.subtitle}</div>
                </button>

                {idx < ARCHITECTURE_PIPELINE.length - 1 && (
                  <div className="flex justify-center my-1 text-slate-600">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Selected Node Technical Deep-Dive Inspector (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-2xl glass-panel border border-cyan-500/60 shadow-glow-cyan space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  TECHNICAL SPECIFICATION
                </span>
                <h3 className="font-display font-extrabold text-2xl text-white">
                  {selectedNode.title}
                </h3>
                <div className="text-xs font-mono text-slate-400 mt-0.5">{selectedNode.subtitle}</div>
              </div>

              <span className="px-3 py-1 rounded bg-cyan-950 border border-cyan-500 text-cyan-300 font-mono text-xs font-bold">
                {selectedNode.category}
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {selectedNode.description}
            </p>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">CYCLE LATENCY</span>
                <span className="text-cyan-400 font-bold">{selectedNode.specs.latency}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">PROTOCOL</span>
                <span className="text-slate-200 font-bold">{selectedNode.specs.protocol}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">SYNC RATE</span>
                <span className="text-slate-200 font-bold">{selectedNode.specs.frequency}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">FAILSAFE</span>
                <span className="text-amber-400 font-bold text-[11px] truncate">{selectedNode.specs.failsafe}</span>
              </div>
            </div>

            {/* Sub-Components & Data Feeds */}
            <div>
              <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                INTEGRATED STACK COMPONENTS & DATA SOURCES
              </div>
              <div className="space-y-2">
                {selectedNode.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
