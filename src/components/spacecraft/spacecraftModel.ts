import * as THREE from 'three';
import type { InstrumentId, MissionConfiguration } from '../../types/mission';

export interface SpacecraftAssembly {
  group: THREE.Group;
  ionMaterials: THREE.MeshStandardMaterial[];
}

type Position = [number, number, number];
type VisualConfiguration = Pick<MissionConfiguration, 'powerSystemId' | 'propulsionId' | 'communicationId'>;

// Every texture is generated locally; the visual model has no mission-state dependencies.
function foilTexture(): THREE.DataTexture {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const fold = Math.sin(x * 0.31 + Math.sin(y * 0.13) * 4) * Math.cos(y * 0.23 + x * 0.09);
      const value = Math.round(125 + fold * 65 + ((x * 17 + y * 31) % 19));
      const offset = (y * size + x) * 4;
      data.set([value, value, value, 255], offset);
    }
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function solarTexture(): THREE.DataTexture {
  const width = 128;
  const height = 256;
  const data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const border = x % 32 < 2 || y % 32 < 2;
      const conductor = x % 8 === 0;
      const blue = 40 + ((Math.floor(x / 32) * 7 + Math.floor(y / 32) * 11) % 28);
      const color = border ? [106, 125, 142] : conductor ? [37, 66, 94] : [9, 22, blue];
      data.set([...color, 255], (y * width + x) * 4);
    }
  }
  const texture = new THREE.DataTexture(data, width, height);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

export function createSpacecraftAssembly(
  configuration: VisualConfiguration,
  installedInstruments: readonly InstrumentId[]
): SpacecraftAssembly {
  const group = new THREE.Group();
  group.name = 'aurora-spacecraft';
  const ionMaterials: THREE.MeshStandardMaterial[] = [];
  const gold = new THREE.MeshStandardMaterial({ color: '#D4AF37', metalness: 0.83, roughness: 0.36, bumpMap: foilTexture(), bumpScale: 0.045 });
  const titanium = new THREE.MeshStandardMaterial({ color: '#9ca8b4', metalness: 0.8, roughness: 0.3 });
  const graphite = new THREE.MeshStandardMaterial({ color: '#18212d', metalness: 0.55, roughness: 0.5 });
  const white = new THREE.MeshStandardMaterial({ color: '#d7dde0', metalness: 0.35, roughness: 0.36 });
  const glass = new THREE.MeshStandardMaterial({ color: '#046c8f', metalness: 0.95, roughness: 0.12, emissive: '#003b53', emissiveIntensity: 0.45 });
  // Store even conditionally unused materials so disposal is exhaustive.
  const ownedMaterials: THREE.Material[] = [gold, titanium, graphite, white, glass];
  group.userData.ownedMaterials = ownedMaterials;

  function module(name: string, parent: THREE.Object3D = group, position: Position = [0, 0, 0]) {
    const part = new THREE.Group();
    part.name = name;
    part.position.set(...position);
    parent.add(part);
    return part;
  }
  function mesh(parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, position: Position = [0, 0, 0]) {
    const object = new THREE.Mesh(geometry, material);
    object.position.set(...position);
    object.castShadow = object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  function box(parent: THREE.Object3D, size: Position, material: THREE.Material, position: Position) {
    return mesh(parent, new THREE.BoxGeometry(...size), material, position);
  }
  function rod(parent: THREE.Object3D, from: Position, to: Position, radius = 0.025, material = titanium) {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const direction = b.clone().sub(a);
    const object = mesh(parent, new THREE.CylinderGeometry(radius, radius, direction.length(), 8), material);
    object.position.copy(a.add(b).multiplyScalar(0.5));
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    return object;
  }
  function ring(parent: THREE.Object3D, radius: number, tube: number, position: Position, material = titanium) {
    return mesh(parent, new THREE.TorusGeometry(radius, tube, 8, 40), material, position);
  }
  function telescope(parent: THREE.Object3D, position: Position, radius: number, length: number) {
    const pod = module('optical-telescope', parent, position);
    const housing = mesh(pod, new THREE.CylinderGeometry(radius, radius * 1.12, length, 24), graphite);
    housing.rotation.x = Math.PI / 2;
    mesh(pod, new THREE.CircleGeometry(radius * 0.86, 32), glass, [0, 0, length / 2 + 0.005]);
    ring(pod, radius, 0.024, [0, 0, length / 2]);
    ring(pod, radius * 1.08, 0.035, [0, 0, -length * 0.2]);
    return pod;
  }

  const bus = module('central-bus');
  mesh(bus, new THREE.CylinderGeometry(0.88, 0.88, 1.72, 8), gold);
  for (const y of [-0.9, 0.9]) {
    mesh(bus, new THREE.CylinderGeometry(0.96, 0.96, 0.12, 8), titanium, [0, y, 0]);
  }
  // Foil seams, avionics equipment and four reaction-control clusters.
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const x = Math.sin(angle) * 0.87;
    const z = Math.cos(angle) * 0.87;
    rod(bus, [x, -0.84, z], [x, 0.84, z], 0.012);
    if (i % 2 === 0) {
      const bay = box(bus, [0.34, 0.34, 0.15], graphite, [x * 1.04, 0.22, z * 1.04]);
      bay.rotation.y = angle;
      const rcs = module('rcs-cluster', bus, [x, -0.67, z]);
      box(rcs, [0.19, 0.19, 0.19], titanium, [0, 0, 0]);
      const nozzle = mesh(rcs, new THREE.CylinderGeometry(0.06, 0.025, 0.16, 12, 1, true), graphite, [0, 0, 0.16]);
      nozzle.rotation.x = Math.PI / 2;
    }
  }
  box(bus, [0.58, 0.45, 0.08], white, [0, 0.18, -0.83]);
  for (let i = 0; i < 6; i++) box(bus, [0.48, 0.016, 0.02], graphite, [0, 0.01 + i * 0.065, -0.885]);

  const power = module(`power-${configuration.powerSystemId}`);
  if (configuration.powerSystemId === 'long_duration_power') {
    const thermal = new THREE.MeshStandardMaterial({ color: '#7b5940', metalness: 0.8, roughness: 0.48, emissive: '#a53e0d', emissiveIntensity: 0.22 });
    ownedMaterials.push(thermal);
    for (const side of [-1, 1]) {
      rod(power, [side * 0.8, 0, 0], [side * 1.8, -0.15, 0], 0.055);
      const rtg = module('rtg-housing', power, [side * 1.85, -0.15, 0]);
      rtg.rotation.z = -side * 0.18;
      mesh(rtg, new THREE.CylinderGeometry(0.22, 0.22, 1.05, 24), thermal);
      for (let i = 0; i < 10; i++) {
        const angle = i * Math.PI / 5;
        const fin = box(rtg, [0.025, 0.94, 0.27], titanium, [Math.sin(angle) * 0.31, 0, Math.cos(angle) * 0.31]);
        fin.rotation.y = angle;
      }
      for (const y of [-0.54, 0.54]) mesh(rtg, new THREE.CylinderGeometry(0.25, 0.25, 0.065, 24), graphite, [0, y, 0]);
    }
  } else {
    const cells = new THREE.MeshStandardMaterial({ color: '#a6c4ff', map: solarTexture(), metalness: 0.65, roughness: 0.27 });
    ownedMaterials.push(cells);
    const panels = configuration.powerSystemId === 'advanced_solar' ? 3 : 2;
    for (const side of [-1, 1]) {
      const wing = module(side < 0 ? 'solar-port' : 'solar-starboard', power, [side * 0.87, 0, 0]);
      wing.rotation.x = -0.16;
      rod(wing, [0, 0, 0], [side * 0.59, 0, 0], 0.055);
      const gimbal = mesh(wing, new THREE.CylinderGeometry(0.14, 0.14, 0.18, 20), titanium, [side * 0.24, 0, 0]);
      gimbal.rotation.z = Math.PI / 2;
      for (let p = 0; p < panels; p++) {
        const x = side * (1.03 + p * 1.1);
        const panel = module('solar-panel', wing, [x, 0, 0]);
        // Small articulation at the outer panel hinge, like a deployed folding wing.
        panel.rotation.y = side * p * 0.025;
        box(panel, [1.06, 1.75, 0.06], titanium, [0, 0, 0]);
        box(panel, [1, 1.67, 0.014], cells, [0, 0, 0.04]);
        box(panel, [0.96, 1.62, 0.015], graphite, [0, 0, -0.045]);
        rod(panel, [-0.46, -0.77, -0.07], [0.46, 0.77, -0.07], 0.018);
        rod(panel, [-0.46, 0.77, -0.07], [0.46, -0.77, -0.07], 0.018);
        for (const y of [-0.62, 0.62]) rod(wing, [x - side * 0.6, y, 0], [x - side * 0.47, y, 0], 0.055);
      }
    }
  }

  const propulsion = module(`propulsion-${configuration.propulsionId}`, group, [0, -0.95, 0]);
  function chemicalNozzle(scale: number) {
    const engine = module('chemical-nozzle', propulsion);
    engine.scale.setScalar(scale);
    mesh(engine, new THREE.CylinderGeometry(0.19, 0.22, 0.3, 24), titanium, [0, -0.12, 0]);
    const profile = [[0.16, 0], [0.14, -0.15], [0.18, -0.3], [0.27, -0.48], [0.4, -0.68]].map(([r, y]) => new THREE.Vector2(r, y));
    const nozzleMaterial = new THREE.MeshStandardMaterial({ color: '#667480', metalness: 0.84, roughness: 0.28, side: THREE.DoubleSide });
    ownedMaterials.push(nozzleMaterial);
    mesh(engine, new THREE.LatheGeometry(profile, 40), nozzleMaterial, [0, -0.2, 0]);
    const lip = ring(engine, 0.4, 0.025, [0, -0.88, 0]);
    lip.rotation.x = Math.PI / 2;
    rod(engine, [-0.32, 0, 0], [-0.25, -0.54, 0], 0.022);
    rod(engine, [0.32, 0, 0], [0.25, -0.54, 0], 0.022);
  }
  function ionThruster(x: number, radius: number) {
    const thruster = module('ion-thruster', propulsion, [x, -0.25, 0]);
    mesh(thruster, new THREE.CylinderGeometry(radius, radius, 0.25, 24), graphite);
    const rim = ring(thruster, radius * 0.92, 0.035, [0, -0.14, 0]);
    rim.rotation.x = Math.PI / 2;
    const plasma = new THREE.MeshStandardMaterial({ color: '#00F3FF', emissive: '#00F3FF', emissiveIntensity: 1.2, metalness: 0.2, roughness: 0.3 });
    ionMaterials.push(plasma);
    ownedMaterials.push(plasma);
    const grid = mesh(thruster, new THREE.CircleGeometry(radius * 0.75, 32), plasma, [0, -0.145, 0]);
    grid.rotation.x = Math.PI / 2;
    for (let i = -2; i <= 2; i++) {
      const z = i * radius * 0.22;
      rod(thruster, [-radius * 0.58, -0.153, z], [radius * 0.58, -0.153, z], 0.008, graphite);
    }
  }
  if (configuration.propulsionId !== 'electric') chemicalNozzle(configuration.propulsionId === 'chemical' ? 1 : 0.8);
  if (configuration.propulsionId !== 'chemical') {
    for (const side of [-1, 1]) ionThruster(side * 0.62, configuration.propulsionId === 'electric' ? 0.29 : 0.18);
  }

  const comms = module(`comms-${configuration.communicationId}`, group, [0, 0.96, 0]);
  rod(comms, [0, 0, 0], [0, 0.45, 0], 0.075);
  mesh(comms, new THREE.SphereGeometry(0.14, 16, 12), titanium, [0, 0.45, 0]);
  const dish = module('parabolic-dish', comms, [0, 0.49, 0]);
  dish.rotation.x = 0.35;
  dish.rotation.z = -0.22;
  const dishRadius = configuration.communicationId === 'deep_space' ? 0.98 : configuration.communicationId === 'high_gain' ? 0.74 : 0.44;
  const dishProfile = Array.from({ length: 21 }, (_, i) => {
    const r = dishRadius * i / 20;
    return new THREE.Vector2(r, 0.34 * (r / dishRadius) ** 2);
  });
  const dishMaterial = new THREE.MeshStandardMaterial({ color: '#e1e4df', metalness: 0.63, roughness: 0.32, side: THREE.DoubleSide });
  ownedMaterials.push(dishMaterial);
  mesh(dish, new THREE.LatheGeometry(dishProfile, 64), dishMaterial);
  const dishRim = ring(dish, dishRadius, 0.025, [0, 0.34, 0]);
  dishRim.rotation.x = Math.PI / 2;
  for (let i = 0; i < 3; i++) {
    const angle = i * Math.PI * 2 / 3;
    rod(dish, [Math.cos(angle) * dishRadius * 0.86, 0.26, Math.sin(angle) * dishRadius * 0.86], [0, 0.94, 0], 0.018);
  }
  mesh(dish, new THREE.CylinderGeometry(0.09, 0.12, 0.16, 16), titanium, [0, 0.93, 0]);
  if (configuration.communicationId === 'deep_space') {
    const optical = module('optical-transceiver', comms, [0.68, 0.04, 0.6]);
    box(optical, [0.32, 0.27, 0.34], gold, [0, -0.03, 0]);
    telescope(optical, [0, 0.12, 0.2], 0.15, 0.46);
    const mirror = box(optical, [0.16, 0.12, 0.018], glass, [0.25, 0.15, 0.35]);
    mirror.rotation.y = -0.6;
  }

  const instruments = new Set(installedInstruments);
  if (instruments.has('radar')) {
    const radar = module('instrument-radar', group, [0, -0.55, -0.88]);
    box(radar, [0.55, 0.22, 0.18], gold, [0, 0, 0]);
    for (const side of [-1, 1]) {
      rod(radar, [side * 0.25, 0, 0], [side * 3.6, -0.55, -0.45], 0.017);
      rod(radar, [side * 0.3, 0.04, 0], [side * 1.2, -0.1, -0.06], 0.035);
      mesh(radar, new THREE.SphereGeometry(0.045, 8, 8), white, [side * 3.6, -0.55, -0.45]);
    }
  }
  if (instruments.has('imaging_system')) {
    const imaging = module('instrument-imaging_system', group, [0, -0.1, 0.91]);
    box(imaging, [0.75, 0.25, 0.45], titanium, [0, -0.2, 0.15]);
    telescope(imaging, [-0.21, 0, 0.2], 0.2, 0.72);
    telescope(imaging, [0.23, 0.02, 0.12], 0.145, 0.53);
  }
  if (instruments.has('spectrometer')) {
    const spectrometer = module('instrument-spectrometer', group, [-0.65, 0.4, 0.61]);
    spectrometer.rotation.y = -0.55;
    box(spectrometer, [0.38, 0.34, 0.38], gold, [0, 0, 0]);
    box(spectrometer, [0.3, 0.23, 0.23], graphite, [0, 0, 0.26]);
    box(spectrometer, [0.2, 0.035, 0.015], glass, [0, 0, 0.383]);
  }
  if (instruments.has('radiation_detector')) {
    const radiation = module('instrument-radiation_detector', group, [0.62, 0.35, -0.62]);
    rod(radiation, [0, 0, 0], [0.7, 0.65, -0.75], 0.027);
    box(radiation, [0.23, 0.23, 0.3], white, [0.7, 0.65, -0.75]);
    telescope(radiation, [0.7, 0.65, -0.57], 0.075, 0.15);
  }
  if (instruments.has('atmospheric_sensor')) {
    const sensor = module('instrument-atmospheric_sensor', group, [0.63, 0.42, 0.63]);
    box(sensor, [0.3, 0.27, 0.32], gold, [0, 0, 0]);
    const aperture = mesh(sensor, new THREE.CylinderGeometry(0.18, 0.065, 0.28, 24, 1, true), titanium, [0, 0, 0.3]);
    aperture.rotation.x = Math.PI / 2;
    telescope(sensor, [0.19, -0.1, 0.14], 0.07, 0.3);
  }

  return { group, ionMaterials };
}

/** Dispose shared resources exactly once, including textures owned by PBR materials. */
export function disposeObject(root: THREE.Object3D): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  root.traverse(object => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
      geometries.add(object.geometry);
      const owned = Array.isArray(object.material) ? object.material : [object.material];
      owned.forEach(material => materials.add(material));
    }
    const owned: THREE.Material[] | undefined = object.userData.ownedMaterials;
    owned?.forEach(material => materials.add(material));
  });
  materials.forEach(material => {
    Object.values(material).forEach(value => {
      if (value instanceof THREE.Texture) textures.add(value);
    });
  });
  textures.forEach(texture => texture.dispose());
  materials.forEach(material => material.dispose());
  geometries.forEach(geometry => geometry.dispose());
  root.clear();
}
