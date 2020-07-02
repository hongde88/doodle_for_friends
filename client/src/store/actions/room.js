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
  SEND_MESSAGE_TO_ROOM,
  RECEIVE_MESSAGE_FROM_ROOM,
  RECEIVE_OLD_MESSAGES_FROM_ROOM,
  START_GUESSING_TIMER,
  RECEIVE_ROOM_GUESSING_REMAINING_TIME,
  RECEIVE_ROOM_DRAWING_INFO,
  SEND_ROOM_DRAWING_INFO,
  START_PRIVATE_GAME,
  SET_GAME_STARTED,
  UPDATE_GAME_STATE,
  RESET_ROOM_WORD_HINT,
  START_ANOTHER_GAME,
  QUIT_GAME,
  SEND_ON_CANVAS_CLEAR,
  SET_ROOM_CLEAR_CANVAS,
  RESET_ROOM_FINAL_SCORE_BOARD,
  RESET_ROOM_TIMER,
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

export const sendMessageToRoom = (data) => (dispatch) => {
  dispatch({ type: SEND_MESSAGE_TO_ROOM, payload: data });
};

export const receiveMessageFromRoom = (data) => (dispatch) => {
  dispatch({ type: RECEIVE_MESSAGE_FROM_ROOM, payload: data });
};

export const receiveOldMessagesFromRoom = (data) => (dispatch) => {
  dispatch({ type: RECEIVE_OLD_MESSAGES_FROM_ROOM, payload: data });
};

export const startRoomTimer = (data) => (dispatch) => {
  dispatch({ type: START_GUESSING_TIMER, payload: data });
};

export const receiveRoomGuessingRemainingTime = (data) => (dispatch) => {
  dispatch({ type: RECEIVE_ROOM_GUESSING_REMAINING_TIME, payload: data });
};

export const sendRoomDrawingInfo = (data) => (dispatch) => {
  dispatch({ type: SEND_ROOM_DRAWING_INFO, payload: data });
};

export const receiveRoomDrawingInfo = (data) => (dispatch) => {
  dispatch({ type: RECEIVE_ROOM_DRAWING_INFO, payload: data });
};

export const startPrivateGame = () => (dispatch) => {
  dispatch({ type: START_PRIVATE_GAME });
};

export const setGameStarted = () => (dispatch) => {
  dispatch({ type: SET_GAME_STARTED });
};

export const updateGameState = (data) => (dispatch) => {
  dispatch({ type: UPDATE_GAME_STATE, payload: data });
};

export const resetRoomWordHint = () => (dispatch) => {
  dispatch({ type: RESET_ROOM_WORD_HINT });
};

export const startAnotherGame = (data) => (dispatch) => {
  dispatch({ type: START_ANOTHER_GAME, payload: data });
};

export const quitAndCleanUpGame = (data) => (dispatch) => {
  dispatch({ type: QUIT_GAME, payload: data });
};

export const sendOnCanvasClear = () => (dispatch) => {
  dispatch({ type: SEND_ON_CANVAS_CLEAR });
};

export const setRoomClearCanvas = () => (dispatch) => {
  dispatch({ type: SET_ROOM_CLEAR_CANVAS });
};

export const resetRoomFinalScoreBoard = () => (dispatch) => {
  dispatch({ type: RESET_ROOM_FINAL_SCORE_BOARD });
};

export const resetRoomTimer = () => (dispatch) => {
  dispatch({ type: RESET_ROOM_TIMER });
};
