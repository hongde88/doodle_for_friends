import { USER_LOADING, SET_USER } from '../actions/types';

const initialState = {
  user: null,
  loading: true,
  errors: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADING:
      return {
        ...state,
        loading: true,
        errors: {},
      };
    case SET_USER:
      return {
        ...state,
        user: payload,
        loading: false,
        errors: {},
      };
    default:
      return state;
  }
}
