import { OPEN_SOCKET } from './types';

export const openSocket = () => (dispatch) => {
  dispatch({ type: OPEN_SOCKET });
};
