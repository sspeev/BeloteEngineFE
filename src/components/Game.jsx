
import { useGame } from '../context/GameContext';
import GameLobby from './GameLobby';

const Game = () => {
  const {
    error
  } = useGame();

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