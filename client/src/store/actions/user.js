import {
  SET_CURRENT_USER,
  CLEAR_CURRENT_USER,
  SET_USER_LOADING,
  SET_USER_ERROR,
  SET_USER_ON_USER_LEFT,
  SET_USER_WORD_LIST,
  SET_USER_SELECTED_WORD,
  UPDATE_USER_PICKING_REMAINING_TIME,
  PICK_WORD,
} from './types';

export const setCurrentUser = (username) => (dispatch) => {
  dispatch({ type: SET_CURRENT_USER, payload: username });
};

export const clearCurrentUser = (username) => (dispatch) => {
  dispatch({ type: CLEAR_CURRENT_USER });
};

export const setUserLoading = (username) => (dispatch) => {
  dispatch({ type: SET_USER_LOADING, payload: username });
};

export const setError = (data) => (dispatch) => {
  dispatch({ type: SET_USER_ERROR, payload: data });
};

export const setUserOnUserLeft = (data) => (dispatch) => {
  dispatch({ type: SET_USER_ON_USER_LEFT, payload: data });
};

export const setUserWordList = (data) => (dispatch) => {
  dispatch({ type: SET_USER_WORD_LIST, payload: data });
};

export const setUserSelectedWord = (data) => (dispatch) => {
  dispatch({ type: SET_USER_SELECTED_WORD, payload: data });
};

export const updateUserPickingRemainingTime = (data) => (dispatch) => {
  dispatch({ type: UPDATE_USER_PICKING_REMAINING_TIME, payload: data });
};

export const userPickAWord = (data) => (dispatch) => {
  dispatch({ type: PICK_WORD, payload: data });
};
