import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  HelpCircle, 
  Radio, 
  RefreshCw, 
  CheckCircle2,
  Lock
} from 'lucide-react';

export const FailsafeReliability: React.FC = () => {
  const failsafeModes = [
    {
      scenario: 'Sensor Telemetry Dropout',
      cause: 'River gauge solar transmitter submerged or fiber severed.',
      response: 'Instantly switches to Hydrological Kinematic Wave Dead-Reckoning + Upstream Gauge Extrapolation. Confidence interval broadens with clear warning banner.',
      severity: 'WARNING',
    },
    {
      scenario: 'Conflicting Geospatial Reports',
      cause: 'Crowdsourced field report claims road R17 is open while Doppler radar shows intense localized flash flooding.',
      response: 'Precautionary principle applied: Road is flagged as "RESTRICTED — PENDING DRONE VERIFICATION" and routing engine defaults to all-weather high-ridge bypass.',
      severity: 'CRITICAL',
    },
    {
      scenario: 'High Latency / API Outage',
      cause: 'Third-party weather radar API response exceeds 1,500 ms.',
      response: 'Decoupled in-memory WASM edge cache continues priority recalculation using the last verified telemetry snapshot without stalling EOC operations.',
      severity: 'INFO',
    },
    {
      scenario: 'Low Confidence Prediction (<75%)',
      cause: 'Sparse census registry data for informal migrant settlement.',
      response: 'AI flags habitation with "INSPECTION REQUIRED" badge and elevates priority to guarantee safety buffer rather than downranking due to missing data.',
      severity: 'WARNING',
    }
  ];

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-3 shadow-glow-cyan">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>ROBUSTNESS & UNCERTAINTY HANDLING</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase mb-4">
          WHAT HAPPENS WHEN DATA IS UNCERTAIN?
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          In extreme disaster environments, sensors fail, communications severed, and data becomes noisy. <strong className="text-cyan-300">AI should never hide uncertainty.</strong> RESCUE-ZONE AI explicitly quantifies confidence bounds and activates failsafe protocols.
        </p>
      </div>

      {/* 4 Failsafe Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {failsafeModes.map((item, idx) => (
          <div key={idx} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  FAILSAFE CONTINGENCY {idx + 1}
                </span>
                <h3 className="font-bold text-base text-white mt-1">
                  {item.scenario}
                </h3>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                item.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                item.severity === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-slate-900 text-cyan-300 border border-slate-700'
              }`}>
                {item.severity}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1 text-slate-400">
              <span className="text-slate-500 text-[10px] uppercase block">Failure Condition:</span>
              <span>{item.cause}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-xs text-cyan-200 leading-relaxed font-mono">
              <strong className="text-cyan-400 uppercase block mb-1">SYSTEM RESPONSE & MITIGATION:</strong>
              {item.response}
            </div>
          </div>
        ))}
      </div>

      {/* Core Principle Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/40 text-center font-mono text-xs text-slate-300 max-w-2xl mx-auto">
        <strong className="text-cyan-400 uppercase block text-sm mb-1">DESIGN PRINCIPLE: TRANSPARENCY OVER FALSE PRECISION</strong>
        The platform never outputs a single point estimate without exposing confidence intervals. If uncertainty exceeds 25%, Incident Commanders are prompted with a manual verification request before deploying specialized assets.
      </div>
    </div>
  );
};
