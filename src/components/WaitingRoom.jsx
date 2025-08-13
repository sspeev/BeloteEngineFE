import { useGame } from '../context/gameContext';
import './WaitingRoom.css';

const WaitingRoom = () => {
  const {
    connectedPlayers,
    playersCount,
    playerName,
    startGame,
  } = useGame();

  const isHost = connectedPlayers.length > 0 && connectedPlayers[0]?.name === playerName;

  return (
    <div className="waiting-room-container">
      <h2>Game Lobby</h2>
      
      <div className="player-count">
        <h3>Players: {playersCount} / 4</h3>
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${(playersCount / 4) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="players-list">
        <h3>Current Players:</h3>
        <ul>
          {connectedPlayers.map((player) => (
            <li key={player.name} className={player.name === playerName ? 'current-player' : ''}>
              {player.username} {player.name === playerName ? '(You)' : ''}
              {connectedPlayers[0]?.name === player.name ? ' (Host)' : ''}
            </li>
          ))}
        </ul>
        
        {playersCount < 4 && (
          <div className="waiting-message">
            Waiting for more players to join...
          </div>
        )}
      </div>
      
      {isHost && (
        <button 
          className="start-button" 
          disabled={playersCount < 4} 
          onClick={startGame}
        >
          {playersCount === 4 ? 'Start Game' : 'Waiting for Players...'}
        </button>
      )}

      {!isHost && playersCount === 4 && (
        <div className="ready-message">
          Game is ready! Waiting for host to start...
        </div>
      )}
    </div>
  );
}

export default WaitingRoom;