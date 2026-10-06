import React, { useEffect, useState } from 'react';
import { Radio, Volume2, Sparkles, ChevronRight, X } from 'lucide-react';
import { Character, CHARACTERS } from '../../data/characters';
import { sound } from '../../utils/sound';
import { AnimatedGuide } from './AnimatedGuide';

export interface FlightCommsHUDProps {
  characterId: 'sterling' | 'elena' | 'marcus' | 'maya';
  message: string;
  nasaFact?: string;
  tone?: 'inspirational' | 'caution' | 'urgent' | 'excited' | 'proud';
  onNext?: () => void;
  onDismiss?: () => void;
  autoPlayAudio?: boolean;
  className?: string;
}

export const FlightCommsHUD: React.FC<FlightCommsHUDProps> = ({
  characterId,
  message,
  nasaFact,
  tone = 'inspirational',
  onNext,
  onDismiss,
  autoPlayAudio = true,
  className = '',
}) => {
  const character: Character = CHARACTERS[characterId] || CHARACTERS.sterling;
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Sound and typing effect
  useEffect(() => {
    if (autoPlayAudio) {
      sound.playQuindar(true);
    }
    setDisplayText('');
    setIsTyping(true);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < message.length) {
        setDisplayText(message.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [message, autoPlayAudio]);

  const getToneBadge = () => {
    switch (tone) {
      case 'urgent':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">Critical Advisory</span>;
      case 'caution':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">Engineering Caution</span>;
      case 'excited':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Science Opportunity</span>;
      case 'proud':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">Flight Ops Verified</span>;
      default:
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">Mission Directive</span>;
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950/95 backdrop-blur-md shadow-2xl transition-all duration-300 ${className}`}
      style={{
        boxShadow: `0 8px 32px -4px rgba(0,0,0,0.8), 0 0 20px -2px ${character.accentBg}`,
      }}
    >
      {/* Header telemetry stripe */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60 text-xs">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: character.themeColor }}></span>
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: character.themeColor }}></span>
          </div>
          <span className="font-mono tracking-wider text-slate-300 font-semibold text-[11px] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-slate-400" />
            COMM-LINK // {character.callsign}
          </span>
          <span className="text-slate-600 font-mono">|</span>
          <span className="text-[10px] font-mono text-slate-400">AURORA GROUND LINK</span>
        </div>

        <div className="flex items-center gap-2">
          {getToneBadge()}
          {/* Animated audio waveform bars */}
          <div className="flex items-end gap-0.5 h-3 px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">
            <span className={`w-0.5 bg-cyan-400 rounded-full ${isTyping ? 'animate-pulse h-3' : 'h-1.5'}`}></span>
            <span className={`w-0.5 bg-cyan-400 rounded-full ${isTyping ? 'animate-pulse delay-75 h-2.5' : 'h-2'}`}></span>
            <span className={`w-0.5 bg-cyan-400 rounded-full ${isTyping ? 'animate-pulse delay-150 h-3' : 'h-1'}`}></span>
            <span className={`w-0.5 bg-cyan-400 rounded-full ${isTyping ? 'animate-pulse delay-100 h-2' : 'h-2.5'}`}></span>
          </div>

          {onDismiss && (
            <button
              onClick={onDismiss}
              aria-label="Close comms"
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main comms content */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-start">
        {/* Character Portrait Badge */}
        <div className="flex sm:flex-col items-center gap-3 shrink-0">
          <AnimatedGuide character={character} speaking={isTyping} />

          <div className="text-left sm:text-center">
            <div className="font-semibold text-xs text-slate-100 tracking-tight leading-tight">{character.name}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{character.role}</div>
            <div className="text-[9px] text-slate-500 font-mono truncate max-w-[130px]">{character.organization}</div>
          </div>
        </div>

        {/* Message and Educational Fact */}
        <div className="flex-1 min-w-0">
          <div className="text-slate-100 text-sm md:text-base leading-relaxed font-normal selection:bg-cyan-500/30">
            {displayText}
            {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-cyan-400 animate-pulse align-middle"></span>}
          </div>

          {/* NASA Educational Fact Card (Inspiring children & future astronauts) */}
          {nasaFact && (
            <div className="mt-3.5 p-3 rounded-lg border border-sky-900/40 bg-sky-950/30 flex items-start gap-2.5">
              <div className="p-1 rounded bg-sky-500/10 text-sky-400 shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-mono uppercase tracking-wider text-sky-300 font-bold flex items-center gap-1.5">
                  Space science note
                </div>
                <p className="text-xs text-sky-100/90 leading-relaxed mt-0.5">
                  {nasaFact}
                </p>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <button
              onClick={() => sound.playQuindar(false)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-mono transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Replay Quindar
            </button>

            {onNext && (
              <button
                onClick={() => {
                  sound.playClick();
                  onNext();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-md active:scale-95"
                style={{
                  backgroundColor: character.themeColor,
                  color: '#0f172a',
                }}
              >
                <span>Continue Briefing</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
