# Orbital Insertion, Surface Touchdown & Science Discovery Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate *Mission Forge* into a professional, end-to-end NASA space mission game by implementing Phase 06 Orbital Insertion & Touchdown (EDL), Phase 07 Science Discovery Lab with payload discoveries, procedural audio synthesizers, and an official printable NASA Mission Certificate.

**Architecture:** Extend `MissionPhase` to route `'arrival'` and `'discovery'` screens. Build `landingGame.ts` and `discoveryGame.ts` with NASA astrophysics business logic. Create `ArrivalScene.tsx` in Three.js with close-proximity atmospheric entry, retro-burn plasma, and terminal descent telemetry. Connect live crew reactions and procedural Web Audio synthesizers throughout.

**Tech Stack:** React 18, TypeScript, Three.js, Lucide Icons, Web Audio API, Vite, Node test runner.

## Global Constraints
- 100% offline self-contained reliability (zero external CDNs, procedural canvas textures & Web Audio synthesis).
- 0 TypeScript compilation errors (`tsc && vite build` must exit 0).
- All unit and game tests must pass (`npm run test:game`).
- Follow established UI theme: `#050b17` space background, `#1b2a3a` cards, `IBM Plex Mono` telemetry typography, `#73d9bc` nominal and `#f0a587` alert accents.

---

### Task 1: Mission Types, Phase Routing, and Audio Engine Expansion

**Files:**
- Modify: `src/types/mission.ts`
- Modify: `src/utils/sound.ts`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/App.tsx`
- Test: `tests/mission-phases.test.mjs`

**Interfaces:**
- Produces:
  - `MissionPhase`: includes `'arrival' | 'discovery'`
  - `LandingSite`: `{ id: string; name: string; coordinates: string; scienceMultiplier: number; hazardLevel: 'Low' | 'Medium' | 'High'; description: string; photoFeatures: string[] }`
  - `sound.playRetroBurn()`, `sound.playPlasmaEntry()`, `sound.playTouchdownCheer()`, `sound.playDiscoveryUnlock()`

- [ ] **Step 1: Write test for new phases and audio signatures**
Create `tests/mission-phases.test.mjs` asserting phase ordering and landing site definitions.

- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/mission-phases.test.mjs`
Expected: FAIL due to missing definitions.

- [ ] **Step 3: Update `src/types/mission.ts` with `'arrival' | 'discovery'` and `LandingSite`**
Add the new phase types and interfaces.

- [ ] **Step 4: Update `src/utils/sound.ts` with procedural synthesizers**
Add `playRetroBurn`, `playPlasmaEntry`, `playTouchdownCheer`, and `playDiscoveryUnlock`.

- [ ] **Step 5: Update `src/components/layout/Header.tsx` and `src/App.tsx`**
Wire up phase routing and header navigation for `'arrival'` and `'discovery'`.

- [ ] **Step 6: Run test to verify it passes**
Run: `node --test tests/mission-phases.test.mjs`
Expected: PASS.

- [ ] **Step 7: Commit**
```bash
git add src/types/mission.ts src/utils/sound.ts src/components/layout/Header.tsx src/App.tsx tests/mission-phases.test.mjs
git commit -m "feat: add arrival and discovery phases with procedural audio engines"
```

---

### Task 2: Landing & Insertion Business Logic (`landingGame.ts`)

**Files:**
- Create: `src/simulation/landingGame.ts`
- Create: `tests/landing-game.test.mjs`

**Interfaces:**
- Produces:
  - `evaluateInsertionBurn(entryAngleDeg: number, burnDurationSec: number, destinationId: DestinationId): InsertionResolution`
  - `DESTINATION_LANDING_SITES: Record<DestinationId, LandingSite[]>`
  - `evaluateTouchdown(site: LandingSite, throttlePct: number, fuelRemainingPct: number): TouchdownResolution`

- [ ] **Step 1: Write the failing test**
Create `tests/landing-game.test.mjs` testing nominal vs steep vs shallow insertion burns, and touchdown deceleration.

- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/landing-game.test.mjs`
Expected: FAIL with `landingGame.ts` not found.

- [ ] **Step 3: Implement `src/simulation/landingGame.ts`**
Implement Mars/Moon/Asteroid insertion corridors, landing sites (Jezero, Valles Marineris, Elysium, Shackleton, Tranquility, Nightingale, Osprey), and touchdown evaluation.

- [ ] **Step 4: Run test to verify it passes**
Run: `node --test tests/landing-game.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/simulation/landingGame.ts tests/landing-game.test.mjs
git commit -m "feat: implement orbital insertion and landing site evaluation logic"
```

---

### Task 3: 3D Arrival & Landing Scene (`ArrivalScene.tsx`)

**Files:**
- Create: `src/components/simulation/ArrivalScene.tsx`
- Create: `src/components/simulation/arrival.css`

**Interfaces:**
- Consumes: `MissionConfiguration`, stage (`'orbit' | 'descent' | 'surface'`), entry angle, throttle
- Produces: Interactive Three.js scene showing close-range planet, atmospheric entry plasma cone, terminal thruster descent, and radar altimeter HUD.

- [ ] **Step 1: Create `ArrivalScene.tsx`**
Implement Three.js renderer, planet mesh with procedural high-res texture, atmospheric entry plasma shell (orange/white glowing cone with pulse), descent thruster plume, and radar altimeter HUD.

- [ ] **Step 2: Create `arrival.css`**
Style the arrival scene container, altimeter readouts, HUD reticle, and descent stages.

- [ ] **Step 3: Verify build**
Run: `npm run build`
Expected: Exit code 0.

- [ ] **Step 4: Commit**
```bash
git add src/components/simulation/ArrivalScene.tsx src/components/simulation/arrival.css
git commit -m "feat: add 3D arrival scene with atmospheric entry plasma and descent telemetry"
```

---

### Task 4: Interactive Arrival Screen (`ArrivalScreen.tsx`)

**Files:**
- Create: `src/screens/Arrival/ArrivalScreen.tsx`
- Modify: `src/screens/Simulation/SimulationScreen.tsx` (connect arrival transition button)

**Interfaces:**
- Consumes: `useMission()` hook
- Produces: 3-stage interactive workflow:
  1. Orbit Insertion Burn slider (Retrograde delta-V).
  2. Landing Site Selector (Jezero Crater / Valles Marineris / Elysium Planitia).
  3. Terminal Descent & Touchdown with audio fanfare and button to proceed to Discovery Lab.

- [ ] **Step 1: Implement `ArrivalScreen.tsx`**
Build the full screen with stage transitions, animated crew commentary (Marcus, Elena, Maya), sound triggers, and touchdown confirmation.

- [ ] **Step 2: Update `SimulationScreen.tsx`**
Update 100% completion button: When mission finishes cruise, present `[INITIATE ORBITAL INSERTION & TOUCHDOWN →]` which sets phase to `'arrival'`.

- [ ] **Step 3: Run build and game tests**
Run: `npm run test:game` and `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**
```bash
git add src/screens/Arrival/ArrivalScreen.tsx src/screens/Simulation/SimulationScreen.tsx
git commit -m "feat: implement interactive arrival screen with 3-stage landing workflow"
```

---

### Task 5: Science Discovery Lab & Printable NASA Certificate (`DiscoveryScreen.tsx`)

**Files:**
- Create: `src/simulation/discoveryGame.ts`
- Create: `src/screens/Discovery/DiscoveryScreen.tsx`
- Create: `src/screens/Discovery/discovery.css`
- Create: `tests/discovery-game.test.mjs`

**Interfaces:**
- Consumes: `MissionConfiguration`, `selectedInstrumentIds`, landing site, returned packets
- Produces:
  - `generateDiscoveries(config, landingSiteId, packetsReturned): ScienceDiscovery[]`
  - Interactive discovery cards (SAR subsurface ice sheets, Raman organic molecules, Multispectral delta layers).
  - Printable official NASA Mission Accomplished Certificate.

- [ ] **Step 1: Write tests for discovery mapper**
Create `tests/landing-game.test.mjs` or `tests/discovery-game.test.mjs` testing discovery outputs for radar, spectrometer, camera, magnetometer, and APXS.

- [ ] **Step 2: Implement `src/simulation/discoveryGame.ts`**
Implement the discovery mapping logic.

- [ ] **Step 3: Implement `DiscoveryScreen.tsx` and `discovery.css`**
Build interactive science cards with decoded telemetry, audio chime, and printable NASA Certificate with print trigger.

- [ ] **Step 4: Verify build and tests**
Run: `npm run test:game` and `npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/simulation/discoveryGame.ts src/screens/Discovery/DiscoveryScreen.tsx src/screens/Discovery/discovery.css tests/discovery-game.test.mjs
git commit -m "feat: implement Science Discovery Lab with payload unlocks and NASA certificate"
```

---

### Task 6: End-to-End Pipeline Integration & Live Browser Verification

**Files:**
- Modify: `package.json` (add new test files to `test:game` script)
- Modify: `src/screens/Results/ResultsScreen.tsx` (add link to review certificate)

- [ ] **Step 1: Update `package.json` test script**
Include `tests/mission-phases.test.mjs`, `tests/landing-game.test.mjs`, `tests/discovery-game.test.mjs`.

- [ ] **Step 2: Run all tests**
Run: `npm run test:game`
Expected: 10+ tests passing.

- [ ] **Step 3: Run production build**
Run: `npm run build`
Expected: PASS with code 0.

- [ ] **Step 4: End-to-end browser verification via Chrome DevTools MCP**
Navigate from Launch -> Cruise -> Arrival & Landing -> Discovery Lab -> Certificate -> Results, verifying smooth transitions and capturing screenshots.

- [ ] **Step 5: Commit final integration**
```bash
git add package.json src/screens/Results/ResultsScreen.tsx
git commit -m "feat: complete end-to-end mission pipeline with arrival, landing, and discovery lab"
```
