export interface Character {
  id: 'elena' | 'marcus' | 'maya' | 'sterling';
  name: string;
  callsign: string;
  role: string;
  title: string;
  organization: string;
  badge: string;
  themeColor: string;
  accentBg: string;
  avatarUrl?: string;
  quote: string;
  bio: string;
  voicePitch: number;
}

export const CHARACTERS: Record<string, Character> = {
  sterling: {
    id: 'sterling',
    name: 'Director Arthur Sterling',
    callsign: 'DIRECTOR-1',
    role: 'Aurora Mission Director',
    title: 'Flight Director, Project Aurora',
    organization: 'Aurora Mission Control · fictional crew',
    badge: 'DIRECTORATE',
    themeColor: '#38BDF8',
    accentBg: 'rgba(56, 189, 248, 0.1)',
    quote: '"Every deep-space voyage starts with a dream and an engineer who refuses to give up."',
    bio: 'Veteran of five interplanetary discovery missions. Passionate about empowering young explorers to lead humanity beyond Earth orbit.',
    voicePitch: 320,
  },
  elena: {
    id: 'elena',
    name: 'Dr. Elena Vance',
    callsign: 'SCIENCE LEAD',
    role: 'Chief Planetary Scientist',
    title: 'Principal Investigator, Planetary Astrobiology',
    organization: 'Aurora Science Division · fictional crew',
    badge: 'SCIENCE',
    themeColor: '#34D399',
    accentBg: 'rgba(52, 211, 153, 0.1)',
    quote: '"We build spacecraft not merely to visit new worlds, but to discover what they teach us about ourselves."',
    bio: 'Dedicated her life to the search for liquid water and ancient organic signatures across Mars, Europa, and Enceladus.',
    voicePitch: 520,
  },
  marcus: {
    id: 'marcus',
    name: 'Cmdr. Marcus Reed',
    callsign: 'FLIGHT OPS',
    role: 'Chief Flight Systems Engineer',
    title: 'Lead Systems Architect & Spacecraft Commander',
    organization: 'Aurora Flight Systems · fictional crew',
    badge: 'OPERATIONS',
    themeColor: '#FBBF24',
    accentBg: 'rgba(251, 191, 36, 0.1)',
    quote: '"A brilliant instrument is useless if the spacecraft runs out of power or propellant in the dark."',
    bio: 'Former astronaut and lead avionics designer. Believes that engineering discipline and redundant safety margins save lives and missions.',
    voicePitch: 260,
  },
  maya: {
    id: 'maya',
    name: 'Maya Chen',
    callsign: 'COMMS LEAD',
    role: 'Communications Lead',
    title: 'Senior Telemetry & Interplanetary Comms Specialist',
    organization: 'Aurora Ground Network · fictional crew',
    badge: 'TELEMETRY',
    themeColor: '#A78BFA',
    accentBg: 'rgba(167, 139, 250, 0.1)',
    quote: '"Across hundreds of millions of kilometers of void, radio photons are the only thread tying our explorer to Earth."',
    bio: 'Manages the 70-meter parabolic dishes that catch faint whisper signals from across the solar system.',
    voicePitch: 440,
  },
};

export interface NarrativeDialogue {
  characterId: 'elena' | 'marcus' | 'maya' | 'sterling';
  text: string;
  tone: 'inspirational' | 'caution' | 'urgent' | 'excited' | 'proud';
  nasaFact?: string;
}

export const BRIEFING_DIALOGUE: NarrativeDialogue[] = [
  {
    characterId: 'sterling',
    text: "Welcome to Mission Control, Flight Director! Today, you step into the shoes of the architects who sent Voyager to the stars and landed Curiosity on Mars. We are placing Project Aurora in your hands.",
    tone: 'inspirational',
    nasaFact: "NASA flight directors wear the legendary designation 'Flight' and have final operational authority over missions worth billions of dollars.",
  },
  {
    characterId: 'elena',
    text: "Director, the planetary window is open! Out there is a pristine world holding clues to the origin of water and life. Every instrument you integrate will unlock discoveries no human has ever seen before.",
    tone: 'excited',
    nasaFact: "Mars missions can only launch roughly every 26 months when Earth and Mars align in their solar orbits (the Hohmann transfer window).",
  },
  {
    characterId: 'marcus',
    text: "My job is to keep your feet on the ground, Director. Rocket mass limits are unforgiving. If you overload our spacecraft, we will either exceed our launcher capacity or run dry on propellant during orbital insertion. Build smart, build balanced.",
    tone: 'caution',
    nasaFact: "The Tsiolkovsky Rocket Equation dictates that for every kilogram of scientific equipment added, the rocket must carry exponentially more propellant.",
  },
];

export const CONFIG_REACTIONS: Record<string, NarrativeDialogue> = {
  // Destinations
  destination_lunar_orbit: {
    characterId: 'sterling',
    text: "The Moon! Stepping stone for our Artemis generation. Fast 4-day transit with direct line-of-sight to Earth.",
    tone: 'inspirational',
    nasaFact: "The Moon is 384,400 km away—radio signals take only 1.3 seconds to reach Earth!",
  },
  destination_moon: {
    characterId: 'sterling',
    text: "The Moon! Stepping stone for our Artemis generation. Fast 4-day transit with direct line-of-sight to Earth.",
    tone: 'inspirational',
    nasaFact: "The Moon is 384,400 km away—radio signals take only 1.3 seconds to reach Earth!",
  },
  destination_mars: {
    characterId: 'elena',
    text: "Mars is the crown jewel of planetary exploration! It has ancient riverbeds, dormant volcanoes, and subsurface ice awaiting our sensors.",
    tone: 'excited',
    nasaFact: "Mars is about 225 million kilometers away on average. One-way radio transmissions take between 4 to 22 minutes!",
  },
  destination_asteroid_belt: {
    characterId: 'marcus',
    text: "Asteroid rendezvous! Extremely high Delta-V required. We will need meticulous propellant reserves to counter microgravity drift.",
    tone: 'caution',
    nasaFact: "NASA's Psyche spacecraft used electric Hall-effect thrusters to journey over 3.5 billion kilometers to explore a metal-rich asteroid.",
  },
  destination_asteroid: {
    characterId: 'marcus',
    text: "Asteroid rendezvous! Extremely high Delta-V required. We will need meticulous propellant reserves to counter microgravity drift.",
    tone: 'caution',
    nasaFact: "NASA's Psyche spacecraft used electric Hall-effect thrusters to journey over 3.5 billion kilometers to explore a metal-rich asteroid.",
  },

  // Launch Vehicles
  launcher_medium_lift: {
    characterId: 'marcus',
    text: "Medium Lift selected. Cost-effective, but keep a tight eye on our throw-weight ceiling (3,500 kg)!",
    tone: 'caution',
    nasaFact: "Class II rockets balance cost and launch availability, perfect for lean scientific explorer probes.",
  },
  launcher_medium: {
    characterId: 'marcus',
    text: "Medium Lift selected. Cost-effective, but keep a tight eye on our throw-weight ceiling (3,500 kg)!",
    tone: 'caution',
    nasaFact: "Class II rockets balance cost and launch availability, perfect for lean scientific explorer probes.",
  },
  launcher_heavy_lift: {
    characterId: 'sterling',
    text: "Heavy Lift booster locked in! A proven workhorse with 5,500 kg capacity giving us ample reserve throw-weight.",
    tone: 'proud',
    nasaFact: "Heavy-lift launchers provide trans-injection velocities exceeding 11 km/s to break Earth's gravitational well.",
  },
  launcher_heavy: {
    characterId: 'sterling',
    text: "Heavy Lift booster locked in! A proven workhorse with 5,500 kg capacity giving us ample reserve throw-weight.",
    tone: 'proud',
    nasaFact: "Heavy-lift launchers provide trans-injection velocities exceeding 11 km/s to break Earth's gravitational well.",
  },
  launcher_heavy_lift_plus: {
    characterId: 'elena',
    text: "Super Heavy lift! Massive 8,000 kg throw-weight! We can load the most ambitious scientific instruments ever launched!",
    tone: 'excited',
    nasaFact: "NASA's Space Launch System (SLS) is the most powerful rocket ever flown, capable of sending massive deep-space exploration craft directly to the outer solar system.",
  },
  launcher_heavy_plus: {
    characterId: 'elena',
    text: "Super Heavy lift! Massive 8,000 kg throw-weight! We can load the most ambitious scientific instruments ever launched!",
    tone: 'excited',
    nasaFact: "NASA's Space Launch System (SLS) is the most powerful rocket ever flown, capable of sending massive deep-space exploration craft directly to the outer solar system.",
  },

  // Propulsion
  propulsion_chemical: {
    characterId: 'marcus',
    text: "Chemical bipropellant: classic, high-thrust reliability. We get rapid impulsive burns, though propellant mass is heavy.",
    tone: 'proud',
    nasaFact: "Chemical hypergolic engines ignite automatically upon contact of fuel and oxidizer, requiring no complex spark plugs in the vacuum of space.",
  },
  propulsion_electric: {
    characterId: 'elena',
    text: "Hall-Effect Ion propulsion! It uses electricity to accelerate xenon ions at hypersonic velocities. Unmatched fuel efficiency!",
    tone: 'excited',
    nasaFact: "Ion engines like NASA's NEXT produce thrust as gentle as the weight of a sheet of paper on your hand, but can accelerate continuously for years!",
  },
  propulsion_electric_ion: {
    characterId: 'elena',
    text: "Hall-Effect Ion propulsion! It uses electricity to accelerate xenon ions at hypersonic velocities. Unmatched fuel efficiency!",
    tone: 'excited',
    nasaFact: "Ion engines like NASA's NEXT produce thrust as gentle as the weight of a sheet of paper on your hand, but can accelerate continuously for years!",
  },
  propulsion_hybrid: {
    characterId: 'marcus',
    text: "Hybrid configuration: chemical thrusters for immediate planetary injection plus ion cruising. Maximum versatility.",
    tone: 'inspirational',
    nasaFact: "Modern missions like Europa Clipper combine high-thrust bipropellant maneuvering with fine attitude RCS thrusters.",
  },

  // Power
  power_solar_array: {
    characterId: 'elena',
    text: "Standard solar arrays: lightweight, clean, and cheap. Just remember that solar flux drops dramatically as we travel away from the Sun.",
    tone: 'caution',
    nasaFact: "Solar power obeys the Inverse-Square Law: double the distance from the Sun, and solar power drops to just 25% (one quarter)!",
  },
  power_solar: {
    characterId: 'elena',
    text: "Standard solar arrays: lightweight, clean, and cheap. Just remember that solar flux drops dramatically as we travel away from the Sun.",
    tone: 'caution',
    nasaFact: "Solar power obeys the Inverse-Square Law: double the distance from the Sun, and solar power drops to just 25% (one quarter)!",
  },
  power_advanced_solar: {
    characterId: 'maya',
    text: "Advanced Concentrator ROSA arrays equipped with multi-junction gallium arsenide cells. Excellent power-to-mass ratio.",
    tone: 'proud',
    nasaFact: "NASA's Lucy and Orion spacecraft use circular UltraFlex solar arrays that unfurl like giant origami fans.",
  },
  power_solar_advanced: {
    characterId: 'maya',
    text: "Advanced Concentrator ROSA arrays equipped with multi-junction gallium arsenide cells. Excellent power-to-mass ratio.",
    tone: 'proud',
    nasaFact: "NASA's Lucy and Orion spacecraft use circular UltraFlex solar arrays that unfurl like giant origami fans.",
  },
  power_long_duration_power: {
    characterId: 'marcus',
    text: "Radioisotope Thermoelectric Generator (RTG)! Decaying Plutonium-238 provides steady, unbreakable power for decades, completely independent of sunlight.",
    tone: 'proud',
    nasaFact: "Voyager 1 and 2 carry RTGs launched in 1977 and are still transmitting telemetry over 47 years later in interstellar space!",
  },
  power_rtg: {
    characterId: 'marcus',
    text: "Radioisotope Thermoelectric Generator (RTG)! Decaying Plutonium-238 provides steady, unbreakable power for decades, completely independent of sunlight.",
    tone: 'proud',
    nasaFact: "Voyager 1 and 2 carry RTGs launched in 1977 and are still transmitting telemetry over 47 years later in interstellar space!",
  },

  // Comms
  comms_standard: {
    characterId: 'maya',
    text: "Standard S/X-Band medium antenna linked. Solid baseline downlink for telemetry and compressed imagery.",
    tone: 'caution',
    nasaFact: "X-band radio (8.4 GHz) is the standard frequency NASA uses to guide spacecraft and receive scientific commands.",
  },
  comms_x_band: {
    characterId: 'maya',
    text: "Standard S/X-Band medium antenna linked. Solid baseline downlink for telemetry and compressed imagery.",
    tone: 'caution',
    nasaFact: "X-band radio (8.4 GHz) is the standard frequency NASA uses to guide spacecraft and receive scientific commands.",
  },
  comms_high_gain: {
    characterId: 'maya',
    text: "Deep Space Network Ka-Band 2.4m steerable dish! High-frequency bandwidth allows fast streaming of planetary sensor sweeps.",
    tone: 'proud',
    nasaFact: "NASA's Deep Space Network has giant 70-meter dish antennas in California, Spain, and Australia to maintain 24/7 round-the-clock radio contact.",
  },
  comms_deep_space: {
    characterId: 'elena',
    text: "Deep Space Optical Laser & High-Gain hybrid! Infrared laser beams allow data rates 10 to 100 times faster than radio!",
    tone: 'excited',
    nasaFact: "In 2023, NASA's DSOC laser experiment beamed ultra-high-definition streaming video from 31 million kilometers away in deep space back to Earth!",
  },
  comms_optical: {
    characterId: 'elena',
    text: "Deep Space Optical Laser & High-Gain hybrid! Infrared laser beams allow data rates 10 to 100 times faster than radio!",
    tone: 'excited',
    nasaFact: "In 2023, NASA's DSOC laser experiment beamed ultra-high-definition streaming video from 31 million kilometers away in deep space back to Earth!",
  },
};

export interface AnomalyCouncilDebate {
  eventId: string;
  situation: string;
  voices: {
    characterId: 'elena' | 'marcus' | 'maya' | 'sterling';
    opinion: string;
    advocacyChoice: 'A' | 'B' | 'C';
  }[];
}

export const ANOMALY_COUNCIL_DEBATES: Record<string, AnomalyCouncilDebate> = {
  course_deviation: {
    eventId: 'course_deviation',
    situation: "Interplanetary guidance sensors detect a 0.14° drift from our nominal corridor. If uncorrected, our capture corridor will degrade.",
    voices: [
      {
        characterId: 'marcus',
        opinion: "Director, we must burn RCS propellant right now (Option A). A trajectory error compound exponentially over 200 million km. Precision flight path is safety rule number one.",
        advocacyChoice: 'A',
      },
      {
        characterId: 'elena',
        opinion: "Marcus, don't rush! If we burn propellant now, what if we run short during Mars orbital capture? Or consider canceling our secondary flyby (Option C) to save fuel without burning precious reserves!",
        advocacyChoice: 'C',
      },
      {
        characterId: 'maya',
        opinion: "Goldstone radar confirms the drift vector. The flight dynamics corridor allows Option A or C; just remember any trajectory change must be uploaded before our DSN pass window closes.",
        advocacyChoice: 'A',
      },
    ],
  },
  power_deficit: {
    eventId: 'power_deficit',
    situation: "A massive coronal mass ejection from the Sun hit our spacecraft. Solar array output dropped 12% and batteries are straining.",
    voices: [
      {
        characterId: 'elena',
        opinion: "Director, please do not shut off the science suite! This radiation storm is unprecedented—if we reduce operations on alternating orbits (Option A), we preserve the mission and still capture historic solar physics!",
        advocacyChoice: 'A',
      },
      {
        characterId: 'marcus',
        opinion: "Elena, the power bus is redlining! If our lithium-ion cells suffer thermal runaway, the entire mission is over! We must enter SAFE MODE immediately (Option B/C) to protect the spacecraft's life!",
        advocacyChoice: 'C',
      },
      {
        characterId: 'sterling',
        opinion: "Flight Director, this is what you trained for. Balance scientific ambition with spacecraft survival. Make the executive call.",
        advocacyChoice: 'A',
      },
    ],
  },
  comms_window: {
    eventId: 'comms_window',
    situation: "Planetary occultation is approaching in 42 minutes. Line-of-sight to Earth will be severed, and solid-state data recorders are near capacity.",
    voices: [
      {
        characterId: 'elena',
        opinion: "Overclock the transmitter and dump the raw science data to Earth right now (Option A)! Raw uncompressed data holds the clearest proof of planetary atmosphere and chemistry!",
        advocacyChoice: 'A',
      },
      {
        characterId: 'maya',
        opinion: "Overclocking uses 8 extra Power units and strains our RF amplifiers. Option C uses smart lossless compression—it guarantees 100% data arrival before the horizon cut-off!",
        advocacyChoice: 'C',
      },
      {
        characterId: 'marcus',
        opinion: "Whatever you decide, Director, ensure we leave enough electrical headroom for emergency stabilization thrusters during occultation blackout.",
        advocacyChoice: 'C',
      },
    ],
  },
};
