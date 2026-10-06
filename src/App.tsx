import React from 'react';
import { MissionProvider, useMission } from './hooks/useMission';
import { Layout } from './components/layout/Layout';
import { LandingScreen } from './screens/Landing/LandingScreen';
import { BriefingScreen } from './screens/Briefing/BriefingScreen';
import { MissionControlScreen } from './screens/MissionControl/MissionControlScreen';
import { PayloadScreen } from './screens/Payload/PayloadScreen';
import { ReadinessScreen } from './screens/Readiness/ReadinessScreen';
import { LaunchScreen } from './screens/Launch/LaunchScreen';
import { SimulationScreen } from './screens/Simulation/SimulationScreen';
import { ArrivalScreen } from './screens/Arrival/ArrivalScreen';
import { DiscoveryScreen } from './screens/Discovery/DiscoveryScreen';
import { ResultsScreen } from './screens/Results/ResultsScreen';
import { WhatIfScreen } from './screens/WhatIf/WhatIfScreen';

const ScreenRouter: React.FC = () => {
  const { phase } = useMission();

  switch (phase) {
    case 'landing':
      return <LandingScreen />;
    case 'briefing':
      return <BriefingScreen />;
    case 'mission_control':
      return <MissionControlScreen />;
    case 'payload':
      return <PayloadScreen />;
    case 'readiness':
      return <ReadinessScreen />;
    case 'launch':
      return <LaunchScreen />;
    case 'simulation':
      return <SimulationScreen />;
    case 'arrival':
      return <ArrivalScreen />;
    case 'discovery':
      return <DiscoveryScreen />;
    case 'results':
      return <ResultsScreen />;
    case 'what_if':
      return <WhatIfScreen />;
    default:
      return <LandingScreen />;
  }
};

export function App() {
  return (
    <MissionProvider>
      <Layout>
        <ScreenRouter />
      </Layout>
    </MissionProvider>
  );
}

export default App;
