import { MissionEvent } from '../types/simulation';

export const MISSION_EVENTS: MissionEvent[] = [
  {
    id: 'course_deviation',
    code: 'EVT-01A',
    title: 'COURSE DEVIATION DETECTED',
    systemUnderStress: 'Guidance and Navigation systems indicate a 0.14° drift from nominal transfer vector following gravity assist.',
    description: 'Telemetry confirms trajectory corridor divergence. If uncorrected, atmospheric capture angle at Mars will drift outside nominal entry envelope.',
    triggerStageIndex: 4, // Mid-course cruise
    choices: [
      {
        id: 'correction_burn',
        tag: 'A',
        tagColor: 'emerald',
        label: 'PERFORM CORRECTION BURN',
        fuelDelta: -8,
        riskDelta: -8,
        scienceDelta: 0,
        rationale: 'Execute closed-loop RCS delta-V trimming to realign transfer corridor and eliminate capture dispersion.',
        indicators: [
          { metric: 'Fuel', symbol: '↓↓', tone: 'negative' },
          { metric: 'Risk', symbol: '↓↓', tone: 'positive' },
          { metric: 'Science', symbol: '—', tone: 'neutral' }
        ],
        consequenceTitle: 'TRAJECTORY REALIGNED // BURN CONFIRMED',
        consequenceDescription: 'Propellant margin reduced by 8%, but arrival capture uncertainty has dropped to zero.'
      },
      {
        id: 'maintain_trajectory',
        tag: 'B',
        tagColor: 'amber',
        label: 'MAINTAIN TRAJECTORY',
        fuelDelta: 0,
        riskDelta: +12,
        scienceDelta: 0,
        rationale: 'Preserve all remaining propellant. Spacecraft accepts wider arrival dispersion corridor and elevated orbital capture risk.',
        indicators: [
          { metric: 'Fuel', symbol: '—', tone: 'neutral' },
          { metric: 'Risk', symbol: '↑↑', tone: 'negative' },
          { metric: 'Time', symbol: '↑', tone: 'neutral' }
        ],
        consequenceTitle: 'CORRIDOR UNCERTAINTY ELEVATED',
        consequenceDescription: 'Full propellant reserves preserved, but flight computer warns of increased orbital capture hazard.'
      },
      {
        id: 'cancel_secondary',
        tag: 'C',
        tagColor: 'cyan',
        label: 'CANCEL SECONDARY FLYBY OBJECTIVE',
        fuelDelta: 0,
        riskDelta: -6,
        scienceDelta: -15,
        rationale: 'Jettison intermediate flyby observations to straighten arrival corridor without expending precious propellant.',
        indicators: [
          { metric: 'Science', symbol: '↓↓', tone: 'negative' },
          { metric: 'Risk', symbol: '↓', tone: 'positive' },
          { metric: 'Fuel', symbol: '—', tone: 'neutral' }
        ],
        consequenceTitle: 'SECONDARY TARGET JETTISONED',
        consequenceDescription: 'Intermediate observations abandoned (-15 Science). Straightened cruise path restored safety margins.'
      }
    ]
  },
  {
    id: 'power_deficit',
    code: 'EVT-02B',
    title: 'SOLAR RADIATION STORM & POWER DEFICIT',
    systemUnderStress: 'Severe solar energetic particle flux detected • Dust ablation on array glass dropped bus output by 12%.',
    description: 'Electrical generation capacity is currently insufficient to simultaneously sustain all high-power science instruments and housekeeping avionics.',
    triggerStageIndex: 5, // Deep cruise
    choices: [
      {
        id: 'reduce_ops',
        tag: 'A',
        tagColor: 'emerald',
        label: 'REDUCE INSTRUMENT OPERATIONS',
        fuelDelta: 0,
        riskDelta: -4,
        scienceDelta: -8,
        rationale: 'Cycle high-draw active instruments on alternating orbits. Reduces thermal stress and preserves battery health margin.',
        indicators: [
          { metric: 'Power', symbol: '↑', tone: 'positive' },
          { metric: 'Risk', symbol: '↓↓', tone: 'positive' },
          { metric: 'Science', symbol: '↓', tone: 'negative' }
        ],
        consequenceTitle: 'THERMAL CONSERVATION ENGAGED',
        consequenceDescription: 'Battery reserves protected from deep discharge. Active sensors duty-cycled (-8 Science return).'
      },
      {
        id: 'maintain_full_ops',
        tag: 'B',
        tagColor: 'amber',
        label: 'MAINTAIN FULL OPERATIONS',
        fuelDelta: 0,
        riskDelta: +12,
        scienceDelta: +5,
        rationale: 'Draw secondary Li-ion energy reserves to maintain simultaneous spectrometer and radar sweeps, risking cell degradation.',
        indicators: [
          { metric: 'Science', symbol: '↑↑', tone: 'positive' },
          { metric: 'Power', symbol: '↓↓', tone: 'negative' },
          { metric: 'Risk', symbol: '↑↑', tone: 'negative' }
        ],
        consequenceTitle: 'POWER BUS CRITICALLY STRESSED',
        consequenceDescription: 'Sensors remained online delivering +5 Science, but power reserves plunged into amber margin (+12% Risk).'
      },
      {
        id: 'low_power_mode',
        tag: 'C',
        tagColor: 'cyan',
        label: 'ENTER SAFE-MODE CONSERVATION',
        fuelDelta: 0,
        riskDelta: -5,
        scienceDelta: -12,
        rationale: 'Shut down non-critical scientific subsystems entirely until stable orbital insertion and full sun-pointing lock.',
        indicators: [
          { metric: 'Power', symbol: '↑↑', tone: 'positive' },
          { metric: 'Risk', symbol: '↓↓', tone: 'positive' },
          { metric: 'Science', symbol: '↓↓', tone: 'negative' }
        ],
        consequenceTitle: 'SURVIVAL ORIENTATION LOCKED',
        consequenceDescription: 'Non-vital electronics powered down. Hardware 100% safe, at the expense of -12 Science data.'
      }
    ]
  },
  {
    id: 'comms_window',
    code: 'EVT-03C',
    title: 'COMMUNICATION WINDOW NARROWING',
    systemUnderStress: 'Planetary occultation and Deep Space Network scheduling crunch limit high-speed pass to 42 minutes.',
    description: 'Onboard solid-state data recorder buffer is 88% full. Direct link-budget line-of-sight to Earth will be severed during upcoming occultation.',
    triggerStageIndex: 6, // Target acquisition / Arrival
    choices: [
      {
        id: 'transmit_now',
        tag: 'A',
        tagColor: 'emerald',
        label: 'TRANSMIT MAXIMUM SCIENCE NOW',
        fuelDelta: 0,
        riskDelta: 0,
        scienceDelta: 0,
        powerDelta: -8,
        dataDelta: +10,
        rationale: 'Overclock transmitter amplifier to downlink uncompressed raw radar and imaging sets before line-of-sight is lost.',
        indicators: [
          { metric: 'Data', symbol: '↑↑', tone: 'positive' },
          { metric: 'Power', symbol: '↓↓', tone: 'negative' },
          { metric: 'Risk', symbol: '—', tone: 'neutral' }
        ],
        consequenceTitle: 'RAW TELEMETRY DOWNLINK COMPLETE',
        consequenceDescription: 'Amplifier consumed 8 Power units. All raw multispectral imaging packets received safely on Earth (+10 Data).'
      },
      {
        id: 'wait_window',
        tag: 'B',
        tagColor: 'amber',
        label: 'WAIT FOR NEXT DSN PASS',
        fuelDelta: 0,
        riskDelta: +8,
        scienceDelta: 0,
        rationale: 'Store science data in flash solid-state recorder. Increases risk of memory buffer saturation and thermal degradation.',
        indicators: [
          { metric: 'Power', symbol: '—', tone: 'neutral' },
          { metric: 'Risk', symbol: '↑↑', tone: 'negative' },
          { metric: 'Data', symbol: '—', tone: 'neutral' }
        ],
        consequenceTitle: 'ONBOARD RECORDER BUFFER NEAR CAPACITY',
        consequenceDescription: 'Transmitter powered down, but memory storage reached 94% buffer saturation (+8% Risk).'
      },
      {
        id: 'reduce_package',
        tag: 'C',
        tagColor: 'cyan',
        label: 'COMPRESS & REDUCE DATA PACKAGE',
        fuelDelta: 0,
        riskDelta: -3,
        scienceDelta: 0,
        dataDelta: -5,
        rationale: 'Apply lossy compression algorithms to ensure 100% transmission completion within available ground station pass.',
        indicators: [
          { metric: 'Risk', symbol: '↓', tone: 'positive' },
          { metric: 'Data', symbol: '↓', tone: 'negative' },
          { metric: 'Power', symbol: '—', tone: 'neutral' }
        ],
        consequenceTitle: 'COMPRESSED TELEMETRY DOWNLINK COMPLETE',
        consequenceDescription: 'Transmission completed without packet drop, but lossy compression slightly reduced data fidelity (-5 Data).'
      }
    ]
  }
];
