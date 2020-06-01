import { SET_ROOM_LOADING, SET_ROOM, SET_ROOM_ID } from '../actions/types';

const initialState = {
  loading: false,
  roomId: null,
  rounds: null,
  drawTime: null,
  exclusive: null,
  errors: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ROOM_LOADING:
      return {
        loading: true,
        roomId: null,
        rounds: null,
        drawTime: null,
        exclusive: null,
      };
    case SET_ROOM:
      return {
        ...state,
        loading: false,
        roomId: payload.roomId,
        rounds: payload.maxRound,
        drawTime: payload.drawTime,
        exclusive: payload.useWordsExclusive,
      };
    case SET_ROOM_ID:
      return {
        ...state,
        loading: false,
        roomId: payload,
      };
    default:
      return state;
  }
}
