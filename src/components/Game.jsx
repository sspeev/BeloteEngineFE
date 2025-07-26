import React, { useState, useEffect } from 'react';
import { useGame } from '../context/gameContext';
import PlayerHand from './PlayerHand';
import GameBoard from './GameBoard';
import BiddingPanel from './BiddingPanel';
import PlayerList from './PlayerList';
import ScoreBoard from './ScoreBoard';
import GameLobby from './GameLobby';
import './Game.css';

function Game() {
  const { playerName, gameState, gamePhase, error, loading, connectionStatus } = useGame();
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [lobbyCreated, setLobbyCreated] = useState(false);

  // Handle successful lobby creation/join
  useEffect(() => {
    if (playerName && !lobbyCreated) {
      setLobbyCreated(true);
    }
  }, [playerName, lobbyCreated]);

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show lobby creation interface
  if (!playerName) {
    return <GameLobby onLobbyCreated={() => setLobbyCreated(true)} />;
  }

  // Show success message briefly when lobby is first created/joined
  if (lobbyCreated && (!gameState?.players?.length || gamePhase === 'waiting')) {
    return (
      <div className="lobby-success-container">
        <div className="success-message">
          <h2>✅ Welcome to the Lobby!</h2>
          <p>Player: <strong>{playerName}</strong></p>
          <p>Waiting for more players to join...</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  // Show main game interface
  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Belote Game</h1>
        <div className="game-controls">
          <button
            className="toggle-score-btn"
            onClick={() => setShowScoreboard(!showScoreboard)}
          >
            {showScoreboard ? 'Hide Scores' : 'Show Scores'}
          </button>
        </div>
        <div className="game-info">
          <span>Player: {playerName}</span>
          <span>Phase: {gamePhase}</span>
          <span className={`connection-status ${connectionStatus}`}>
            ● {connectionStatus}
          </span>
        </div>
      </div>

      {showScoreboard && <ScoreBoard />}

      <div className="game-content">
        <div className="left-panel">
          <PlayerList />
        </div>

        <div className="main-game-area">
          <GameBoard />
          {gamePhase === 'bidding' && <BiddingPanel />}
        </div>

        <div className="bottom-panel">
          <PlayerHand />
        </div>
      </div>
    </div>
  );
}

export default Game;