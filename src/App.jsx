import { GameProvider } from './context/gameContext';
import Game from './components/Game';

const App = () => {
  return (
    <GameProvider>
      <div className="App">
        <Game />
        <footer className="w-[1440px] h-[68px] left-0 top-[1789px] absolute text-center justify-start text-white text-[41px] font-semibold font-['Poppins'] leading-[45px]">© Stoyan Peev 2025</footer>
      </div>
    </GameProvider>
  );
}

export default App;