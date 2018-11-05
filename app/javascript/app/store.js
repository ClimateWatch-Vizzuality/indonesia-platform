import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';
import router from './router';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [thunk, router.middleware];

const store = (initialState = {}) =>
  createStore(
    reducers,
    initialState,
    composeEnhancers(router.enhancer, applyMiddleware(...middlewares))
  );

export default store;
