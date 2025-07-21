import React from 'react';
import { useGame } from '../context/gameContext';
import './PlayerList.css';

function PlayerList() {
  const { players, gameState, playerId, currentPlayer } = useGame();

  const getPlayerStatus = (player) => {
    if (player.id === currentPlayer) return 'current-turn';
    if (player.id === playerId) return 'you';
    if (player.isReady) return 'ready';
    return 'waiting';
  };

  const getPlayerTeam = (playerId) => {
    // In Belote, players are typically in teams of 2 (North-South vs East-West)
    const playerIndex = players?.findIndex(p => p.id === playerId);
    return playerIndex % 2 === 0 ? 'Team A' : 'Team B';
  };

  const getConnectionStatus = (player) => {
    const lastSeen = new Date(player.lastSeen);
    const now = new Date();
    const timeDiff = now - lastSeen;
    
    if (timeDiff > 30000) return 'disconnected'; // 30 seconds
    if (timeDiff > 10000) return 'unstable'; // 10 seconds
    return 'connected';
  };

  return (
    <div className="player-list">
      <div className="player-list-header">
        <h3>Players ({players?.length || 0}/4)</h3>
      </div>

      <div className="players-container">
        {players?.map((player, index) => {
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
                  {player.id === playerId && <span className="you-indicator">(You)</span>}
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

        {/* Show empty slots for missing players */}
        {Array.from({ length: 4 - (players?.length || 0) }).map((_, index) => (
          <div key={`empty-${index}`} className="player-card empty">
            <div className="waiting-player">
              <div className="empty-slot-icon">👤</div>
              <div className="waiting-text">Waiting for player...</div>
            </div>
          </div>
        ))}
      </div>

      {gameState?.phase === 'waiting' && players?.length < 4 && (
        <div className="game-not-ready">
          <p>Waiting for {4 - (players?.length || 0)} more player(s) to join...</p>
          <div className="game-id-share">
            <p>Share Game ID: <strong>{gameState?.gameId}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerList;