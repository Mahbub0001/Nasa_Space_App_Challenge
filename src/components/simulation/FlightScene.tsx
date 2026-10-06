import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { MissionConfiguration } from '../../types/mission';
import type { FlightChallengeId } from '../../simulation/flightGame';
import { createSpacecraftAssembly } from '../spacecraft/spacecraftModel';
import './flight.css';

export type CameraPreset = 'orbit' | 'chase' | 'approach';

interface FlightSceneProps {
  config: MissionConfiguration;
  progress: number;
  challenge: FlightChallengeId | null;
  playing: boolean;
  burn: number;
  stormActive: boolean;
  failed?: boolean;
  speed?: number;
}

function planetTexture(destination: MissionConfiguration['destinationId']) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext('2d')!;
  const palette =
    destination === 'mars'
      ? ['#8a4738', '#bd7052', '#d48a65', '#6d3834', '#df9772']
      : destination === 'lunar_orbit'
      ? ['#9ca5a6', '#c3c6c1', '#747d83', '#dbd7cd', '#585e63']
      : ['#877265', '#a38c77', '#62564f', '#bb9b7e', '#4c423c'];

  context.fillStyle = palette[0];
  context.fillRect(0, 0, 512, 256);

  // Surface bands and crater structures
  for (let i = 0; i < 850; i++) {
    const x = (i * 137.508) % 512;
    const y = (i * 79.73) % 256;
    const size = 3 + (i % 23) * 1.6;
    context.fillStyle = palette[i % palette.length];
    context.globalAlpha = 0.08 + (i % 7) * 0.024;
    context.beginPath();
    context.ellipse(x, y, size * 1.8, size * 0.6, i * 0.17, 0, Math.PI * 2);
    context.fill();
  }

  // Polar ice cap for Mars
  if (destination === 'mars') {
    context.fillStyle = '#e8f3f8';
    context.globalAlpha = 0.45;
    context.beginPath();
    context.ellipse(256, 12, 70, 14, 0, 0, Math.PI * 2);
    context.fill();
  }

  context.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function disposeScene(scene: THREE.Scene) {
  scene.traverse(object => {
    if (!(object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line || object instanceof THREE.LineSegments)) return;
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

export const FlightScene: React.FC<FlightSceneProps> = ({
  config,
  progress,
  challenge,
  playing,
  burn,
  stormActive,
  failed = false,
  speed = 1,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ progress, challenge, playing, burn, stormActive, failed, speed });
  const [cameraMode, setCameraMode] = useState<CameraPreset>('orbit');
  const cameraModeRef = useRef<CameraPreset>('orbit');
  const [inspected, setInspected] = useState<'spacecraft' | 'destination' | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  stateRef.current = { progress, challenge, playing, burn, stormActive, failed, speed };
  cameraModeRef.current = cameraMode;

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
    renderer.domElement.setAttribute(
      'aria-label',
      'Interactive 3D flight scene. Drag to orbit the camera; choose camera modes; click spacecraft or target to inspect.'
    );
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.tabIndex = 0;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050b17');
    scene.fog = new THREE.FogExp2('#050b17', 0.007);

    const camera = new THREE.PerspectiveCamera(46, mount.clientWidth / mount.clientHeight, 0.1, 250);
    camera.position.set(0, 3.2, 16);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 6;
    controls.maxDistance = 28;
    controls.maxPolarAngle = Math.PI * 0.82;
    controls.target.set(0, 0, -1);
    controls.update();

    // Scene lighting
    scene.add(new THREE.AmbientLight('#7798b7', 0.85));
    const sunlight = new THREE.DirectionalLight('#ffe3c7', 3.4);
    sunlight.position.set(-7, 7, 11);
    scene.add(sunlight);

    const rim = new THREE.PointLight('#7aa9ef', 90, 28);
    rim.position.set(3, -3, 4);
    scene.add(rim);

    // Distant background star sphere
    const starCount = 850;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const azimuth = i * 2.399963;
      const altitude = 1 - ((i + 0.5) * 2) / starCount;
      const radius = Math.sqrt(1 - altitude * altitude);
      starPositions.set([Math.cos(azimuth) * radius * 80, altitude * 80, Math.sin(azimuth) * radius * 80], i * 3);
    }
    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    scene.add(
      new THREE.Points(
        starsGeometry,
        new THREE.PointsMaterial({ color: '#d9e9f8', size: 0.12, transparent: true, opacity: 0.65 })
      )
    );

    // Cruising warp / space dust streak stream
    const dustCount = 350;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustVelocities = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 36;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      dustPositions[i * 3 + 2] = -40 + Math.random() * 65;
      dustVelocities[i] = 0.5 + Math.random() * 0.9;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: '#9ad0f5',
      size: 0.13,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // Solar storm high-energy radiation particles
    const stormCount = 300;
    const stormGeo = new THREE.BufferGeometry();
    const stormPositions = new Float32Array(stormCount * 3);
    const stormColors = new Float32Array(stormCount * 3);
    const colA = new THREE.Color('#ffaa33');
    const colB = new THREE.Color('#ff4d33');
    for (let i = 0; i < stormCount; i++) {
      stormPositions[i * 3] = (Math.random() - 0.5) * 40;
      stormPositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      stormPositions[i * 3 + 2] = (Math.random() - 0.5) * 45;
      const c = Math.random() > 0.4 ? colA : colB;
      stormColors[i * 3] = c.r;
      stormColors[i * 3 + 1] = c.g;
      stormColors[i * 3 + 2] = c.b;
    }
    stormGeo.setAttribute('position', new THREE.BufferAttribute(stormPositions, 3));
    stormGeo.setAttribute('color', new THREE.BufferAttribute(stormColors, 3));
    const stormMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stormPoints = new THREE.Points(stormGeo, stormMat);
    stormPoints.visible = false;
    scene.add(stormPoints);

    // Destination Planet & Earth
    const destination = new THREE.Mesh(
      new THREE.SphereGeometry(3.3, 56, 36),
      new THREE.MeshStandardMaterial({ map: planetTexture(config.destinationId), roughness: 0.95 })
    );
    destination.position.set(8.5, -0.8, -11);
    destination.name = 'destination';
    scene.add(destination);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(3.42, 48, 32),
      new THREE.MeshBasicMaterial({
        color: config.destinationId === 'mars' ? '#e89571' : '#a6c6d2',
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
      })
    );
    destination.add(atmosphere);

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 32, 24),
      new THREE.MeshStandardMaterial({ color: '#326a9c', emissive: '#0c3159', emissiveIntensity: 0.45, roughness: 1 })
    );
    earth.position.set(-14, -4, -26);
    scene.add(earth);

    // Target Intercept Corridor Holographic Ring
    const targetRingGeo = new THREE.TorusGeometry(1.3, 0.045, 16, 64);
    const targetRingMat = new THREE.MeshBasicMaterial({
      color: '#34d399',
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const targetRing = new THREE.Mesh(targetRingGeo, targetRingMat);
    scene.add(targetRing);

    // Reticle crosshair inside target ring
    const reticleGeo = new THREE.BufferGeometry();
    const reticleVerts = new Float32Array([
      -1.3, 0, 0, -0.4, 0, 0,
       0.4, 0, 0,  1.3, 0, 0,
       0, -1.3, 0,  0, -0.4, 0,
       0,  0.4, 0,  0,  1.3, 0,
    ]);
    reticleGeo.setAttribute('position', new THREE.BufferAttribute(reticleVerts, 3));
    const reticleLines = new THREE.LineSegments(
      reticleGeo,
      new THREE.LineBasicMaterial({
        color: '#34d399',
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    targetRing.add(reticleLines);

    // Spacecraft Assembly
    const assembly = createSpacecraftAssembly(config, config.selectedInstrumentIds);
    const craft = assembly.group;
    craft.name = 'spacecraft';
    craft.scale.setScalar(0.58);
    craft.rotation.set(0.62, -0.42, -0.08);
    scene.add(craft);

    // Outer and inner engine exhaust cones
    const thrusterOuter = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 0.95, 20),
      new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.65, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    thrusterOuter.rotation.z = Math.PI;
    thrusterOuter.position.set(0, -1.15, 0);
    craft.add(thrusterOuter);

    const thrusterCore = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.65, 16),
      new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    thrusterCore.rotation.z = Math.PI;
    thrusterCore.position.set(0, -0.98, 0);
    craft.add(thrusterCore);

    // Engine Exhaust Sparks
    const exhaustCount = 80;
    const exhaustGeo = new THREE.BufferGeometry();
    const exhaustPositions = new Float32Array(exhaustCount * 3);
    const exhaustLife = new Float32Array(exhaustCount);
    for (let i = 0; i < exhaustCount; i++) {
      exhaustLife[i] = Math.random();
      exhaustPositions[i * 3] = 0;
      exhaustPositions[i * 3 + 1] = -1.15;
      exhaustPositions[i * 3 + 2] = 0;
    }
    exhaustGeo.setAttribute('position', new THREE.BufferAttribute(exhaustPositions, 3));
    const exhaustMat = new THREE.PointsMaterial({
      color: '#80e2ff',
      size: 0.11,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const exhaustPoints = new THREE.Points(exhaustGeo, exhaustMat);
    craft.add(exhaustPoints);

    // Dynamic 3D Trajectory Route Line
    const routePointCount = 96;
    const routeGeo = new THREE.BufferGeometry();
    const routePositions = new Float32Array(routePointCount * 3);
    routeGeo.setAttribute('position', new THREE.BufferAttribute(routePositions, 3));
    const routeMat = new THREE.LineBasicMaterial({
      color: '#8ab9d9',
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const routeLine = new THREE.Line(routeGeo, routeMat);
    scene.add(routeLine);

    // Trajectory Pulse Marker
    const pulseGeo = new THREE.SphereGeometry(0.13, 14, 14);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: '#80e2ff',
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    scene.add(pulseMesh);

    // Raycasting for interactive inspection
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerStart = { x: 0, y: 0 };
    const onPointerDown = (event: PointerEvent) => {
      pointerStart = { x: event.clientX, y: event.clientY };
    };
    const onPointerUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 7) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects([craft, destination], true);
      if (hits.length) {
        setInspected(hits[0].object === destination || hits[0].object.parent === destination ? 'destination' : 'spacecraft');
      }
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
      const mode = cameraModeRef.current;
      const approach = Math.max(0, (status.progress - 35) / 65);

      // Planet positioning & rotation
      destination.position.x = 8.5 - approach * 4.6;
      destination.position.z = -11 + approach * 2.2;
      destination.rotation.y += reducedMotion.matches ? 0 : 0.0007;

      // Spacecraft motion & drift
      craft.position.set(
        -0.25 + approach * 1.7,
        (reducedMotion.matches ? 0 : Math.sin(elapsed * 0.8) * 0.09) - (status.failed ? 1.55 : 0),
        0
      );
      craft.rotation.z = status.failed ? -0.48 : status.challenge === 'trajectory' ? (status.burn - 12) * 0.025 : -0.08;

      // Ion engine emissive pulse
      assembly.ionMaterials.forEach(material => {
        material.emissiveIntensity = status.playing ? 1.4 + Math.sin(elapsed * 13) * 0.3 : 1.1;
      });

      // Thruster exhaust animation
      const thrusterActive = status.playing || status.challenge === 'trajectory';
      thrusterOuter.visible = thrusterActive;
      thrusterCore.visible = thrusterActive;
      const burnFactor = status.challenge === 'trajectory' ? 0.35 + status.burn / 18 : 1 + Math.sin(elapsed * 18) * 0.16;
      thrusterOuter.scale.y = burnFactor;
      thrusterCore.scale.y = burnFactor * 0.9;
      (thrusterOuter.material as THREE.MeshBasicMaterial).opacity = status.challenge === 'trajectory' ? 0.3 + status.burn / 40 : 0.45 + Math.sin(elapsed * 14) * 0.12;

      // Thruster spark particles
      if (thrusterActive && !reducedMotion.matches) {
        const pAttr = exhaustGeo.attributes.position as THREE.BufferAttribute;
        const speedMult = status.challenge === 'trajectory' ? Math.max(0.4, status.burn / 12) : 1;
        for (let i = 0; i < exhaustCount; i++) {
          exhaustLife[i] += 0.05 * speedMult;
          if (exhaustLife[i] > 1) {
            exhaustLife[i] = 0;
            pAttr.setXYZ(i, (Math.random() - 0.5) * 0.12, -1.15, (Math.random() - 0.5) * 0.12);
          } else {
            const curY = pAttr.getY(i);
            pAttr.setY(i, curY - 0.06 * speedMult);
            pAttr.setX(i, pAttr.getX(i) + (Math.random() - 0.5) * 0.025);
            pAttr.setZ(i, pAttr.getZ(i) + (Math.random() - 0.5) * 0.025);
          }
        }
        pAttr.needsUpdate = true;
        exhaustPoints.visible = true;
      } else {
        exhaustPoints.visible = false;
      }

      // Cruise warp / space dust movement
      if (status.playing && !reducedMotion.matches) {
        const dPos = dustGeo.attributes.position as THREE.BufferAttribute;
        const warpSpeed = (status.speed || 1) * 0.55;
        for (let i = 0; i < dustCount; i++) {
          let z = dPos.getZ(i) + dustVelocities[i] * warpSpeed;
          if (z > 24) {
            z = -40;
            dPos.setX(i, (Math.random() - 0.5) * 36);
            dPos.setY(i, (Math.random() - 0.5) * 22);
          }
          dPos.setZ(i, z);
        }
        dPos.needsUpdate = true;
      }

      // Solar storm radiation particles and camera jitter
      if (status.stormActive && !reducedMotion.matches) {
        stormPoints.visible = true;
        const sPos = stormGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < stormCount; i++) {
          let x = sPos.getX(i) + 0.45;
          let y = sPos.getY(i) - 0.25;
          let z = sPos.getZ(i) - 0.45;
          if (x > 22 || y < -15 || z < -25) {
            x = -22 + (Math.random() - 0.5) * 6;
            y = 15 + (Math.random() - 0.5) * 4;
            z = 25 + (Math.random() - 0.5) * 6;
          }
          sPos.setXYZ(i, x, y, z);
        }
        sPos.needsUpdate = true;

        camera.position.x += (Math.random() - 0.5) * 0.035;
        camera.position.y += (Math.random() - 0.5) * 0.035;
        sunlight.color.set('#ff9d6c');
        sunlight.intensity = 4.6 + Math.sin(elapsed * 16) * 0.8;
      } else {
        stormPoints.visible = false;
        sunlight.color.set('#ffe3c7');
        sunlight.intensity = 3.4;
      }

      // Trajectory corridor target ring calculation
      const ideal = config.destinationId === 'mars' ? 12 : config.destinationId === 'lunar_orbit' ? 9 : 16;
      const deflection = status.challenge === 'trajectory' ? status.burn - ideal : 0;
      const err = Math.abs(deflection);

      const targetCorridorPos = new THREE.Vector3(
        destination.position.x - 2.8,
        destination.position.y + 0.2,
        destination.position.z + 2.2
      );
      targetRing.position.copy(targetCorridorPos);
      targetRing.lookAt(craft.position);

      let corridorColor = '#34d399';
      if (status.challenge === 'trajectory') {
        if (err <= 2) corridorColor = '#34d399';
        else if (err <= 5) corridorColor = '#fbbf24';
        else corridorColor = '#f87171';
      } else if (status.failed) {
        corridorColor = '#f87171';
      }
      targetRingMat.color.set(corridorColor);
      (reticleLines.material as THREE.LineBasicMaterial).color.set(corridorColor);
      targetRing.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.04);

      // Trajectory bezier curve deflection
      const endPos = targetCorridorPos.clone().add(
        new THREE.Vector3(deflection * 0.38, deflection * 0.32, -deflection * 0.22)
      );
      const startPos = new THREE.Vector3(-8, -2.5, -8);
      const midPos = new THREE.Vector3(-1 + approach * 2.2, 2.8 - deflection * 0.12, -5.5);

      const curve = new THREE.QuadraticBezierCurve3(startPos, midPos, endPos);
      const curvePoints = curve.getPoints(routePointCount - 1);
      const positionsAttr = routeGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < curvePoints.length; i++) {
        positionsAttr.setXYZ(i, curvePoints[i].x, curvePoints[i].y, curvePoints[i].z);
      }
      positionsAttr.needsUpdate = true;
      routeMat.color.set(status.challenge === 'trajectory' ? corridorColor : '#8ab9d9');

      // Moving pulse packet along trajectory
      const pulseT = (elapsed * 0.32) % 1;
      const pulsePos = curve.getPoint(pulseT);
      pulseMesh.position.copy(pulsePos);
      pulseMat.color.set(status.challenge === 'trajectory' ? corridorColor : '#80e2ff');

      // Spacecraft rim lighting
      rim.color.set(status.stormActive || status.failed ? '#ef795c' : '#7aa9ef');

      // Cinematic camera modes
      if (mode === 'chase') {
        const desiredCamPos = new THREE.Vector3(craft.position.x - 3.2, craft.position.y + 1.4, craft.position.z + 5.2);
        const desiredLookAt = new THREE.Vector3(craft.position.x + 3.8, craft.position.y - 0.2, craft.position.z - 4.5);
        camera.position.lerp(desiredCamPos, 0.05);
        controls.target.lerp(desiredLookAt, 0.05);
      } else if (mode === 'approach') {
        const desiredCamPos = new THREE.Vector3(
          destination.position.x - 4.2,
          destination.position.y + 1.8,
          destination.position.z + 6.2
        );
        camera.position.lerp(desiredCamPos, 0.05);
        controls.target.lerp(destination.position, 0.05);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    render();

    const resize = new ResizeObserver(() => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resize.observe(mount);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      disposeScene(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [config.destinationId]);

  const targetName = config.destinationId === 'mars' ? 'Mars' : config.destinationId === 'lunar_orbit' ? 'Moon' : 'Asteroid';
  const totalKm = config.destinationId === 'mars' ? 54000000 : config.destinationId === 'lunar_orbit' ? 384400 : 120000000;
  const distanceKm = Math.round(Math.max(420, (1 - progress / 100) * totalKm));
  const velocityKmS = (18.2 + (progress / 100) * 6.4).toFixed(1);

  const idealBurn = config.destinationId === 'mars' ? 12 : config.destinationId === 'lunar_orbit' ? 9 : 16;
  const burnDiff = Math.abs(burn - idealBurn);
  const corridorStatus =
    challenge === 'trajectory'
      ? burnDiff <= 2
        ? { text: 'CORRIDOR NOMINAL', tone: 'nominal' }
        : burnDiff <= 5
        ? { text: 'TRAJECTORY WARNING', tone: 'warning' }
        : { text: 'ORBITAL DRIFT CRITICAL', tone: 'danger' }
      : stormActive
      ? { text: 'SOLAR STORM SURGE', tone: 'danger' }
      : challenge === 'downlink'
      ? { text: 'COMM WINDOW CLOSING', tone: 'warning' }
      : failed
      ? { text: 'ORBIT INSERTION FAILED', tone: 'danger' }
      : { text: 'COURSE LOCKED', tone: 'nominal' };

  return (
    <div className={`flight-scene ${stormActive ? 'flight-scene--storm' : ''}`}>
      <div ref={mountRef} className="flight-scene__canvas" />
      <div className="flight-scene__vignette" />

      {/* Top Header & Camera View Selector */}
      <div className="flight-scene__label flight-scene__label--top">
        <div className="flight-scene__brand">
          <span className="flight-scene__live" />
          AURORA / LIVE FLIGHT
          <span className="flight-scene__transfer-pct">{failed ? 'ORBIT MISSED' : `${Math.round(progress)}% TRANSFER`}</span>
        </div>
        <div className="flight-scene__cams" aria-label="Camera views">
          <button
            type="button"
            className={cameraMode === 'chase' ? 'is-active' : ''}
            onClick={() => setCameraMode('chase')}
          >
            CHASE CAM
          </button>
          <button
            type="button"
            className={cameraMode === 'orbit' ? 'is-active' : ''}
            onClick={() => setCameraMode('orbit')}
          >
            FREE ORBIT
          </button>
          <button
            type="button"
            className={cameraMode === 'approach' ? 'is-active' : ''}
            onClick={() => setCameraMode('approach')}
          >
            APPROACH CAM
          </button>
        </div>
      </div>

      {/* Tactical Telemetry HUD */}
      <div className="flight-scene__telemetry">
        <div className="flight-scene__telemetry-item">
          <span>TARGET DISTANCE</span>
          <strong>{distanceKm.toLocaleString()} KM</strong>
        </div>
        <div className="flight-scene__telemetry-item">
          <span>HELIOCENTRIC VELOCITY</span>
          <strong>{velocityKmS} KM/S</strong>
        </div>
        <div className="flight-scene__telemetry-item">
          <span className={`flight-scene__status-badge flight-scene__status-badge--${corridorStatus.tone}`}>
            {corridorStatus.text}
          </span>
        </div>
      </div>

      {/* Bottom Telemetry & Inspect Controls */}
      <div className="flight-scene__label flight-scene__label--bottom">
        <span>DRAG TO ORBIT · CLICK OBJECTS TO INSPECT</span>
        <span>EARTH → {targetName.toUpperCase()}</span>
      </div>

      <div className="flight-scene__actions">
        <button type="button" onClick={() => setInspected('spacecraft')}>
          INSPECT CRAFT
        </button>
        <button type="button" onClick={() => setInspected('destination')}>
          INSPECT {targetName.toUpperCase()}
        </button>
      </div>

      {inspected && (
        <div className="flight-scene__inspect">
          <button onClick={() => setInspected(null)} aria-label="Close inspection">
            ×
          </button>
          <strong>{inspected === 'spacecraft' ? 'Aurora Spacecraft' : targetName}</strong>
          <p>
            {inspected === 'spacecraft'
              ? `${config.powerSystemId.replace(/_/g, ' ')} · ${config.propulsionId} propulsion · ${config.selectedInstrumentIds.length} science payloads`
              : `Mission destination corridor · ${Math.max(0, 100 - Math.round(progress))}% flight time remaining to orbital insertion`}
          </p>
        </div>
      )}

      {unavailable && (
        <div className="flight-scene__fallback">
          3D flight view unavailable on this device. Mission controls remain playable.
        </div>
      )}
    </div>
  );
};
