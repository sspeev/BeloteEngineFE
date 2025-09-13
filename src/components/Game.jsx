import { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import GameLobby from './GameLobby';

const Game = () => {
  const {
    gamePhase,
    error,
    startGame
  } = useGame();

  useEffect(() => {
    if (gamePhase === 'bidding') {
      startGame();
    }
  }, [gamePhase]);

  //const [showScoreboard, setShowScoreboard] = useState(false);

  if (error) {
    return (
      <div className="error-container">
        <p>Unexpected error: {error}</p>
        <button onClick={() => window.location.reload()}>
          <p>Retry</p>
        </button>
      </div>
    );
  }

  return <GameLobby />;
};

export default Game;