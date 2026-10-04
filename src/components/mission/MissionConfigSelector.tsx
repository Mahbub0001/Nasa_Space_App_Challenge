import React from 'react';
import { useMission } from '../../hooks/useMission';
import { DESTINATIONS } from '../../data/destinations';
import { LAUNCH_VEHICLES } from '../../data/launchVehicles';
import { PROPULSION_SYSTEMS } from '../../data/propulsion';
import { POWER_SYSTEMS } from '../../data/powerSystems';
import { COMMUNICATION_SYSTEMS } from '../../data/communication';
import { AerospaceCard } from '../common/AerospaceCard';
import { 
  Rocket, 
  Compass, 
  Flame, 
  Sun, 
  Radio, 
  Check 
} from 'lucide-react';
import { 
  DestinationId, 
  LaunchVehicleId, 
  PropulsionId, 
  PowerSystemId, 
  CommunicationId 
} from '../../types/mission';

export const MissionConfigSelector: React.FC = () => {
  const { 
    config, 
    setDestination, 
    setLaunchVehicle, 
    setPropulsion, 
    setPowerSystem, 
    setCommunication 
  } = useMission();

  return (
    <div className="space-y-3 font-sans">
      
      {/* 1. DESTINATION */}
      <AerospaceCard
        code="DST-01"
        title="TARGET DESTINATION"
        subtitle="ORBITAL CORRIDOR & FLIGHT DURATION"
      >
        <div className="grid grid-cols-1 gap-2">
          {DESTINATIONS.map((dest) => {
            const isSelected = config.destinationId === dest.id;
            return (
              <div
                key={dest.id}
                onClick={() => setDestination(dest.id as DestinationId)}
                className={`p-2.5 rounded-md border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-sky-950/40 border-sky-400/80 ring-1 ring-sky-400/30 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-white uppercase font-sans">{dest.name}</span>
                    {dest.isPrimaryDemo && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded font-mono font-medium">
                        DEMO TARGET
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono tabular-nums text-slate-400">
                  <span>{dest.distanceKm}</span>
                  <span>•</span>
                  <span>{dest.flightDurationDays}d transit</span>
                  <span>•</span>
                  <span className="text-sky-400 font-medium">ΔV {dest.deltaVRequiredKms} km/s</span>
                </div>
              </div>
            );
          })}
        </div>
      </AerospaceCard>

      {/* 2. LAUNCH VEHICLE */}
      <AerospaceCard
        code="BOOST-02"
        title="LAUNCH VEHICLE"
        subtitle="THROW-WEIGHT CAPACITY & LIFTOFF MASS CEILING"
      >
        <div className="grid grid-cols-1 gap-2">
          {LAUNCH_VEHICLES.map((lv) => {
            const isSelected = config.launchVehicleId === lv.id;
            return (
              <div
                key={lv.id}
                onClick={() => setLaunchVehicle(lv.id as LaunchVehicleId)}
                className={`p-2.5 rounded-md border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-sky-950/40 border-sky-400/80 ring-1 ring-sky-400/30 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rocket className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-white uppercase font-sans">{lv.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </div>
                <div className="flex items-center justify-between mt-1.5 text-[11px] font-mono tabular-nums">
                  <span className="text-sky-300 font-medium">Cap: {lv.payloadCapacityKg.toLocaleString()} KG</span>
                  <span className="text-slate-400">Rel: {lv.reliabilityPct}%</span>
                  <span className="text-slate-200 font-semibold">${lv.baseCostBillion.toFixed(2)}B</span>
                </div>
              </div>
            );
          })}
        </div>
      </AerospaceCard>

      {/* 3. PROPULSION */}
      <AerospaceCard
        code="PROP-03"
        title="PROPULSION ARCHITECTURE"
        subtitle="SPECIFIC IMPULSE (Isp) & THRUST RESPONSE"
      >
        <div className="grid grid-cols-1 gap-2">
          {PROPULSION_SYSTEMS.map((prop) => {
            const isSelected = config.propulsionId === prop.id;
            return (
              <div
                key={prop.id}
                onClick={() => setPropulsion(prop.id as PropulsionId)}
                className={`p-2.5 rounded-md border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-sky-950/40 border-sky-400/80 ring-1 ring-sky-400/30 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-white uppercase font-sans">{prop.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </div>
                <div className="flex items-center justify-between mt-1.5 text-[11px] font-mono tabular-nums">
                  <span className="text-sky-300 font-medium">Isp: {prop.ispSeconds}s</span>
                  <span className="text-slate-400">Thrust: {prop.thrustClass}</span>
                  <span className="text-slate-200">+{prop.massKg} KG</span>
                </div>
              </div>
            );
          })}
        </div>
      </AerospaceCard>

      {/* 4. POWER SYSTEM */}
      <AerospaceCard
        code="PWR-04"
        title="POWER GENERATION"
        subtitle="ELECTRICAL BUS CAPACITY (UNITS)"
      >
        <div className="grid grid-cols-1 gap-2">
          {POWER_SYSTEMS.map((pwr) => {
            const isSelected = config.powerSystemId === pwr.id;
            return (
              <div
                key={pwr.id}
                onClick={() => setPowerSystem(pwr.id as PowerSystemId)}
                className={`p-2.5 rounded-md border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-sky-950/40 border-sky-400/80 ring-1 ring-sky-400/30 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-white uppercase font-sans">{pwr.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </div>
                <div className="flex items-center justify-between mt-1.5 text-[11px] font-mono tabular-nums">
                  <span className="text-sky-300 font-medium">Output: {pwr.outputUnits} U</span>
                  <span className="text-slate-400">+{pwr.massKg} KG</span>
                  <span className="text-slate-200 font-semibold">${pwr.costBillion.toFixed(2)}B</span>
                </div>
              </div>
            );
          })}
        </div>
      </AerospaceCard>

      {/* 5. COMMUNICATION */}
      <AerospaceCard
        code="COM-05"
        title="TELEMETRY & COMMS LINK"
        subtitle="DATA RATE & APERTURE DIAMETER"
      >
        <div className="grid grid-cols-1 gap-2">
          {COMMUNICATION_SYSTEMS.map((com) => {
            const isSelected = config.communicationId === com.id;
            return (
              <div
                key={com.id}
                onClick={() => setCommunication(com.id as CommunicationId)}
                className={`p-2.5 rounded-md border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-sky-950/40 border-sky-400/80 ring-1 ring-sky-400/30 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-white uppercase font-sans">{com.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </div>
                <div className="flex items-center justify-between mt-1.5 text-[11px] font-mono tabular-nums">
                  <span className="text-sky-300 font-medium">Downlink: {com.dataReturnRate} pts</span>
                  <span className="text-amber-400">Draw: {com.powerDraw} U</span>
                  <span className="text-slate-200">Dish: {com.dishDiameterMeters}m</span>
                </div>
              </div>
            );
          })}
        </div>
      </AerospaceCard>

    </div>
  );
};
