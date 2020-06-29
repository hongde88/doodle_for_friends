import openSocket from 'socket.io-client';
import {
  OPEN_SOCKET,
  CREATE_PRIVATE_ROOM,
  JOIN_ROOM,
  SET_ROOM_SETTINGS,
  SEND_MESSAGE_TO_ROOM,
  START_GUESSING_TIMER,
  SEND_ROOM_DRAWING_INFO,
  START_PRIVATE_GAME,
  PICK_WORD,
  START_ANOTHER_GAME,
  QUIT_GAME,
  LEAVE_A_ROOM,
  SEND_ON_CANVAS_CLEAR,
} from './actions/types';
import {
  setRoom,
  setRoomLoading,
  setRoomOnPrivateJoin,
  setError as setRoomError,
  setRoomOnSettingsUpdated,
  setRoomOnUserLeft,
  receiveMessageFromRoom,
  receiveOldMessagesFromRoom,
  receiveRoomGuessingRemainingTime,
  receiveRoomDrawingInfo,
  setGameStarted,
  updateGameState,
  // startRoomTimer,
  resetRoomWordHint,
  // setRoomNavigatedFrom,
  setRoomClearCanvas,
  resetRoomFinalScoreBoard,
} from './actions/room';
import {
  setCurrentUser,
  setUserLoading,
  setError as setUserError,
  setUserOnUserLeft,
  updateUserPickingRemainingTime,
  setUserWordList,
  setUserSelectedWord,
  resetCurrentPlayer,
} from './actions/user';

const URL = 'http://localhost:5001';
let socket = null;

const socketMiddleware = (store) => (next) => async (action) => {
  switch (action.type) {
    case OPEN_SOCKET:
      if (socket === null) {
        socket = openSocket(URL);
        socket.on('private room joined', (data) => {
          store.dispatch(setRoomOnPrivateJoin(data));
        });
        socket.on('room settings updated', (data) => {
          store.dispatch(setRoomOnSettingsUpdated(data));
        });
        socket.on('user left', (data) => {
          store.dispatch(setRoomOnUserLeft(data));
          store.dispatch(
            setUserOnUserLeft({
              newHost: data.host,
            })
          );
        });
        socket.on('new message', (data) => {
          store.dispatch(receiveMessageFromRoom(data));
        });
        socket.on('old messages', (data) => {
          store.dispatch(receiveOldMessagesFromRoom(data));
        });
        socket.on('guessing timer remaining', (data) => {
          store.dispatch(receiveRoomGuessingRemainingTime(data.remainingTime));
        });
        socket.on('drawing', (data) => {
          store.dispatch(receiveRoomDrawingInfo(data));
        });
        socket.on('in game', (data) => {
          store.dispatch(updateGameState(data));
          if (data && data.gameState && data.gameState === 'show turn result') {
            store.dispatch(setUserSelectedWord(null));
          }
        });
        socket.on('pick words', (data) => {
          store.dispatch(setUserWordList(data));
          // if current player doesn't pick a word within 20 sec, then pick one for him
          // socket.emit('start choosing timer', 20, (data) => {
          //   store.dispatch(setUserSelectedWord(data.word));
          //   store.dispatch(
          //     startRoomTimer({
          //       duration: data.duration,
          //       roomId: data.roomId,
          //     })
          //   );
          // });
        });
        socket.on('picking remaining time', (data) => {
          store.dispatch(updateUserPickingRemainingTime(data.remainingTime));
        });
        socket.on('set game started', () => {
          store.dispatch(setGameStarted());
          store.dispatch(resetRoomFinalScoreBoard());
        });
        socket.on('clear current player', () => {
          store.dispatch(resetCurrentPlayer());
        });
        socket.on('reset room word hint', () => {
          store.dispatch(resetRoomWordHint());
        });
        // socket.on('quit game', (data) => {
        // store.dispatch(setRoomLoading());
        // store.dispatch(setRoom({}));
        // store.dispatch(setRoomNavigatedFrom(data.roomId));
        // store.dispatch(updateGameState(data));
        // });
        socket.on('clear canvas', () => {
          store.dispatch(setRoomClearCanvas());
        });
      }
      break;
    case CREATE_PRIVATE_ROOM:
      if (socket) {
        store.dispatch(setRoomLoading());
        store.dispatch(setUserLoading());
        socket.emit(
          'create private room',
          {
            username: action.payload.username,
            avatarIndex: action.payload.avatarIndex,
          },
          (data) => {
            store.dispatch(setRoom(data));
            store.dispatch(
              setCurrentUser({
                name: data.host,
                isHost: true,
              })
            );
          }
        );
      }
      break;
    case JOIN_ROOM:
      if (socket) {
        store.dispatch(setRoomLoading());
        store.dispatch(setUserLoading());
        socket.emit(
          'join private room',
          {
            username: action.payload.username,
            roomId: action.payload.roomId,
            avatarIndex: action.payload.avatarIndex,
          },
          (data) => {
            if (data.type === 'room error') {
              store.dispatch(
                setRoomError({
                  message: data.message,
                })
              );
            } else if (data.type === 'user error') {
              store.dispatch(
                setUserError({
                  message: data.message,
                })
              );
            } else {
              store.dispatch(
                setCurrentUser({
                  name: data.username,
                  isHost: data.isHost,
                })
              );
            }
          }
        );
      }
      break;
    case SET_ROOM_SETTINGS:
      if (socket) {
        socket.emit('update room settings', action.payload, (data) => {
          store.dispatch(setRoomOnSettingsUpdated(action.payload));
        });
      }
      break;
    case SEND_MESSAGE_TO_ROOM:
      if (socket) {
        socket.emit('new message', action.payload);
      }
      break;
    case START_GUESSING_TIMER:
      if (socket) {
        socket.emit('start guessing timer', action.payload);
      }
      break;
    case SEND_ROOM_DRAWING_INFO:
      if (socket) {
        socket.emit('drawing', action.payload);
      }
      break;
    case START_PRIVATE_GAME:
      if (socket) {
        socket.emit('start private game');
      }
      break;
    case PICK_WORD:
      if (socket) {
        socket.emit('word picked', action.payload);
      }
      break;
    case START_ANOTHER_GAME:
      if (socket) {
        socket.emit('start another game', action.payload);
      }
      break;
    case QUIT_GAME:
      if (socket) {
        socket.emit('quit game', action.payload);
      }
      break;
    case LEAVE_A_ROOM:
      if (socket) {
        socket.emit('leave a room');
      }
      break;
    case SEND_ON_CANVAS_CLEAR:
      if (socket) {
        socket.emit('clear canvas');
      }
      break;
    default:
      break;
  }

  return next(action);
};

export default socketMiddleware;
