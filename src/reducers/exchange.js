import {
  SET_SELECT_DATA,
  SET_SELECT_STATUS,
  SET_EXCHANGE20_LIST,
  SET_LASTPRICE,
  SET_EXCHANGE10_LIST,
  SET_EXCHANGEALL_LIST,
  SET_QUICKSELCET,
  SET_UPDATE_TRAN,
  SET_10_LOCK,
  SET_WIDGET,
  SET_REGISTER,
  SET_PRICE_CONVERT,
  SET_EXCHANGE20VOLUME_LIST,
  SET_EXCHANGE20UPDOWN_LIST,
  SET_EXCHANGE20SEARCH_LIST,
  SET_UNFIRM_ORDER_LIST,
  SET_CANCEL_ORDER_LIST,
  SET_DELEGATE_FAILURE_LIST,
  SET_REDIRCT_PAIR,
  SET_EXCHANGE20BYIDS
} from "../actions/exchange";

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
        data: action.data ? action.data : {}
      };
    }
    case SET_SELECT_STATUS: {
      return {
        ...state,
        status: action.status
      };
    }
    case SET_EXCHANGE20_LIST: {
      return {
        ...state,
        list_20: action.list
      };
    }
    case SET_EXCHANGE20VOLUME_LIST: {
      return {
        ...state,
        volumeList: action.volumeList
      };
    }
    case SET_EXCHANGE20UPDOWN_LIST: {
      return {
        ...state,
        upDownList: action.upDownList
      };
    }
    case SET_EXCHANGE20SEARCH_LIST: {
      return {
        ...state,
        searchList: action.searchList
      };
    }
    case SET_EXCHANGE10_LIST: {
      return {
        ...state,
        list_10: action.upDownList
      };
    }
    case SET_EXCHANGEALL_LIST: {
      return {
        ...state,
        list_all: action.list
      };
    }
    case SET_LASTPRICE: {
      return {
        ...state,
        last_price: action.obj
      };
    }
    case SET_QUICKSELCET: {
      return {
        ...state,
        quick_select: action.obj
      };
    }
    case SET_UPDATE_TRAN: {
      return {
        ...state,
        is_update_tran: action.is_update_tran
      };
    }
    case SET_10_LOCK: {
      return {
        ...state,
        klineLock: action.lock
      };
    }
    case SET_WIDGET: {
      return {
        ...state,
        [action.data.type]: action.data.widget
      };
    }
    case SET_REGISTER: {
      return {
        ...state,
        register: action.register
      };
    }

    case SET_PRICE_CONVERT: {
      return {
        ...state,
        price: action.price
      };
    }

    case SET_UNFIRM_ORDER_LIST: {
      return {
        ...state,
        unConfirmOrderList: action.unConfirmOrderList
      };
    }

    case SET_CANCEL_ORDER_LIST: {
      return {
        ...state,
        cancelOrderList: action.cancelOrderList
      };
    }

    case SET_DELEGATE_FAILURE_LIST: {
      return {
        ...state,
        delegateFailureList: action.delegateFailureList
      };
    }

    case SET_REDIRCT_PAIR: {
      return {
        ...state,
        redirctPair: action.redirctPair
      };
    }

    case SET_EXCHANGE20BYIDS: {
      return {
        ...state,
        searchListByIds: action.searchListByIds
      };
    }

    default:
      return state;
  }
}
