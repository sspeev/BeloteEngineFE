import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/gameContext';
import PlayerHand from './PlayerHand';
import GameBoard from './GameBoard';
import BiddingPanel from './BiddingPanel';
import PlayerList from './PlayerList';
import ScoreBoard from './ScoreBoard';
import './Game.css';
import * as signalR from '@microsoft/signalr';

const Game = () => {
  const {
    createLobby,
    joinLobby,
    startGame,
    getAvailableLobbies,
    availableLobbies,
    lobbyId,
    gamePhase,
    error,
    loading,
    connectionStatus,
    connectedPlayers,
    dispatch
  } = useGame();

  const [connection, setConnection] = useState(null);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [lobbyName, setLobbyName] = useState('');
  const [selectedLobbyId, setSelectedLobbyId] = useState('');
  const [view, setView] = useState('main');
  const [hasJoinedLobby, setHasJoinedLobby] = useState(false);

  const playersCount = connectedPlayers?.length || 0;

  // Setup SignalR connection when lobby is joined
  useEffect(() => {
    if (!hasJoinedLobby || !lobbyId) return;

    console.log(`[${playerName}] Setting up SignalR connection for lobby:`, lobbyId);

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7132/beloteHub?lobbyId=${encodeURIComponent(lobbyId)}`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Handler registration - add connection ID to logs
    hubConnection.on("PlayerJoined", (player) => {
      console.log(`[${playerName}] EVENT: Player joined:`, player);
      dispatch({ type: 'PLAYER_JOINED', payload: player });
    });

    hubConnection.on("PlayerLeft", (player) => {
      console.log("EVENT: Player left:", player);
      dispatch({ type: 'PLAYER_LEFT', payload: player });
    });

    hubConnection.on("PlayersUpdated", (players) => {
      console.log(`[${playerName}] EVENT: Players updated:`, players);
      dispatch({ type: 'SET_CONNECTED_PLAYERS', payload: players });
    });

    hubConnection.on("GameStarted", () => {
      console.log("EVENT: Game started");
      dispatch({ type: 'SET_PHASE', payload: 'bidding' });
    });

    // Connect and register
    hubConnection.start()
      .then(() => {
        console.log(`[${playerName}] SignalR Connected!`);
        setConnection(hubConnection);

        // Register with the hub after connection
        return hubConnection.invoke("JoinLobby", lobbyId, playerName);
      })
      .then(() => {
        console.log(`[${playerName}] Registered with hub`);
      })
      .catch(err => {
        console.error(`[${playerName}] SignalR Connection Error:`, err);
      });

    // Cleanup
    return () => {
      hubConnection?.stop();
    };
  }, [hasJoinedLobby, lobbyId, playerName, dispatch]);

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

  const handleStartGame = async () => {
    if (connection && isHost && playersCount === 4) {
      await startGame();
      await connection.invoke("StartGame", selectedLobbyId);
    }
  };

  const refreshLobbies = () => {
    getAvailableLobbies();
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // If the player hasn't joined a lobby, show the lobby creation/joining UI
  if (!hasJoinedLobby) {
    return (
      <div className="lobby-container">
        <h1>Welcome to Belote</h1>
        {/* Existing lobby UI code */}
        {view === 'main' && (
          <div className="lobby-main">
            <div className="lobby-options">
              <button className="lobby-option-btn" onClick={() => setView('create')}>
                Create New Lobby
              </button>
              <button className="lobby-option-btn" onClick={() => setView('join')}>
                Join Existing Lobby
              </button>
            </div>
          </div>
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
      </div>
    );
  }

  const isHost = connectedPlayers.length > 0 && connectedPlayers[0]?.name === playerName;

  // Display waiting room if we're not in the game yet
  if (gamePhase === 'waiting') {
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

  // Display the game interface
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