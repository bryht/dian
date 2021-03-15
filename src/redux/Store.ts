import { createStore, combineReducers, applyMiddleware} from 'redux';
import { createLogger } from 'redux-logger';
import { StorageMiddleware } from 'redux/Middlewares/StorageMiddleware';
import { SystemReducer } from 'components/System/SystemReducer';
import { DictReducer } from 'components/DictRedux';

const rootReducer = combineReducers({
  system: SystemReducer,
  dict: DictReducer,
});

export type RootState = ReturnType<typeof rootReducer>

const store = () => createStore(rootReducer, applyMiddleware(createLogger({ collapsed: true }), StorageMiddleware));

export default store;



