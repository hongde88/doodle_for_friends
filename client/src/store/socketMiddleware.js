import openSocket from 'socket.io-client';
import { OPEN_SOCKET, CREATE_PRIVATE_ROOM } from './actions/types';
import { setRoom, setRoomLoading } from './actions/room';
import { setCurrentUser, setUserLoading } from './actions/user';

const URL = 'http://localhost:5001';
let socket = null;

const socketMiddleware = (store) => (next) => async (action) => {
  switch (action.type) {
    case OPEN_SOCKET:
      if (socket === null) {
        socket = openSocket(URL);
      }
      break;
    case CREATE_PRIVATE_ROOM:
      if (socket) {
        store.dispatch(setRoomLoading());
        store.dispatch(setUserLoading());
        socket.emit(
          'create private room',
          { username: action.payload },
          (data) => {
            store.dispatch(setRoom(data));
            store.dispatch(setCurrentUser(data.users[0]));
          }
        );
      }
      break;
    default:
      break;
  }

  return next(action);
};

export default socketMiddleware;
