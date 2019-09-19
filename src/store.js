import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import {routerMiddleware, routerReducer} from 'react-router-redux'
import {createHashHistory} from 'history'

export const reduxHistory = createHashHistory({
  hashType: 'slash',
});

export function configureStore() {
  const enhancer = compose(
    applyMiddleware(
      thunk,
      routerMiddleware(reduxHistory)
    ),
   // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  );

  return createStore(
    combineReducers({
      ...reducers,
      router: routerReducer,
    }),
    enhancer,
  );
}

export const store = configureStore();
