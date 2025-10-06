import { createContext, useReducer, useContext, useEffect } from 'react';
import apiService from '../../services/api.js';
import signalRService from '../../services/signalRService.js';
import { initialState, gameReducer } from '../../hooks/gameReducer.js';
import {
  SET_LOADING,
  SET_ERROR,
  SET_CONNECTION_STATUS,
  SET_PLAYER_NAME,
  SET_LOBBY,
  SET_IS_HOST,
  SET_AVAILABLE_LOBBIES,
  CLEAR_STATE
} from '../../actions/gameActionTypes.js';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (!state.lobby?.id || !state.playerName) return;

    const onPlayerJoined = (lobby) => {
      console.log('✅ EVENT RECEIVED: PlayerJoined', lobby);
      dispatch({ type: SET_LOBBY, payload: lobby });
    };
    const onPlayerLeft = (lobby) => {
      console.log('✅ EVENT RECEIVED: PlayerLeft', lobby);
      dispatch({ type: SET_LOBBY, payload: lobby });
    };
    const onStartGame = (lobby) => {
      console.log('✅ EVENT RECEIVED: StartGame', lobby);
      dispatch({ type: SET_LOBBY, payload: lobby });
    };

    signalRService.on('PlayerJoined', onPlayerJoined);
    signalRService.on('PlayerLeft', onPlayerLeft);
    signalRService.on('StartGame', onStartGame);

    (async () => {
      try {
        dispatch({ type: SET_CONNECTION_STATUS, payload: 'connecting' });
        await signalRService.connect(state.lobby.id, state.playerName);
        dispatch({ type: SET_CONNECTION_STATUS, payload: 'connected' });
      } catch (error) {
        dispatch({ type: SET_ERROR, payload: error.message });
      }
    })();

    return () => {
      signalRService.off('PlayerJoined', onPlayerJoined);
      signalRService.off('PlayerLeft', onPlayerLeft);
      signalRService.off('StartGame', onStartGame);
      signalRService.disconnect();
    };
  }, [state.lobby?.id, state.playerName]);

  const createLobby = async (playerName, lobbyName) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const { lobby } = await apiService.createLobby(playerName, lobbyName);
      dispatch({ type: SET_PLAYER_NAME, payload: playerName });
      dispatch({ type: SET_LOBBY, payload: lobby });
      dispatch({ type: SET_IS_HOST, payload: true });
      return lobby;
    } catch (e) {
      dispatch({ type: SET_ERROR, payload: e.message });
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  const joinLobby = async (playerName, selectedLobbyId) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const { lobby } = await apiService.joinLobby(playerName, selectedLobbyId);
      dispatch({ type: SET_PLAYER_NAME, payload: playerName });
      dispatch({ type: SET_LOBBY, payload: lobby });
      return lobby;
    } catch (e) {
      dispatch({ type: SET_ERROR, payload: e.message });
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  const leaveLobby = async () => {
    if (!state.lobby?.id) return;
    await apiService.leaveLobby(state.playerName, state.lobby.id);
    dispatch({ type: CLEAR_STATE });
  };

  const getAvailableLobbies = async () => {
    const list = await apiService.getAvailableLobbies();
    dispatch({ type: SET_AVAILABLE_LOBBIES, payload: list || [] });
  };

  const startGame = async () => {
    if (!state.lobby?.id) return;
    try {
      const { lobby } = await apiService.startGame(state.lobby.id);
      dispatch({ type: SET_LOBBY, payload: lobby });
    } catch (e) {
      dispatch({ type: SET_ERROR, payload: e.message });
    }
  };

  const value = {
    ...state,
    connectedPlayers: state.lobby?.connectedPlayers || [],
    gamePhase: state.lobby?.gamePhase,
    createLobby,
    joinLobby,
    leaveLobby,
    startGame,
    getAvailableLobbies,
    dispatch
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
}