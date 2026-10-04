# MISSION FORGE
## NASA Space Apps 2026 — High-Fidelity Shortlist Demo
## Master Product Requirements Document (PRD)

VERSION: 1.0
STATUS: DEMO / PRE-HACKATHON PROTOTYPE
PRIMARY GOAL: Build a visually exceptional, scientifically grounded, fully playable browser demo for the NASA Space Apps 2026 shortlist video.

============================================================
1. IMPORTANT CONTEXT
============================================================

This is a PRE-SELECTION DEMONSTRATION PROTOTYPE.

The purpose is NOT to build the final NASA Space Apps submission yet.

The purpose is to create a highly polished, visually rich, interactive prototype that can be demonstrated in a shortlist video.

After shortlisting, official NASA/partner resources and challenge-specific materials will be used to replace prototype data and expand the simulation.

Therefore:

- Do NOT depend on unavailable future NASA datasets.
- Do NOT pretend fictional values are official NASA values.
- Use scientifically plausible prototype parameters.
- Clearly separate prototype simulation data from future official NASA data.
- Make the architecture easy to extend later.
- Prioritize perceived quality, scientific credibility, interaction quality, storytelling, and visual polish.

The final prototype must feel like a real aerospace mission-design product.

It must NOT feel like:
- a student CRUD project
- a generic AI-generated dashboard
- a basic website
- a children's space game
- a random sci-fi game
- an unfinished Unity/3D project
- a collection of pretty screens with no real gameplay


============================================================
2. PRODUCT NAME
============================================================

MISSION FORGE

Tagline:

DESIGN. DECIDE. EXPLORE.

Alternative supporting line:

"Every mission is a trade-off."


============================================================
3. CORE PRODUCT IDEA
============================================================

MISSION FORGE is an interactive space-mission design and simulation game.

The player becomes the Mission Director.

The player must design a scientific space mission under limited:

- mass
- power
- fuel
- budget
- communication capability
- spacecraft capability
- launch capacity
- mission reliability

The player selects mission components and scientific instruments.

Every decision changes measurable mission parameters.

The player then launches the mission.

During the mission, unexpected events occur.

The player must make decisions.

Those decisions affect:

- mission risk
- fuel
- scientific return
- data return
- reliability
- resource efficiency

At the end, the player receives:

- mission score
- scientific return score
- reliability score
- resource efficiency score
- budget score
- data return score
- explanation of key decisions
- alternative "What If?" scenario


============================================================
4. CORE EXPERIENCE
============================================================

The entire game should communicate this loop:

NASA / scientific knowledge
        ↓
Mission constraints
        ↓
Player decisions
        ↓
Engineering trade-offs
        ↓
Mission simulation
        ↓
Unexpected events
        ↓
Consequences
        ↓
Mission outcome
        ↓
Scientific explanation


============================================================
5. DESIGN PHILOSOPHY
============================================================

The project must follow five principles.

1. SCIENCE FIRST

The game should be grounded in real aerospace concepts.

2. DECISIONS MATTER

Every important player choice must produce a measurable consequence.

3. SHOW, DON'T TELL

Use visual feedback instead of long paragraphs.

4. POLISHED OVER LARGE

A smaller, highly polished game is better than a large unfinished game.

5. SERIOUS AEROSPACE PRODUCT

The visual language should feel like a premium aerospace mission-control system combined with a strategy game.


============================================================
6. TARGET AUDIENCE
============================================================

Primary:

- NASA Space Apps judges
- NASA/space-science enthusiasts
- technology reviewers
- students
- educators
- science communication audiences

Secondary:

- future hackathon users
- science-game users
- general space enthusiasts


============================================================
7. PRIMARY DEMO MISSION
============================================================

Mission name:

PROJECT AURORA

Mission classification:

DEEP-SPACE SCIENTIFIC EXPLORATION SIMULATION

IMPORTANT:

Project Aurora is a fictional prototype mission.

It must NEVER be presented as an official NASA mission.

Mission objective:

"Design and operate a deep-space scientific mission capable of returning high-value observations from a planetary target while remaining within strict engineering and operational constraints."

Primary demo destination:

MARS-LIKE TARGET

Use a fictionalized "Mars-like target" or simply "Mars" as the game destination, but clearly present Project Aurora as a simulation scenario rather than an actual NASA mission.


============================================================
8. STORY
============================================================

YEAR: 2045

Humanity is preparing a new generation of scientific exploration missions.

A narrow launch window has opened.

A planetary target presents an opportunity to collect valuable scientific observations.

However, the mission has strict limits.

The spacecraft cannot carry everything.

More scientific instruments increase scientific return, but also increase:

- mass
- power demand
- cost
- operational complexity

A more powerful spacecraft may reduce some risks, but increases cost and mass.

A lighter spacecraft may be cheaper, but may carry fewer instruments.

Every mission is a compromise.

The player is appointed:

MISSION DIRECTOR

Mission Control message:

"Director, we have one launch window."

"One spacecraft."

"Limited resources."

"And a target worth reaching."

"Your mission is to decide what we take, what we sacrifice, and what we are willing to risk."

Then:

PROJECT AURORA
MISSION INITIALIZATION


============================================================
9. STORY STRUCTURE
============================================================

ACT 1 — THE BRIEFING

The player receives the mission objective and constraints.

ACT 2 — THE DESIGN

The player builds the spacecraft and scientific payload.

ACT 3 — THE TRADE-OFF

The player discovers that maximizing science creates resource pressure.

ACT 4 — THE LAUNCH

The spacecraft launches.

ACT 5 — THE UNKNOWN

Mission events force the player to make decisions.

ACT 6 — THE RETURN

The mission reaches its target and collects data.

ACT 7 — THE REVIEW

The game explains what the player's decisions achieved and what they sacrificed.

ACT 8 — WHAT IF?

The player sees how another configuration could have changed the mission.


============================================================
10. GAMEPLAY LOOP
============================================================

1. Start Mission
2. Read Mission Brief
3. Select Destination
4. Select Launch Vehicle
5. Select Propulsion
6. Select Power System
7. Select Communication System
8. Select Scientific Instruments
9. Observe live resource changes
10. Resolve constraints
11. Run Mission Readiness Check
12. Launch
13. Follow Mission Simulation
14. Respond to Mission Event
15. Respond to second Mission Event
16. Arrive at target
17. Conduct science operation
18. Complete mission
19. Calculate score
20. Explain decisions
21. Show What-If scenario
22. Replay


============================================================
11. PRIMARY MISSION CONSTRAINTS
============================================================

Prototype baseline:

MISSION BUDGET:
$2.4B

MAXIMUM SPACECRAFT MASS:
4,500 kg

POWER CAPACITY:
100 units

BASE MISSION RISK:
20%

BASE SCIENTIFIC VALUE:
40

COMMUNICATION:
Deep-space capable

MISSION WINDOW:
18 days

These are GAME BALANCING PARAMETERS.

They are NOT official NASA specifications.

Label them internally as:

"Prototype Simulation Parameter"


============================================================
12. GAME PARAMETERS
============================================================

Track these values throughout the game:

- mass
- power
- budget
- fuel
- risk
- scientific value
- reliability
- data return

All values must be visible or accessible to the player.

The UI must show changes immediately after configuration changes.


============================================================
13. DESTINATIONS
============================================================

Prototype destinations:

1. LUNAR ORBIT
Risk: Low
Science potential: Medium
Travel complexity: Low

2. MARS
Risk: Medium
Science potential: High
Travel complexity: High

3. ASTEROID BELT TARGET
Risk: High
Science potential: Very High
Travel complexity: Very High

PRIMARY DEMO:

Mars

Do not make the destination selection unnecessarily complex.

The primary demo should quickly reach the Mars mission.


============================================================
14. LAUNCH VEHICLES
============================================================

Provide 3 fictionalized launch vehicle classes.

Do NOT copy exact specifications of real launch vehicles.

### MEDIUM LIFT

Payload capacity:
3,500 kg

Cost:
Low

Reliability:
High

Fuel efficiency:
Medium


### HEAVY LIFT

Payload capacity:
5,500 kg

Cost:
Medium

Reliability:
High

Fuel efficiency:
Medium


### HEAVY LIFT PLUS

Payload capacity:
8,000 kg

Cost:
High

Reliability:
Very High

Fuel efficiency:
High


The names are conceptual game classes.

Do not claim these are actual NASA vehicles.


============================================================
15. PROPULSION
============================================================

### CHEMICAL

Advantages:
- high thrust
- fast maneuvers

Disadvantages:
- high fuel consumption


### ELECTRIC

Advantages:
- efficient propulsion

Disadvantages:
- lower thrust
- slower maneuvering


### HYBRID

Advantages:
- balanced

Disadvantages:
- moderate complexity

The UI must clearly show trade-offs.


============================================================
16. POWER SYSTEMS
============================================================

### SOLAR ARRAY

Power:
High near favorable illumination

Mass:
Medium

Cost:
Low

Risk:
Medium for extended low-light operation


### ADVANCED SOLAR

Power:
Very High

Mass:
Medium

Cost:
Medium

Risk:
Low-to-medium


### LONG-DURATION POWER SOURCE

Power:
Stable

Mass:
High

Cost:
High

Risk:
Low for long-duration operations


Do NOT label these as exact real-world spacecraft technologies unless supported by future official sources.


============================================================
17. COMMUNICATION SYSTEMS
============================================================

### STANDARD COMMUNICATION

Data return:
Medium

Power:
Low

Risk:
Medium


### HIGH-GAIN COMMUNICATION

Data return:
High

Power:
Medium

Risk:
Low


### DEEP-SPACE COMMUNICATION

Data return:
Very High

Power:
High

Cost:
High

Risk:
Low


============================================================
18. SCIENTIFIC INSTRUMENTS
============================================================

Provide at least five instruments.

### SPECTROMETER

Purpose:
Analyze chemical composition.

Prototype effects:

Science:
+18

Mass:
+120 kg

Power:
+12

Cost:
+8%


### RADAR

Purpose:
Study surface and subsurface characteristics.

Prototype effects:

Science:
+22

Mass:
+180 kg

Power:
+18

Cost:
+10%


### IMAGING SYSTEM

Purpose:
High-resolution surface imaging.

Effects:

Science:
+14

Mass:
+80 kg

Power:
+8

Cost:
+6%


### RADIATION DETECTOR

Purpose:
Measure the radiation environment.

Effects:

Science:
+10

Mass:
+40 kg

Power:
+5

Cost:
+3%


### ATMOSPHERIC SENSOR

Purpose:
Analyze atmospheric properties.

Effects:

Science:
+16

Mass:
+70 kg

Power:
+9

Cost:
+5%


IMPORTANT:

These are prototype game-balancing values.

Do not represent them as official NASA specifications.


============================================================
19. TRADE-OFF SYSTEM
============================================================

This is the most important gameplay mechanic.

Every configuration decision must modify at least one resource.

Example:

Player adds Radar.

Immediately:

SCIENCE +22
MASS +180 KG
POWER +18
COST +10%

The UI should animate the values changing.

Example:

82 → 104 POWER

Then:

POWER LIMIT EXCEEDED

Recommended actions:

- remove an instrument
- change power system
- reduce another system
- choose a different spacecraft configuration


============================================================
20. RESOURCE VISUALIZATION
============================================================

Always display:

MASS
3,820 / 4,500 KG

POWER
61 / 100

BUDGET
$1.9B / $2.4B

FUEL
72%

RISK
38%

SCIENCE
82

Use progress bars / gauges.

Do NOT make the UI look like a normal analytics dashboard.

The metrics should feel like mission telemetry.


============================================================
21. MAIN SCREEN — LANDING
============================================================

The first screen must create immediate visual impact.

Center:

MISSION FORGE

DESIGN. DECIDE. EXPLORE.

Subtext:

"Every mission is a trade-off."

Primary button:

START MISSION

Secondary button:

HOW IT WORKS

Background:

- dark space
- subtle stars
- faint orbital lines
- small spacecraft silhouette
- restrained planet glow
- technical grid

Animation:

- slow star movement
- orbital path movement
- title reveal
- subtle spacecraft movement
- button hover animation

Do not use excessive particles.


============================================================
22. SCREEN — MISSION BRIEFING
============================================================

Header:

MISSION BRIEFING

PROJECT AURORA

Objective:

"Design a deep-space scientific mission that maximizes scientific return while staying within mass, power, budget, and reliability constraints."

Display:

MISSION WINDOW
18 DAYS

BUDGET
$2.4B

MAX MASS
4,500 KG

POWER CAPACITY
100

COMMUNICATION
DEEP SPACE

SCIENCE PRIORITY
HIGH

Large central visual:

Earth → trajectory → target

Button:

ENTER MISSION CONTROL


============================================================
23. SCREEN — MISSION CONTROL
============================================================

This is the primary configuration screen.

Layout:

LEFT:
Mission configuration

CENTER:
Spacecraft visual

RIGHT:
Live telemetry

BOTTOM:
Mission progress

Left configuration sections:

Destination
Launch Vehicle
Propulsion
Power
Communication

Center:

Large spacecraft illustration built using SVG/CSS.

The spacecraft must visibly change when major components are selected.

Right:

MASS
POWER
BUDGET
FUEL
RISK
SCIENCE

Bottom:

MISSION READINESS

Button:

CONFIGURE PAYLOAD


============================================================
24. SCREEN — SCIENTIFIC PAYLOAD
============================================================

Header:

SCIENTIFIC PAYLOAD

Subheader:

"Every instrument increases what we can learn — and what the spacecraft must carry."

Show instrument cards.

Each card:

Icon
Name
Purpose
Science impact
Mass
Power
Cost

Buttons:

ADD

REMOVE

DETAILS

When added:
- animate into spacecraft
- update telemetry
- update science score


============================================================
25. SCREEN — MISSION READINESS
============================================================

Header:

PRE-LAUNCH READINESS

Checklist:

MASS ........ PASS
POWER ....... PASS
BUDGET ...... PASS
FUEL ........ PASS
COMMUNICATION PASS
PAYLOAD ..... PASS
RISK ........ ACCEPTABLE

Mission Preview:

SCIENCE
82

RISK
34%

RELIABILITY
86%

Button:

INITIATE LAUNCH


If a constraint fails:

show:

MISSION NOT READY

Reason:
"Power capacity exceeded by 14 units."

Then provide:

RETURN TO CONFIGURATION


============================================================
26. LAUNCH SEQUENCE
============================================================

Create a cinematic launch sequence.

Sequence:

T-10
T-9
T-8
...
T-0

Then:

SYSTEMS GO

IGNITION

LIFTOFF

ORBIT INSERTION

TRANS-MISSION INJECTION

CRUISE

The launch sequence should take approximately 5–8 seconds.

Allow skip after first viewing.


============================================================
27. SCREEN — MISSION SIMULATION
============================================================

This is the most visually impressive screen.

Main visualization:

2D orbital trajectory.

Show:

Earth
Spacecraft
Target
Trajectory
Current position
Mission timeline

Timeline:

✓ Launch
✓ Orbit Insertion
✓ Trans-Mission Injection
◉ Cruise
○ Course Correction
○ Arrival
○ Science Operations

Telemetry:

VELOCITY
FUEL
POWER
DISTANCE
RISK
DATA RETURN

Animate values subtly.


============================================================
28. MISSION EVENT SYSTEM
============================================================

Use deterministic events for the demo.

Do NOT use uncontrolled randomness.

The same demo path should always work.

Event 1:

COURSE DEVIATION DETECTED

Message:

"Telemetry indicates a deviation from the planned trajectory."

Options:

A. PERFORM CORRECTION BURN

Fuel:
-8

Risk:
-8

B. MAINTAIN TRAJECTORY

Fuel:
0

Risk:
+12

C. CANCEL SECONDARY OBJECTIVE

Science:
-15

Risk:
-6


Event 2:

POWER GENERATION BELOW PROJECTION

Options:

A. REDUCE INSTRUMENT OPERATIONS

Science:
-8

Risk:
-4

B. MAINTAIN FULL OPERATIONS

Science:
+5

Risk:
+12

C. ENTER LOW-POWER MODE

Science:
-12

Risk:
-5


Event 3:

COMMUNICATION WINDOW NARROWING

Options:

A. TRANSMIT NOW

Data return:
+10

Power:
-8

B. WAIT

Risk:
+8

C. REDUCE DATA PACKAGE

Data return:
-5

Risk:
-3


============================================================
29. MISSION ARRIVAL
============================================================

When target is reached:

ARRIVAL CONFIRMED

MISSION PHASE:

SCIENCE OPERATIONS

Show:

TARGET ACQUIRED

INSTRUMENTS ONLINE

DATA COLLECTION

DATA TRANSMISSION

Then complete mission.


============================================================
30. MISSION RESULT SCREEN
============================================================

Large:

MISSION COMPLETE

PROJECT AURORA

FINAL SCORE

87

Score breakdown:

SCIENTIFIC RETURN
91

MISSION RELIABILITY
84

RESOURCE EFFICIENCY
76

BUDGET PERFORMANCE
88

DATA RETURN
90

Classification:

MISSION SUCCESS


Then:

MISSION INSIGHT

"Your configuration prioritized scientific return while accepting moderate resource risk."

KEY DECISION

"Adding radar increased scientific value but significantly increased mass and power requirements."


============================================================
31. WHAT-IF ANALYSIS
============================================================

After mission completion:

Header:

WHAT IF?

Subtitle:

"Every mission has another possible path."

Compare:

YOUR MISSION

vs

ALTERNATIVE CONFIGURATION

Example:

YOUR CHOICE:
Solar + Radar

ALTERNATIVE:
Long-duration power + Spectrometer

Compare:

Mass
Power
Science
Risk
Budget
Data Return

Use a clean comparison visualization.

End:

"Different priorities create different missions."


============================================================
32. GAME RESULT LANGUAGE
============================================================

90–100:

EXCEPTIONAL MISSION

75–89:

MISSION SUCCESS

60–74:

PARTIAL SUCCESS

40–59:

HIGH RISK

0–39:

MISSION FAILURE


Avoid humiliating language.

The game should encourage experimentation.


============================================================
33. VISUAL DIRECTION
============================================================

Overall style:

PREMIUM AEROSPACE MISSION CONTROL

Reference feeling:

- NASA mission operations
- modern aerospace software
- strategy game
- scientific visualization
- cinematic documentary interface

NOT:

- sci-fi movie UI
- cyberpunk
- neon gaming interface
- children's game
- generic SaaS dashboard


============================================================
34. COLOR SYSTEM
============================================================

Base:

#05080D
#0A1018
#101821

Text:

#F2F5F7

Secondary text:

#8D9AA6

Accent:

Muted cyan / blue

Warning:

Amber

Critical:

Red

Success:

Green

Use accents only where information requires them.

Avoid huge gradient backgrounds.


============================================================
35. TYPOGRAPHY
============================================================

Primary:

Inter or Space Grotesk

Technical values:

IBM Plex Mono or equivalent monospace font

Large titles:
bold

Telemetry:
monospace

Body:
clean sans-serif


============================================================
36. UI COMPONENT STYLE
============================================================

Cards:

- thin border
- dark background
- subtle elevation
- small radius
- compact spacing

Buttons:

Primary:
solid accent

Secondary:
transparent / outlined

Danger:
red only when required

Avoid giant pill-shaped buttons.


============================================================
37. ICONOGRAPHY
============================================================

Use a consistent icon system.

Recommended:

Lucide React

Icons should be simple and technical.

Do not use random emoji in the main interface.

Use proper visual symbols for:
- fuel
- power
- mass
- science
- communications
- risk
- spacecraft
- instruments


============================================================
38. SPACECRAFT VISUAL
============================================================

Create the spacecraft using SVG/CSS rather than external stock images.

The spacecraft should have:

- central body
- solar arrays
- antenna
- propulsion section
- instrument bay

Components should visually react to configuration.

Examples:

Adding solar:
solar array appears/expands.

Adding communication:
antenna becomes visible.

Adding radar:
instrument module appears.

This creates a strong visual connection between decision and consequence.


============================================================
39. ORBITAL VISUALIZATION
============================================================

Use SVG or Canvas.

Show:

- orbital paths
- planetary bodies
- spacecraft
- trajectory line
- mission phase

The visualization does not need physically exact orbital mechanics.

It must be:

- conceptually correct
- visually convincing
- deterministic
- clearly labeled as simulation


============================================================
40. ANIMATION RULES
============================================================

Animations should communicate state.

Use:

- fade
- slide
- number interpolation
- progress transitions
- trajectory movement
- spacecraft movement
- warning pulse
- event reveal
- launch sequence
- screen transition

Duration:
mostly 150–500ms.

Cinematic launch:
5–8 seconds.

Avoid:
- bouncing UI
- excessive particles
- random motion
- over-animation


============================================================
41. SOUND
============================================================

Audio is optional.

If included:

- subtle UI clicks
- launch rumble
- mission alert
- confirmation tone

The application MUST work without sound.

Do not depend on external audio files unless legally safe and locally bundled.


============================================================
42. TECH STACK
============================================================

Use:

React
TypeScript
Vite
Tailwind CSS

Use:

SVG / Canvas

Use:

Lucide React

State:

React state/context or Zustand if necessary.

Data:

Local TypeScript/JSON.

DO NOT use:

FastAPI
PostgreSQL
Authentication
External API
Cloud backend

for this prototype.

Reason:

This is a pre-selection demonstration.

The goal is maximum polish and reliability.


============================================================
43. FUTURE ARCHITECTURE
============================================================

The prototype must be backend-ready.

Future:

React + TypeScript
        ↓
FastAPI
        ↓
Simulation Engine
        ↓
PostgreSQL
        ↓
NASA Data Pipeline

The current simulation engine should be isolated from UI.

Later it can be moved to Python/FastAPI.


============================================================
44. PROJECT STRUCTURE
============================================================

Use:

src/

  components/
    layout/
    telemetry/
    spacecraft/
    mission/
    instruments/
    simulation/
    common/

  screens/
    Landing/
    Briefing/
    MissionControl/
    Payload/
    Readiness/
    Launch/
    Simulation/
    Results/
    WhatIf/

  data/
    missions.ts
    launchVehicles.ts
    propulsion.ts
    powerSystems.ts
    communication.ts
    instruments.ts
    events.ts

  simulation/
    engine.ts
    scoring.ts
    constraints.ts
    eventResolver.ts

  types/
    mission.ts
    spacecraft.ts
    simulation.ts

  hooks/
    useMission.ts
    useSimulation.ts

  utils/
    formatting.ts
    calculations.ts

  assets/

  App.tsx


============================================================
45. TYPESCRIPT REQUIREMENTS
============================================================

Use strict TypeScript.

Never use:

any

unless absolutely unavoidable.

Create explicit types for:

Mission

MissionConfiguration

Destination

LaunchVehicle

PropulsionSystem

PowerSystem

CommunicationSystem

Instrument

ResourceState

MissionEvent

MissionDecision

SimulationState

MissionResult

ScoreBreakdown


============================================================
46. SIMULATION ENGINE
============================================================

Create a deterministic simulation engine.

Inputs:

MissionConfiguration
+
PlayerDecisions

Outputs:

SimulationState
+
MissionResult

The simulation engine must NOT depend on React components.

Example conceptual flow:

calculateMass()
calculatePower()
calculateBudget()
calculateFuel()
calculateScience()
calculateRisk()
calculateReliability()
resolveEvent()
calculateFinalScore()


============================================================
47. SCORING
============================================================

Suggested weighting:

Scientific Return:
30%

Mission Reliability:
25%

Resource Efficiency:
20%

Budget Efficiency:
15%

Data Return:
10%

Final score:
0–100


============================================================
48. DATA HONESTY
============================================================

The application must display somewhere in the About/Scientific Basis area:

"MISSION FORGE is a conceptual simulation prototype. The current demo uses fictionalized game parameters inspired by real aerospace engineering constraints. Official NASA/partner datasets and challenge-specific resources will be integrated in the final hackathon version."

Do NOT falsely claim:

"Powered by NASA data"

unless actual NASA data is integrated.

Instead use:

"Designed for integration with NASA open data."


============================================================
49. ABOUT / SCIENTIFIC BASIS SCREEN
============================================================

Optional but recommended.

Show:

MISSION FORGE

A conceptual mission-design simulation.

Core concepts represented:

- spacecraft mass constraints
- power management
- propulsion trade-offs
- communication constraints
- scientific payload selection
- mission risk
- data return
- resource optimization

Prototype note.

Future:

"Official NASA and partner resources will replace prototype parameters during the hackathon."


============================================================
50. LANDING PAGE COPY
============================================================

Use exactly or improve naturally:

MISSION FORGE

DESIGN. DECIDE. EXPLORE.

Every mission is a trade-off.

Build a spacecraft.
Choose what to carry.
Balance risk and scientific return.
Then find out whether your mission survives the decisions you made.

BUTTON:

START MISSION


============================================================
51. MISSION BRIEF COPY
============================================================

PROJECT AURORA

MISSION OBJECTIVE

Design a deep-space scientific mission capable of returning high-value observations from a planetary target while staying within strict mass, power, budget, and reliability limits.

MISSION WINDOW
18 DAYS

BUDGET
$2.4B

MAX MASS
4,500 KG

POWER
100 UNITS

SCIENCE PRIORITY
HIGH


============================================================
52. MISSION CONTROL MICROCOPY
============================================================

Use technical but understandable labels.

Examples:

SYSTEM NOMINAL

RESOURCE WARNING

POWER MARGIN LOW

MASS LIMIT APPROACHING

PAYLOAD OPTIMIZED

MISSION READY

TRAJECTORY STABLE

COURSE DEVIATION

COMMUNICATION WINDOW

SCIENCE OPERATIONS

DATA ACQUISITION

TRANSMISSION COMPLETE


============================================================
53. DEMO PATH
============================================================

The application must support this exact video-friendly path.

STEP 1:

Landing

Click:
START MISSION


STEP 2:

Mission briefing

Click:
ENTER MISSION CONTROL


STEP 3:

Select:

Destination:
Mars

Launch:
Heavy Lift

Propulsion:
Hybrid

Power:
Advanced Solar

Communication:
Deep-Space


STEP 4:

Add:

Imaging System
Spectrometer
Radar
Radiation Detector


STEP 5:

Show:

SCIENCE increases.

But:

MASS increases.

POWER increases.

RISK increases.

This is the visual "trade-off" moment.


STEP 6:

Remove or change one component to get within limits.

Show the system responding.


STEP 7:

Mission readiness:

PASS


STEP 8:

Launch.


STEP 9:

Mission simulation.


STEP 10:

Course deviation event.

Choose:

PERFORM CORRECTION BURN


STEP 11:

Power event.

Choose:

REDUCE INSTRUMENT OPERATIONS


STEP 12:

Arrival.


STEP 13:

Science operations.


STEP 14:

Mission complete.


STEP 15:

Final score.


STEP 16:

What-if comparison.


============================================================
54. VIDEO STORYBOARD
============================================================

Target video length:

60–120 seconds.

VIDEO:

0–5 sec

MISSION FORGE title reveal.

5–12 sec

Mission briefing.

12–25 sec

Player configures spacecraft.

25–35 sec

Scientific instruments are added.

Show live telemetry changing.

35–45 sec

Mission readiness.

45–55 sec

Launch.

55–70 sec

Trajectory simulation.

70–82 sec

Mission event.

82–95 sec

Player decision.

95–108 sec

Mission result.

108–120 sec

What-if comparison + final product branding.


============================================================
55. VIDEO NARRATIVE
============================================================

Suggested narration:

"Every space mission is a trade-off."

"More science means more mass."

"More capability means more power and cost."

"In Mission Forge, you are the Mission Director."

"You decide what the spacecraft carries."

"Then you live with those decisions."

"During the mission, unexpected problems force you to adapt."

"Your final score isn't just about reaching the destination."

"It's about what you discovered, what you risked, and what you had to sacrifice."


============================================================
56. UI/UX QUALITY BAR
============================================================

The following are mandatory.

The interface must:

- feel premium
- feel intentional
- have consistent spacing
- have consistent typography
- have meaningful animation
- have clear hierarchy
- respond immediately to interactions
- avoid clutter
- avoid generic dashboard aesthetics
- avoid excessive gradients
- avoid excessive rounded cards
- avoid unnecessary text

Every screen should have one obvious primary action.


============================================================
57. RESPONSIVE TARGET
============================================================

Primary:

1440 × 900

Secondary:

1366 × 768

Minimum:

1280 × 720

The demo must look excellent at laptop resolution.

Mobile is secondary.


============================================================
58. PERFORMANCE
============================================================

Target:

Smooth 60fps-feeling interactions where possible.

Avoid:

- huge image assets
- heavy dependencies
- unnecessary libraries
- excessive particles
- expensive re-render loops


============================================================
59. OFFLINE REQUIREMENT
============================================================

The demo must run without external API access.

After:

npm install

it must run with:

npm run dev

and build with:

npm run build


============================================================
60. ERROR HANDLING
============================================================

Never allow a broken state.

If something fails:

Show a clean in-game system message.

Example:

SIMULATION ERROR

"Mission state could not be resolved."

Buttons:

RETRY
RESET MISSION


============================================================
61. RESET / REPLAY
============================================================

Provide:

RESTART MISSION

The user must be able to return to the initial state.

The demo path must work repeatedly.


============================================================
62. QA
============================================================

Before completion, test:

Landing
Briefing
Configuration
Instrument selection
Resource calculations
Readiness
Launch
Simulation
Events
Decisions
Results
What-If
Reset

Check:

No console errors.

No broken buttons.

No overflow.

No accidental scrollbars.

No missing assets.

No placeholder text.

No dead-end screens.

No inconsistent spacing.

No broken animation.


============================================================
63. VISUAL QA
============================================================

Inspect every screen.

Fix:

- weak typography
- bad spacing
- misalignment
- excessive empty space
- excessive cards
- poor contrast
- generic gradients
- awkward icons
- inconsistent button design
- excessive glow
- unrealistic visuals
- ugly charts
- overly dense layouts

The final result should look deliberately designed by a professional product/design team.


============================================================
64. ANTI-AI-GENERIC DESIGN RULE
============================================================

DO NOT produce the common AI-generated interface pattern:

dark background
+
purple/blue gradient
+
glass cards
+
glowing borders
+
huge rounded rectangles
+
random 3D planets
+
generic dashboard charts

Instead:

Use restrained aerospace design.

Use:

- technical grid
- thin separators
- precise typography
- telemetry
- orbital diagrams
- scientific labels
- restrained accent color
- purposeful animation
- strong composition


============================================================
65. NO 3D REQUIREMENT
============================================================

Do NOT build a full 3D game.

Do NOT use Unity.

Do NOT use Unreal.

Do NOT create complicated 3D models.

Use:

2D / 2.5D

with:

SVG
Canvas
CSS
animation

The result should LOOK sophisticated without requiring a complicated 3D engine.


============================================================
66. NO BACKEND REQUIREMENT FOR PROTOTYPE
============================================================

Do not waste time building:

FastAPI
PostgreSQL
authentication
cloud infrastructure
user management

for this demo.

The current goal is:

MAXIMUM VISUAL QUALITY
+
PLAYABLE EXPERIENCE
+
SCIENTIFIC STORY
+
DEMO RELIABILITY


============================================================
67. FUTURE HACKATHON PLAN
============================================================

After shortlist:

1. Read official challenge resources.
2. Identify official NASA datasets.
3. Replace fictional prototype data.
4. Add data ingestion.
5. Build FastAPI backend.
6. Add PostgreSQL/PostGIS if needed.
7. Replace conceptual parameters with verified values.
8. Add citations/source metadata.
9. Improve simulation.
10. Validate scientific assumptions.
11. Add final documentation.
12. Prepare final submission.


============================================================
68. FUTURE BACKEND ARCHITECTURE
============================================================

Frontend:

React + TypeScript

Backend:

FastAPI

Database:

PostgreSQL

Potential geospatial:

PostGIS

Data processing:

Python

Scientific libraries:

NumPy
SciPy
Pandas
appropriate NASA/open-data libraries

Future:

NASA Data
    ↓
Data Pipeline
    ↓
PostgreSQL
    ↓
FastAPI
    ↓
Simulation Engine
    ↓
React


============================================================
69. CODEX / ANTIGRAVITY MASTER INSTRUCTION
============================================================

You are not merely writing code.

You are acting simultaneously as:

- Senior Frontend Engineer
- Game UX Designer
- Product Designer
- Interaction Designer
- Scientific Visualization Designer
- Aerospace-themed UI designer
- QA Engineer

Your task is to build the complete MISSION FORGE prototype described in this PRD.

Read the entire PRD before starting.

Do not ask unnecessary questions.

Make reasonable implementation decisions when the PRD already specifies the desired behavior.

Build the application in phases.

Do not stop at a rough scaffold.

Do not create a generic dashboard.

Do not create a static mockup.

The result must be fully interactive.

The demo path described in this PRD must work from start to finish.

Prioritize visual quality and usability.

Use local deterministic data.

Do not depend on external APIs.

Do not add backend infrastructure at this stage.

Do not use fake NASA claims.

Do not label fictional parameters as NASA specifications.

Keep the code modular and backend-ready.


============================================================
70. CODEX / ANTIGRAVITY IMPLEMENTATION PHASES
============================================================

PHASE 1

Initialize:

React
TypeScript
Vite
Tailwind

Set up design system.

Do not build everything in one component.


PHASE 2

Build:

Landing
Mission Briefing
navigation/transitions


PHASE 3

Build:

Mission Control
spacecraft SVG
telemetry
configuration system


PHASE 4

Build:

Scientific Payload
instrument system
live resource calculations


PHASE 5

Build:

Mission Readiness
validation
warnings


PHASE 6

Build:

Launch Sequence
Mission Simulation
trajectory


PHASE 7

Build:

Mission Events
decision system
consequences


PHASE 8

Build:

Results
score breakdown
What-If


PHASE 9

Polish:

animation
spacing
typography
responsive behavior
visual hierarchy


PHASE 10

QA:

run demo path repeatedly
fix all bugs
run production build
remove console errors
remove placeholders


============================================================
71. IMPORTANT IMPLEMENTATION BEHAVIOR
============================================================

When a user adds an instrument:

Do not simply update a number.

Show:

1. instrument visually attaching to spacecraft
2. metric animation
3. telemetry update
4. subtle notification

Example:

RADAR INSTALLED

+22 SCIENCE

+180 KG

+18 POWER


When user removes:

RADAR REMOVED

Resource values revert.

When limit is exceeded:

POWER MARGIN EXCEEDED

show amber/red warning.


============================================================
72. MISSION EVENT UX
============================================================

When an event occurs:

Pause simulation.

Dim background slightly.

Bring event panel into focus.

Show:

EVENT ID

EVENT TITLE

Short description

Current telemetry

3 decisions

Each decision should show consequences.

Example:

PERFORM CORRECTION BURN

Fuel -8%
Risk -8%

The player must understand the consequence BEFORE selecting.


============================================================
73. FINAL RESULT UX
============================================================

Do not dump numbers onto screen.

Reveal score progressively.

Example:

SCIENTIFIC RETURN
91

MISSION RELIABILITY
84

RESOURCE EFFICIENCY
76

BUDGET PERFORMANCE
88

Then:

FINAL SCORE
87


============================================================
74. DESIGN DETAILS THAT CREATE PREMIUM FEEL
============================================================

Use:

- subtle scanline/grid texture
- small technical labels
- mission ID
- system time
- mission phase indicator
- telemetry markers
- tiny status dots
- thin separators
- orbital trajectory
- small coordinates
- system status text

But do not clutter.

Everything must have purpose.


============================================================
75. OPTIONAL CINEMATIC DETAILS
============================================================

Add if time allows:

- animated star field
- rotating planet
- spacecraft shadow
- telemetry sweep
- radar pulse
- trajectory drawing animation
- subtle camera movement
- launch vibration
- data transmission animation


============================================================
76. DO NOT ADD
============================================================

Do not add:

- multiplayer
- chat
- login
- social features
- combat
- weapons
- aliens
- shooting
- inventory systems
- complex economy
- procedural worlds
- giant open world
- full 3D physics
- unnecessary achievements
- unnecessary settings
- unnecessary menus


============================================================
77. PRODUCT SUCCESS TEST
============================================================

A person who has never seen the project should be able to understand the following within 30 seconds:

"I am designing a space mission."

"I have limited resources."

"My scientific instruments affect the spacecraft."

"My decisions affect mission risk."

"I can launch and simulate the mission."

"The final result explains whether my decisions worked."


============================================================
78. FINAL ACCEPTANCE CHECKLIST
============================================================

[ ] Project launches successfully.

[ ] Landing page looks premium.

[ ] Mission briefing works.

[ ] Mission configuration works.

[ ] Destination selection works.

[ ] Launch vehicle selection works.

[ ] Propulsion selection works.

[ ] Power selection works.

[ ] Communication selection works.

[ ] Scientific instruments work.

[ ] Spacecraft visual changes.

[ ] Mass updates.

[ ] Power updates.

[ ] Budget updates.

[ ] Fuel updates.

[ ] Risk updates.

[ ] Science score updates.

[ ] Readiness system works.

[ ] Launch sequence works.

[ ] Trajectory animation works.

[ ] Mission timeline works.

[ ] Mission events work.

[ ] Decisions affect mission state.

[ ] Mission completes.

[ ] Score is calculated.

[ ] Score explanation works.

[ ] What-If works.

[ ] Reset works.

[ ] Demo path works repeatedly.

[ ] No console errors.

[ ] No placeholder content.

[ ] No dead buttons.

[ ] No broken layouts.

[ ] Production build succeeds.

[ ] UI is polished.

[ ] UI does not look AI-generated.

[ ] Scientific claims are honest.

[ ] Prototype/future NASA data distinction is clear.


============================================================
79. FINAL PRODUCT STATEMENT
============================================================

MISSION FORGE is a conceptual interactive mission-design simulation where players experience the real challenge of space exploration:

You cannot maximize everything.

Every kilogram matters.

Every watt matters.

Every decision creates a consequence.

The goal is not simply to reach the destination.

The goal is to design the mission intelligently.

END OF PRD