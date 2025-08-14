import { useState, useEffect } from 'react';
import { useGame } from '../context/gameContext';
import PlayerHand from './PlayerHand';
import GameBoard from './GameBoard';
import BiddingPanel from './BiddingPanel';
import PlayerList from './PlayerList';
import ScoreBoard from './ScoreBoard';
import GameLobby from './GameLobby';
import WaitingRoom from './WaitingRoom';
import './Game.css';


const Game = () => {
  const {
    playerName,
    lobbyId,
    gamePhase,
    error,
    loading,
    connectionStatus,
    playersCount
  } = useGame();

  const [showScoreboard, setShowScoreboard] = useState(false);
  const [playersCountDisplayer, setPlayersCountDisplayer] = useState(0);

  const lobbyCreated = !!playerName && !!lobbyId;

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (loading && !lobbyCreated) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!playerName) {
    return <GameLobby
      playersCountDisplayer={playersCountDisplayer}
      setPlayersCountDisplayer={setPlayersCountDisplayer}
    />;
  }
  return (
    playersCount < 4 || gamePhase === 'waiting'
      ? <WaitingRoom playersCountDisplayer={playersCountDisplayer} /> :
      <div className="game-container">
        <div className="game-header">
          <h1>Belote Game - {lobbyName}</h1>
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