import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';
import websocketService from '../services/websocket';

const GameContext = createContext();

const initialState = {
  gameId: null,
  playerId: null,
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
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_GAME_STATE':
      return { 
        ...state, 
        gameState: action.payload, 
        players: action.payload.players || [],
        currentHand: action.payload.playerHands?.[state.playerId] || [],
        currentTrick: action.payload.currentTrick || [],
        scores: action.payload.scores || {},
        currentPlayer: action.payload.currentPlayer,
        gamePhase: action.payload.phase || 'waiting',
        loading: false, 
        error: null 
      };
    case 'SET_PLAYER_INFO':
      return { ...state, playerId: action.payload.playerId, playerName: action.payload.playerName };
    case 'SET_GAME_ID':
      return { ...state, gameId: action.payload };
    case 'UPDATE_HAND':
      return { ...state, currentHand: action.payload };
    case 'UPDATE_TRICK':
      return { ...state, currentTrick: action.payload };
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    case 'PLAYER_JOINED':
      return { 
        ...state, 
        players: [...state.players.filter(p => p.id !== action.payload.id), action.payload]
      };
    case 'PLAYER_LEFT':
      return { 
        ...state, 
        players: state.players.filter(p => p.id !== action.payload.playerId)
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

  // Connect to WebSocket when game starts
  useEffect(() => {
    if (state.gameId && state.playerId) {
      websocketService.connect(state.gameId, state.playerId);
    }
  }, [state.gameId, state.playerId]);

  const createGame = async (playerName) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.createGame(playerName);
      dispatch({ type: 'SET_GAME_ID', payload: response.gameId });
      dispatch({ type: 'SET_PLAYER_INFO', payload: { playerId: response.playerId, playerName } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const joinGame = async (gameId, playerName) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.joinGame(gameId, playerName);
      dispatch({ type: 'SET_GAME_ID', payload: gameId });
      dispatch({ type: 'SET_PLAYER_INFO', payload: { playerId: response.playerId, playerName } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const playCard = async (cardId) => {
    try {
      await apiService.playCard(state.gameId, state.playerId, cardId);
      // Update will come from WebSocket
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const makeBid = async (bid) => {
    try {
      await apiService.makeBid(state.gameId, state.playerId, bid);
      // Update will come from WebSocket
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  return (
    <GameContext.Provider value={{
      ...state,
      createGame,
      joinGame,
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