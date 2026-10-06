import { InstrumentId, MissionConfiguration } from './mission';
import type { FlightOutcome } from '../simulation/flightGame';

export interface ResourceState {
  massKg: number;
  maxMassKg: number;
  massMarginKg: number;

  powerUnits: number;
  maxPowerUnits: number;
  powerMarginUnits: number;

  budgetBillion: number;
  maxBudgetBillion: number;
  budgetMarginBillion: number;

  fuelPct: number;
  riskPct: number;
  scienceScore: number;
  reliabilityPct: number;
  dataReturnScore: number;
}

export type AuditStatus = 'PASS' | 'WARN' | 'FAIL';

export interface AuditCheck {
  id: string;
  name: string;
  status: AuditStatus;
  currentDisplay: string;
  limitDisplay: string;
  details: string;
  remedy?: string;
}

export interface AuditResult {
  isReady: boolean;
  scorePreview: number;
  checks: AuditCheck[];
  criticalIssues: string[];
}

export interface ChoiceIndicator {
  metric: 'Science' | 'Power' | 'Fuel' | 'Risk' | 'Time' | 'Data';
  symbol: '↑↑' | '↑' | '↓↓' | '↓' | '—';
  tone: 'positive' | 'negative' | 'neutral';
}

export interface EventChoice {
  id: string;
  tag: 'A' | 'B' | 'C';
  tagColor: 'emerald' | 'amber' | 'cyan';
  label: string;
  fuelDelta: number;
  riskDelta: number;
  scienceDelta: number;
  powerDelta?: number;
  dataDelta?: number;
  rationale: string;
  indicators: ChoiceIndicator[];
  consequenceTitle: string;
  consequenceDescription: string;
}

export interface MissionEvent {
  id: string;
  code: string;
  title: string;
  systemUnderStress: string;
  description: string;
  triggerStageIndex: number; // which timeline stage triggers this event
  choices: EventChoice[];
}

export interface ResolvedDecision {
  eventId: string;
  eventCode: string;
  eventTitle: string;
  choiceId: string;
  choiceTag: 'A' | 'B' | 'C';
  choiceLabel: string;
  consequenceSummary: string;
  timestamp: string;
  deltas: {
    fuel: number;
    risk: number;
    science: number;
    power?: number;
    data?: number;
  };
  beforeState: {
    fuel: number;
    power: number;
    risk: number;
    science: number;
  };
  afterState: {
    fuel: number;
    power: number;
    risk: number;
    science: number;
  };
}

export interface TimelineStage {
  id: string;
  code: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
  daysOffset: number;
  summary: string;
}

export type ScoreClassification = 
  | 'EXCEPTIONAL MISSION'
  | 'MISSION SUCCESS'
  | 'PARTIAL SUCCESS'
  | 'HIGH RISK'
  | 'MISSION FAILURE';

export interface ScoreBreakdown {
  scientificReturn: number;    // 30%
  missionReliability: number;  // 25%
  resourceEfficiency: number;  // 20%
  budgetPerformance: number;   // 15%
  dataReturn: number;          // 10%
  finalScore: number;          // 0-100
  classification: ScoreClassification;
}

export interface WhatIfScenario {
  id: string;
  name: string;
  subtitle: string;
  configuration: MissionConfiguration;
  resources: ResourceState;
  scoreBreakdown: ScoreBreakdown;
  narrativeComparison: string;
}

export interface MissionResult {
  missionId: string;
  destinationName: string;
  scoreBreakdown: ScoreBreakdown;
  finalResources: ResourceState;
  decisions: ResolvedDecision[];
  missionInsight: string;
  keyDecision: string;
  installedInstruments: InstrumentId[];
  whatIfScenarios: WhatIfScenario[];
  flightOutcome?: FlightOutcome;
}
