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
    lobbyName,
    lobbyId,
    gamePhase,
    error,
    loading,
    connectionStatus,
    startGame,
    connectedPlayers,
    playersCount
  } = useGame();

  const isHost = connectedPlayers[0]?.name === playerName;
  const canStart = playersCount === 4;
  const lobbyCreated = !!playerName && !!lobbyId;

  const [showScoreboard, setShowScoreboard] = useState(false);

  useEffect(() => {
    console.log('Players changed:', connectedPlayers);
  }, [connectedPlayers]);

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
    return <GameLobby />;
  }

  // Waiting / pre-start screen
  //<WaitingRoom />
  // if (lobbyCreated && (playersCount !== 4 || gamePhase === 'waiting')) {
  //   return (
  //     <div className="lobby-success-container">
  //       <div className="success-message">
  //         <h2>✅ Welcome to <strong>{lobbyName || `the Lobby`}</strong>!</h2>
  //         <p>Player: <strong>{playerName}</strong></p>
  //         <p className="player-count">Players: {playersCount}/4</p>
  //         <div className="loading-dots">
  //           <span></span>
  //           <span></span>
  //           <span></span>
  //         </div>
  //         {isHost && (
  //           <div className="start-game-container">
  //             <p>
  //               {canStart
  //                 ? 'All players have joined!'
  //                 : `Waiting for ${4 - playersCount} more player(s)...`}
  //             </p>
  //             <button
  //               className="start-game-btn"
  //               onClick={startGame}
  //               disabled={!canStart}
  //               title={canStart ? 'Start the game' : 'Need 4 players to start'}
  //             >
  //               {canStart ? 'Start Game' : 'Waiting...'}
  //             </button>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  // Main game UI
  return (
    // <div className="game-container">
    //   <div className="game-header">
    //     <h1>Belote Game - {lobbyName}</h1>
    //     <div className="game-controls">
    //       <button
    //         className="toggle-score-btn"
    //         onClick={() => setShowScoreboard(!showScoreboard)}
    //       >
    //         {showScoreboard ? 'Hide Scores' : 'Show Scores'}
    //       </button>
    //     </div>
    //     <div className="game-info">
    //       <span>Player: {playerName}</span>
    //       <span>Phase: {gamePhase}</span>
    //       <span className={`connection-status ${connectionStatus}`}>
    //         ● {connectionStatus}
    //       </span>
    //     </div>
    //   </div>

    //   {showScoreboard && <ScoreBoard />}

    //   <div className="game-content">
    //     <div className="left-panel">
    //       <PlayerList />
    //     </div>
    //     <div className="main-game-area">
    //       <GameBoard />
    //       {gamePhase === 'bidding' && <BiddingPanel />}
    //     </div>
    //     <div className="bottom-panel">
    //       <PlayerHand />
    //     </div>
    //   </div>
    // </div>
    <WaitingRoom />
  );
}

export default Game;