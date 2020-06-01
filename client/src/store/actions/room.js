import {
  CREATE_PRIVATE_ROOM,
  SET_ROOM,
  SET_ROOM_ID,
  SET_ROOM_LOADING,
} from './types';

export const createPrivateRoom = (username) => (dispatch) => {
  dispatch({ type: CREATE_PRIVATE_ROOM, payload: username });
};

export const setRoom = (data) => (dispatch) => {
  dispatch({ type: SET_ROOM, payload: data });
};

export const setRoomId = (data) => (dispatch) => {
  dispatch({ type: SET_ROOM_ID, payload: data.roomId });
};

export const setRoomLoading = () => (dispatch) => {
  dispatch({ type: SET_ROOM_LOADING });
};
