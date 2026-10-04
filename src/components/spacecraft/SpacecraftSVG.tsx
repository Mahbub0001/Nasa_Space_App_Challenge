import React, { useState } from 'react';
import { SpacecraftVisualProps } from '../../types/spacecraft';
import { INSTRUMENTS } from '../../data/instruments';

export const SpacecraftSVG: React.FC<SpacecraftVisualProps> = ({
  propulsion,
  power,
  comms,
  instruments,
  highlightedSubsystem,
  className = '',
  isAnimated = true
}) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const activeHover = highlightedSubsystem || hoveredPart;

  const hasSpectrometer = instruments.includes('spectrometer');
  const hasRadar = instruments.includes('radar');
  const hasImaging = instruments.includes('imaging_system');
  const hasRadiation = instruments.includes('radiation_detector');
  const hasAtmospheric = instruments.includes('atmospheric_sensor');

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-between select-none ${className}`}>
      {/* Subsystem status callout header */}
      <div className="w-full flex items-center justify-between font-mono text-[9px] text-cyan-400 bg-space-950/90 px-2.5 py-1 border border-cyan-500/20 mb-1 shrink-0">
        <span className="text-telemetry-muted">ACTIVE COMPONENT:</span>
        <span className="text-white font-bold uppercase tracking-wider truncate">
          {activeHover || 'INTEGRATED EXPLORER BUS'}
        </span>
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-0 overflow-hidden">
        <svg
          viewBox="0 0 600 500"
          className="w-full h-full max-h-[420px] drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
        <defs>
          {/* Gradients for aerospace surfaces */}
          <linearGradient id="busGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#253748" />
            <stop offset="50%" stopColor="#172430" />
            <stop offset="100%" stopColor="#0F1822" />
          </linearGradient>

          <linearGradient id="solarCellGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0B3C5D" />
            <stop offset="25%" stopColor="#1D5F8A" />
            <stop offset="75%" stopColor="#0E3D60" />
            <stop offset="100%" stopColor="#07243A" />
          </linearGradient>

          <linearGradient id="advancedSolarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0077B6" />
            <stop offset="50%" stopColor="#00B4D8" />
            <stop offset="100%" stopColor="#03045E" />
          </linearGradient>

          <linearGradient id="goldMLI" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="40%" stopColor="#AA7C11" />
            <stop offset="80%" stopColor="#E5C158" />
            <stop offset="100%" stopColor="#8C6207" />
          </linearGradient>

          <linearGradient id="nozzleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A5568" />
            <stop offset="50%" stopColor="#2D3748" />
            <stop offset="100%" stopColor="#1A202C" />
          </linearGradient>

          <radialGradient id="ionGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00B4D8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0077B6" stopOpacity="0" />
          </radialGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ========================================================
            1. PROPULSION SUBSYSTEM (BOTTOM: y = 350 - 450)
            ======================================================== */}
        <g 
          className="transition-all duration-300 cursor-pointer"
          onMouseEnter={() => setHoveredPart(`PROPULSION: ${propulsion.toUpperCase()}`)}
          onMouseLeave={() => setHoveredPart(null)}
        >
          {/* Chemical Propulsion */}
          {propulsion === 'chemical' && (
            <g id="propulsion-chemical">
              {/* Structural Engine Mount */}
              <polygon points="265,340 335,340 325,370 275,370" fill="#243342" stroke="#38BDF8" strokeWidth="1" />
              {/* Main Rocket Nozzle Bell */}
              <path d="M280,370 L260,430 L340,430 L320,370 Z" fill="url(#nozzleGrad)" stroke="#64748B" strokeWidth="1.5" />
              <ellipse cx="300" cy="430" rx="40" ry="8" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
              {/* Gimbal Actuator Struts */}
              <line x1="270" y1="360" x2="265" y2="400" stroke="#94A3B8" strokeWidth="2" />
              <line x1="330" y1="360" x2="335" y2="400" stroke="#94A3B8" strokeWidth="2" />
            </g>
          )}

          {/* Electric Ion Propulsion */}
          {propulsion === 'electric' && (
            <g id="propulsion-electric">
              <rect x="270" y="340" width="60" height="25" fill="#1E293B" stroke="#00D2FF" strokeWidth="1" />
              {/* Dual Hall-Effect Thruster Rings */}
              <circle cx="285" cy="375" r="14" fill="#0F172A" stroke="#00D2FF" strokeWidth="1.5" />
              <circle cx="315" cy="375" r="14" fill="#0F172A" stroke="#00D2FF" strokeWidth="1.5" />
              {/* Xenon Plasma Plume Glow */}
              {isAnimated && (
                <>
                  <ellipse cx="285" cy="398" rx="8" ry="18" fill="url(#ionGlow)" filter="url(#glow)" className="animate-pulse" />
                  <ellipse cx="315" cy="398" rx="8" ry="18" fill="url(#ionGlow)" filter="url(#glow)" className="animate-pulse" />
                </>
              )}
            </g>
          )}

          {/* Hybrid Propulsion (Central nozzle + outboard ion thrusters) */}
          {propulsion === 'hybrid' && (
            <g id="propulsion-hybrid">
              <polygon points="270,340 330,340 322,365 278,365" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
              {/* Central Chemical Nozzle */}
              <path d="M285,365 L272,415 L328,415 L315,365 Z" fill="url(#nozzleGrad)" stroke="#64748B" strokeWidth="1.2" />
              <ellipse cx="300" cy="415" rx="28" ry="6" fill="#0F172A" stroke="#94A3B8" strokeWidth="1" />
              {/* Port & Starboard Ion Pods */}
              <rect x="250" y="350" width="14" height="20" rx="2" fill="#172430" stroke="#00D2FF" strokeWidth="1" />
              <rect x="336" y="350" width="14" height="20" rx="2" fill="#172430" stroke="#00D2FF" strokeWidth="1" />
              {isAnimated && (
                <>
                  <circle cx="257" cy="378" r="5" fill="url(#ionGlow)" filter="url(#glow)" className="animate-pulse" />
                  <circle cx="343" cy="378" r="5" fill="url(#ionGlow)" filter="url(#glow)" className="animate-pulse" />
                </>
              )}
            </g>
          )}
        </g>

        {/* ========================================================
            2. POWER SYSTEM / SOLAR WINGS / RTG (x = 30 - 240, 360 - 570)
            ======================================================== */}
        <g 
          className="transition-all duration-300 cursor-pointer"
          onMouseEnter={() => setHoveredPart(`POWER: ${power.toUpperCase()}`)}
          onMouseLeave={() => setHoveredPart(null)}
        >
          {/* Standard Solar Arrays */}
          {power === 'solar_array' && (
            <g id="power-standard-solar">
              {/* Structural deployment booms */}
              <line x1="240" y1="230" x2="70" y2="230" stroke="#64748B" strokeWidth="3" />
              <line x1="360" y1="230" x2="530" y2="230" stroke="#64748B" strokeWidth="3" />

              {/* Port Wing Panels */}
              <g id="port-solar">
                <rect x="80" y="175" width="150" height="110" rx="1" fill="url(#solarCellGrad)" stroke="#38BDF8" strokeWidth="1.2" />
                {/* Cell Grids */}
                {[1, 2, 3].map(i => (
                  <line key={`pv-p-h-${i}`} x1="80" y1={175 + i * 27.5} x2="230" y2={175 + i * 27.5} stroke="rgba(56,189,248,0.4)" strokeWidth="0.8" />
                ))}
                {[1, 2, 3, 4].map(i => (
                  <line key={`pv-p-v-${i}`} x1={80 + i * 30} y1="175" x2={80 + i * 30} y2="285" stroke="rgba(56,189,248,0.4)" strokeWidth="0.8" />
                ))}
              </g>

              {/* Starboard Wing Panels */}
              <g id="starboard-solar">
                <rect x="370" y="175" width="150" height="110" rx="1" fill="url(#solarCellGrad)" stroke="#38BDF8" strokeWidth="1.2" />
                {[1, 2, 3].map(i => (
                  <line key={`pv-s-h-${i}`} x1="370" y1={175 + i * 27.5} x2="520" y2={175 + i * 27.5} stroke="rgba(56,189,248,0.4)" strokeWidth="0.8" />
                ))}
                {[1, 2, 3, 4].map(i => (
                  <line key={`pv-s-v-${i}`} x1={370 + i * 30} y1="175" x2={370 + i * 30} y2="285" stroke="rgba(56,189,248,0.4)" strokeWidth="0.8" />
                ))}
              </g>
            </g>
          )}

          {/* Advanced Concentrator Solar Arrays (ROSA: Roll-out flexible wings + concentrators) */}
          {power === 'advanced_solar' && (
            <g id="power-advanced-solar">
              {/* Extended dual carbon booms */}
              <line x1="240" y1="215" x2="35" y2="215" stroke="#94A3B8" strokeWidth="2.5" />
              <line x1="240" y1="245" x2="35" y2="245" stroke="#94A3B8" strokeWidth="2.5" />
              <line x1="360" y1="215" x2="565" y2="215" stroke="#94A3B8" strokeWidth="2.5" />
              <line x1="360" y1="245" x2="565" y2="245" stroke="#94A3B8" strokeWidth="2.5" />

              {/* Port Roll-Out Arrays */}
              <rect x="45" y="150" width="185" height="160" fill="url(#advancedSolarGrad)" stroke="#00D2FF" strokeWidth="1.5" />
              {/* Concentrator lenses lines */}
              {[1, 2, 3, 4, 5].map(i => (
                <line key={`rosa-p-h-${i}`} x1="45" y1={150 + i * 26.6} x2="230" y2={150 + i * 26.6} stroke="rgba(0,210,255,0.6)" strokeWidth="1" />
              ))}
              {[1, 2, 3, 4, 5].map(i => (
                <line key={`rosa-p-v-${i}`} x1={45 + i * 30.8} y1="150" x2={45 + i * 30.8} y2="310" stroke="rgba(0,210,255,0.4)" strokeWidth="0.8" />
              ))}

              {/* Starboard Roll-Out Arrays */}
              <rect x="370" y="150" width="185" height="160" fill="url(#advancedSolarGrad)" stroke="#00D2FF" strokeWidth="1.5" />
              {[1, 2, 3, 4, 5].map(i => (
                <line key={`rosa-s-h-${i}`} x1="370" y1={150 + i * 26.6} x2="555" y2={150 + i * 26.6} stroke="rgba(0,210,255,0.6)" strokeWidth="1" />
              ))}
              {[1, 2, 3, 4, 5].map(i => (
                <line key={`rosa-s-v-${i}`} x1={370 + i * 30.8} y1="150" x2={370 + i * 30.8} y2="310" stroke="rgba(0,210,255,0.4)" strokeWidth="0.8" />
              ))}
            </g>
          )}

          {/* Long-Duration Power (RTG Casks + Outrigger Radiator Fins) */}
          {power === 'long_duration_power' && (
            <g id="power-rtg">
              {/* Cantilevered outrigger booms */}
              <line x1="240" y1="230" x2="120" y2="230" stroke="#CBD5E1" strokeWidth="4" />
              <line x1="360" y1="230" x2="480" y2="230" stroke="#CBD5E1" strokeWidth="4" />

              {/* Port RTG Unit */}
              <rect x="100" y="195" width="50" height="70" rx="3" fill="#334155" stroke="#F59E0B" strokeWidth="1.5" />
              {/* Thermal cooling fins */}
              {[1, 2, 3, 4, 5].map(i => (
                <line key={`rtg-p-fin-${i}`} x1="90" y1={200 + i * 10} x2="160" y2={200 + i * 10} stroke="#F59E0B" strokeWidth="1.5" />
              ))}
              <circle cx="125" cy="230" r="8" fill="#F59E0B" opacity="0.3" className="animate-pulse" />

              {/* Starboard RTG Unit */}
              <rect x="450" y="195" width="50" height="70" rx="3" fill="#334155" stroke="#F59E0B" strokeWidth="1.5" />
              {[1, 2, 3, 4, 5].map(i => (
                <line key={`rtg-s-fin-${i}`} x1="440" y1={200 + i * 10} x2="510" y2={200 + i * 10} stroke="#F59E0B" strokeWidth="1.5" />
              ))}
              <circle cx="475" cy="230" r="8" fill="#F59E0B" opacity="0.3" className="animate-pulse" />
            </g>
          )}
        </g>

        {/* ========================================================
            3. CENTRAL BUS / CHASSIS (x = 240 - 360, y = 140 - 340)
            ======================================================== */}
        <g 
          id="spacecraft-bus" 
          className="cursor-pointer"
          onMouseEnter={() => setHoveredPart('AVIONICS BUS & STRUCTURAL CHASSIS')}
          onMouseLeave={() => setHoveredPart(null)}
        >
          {/* Main Octagonal Primary Structure */}
          <polygon
            points="260,140 340,140 360,180 360,300 340,340 260,340 240,300 240,180"
            fill="url(#busGrad)"
            stroke="#38BDF8"
            strokeWidth="1.8"
          />

          {/* Gold MLI (Multi-Layer Insulation) Core Panel */}
          <rect x="260" y="180" width="80" height="120" fill="url(#goldMLI)" opacity="0.85" stroke="#B45309" strokeWidth="1" />

          {/* Structural Stiffener Grid */}
          <line x1="260" y1="220" x2="340" y2="220" stroke="#78350F" strokeWidth="1" />
          <line x1="260" y1="260" x2="340" y2="260" stroke="#78350F" strokeWidth="1" />
          <line x1="300" y1="180" x2="300" y2="300" stroke="#78350F" strokeWidth="1" />

          {/* Reaction Wheels Compartment Indicator */}
          <circle cx="300" cy="240" r="14" fill="#1E293B" stroke="#00D2FF" strokeWidth="1" />
          <circle cx="300" cy="240" r="6" fill="#0284C7" />

          {/* Star Tracker Sensors (Attitude Determination) */}
          <circle cx="250" cy="190" r="3" fill="#E2E8F0" stroke="#00D2FF" strokeWidth="1" />
          <circle cx="250" cy="210" r="3" fill="#E2E8F0" stroke="#00D2FF" strokeWidth="1" />

          {/* Technical Identification Label */}
          <text x="300" y="325" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="IBM Plex Mono" letterSpacing="2">
            AURORA-01
          </text>
        </g>

        {/* ========================================================
            4. COMMUNICATION ANTENNA SUBSYSTEM (TOP: y = 40 - 140)
            ======================================================== */}
        <g 
          className="transition-all duration-300 cursor-pointer"
          onMouseEnter={() => setHoveredPart(`COMMUNICATION: ${comms.toUpperCase()}`)}
          onMouseLeave={() => setHoveredPart(null)}
        >
          {/* Standard Medium-Gain Horn Antenna */}
          {comms === 'standard' && (
            <g id="comms-standard">
              <line x1="300" y1="140" x2="300" y2="90" stroke="#94A3B8" strokeWidth="3" />
              {/* Compact dish */}
              <path d="M270,90 Q300,115 330,90" fill="none" stroke="#E2E8F0" strokeWidth="2.5" />
              <line x1="300" y1="102" x2="300" y2="75" stroke="#38BDF8" strokeWidth="1.5" />
              <circle cx="300" cy="74" r="3" fill="#38BDF8" />
            </g>
          )}

          {/* High-Gain Steerable Reflector */}
          {comms === 'high_gain' && (
            <g id="comms-high-gain">
              {/* Gimbal mount structure */}
              <line x1="300" y1="140" x2="300" y2="95" stroke="#64748B" strokeWidth="3.5" />
              <circle cx="300" cy="95" r="5" fill="#334155" stroke="#38BDF8" strokeWidth="1.5" />
              {/* Steerable 2.4m Parabolic Dish */}
              <ellipse cx="300" cy="65" rx="50" ry="16" fill="#1E293B" stroke="#00D2FF" strokeWidth="2" />
              {/* Feed horn subreflector */}
              <path d="M280,65 L300,38 L320,65" stroke="#94A3B8" strokeWidth="1.2" />
              <circle cx="300" cy="38" r="4" fill="#00D2FF" />
            </g>
          )}

          {/* Deep-Space Optical & High-Gain Hybrid Dish */}
          {comms === 'deep_space' && (
            <g id="comms-deep-space">
              {/* Heavy tripod mast */}
              <line x1="285" y1="140" x2="300" y2="90" stroke="#94A3B8" strokeWidth="2.5" />
              <line x1="315" y1="140" x2="300" y2="90" stroke="#94A3B8" strokeWidth="2.5" />
              <circle cx="300" cy="90" r="6" fill="#1E293B" stroke="#00D2FF" strokeWidth="2" />
              {/* Large 3.5m Deployable High-Frequency Parabolic Dish */}
              <ellipse cx="300" cy="55" rx="75" ry="22" fill="#0F172A" stroke="#00D2FF" strokeWidth="2.5" />
              {/* Internal mesh radial ribs */}
              {[-50, -25, 0, 25, 50].map((dx, idx) => (
                <line key={`dish-rib-${idx}`} x1="300" y1="55" x2={300 + dx} y2={45 + Math.abs(dx) * 0.1} stroke="rgba(0,210,255,0.4)" strokeWidth="1" />
              ))}
              {/* Cassegrain Sub-Reflector Feed Horn & Optical Laser Pointer */}
              <path d="M275,55 L300,22 L325,55" stroke="#CBD5E1" strokeWidth="1.5" />
              <circle cx="300" cy="22" r="5" fill="#00D2FF" filter="url(#glow)" />
              {/* Optical Laser Communication Emitter Glow */}
              {isAnimated && (
                <line x1="300" y1="20" x2="300" y2="2" stroke="#00D2FF" strokeWidth="2" strokeDasharray="3 3" className="animate-pulse" />
              )}
            </g>
          )}
        </g>

        {/* ========================================================
            5. SCIENTIFIC INSTRUMENT PAYLOAD MODULES
            ======================================================== */}
        
        {/* Bow Bay: High-Resolution Imaging System (Forward Camera Aperture) */}
        {hasImaging && (
          <g 
            id="inst-imaging" 
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPart('INSTRUMENT: HIGH-RESOLUTION MULTISPECTRAL IMAGER')}
            onMouseLeave={() => setHoveredPart(null)}
          >
            <rect x="282" y="142" width="36" height="24" rx="2" fill="#0F172A" stroke="#00D2FF" strokeWidth="1.5" />
            <circle cx="300" cy="154" r="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="300" cy="154" r="4" fill="#0284C7" />
            {/* Imager Callout Line */}
            <line x1="318" y1="154" x2="360" y2="120" stroke="#00D2FF" strokeWidth="1" strokeDasharray="2 2" />
            <text x="365" y="122" fill="#00D2FF" fontSize="9" fontFamily="IBM Plex Mono">IMAGER</text>
          </g>
        )}

        {/* Port Bay: Infrared & UV Spectrometer Suite */}
        {hasSpectrometer && (
          <g 
            id="inst-spectrometer" 
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPart('INSTRUMENT: IR/UV SPECTROMETER')}
            onMouseLeave={() => setHoveredPart(null)}
          >
            <polygon points="240,210 220,218 220,242 240,250" fill="#1E293B" stroke="#00D2FF" strokeWidth="1.5" />
            <line x1="225" y1="225" x2="225" y2="235" stroke="#38BDF8" strokeWidth="2" />
            {/* Spectrometer Callout */}
            <line x1="220" y1="230" x2="175" y2="210" stroke="#00D2FF" strokeWidth="1" strokeDasharray="2 2" />
            <text x="110" y="210" fill="#00D2FF" fontSize="9" fontFamily="IBM Plex Mono">SPECTROMETER</text>
          </g>
        )}

        {/* Ventral Bay: Subsurface Sounding Radar (Deployable Dipole Antennas) */}
        {hasRadar && (
          <g 
            id="inst-radar" 
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPart('INSTRUMENT: SUBSURFACE SYNTHETIC APERTURE RADAR')}
            onMouseLeave={() => setHoveredPart(null)}
          >
            <rect x="270" y="325" width="60" height="12" fill="#0F172A" stroke="#00D2FF" strokeWidth="1.2" />
            {/* Long radar dipole booms */}
            <line x1="270" y1="331" x2="130" y2="350" stroke="#00D2FF" strokeWidth="2" />
            <line x1="330" y1="331" x2="470" y2="350" stroke="#00D2FF" strokeWidth="2" />
            <circle cx="130" cy="350" r="3" fill="#00D2FF" />
            <circle cx="470" cy="350" r="3" fill="#00D2FF" />
            {/* Radar Callout */}
            <line x1="470" y1="350" x2="505" y2="375" stroke="#00D2FF" strokeWidth="1" strokeDasharray="2 2" />
            <text x="510" y="378" fill="#00D2FF" fontSize="9" fontFamily="IBM Plex Mono">RADAR DIPOLE</text>
          </g>
        )}

        {/* Starboard Bay: Radiation Particle Detector */}
        {hasRadiation && (
          <g 
            id="inst-radiation" 
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPart('INSTRUMENT: RADIATION DETECTOR')}
            onMouseLeave={() => setHoveredPart(null)}
          >
            <rect x="360" y="215" width="20" height="30" fill="#1E293B" stroke="#00D2FF" strokeWidth="1.5" />
            <circle cx="370" cy="230" r="5" fill="#F59E0B" opacity="0.8" />
            {/* Radiation Callout */}
            <line x1="380" y1="230" x2="435" y2="230" stroke="#00D2FF" strokeWidth="1" strokeDasharray="2 2" />
            <text x="440" y="233" fill="#00D2FF" fontSize="9" fontFamily="IBM Plex Mono">RAD-SENSOR</text>
          </g>
        )}

        {/* Dorsal Bay: Atmospheric Sounder & Mass Spectrometer */}
        {hasAtmospheric && (
          <g 
            id="inst-atmospheric" 
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPart('INSTRUMENT: ATMOSPHERIC SOUNDER')}
            onMouseLeave={() => setHoveredPart(null)}
          >
            <polygon points="260,170 245,160 245,180" fill="#1E293B" stroke="#00D2FF" strokeWidth="1.5" />
            {/* Atmospheric Callout */}
            <line x1="245" y1="170" x2="190" y2="155" stroke="#00D2FF" strokeWidth="1" strokeDasharray="2 2" />
            <text x="135" y="157" fill="#00D2FF" fontSize="9" fontFamily="IBM Plex Mono">ATMO-SOUNDER</text>
          </g>
        )}
      </svg>
      </div>

      {/* Installed Payload Count Bar */}
      <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-telemetry-muted">
        <span>PAYLOAD BAYS ({instruments.length}/5):</span>
        <div className="flex items-center gap-1">
          {INSTRUMENTS.map((inst) => {
            const isInstalled = instruments.includes(inst.id);
            return (
              <span
                key={inst.id}
                className={`px-1.5 py-0.5 border text-[9px] ${
                  isInstalled
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                    : 'bg-space-950/40 text-telemetry-dim border-white/5'
                }`}
                title={`${inst.name}: ${isInstalled ? 'Installed' : 'Empty'}`}
              >
                {inst.id.substring(0, 3).toUpperCase()}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
