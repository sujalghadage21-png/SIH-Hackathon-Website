import { CalculatedHabitationState, CalculatedShelterState, ResourceSummary, SimulationParameters } from '../types/disaster';

export function exportSituationReport(
  habitations: CalculatedHabitationState[],
  shelters: CalculatedShelterState[],
  resources: ResourceSummary[],
  params: SimulationParameters,
  scenarioName: string
) {
  const redZones = habitations.filter(h => h.riskCategory === 'RED');
  const orangeZones = habitations.filter(h => h.riskCategory === 'ORANGE');
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>DDMA SITUATION REPORT (SITREP) — RESCUE-ZONE AI</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      margin: 40px;
      line-height: 1.5;
      font-size: 13px;
    }
    .header {
      border-bottom: 3px double #0f172a;
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #0f172a;
      margin: 0 0 4px 0;
    }
    .subtitle {
      font-size: 13px;
      color: #475569;
      margin: 0;
    }
    .meta-box {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 24px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .meta-item strong {
      display: block;
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
    }
    .meta-item span {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }
    h2 {
      font-size: 15px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 24px;
      color: #0f172a;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
    }
    th {
      background: #f8fafc;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      color: #334155;
    }
    .badge-red {
      background: #fee2e2;
      color: #991b1b;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
    }
    .badge-orange {
      background: #ffedd5;
      color: #9a3412;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
    }
    .footer {
      margin-top: 40px;
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
      font-size: 11px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { margin: 20px; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <div style="text-align: right; margin-bottom: 12px;">
    <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer;">Print / Save as PDF</button>
  </div>

  <div class="header">
    <div>
      <h1 class="title">DISTRICT DISASTER MANAGEMENT AUTHORITY (DDMA)</h1>
      <p class="subtitle">AUTOMATED EMERGENCY SITUATION REPORT (SITREP) — RESCUE-ZONE AI</p>
      <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">Smart India Hackathon 2026 | Problem Statement SIH26191 | Team RESILIX</p>
    </div>
    <div style="text-align: right;">
      <div style="font-weight: 800; color: #dc2626; font-size: 14px;">LEVEL-3 EMERGENCY ACTIVE</div>
      <div style="font-size: 11px; color: #475569;">Generated: ${dateStr} ${timeStr}</div>
    </div>
  </div>

  <div class="meta-box">
    <div class="meta-item">
      <strong>Active Scenario</strong>
      <span>${scenarioName}</span>
    </div>
    <div class="meta-item">
      <strong>Precipitation Index</strong>
      <span>+${params.rainfallPct}% Surge</span>
    </div>
    <div class="meta-item">
      <strong>River Stage Telemetry</strong>
      <span style="color: #dc2626;">${params.riverStage}</span>
    </div>
    <div class="meta-item">
      <strong>Critical Red Zones</strong>
      <span style="color: #dc2626;">${redZones.length} Habitations</span>
    </div>
  </div>

  <h2>1. High Priority Relocation Habitations (Ranked by AI Engine)</h2>
  <table>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Zone Code</th>
        <th>Habitation Name</th>
        <th>Population</th>
        <th>Vulnerable Pop</th>
        <th>Risk Score</th>
        <th>Status</th>
        <th>Assigned Shelter</th>
        <th>Evacuation Route</th>
      </tr>
    </thead>
    <tbody>
      ${habitations.slice(0, 6).map(h => `
        <tr>
          <td><strong>#${h.priorityRank}</strong></td>
          <td><strong>${h.code}</strong></td>
          <td>${h.name}</td>
          <td>${h.population.toLocaleString()}</td>
          <td>${h.vulnerablePop.elderly + h.vulnerablePop.children + h.vulnerablePop.disabilities} (PwD: ${h.vulnerablePop.disabilities})</td>
          <td><strong>${h.finalPriorityScore}/100</strong></td>
          <td><span class="${h.riskCategory === 'RED' ? 'badge-red' : 'badge-orange'}">${h.riskCategory} ZONE</span></td>
          <td>${h.calculatedShelterId.toUpperCase()}</td>
          <td>${h.calculatedRouteId.toUpperCase()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>2. Evacuation Shelter Carrying Capacity Status</h2>
  <table>
    <thead>
      <tr>
        <th>Shelter Code</th>
        <th>Facility Name</th>
        <th>Total Capacity</th>
        <th>Current Occupancy</th>
        <th>Occupancy %</th>
        <th>Available Beds</th>
        <th>Status</th>
        <th>Medical Support</th>
      </tr>
    </thead>
    <tbody>
      ${shelters.map(s => `
        <tr>
          <td><strong>${s.code}</strong></td>
          <td>${s.name}</td>
          <td>${s.totalCapacity}</td>
          <td>${s.currentOccupancy}</td>
          <td><strong>${s.occupancyPct}%</strong></td>
          <td>${s.availableBeds}</td>
          <td>
            <span style="color: ${s.status === 'OVERLOAD' ? '#dc2626' : (s.status === 'WARNING' ? '#d97706' : '#16a34a')}; font-weight: bold;">
              ${s.status}
            </span>
          </td>
          <td>${s.medicalBay ? 'YES (Triage ready)' : 'NO (First aid only)'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>3. Emergency Response Resource Inventory & Deficits</h2>
  <table>
    <thead>
      <tr>
        <th>Resource Asset</th>
        <th>Classification</th>
        <th>Mobilized</th>
        <th>Required by Model</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${resources.map(r => `
        <tr>
          <td><strong>${r.name}</strong></td>
          <td>${r.category}</td>
          <td>${r.available} ${r.unit}</td>
          <td>${r.required} ${r.unit}</td>
          <td>
            <strong style="color: ${r.status === 'SUFFICIENT' ? '#16a34a' : '#dc2626'};">
              ${r.status.replace('_', ' ')}
            </strong>
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>4. Incident Commander Authorization & Failsafe Sign-Off</h2>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 4px; font-size: 12px; margin-top: 10px;">
    <p style="margin: 0 0 6px 0;"><strong>Operational Mandate:</strong> In accordance with the Disaster Management Act (2005), the prioritized rescue allocations calculated by RESCUE-ZONE AI have been reviewed by the District Incident Commander. Priority #1 deployment of SDRF Alpha 3 and Inflatable Boat Squadrons is authorized for immediate extraction along Ridge Bypass Route D.</p>
    <div style="display: flex; justify-content: space-between; margin-top: 24px;">
      <div>Authorized Officer: <strong>District Collector & Magistrate / Incident Commander</strong></div>
      <div>Digital Signature Stamp: <strong>DDMA-HQ-AUTH-2026-X99</strong></div>
    </div>
  </div>

  <div class="footer">
    <div>Notice: Prototype Simulation Data generated for Smart India Hackathon 2026 judging demonstration.</div>
    <div>System: RESCUE-ZONE AI v2.4</div>
  </div>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
