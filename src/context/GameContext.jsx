import React, { createContext, useReducer, useContext, useEffect } from 'react';
import apiService from '../services/api';
import signalRService from '../services/signalRService';

const GameContext = createContext(null);

const initialState = {
  lobbyId: null,
  lobbyName: '',
  playerName: '',
  connectedPlayers: [],
  playersCount: 0,
  gameState: null,
  gamePhase: 'waiting',
  currentPlayer: null,
  availableLobbies: [],
  loading: false,
  error: null,
  connectionStatus: 'disconnected'
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.payload };
    case 'SET_LOBBY_ID':
      return { ...state, lobbyId: action.payload };
    case 'SET_LOBBY_NAME':
      return { ...state, lobbyName: action.payload || '' };
    case 'SET_PHASE':
      return { ...state, gamePhase: action.payload };
    case 'SET_GAME_STATE': {
      const gs = action.payload || {};
      return {
        ...state,
        gameState: gs,
        connectedPlayers: gs.connectedPlayers
          ? [...gs.connectedPlayers]
          : state.connectedPlayers,
        gamePhase: gs.phase || state.gamePhase,
        currentPlayer: gs.currentPlayer ?? state.currentPlayer,
        loading: false
      };
    }
    case 'SET_CURRENT_PLAYER':
      return { ...state, currentPlayer: action.payload };
    case 'SET_CONNECTED_PLAYERS':
      return {
        ...state,
        connectedPlayers: Array.isArray(action.payload) ? [...action.payload] : [],
        playersCount: Array.isArray(action.payload) ? action.payload.length : 0
      };
    case 'PLAYER_JOINED': {
      const p = action.payload;
      if (!p) return state;
      const exists = state.connectedPlayers.some(x => x.id === p.id);
      const connectedPlayers = exists
        ? state.connectedPlayers.map(x => (x.id === p.id ? p : x))
        : [...state.connectedPlayers, p];
      return { ...state, connectedPlayers };
    }
    case 'PLAYER_LEFT': {
      const id = action.payload?.playerId || action.payload?.id;
      if (!id) return state;
      return {
        ...state,
        connectedPlayers: state.connectedPlayers.filter(p => p.id !== id)
      };
    }

    case 'SET_AVAILABLE_LOBBIES':
      return {
        ...state,
        availableLobbies: Array.isArray(action.payload) ? action.payload : []
      };

    case 'CLEAR_LOBBY':
      return { ...initialState };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Connect to SignalR when we have lobbyId
  useEffect(() => {
    if (!state.lobbyId) return;

    dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connecting' });

    signalRService.connect(state.lobbyId)
      .then(() => {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });

        // Optional: tell server we joined (depends on your hub)
        signalRService.invoke('JoinLobby', state.lobbyId, state.playerName).catch(() => { });
      })
      .catch(error => {
        console.error('SignalR connect failed:', error);
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'error' });
        dispatch({ type: 'SET_ERROR', payload: error.message });
      });

    // Handlers from server (ensure these names match your Hub)
    const onPlayersUpdated = (players) => {
      dispatch({ type: 'SET_CONNECTED_PLAYERS', payload: players || [] });
    };
    const onPlayerJoined = (player) => {
      dispatch({ type: 'PLAYER_JOINED', payload: player });
    };
    const onPlayerLeft = (player) => {
      dispatch({ type: 'PLAYER_LEFT', payload: player });
    };
    const onGameState = (gs) => {
      dispatch({ type: 'SET_GAME_STATE', payload: gs });
    };
    const onGameStarted = () => {
      dispatch({ type: 'SET_PHASE', payload: 'bidding' });
    };

    // Register (PascalCase to match common SignalR naming)
    signalRService.on('PlayersUpdated', onPlayersUpdated);
    signalRService.on('PlayerJoined', onPlayerJoined);
    signalRService.on('PlayerLeft', onPlayerLeft);
    signalRService.on('GameStateUpdated', onGameState);
    signalRService.on('GameStarted', onGameStarted);

    return () => {
      signalRService.off('PlayersUpdated', onPlayersUpdated);
      signalRService.off('PlayerJoined', onPlayerJoined);
      signalRService.off('PlayerLeft', onPlayerLeft);
      signalRService.off('GameStateUpdated', onGameState);
      signalRService.off('GameStarted', onGameStarted);
      signalRService.disconnect();
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' });
    };
  }, [state.lobbyId]);

  const fetchInitialState = async (lobbyId) => {
    try {
      const gs = await apiService.getLobbyState(lobbyId);
      if (gs) dispatch({ type: 'SET_GAME_STATE', payload: gs });
    } catch { /* silent */ }
  };

  const createLobby = async (playerName, lobbyName) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { lobby } = await apiService.createLobby(playerName, lobbyName);
      if (!lobby) throw new Error('Lobby creation failed');

      dispatch({ type: 'SET_LOBBY_ID', payload: lobby.id });
      dispatch({ type: 'SET_PLAYER_NAME', payload: playerName });
      dispatch({ type: 'SET_LOBBY_NAME', payload: lobby.name || lobbyName || `Lobby ${lobby.id}` });
      if (lobby.connectedPlayers) {
        dispatch({ type: 'SET_CONNECTED_PLAYERS', payload: lobby.connectedPlayers });
      }

      await fetchInitialState(lobby.id);
      dispatch({ type: 'SET_LOADING', payload: false });
      return lobby;
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const joinLobby = async (playerName, lobbyId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      if (!state.availableLobbies.length) {
        const list = await apiService.getAvailableLobbies();
        dispatch({ type: 'SET_AVAILABLE_LOBBIES', payload: list || [] });
      }

      const { lobby, error } = await apiService.joinLobby(playerName, lobbyId);
      if (error) throw new Error(error);

      dispatch({ type: 'SET_LOBBY_ID', payload: lobbyId });
      dispatch({ type: 'SET_PLAYER_NAME', payload: playerName });
      dispatch({ type: 'SET_LOBBY_NAME', payload: lobby?.name || `Lobby ${lobbyId}` });
      if (lobby?.connectedPlayers) {
        dispatch({ type: 'SET_CONNECTED_PLAYERS', payload: lobby.connectedPlayers });
      }

      await fetchInitialState(lobbyId);
      dispatch({ type: 'SET_LOADING', payload: false });
      return lobby;
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const startGame = async () => {
    if (!state.lobbyId) return;
    try {
      await apiService.startGame(state.lobbyId);
      // server should emit GameStarted/GameStateUpdated
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  };

  const startingVariables = {
    ...state,
    connectedPlayers: state.connectedPlayers,
    playersCount: state.connectedPlayers.length,
    createLobby,
    joinLobby,
    startGame,
    getAvailableLobbies: async () => {
      const list = await apiService.getAvailableLobbies();
      dispatch({ type: 'SET_AVAILABLE_LOBBIES', payload: list || [] });
      return list;
    },
    dispatch
  };

  return (
    <GameContext.Provider value={startingVariables}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}