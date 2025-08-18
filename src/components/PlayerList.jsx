import React from 'react';
import { useGame } from '../context/gameContext';
import './PlayerList.css';

function PlayerList() {
  const { 
    connectedPlayers, 
    gameState, 
    playerName, 
    currentPlayer, 
    lobbyId, 
    leaveLobby 
  } = useGame();

  const getPlayerStatus = (player) => {
    if (player.id === currentPlayer) return 'current-turn';
    if (player.name === playerName) return 'you';
    if (player.isReady) return 'ready';
    return 'waiting';
  };

  const getPlayerTeam = (playerId) => {
    const playerIndex = connectedPlayers?.findIndex(p => p.id === playerId);
    return playerIndex % 2 === 0 ? 'Team A' : 'Team B';
  };

  const getConnectionStatus = (player) => {
    const lastSeen = new Date(player.lastSeen);
    const now = new Date();
    const timeDiff = now - lastSeen;

    if (timeDiff > 30000) return 'disconnected';
    if (timeDiff > 10000) return 'unstable';
    return 'connected';
  };

  const handleLeaveLobby = () => {
    if (window.confirm('Are you sure you want to leave this lobby?')) {
      leaveLobby();
    }
  };

  return (
    <div className="player-list">
      <div className="player-list-header">
        <h3>Players ({connectedPlayers?.length || 0}/4)</h3>
        <div className="lobby-info">
          <p>Lobby: {lobbyId}</p>
          <button className="leave-lobby-btn" onClick={handleLeaveLobby}>
            Leave Lobby
          </button>
        </div>
      </div>

      <div className="players-container">
        {connectedPlayers?.map((player, index) => {
          const status = getPlayerStatus(player);
          const connectionStatus = getConnectionStatus(player);
          const team = getPlayerTeam(player.id);

          return (
            <div
              key={player.id}
              className={`player-card ${status} ${connectionStatus}`}
            >
              <div className="player-info">
                <div className="player-name">
                  {player.name}
                  {player.name === playerName && <span className="you-indicator">(You)</span>}
                </div>

                <div className="player-details">
                  <div className="team-info">{team}</div>
                  <div className="player-position">Position {index + 1}</div>
                </div>

                <div className="player-stats">
                  {gameState?.scores && (
                    <div className="score">
                      Score: {gameState.scores[player.id] || 0}
                    </div>
                  )}

                  {gameState?.tricksWon && (
                    <div className="tricks">
                      Tricks: {gameState.tricksWon[player.id] || 0}
                    </div>
                  )}
                </div>
              </div>

              <div className="player-status-indicators">
                <div className={`connection-indicator ${connectionStatus}`}>
                  <span className="status-dot"></span>
                  {connectionStatus === 'connected' ? 'Online' :
                    connectionStatus === 'unstable' ? 'Unstable' : 'Offline'}
                </div>

                {status === 'current-turn' && (
                  <div className="turn-indicator">
                    <span className="turn-arrow">→</span>
                    Turn
                  </div>
                )}

                {player.isReady && gameState?.phase === 'waiting' && (
                  <div className="ready-indicator">
                    ✓ Ready
                  </div>
                )}
              </div>

              {gameState?.currentContract?.playerId === player.id && (
                <div className="contract-holder">
                  Contract Holder
                </div>
              )}
            </div>
          );
        })}

        {Array.from({ length: 4 - (connectedPlayers?.length || 0) }).map((_, index) => (
          <div key={`empty-${index}`} className="player-card empty">
            <div className="waiting-player">
              <div className="empty-slot-icon">👤</div>
              <div className="waiting-text">Waiting for player...</div>
            </div>
          </div>
        ))}
      </div>

      {gameState?.phase === 'waiting' && connectedPlayers?.length < 4 && (
        <div className="game-not-ready">
          <p>Waiting for {4 - (connectedPlayers?.length || 0)} more player(s) to join...</p>
          <div className="lobby-id-share">
            <p>Share Lobby ID: <strong>{lobbyId}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerList;