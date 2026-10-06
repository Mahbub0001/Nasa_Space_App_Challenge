import React from 'react';
import './game.css';

export const LaunchScene: React.FC<{ ignited: boolean; altitudeKm: number }> = ({ ignited, altitudeKm }) => (
  <div className={`launch-scene ${ignited ? 'launch-scene--ignited' : ''}`} aria-label={ignited ? 'Animated rocket ascending above Earth' : 'Rocket ready at launch pad'} role="img">
    <div className="launch-scene__stars" />
    <div className="launch-scene__planet" />
    <div className="launch-scene__rocket">
      <svg viewBox="0 0 160 180" aria-hidden="true">
        <defs><linearGradient id="rocket-body" x1="0" x2="1"><stop stopColor="#95AFC2" /><stop offset=".48" stopColor="#F3F5F2" /><stop offset="1" stopColor="#7B95A8" /></linearGradient></defs>
        <path d="M80 8C52 36 50 76 50 148h60C110 76 108 36 80 8Z" fill="url(#rocket-body)" stroke="#D5E5EB" strokeWidth="3" />
        <path d="M63 25C69 17 75 12 80 8c5 4 11 9 17 17Z" fill="#D68F72" />
        <rect x="50" y="107" width="60" height="14" fill="#31516B" />
        <circle cx="80" cy="70" r="18" fill="#1C435E" stroke="#B7D4E3" strokeWidth="4" />
        <circle cx="80" cy="70" r="10" fill="#83B6CD" opacity=".65" />
        <path d="M50 117 29 171h23l19-30m39-24 21 54h-23l-19-30" fill="#ACBCC9" stroke="#DFE9ED" strokeWidth="2" />
        <path d="M58 148h44l-10 23H68Z" fill="#263848" stroke="#92AEC0" strokeWidth="2" />
        <path className="launch-scene__flame" d="M68 170c-1 19 5 39 12 70 7-31 13-51 12-70-7 12-17 12-24 0Z" fill="#F3B662" />
        <path className="launch-scene__flame-inner" d="M74 174c0 14 3 27 6 47 3-20 6-33 6-47Z" fill="#DDE9E5" />
      </svg>
    </div>
    <div className="launch-scene__ground" />
    <span className="launch-scene__readout">{ignited ? `ASCENT · ${altitudeKm.toLocaleString()} KM` : 'LAUNCH PAD · SYSTEMS READY'}</span>
  </div>
);
