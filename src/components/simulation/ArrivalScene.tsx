import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { MissionConfiguration } from '../../types/mission';
import { createSpacecraftAssembly } from '../spacecraft/spacecraftModel';
import './arrival.css';

export type ArrivalStage = 'orbit' | 'descent' | 'surface';

interface ArrivalSceneProps {
  config: MissionConfiguration;
  stage: ArrivalStage;
  entryAngle: number;
  isBurning: boolean;
  throttle: number;
  descentProgress: number; // 0 (entry) to 100 (touchdown)
  touchdownSuccess?: boolean;
}

function createArrivalPlanetTexture(destination: MissionConfiguration['destinationId']) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const palette =
    destination === 'mars'
      ? ['#854334', '#b36248', '#cc7e5c', '#602e2b', '#d88d6b']
      : destination === 'lunar_orbit'
      ? ['#8b9294', '#b2b5b1', '#6b7278', '#cbcfc8', '#4f555a']
      : ['#7c685b', '#967f6c', '#574d46', '#ac8e74', '#403934'];

  ctx.fillStyle = palette[0];
  ctx.fillRect(0, 0, 1024, 512);

  for (let i = 0; i < 1400; i++) {
    const x = (i * 137.508) % 1024;
    const y = (i * 79.73) % 512;
    const size = 3 + (i % 27) * 2.1;
    ctx.fillStyle = palette[i % palette.length];
    ctx.globalAlpha = 0.08 + (i % 8) * 0.02;
    ctx.beginPath();
    ctx.ellipse(x, y, size * 2.0, size * 0.7, i * 0.18, 0, Math.PI * 2);
    ctx.fill();
  }

  // Polar ice caps for Mars
  if (destination === 'mars') {
    ctx.fillStyle = '#eef6fa';
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.ellipse(512, 18, 140, 26, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const ArrivalScene: React.FC<ArrivalSceneProps> = ({
  config,
  stage,
  entryAngle,
  isBurning,
  throttle,
  descentProgress,
  touchdownSuccess = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ stage, entryAngle, isBurning, throttle, descentProgress, touchdownSuccess });
  const [cameraView, setCameraView] = useState<'orbit' | 'descent' | 'lander'>('orbit');
  const [unavailable, setUnavailable] = useState(false);

  stateRef.current = { stage, entryAngle, isBurning, throttle, descentProgress, touchdownSuccess };

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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030812');
    scene.fog = new THREE.FogExp2('#030812', 0.008);

    const camera = new THREE.PerspectiveCamera(48, mount.clientWidth / mount.clientHeight, 0.1, 300);
    camera.position.set(0, 4.5, 15);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxDistance = 35;
    controls.minDistance = 4;
    controls.target.set(0, 0, 0);

    // Lighting
    scene.add(new THREE.AmbientLight('#67839f', 0.9));
    const sunlight = new THREE.DirectionalLight('#ffe6d0', 3.6);
    sunlight.position.set(-10, 8, 12);
    scene.add(sunlight);

    const rim = new THREE.PointLight('#79a9ef', 80, 30);
    rim.position.set(4, -4, 4);
    scene.add(rim);

    // Stars
    const starCount = 700;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const az = i * 2.399963;
      const alt = 1 - ((i + 0.5) * 2) / starCount;
      const rad = Math.sqrt(1 - alt * alt);
      starPos.set([Math.cos(az) * rad * 90, alt * 90, Math.sin(az) * rad * 90], i * 3);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: '#d3e4f3', size: 0.12, transparent: true, opacity: 0.6 })));

    // Planet Globe (close-up)
    const planetRadius = 6.8;
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(planetRadius, 64, 48),
      new THREE.MeshStandardMaterial({
        map: createArrivalPlanetTexture(config.destinationId),
        roughness: 0.95,
      })
    );
    planet.position.set(0, -7.5, -4);
    scene.add(planet);

    // Atmosphere Glow Shell
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(planetRadius + 0.35, 56, 36),
      new THREE.MeshBasicMaterial({
        color: config.destinationId === 'mars' ? '#f09670' : '#99c3d4',
        transparent: true,
        opacity: 0.16,
        side: THREE.BackSide,
      })
    );
    planet.add(atmosphere);

    // Spacecraft
    const assembly = createSpacecraftAssembly(config, config.selectedInstrumentIds);
    const craft = assembly.group;
    craft.scale.setScalar(0.55);
    craft.position.set(0, 1.8, 0);
    scene.add(craft);

    // Retrograde Engine Thruster Plume
    const retroPlume = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 1.3, 20),
      new THREE.MeshBasicMaterial({
        color: '#ffbb44',
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    retroPlume.position.set(0, -1.2, 0);
    retroPlume.rotation.z = Math.PI;
    craft.add(retroPlume);

    // Atmospheric Plasma Shockwave Shell (Mars Entry)
    const plasmaShell = new THREE.Mesh(
      new THREE.ConeGeometry(1.4, 2.2, 24, 1, true),
      new THREE.MeshBasicMaterial({
        color: '#ff5522',
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    plasmaShell.position.set(0, 0.4, 0);
    craft.add(plasmaShell);
    plasmaShell.visible = false;

    // Terminal Descent Dust Sparks
    const dustSparksCount = 100;
    const dustSparksGeo = new THREE.BufferGeometry();
    const dustSparksPos = new Float32Array(dustSparksCount * 3);
    for (let i = 0; i < dustSparksCount; i++) {
      dustSparksPos[i * 3] = (Math.random() - 0.5) * 3;
      dustSparksPos[i * 3 + 1] = -1.2 - Math.random() * 2;
      dustSparksPos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    dustSparksGeo.setAttribute('position', new THREE.BufferAttribute(dustSparksPos, 3));
    const dustSparks = new THREE.Points(
      dustSparksGeo,
      new THREE.PointsMaterial({
        color: '#f0c080',
        size: 0.16,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    craft.add(dustSparks);
    dustSparks.visible = false;

    let frame = 0;
    const startTime = performance.now();

    const render = () => {
      frame = requestAnimationFrame(render);
      if (document.hidden) return;

      const elapsed = (performance.now() - startTime) / 1000;
      const s = stateRef.current;

      planet.rotation.y += 0.0004;

      if (s.stage === 'orbit') {
        // Orbit insertion mode: spacecraft is angled retrograde
        craft.position.set(
          Math.sin(elapsed * 0.4) * 0.8,
          1.8 + Math.cos(elapsed * 0.4) * 0.2,
          Math.sin(elapsed * 0.25) * 0.5
        );
        craft.rotation.set(0.4, Math.PI + (s.entryAngle + 12.2) * 0.05, -0.2);

        // Retro burn plume
        retroPlume.visible = s.isBurning;
        if (s.isBurning) {
          retroPlume.scale.set(1 + Math.sin(elapsed * 25) * 0.12, 1.2 + Math.sin(elapsed * 20) * 0.2, 1);
          (retroPlume.material as THREE.MeshBasicMaterial).color.set(Math.sin(elapsed * 15) > 0 ? '#ffcc55' : '#ff8822');
        }
        plasmaShell.visible = false;
        dustSparks.visible = false;
      } else if (s.stage === 'descent') {
        // EDL / Descent mode: descending toward planet
        const prog = s.descentProgress / 100;
        const descentY = 2.2 - prog * 2.8;
        craft.position.set(0, descentY, 0);
        craft.rotation.set(-0.2, 0, Math.sin(elapsed * 3) * 0.04);

        // In hypersonic entry phase (0% - 60% progress)
        if (prog < 0.65 && config.destinationId === 'mars') {
          plasmaShell.visible = true;
          (plasmaShell.material as THREE.MeshBasicMaterial).opacity = 0.55 + Math.sin(elapsed * 18) * 0.25;
          plasmaShell.scale.setScalar(1 + Math.sin(elapsed * 12) * 0.08);
          retroPlume.visible = false;
        } else {
          // Terminal propulsion phase
          plasmaShell.visible = false;
          retroPlume.visible = true;
          const thrFactor = Math.max(0.3, s.throttle / 100);
          retroPlume.scale.set(thrFactor, thrFactor * 1.4, thrFactor);
          dustSparks.visible = true;
        }
      } else {
        // Surface touchdown confirmed
        craft.position.set(0, -0.65, 0);
        craft.rotation.set(0, 0, s.touchdownSuccess ? 0 : -0.35);
        retroPlume.visible = false;
        plasmaShell.visible = false;
        dustSparks.visible = false;
      }

      // Camera view positions
      if (cameraView === 'descent') {
        const targetPos = new THREE.Vector3(craft.position.x - 2.5, craft.position.y + 1.2, craft.position.z + 4.2);
        camera.position.lerp(targetPos, 0.05);
        controls.target.lerp(craft.position, 0.05);
      } else if (cameraView === 'lander') {
        const targetPos = new THREE.Vector3(craft.position.x + 2.0, craft.position.y + 0.8, craft.position.z + 3.2);
        camera.position.lerp(targetPos, 0.05);
        controls.target.lerp(craft.position, 0.05);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    render();

    const resize = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resize.observe(mount);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [config.destinationId, cameraView]);

  const targetName = config.destinationId === 'mars' ? 'Mars' : config.destinationId === 'lunar_orbit' ? 'Moon' : 'Asteroid';
  const altitudeKm =
    stage === 'orbit'
      ? 245
      : stage === 'descent'
      ? Math.max(0, Math.round(125 * (1 - descentProgress / 100)))
      : 0;
  const velocityMs =
    stage === 'orbit'
      ? 4800
      : stage === 'descent'
      ? Math.max(1.2, Math.round(6200 * (1 - descentProgress / 100) + (throttle / 100) * 12))
      : 0;

  return (
    <div className="arrival-scene">
      <div ref={mountRef} className="arrival-scene__canvas" />
      <div className="arrival-scene__vignette" />

      {/* Top Header & Telemetry */}
      <div className="arrival-scene__header">
        <div className="arrival-scene__brand">
          <span className="arrival-scene__live" />
          <span>AURORA / {targetName.toUpperCase()} ARRIVAL</span>
          <span className="arrival-scene__badge">{stage.toUpperCase()} PHASE</span>
        </div>
        <div className="arrival-scene__cams">
          <button
            type="button"
            className={cameraView === 'orbit' ? 'is-active' : ''}
            onClick={() => setCameraView('orbit')}
          >
            ORBIT CAM
          </button>
          <button
            type="button"
            className={cameraView === 'descent' ? 'is-active' : ''}
            onClick={() => setCameraView('descent')}
          >
            DESCENT CAM
          </button>
          <button
            type="button"
            className={cameraView === 'lander' ? 'is-active' : ''}
            onClick={() => setCameraView('lander')}
          >
            LANDER CAM
          </button>
        </div>
      </div>

      {/* Radar Altimeter Telemetry HUD */}
      <div className="arrival-scene__telemetry">
        <div className="arrival-scene__telemetry-card">
          <span>RADAR ALTITUDE</span>
          <strong>{stage === 'surface' ? '0.00 M (TOUCHDOWN)' : `${altitudeKm.toLocaleString()} KM`}</strong>
        </div>
        <div className="arrival-scene__telemetry-card">
          <span>DESCENT VELOCITY</span>
          <strong>{stage === 'surface' ? '0.0 M/S' : `${velocityMs.toLocaleString()} M/S`}</strong>
        </div>
        <div className="arrival-scene__telemetry-card">
          <span>STATUS</span>
          <strong className="arrival-scene__telemetry-status">
            {stage === 'orbit'
              ? isBurning
                ? 'RETRO BURN FIRING'
                : 'APPROACHING PERIAPSIS'
              : stage === 'descent'
              ? descentProgress < 65 && config.destinationId === 'mars'
                ? 'ATMOSPHERIC ENTRY (PLASMA)'
                : 'TERMINAL BRAKING'
              : touchdownSuccess
              ? 'TOUCHDOWN CONFIRMED'
              : 'HARD IMPACT DETECTED'}
          </strong>
        </div>
      </div>

      {unavailable && (
        <div className="arrival-scene__fallback">
          3D arrival viewport unavailable. Mission telemetry continues in terminal view.
        </div>
      )}
    </div>
  );
};
