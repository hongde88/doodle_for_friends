import {
  CLEAR_CURRENT_USER,
  SET_CURRENT_USER,
  SET_USER_LOADING,
  SET_USER_ERROR,
  SET_USER_ON_USER_LEFT,
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
    case SET_USER_ON_USER_LEFT:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          isHost: state.user.name === action.payload.newHost,
        },
      };
    default:
      return state;
  }
}
