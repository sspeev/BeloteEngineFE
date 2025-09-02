import { GameProvider } from './context/gameContext';
import Game from './components/Game';

const App = () => {
  return (
    <GameProvider>
      <div className="App h-screen bg-gradient-to-l from-primary-dark to-primary-light">
        <h3 className="text-left justify-start text-white text-xl font-semibold font-default leading-[45px]">ALFA 0.0.4</h3>
        <Game />
        <footer>
          <p className="text-center justify-start text-white text-sm font-semibold font-default">&copy; Stoyan Peev 2025</p>
        </footer>
      </div>
    </GameProvider>
  );
}

export default App;