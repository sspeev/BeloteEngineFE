import { GameProvider } from './app/contexts/GameContext.jsx';
import Layout from './app/Layout.jsx';

export default function App() {
  return (
    <GameProvider>
      <Layout />
    </GameProvider>
  );
};