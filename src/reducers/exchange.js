import {SET_SELECT_DATA, SET_SELECT_STATUS} from "../actions/exchange";

const initialState = {
  data: {},
  status: false
};

export function exchangeReducer(state = initialState, action) {

  switch (action.type) {
    case SET_SELECT_DATA: {
      return {
        ...state,
        data: action.data,
      }
    }
    case SET_SELECT_STATUS: {
      return {
        ...state,
        status: action.status,
      }
    }
    default:
      return state;
  }
}
