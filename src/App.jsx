import { GameProvider } from './context/gameContext';
import Game from './components/Game';

const App = () => {
  return (
    <GameProvider>
      <div className="App">
        <Game />
      </div>
    </GameProvider>
  );
}

export default App;