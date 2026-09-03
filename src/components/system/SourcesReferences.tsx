import React from 'react';
import { RESEARCH_SOURCES } from '../../data/researchSources';
import { BookOpen, ExternalLink, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export const SourcesReferences: React.FC = () => {
  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ACADEMIC & STATUTORY CITATIONS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            RESEARCH REFERENCES & DATA STANDARDS
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mt-1">
            Formal foundations grounded in statutory guidelines published by the National Disaster Management Authority (NDMA) and operational research literature.
          </p>
        </div>
      </div>

      {/* Citations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {RESEARCH_SOURCES.map(source => (
          <div
            key={source.id}
            className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3 flex flex-col justify-between hover:border-cyan-500/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700 font-bold">
                  {source.tag}
                </span>
                <span className="text-[11px] font-mono text-slate-500">{source.year}</span>
              </div>

              <h4 className="font-bold text-base text-white mb-1">
                {source.title}
              </h4>
              <div className="text-xs font-mono text-slate-400 mb-3">
                {source.organization}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {source.relevance}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-cyan-400 flex items-center justify-between">
              <span>{source.linkText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
