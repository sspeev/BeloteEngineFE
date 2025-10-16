import { GameProvider } from './app/contexts/GameContext.jsx';
import Layout from './app/Layout.jsx';
import { BrowserRouter } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Layout />
      </GameProvider>
    </BrowserRouter>
  );
};