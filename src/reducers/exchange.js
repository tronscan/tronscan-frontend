import {SET_SELECT_DATA, SET_SELECT_STATUS, SET_EXCHANGE20_LIST,SET_LASTPRICE,SET_EXCHANGE10_LIST,SET_EXCHANGEALL_LIST} from "../actions/exchange";

const initialState = {
  data: {},
  status: false
};

export function exchangeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SELECT_DATA: {
      return {
        ...state,
        data: action.data?action.data:{},
      }
    }
    case SET_SELECT_STATUS: {
      return {
        ...state,
        status: action.status,
      }
    }
    case SET_EXCHANGE20_LIST: {
      return {
        ...state,
        list_20: action.list,
      }
    }
    case SET_EXCHANGE10_LIST: {
      return {
        ...state,
        list_10: action.list,
      }
    }
    case SET_EXCHANGEALL_LIST: {
      return {
        ...state,
        list_all: action.list,
      }
    }
    case SET_LASTPRICE: {
      return {
        ...state,
        last_price: action.obj,
      }
    }
    default:
      return state;
  }
}
