import {SET_SELECT_DATA} from "../actions/exchange";

const initialState = {
  data: {}
};

export function exchangeReducer(state = initialState, action) {

  switch (action.type) {
    case SET_SELECT_DATA: {
      console.log(action.data)
      return {
        ...state,
        data: action.data,
      }
    }
    default:
      return state;
  }
}
