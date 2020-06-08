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
  RECEIVE_ROOM_REMAINING_TIME,
} from '../actions/types';

const initialState = {
  loading: false,
  room: {},
  navigatedFrom: null,
  currentMessage: null,
  oldMessages: null,
  remainingTime: null,
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
          content: action.payload,
          timestamp: Date.now(),
        },
      };
    case RECEIVE_OLD_MESSAGES_FROM_ROOM:
      return {
        ...state,
        oldMessages: action.payload,
      };
    case RECEIVE_ROOM_REMAINING_TIME:
      return {
        ...state,
        remainingTime: action.payload,
      };
    default:
      return state;
  }
}
