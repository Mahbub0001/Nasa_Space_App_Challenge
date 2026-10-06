# Design Specification: Orbital Insertion, Surface Touchdown & Science Discovery Lab

**Project**: Mission Forge (NASA Space Apps Challenge 2026)  
**Date**: 2026-10-06  
**Author**: Lead Astronomy Game Developer  
**Status**: Approved for Implementation

---

## 1. Executive Summary & Game Vision

The goal of this enhancement is to elevate *Mission Forge* from a deep-space cruise simulation into a **complete, immersive, end-to-end NASA space mission game**. 

Following the departure cruise and cruise anomalies, the player experiences the climax of any real interplanetary mission:
1. **Phase 06: Orbital Insertion & Touchdown (`ArrivalScreen`)**:
   - Realistic **Retro-Rocket Orbit Insertion Burn** to enter planetary orbit.
   - **Landing & Sampling Site Selection** featuring authentic NASA landing ellipses (Jezero Crater, Valles Marineris, Elysium Planitia for Mars; Shackleton Crater for Moon; Nightingale for Asteroid).
   - **Entry, Descent & Landing (EDL / Touchdown)** simulation with dynamic altimetry, deceleration physics, thruster plumes, and touchdown confirmation.
2. **Phase 07: Science Discovery Lab (`DiscoveryScreen`)**:
   - Interactive decoding of telemetry data packets returned from the mission.
   - Deep scientific unlocks mapped directly to the instruments chosen by the player in Phase 03 (e.g. SAR subsurface ice sheets, Raman organic carbon biomarkers, Multispectral ancient river deltas).
   - Generation of an official, printable **NASA Mission Accomplished & Discovery Certificate** with authentic badges, seals, and mission statistics.

---

## 2. Updated Mission Phase Architecture

### 2.1 Route & State Flow
```
01 Briefing
  ↓
02 Spacecraft (Bus, Propulsion, Power, Comms)
  ↓
03 Payload (Instruments Selection)
  ↓
04 Readiness (Launch Checklist & Vehicle)
  ↓
Launch Sequence (3D Ascent & Staging)
  ↓
05 Simulation (Flight Director Mode: Trajectory Trim, Solar Storm, Downlink)
  ↓
06 Arrival (Orbit Insertion, Site Selection, EDL / Touchdown) [NEW]
  ↓
07 Discovery (Science Data Unpack, Payload Findings, NASA Press Certificate) [NEW]
  ↓
08 Results (Flight Reliability, Budget Contingency, Complete Mission Log)
```

### 2.2 Phase Definitions (`src/types/mission.ts`)
Update `MissionPhase` to include `'discovery'`:
```typescript
export type MissionPhase = 
  | 'landing'
  | 'briefing'
  | 'mission_control'
  | 'payload'
  | 'readiness'
  | 'launch'
  | 'simulation'
  | 'arrival'
  | 'discovery'
  | 'results'
  | 'what_if';
```

---

## 3. Phase 06: Orbital Insertion & Landing (`ArrivalScreen`)

### 3.1 Gameplay Stages
1. **Stage 1: Orbit Insertion Burn (MOI)**
   - **Scenario**: Aurora arrives at the target SOI (Sphere of Influence) at hypervelocity (~24 km/s).
   - **Mechanic**: Player adjusts retrograde burn duration (seconds) and entry angle.
   - **Corridor Rules**:
     - *Nominal Corridor* (-11.5° to -13.0° entry angle, 240s burn): Stable capture orbit established (`ORBIT INSERTION CONFIRMED`). Fuel -12%, Risk -5%.
     - *Too Shallow* (>-11.0°): Spacecraft bounces off upper atmosphere / overshoots periapsis. Requires emergency propellant dump.
     - *Too Steep* (<-13.5°): Atmospheric thermal load spikes. Risk +15%.
   - **Visuals**: 3D planetary close-up, glowing heat shield entry plasma / retrograde engine flame cone.

2. **Stage 2: Landing / Sampling Site Reconnaissance**
   - Interactive site cards with orbital imagery, topography, science multiplier, and landing hazard:
   - **Mars**:
     - **Jezero Crater** (18.38°N, 77.58°E): Ancient fluvio-lacustrine lakebed. *Science: +35*, *Hazard: Medium (Boulders & Delta Scarps)*.
     - **Valles Marineris** (13.9°S, 59.2°W): Grand Canyon of Mars, exposed stratigraphic layers. *Science: +30*, *Hazard: High (Wind Shears & Slopes)*.
     - **Elysium Planitia** (4.5°N, 135.6°E): Smooth lava plain, low topography. *Science: +20*, *Hazard: Low (Ideal Landing Ellipse)*.
   - **Moon**:
     - **Shackleton Crater** (89.9°S, 0.0°E): Permanently shadowed crater floor with volatile ice deposits.
     - **Sea of Tranquility** (0.67°N, 23.47°E): Historic basaltic plain, reference terrain.
   - **Asteroid**:
     - **Nightingale Crater**: High-priority carbonaceous regolith sampling site.
     - **Osprey Site**: Smooth ponded material, lower boulder density.

3. **Stage 3: EDL / Touchdown Terminal Descent**
   - Real-time altitude & velocity descent loop:
     - 10 km altitude: Heatshield jettison / supersonic parachute deploy.
     - 2 km altitude: Terminal retro-propulsion ignition.
     - 50 m altitude: Sky-crane / lander terminal descent at 1.5 m/s.
     - 0 m altitude: **TOUCHDOWN CONFIRMED!**
   - Celebration audio trigger (`playTouchdownCheer()`), telemetry status change (`SURFACE OPERATIONAL`), and automated transition to the Science Discovery Lab.

---

## 4. Phase 07: Science Discovery Lab (`DiscoveryScreen`)

### 4.1 Telemetry Packet Decoding
The Science Lab unpacks returned science based on:
1. `selectedInstrumentIds` from preflight configuration.
2. `packetsReturned` from the cruise downlink phase.
3. Touchdown site multiplier.

### 4.2 Instrument Discovery Matrix
- **Synthetic Aperture Radar (`radar`)**:
  - *Finding*: "Subsurface Glacial Ice Sheet Discovered"
  - *Data*: Dielectric permittivity scan reveals a 45-meter thick water-ice deposit buried beneath 2 meters of regolith.
  - *Impact*: Confirms in-situ resource utilization (ISRU) feasibility for future human exploration.
- **Raman & Luminescence Spectrometer (`spectrometer`)**:
  - *Finding*: "Prebiotic Polycyclic Aromatic Hydrocarbons (PAHs)"
  - *Data*: Characteristic spectral shift at 1600 cm⁻¹ in clay sediments.
  - *Impact*: Establishes ancient habitability and biosignature potential.
- **Multispectral Imaging System (`camera`)**:
  - *Finding*: "Stratigraphic Mineral Delta Facies Mapped"
  - *Data*: 0.25 m/pixel ultra-HD imagery showing layered phyllosilicate clay beds.
  - *Impact*: Reconstructs a 3.5-billion-year-old river delta lifecycle.
- **Magnetometer & Plasma Sounder (`magnetometer`)**:
  - *Finding*: "Localized Crustal Magnetic Anomaly & Solar Wind Channeling"
  - *Data*: 85 nT localized magnetic cusp protecting surface pockets from ion radiation.
  - *Impact*: Identifies natural radiation-shielded landing zones.
- **Alpha Particle X-Ray Spectrometer (`apxs`)**:
  - *Finding*: "High-Magnesium Basaltic Volcanism Identified"
  - *Data*: X-ray fluorescence matches alkaline volcanic olivine flows.

### 4.3 Official NASA Mission Certificate
- Clean, high-impact NASA mission plaque with:
  - Spacecraft Designation: `AURORA-X1`
  - Commander & Team: User / NASA Space Apps Challenge 2026
  - Target: Mars (or Moon / Asteroid)
  - Flight Score & Mission Classification: `CLASS-A SCIENTIFIC SUCCESS`
  - Unlocked Discoveries Summary
  - Print/Save button triggering browser print dialog styled for 8.5x11 / A4 certificate.

---

## 5. Procedural Audio Enhancements (`src/utils/sound.ts`)

Add aerospace-grade procedural Web Audio synthesizers (zero external assets):
1. `playRetroBurn(duration)`: Filtered pink noise + low-frequency saw oscillator (50 Hz ramp to 35 Hz) for sustained rocket engine firing.
2. `playPlasmaEntry()`: Modulated bandpass noise simulating atmospheric hypersonic shockwave.
3. `playTouchdownCheer()`: Ascending major triad fanfare + NASA Quindar transmission blip sequence.
4. `playDiscoveryUnlock()`: Resonant bell chime + harmonic sweep (440 Hz -> 880 Hz -> 1320 Hz) when decoding scientific breakthroughs.

---

## 6. Verification & Test Plan

1. **Type Safety & Build**:
   - `npm run build` must compile with 0 TypeScript errors.
2. **Game Logic Test Suite**:
   - Add unit tests in `tests/flight-game.test.mjs` verifying:
     - Orbital insertion calculation and fuel/risk updates.
     - Landing site hazards and science multipliers.
     - Discovery payload mapping for all instrument combinations.
   - Run `npm run test:game` to verify all tests pass.
3. **End-to-End Browser Verification**:
   - Use Chrome DevTools MCP to step through:
     `Briefing` -> `Spacecraft` -> `Payload` -> `Readiness` -> `Launch` -> `Flight Cruise` -> `Arrival & Landing` -> `Science Discovery Lab` -> `Final Debrief`.
   - Take screenshots at each new screen to verify visuals, typography, and responsive layouts.
