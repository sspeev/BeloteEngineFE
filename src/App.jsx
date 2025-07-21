import React from 'react';
import { GameProvider } from './context/gameContext';
import Game from './components/Game';
import './App.css';

function App() {
  return (
    <GameProvider>
      <div className="App">
        <Game />
      </div>
    </GameProvider>
  );
}

export default App;