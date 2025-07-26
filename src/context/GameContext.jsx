import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';
import websocketService from '../services/webSocket';

const GameContext = createContext();

const initialState = {
  lobbyId: null,
  playerName: '',
  gameState: null,
  loading: false,
  error: null,
  players: [],
  currentHand: [],
  currentTrick: [],
  scores: {},
  currentPlayer: null,
  gamePhase: 'waiting',
  connectionStatus: 'disconnected',
  availableLobbies: [],
  lobbyInfo: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_LOBBY_ID':
      return { ...state, lobbyId: action.payload };
    case 'SET_LOBBY_INFO':
      return { ...state, lobbyInfo: action.payload };
    case 'SET_AVAILABLE_LOBBIES':
      return { ...state, availableLobbies: action.payload };
    case 'SET_GAME_STATE':
      return {
        ...state,
        gameState: action.payload,
        players: action.payload.players || [],
        currentHand: action.payload.playerHands?.[state.playerName] || [],
        currentTrick: action.payload.currentTrick || [],
        scores: action.payload.scores || {},
        currentPlayer: action.payload.currentPlayer,
        gamePhase: action.payload.phase || 'waiting',
        loading: false,
        error: null
      };
    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.payload };
    case 'UPDATE_HAND':
      return { ...state, currentHand: action.payload };
    case 'UPDATE_TRICK':
      return { ...state, currentTrick: action.payload };
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    case 'PLAYER_JOINED':
      return {
        ...state,
        players: [...state.players.filter(p => p.name !== action.payload.name), action.payload]
      };
    case 'PLAYER_LEFT':
      return {
        ...state,
        players: state.players.filter(p => p.name !== action.payload.playerName)
      };
    case 'CLEAR_LOBBY':
      return {
        ...state,
        lobbyId: null,
        gameState: null,
        players: [],
        currentHand: [],
        currentTrick: [],
        scores: {},
        gamePhase: 'waiting',
        lobbyInfo: null
      };
    case 'RESET_GAME':
      websocketService.disconnect();
      return initialState;
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // WebSocket event handlers
  useEffect(() => {
    const handleGameStateUpdate = (gameState) => {
      dispatch({ type: 'SET_GAME_STATE', payload: gameState });
    };

    const handlePlayerJoined = (player) => {
      dispatch({ type: 'PLAYER_JOINED', payload: player });
    };

    const handlePlayerLeft = (data) => {
      dispatch({ type: 'PLAYER_LEFT', payload: data });
    };

    const handleConnected = () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
    };

    const handleDisconnected = () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' });
    };

    const handleError = (error) => {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'WebSocket error' });
    };

    // Register WebSocket event listeners
    websocketService.on('gameStateUpdate', handleGameStateUpdate);
    websocketService.on('playerJoined', handlePlayerJoined);
    websocketService.on('playerLeft', handlePlayerLeft);
    websocketService.on('connected', handleConnected);
    websocketService.on('disconnected', handleDisconnected);
    websocketService.on('error', handleError);

    return () => {
      // Cleanup event listeners
      websocketService.off('gameStateUpdate', handleGameStateUpdate);
      websocketService.off('playerJoined', handlePlayerJoined);
      websocketService.off('playerLeft', handlePlayerLeft);
      websocketService.off('connected', handleConnected);
      websocketService.off('disconnected', handleDisconnected);
      websocketService.off('error', handleError);
    };
  }, []);

  // Connect to WebSocket when player joins a lobby
  useEffect(() => {
    if (state.playerName && state.lobbyId) {
      websocketService.connect(state.playerName, state.lobbyId);
    }
  }, [state.playerName, state.lobbyId]);

  const createLobby = async (playerName, lobbyName = null) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.createLobby(playerName, lobbyName);

      dispatch({ type: 'SET_LOBBY_ID', payload: response.lobbyId });
      dispatch({ type: 'SET_PLAYER_NAME', payload: playerName });
      dispatch({ type: 'SET_LOADING', payload: false });

      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const joinLobby = async (playerName, lobbyId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.joinLobby(playerName, lobbyId);

      dispatch({ type: 'SET_LOBBY_ID', payload: lobbyId });
      dispatch({ type: 'SET_PLAYER_NAME', payload: playerName });
      dispatch({ type: 'SET_LOADING', payload: false });

      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const getAvailableLobbies = async () => {
    try {
      const lobbies = await apiService.getAvailableLobbies();
      dispatch({ type: 'SET_AVAILABLE_LOBBIES', payload: lobbies });
      return lobbies;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const leaveLobby = async () => {
    try {
      await apiService.leaveLobby(state.playerName, state.lobbyId);
      websocketService.disconnect();
      dispatch({ type: 'CLEAR_LOBBY' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const playCard = async (cardId) => {
    try {
      await apiService.playCard(state.playerName, cardId, state.lobbyId);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const makeBid = async (bid) => {
    try {
      await apiService.makeBid(state.playerName, bid, state.lobbyId);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  return (
    <GameContext.Provider value={{
      ...state,
      createLobby,
      joinLobby,
      getAvailableLobbies,
      leaveLobby,
      playCard,
      makeBid,
      dispatch,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};