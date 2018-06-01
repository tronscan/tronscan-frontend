import {SET_PRICE_DATA, SET_VOLUME_DATA} from "../actions/markets";


const initialState = {
  price: [],
  volume: [],
};

export function marketsReducer(state = initialState, action) {

  switch(action.type) {
    case SET_VOLUME_DATA: {
      return {
        ...state,
        volume: action.volume,
      }
    }

    case SET_PRICE_DATA: {
      return {
        ...state,
        price: action.prices,
      }
    }

    default:
      return state;
  }
}
