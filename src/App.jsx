import { GameProvider } from './context/gameContext';
import Game from './components/Game';

const App = () => {
  return (
    <GameProvider>
      <div className="App bg-gradient-to-l from-neutral-800 to-[#454545]">
        <Game />
        <footer>
          <p className="text-center justify-start text-white text-sm font-semibold font-['Poppins']">&copy; Stoyan Peev 2025</p>
        </footer>
      </div>
    </GameProvider>
  );
}

export default App;