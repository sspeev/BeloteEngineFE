import {
  SET_LOADING,
  SET_ERROR,
  SET_CONNECTION_STATUS,
  SET_PLAYER_NAME,
  SET_LOBBY,
  SET_IS_HOST,
  SET_AVAILABLE_LOBBIES,
  CLEAR_STATE
} from '../actions/gameActionTypes.js';

export const initialState = {
  lobby: null,
  playerName: '',
  availableLobbies: [],
  loading: false,
  error: null,
  connectionStatus: 'disconnected',
  isHost: false
};

export function gameReducer(state, action) {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case SET_CONNECTION_STATUS:
      return { ...state, connectionStatus: action.payload };
    case SET_PLAYER_NAME:
      return { ...state, playerName: action.payload };
    case SET_LOBBY:
      return { ...state, lobby: action.payload };
    case SET_IS_HOST:
      return { ...state, isHost: action.payload };
    case SET_AVAILABLE_LOBBIES:
      return { ...state, availableLobbies: Array.isArray(action.payload) ? action.payload : [] };
    case CLEAR_STATE:
      return { ...initialState };
    default:
      return state;
  }
}