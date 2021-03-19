import { createStore, combineReducers, applyMiddleware} from 'redux';
import { createLogger } from 'redux-logger';
import { StorageMiddleware } from 'core/Middlewares/StorageMiddleware';
import { AuthReducer } from 'core/Authentication/AuthReducer';
import { DictReducer } from 'application/DictRedux';

const rootReducer = combineReducers({
  system: AuthReducer,
  dict: DictReducer,
});

export type RootState = ReturnType<typeof rootReducer>

const store = () => createStore(rootReducer, applyMiddleware(createLogger({ collapsed: true }), StorageMiddleware));

export default store;



