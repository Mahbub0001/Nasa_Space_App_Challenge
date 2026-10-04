import { MissionConfiguration } from '../types/mission';
import { ResourceState, AuditCheck, AuditResult } from '../types/simulation';
import { DESTINATIONS } from '../data/destinations';

export function checkConstraints(config: MissionConfiguration, resources: ResourceState): AuditResult {
  const checks: AuditCheck[] = [];
  const criticalIssues: string[] = [];

  // 1. MASS Check
  const massRatio = resources.massKg / resources.maxMassKg;
  let massStatus: AuditCheck['status'] = 'PASS';
  let massDetails = `Payload and wet mass are within launcher capacity (${resources.massMarginKg} kg reserve margin).`;
  let massRemedy: string | undefined;

  if (resources.massKg > resources.maxMassKg) {
    massStatus = 'FAIL';
    const excess = resources.massKg - resources.maxMassKg;
    massDetails = `Total launch mass exceeds structural throw-weight ceiling by ${excess} kg.`;
    massRemedy = 'Upgrade to Heavy Lift vehicle, select lighter power/comms, or remove scientific instruments.';
    criticalIssues.push(`Spacecraft mass exceeds structural limit by ${excess} kg.`);
  } else if (massRatio > 0.92) {
    massStatus = 'WARN';
    massDetails = `Mass margin is narrow (${resources.massMarginKg} kg remaining). Trajectory reserves tight.`;
  }

  checks.push({
    id: 'mass',
    name: 'SPACECRAFT MASS',
    status: massStatus,
    currentDisplay: `${resources.massKg.toLocaleString()} KG`,
    limitDisplay: `${resources.maxMassKg.toLocaleString()} KG MAX`,
    details: massDetails,
    remedy: massRemedy
  });

  // 2. POWER Check
  let powerStatus: AuditCheck['status'] = 'PASS';
  let powerDetails = `Generation capacity meets all simultaneous payload & avionics demand (${resources.powerMarginUnits} units margin).`;
  let powerRemedy: string | undefined;

  if (resources.powerUnits > resources.maxPowerUnits) {
    powerStatus = 'FAIL';
    const deficit = resources.powerUnits - resources.maxPowerUnits;
    powerDetails = `Power demand exceeds bus generation capacity by ${deficit} units.`;
    powerRemedy = 'Upgrade to Advanced Concentrator Solar Arrays or Long-Duration RTG, or remove high-draw payloads like Radar.';
    criticalIssues.push(`Electrical generation deficit of ${deficit} units.`);
  } else if (resources.powerMarginUnits < 6) {
    powerStatus = 'WARN';
    powerDetails = `Marginal power reserve (${resources.powerMarginUnits} units). Peak radar sweeps may cause voltage dips.`;
  }

  checks.push({
    id: 'power',
    name: 'POWER CAPACITY',
    status: powerStatus,
    currentDisplay: `${resources.powerUnits} UNITS`,
    limitDisplay: `${resources.maxPowerUnits} UNITS CAP`,
    details: powerDetails,
    remedy: powerRemedy
  });

  // 3. BUDGET Check
  let budgetStatus: AuditCheck['status'] = 'PASS';
  let budgetDetails = `Total mission lifecycle estimate within congressional appropriations ($${resources.budgetMarginBillion.toFixed(2)}B contingency).`;
  let budgetRemedy: string | undefined;

  if (resources.budgetBillion > resources.maxBudgetBillion) {
    budgetStatus = 'FAIL';
    const overrun = (resources.budgetBillion - resources.maxBudgetBillion).toFixed(2);
    budgetDetails = `Lifecycle cost exceeds maximum allocation by $${overrun}B.`;
    budgetRemedy = 'Select lower tier launch vehicle or optimize subsystem architecture.';
    criticalIssues.push(`Budget allocation overrun of $${overrun}B.`);
  } else if (resources.budgetMarginBillion < 0.15) {
    budgetStatus = 'WARN';
    budgetDetails = `Contingency reserve is low ($${resources.budgetMarginBillion.toFixed(2)}B remaining).`;
  }

  checks.push({
    id: 'budget',
    name: 'MISSION BUDGET',
    status: budgetStatus,
    currentDisplay: `$${resources.budgetBillion.toFixed(2)}B`,
    limitDisplay: `$${resources.maxBudgetBillion.toFixed(2)}B CAP`,
    details: budgetDetails,
    remedy: budgetRemedy
  });

  // 4. FUEL / DELTA-V Check
  let fuelStatus: AuditCheck['status'] = 'PASS';
  let fuelDetails = `Propellant reserves adequate for orbital insertion, reaction wheel desaturation, and mid-course maneuvers.`;
  let fuelRemedy: string | undefined;

  if (resources.fuelPct < 25) {
    fuelStatus = 'FAIL';
    fuelDetails = `Propellant reserve (${resources.fuelPct}%) is insufficient for safe orbital insertion capture burn.`;
    fuelRemedy = 'Select Hybrid or Electric propulsion system with higher specific impulse.';
    criticalIssues.push(`Insufficient propellant margin (${resources.fuelPct}%).`);
  } else if (resources.fuelPct < 45) {
    fuelStatus = 'WARN';
    fuelDetails = `Tight propellant margin (${resources.fuelPct}%). Mid-course correction burns will carry significant trade-offs.`;
  }

  checks.push({
    id: 'fuel',
    name: 'FUEL & DELTA-V',
    status: fuelStatus,
    currentDisplay: `${resources.fuelPct}%`,
    limitDisplay: `25% MIN`,
    details: fuelDetails,
    remedy: fuelRemedy
  });

  // 5. COMMUNICATION Check
  const dest = DESTINATIONS.find(d => d.id === config.destinationId) ?? DESTINATIONS[1];
  let commsStatus: AuditCheck['status'] = 'PASS';
  let commsDetails = `Downlink telemetry rate and antenna gain meet destination link-budget requirements.`;
  let commsRemedy: string | undefined;

  if (dest.id === 'asteroid_belt' && config.communicationId === 'standard') {
    commsStatus = 'FAIL';
    commsDetails = `Standard antenna aperture lacks SNR gain for outer-belt planetary distances.`;
    commsRemedy = 'Select High-Gain or Deep-Space optical communication system.';
    criticalIssues.push('Standard antenna cannot maintain link budget at Main Asteroid Belt.');
  } else if (dest.id === 'mars' && config.communicationId === 'standard') {
    commsStatus = 'WARN';
    commsDetails = `Standard antenna will create severe downlink bottlenecks for raw multispectral imaging datasets.`;
  }

  checks.push({
    id: 'comms',
    name: 'COMMUNICATION LINK',
    status: commsStatus,
    currentDisplay: `${resources.dataReturnScore} PTS`,
    limitDisplay: `NOMINAL`,
    details: commsDetails,
    remedy: commsRemedy
  });

  // 6. SCIENTIFIC PAYLOAD Check
  let payloadStatus: AuditCheck['status'] = 'PASS';
  let payloadDetails = `${config.selectedInstrumentIds.length} scientific instruments integrated to fulfill primary planetary objectives.`;
  let payloadRemedy: string | undefined;

  if (config.selectedInstrumentIds.length === 0) {
    payloadStatus = 'FAIL';
    payloadDetails = 'No scientific instruments installed. Mission cannot fulfill primary science return directive.';
    payloadRemedy = 'Navigate to Scientific Payload configuration and install at least one instrument.';
    criticalIssues.push('No scientific instruments installed.');
  } else if (config.selectedInstrumentIds.length === 1) {
    payloadStatus = 'WARN';
    payloadDetails = 'Single instrument selected. Scientific return is limited relative to mission launch cost.';
  }

  checks.push({
    id: 'payload',
    name: 'SCIENTIFIC PAYLOAD',
    status: payloadStatus,
    currentDisplay: `${config.selectedInstrumentIds.length} ACTIVE`,
    limitDisplay: `1+ REQ`,
    details: payloadDetails,
    remedy: payloadRemedy
  });

  // 7. RISK Check
  let riskStatus: AuditCheck['status'] = 'PASS';
  let riskDetails = `Cumulative operational risk is within acceptable program thresholds.`;
  let riskRemedy: string | undefined;

  if (resources.riskPct > 60) {
    riskStatus = 'FAIL';
    riskDetails = `Mission risk (${resources.riskPct}%) exceeds safety-of-flight ceiling. High probability of subsystem failure.`;
    riskRemedy = 'Choose higher reliability launch vehicle, proven power sources, or reduce subsystem complexity.';
    criticalIssues.push(`Mission operational risk (${resources.riskPct}%) exceeds maximum safety threshold.`);
  } else if (resources.riskPct > 45) {
    riskStatus = 'WARN';
    riskDetails = `Elevated operational risk (${resources.riskPct}%). Requires active flight mitigation during cruise events.`;
  }

  checks.push({
    id: 'risk',
    name: 'OPERATIONAL RISK',
    status: riskStatus,
    currentDisplay: `${resources.riskPct}%`,
    limitDisplay: `60% CEILING`,
    details: riskDetails,
    remedy: riskRemedy
  });

  const hasFailures = checks.some(c => c.status === 'FAIL');
  const isReady = !hasFailures;

  // Compute a preview score
  const scorePreview = Math.round(
    (resources.scienceScore * 0.30) +
    (resources.reliabilityPct * 0.25) +
    ((100 - resources.riskPct) * 0.20) +
    (Math.max(0, 100 - (resources.budgetBillion / resources.maxBudgetBillion) * 60) * 0.15) +
    (resources.dataReturnScore * 0.10)
  );

  return {
    isReady,
    scorePreview: Math.min(100, Math.max(10, scorePreview)),
    checks,
    criticalIssues
  };
}
