import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  evaluateInsertionBurn, 
  DESTINATION_LANDING_SITES, 
  evaluateTouchdown 
} from '../src/simulation/landingGame.ts';

test('landing sites are defined for all destinations', () => {
  const marsSites = DESTINATION_LANDING_SITES.mars;
  assert.ok(marsSites.length >= 3);
  assert.ok(marsSites.some(s => s.id === 'jezero'));

  const lunarSites = DESTINATION_LANDING_SITES.lunar_orbit;
  assert.ok(lunarSites.length >= 2);
  assert.ok(lunarSites.some(s => s.id === 'shackleton'));

  const asteroidSites = DESTINATION_LANDING_SITES.asteroid_belt;
  assert.ok(asteroidSites.length >= 2);
});

test('nominal insertion burn captures spacecraft in target orbit', () => {
  const marsNominal = evaluateInsertionBurn(-12.2, 240, 'mars');
  assert.equal(marsNominal.quality, 'excellent');
  assert.ok(marsNominal.fuelDelta < 0);
  assert.ok(marsNominal.riskDelta <= 0);

  const marsTooShallow = evaluateInsertionBurn(-8.0, 240, 'mars');
  assert.equal(marsTooShallow.quality, 'critical');
  assert.ok(marsTooShallow.title.toLowerCase().includes('shallow') || marsTooShallow.title.toLowerCase().includes('skip'));

  const marsTooSteep = evaluateInsertionBurn(-16.0, 240, 'mars');
  assert.equal(marsTooSteep.quality, 'critical');
  assert.ok(marsTooSteep.riskDelta > 0);
});

test('touchdown evaluation balances throttle against landing site hazards', () => {
  const jezero = DESTINATION_LANDING_SITES.mars.find(s => s.id === 'jezero');
  assert.ok(jezero);

  const goodLanding = evaluateTouchdown(jezero, 75, 40);
  assert.equal(goodLanding.success, true);
  assert.ok(goodLanding.touchdownVelocityMs <= 3.0);
  assert.ok(goodLanding.scienceYield > 0);

  const tooFast = evaluateTouchdown(jezero, 30, 40);
  assert.equal(tooFast.success, false);
  assert.ok(tooFast.touchdownVelocityMs > 8.0);
});
