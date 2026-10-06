import test from 'node:test';
import assert from 'node:assert/strict';
import { generateDiscoveries, calculateTotalDiscoveryScore } from '../src/simulation/discoveryGame.ts';

test('generateDiscoveries returns discoveries matching installed instruments', () => {
  const config = {
    destinationId: 'mars',
    launchVehicleId: 'heavy_lift',
    propulsionId: 'hybrid',
    powerSystemId: 'advanced_solar',
    communicationId: 'deep_space',
    selectedInstrumentIds: ['radar', 'spectrometer', 'imaging_system'],
  };

  const discoveries = generateDiscoveries(config, 'jezero', 3);
  assert.equal(discoveries.length, 3);
  assert.ok(discoveries.some(d => d.instrumentId === 'radar'));
  assert.ok(discoveries.some(d => d.instrumentId === 'spectrometer'));
  assert.ok(discoveries.some(d => d.instrumentId === 'imaging_system'));

  const totalScore = calculateTotalDiscoveryScore(discoveries);
  assert.ok(totalScore > 0);
});

test('discoveries adapt to lunar and asteroid destinations', () => {
  const lunarConfig = {
    destinationId: 'lunar_orbit',
    launchVehicleId: 'medium_lift',
    propulsionId: 'chemical',
    powerSystemId: 'solar_array',
    communicationId: 'standard',
    selectedInstrumentIds: ['radar'],
  };

  const lunarDiscoveries = generateDiscoveries(lunarConfig, 'shackleton', 2);
  assert.equal(lunarDiscoveries.length, 1);
  assert.ok(lunarDiscoveries[0].evidence.toLowerCase().includes('lunar') || lunarDiscoveries[0].evidence.toLowerCase().includes('ice'));
});
