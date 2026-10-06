import React, { useState } from 'react';
import { 
  Printer, 
  ArrowRight 
} from 'lucide-react';
import { useMission } from '../../hooks/useMission';
import { generateDiscoveries, calculateTotalDiscoveryScore } from '../../simulation/discoveryGame';
import { CHARACTERS } from '../../data/characters';
import { AnimatedGuide } from '../../components/narrative/AnimatedGuide';
import { sound } from '../../utils/sound';
import './discovery.css';

export const DiscoveryScreen: React.FC = () => {
  const { config, setPhase, resources } = useMission();
  const [selectedDiscoveryId, setSelectedDiscoveryId] = useState<string | null>(null);

  const targetName = config.destinationId === 'mars' ? 'Mars' : config.destinationId === 'lunar_orbit' ? 'the Moon' : 'the Asteroid';
  const targetNoun = config.destinationId === 'mars' ? 'Martian' : config.destinationId === 'lunar_orbit' ? 'Lunar' : 'Asteroidal';

  const discoveries = generateDiscoveries(config, 'jezero', 3);
  const totalDiscoveryScore = calculateTotalDiscoveryScore(discoveries);

  const handlePrintCertificate = () => {
    sound.playClick();
    window.print();
  };

  const handleProceedToDebrief = () => {
    sound.playSuccess();
    setPhase('results');
  };

  return (
    <main className="discovery-screen">
      {/* Header */}
      <header className="discovery-screen__header">
        <span className="discovery-screen__eyebrow">
          PHASE 07 · NASA ASTROBIOLOGY & PLANETARY SCIENCE LABORATORY
        </span>
        <h1>Scientific Discoveries · {targetName}</h1>
        <p>
          Returned telemetry packets and surface reconnaissance data have been decoded by NASA ground stations. 
          Each instrument payload you selected has unlocked breakthroughs advancing humanity’s scientific frontier.
        </p>
      </header>

      {/* Summary KPI Cards */}
      <div className="discovery-summary">
        <div className="discovery-summary__card">
          <span>INSTRUMENT PAYLOADS</span>
          <strong>{discoveries.length} / {discoveries.length} DECODED</strong>
        </div>
        <div className="discovery-summary__card">
          <span>TOTAL SCIENCE YIELD</span>
          <strong className="text-[#73d9bc]">+{totalDiscoveryScore} POINTS</strong>
        </div>
        <div className="discovery-summary__card">
          <span>MISSION CLASSIFICATION</span>
          <strong className="text-amber-300">CLASS-A BREAKTHROUGH</strong>
        </div>
        <div className="discovery-summary__card">
          <span>TARGET DESTINATION</span>
          <strong className="text-sky-300">{targetName.toUpperCase()}</strong>
        </div>
      </div>

      {/* Crew Insight */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-[#122b3e] to-[#0a1826] border border-[#2c4e69] flex items-center gap-3.5 mb-6">
        <AnimatedGuide character={CHARACTERS.elena} speaking compact mood="relieved" />
        <div className="flex-1">
          <strong className="block text-xs font-semibold text-slate-200">
            {CHARACTERS.elena.name} · Lead Mission Scientist
          </strong>
          <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
            "The data returned from {targetName} has exceeded our highest expectations. 
            The instrument configuration you engineered proved remarkably resilient, capturing unprecedented high-fidelity evidence."
          </p>
        </div>
      </div>

      {/* Discovery Cards Grid */}
      <div className="discovery-grid">
        {discoveries.map(disc => {
          const isSelected = selectedDiscoveryId === disc.id;
          return (
            <div
              key={disc.id}
              onClick={() => {
                sound.playClick();
                setSelectedDiscoveryId(isSelected ? null : disc.id);
              }}
              className={`discovery-card cursor-pointer ${isSelected ? 'ring-2 ring-sky-400' : ''}`}
            >
              <div>
                <div className="discovery-card__top">
                  <span className="discovery-card__inst">{disc.instrumentName}</span>
                  <span
                    className={`discovery-card__rarity ${
                      disc.rarity === 'Historic'
                        ? 'discovery-card__rarity--historic'
                        : disc.rarity === 'Breakthrough'
                        ? 'discovery-card__rarity--breakthrough'
                        : 'discovery-card__rarity--common'
                    }`}
                  >
                    {disc.rarity}
                  </span>
                </div>
                <h3>{disc.title}</h3>
                <p className="discovery-card__headline">{disc.headline}</p>

                <div className="discovery-card__details">
                  <p>
                    <strong>EVIDENCE:</strong> {disc.evidence}
                  </p>
                  <p className="mt-2">
                    <strong>IMPACT:</strong> {disc.scientificImpact}
                  </p>
                </div>
              </div>

              <div className="discovery-card__footer">
                <span className="text-slate-400 font-mono text-[10px]">VERIFIED {disc.unlockedAt}</span>
                <span className="discovery-card__score">+{disc.sciencePoints} SCIENCE</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official NASA Mission Certificate */}
      <section className="nasa-certificate" aria-label="Official Mission Certificate">
        <div className="nasa-certificate__border" />
        <div className="nasa-certificate__header">
          <span className="nasa-certificate__seal">
            NATIONAL AERONAUTICS AND SPACE ADMINISTRATION · SPACE APPS CHALLENGE
          </span>
          <h2 className="nasa-certificate__title">
            CERTIFICATE OF PLANETARY DISCOVERY
          </h2>
          <p className="nasa-certificate__subtitle">
            PROJECT AURORA · {targetNoun.toUpperCase()} EXPLORATION INITIATIVE
          </p>
        </div>

        <div className="nasa-certificate__body">
          <p>
            This certifies that the flight director and engineering team of spacecraft <strong>AURORA-X1</strong> have 
            successfully navigated deep-space transit, executed precision orbital capture, and gathered historic scientific evidence at 
            <strong> {targetName.toUpperCase()}</strong>.
          </p>

          <div className="nasa-certificate__highlights">
            {discoveries.map(disc => (
              <div key={disc.id} className="nasa-certificate__item">
                <strong>{disc.title}</strong>
                <p>{disc.headline}</p>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 font-mono mt-4">
            FLIGHT ID: MF-2045-AURORA · PROPULSION: {config.propulsionId.toUpperCase()} · POWER: {config.powerSystemId.replace(/_/g, ' ').toUpperCase()} · TOTAL SCIENCE: {resources.scienceScore + totalDiscoveryScore} PTS
          </p>
        </div>

        <div className="nasa-certificate__signatures">
          <div className="nasa-certificate__sig">
            <strong>Cmdr. Marcus Reed</strong>
            <span>Flight Director, Mission Forge</span>
          </div>
          <div className="nasa-certificate__sig">
            <strong>Dr. Elena Vance</strong>
            <span>Lead Scientist, Astrobiology Division</span>
          </div>
          <div className="nasa-certificate__sig">
            <strong>Maya Chen</strong>
            <span>Deep Space Network Lead</span>
          </div>
        </div>
      </section>

      {/* Bottom Action Buttons */}
      <div className="discovery-actions">
        <button
          type="button"
          onClick={handlePrintCertificate}
          className="discovery-actions__print"
        >
          <Printer className="w-4 h-4" /> PRINT / SAVE OFFICIAL CERTIFICATE
        </button>
        <button
          type="button"
          onClick={handleProceedToDebrief}
          className="discovery-actions__next"
        >
          PROCEED TO FLIGHT DEBRIEF & RESULTS <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
};
