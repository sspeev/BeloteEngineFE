import { useState, useEffect } from 'react';
import { useGame } from '../context/gameContext';
import PlayerHand from './PlayerHand';
import GameBoard from './GameBoard';
import BiddingPanel from './BiddingPanel';
import PlayerList from './PlayerList';
import ScoreBoard from './ScoreBoard';
import GameLobby from './GameLobby';
//import WaitingRoom from './WaitingRoom';
import './Game.css';


const Game = () => {
  const {
    lobbyName,
    playerName,
    gamePhase,
    error,
    connectionStatus,

    startGame
  } = useGame();

  useEffect(() => {
    if (gamePhase === 'bidding') {
      startGame();
    }
  }, [gamePhase]);

  
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [hasJoinedLobby, setHasJoinedLobby] = useState(false);

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!hasJoinedLobby) {
    return <GameLobby setHasJoinedLobby={setHasJoinedLobby} />;
  }

  // if (gamePhase === 'waiting') {
  //   return <WaitingRoom />;
  // }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Belote Game - {lobbyName}</h1>
        <div className="game-controls">
          <button className="toggle-score-btn" onClick={() => setShowScoreboard(!showScoreboard)}>
            {showScoreboard ? 'Hide Scores' : 'Show Scores'}
          </button>
        </div>
        <div className="game-info">
          <span>Player: {playerName}</span>
          <span>Phase: {gamePhase}</span>
          <span className={`connection-status ${connectionStatus}`}>● {connectionStatus}</span>
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
};

export default Game;