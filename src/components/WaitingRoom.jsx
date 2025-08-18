import { useGame } from '../context/gameContext';
import './WaitingRoom.css';

const WaitingRoom = () => {
  const {
    connectedPlayers,
    playerName,
    handleStartGame
  } = useGame();

  const isHost = connectedPlayers.length > 0 && connectedPlayers[0]?.name === playerName;
  const playersCount = connectedPlayers?.length || 0;

  return (
    <div className="waiting-room-container">
      <h2>Game Lobby</h2>
      <div className="player-count">
        <h3>Players: {playersCount} / 4</h3>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(playersCount / 4) * 100}%` }}></div>
          </div>
        </div>
        <div className="players-list">
          <h3>Current Players:</h3>
          <ul>
            {connectedPlayers.map((player, index) => {
              // Generate a truly unique key
              const uniqueKey = player.id || player.connectionId || `player-${player.name}-${index}`;

              return (
                <li key={uniqueKey} className={player.name === playerName ? 'current-player' : ''}>
                  {player.name} {player.name === playerName ? '(You)' : ''}
                  {index === 0 ? ' (Host)' : ''}
                </li>
              );
            })}
          </ul>
          {playersCount < 4 && <div className="waiting-message">Waiting for more players to join...</div>}
        </div>
        {isHost && (
          <button className="start-button" disabled={playersCount < 4} onClick={handleStartGame}>
            {playersCount === 4 ? 'Start Game' : 'Waiting for Players...'}
          </button>
        )}
        {!isHost && playersCount === 4 && (
          <div className="ready-message">Game is ready! Waiting for host to start...</div>
        )}
      </div>
    );
}

export default WaitingRoom;