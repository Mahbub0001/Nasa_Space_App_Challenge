import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const compiled = await build({ entryPoints: ['src/simulation/scoring.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { applyDecisionHistory, buildMissionResult } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);

const config = {
  destinationId: 'mars', launchVehicleId: 'heavy_lift', propulsionId: 'hybrid',
  powerSystemId: 'advanced_solar', communicationId: 'deep_space',
  selectedInstrumentIds: ['spectrometer'],
};

const resources = {
  massKg: 4000, maxMassKg: 4500, massMarginKg: 500,
  powerUnits: 90, maxPowerUnits: 100, powerMarginUnits: 10,
  budgetBillion: 2, maxBudgetBillion: 2.4, budgetMarginBillion: .4,
  fuelPct: 80, riskPct: 30, scienceScore: 70, reliabilityPct: 90, dataReturnScore: 80,
};

const decisions = [
  { eventId: 'course_deviation', choiceId: 'burn', deltas: { fuel: -8, risk: -8, science: 0 } },
  { eventId: 'comms_window', choiceId: 'transmit', deltas: { fuel: 0, risk: 0, science: 0, power: -8, data: 10 } },
];

test('final mission resources reflect flight choices once without changing preflight resources', () => {
  const final = applyDecisionHistory(resources, decisions);
  assert.equal(final.fuelPct, 72);
  assert.equal(final.riskPct, 22);
  assert.equal(final.powerUnits, 82);
  assert.equal(final.powerMarginUnits, 18);
  assert.equal(final.dataReturnScore, 90);
  assert.equal(resources.fuelPct, 80);
  const result = buildMissionResult(config, resources, decisions);
  assert.equal(result.finalResources.fuelPct, 72);
  assert.equal(result.finalResources.dataReturnScore, 90);
});

test('decision history clamps consumables to valid ranges', () => {
  const final = applyDecisionHistory(resources, [{ deltas: { fuel: -100, risk: 100, science: -100, power: -100, data: 100 } }]);
  assert.equal(final.fuelPct, 0);
  assert.equal(final.riskPct, 100);
  assert.equal(final.scienceScore, 0);
  assert.equal(final.powerUnits, 0);
  assert.equal(final.dataReturnScore, 100);
});

test('flight objective failure prevents a misleading high mission rating', () => {
  const failed = buildMissionResult(config, resources, decisions, {
    orbitCaptured: false, packetsReturned: 3, packetsAvailable: 3,
    trajectoryError: 12, missionStatus: 'failed',
  });
  assert.equal(failed.scoreBreakdown.classification, 'MISSION FAILURE');
  assert.ok(failed.scoreBreakdown.finalScore <= 39);
  assert.equal(failed.flightOutcome.orbitCaptured, false);
});

test('flight score uses packets actually returned instead of only projected antenna capacity', () => {
  const result = buildMissionResult(config, resources, decisions, {
    orbitCaptured: true, packetsReturned: 1, packetsAvailable: 3,
    trajectoryError: 0, missionStatus: 'partial',
  });
  assert.equal(result.scoreBreakdown.dataReturn, 33);
  assert.equal(result.scoreBreakdown.classification, 'PARTIAL SUCCESS');
  assert.ok(result.scoreBreakdown.finalScore <= 74);
});
