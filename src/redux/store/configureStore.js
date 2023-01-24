import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import apiMiddleware from '../middleware/apiMiddleware';
import rootReducer from '../reducers';

const configureStore = preloadedState => {
  const middleware = [apiMiddleware];

  if (process.env.NODE_ENV === 'development') {
    middleware.push(createLogger());
  }

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware))
  );


  return store;
};

export default configureStore;
