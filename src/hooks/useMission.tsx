import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { 
  MissionConfiguration, 
  MissionPhase, 
  DestinationId, 
  LaunchVehicleId, 
  PropulsionId, 
  PowerSystemId, 
  CommunicationId, 
  InstrumentId 
} from '../types/mission';
import { ResourceState, AuditResult, ResolvedDecision, MissionResult } from '../types/simulation';
import { DEFAULT_MISSION_CONFIG } from '../data/missions';
import { calculateAllResources } from '../simulation/engine';
import { checkConstraints } from '../simulation/constraints';
import { buildMissionResult } from '../simulation/scoring';
import type { FlightOutcome } from '../simulation/flightGame';
import { sound } from '../utils/sound';

interface MissionNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  title: string;
  message: string;
  timestamp: number;
}

interface MissionContextValue {
  phase: MissionPhase;
  config: MissionConfiguration;
  resources: ResourceState;
  audit: AuditResult;
  decisions: ResolvedDecision[];
  missionResult: MissionResult | null;
  notification: MissionNotification | null;
  
  // Navigation & Actions
  setPhase: (phase: MissionPhase) => void;
  setDestination: (id: DestinationId) => void;
  setLaunchVehicle: (id: LaunchVehicleId) => void;
  setPropulsion: (id: PropulsionId) => void;
  setPowerSystem: (id: PowerSystemId) => void;
  setCommunication: (id: CommunicationId) => void;
  toggleInstrument: (id: InstrumentId) => void;
  addInstrument: (id: InstrumentId) => void;
  removeInstrument: (id: InstrumentId) => void;
  recordDecision: (decision: ResolvedDecision) => void;
  finalizeMission: (outcome?: FlightOutcome, targetPhase?: MissionPhase) => void;
  resetMission: () => void;
  retryFlight: () => void;
  dismissNotification: () => void;
  showNotification: (type: MissionNotification['type'], title: string, message: string) => void;
  applyDemoPreset: () => void;
}

const MissionContext = createContext<MissionContextValue | null>(null);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phase, setPhaseState] = useState<MissionPhase>('landing');
  const [config, setConfig] = useState<MissionConfiguration>(DEFAULT_MISSION_CONFIG);
  const [decisions, setDecisions] = useState<ResolvedDecision[]>([]);
  const [missionResult, setMissionResult] = useState<MissionResult | null>(null);
  const [flightOutcome, setFlightOutcome] = useState<FlightOutcome | null>(null);
  const [notification, setNotification] = useState<MissionNotification | null>(null);

  // Recalculate deterministic resources whenever configuration changes
  const resources = useMemo(() => {
    return calculateAllResources(config);
  }, [config]);

  // Recalculate constraints whenever configuration or resources change
  const audit = useMemo(() => {
    return checkConstraints(config, resources);
  }, [config, resources]);

  const showNotification = useCallback((type: MissionNotification['type'], title: string, message: string) => {
    const notif: MissionNotification = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      message,
      timestamp: Date.now()
    };
    setNotification(notif);
    if (type === 'alert' || type === 'warning') {
      sound.playAlert();
    } else {
      sound.playSuccess();
    }
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const setPhase = useCallback((newPhase: MissionPhase) => {
    sound.playClick();
    if (newPhase === 'launch') {
      setDecisions([]);
      setMissionResult(null);
      setFlightOutcome(null);
    }
    if (newPhase === 'results' && !missionResult) {
      const result = buildMissionResult(config, resources, decisions, flightOutcome ?? undefined);
      setMissionResult(result);
    }
    setPhaseState(newPhase);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [config, resources, decisions, flightOutcome, missionResult]);

  const setDestination = useCallback((destinationId: DestinationId) => {
    sound.playClick();
    setConfig(prev => ({ ...prev, destinationId }));
  }, []);

  const setLaunchVehicle = useCallback((launchVehicleId: LaunchVehicleId) => {
    sound.playClick();
    setConfig(prev => ({ ...prev, launchVehicleId }));
  }, []);

  const setPropulsion = useCallback((propulsionId: PropulsionId) => {
    sound.playClick();
    setConfig(prev => ({ ...prev, propulsionId }));
  }, []);

  const setPowerSystem = useCallback((powerSystemId: PowerSystemId) => {
    sound.playClick();
    setConfig(prev => ({ ...prev, powerSystemId }));
  }, []);

  const setCommunication = useCallback((communicationId: CommunicationId) => {
    sound.playClick();
    setConfig(prev => ({ ...prev, communicationId }));
  }, []);

  const addInstrument = useCallback((id: InstrumentId) => {
    setConfig(prev => {
      if (prev.selectedInstrumentIds.includes(id)) return prev;
      return {
        ...prev,
        selectedInstrumentIds: [...prev.selectedInstrumentIds, id]
      };
    });
  }, []);

  const removeInstrument = useCallback((id: InstrumentId) => {
    setConfig(prev => ({
      ...prev,
      selectedInstrumentIds: prev.selectedInstrumentIds.filter(i => i !== id)
    }));
  }, []);

  const toggleInstrument = useCallback((id: InstrumentId) => {
    setConfig(prev => {
      const exists = prev.selectedInstrumentIds.includes(id);
      sound.playClick();
      return {
        ...prev,
        selectedInstrumentIds: exists
          ? prev.selectedInstrumentIds.filter(i => i !== id)
          : [...prev.selectedInstrumentIds, id]
      };
    });
  }, []);

  const recordDecision = useCallback((decision: ResolvedDecision) => {
    setDecisions(prev => [...prev, decision]);
  }, []);

  const finalizeMission = useCallback((outcome?: FlightOutcome, targetPhase: MissionPhase = 'results') => {
    const outcomeToUse = outcome ?? flightOutcome ?? undefined;
    if (outcome) {
      setFlightOutcome(outcome);
    }
    const result = buildMissionResult(config, resources, decisions, outcomeToUse);
    setMissionResult(result);
    setPhaseState(targetPhase);
  }, [config, resources, decisions, flightOutcome]);

  const resetMission = useCallback(() => {
    sound.playClick();
    setConfig(DEFAULT_MISSION_CONFIG);
    setDecisions([]);
    setMissionResult(null);
    setFlightOutcome(null);
    setNotification(null);
    setPhaseState('landing');
  }, []);

  const retryFlight = useCallback(() => {
    sound.playClick();
    setDecisions([]);
    setMissionResult(null);
    setFlightOutcome(null);
    setNotification(null);
    setPhaseState('simulation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const applyDemoPreset = useCallback(() => {
    // Exact demo path preset matching PRD Section 53
    setConfig({
      destinationId: 'mars',
      launchVehicleId: 'heavy_lift',
      propulsionId: 'hybrid',
      powerSystemId: 'advanced_solar',
      communicationId: 'deep_space',
      selectedInstrumentIds: ['imaging_system', 'spectrometer', 'radar', 'radiation_detector']
    });
    setDecisions([]);
    setMissionResult(null);
    sound.playSuccess();
  }, []);

  return (
    <MissionContext.Provider
      value={{
        phase,
        config,
        resources,
        audit,
        decisions,
        missionResult,
        notification,
        setPhase,
        setDestination,
        setLaunchVehicle,
        setPropulsion,
        setPowerSystem,
        setCommunication,
        toggleInstrument,
        addInstrument,
        removeInstrument,
        recordDecision,
        finalizeMission,
        resetMission,
        retryFlight,
        dismissNotification,
        showNotification,
        applyDemoPreset
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = (): MissionContextValue => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
};
