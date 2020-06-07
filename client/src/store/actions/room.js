import {
  CREATE_PRIVATE_ROOM,
  SET_ROOM,
  SET_ROOM_ID,
  SET_ROOM_LOADING,
  JOIN_ROOM,
  SET_ROOM_ON_PRIVATE_JOIN,
  SET_ROOM_ERROR,
  SET_ROOM_NAVIGATED_FROM,
  SET_ROOM_SETTINGS,
  SET_ROOM_ON_SETTINGS_UPDATED,
  SET_ROOM_ON_USER_LEFT,
} from './types';

export const createPrivateRoom = (username, avatarIndex) => (dispatch) => {
  dispatch({ type: CREATE_PRIVATE_ROOM, payload: { username, avatarIndex } });
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

export const joinRoom = (username, avatarIndex, roomId) => (dispatch) => {
  setRoomLoading();
  dispatch({ type: JOIN_ROOM, payload: { username, avatarIndex, roomId } });
};

export const setRoomOnPrivateJoin = (data) => (dispatch) => {
  setRoomLoading();
  dispatch({ type: SET_ROOM_ON_PRIVATE_JOIN, payload: data });
};

export const setError = (data) => (dispatch) => {
  dispatch({ type: SET_ROOM_ERROR, payload: data });
};

export const setRoomNavigatedFrom = (data) => (dispatch) => {
  dispatch({ type: SET_ROOM_NAVIGATED_FROM, payload: data });
};

export const setRoomSettings = (data) => (dispatch) => {
  dispatch({ type: SET_ROOM_SETTINGS, payload: data });
};

export const setRoomOnSettingsUpdated = (data) => (dispatch) => {
  dispatch({ type: SET_ROOM_ON_SETTINGS_UPDATED, payload: data });
};

export const setRoomOnUserLeft = (data) => (dispatch) => {
  dispatch({ type: SET_ROOM_ON_USER_LEFT, payload: data });
};
