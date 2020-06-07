import {
  SET_CURRENT_USER,
  CLEAR_CURRENT_USER,
  SET_USER_LOADING,
  SET_USER_ERROR,
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
