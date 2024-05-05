import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Dispatch,
  MiddlewareAPI,
} from 'redux';
import userReducer from './src/reducers/user';
import logger from 'redux-logger';

const userPersistConfig = {
  storage: AsyncStorage,
  key: 'user',
};

export const reducers = {
  user: persistReducer(userPersistConfig, userReducer),
};

export const rootReducer = combineReducers(reducers);

const appMiddleware = (_store: MiddlewareAPI) => (next: Dispatch) => (
  action: any,
) => {
  //   var state = store.getState()
  //   switch (action.type) {
  //     case actions.ADD_TASK:
  //       *do something*
  //       break;
  //   }
  next(action);
};

const middlewares = [appMiddleware, logger /**other middlewares */];
const enhancers = [applyMiddleware(...middlewares)];

export const store = createStore(rootReducer, compose(...enhancers));

export const persistor = persistStore(store);
