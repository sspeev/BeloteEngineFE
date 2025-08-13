import { useGame } from '../context/gameContext';
import './WaitingRoom.css';

const WaitingRoom = () => {
  const { playerCount, players, isGameReady, startGame, currentUserId, connected } = useGame();
  
  // Check if current user is the host (first player)
  const isHost = players.length > 0 && players[0]?.id === currentUserId;
  
  if (!connected) {
    return <div className="connecting-message">Connecting to game server...</div>;
  }
  
  return (
    <div className="waiting-room-container">
      <h2>Game Lobby</h2>
      
      <div className="player-count">
        <h3>Players: {playerCount} / 4</h3>
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${(playerCount / 4) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="players-list">
        <h3>Current Players:</h3>
        <ul>
          {players.map((player) => (
            <li key={player.id} className={player.id === currentUserId ? 'current-player' : ''}>
              {player.username} {player.id === currentUserId ? '(You)' : ''}
              {players[0]?.id === player.id ? ' (Host)' : ''}
            </li>
          ))}
        </ul>
        
        {playerCount < 4 && (
          <div className="waiting-message">
            Waiting for more players to join...
          </div>
        )}
      </div>
      
      {isHost && (
        <button 
          className="start-button" 
          disabled={!isGameReady} 
          onClick={startGame}
        >
          {isGameReady ? 'Start Game' : 'Waiting for Players...'}
        </button>
      )}
      
      {!isHost && isGameReady && (
        <div className="ready-message">
          Game is ready! Waiting for host to start...
        </div>
      )}
    </div>
  );
}

export default WaitingRoom;