import {SET_TOKENS} from "../actions/tokens";

const initialState = {
  tokens: [],
};

export function tokensReducer(state = initialState, action) {

  switch (action.type) {
    case SET_TOKENS: {
      return {
        ...state,
        tokens: action.tokens,
      }
    }
    default:
      return state;
  }
}
