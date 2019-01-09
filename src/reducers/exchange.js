
import {SET_SELECT_DATA, SET_SELECT_STATUS, SET_EXCHANGE20_LIST,SET_LASTPRICE,SET_EXCHANGE10_LIST,SET_EXCHANGEALL_LIST,SET_QUICKSELCET,SET_UPDATE_TRAN,SET_10_LOCK,SET_WIDGET} from "../actions/exchange";

const initialState = {
  data: {},
  status: false,
  klineLock: true,
  trc10: null,
  trc20: null
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
    case SET_QUICKSELCET: {
      return {
        ...state,
        quick_select: action.obj,
      }
    }
    case SET_UPDATE_TRAN:{
      return {
        ...state,
        is_update_tran: action.is_update_tran,
      }
    }
    case SET_10_LOCK:{
      return {
        ...state,
        klineLock: action.lock,
      }
    }
    case SET_WIDGET:{
      return {
        ...state,
        [action.data.type]: action.data.widget,
      }
    }
    
    default:
      return state;
  }
}
