import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import rootReducer from '../store/reducers';

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware()],
    preloadedState,
  });

  return store;
}
