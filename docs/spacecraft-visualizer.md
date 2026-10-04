# Spacecraft visualizer

`SpacecraftVisualizer` accepts `configuration: MissionConfiguration` and `installedInstruments: InstrumentId[]`. It defaults to 3D and preserves the existing `SpacecraftSVG` for CAD mode. Mission Control and Payload use the same component, with a smaller viewport on Payload.

`Spacecraft3DCanvas` owns the renderer, camera, OrbitControls, lighting, resize/visibility observers and animation lifecycle. `spacecraftModel.ts` builds only geometry and materials. Neither imports mission state, resource calculations or simulation logic. Changing subsystems rebuilds the assembly while retaining the renderer and camera.

All geometry, foil/solar textures, stars and reflections are generated locally. Three.js loads as a separate local application chunk when the viewer is opened; no remote models, textures or HDR files are requested.

## Existing configuration mapping

| Configuration | Geometry |
| --- | --- |
| Standard / advanced solar | Two / three hinged panels on each wing |
| Long-duration power | Twin finned RTG housings |
| Chemical / electric / hybrid | Bell nozzle / twin ion grids / combined cluster |
| Standard / high gain / deep space | Progressively larger parabolic dishes; deep space also includes the optical transceiver |
| `radar` | Deployable dipole booms |
| `imaging_system` | Dual camera telescope pods |
| `spectrometer` | Foil-wrapped optical slit hood |
| `radiation_detector` | Boom-mounted particle sensor |
| `atmospheric_sensor` | Open intake and optical sounder |

The task's illustrative `imaging` maps to the existing `imaging_system`. Magnetometer and dust-analyzer IDs are not part of the mission model and are not introduced. The radiation detector and atmospheric sensor retain their existing identities.

## Controls

- Left drag / one-finger drag: orbit.
- Wheel / two-finger pinch: zoom, constrained by model bounds.
- Right drag / two-finger drag: pan within a bounded inspection region.
- Reset Cam: ease back to the fitted isometric view.
- Auto-Rotate: optional slow turntable, off initially.
- Focus the canvas: arrow keys orbit, plus/minus zoom, Home resets.

Reduced-motion preference disables the entrance animation, ion pulse and animated camera reset. Animation pauses when the viewer leaves the viewport or the tab is hidden. Renderer creation failure or context loss offers the CAD view.

## Verification

Run `npm run test:spacecraft` and `npm run build`.

The model tests cover all 27 visual subsystem combinations, every existing payload's attachment/removal, immutable inputs, and one-time disposal of all generated geometries, materials and textures. Browser verification covers both screen integrations, camera controls, CAD switching, responsive sizing, live replacements and repeated mount/unmount cleanup.

Cleanup cancels animation frames, disconnects observers/listeners, disposes OrbitControls, model resources, reflection targets, shadow targets and the renderer, then releases the WebGL context. Context release is deferred one task so React 18 StrictMode's immediate effect replay can reuse the canvas safely.
