import {
  SET_ROOM_LOADING,
  SET_ROOM,
  SET_ROOM_ID,
  SET_ROOM_ON_PRIVATE_JOIN,
  SET_ROOM_ERROR,
  SET_ROOM_NAVIGATED_FROM,
  SET_ROOM_ON_SETTINGS_UPDATED,
  SET_ROOM_ON_USER_LEFT,
  RECEIVE_MESSAGE_FROM_ROOM,
  RECEIVE_OLD_MESSAGES_FROM_ROOM,
  RECEIVE_ROOM_GUESSING_REMAINING_TIME,
  RECEIVE_ROOM_DRAWING_INFO,
  SET_GAME_STARTED,
  UPDATE_GAME_STATE,
  RESET_ROOM_WORD_HINT,
  SET_ROOM_CLEAR_CANVAS,
  RESET_ROOM_FINAL_SCORE_BOARD,
  RESET_ROOM_TIMER,
} from '../actions/types';

const initialState = {
  loading: false,
  room: {},
  navigatedFrom: null,
  currentMessage: null,
  oldMessages: null,
  guessingRemainingTime: null,
  drawingInfo: null,
  inGame: false,
  errors: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ROOM_LOADING:
      return {
        ...state,
        loading: true,
        room: {},
        errors: {},
      };
    case SET_ROOM:
    case SET_ROOM_ON_PRIVATE_JOIN:
    case SET_ROOM_ON_SETTINGS_UPDATED:
    case SET_ROOM_ON_USER_LEFT:
      return {
        ...state,
        loading: false,
        room: {
          ...state.room,
          ...payload,
        },
      };
    case SET_ROOM_ID:
      return {
        ...state,
        loading: false,
        room: {
          roomId: payload,
        },
      };
    case SET_ROOM_NAVIGATED_FROM:
      return {
        ...state,
        navigatedFrom: payload,
      };
    case SET_ROOM_ERROR:
      return {
        ...state,
        room: {
          roomId: null,
        },
        navigatedFrom: null,
        errors: action.payload,
      };
    case RECEIVE_MESSAGE_FROM_ROOM:
      return {
        ...state,
        currentMessage: {
          content: action.payload.message,
          color: action.payload.color,
          correctGuess: action.payload.correctGuess,
          timestamp: Date.now(),
        },
      };
    case RECEIVE_OLD_MESSAGES_FROM_ROOM:
      return {
        ...state,
        oldMessages: action.payload,
      };
    case RECEIVE_ROOM_GUESSING_REMAINING_TIME:
      return {
        ...state,
        guessingRemainingTime: action.payload,
      };
    case RECEIVE_ROOM_DRAWING_INFO:
      return {
        ...state,
        drawingInfo: action.payload,
      };
    case SET_GAME_STARTED:
      return {
        ...state,
        room: {
          ...state.room,
          inGame: true,
        },
      };
    case UPDATE_GAME_STATE:
      return {
        ...state,
        room: {
          ...state.room,
          ...action.payload,
        },
      };
    case RESET_ROOM_WORD_HINT:
      return {
        ...state,
        room: {
          ...state.room,
          wordHint: null,
        },
      };
    case SET_ROOM_CLEAR_CANVAS:
      return {
        ...state,
        room: {
          ...state.room,
          clearCanvas: {
            action: true,
            timestamp: Date.now(),
          },
        },
      };
    case RESET_ROOM_FINAL_SCORE_BOARD:
      return {
        ...state,
        room: {
          ...state.room,
          finalScoreBoard: null,
        },
      };
    case RESET_ROOM_TIMER:
      return {
        ...state,
        guessingRemainingTime: null,
      };
    default:
      return state;
  }
}
