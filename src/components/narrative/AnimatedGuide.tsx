import React from 'react';
import type { Character } from '../../data/characters';
import '../simulation/game.css';

interface AnimatedGuideProps {
  character: Character;
  speaking?: boolean;
  compact?: boolean;
}

const appearances: Record<Character['id'], { skin: string; hair: string; jacket: string; shirt: string }> = {
  sterling: { skin: '#BD8B6B', hair: '#C5C9C9', jacket: '#344C64', shirt: '#DCE9EC' },
  elena: { skin: '#A96C4D', hair: '#25212B', jacket: '#487A71', shirt: '#DCE9EC' },
  marcus: { skin: '#704A3D', hair: '#242832', jacket: '#576A83', shirt: '#D9E5E9' },
  maya: { skin: '#D7A27F', hair: '#24202A', jacket: '#5F567C', shirt: '#E2E7F1' },
};

export const AnimatedGuide: React.FC<AnimatedGuideProps> = ({ character, speaking = false, compact = false }) => {
  const appearance = appearances[character.id];
  return (
    <div className={`guide-portrait ${compact ? 'guide-portrait--compact' : ''}`} aria-label={`${character.name}, animated mission guide`} role="img">
      <svg viewBox="0 0 180 180" aria-hidden="true">
        <defs>
          <radialGradient id={`guide-bg-${character.id}`} cx="50%" cy="30%" r="75%">
            <stop stopColor={character.themeColor} stopOpacity=".28" />
            <stop offset="1" stopColor="#0B1723" />
          </radialGradient>
          <linearGradient id={`guide-jacket-${character.id}`} x1="0" x2="1" y1="0" y2="1">
            <stop stopColor={appearance.jacket} />
            <stop offset="1" stopColor="#1E2A3A" />
          </linearGradient>
        </defs>
        <rect width="180" height="180" rx="24" fill={`url(#guide-bg-${character.id})`} />
        <circle cx="90" cy="74" r="62" fill="none" stroke={character.themeColor} strokeOpacity=".24" />
        <path d="M24 180c4-46 31-64 66-64s62 18 66 64" fill={`url(#guide-jacket-${character.id})`} />
        <path d="M68 121l22 33 22-33-13-5H81z" fill={appearance.shirt} />
        <path d="M80 111v18l10 13 10-13v-18" fill={appearance.skin} />
        <g className="guide-breathe">
          <ellipse cx="90" cy="74" rx="34" ry="43" fill={appearance.skin} />
          <path d="M56 76C52 47 65 27 89 26c29-1 40 20 36 50-3-13-7-18-13-25-10 7-26 9-49 7-2 6-4 12-7 18Z" fill={appearance.hair} />
          {character.id === 'elena' || character.id === 'maya' ? <path d="M56 67c-8 24-5 43 2 53l8-6-2-51M124 65c9 24 5 43-2 54l-8-6 1-50" fill={appearance.hair} /> : null}
          <path d="M70 81h14M97 81h14" stroke="#3F3332" strokeWidth="2.4" strokeLinecap="round" />
          <g className="guide-eyes">
            <ellipse cx="77" cy="82" rx="3" ry="3.6" fill="#1B2630" />
            <ellipse cx="104" cy="82" rx="3" ry="3.6" fill="#1B2630" />
          </g>
          <path d="M90 83l-3 15 6 2" stroke="#765447" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path className={speaking ? 'guide-mouth-speaking' : ''} d="M79 109c8 6 16 6 23 0" stroke="#673E3F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
        <path d="M41 178c6-18 12-31 21-41l13 20 15-15 15 15 13-20c9 10 15 23 21 41" fill="none" stroke={character.themeColor} strokeOpacity=".45" strokeWidth="2" />
        <circle cx="139" cy="144" r="8" fill="#142532" stroke={character.themeColor} strokeWidth="2" />
        <path d="M136 144h6m-3-3v6" stroke={character.themeColor} strokeWidth="1.5" />
      </svg>
      <span className="guide-portrait__signal" style={{ backgroundColor: character.themeColor }} />
    </div>
  );
};
