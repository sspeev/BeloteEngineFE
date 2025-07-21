import React, { useState } from 'react';
import { useGame } from '../context/gameContext';

function GameLobby() {
  const [playerName, setPlayerName] = useState('');
  const [gameIdToJoin, setGameIdToJoin] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const { createGame, joinGame, loading } = useGame();

  const handleCreateGame = async (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      await createGame(playerName.trim());
    }
  };

  const handleJoinGame = async (e) => {
    e.preventDefault();
    if (playerName.trim() && gameIdToJoin.trim()) {
      await joinGame(gameIdToJoin.trim(), playerName.trim());
    }
  };

  return (
    <div className="lobby-container">
      <h1>Welcome to Belote</h1>
      
      <div className="lobby-forms">
        {!showJoinForm ? (
          <div className="create-game-form">
            <h2>Create New Game</h2>
            <form onSubmit={handleCreateGame}>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                Create Game
              </button>
            </form>
            <button 
              className="switch-button"
              onClick={() => setShowJoinForm(true)}
            >
              Join Existing Game
            </button>
          </div>
        ) : (
          <div className="join-game-form">
            <h2>Join Game</h2>
            <form onSubmit={handleJoinGame}>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter Game ID"
                value={gameIdToJoin}
                onChange={(e) => setGameIdToJoin(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                Join Game
              </button>
            </form>
            <button 
              className="switch-button"
              onClick={() => setShowJoinForm(false)}
            >
              Create New Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameLobby;