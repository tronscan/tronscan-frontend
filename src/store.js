import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore
} from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import {
  routerMiddleware,
  routerReducer
} from "react-router-redux";
import {
  createHashHistory
} from "history";
const enhancers = []

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

  if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
  }
}
export const reduxHistory = createHashHistory({
  hashType: "slash"
});

const middleware = [thunk, routerMiddleware(history)]
export function configureStore() {
  const composedEnhancers = compose(
      applyMiddleware(...middleware),
      ...enhancers
  );

  return createStore(
      combineReducers({
          ...reducers,
          router: routerReducer
      }),
      composedEnhancers
  );
}

export const store = configureStore();