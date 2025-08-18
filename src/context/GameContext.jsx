import React, { createContext, useReducer, useContext, useEffect } from 'react';
import apiService from '../services/api';
import signalRService from '../services/signalRService';

const GameContext = createContext(null);

const initialState = {
  lobbyId: null,
  lobbyName: '',
  playerName: '',
  connectedPlayers: [],
  //gameState: null,
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
    // case 'SET_GAME_STATE': {
    //   const gs = action.payload || {};
    //   return {
    //     ...state,
    //     gameState: gs,
    //     connectedPlayers: gs.connectedPlayers
    //       ? [...gs.connectedPlayers]
    //       : state.connectedPlayers,
    //     gamePhase: gs.phase || state.gamePhase,
    //     currentPlayer: gs.currentPlayer ?? state.currentPlayer,
    //     loading: false
    //   };
    // }
    case 'SET_CURRENT_PLAYER':
      return { ...state, currentPlayer: action.payload };
    case 'SET_CONNECTED_PLAYERS':
      console.log('REDUCER: Set connected players', action.payload);
      return { ...state, connectedPlayers: [...action.payload] }; // new array ref
    case 'PLAYER_JOINED': {
      console.log('REDUCER: Player joined action received', action.payload);

      // Create a new player object
      const newPlayer = action.payload;

      // Only add if not already present (avoid duplicates)
      const alreadyExists = state.connectedPlayers.some(
        p => p.id === newPlayer.id || p.name === newPlayer.name
      );

      // Important: ALWAYS return a new array to trigger React re-render
      return {
        ...state,
        connectedPlayers: alreadyExists
          ? [...state.connectedPlayers]  // copy array even if no change
          : [...state.connectedPlayers, newPlayer]  // add the new player
      };
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

  //Connection SignalR
  useEffect(() => {
    if (!state.lobbyId || !state.playerName) return;

    const onPlayersUpdated = (players) => {
      console.log(`[${state.playerName}] EVENT: Players updated:`, players);
      dispatch({ type: 'SET_CONNECTED_PLAYERS', payload: players || [] });
    };
    const onPlayerJoined = (payload) => {
      console.log(`[${state.playerName}] EVENT: Player joined:`, payload);
      dispatch({ type: 'PLAYER_JOINED', payload });
    };
    const onPlayerLeft = (payload) => {
      console.log(`[${state.playerName}] EVENT: Player left:`, payload);
      dispatch({ type: 'PLAYER_LEFT', payload });
    };
    // const onGameState = (gs) => {

    //   dispatch({ type: 'SET_GAME_STATE', payload: gs });
    // };
    const onGameStarted = () => {
      console.log("EVENT: Game started");
      dispatch({ type: 'SET_PHASE', payload: 'bidding' });
    };

    // Register event handlers BEFORE connecting
    signalRService.on('PlayersUpdated', onPlayersUpdated);
    signalRService.on('PlayerJoined', onPlayerJoined);
    signalRService.on('PlayerLeft', onPlayerLeft);
    signalRService.on('GameStarted', onGameStarted);

    // Connect and wait, don't try to invoke immediately
    async function connectToHub() {
      try {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connecting' });
        await signalRService.connect(state.lobbyId, state.playerName);
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });

        // Ensure connection is ready before invoking
        // If needed, you can now safely invoke methods
        // await signalRService.invoke('SomeMethod', ...args);
      } catch (error) {
        console.error('SignalR connect failed:', error);
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'error' });
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }

    connectToHub();

    return () => {
      // Cleanup handlers
      signalRService.off('PlayersUpdated', onPlayersUpdated);
      signalRService.off('PlayerJoined', onPlayerJoined);
      signalRService.off('PlayerLeft', onPlayerLeft);
      signalRService.off('GameStarted', onGameStarted);
      signalRService.disconnect();
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' });
    };
  }, [state.lobbyId, state.playerName, state.dispatch]);

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

      // Get lobby list if needed
      if (!state.availableLobbies.length) {
        const list = await apiService.getAvailableLobbies();
        dispatch({ type: 'SET_AVAILABLE_LOBBIES', payload: list || [] });
      }

      // Join via HTTP API first
      const  {lobby, errorMessage } = await apiService.joinLobby(playerName, lobbyId);
      if (errorMessage) throw new Error(errorMessage);

      // Update state with initial values
      dispatch({ type: 'SET_LOBBY_ID', payload: lobbyId });
      dispatch({ type: 'SET_PLAYER_NAME', payload: playerName });
      dispatch({ type: 'SET_LOBBY_NAME', payload: lobby?.name });

      if (lobby?.connectedPlayers) {
        dispatch({ type: 'SET_CONNECTED_PLAYERS', payload: lobby.connectedPlayers });
      }

      try {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connecting' });

        // Connect to SignalR and ensure it's fully ready
        await signalRService.connect(lobbyId, playerName);
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });

        // The connection is now guaranteed to be ready for invocations
        console.log('SignalR ready, invoking JoinLobby...');
        await signalRService.invoke('JoinLobby', lobbyId, playerName);
        console.log('JoinLobby invocation complete');

      } catch (connError) {
        console.error('SignalR connection/join failed:', connError);
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'error' });
        dispatch({ type: 'SET_ERROR', payload: `SignalR error: ${connError.message}` });
      }

      // Complete the process
      await fetchInitialState(lobbyId);
      dispatch({ type: 'SET_LOADING', payload: false });
      return lobby;
    } catch (e) {
      console.error('Join lobby failed:', e);
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