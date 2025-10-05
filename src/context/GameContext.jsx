import React, { createContext, useReducer, useContext, useEffect } from 'react';
import apiService from '../services/api';
import signalRService from '../services/signalRService';

const GameContext = createContext(null);

const initialState = {
  lobby: null,
  playerName: '',
  availableLobbies: [],
  loading: false,
  error: null,
  connectionStatus: 'disconnected',
  isHost: false
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
    case 'SET_LOBBY':
      return { ...state, lobby: action.payload };
    case 'SET_IS_HOST':
      return { ...state, isHost: action.payload };
    case 'SET_AVAILABLE_LOBBIES':
      return { ...state, availableLobbies: Array.isArray(action.payload) ? action.payload : [] };
    case 'CLEAR_STATE':
      return { ...initialState };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (!state.lobby?.id || !state.playerName) return;

    const onPlayerJoined = (lobby) => {
      console.log(`✅ EVENT RECEIVED: PlayerJoined`, lobby);
      dispatch({ type: 'SET_LOBBY', payload: lobby });
    };

    const onPlayerLeft = (lobby) => {
      console.log(`✅ EVENT RECEIVED: PlayerLeft`, lobby);
      dispatch({ type: 'SET_LOBBY', payload: lobby });
    }
    const onStartGame = (lobby) => {
      console.log(`✅ EVENT RECEIVED: StartGame`, lobby);
      dispatch({ type: 'SET_LOBBY', payload: lobby });
    };

    // Listen for authoritative event from the backend.
    signalRService.on('PlayerJoined', onPlayerJoined);
    signalRService.on('PlayerLeft', onPlayerLeft);
    signalRService.on('StartGame', onStartGame);

    async function connectToHub() {
      try {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connecting' });
        await signalRService.connect(state.lobby.id, state.playerName);
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }

    connectToHub();

    return () => {
      signalRService.off('PlayerJoined', onPlayerJoined);
      signalRService.off('PlayerLeft', onPlayerLeft);
      signalRService.off('StartGame', onStartGame);
      signalRService.disconnect();
    };
  }, [state.lobby?.id, state.playerName]);

  const createLobby = async (playerName, lobbyName) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { lobby } = await apiService.createLobby(playerName, lobbyName);
      dispatch({ type: 'SET_PLAYER_NAME', payload: playerName });
      dispatch({ type: 'SET_LOBBY', payload: lobby });
      dispatch({ type: 'SET_IS_HOST', payload: true });
      return lobby;
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const joinLobby = async (playerName, selectedLobbyId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { lobby } = await apiService.joinLobby(playerName, selectedLobbyId);
      dispatch({ type: 'SET_PLAYER_NAME', payload: playerName });
      dispatch({ type: 'SET_LOBBY', payload: lobby });
      return lobby;
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const leaveLobby = async () => {
    if (!state.lobby?.id) return;
    await apiService.leaveLobby(state.playerName, state.lobby.id);
    dispatch({ type: 'CLEAR_STATE' }); // Just clear the state, server handles the rest.
  };

  const getAvailableLobbies = async () => {
    const list = await apiService.getAvailableLobbies();
    dispatch({ type: 'SET_AVAILABLE_LOBBIES', payload: list || [] });
  };

  const startGame = async () => {
    if (!state.lobby?.id) return;
    await apiService.startGame(state.lobby.id);
    dispatch({ type: 'SET_PHASE', payload: "playing" });
  };

  const value = {
    ...state,
    connectedPlayers: state.lobby?.connectedPlayers || [],
    gamePhase: state.lobby?.phase || 'waiting',
    createLobby,
    joinLobby,
    leaveLobby,
    startGame,
    getAvailableLobbies,
    dispatch,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
}