import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { StorageMiddleware } from 'core/Middlewares/StorageMiddleware';
import { AuthReducer } from 'core/Authentication/AuthReducer';
import { DictReducer } from 'application/DictRedux';

const rootReducer = combineReducers({
  system: AuthReducer,
  dict: DictReducer,
});

export type RootState = ReturnType<typeof rootReducer>

const store = () => configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(StorageMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;



