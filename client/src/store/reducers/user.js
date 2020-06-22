import {
  CLEAR_CURRENT_USER,
  SET_CURRENT_USER,
  SET_USER_LOADING,
  SET_USER_ERROR,
  SET_USER_ON_USER_LEFT,
  SET_USER_WORD_LIST,
  SET_USER_SELECTED_WORD,
  UPDATE_USER_PICKING_REMAINING_TIME,
  RESET_CURRENT_PLAYER,
} from '../actions/types';

const initialState = {
  loading: false,
  user: {
    name: null,
    isHost: false,
    score: 0,
    words: null,
    isCurrentPlayer: false,
    selectedWord: null,
    pickingRemainingTime: null,
  },
  errors: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_USER_LOADING:
      return {
        loading: true,
        user: {},
        errors: {},
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        loading: false,
        user: payload,
      };
    case CLEAR_CURRENT_USER:
      return {
        ...state,
        user: {},
      };
    case SET_USER_ERROR:
      return {
        ...state,
        errors: action.payload,
      };
    case SET_USER_ON_USER_LEFT:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          isHost: state.user.name === action.payload.newHost,
        },
      };
    case SET_USER_WORD_LIST:
      return {
        ...state,
        user: {
          ...state.user,
          words: action.payload,
          isCurrentPlayer: true,
        },
      };
    case RESET_CURRENT_PLAYER:
      return {
        ...state,
        user: {
          ...state.user,
          words: null,
          isCurrentPlayer: false,
        },
      };
    case SET_USER_SELECTED_WORD:
      return {
        ...state,
        user: {
          ...state.user,
          selectedWord: action.payload,
        },
      };
    case UPDATE_USER_PICKING_REMAINING_TIME:
      return {
        ...state,
        user: {
          ...state.user,
          pickingRemainingTime: action.payload,
        },
      };
    default:
      return state;
  }
}
