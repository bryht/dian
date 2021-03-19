import { createStore, combineReducers, applyMiddleware} from 'redux';
import { createLogger } from 'redux-logger';
import { StorageMiddleware } from 'core/Middlewares/StorageMiddleware';
import { SystemReducer } from 'core/System/SystemReducer';
import { DictReducer } from 'application/DictRedux';

const rootReducer = combineReducers({
  system: SystemReducer,
  dict: DictReducer,
});

export type RootState = ReturnType<typeof rootReducer>

const store = () => createStore(rootReducer, applyMiddleware(createLogger({ collapsed: true }), StorageMiddleware));

export default store;



