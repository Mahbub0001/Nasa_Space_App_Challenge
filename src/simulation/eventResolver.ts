import { ResourceState, EventChoice, ResolvedDecision, MissionEvent } from '../types/simulation';

export function resolveDecisionEffect(
  currentResources: ResourceState,
  choice: EventChoice,
  event: MissionEvent
): { updatedResources: ResourceState; decisionRecord: ResolvedDecision } {
  const beforeState = {
    fuel: currentResources.fuelPct,
    power: currentResources.powerUnits,
    risk: currentResources.riskPct,
    science: currentResources.scienceScore
  };

  const updatedResources: ResourceState = {
    ...currentResources,
    fuelPct: Math.min(100, Math.max(0, currentResources.fuelPct + choice.fuelDelta)),
    riskPct: Math.min(100, Math.max(0, currentResources.riskPct + choice.riskDelta)),
    scienceScore: Math.max(0, currentResources.scienceScore + choice.scienceDelta),
    powerUnits: choice.powerDelta ? Math.max(0, currentResources.powerUnits + choice.powerDelta) : currentResources.powerUnits,
    dataReturnScore: choice.dataDelta ? Math.min(100, Math.max(0, currentResources.dataReturnScore + choice.dataDelta)) : currentResources.dataReturnScore
  };

  const afterState = {
    fuel: updatedResources.fuelPct,
    power: updatedResources.powerUnits,
    risk: updatedResources.riskPct,
    science: updatedResources.scienceScore
  };

  // Compose clean readable consequence summary
  const deltasList: string[] = [];
  if (choice.fuelDelta !== 0) deltasList.push(`Fuel ${choice.fuelDelta > 0 ? '+' : ''}${choice.fuelDelta}%`);
  if (choice.powerDelta && choice.powerDelta !== 0) deltasList.push(`Power ${choice.powerDelta > 0 ? '+' : ''}${choice.powerDelta} U`);
  if (choice.riskDelta !== 0) deltasList.push(`Risk ${choice.riskDelta > 0 ? '+' : ''}${choice.riskDelta}%`);
  if (choice.scienceDelta !== 0) deltasList.push(`Science ${choice.scienceDelta > 0 ? '+' : ''}${choice.scienceDelta}`);
  if (choice.dataDelta && choice.dataDelta !== 0) deltasList.push(`Data ${choice.dataDelta > 0 ? '+' : ''}${choice.dataDelta}`);

  const consequenceSummary = `${choice.consequenceTitle} (${deltasList.join(' | ')})`;

  const decisionRecord: ResolvedDecision = {
    eventId: event.id,
    eventCode: event.code,
    eventTitle: event.title,
    choiceId: choice.id,
    choiceTag: choice.tag,
    choiceLabel: choice.label,
    consequenceSummary,
    timestamp: new Date().toISOString(),
    deltas: {
      fuel: choice.fuelDelta,
      risk: choice.riskDelta,
      science: choice.scienceDelta,
      power: choice.powerDelta,
      data: choice.dataDelta
    },
    beforeState,
    afterState
  };

  return { updatedResources, decisionRecord };
}
