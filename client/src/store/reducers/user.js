import {
  CLEAR_CURRENT_USER,
  SET_CURRENT_USER,
  SET_USER_LOADING,
} from '../actions/types';

const initialState = {
  loading: false,
  user: null,
  errors: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_USER_LOADING:
      return {
        loading: true,
        user: null,
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
        user: null,
      };
    default:
      return state;
  }
}
