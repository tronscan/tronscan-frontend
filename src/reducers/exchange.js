import {SET_SELECT_DATA, SET_SELECT_STATUS, SET_EXCHANGE20_LIST,SET_LASTPRICE,SET_QUICKSELCET} from "../actions/exchange";

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
    case SET_LASTPRICE: {
      return {
        ...state,
        last_price: action.obj,
      }
    }
    case SET_QUICKSELCET: {
      return {
        ...state,
        quick_select: action.obj,
      }
    }
    default:
      return state;
  }
}
