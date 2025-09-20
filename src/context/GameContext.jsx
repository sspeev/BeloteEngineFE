import React, { createContext, useReducer, useContext, useEffect } from 'react';
import apiService from '../services/api';
import signalRService from '../services/signalRService';

const GameContext = createContext(null);

const initialState = {
  lobby: null,
  playerName: '',
  currentPlayer: null,
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
    // case 'SET_CURRENT_PLAYER':
    //   return { ...state, currentPlayer: action.payload };
    case 'SET_AVAILABLE_LOBBIES':
      return { ...state, availableLobbies: Array.isArray(action.payload) ? action.payload : [] };
    case 'SET_IS_HOST':
      return { ...state, isHost: action.payload };
    case 'CLEAR_LOBBY':
      return { ...initialState };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (!state.lobbyId || !state.playerName) return;

    const onLobbyStateUpdated = (lobbyData) => {
      console.log(`EVENT: Lobby state updated`, lobbyData);
      dispatch({ type: 'SET_LOBBY', payload: lobbyData });
    };

    signalRService.on('PlayersUpdated', onLobbyStateUpdated);
    signalRService.on('GameStarted', onLobbyStateUpdated);
    signalRService.on('GameStateUpdated', onLobbyStateUpdated);
    signalRService.on('PlayerJoined', onLobbyStateUpdated);
    signalRService.on('PlayerLeft', onLobbyStateUpdated);

    async function connectToHub() {
      try {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connecting' });
        await signalRService.connect(state.lobby.id, state.playerName);
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
      } catch (error) {
        console.error('SignalR connect failed:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }

    connectToHub();

    return () => {
      signalRService.off('PlayersUpdated', onLobbyStateUpdated);
      signalRService.off('GameStarted', onLobbyStateUpdated);
      signalRService.off('GameStateUpdated', onLobbyStateUpdated);
      signalRService.off('PlayerJoined', onLobbyStateUpdated);
      signalRService.off('PlayerLeft', onLobbyStateUpdated);
      signalRService.disconnect();
    };
  }, [state.lobby?.id, state.playerName]);

  // --- REFACTORED ACTION FUNCTIONS ---
  const createLobby = async (playerName, lobbyName) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { lobby } = await apiService.createLobby(playerName, lobbyName);
      dispatch({ type: 'SET_PLAYER_NAME', payload: playerName });
      dispatch({ type: 'SET_LOBBY', payload: lobby });
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_IS_HOST', payload: true });
      return lobby;
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  };

  const joinLobby = async (playerName, selectedLobbyId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { lobby, errorMessage } = await apiService.joinLobby(playerName, selectedLobbyId);
      if (errorMessage) throw new Error(errorMessage);
      dispatch({ type: 'SET_LOBBY', payload: lobby });
      dispatch({ type: 'SET_PLAYER_NAME', payload: playerName });
      dispatch({ type: 'SET_LOADING', payload: false });
      return lobby;
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  };

  const leaveLobby = async () => {
    if (!state.lobby?.id) return;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.leaveLobby(state.playerName, state.lobby.id);
      //dispatch({ type: 'CLEAR_LOBBY' });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  };

  const getAvailableLobbies = async () => {
    const list = await apiService.getAvailableLobbies();
    dispatch({ type: 'SET_AVAILABLE_LOBBIES', payload: list || [] });
  };

  const startGame = async () => {
    if (!state.lobby?.id) return;
    try {
      await apiService.startGame(state.lobby.id);
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  };

  const value = {
    ...state,
    lobbyId: state.lobby?.id,
    lobbyName: state.lobby?.name,
    connectedPlayers: state.lobby?.connectedPlayers || [],
    gamePhase: state.lobby?.phase || 'waiting',
    playerName: state.playerName,
    currentPlayer: state.lobby?.currentPlayer || null,
    isHost: state.isHost,

    // Functions
    createLobby,
    joinLobby,
    leaveLobby,
    startGame,
    getAvailableLobbies,
    dispatch,
  };

  return (
    <GameContext.Provider value={value}>
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