import React, { createContext, useReducer, useContext, useEffect, useRef } from 'react';
import apiService from '../services/api';
import websocketService from '../services/webSocket';

const GameContext = createContext(null);

const initialState = {
  lobbyId: null,
  lobbyName: '',
  playerName: '',
  connectedPlayers: [],          // single source of truth
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

    // Unified game state update
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

    // Allow legacy dispatches
    case 'SET_PLAYERS':
    case 'SET_CONNECTED_PLAYERS':
      return {
        ...state,
        connectedPlayers: Array.isArray(action.payload)
          ? [...action.payload]
          : []
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
  const autoStartRef = useRef(false);

  // WebSocket bindings
  useEffect(() => {
    const onGameState = gs => dispatch({ type: 'SET_GAME_STATE', payload: gs });
    const onPlayerJoined = p => dispatch({ type: 'PLAYER_JOINED', payload: p });
    const onPlayerLeft = p => dispatch({ type: 'PLAYER_LEFT', payload: p });
    const onConnected = () =>
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
    const onDisconnected = () =>
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' });
    const onError = err => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'error' });
      dispatch({
        type: 'SET_ERROR',
        payload: err?.message || 'WebSocket error'
      });
    };

    websocketService.on('gameStateUpdate', onGameState);
    websocketService.on('playerJoined', onPlayerJoined);
    websocketService.on('playerLeft', onPlayerLeft);
    websocketService.on('connected', onConnected);
    websocketService.on('disconnected', onDisconnected);
    websocketService.on('error', onError);

    return () => {
      websocketService.off('gameStateUpdate', onGameState);
      websocketService.off('playerJoined', onPlayerJoined);
      websocketService.off('playerLeft', onPlayerLeft);
      websocketService.off('connected', onConnected);
      websocketService.off('disconnected', onDisconnected);
      websocketService.off('error', onError);
    };
  }, []);

  // Connect WebSocket
  useEffect(() => {
    if (
      state.playerName &&
      state.lobbyId &&
      state.connectionStatus === 'disconnected'
    ) {
      websocketService.connect(state.playerName, state.lobbyId);
    }
  }, [state.playerName, state.lobbyId, state.connectionStatus]);

  // Optional auto-start
  useEffect(() => {
    if (
      state.gamePhase === 'waiting' &&
      state.connectedPlayers.length === 4 &&
      state.connectedPlayers[0]?.name === state.playerName &&
      !autoStartRef.current
    ) {
      autoStartRef.current = true;
      apiService.startGame?.(state.lobbyId).catch(() => {
        autoStartRef.current = false;
      });
    }
  }, [
    state.connectedPlayers,
    state.gamePhase,
    state.playerName,
    state.lobbyId
  ]);

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

  // Provide both connectedPlayers and a players alias
  const value = {
    ...state,
    players: state.connectedPlayers, // alias (if some components still use players)
    connectedPlayers: state.connectedPlayers,
    createLobby,
    joinLobby,
    startGame,
    getAvailableLobbies,
    dispatch
  };

  return (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}