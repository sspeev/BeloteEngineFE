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
    case 'SET_CONNECTED_PLAYERS':
      return {
        ...state,
        connectedPlayers: Array.isArray(action.payload)
          ? [...action.payload]
          : [],
        playersCount: action.payload.length
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

export function GameProvider({ children, lobbyId, playerName, token }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

    useEffect(() => {
    dispatch({ type: 'SET_CURRENT_PLAYER', payload: playerName });
    
    // Connect to SignalR
    signalRService.connect(lobbyId, token)
      .then(() => {
        dispatch({ type: 'CONNECTION_STATE', payload: "connected" });
        return signalRService.invoke('JoinGame', lobbyId);
      })
      .catch(error => {
        console.error('Error connecting to SignalR or joining game:', error);
      });
    
    // Listen for player count updates
    signalRService.on('playerCountUpdated', (count) => {
      dispatch({ type: 'UPDATE_PLAYER_COUNT', payload: count });
    });
    
    // Listen for player list updates
    signalRService.on('playersUpdated', (players) => {
      dispatch({ type: 'UPDATE_PLAYERS', payload: players });
    });
    
    // Listen for game start
    signalRService.on('gameStarted', () => {
      dispatch({ type: 'GAME_STARTED' });
    });
    
    // Cleanup on unmount
    return () => {
      signalRService.disconnect();
    };
  }, [lobbyId, playerName, token]);

  const fetchInitialState = async lobbyId => {
    try {
      const gs = await apiService.getLobbyState(lobbyId);
      if (gs) dispatch({ type: 'SET_GAME_STATE', payload: gs });
    } catch {
      /* silent */
    }
  };

  const getAvailableLobbies = async () => {
    try {
      const list = await apiService.getAvailableLobbies();
      dispatch({ type: 'SET_AVAILABLE_LOBBIES', payload: list || [] });
      return list;
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
      return [];
    }
  };

  const createLobby = async (playerName, lobbyName) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Expect backend response: { lobby: { id, name, connectedPlayers: [] } }
      const { lobby } = await apiService.createLobby(playerName, lobbyName);
      if (!lobby) throw new Error('Lobby creation failed');

      dispatch({ type: 'SET_LOBBY_ID', payload: lobby.id });
      dispatch({ type: 'SET_PLAYER_NAME', payload: playerName });
      dispatch({
        type: 'SET_LOBBY_NAME',
        payload: lobby.name || lobbyName || `Lobby ${lobby.id}`
      });

      if (lobby.connectedPlayers)
        dispatch({
          type: 'SET_CONNECTED_PLAYERS',
          payload: lobby.connectedPlayers
        });

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

      if (!state.availableLobbies.length) await getAvailableLobbies();
      const found = state.availableLobbies.find(
        l => (l.id || l.lobbyId) === lobbyId
      );
      const foundName = found?.name || found?.lobbyName;

      // Expect backend response: { lobby, error? }
      const { lobby, error } = await apiService.joinLobby(playerName, lobbyId);
      if (error) throw new Error(error);

      dispatch({ type: 'SET_LOBBY_ID', payload: lobbyId });
      dispatch({ type: 'SET_PLAYER_NAME', payload: playerName });
      dispatch({
        type: 'SET_LOBBY_NAME',
        payload: lobby?.name || foundName || `Lobby ${lobbyId}`
      });

      if (lobby?.connectedPlayers)
        dispatch({
          type: 'SET_CONNECTED_PLAYERS',
          payload: lobby.connectedPlayers
        });

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
      await apiService.startGame?.(state.lobbyId);
      // New game state will arrive via WebSocket
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  };

  const statingVariables = {
    ...state,
    connectedPlayers: state.connectedPlayers,
    playersCount: state.connectedPlayers.length,
    createLobby,
    joinLobby,
    startGame,
    getAvailableLobbies,
    dispatch
  };

  return (
    <GameContext.Provider value={
      statingVariables
    }>
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