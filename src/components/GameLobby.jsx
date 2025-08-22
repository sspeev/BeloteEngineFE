import React, { useState, useEffect } from 'react';
import { useGame } from '../context/gameContext';
import Welcome from './Welcome';
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

    <div className="lobby-container">
      {view === 'main' && (
        // <div className="lobby-main">
        //   <div className="lobby-options">
        //     <button className="lobby-option-btn" onClick={() => setView('create')}>
        //       Create New Lobby
        //     </button>
        //     <button className="lobby-option-btn" onClick={() => setView('join')}>
        //       Join Existing Lobby
        //     </button>
        //   </div>
        // </div>
        <Welcome />
      )}

      {view === 'create' && (
        <div className="create-lobby-form">
          <h2>Create New Lobby</h2>
          <form onSubmit={handleCreateLobby}>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Lobby name (optional)"
              value={lobbyName}
              onChange={(e) => setLobbyName(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              Create Lobby
            </button>
          </form>
          <button className="back-button" onClick={() => setView('main')}>
            Back
          </button>
        </div>
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
      <footer>
        <p>&copy; 2025 Belote Engine. All rights reserved.</p>
      </footer>
    </div>

    //  <div className="lobby-container">
    //     <div className="bottom-section">
    //       <div className="green-background"></div>
    //       <div className="lobby-description">
    //         Az shte sum konkurentsiq na Belot.bg. Ako ne vi se davat pari i vi se tsuka s priqteli ste na pravilnoto mqsto! Are mazna i priqtna igra!
    //       </div>
    //     </div>
    //     <div className="top-section">
    //       <div className="create-game-button">
    //         <div className="create-button-bg"></div>
    //         <div className="create-button-highlight"></div>
    //         <div className="button-text">Create game<br/></div>
    //       </div>
    //       <div className="join-game-button">
    //         <div className="join-button-bg"></div>
    //         <div className="join-button-highlight"></div>
    //         <div className="button-text">Join game<br/></div>
    //       </div>
    //       <div className="title-text">
    //         <span className="title-white">Play </span>
    //         <span className="title-green">Belote</span>
    //         <span className="title-white"> online free with friends</span>
    //       </div>
    //       <div className="version-text">ALFA 0.0.1</div>
    //     </div>
    //     <div className="card-decoration-1"></div>
    //     <div className="card-decoration-2"></div>
    //     <div className="card-decoration-3"></div>

    //     <div data-number="Jack" data-suit="Diamonds" className="card card-diamonds">
    //       <div data-number="J" data-suit="Diamonds" className="card-corner card-corner-top-left">
    //         <div className="card-value card-value-top">J</div>
    //         <div data-property-1="Diamond" className="card-suit card-suit-top">
    //           <div className="diamond-shape"></div>
    //         </div>
    //       </div>
    //       <div data-number="J" data-suit="Diamonds" className="card-corner card-corner-bottom-right">
    //         <div className="card-value card-value-bottom">J</div>
    //         <div data-property-1="Diamond" className="card-suit card-suit-bottom">
    //           <div className="diamond-shape"></div>
    //         </div>
    //       </div>
    //       <img className="card-image" src="https://placehold.co/210x252" alt="Jack of Diamonds" />
    //     </div>

    //     <div data-number="Jack" data-suit="Hearts" className="card card-hearts">
    //       <div data-number="J" data-suit="Hearts" className="card-corner card-corner-top-left">
    //         <div className="card-value card-value-top">J</div>
    //         <div data-property-1="Heart" className="card-suit card-suit-top">
    //           <div className="heart-shape"></div>
    //         </div>
    //       </div>
    //       <div data-number="J" data-suit="Hearts" className="card-corner card-corner-bottom-right">
    //         <div className="card-value card-value-bottom">J</div>
    //         <div data-property-1="Heart" className="card-suit card-suit-bottom">
    //           <div className="heart-shape"></div>
    //         </div>
    //       </div>
    //       <img className="card-image" src="https://placehold.co/173x238" alt="Jack of Hearts" />
    //     </div>

    //     <div data-number="Jack" data-suit="Spades" className="card card-spades">
    //       <div data-number="J" data-suit="Spades" className="card-corner card-corner-top-left">
    //         <div className="card-value card-value-top">J</div>
    //         <div data-property-1="Spade" className="card-suit card-suit-top">
    //           <div className="spade-shape"></div>
    //         </div>
    //       </div>
    //       <div data-number="J" data-suit="Spades" className="card-corner card-corner-bottom-right">
    //         <div className="card-value card-value-bottom">J</div>
    //         <div data-property-1="Spade" className="card-suit card-suit-bottom">
    //           <div className="spade-shape"></div>
    //         </div>
    //       </div>
    //       <img className="card-image" src="https://placehold.co/137x217" alt="Jack of Spades" />
    //     </div>

    //     <div data-number="Jack" data-suit="Clubs" className="card card-clubs">
    //       <div data-number="J" data-suit="Clubs" className="card-corner card-corner-top-left">
    //         <div className="card-value card-value-top">J</div>
    //         <div data-property-1="Club" className="card-suit card-suit-top">
    //           <div className="club-shape"></div>
    //         </div>
    //       </div>
    //       <div data-number="J" data-suit="Clubs" className="card-corner card-corner-bottom-right">
    //         <div className="card-value card-value-bottom">J</div>
    //         <div data-property-1="Club" className="card-suit card-suit-bottom">
    //           <div className="club-shape"></div>
    //         </div>
    //       </div>
    //       <img className="card-image" src="https://placehold.co/168x235" alt="Jack of Clubs" />
    //     </div>

    //     <div className="footer">© Stoyan Peev 2025</div>
    //   </div>
  );
}

export default GameLobby;