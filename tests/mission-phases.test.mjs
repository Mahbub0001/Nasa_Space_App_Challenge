import test from 'node:test';
import assert from 'node:assert/strict';
import { sound } from '../src/utils/sound.ts';

test('sound engine provides space mission audio synthesizers', () => {
  assert.equal(typeof sound.playRetroBurn, 'function');
  assert.equal(typeof sound.playPlasmaEntry, 'function');
  assert.equal(typeof sound.playTouchdownCheer, 'function');
  assert.equal(typeof sound.playDiscoveryUnlock, 'function');
});
