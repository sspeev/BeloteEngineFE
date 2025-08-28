import React, { useState, useEffect } from 'react';
import { useGame } from '../context/gameContext';
import Welcome from './Welcome';
import CreateForm from './CreateForm';
import './GameLobby.css';

const GameLobby = ({ setHasJoinedLobby }) => {
  const {
    createLobby,
    joinLobby,
    availableLobbies,
    getAvailableLobbies,
    loading
  } = useGame();

  const [playerName, setPlayerName] = useState('');
  const [lobbyName, setLobbyName] = useState('');
  const [selectedLobbyId, setSelectedLobbyId] = useState('');
  const [view, setView] = useState('main');

  const handleCreateLobby = async (e) => {
    e.preventDefault();

    if (playerName.trim()) {
      const result = await createLobby(playerName.trim(), lobbyName.trim() || null);
      if (result) {
        setSelectedLobbyId(result.id || result.lobbyId);
        setHasJoinedLobby(true);
      }
    }
  };

  const handleJoinLobby = async (e) => {
    e.preventDefault();

    if (playerName.trim() && selectedLobbyId) {
      const result = await joinLobby(playerName.trim(), selectedLobbyId);
      if (result) {
        setHasJoinedLobby(true);
      }
    }
  };

  const refreshLobbies = () => {
    getAvailableLobbies();
  };

  return (

    <div className="lobby-container relative overflow-hidden">
      {view === 'main' && (
        <Welcome setView={setView} />
      )}

      {view === 'create' && (
        // <div className="create-lobby-form">
        //   <h2>Create New Lobby</h2>
        //   <form onSubmit={handleCreateLobby}>
        //     <input
        //       type="text"
        //       placeholder="Enter your name"
        //       value={playerName}
        //       onChange={(e) => setPlayerName(e.target.value)}
        //       required
        //     />
        //     <input
        //       type="text"
        //       placeholder="Lobby name (optional)"
        //       value={lobbyName}
        //       onChange={(e) => setLobbyName(e.target.value)}
        //     />
        //     <button type="submit" disabled={loading}>
        //       Create Lobby
        //     </button>
        //   </form>
        //   <button className="back-button" onClick={() => setView('main')}>
        //     Back
        //   </button>
        // </div>
        <CreateForm
          handleCreateLobby={handleCreateLobby}
          playerName={playerName}
          setPlayerName={setPlayerName}
          lobbyName={lobbyName}
          setLobbyName={setLobbyName}
          setView={setView}
        />
      )}

      {view === 'join' && (
        <div className="join-lobby-form">
          <h2>Join Lobby</h2>
          <form onSubmit={handleJoinLobby}>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
            />
            <div className="lobby-selection">
              <div className="lobby-header">
                <h3>Available Lobbies</h3>
                <button type="button" onClick={refreshLobbies} className="refresh-btn">
                  Refresh
                </button>
              </div>
              <div className="lobbies-list">
                {availableLobbies?.map(lobby => (
                  <div
                    key={lobby.id}
                    className={`lobby-item ${selectedLobbyId === lobby.id ? 'selected' : ''}`}
                    onClick={() => setSelectedLobbyId(lobby.id)}
                  >
                    <div className="lobby-info">
                      <h4>{lobby.name || `Lobby ${lobby.id}`}</h4>
                      <p>Players: {lobby.playerCount}/4</p>
                      <p>Status: {lobby.status}</p>
                    </div>
                  </div>
                ))}
                {availableLobbies?.length === 0 && (
                  <div className="no-lobbies">
                    No available lobbies. Create one instead!
                  </div>
                )}
              </div>
            </div>
            <button type="submit" disabled={loading || !selectedLobbyId}>
              Join Selected Lobby
            </button>
          </form>
          <button className="back-button" onClick={() => setView('main')}>
            Back
          </button>
        </div>
      )}
      <div className="hearts text-[200px] lg:text-[500px] rotate-[25deg] bottom-1/5 -left-1 absolute bg-gradient-to-b from-primary-dark to-primary-light bg-clip-text text-transparent origin-top-left ">♥</div>
      <div className="spades text-[200px] lg:text-[500px] -rotate-[25deg] top-1/12 right-1 absolute origin-top-left bg-gradient-to-l from-secondary-dark to-secondary-light bg-clip-text text-transparent">♣</div>
    </div>
  );
}

export default GameLobby;