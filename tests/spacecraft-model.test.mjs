import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import * as THREE from 'three';

const compiled = await build({
  entryPoints: ['src/components/spacecraft/spacecraftModel.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  plugins: [{
    name: 'resolve-local-three',
    setup(builder) {
      builder.onResolve({ filter: /^three$/ }, () => ({ path: import.meta.resolve('three'), external: true }));
    }
  }],
});
const { createSpacecraftAssembly, disposeObject } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
const config = { powerSystemId: 'advanced_solar', propulsionId: 'hybrid', communicationId: 'deep_space' };
const instruments = ['radar', 'imaging_system', 'spectrometer', 'radiation_detector', 'atmospheric_sensor'];
const count = (root, name) => {
  let total = 0;
  root.traverse(object => { if (object.name === name) total++; });
  return total;
};

test('all subsystem combinations build finite, distinct assemblies without mutating input', () => {
  for (const powerSystemId of ['solar_array', 'advanced_solar', 'long_duration_power']) {
    for (const propulsionId of ['chemical', 'electric', 'hybrid']) {
      for (const communicationId of ['standard', 'high_gain', 'deep_space']) {
        const input = Object.freeze({ powerSystemId, propulsionId, communicationId });
        const payload = Object.freeze([...instruments]);
        const { group, ionMaterials } = createSpacecraftAssembly(input, payload);
        const bounds = new THREE.Box3().setFromObject(group);
        assert.ok(Number.isFinite(bounds.min.x) && bounds.max.x > bounds.min.x);
        assert.equal(count(group, 'solar-panel'), powerSystemId === 'advanced_solar' ? 6 : powerSystemId === 'solar_array' ? 4 : 0);
        assert.equal(count(group, 'rtg-housing'), powerSystemId === 'long_duration_power' ? 2 : 0);
        assert.equal(count(group, 'chemical-nozzle'), propulsionId === 'electric' ? 0 : 1);
        assert.equal(count(group, 'ion-thruster'), propulsionId === 'chemical' ? 0 : 2);
        assert.equal(ionMaterials.length, propulsionId === 'chemical' ? 0 : 2);
        assert.equal(count(group, 'optical-transceiver'), communicationId === 'deep_space' ? 1 : 0);
        assert.equal(count(group, 'parabolic-dish'), 1);
        for (const id of instruments) assert.equal(count(group, `instrument-${id}`), 1);
        disposeObject(group);
      }
    }
  }
});

test('payload attachments exactly follow installedInstruments, including removing every payload', () => {
  for (const selected of [[], ...instruments.map(id => [id]), instruments]) {
    const { group } = createSpacecraftAssembly(config, selected);
    for (const id of instruments) assert.equal(count(group, `instrument-${id}`), selected.includes(id) ? 1 : 0);
    disposeObject(group);
  }
});

test('disposing an assembly releases each geometry, material and generated texture once', () => {
  const { group } = createSpacecraftAssembly(config, instruments);
  const resources = new Set(group.userData.ownedMaterials);
  group.traverse(object => {
    if (object.geometry) resources.add(object.geometry);
    if (object.material) {
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) resources.add(material);
    }
  });
  for (const resource of [...resources]) {
    for (const value of Object.values(resource)) if (value?.isTexture) resources.add(value);
  }
  const disposed = new Map();
  for (const resource of resources) resource.addEventListener('dispose', () => disposed.set(resource, (disposed.get(resource) || 0) + 1));
  disposeObject(group);
  assert.equal(group.children.length, 0);
  for (const resource of resources) assert.equal(disposed.get(resource), 1, `Resource ${resource.type || resource.uuid} was not disposed exactly once`);
});
