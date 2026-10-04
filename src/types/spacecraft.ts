import { PropulsionId, PowerSystemId, CommunicationId, InstrumentId } from './mission';

export interface SpacecraftSubsystemState {
  hasBus: boolean;
  propulsion: PropulsionId;
  power: PowerSystemId;
  comms: CommunicationId;
  instruments: InstrumentId[];
  isNominal: boolean;
}

export interface SpacecraftVisualProps {
  propulsion: PropulsionId;
  power: PowerSystemId;
  comms: CommunicationId;
  instruments: InstrumentId[];
  highlightedSubsystem?: string | null;
  className?: string;
  isAnimated?: boolean;
}
