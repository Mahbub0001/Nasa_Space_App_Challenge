import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const compiled = await build({ entryPoints: ['src/simulation/flightGame.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { evaluateTrajectory, evaluatePower, evaluateDownlink, calculateFlightOutcome, downlinkCapacity } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);

const config = { destinationId: 'mars', propulsionId: 'hybrid', powerSystemId: 'advanced_solar', communicationId: 'deep_space', selectedInstrumentIds: ['imaging_system', 'spectrometer', 'radar'] };
const resources = { maxPowerUnits: 100, powerUnits: 95, fuelPct: 82, riskPct: 22, scienceScore: 104, dataReturnScore: 96 };

test('trajectory skill trades fuel for lower arrival risk and an excessive error can miss orbit', () => {
  const aligned = evaluateTrajectory(12, config);
  const missed = evaluateTrajectory(0, config);
  assert.equal(aligned.error, 0);
  assert.equal(aligned.quality, 'excellent');
  assert.ok(aligned.fuelDelta < 0);
  assert.ok(missed.riskDelta > aligned.riskDelta);
  assert.equal(calculateFlightOutcome({ ...resources, fuelPct: 77, riskPct: 15 }, aligned.error, 3, 4).missionStatus, 'full');
  assert.equal(calculateFlightOutcome({ ...resources, fuelPct: 82, riskPct: 55 }, missed.error, 3, 4).missionStatus, 'failed');
});

test('spacecraft power and antenna choices change playable capacity', () => {
  const overloaded = evaluatePower(config, resources, true, true);
  const protectedBus = evaluatePower(config, resources, true, false);
  assert.ok(overloaded.load > overloaded.capacity);
  assert.equal(overloaded.quality, 'critical');
  assert.ok(protectedBus.load <= protectedBus.capacity);
  assert.ok(protectedBus.riskDelta < overloaded.riskDelta);
  assert.ok(downlinkCapacity(config) > downlinkCapacity({ ...config, communicationId: 'standard' }));
});

test('data packets are limited by installed instruments and link capacity', () => {
  const full = evaluateDownlink(config, ['navigation', 'imaging', 'spectra']);
  assert.equal(full.used, 8);
  assert.equal(full.valid, true);
  assert.ok(full.dataDelta > 0);
  const over = evaluateDownlink(config, ['navigation', 'imaging', 'spectra', 'subsurface']);
  assert.equal(over.valid, false);
  const noRadar = evaluateDownlink({ ...config, selectedInstrumentIds: ['imaging_system'] }, ['subsurface']);
  assert.equal(noRadar.valid, false);
});
