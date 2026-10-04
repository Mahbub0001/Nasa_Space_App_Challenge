import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCcw, Orbit } from 'lucide-react';
import type { InstrumentId, MissionConfiguration } from '../../types/mission';
import { createSpacecraftAssembly, disposeObject, type SpacecraftAssembly } from './spacecraftModel';

interface Spacecraft3DCanvasProps {
  configuration: MissionConfiguration;
  installedInstruments: InstrumentId[];
  onFallback: () => void;
}

interface ViewerRuntime {
  setAssembly: (assembly: SpacecraftAssembly) => void;
  resetCamera: () => void;
  setAutoRotate: (enabled: boolean) => void;
}

export default function Spacecraft3DCanvas({ configuration, installedInstruments, onFallback }: Spacecraft3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<ViewerRuntime | null>(null);
  const releaseTimerRef = useRef<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const { powerSystemId, propulsionId, communicationId } = configuration;

  useEffect(() => {
    // React 18 replays effects on the same canvas in StrictMode. Reuse that context
    // during the replay, but explicitly release it after a real unmount.
    if (releaseTimerRef.current !== null) {
      window.clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = null;
    }
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      setUnavailable(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#040911');
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 120);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.rotateSpeed = 0.65;
    controls.zoomSpeed = 0.8;
    controls.panSpeed = 0.55;
    controls.autoRotateSpeed = 0.45;
    controls.target.set(0, 0.1, 0);
    controls.cursor.copy(controls.target);
    controls.maxTargetRadius = 1.4;

    // Procedural reflection environment: no HDR maps or network assets.
    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.65;
    room.dispose();
    pmrem.dispose();

    const sun = new THREE.DirectionalLight('#fff0da', 4.4);
    sun.position.set(-4, 7, 5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = sun.shadow.camera.bottom = -6;
    sun.shadow.camera.right = sun.shadow.camera.top = 6;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 25;
    sun.shadow.normalBias = 0.035;
    scene.add(sun);
    const bounce = new THREE.DirectionalLight('#6bafff', 1.25);
    bounce.position.set(2, -4, 3);
    scene.add(bounce);
    const rim = new THREE.DirectionalLight('#e1f0ff', 3.5);
    rim.position.set(1, 3, -6);
    scene.add(rim, new THREE.AmbientLight('#8baac6', 0.18));

    const starsGeometry = new THREE.BufferGeometry();
    const stars = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      const azimuth = i * 2.399963;
      const y = 1 - 2 * (i + 0.5) / 180;
      const r = Math.sqrt(1 - y * y);
      stars.set([Math.cos(azimuth) * r * 48, y * 48, Math.sin(azimuth) * r * 48], i * 3);
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(stars, 3));
    const starfield = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: '#9bb1c8', size: 0.045, transparent: true, opacity: 0.5, depthWrite: false }));
    scene.add(starfield);

    let assembly: SpacecraftAssembly | null = null;
    let radius = 4.5;
    let framingPoints: THREE.Vector3[] = [];
    let hasModel = false;
    let autoRotating = false;
    let inViewport = true;
    let contextLost = false;
    let disposed = false;
    let frame = 0;
    let previousTime = 0;
    const homeTarget = new THREE.Vector3(0, 0.1, 0);
    const homePosition = new THREE.Vector3();
    const viewDirection = new THREE.Vector3(0.85, 0.55, 1.65).normalize();
    const viewRight = new THREE.Vector3(0, 1, 0).cross(viewDirection).normalize();
    const viewUp = viewDirection.clone().cross(viewRight).normalize();
    let reset: { startedAt: number; position: THREE.Vector3; target: THREE.Vector3 } | null = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function updateHome() {
      const verticalHalfFov = THREE.MathUtils.degToRad(camera.fov / 2);
      const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * camera.aspect);
      // Fit projected bounds, rather than a sphere that makes long solar wings tiny.
      const distance = framingPoints.length ? Math.max(...framingPoints.map(point => {
        const relative = point.clone().sub(homeTarget);
        return Math.max(
          Math.abs(relative.dot(viewRight)) / Math.tan(horizontalHalfFov),
          Math.abs(relative.dot(viewUp)) / Math.tan(verticalHalfFov)
        ) + relative.dot(viewDirection);
      })) + radius * 0.4 : radius / Math.sin(Math.min(verticalHalfFov, horizontalHalfFov));
      homePosition.copy(viewDirection).multiplyScalar(distance).add(homeTarget);
      controls.minDistance = radius * 1.18;
      controls.maxDistance = Math.max(32, distance * 2);
    }
    function resize() {
      const { width, height } = container!.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      const wasHome = camera.position.distanceTo(homePosition) < 0.1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      updateHome();
      if (wasHome || !hasModel) {
        camera.position.copy(homePosition);
        controls.target.copy(homeTarget);
      }
      controls.update();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    function render(time: number) {
      frame = 0;
      if (disposed || contextLost || document.hidden || !inViewport) return;
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
      previousTime = time;
      if (reset) {
        const progress = Math.min(1, (time - reset.startedAt) / 750);
        const eased = progress * progress * (3 - 2 * progress);
        camera.position.lerpVectors(reset.position, homePosition, eased);
        controls.target.lerpVectors(reset.target, homeTarget, eased);
        if (progress === 1) reset = null;
      }
      controls.autoRotate = autoRotating && !reset;
      controls.enableDamping = !reset;
      controls.update(delta);
      assembly?.ionMaterials.forEach(material => {
        material.emissiveIntensity = reducedMotion.matches ? 1.2 : 1.2 + Math.sin(time * 0.003) * 0.28;
      });
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    }
    function updateRunning() {
      if (disposed || contextLost || document.hidden || !inViewport) {
        cancelAnimationFrame(frame);
        frame = 0;
        previousTime = 0;
      } else if (!frame) {
        frame = requestAnimationFrame(render);
      }
    }
    const visibilityObserver = new IntersectionObserver(entries => {
      inViewport = entries[0]?.isIntersecting ?? true;
      updateRunning();
    });
    visibilityObserver.observe(container);
    document.addEventListener('visibilitychange', updateRunning);
    const cancelReset = () => { reset = null; };
    controls.addEventListener('start', cancelReset);
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      setUnavailable(true);
      updateRunning();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    const resetCamera = () => {
      // Flush residual orbit damping before starting the camera interpolation.
      controls.enableDamping = false;
      controls.autoRotate = false;
      controls.update();
      if (reducedMotion.matches) {
        camera.position.copy(homePosition);
        controls.target.copy(homeTarget);
        controls.update();
      } else {
        reset = { startedAt: performance.now(), position: camera.position.clone(), target: controls.target.clone() };
      }
    };
    const handleKeys = (event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(event.key)) return;
      event.preventDefault();
      cancelReset();
      if (event.key === 'Home') { resetCamera(); return; }
      const offset = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
      if (event.key === 'ArrowLeft') offset.theta -= 0.12;
      if (event.key === 'ArrowRight') offset.theta += 0.12;
      if (event.key === 'ArrowUp') offset.phi -= 0.12;
      if (event.key === 'ArrowDown') offset.phi += 0.12;
      if (event.key === '+' || event.key === '=') offset.radius *= 0.9;
      if (event.key === '-') offset.radius *= 1.1;
      offset.radius = THREE.MathUtils.clamp(offset.radius, controls.minDistance, controls.maxDistance);
      offset.makeSafe();
      camera.position.setFromSpherical(offset).add(controls.target);
      controls.update();
    };
    canvas.addEventListener('keydown', handleKeys);

    runtimeRef.current = {
      setAssembly(next) {
        if (assembly) {
          scene.remove(assembly.group);
          disposeObject(assembly.group);
        }
        assembly = next;
        scene.add(next.group);
        const bounds = new THREE.Box3().setFromObject(next.group);
        const sphere = bounds.getBoundingSphere(new THREE.Sphere());
        framingPoints = [];
        for (const x of [bounds.min.x, bounds.max.x]) {
          for (const y of [bounds.min.y, bounds.max.y]) {
            for (const z of [bounds.min.z, bounds.max.z]) framingPoints.push(new THREE.Vector3(x, y, z));
          }
        }
        radius = sphere.radius;
        updateHome();
        if (!hasModel) {
          camera.position.copy(homePosition);
          controls.target.copy(homeTarget);
          hasModel = true;
        }
        controls.update();
      },
      resetCamera,
      setAutoRotate(enabled) { autoRotating = enabled; }
    };
    updateRunning();

    return () => {
      disposed = true;
      runtimeRef.current = null;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', updateRunning);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('keydown', handleKeys);
      controls.removeEventListener('start', cancelReset);
      controls.dispose();
      disposeObject(scene);
      environment.dispose();
      sun.shadow.dispose();
      renderer.dispose();
      releaseTimerRef.current = window.setTimeout(() => renderer.forceContextLoss(), 0);
    };
  }, []);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    runtime.setAssembly(createSpacecraftAssembly({ powerSystemId, propulsionId, communicationId }, installedInstruments));
  }, [powerSystemId, propulsionId, communicationId, installedInstruments]);

  useEffect(() => {
    runtimeRef.current?.setAutoRotate(autoRotate);
  }, [autoRotate]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-space-950">
      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="img"
        aria-label="Interactive 3D spacecraft. Drag to rotate, scroll to zoom, right-drag to pan. Arrow keys rotate, plus and minus zoom, Home resets the camera."
        className="block h-full w-full touch-none cursor-grab active:cursor-grabbing focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan-400"
      />
      <div className="pointer-events-none absolute left-3 top-3 font-mono text-[9px] tracking-widest text-slate-500">
        <span className="block text-cyan-300/80">AURORA / ASSEMBLY 01</span>
        <span className="mt-1 block">{installedInstruments.length} SCIENCE MODULES</span>
      </div>
      <div className="absolute bottom-10 right-3 flex flex-wrap justify-end gap-1.5">
        <button type="button" onClick={() => runtimeRef.current?.resetCamera()} disabled={unavailable} className="spacecraft-control" title="Restore isometric camera (Home)">
          <RotateCcw size={12} /> RESET CAM
        </button>
        <button type="button" onClick={() => setAutoRotate(value => !value)} disabled={unavailable} aria-pressed={autoRotate} className="spacecraft-control" title="Toggle slow orbital inspection">
          <Orbit size={12} /> AUTO-ROTATE {autoRotate ? 'ON' : 'OFF'}
        </button>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-white/5 bg-space-950/80 px-3 py-2 text-center font-mono text-[9px] tracking-wider text-slate-400">
        DRAG TO ROTATE · SCROLL TO ZOOM · RIGHT-DRAG TO PAN
      </div>
      {unavailable && (
        <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-space-950/95 p-6 text-center">
          <p className="text-sm text-slate-300">3D rendering is unavailable on this device. The CAD schematic is ready to use.</p>
          <button type="button" className="spacecraft-control" onClick={onFallback}>OPEN 2D CAD SCHEMATIC</button>
        </div>
      )}
    </div>
  );
}
