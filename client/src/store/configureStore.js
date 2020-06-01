import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import rootReducer from '../store/reducers';
import socketMiddleware from '../store/socketMiddleware';
import { OPEN_SOCKET } from '../store/actions/types';

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [socketMiddleware, ...getDefaultMiddleware()],
    preloadedState,
  });

  store.dispatch({ type: OPEN_SOCKET });
  return store;
}
