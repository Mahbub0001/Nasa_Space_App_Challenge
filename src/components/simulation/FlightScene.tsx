import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { MissionConfiguration } from '../../types/mission';
import type { FlightChallengeId } from '../../simulation/flightGame';
import { createSpacecraftAssembly } from '../spacecraft/spacecraftModel';
import './flight.css';

interface FlightSceneProps {
  config: MissionConfiguration;
  progress: number;
  challenge: FlightChallengeId | null;
  playing: boolean;
  burn: number;
  stormActive: boolean;
  failed?: boolean;
}

function planetTexture(destination: MissionConfiguration['destinationId']) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 256;
  const context = canvas.getContext('2d')!;
  const palette = destination === 'mars' ? ['#8a4738', '#bd7052', '#d48a65', '#6d3834'] : destination === 'lunar_orbit' ? ['#9ca5a6', '#c3c6c1', '#747d83', '#dbd7cd'] : ['#877265', '#a38c77', '#62564f', '#bb9b7e'];
  context.fillStyle = palette[0]; context.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 760; i++) {
    const x = (i * 137.508) % 512;
    const y = (i * 79.73) % 256;
    const size = 3 + (i % 19) * 1.8;
    context.fillStyle = palette[i % palette.length];
    context.globalAlpha = .07 + (i % 6) * .025;
    context.beginPath(); context.ellipse(x, y, size * 1.7, size * .55, i * .17, 0, Math.PI * 2); context.fill();
  }
  context.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function disposeScene(scene: THREE.Scene) {
  scene.traverse(object => {
    if (!(object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line)) return;
    object.geometry?.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach(material => {
      if (material instanceof THREE.MeshStandardMaterial) {
        material.map?.dispose();
        material.bumpMap?.dispose();
        material.normalMap?.dispose();
      }
      material.dispose();
    });
  });
}

export const FlightScene: React.FC<FlightSceneProps> = ({ config, progress, challenge, playing, burn, stormActive, failed = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ progress, challenge, playing, burn, stormActive, failed });
  const [inspected, setInspected] = useState<'spacecraft' | 'destination' | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  stateRef.current = { progress, challenge, playing, burn, stormActive, failed };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setUnavailable(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', 'Interactive 3D flight scene. Drag to orbit the camera; select the spacecraft or destination to inspect.');
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.tabIndex = 0;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050b17');
    scene.fog = new THREE.FogExp2('#050b17', .008);
    const camera = new THREE.PerspectiveCamera(46, 1, .1, 200);
    camera.position.set(0, 3.2, 16);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 8;
    controls.maxDistance = 25;
    controls.maxPolarAngle = Math.PI * .78;
    controls.target.set(0, 0, -1);
    controls.update();

    scene.add(new THREE.AmbientLight('#7798b7', .85));
    const sunlight = new THREE.DirectionalLight('#ffe3c7', 3.4);
    sunlight.position.set(-7, 7, 11); scene.add(sunlight);
    const rim = new THREE.PointLight('#7aa9ef', 90, 25);
    rim.position.set(3, -3, 4); scene.add(rim);

    const starPositions = new Float32Array(750 * 3);
    for (let i = 0; i < 750; i++) {
      const azimuth = i * 2.399963;
      const altitude = 1 - (i + .5) * 2 / 750;
      const radius = Math.sqrt(1 - altitude * altitude);
      starPositions.set([Math.cos(azimuth) * radius * 75, altitude * 75, Math.sin(azimuth) * radius * 75], i * 3);
    }
    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    scene.add(new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: '#d9e9f8', size: .11, transparent: true, opacity: .65 })));

    const destination = new THREE.Mesh(new THREE.SphereGeometry(3.3, 56, 36), new THREE.MeshStandardMaterial({ map: planetTexture(config.destinationId), roughness: 1 }));
    destination.position.set(8.5, -.8, -11); destination.name = 'destination'; scene.add(destination);
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(3.4, 48, 32), new THREE.MeshBasicMaterial({ color: config.destinationId === 'mars' ? '#e89571' : '#a6c6d2', transparent: true, opacity: .08, side: THREE.BackSide }));
    destination.add(atmosphere);
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 24), new THREE.MeshStandardMaterial({ color: '#326a9c', emissive: '#0c3159', emissiveIntensity: .4, roughness: 1 }));
    earth.position.set(-10, -3, -19); scene.add(earth);

    const assembly = createSpacecraftAssembly(config, config.selectedInstrumentIds);
    const craft = assembly.group;
    craft.name = 'spacecraft';
    craft.scale.setScalar(.58);
    craft.rotation.set(.62, -.42, -.08);
    scene.add(craft);
    const thruster = new THREE.Mesh(new THREE.ConeGeometry(.23, .9, 20), new THREE.MeshBasicMaterial({ color: '#8adfff', transparent: true, opacity: .65, depthWrite: false }));
    thruster.rotation.z = Math.PI;
    thruster.position.set(0, -1.15, 0);
    craft.add(thruster);

    const pathPoints = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-8, -2.5, -8), new THREE.Vector3(0, 3, -7), new THREE.Vector3(7, -.2, -9)).getPoints(90);
    const route = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pathPoints), new THREE.LineBasicMaterial({ color: '#8ab9d9', transparent: true, opacity: .35 }));
    scene.add(route);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerStart = { x: 0, y: 0 };
    const onPointerDown = (event: PointerEvent) => { pointerStart = { x: event.clientX, y: event.clientY }; };
    const onPointerUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 7) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects([craft, destination], true);
      if (hits.length) setInspected(hits[0].object === destination || hits[0].object.parent === destination ? 'destination' : 'spacecraft');
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    let frame = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const startTime = performance.now();
    const render = () => {
      frame = requestAnimationFrame(render);
      if (document.hidden) return;
      const elapsed = (performance.now() - startTime) / 1000;
      const status = stateRef.current;
      const approach = Math.max(0, (status.progress - 40) / 60);
      destination.position.x = 8.5 - approach * 4.5;
      destination.position.z = -11 + approach * 2;
      destination.rotation.y += reducedMotion.matches ? 0 : .0007;
      craft.position.set(-.25 + approach * 1.7, (reducedMotion.matches ? 0 : Math.sin(elapsed * .8) * .09) - (status.failed ? 1.55 : 0), 0);
      craft.rotation.z = status.failed ? -.48 : status.challenge === 'trajectory' ? (status.burn - 12) * .025 : -.08;
      assembly.ionMaterials.forEach(material => { material.emissiveIntensity = status.playing ? 1.4 + Math.sin(elapsed * 13) * .3 : 1.1; });
      thruster.visible = status.playing || status.challenge === 'trajectory';
      (thruster.material as THREE.MeshBasicMaterial).opacity = status.challenge === 'trajectory' ? .25 + status.burn / 100 : .25 + Math.sin(elapsed * 17) * .1;
      thruster.scale.y = status.challenge === 'trajectory' ? .35 + status.burn / 20 : 1 + Math.sin(elapsed * 20) * .18;
      rim.color.set(status.stormActive || status.failed ? '#ef795c' : '#7aa9ef');
      controls.update(); renderer.render(scene, camera);
    };
    render();
    const resize = new ResizeObserver(() => {
      const width = mount.clientWidth, height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height);
    });
    resize.observe(mount);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      disposeScene(scene); renderer.dispose(); renderer.forceContextLoss(); mount.removeChild(renderer.domElement);
    };
  }, [config.destinationId]);

  const targetName = config.destinationId === 'mars' ? 'Mars' : config.destinationId === 'lunar_orbit' ? 'Moon' : 'Asteroid';
  return <div className={`flight-scene ${stormActive ? 'flight-scene--storm' : ''}`}>
    <div ref={mountRef} className="flight-scene__canvas" />
    <div className="flight-scene__vignette" />
    <div className="flight-scene__label flight-scene__label--top"><span className="flight-scene__live" /> AURORA / LIVE FLIGHT <span>{failed ? 'ORBIT MISSED' : `${Math.round(progress)}% TRANSFER`}</span></div>
    <div className="flight-scene__label flight-scene__label--bottom"><span>DRAG TO ORBIT · CLICK OBJECTS TO INSPECT</span><span>EARTH → {targetName.toUpperCase()}</span></div>
    <div className="flight-scene__actions"><button type="button" onClick={() => setInspected('spacecraft')}>INSPECT CRAFT</button><button type="button" onClick={() => setInspected('destination')}>INSPECT {targetName.toUpperCase()}</button></div>
    {inspected && <div className="flight-scene__inspect"><button onClick={() => setInspected(null)} aria-label="Close inspection">×</button><strong>{inspected === 'spacecraft' ? 'Aurora spacecraft' : targetName}</strong><p>{inspected === 'spacecraft' ? `${config.powerSystemId.replace(/_/g, ' ')} · ${config.propulsionId} propulsion · ${config.selectedInstrumentIds.length} instruments` : `Mission target · arrival corridor ${Math.max(0, 100 - Math.round(progress))}% remaining`}</p></div>}
    {unavailable && <div className="flight-scene__fallback">3D flight view unavailable on this device. Mission controls remain playable.</div>}
  </div>;
};
