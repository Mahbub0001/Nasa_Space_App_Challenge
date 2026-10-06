import React, { useState } from 'react';
import type { DestinationId } from '../../types/mission';
import { Check, MapPin, Radio, Satellite } from 'lucide-react';
import './game.css';

interface MissionJourneyProps {
  destinationId: DestinationId;
  progressPct: number;
  isPlaying?: boolean;
  decisions?: number;
  courseChoice?: string;
  compact?: boolean;
}

const WAYPOINTS = [
  { at: 0, name: 'Departure', detail: 'Earth orbit checkout and transfer injection' },
  { at: 25, name: 'Deep space', detail: 'Cruise navigation and power management' },
  { at: 50, name: 'Course correction', detail: 'Reassess the trajectory and propellant reserve' },
  { at: 75, name: 'Approach', detail: 'Prepare communications and arrival systems' },
  { at: 100, name: 'Arrival', detail: 'Begin the science campaign' },
];

const targetNames: Record<DestinationId, string> = {
  lunar_orbit: 'Moon',
  mars: 'Mars',
  asteroid_belt: 'Asteroid belt',
};

function pointAt(percent: number, courseChoice?: string) {
  const t = Math.max(0, Math.min(1, percent / 100));
  const mt = 1 - t;
  const secondControlY = courseChoice === 'maintain_trajectory' ? 425 : courseChoice === 'cancel_secondary' ? 325 : 397;
  return {
    x: mt ** 3 * 135 + 3 * mt ** 2 * t * 316 + 3 * mt * t ** 2 * 591 + t ** 3 * 790,
    y: mt ** 3 * 278 + 3 * mt ** 2 * t * 29 + 3 * mt * t ** 2 * secondControlY + t ** 3 * 166,
  };
}

const stars = Array.from({ length: 48 }, (_, i) => ({
  x: (i * 193 + 53) % 920,
  y: (i * 107 + 61) % 420,
  radius: i % 6 === 0 ? 1.5 : 0.7,
  delay: `${(i % 9) * -0.4}s`,
}));

export const MissionJourney: React.FC<MissionJourneyProps> = ({ destinationId, progressPct, isPlaying = false, decisions = 0, courseChoice, compact = false }) => {
  const [selectedWaypoint, setSelectedWaypoint] = useState<number | null>(null);
  const point = pointAt(progressPct, courseChoice);
  const next = pointAt(Math.min(100, progressPct + 0.3), courseChoice);
  const heading = Math.atan2(next.y - point.y, next.x - point.x) * 180 / Math.PI;
  const target = targetNames[destinationId];
  const activeWaypoint = WAYPOINTS.reduce((index, waypoint, current) => progressPct >= waypoint.at ? current : index, 0);
  const selected = selectedWaypoint === null ? activeWaypoint : selectedWaypoint;
  const path = `M135 278 C316 29 591 ${courseChoice === 'maintain_trajectory' ? 425 : courseChoice === 'cancel_secondary' ? 325 : 397} 790 166`;
  const routeColor = courseChoice === 'maintain_trajectory' ? '#F4AE82' : '#B2CCE2';

  return (
    <div className={`mission-journey ${compact ? 'mission-journey--compact' : ''}`} aria-label={`${target} mission journey, ${Math.round(progressPct)} percent complete`}>
      <div className="mission-journey__sky" />
      <svg viewBox="0 0 920 420" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Animated path from Earth to ${target}`}>
        <defs>
          <linearGradient id="journey-line" x1="0" y1="1" x2="1" y2="0">
            <stop stopColor="#7BB4CF" /><stop offset=".58" stopColor="#B2CCE2" /><stop offset="1" stopColor="#E1A785" />
          </linearGradient>
          <radialGradient id="journey-earth" cx="32%" cy="29%" r="76%">
            <stop stopColor="#69B4D6" /><stop offset=".53" stopColor="#206891" /><stop offset="1" stopColor="#10283E" />
          </radialGradient>
          <radialGradient id="journey-target" cx="27%" cy="25%" r="78%">
            <stop stopColor={destinationId === 'lunar_orbit' ? '#E3DFCF' : destinationId === 'mars' ? '#DC916F' : '#BCA692'} />
            <stop offset=".6" stopColor={destinationId === 'lunar_orbit' ? '#858F96' : destinationId === 'mars' ? '#9B4C3C' : '#71675E'} />
            <stop offset="1" stopColor="#242733" />
          </radialGradient>
          <filter id="journey-glow"><feGaussianBlur stdDeviation="7" /></filter>
        </defs>
        {stars.map((star, i) => <circle key={i} className="mission-journey__star" cx={star.x} cy={star.y} r={star.radius} fill="#D9E9F4" style={{ animationDelay: star.delay }} />)}
        <circle cx="135" cy="278" r="126" fill="none" stroke="#9ACDE7" strokeOpacity=".07" />
        <circle cx="790" cy="166" r="135" fill="none" stroke="#E9B697" strokeOpacity=".08" />
        <path d={path} fill="none" stroke="#86A9C4" strokeOpacity=".22" strokeWidth="2" strokeDasharray="5 9" />
        <path d={path} fill="none" stroke={routeColor} strokeWidth="4" strokeLinecap="round" pathLength="100" strokeDasharray={`${Math.max(0, progressPct)} 100`} />
        <circle cx="135" cy="278" r="74" fill="#277BA9" opacity=".13" filter="url(#journey-glow)" />
        <circle cx="135" cy="278" r="54" fill="url(#journey-earth)" />
        <path d="M110 254c8 3 9 12 20 10l12 8-7 10-20-5-10 8m44-37c-3 10-18 8-17 19l13 8 15-6m-45 40 10 12 11-7" fill="#6EA990" opacity=".7" />
        <circle cx="790" cy="166" r="82" fill="#A75B46" opacity=".15" filter="url(#journey-glow)" />
        <circle cx="790" cy="166" r="58" fill="url(#journey-target)" />
        <circle cx="773" cy="148" r="7" fill="#503B3D" opacity=".22" />
        <circle cx="808" cy="178" r="12" fill="#503B3D" opacity=".16" />
        {WAYPOINTS.slice(1, 4).map((waypoint, index) => {
          const p = pointAt(waypoint.at, courseChoice);
          return <g key={waypoint.at}><circle cx={p.x} cy={p.y} r="10" fill="#122331" stroke={progressPct >= waypoint.at ? '#BCD5E3' : '#526B7E'} strokeWidth="2" /><text x={p.x} y={p.y + 3.5} textAnchor="middle" fill="#D4E3EA" fontSize="11">{index + 2}</text></g>;
        })}
        <g transform={`translate(${point.x} ${point.y}) rotate(${heading})`} className={isPlaying ? 'mission-journey__probe mission-journey__probe--flying' : 'mission-journey__probe'}>
          <circle r="29" fill="#B4D6EF" opacity=".13" filter="url(#journey-glow)" />
          <path d="M-31-11h19v22h-19zm43 0h19v22H12z" fill="#23466A" stroke="#8FB3CE" strokeWidth="2" />
          <path d="M-29-6h15m-15 6h15m-15 6h15m29-12h15m-15 6h15m-15 6h15" stroke="#82AACA" strokeWidth="1" />
          <rect x="-12" y="-14" width="24" height="28" rx="4" fill="#B29459" stroke="#E2C685" strokeWidth="2" />
          <path d="M-12-5h24M-12 6h24" stroke="#6D5B3F" />
          <path d="M8-11l15-9" stroke="#D2E0E7" strokeWidth="2" /><circle cx="23" cy="-20" r="6" fill="none" stroke="#D2E0E7" strokeWidth="2" />
          {isPlaying && <path className="mission-journey__thruster" d="M-13-4l-15 4 15 4" fill="#7FD3EF" opacity=".7" />}
        </g>
      </svg>
      <div className="mission-journey__top"><span><Satellite size={14} /> Aurora / flight path</span><span><Radio size={13} /> {isPlaying ? 'In transit' : 'Holding'}</span></div>
      <div className="mission-journey__bottom"><span>Earth</span><span>{target}</span></div>
      {!compact && <div className="mission-journey__waypoints" aria-label="Journey milestones">
        {WAYPOINTS.map((waypoint, index) => <button key={waypoint.at} type="button" className={index === selected ? 'is-selected' : ''} onClick={() => setSelectedWaypoint(index)} aria-pressed={index === selected}>
          <span>{progressPct >= waypoint.at ? <Check size={12} /> : index + 1}</span>{waypoint.name}
        </button>)}
      </div>}
      {!compact && <div className="mission-journey__detail"><MapPin size={15} /><div><strong>{WAYPOINTS[selected].name}</strong><p>{WAYPOINTS[selected].detail}</p></div><span>{Math.round(progressPct)}%</span></div>}
      {!compact && decisions > 0 && <div className="mission-journey__decisions">{courseChoice === 'maintain_trajectory' ? 'Trajectory risk elevated' : courseChoice === 'correction_burn' ? 'Course corrected' : courseChoice === 'cancel_secondary' ? 'Secondary objective cancelled' : `${decisions} flight decision${decisions === 1 ? '' : 's'} logged`}</div>}
    </div>
  );
};
