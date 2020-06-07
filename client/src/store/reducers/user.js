import {
  CLEAR_CURRENT_USER,
  SET_CURRENT_USER,
  SET_USER_LOADING,
  SET_USER_ERROR,
} from '../actions/types';

const initialState = {
  loading: false,
  user: {
    name: null,
    isHost: false,
    score: 0,
  },
  errors: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_USER_LOADING:
      return {
        loading: true,
        user: {},
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
        user: {},
      };
    case SET_USER_ERROR:
      return {
        ...state,
        errors: action.payload,
      };
    default:
      return state;
  }
}
