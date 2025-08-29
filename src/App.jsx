import { GameProvider } from './context/gameContext';
import Game from './components/Game';

const App = () => {
  return (
    <GameProvider>
      <div className="App bg-gradient-to-l from-neutral-800 to-[#454545]">
        <h3 className="text-left justify-start text-white text-xl font-semibold font-['Poppins'] leading-[45px]">ALFA 0.0.3</h3>
        <Game />
        <footer>
          <p className="text-center justify-start text-white text-sm font-semibold font-['Poppins']">&copy; Stoyan Peev 2025</p>
        </footer>
      </div>
    </GameProvider>
  );
}

export default App;