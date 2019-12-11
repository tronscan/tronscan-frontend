import {SET_BLOCKS, SET_TOTAL_TRANSACTIONS, SET_TRANSACTIONS, SET_USD_PRICE} from "../actions/blockchain";


const initialState = {
  transactions: [],
  blocks: [],
  totalNumberOfTransactions: 0,
  usdPrice: 0
};

export function blockchainReducer(state = initialState, action) {

  switch(action.type) {
    case SET_TRANSACTIONS: {
      return {
        ...state,
        transactions: action.transactions,
      }
    }

    case SET_BLOCKS: {

      return {
        ...state,
        blocks: action.blocks,
      }
    }

    case SET_TOTAL_TRANSACTIONS: {
      return {
        ...state,
        totalNumberOfTransactions: action.numberOfTransactions,
      }
    }
    case SET_USD_PRICE: {
      return {
        ...state,
        usdPrice: action.price,
      }
    }
    default:
      return state;
  }
}
