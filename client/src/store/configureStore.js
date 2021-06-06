import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import rootReducer from './reducers';
import socketMiddleware from './socketMiddleware';
import { OPEN_SOCKET } from './actions/types';

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [socketMiddleware, ...getDefaultMiddleware()],
    preloadedState,
  });

  store.dispatch({ type: OPEN_SOCKET });
  return store;
}
