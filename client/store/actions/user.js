import { USER_LOADING, SET_USER } from './types';

export const setUser = (userData) => async (dispatch) => {
  dispatch({ type: USER_LOADING });

  setTimeout(dispatch({ type: SET_USER, payload: userData }), 500);
};
