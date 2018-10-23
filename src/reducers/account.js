import {SET_RECENT_TRANSACTIONS, SET_TOKEN_BALANCES, SET_TOTAL_TRANSACTIONS} from "../actions/account";
import {LOGIN} from "../actions/app";
import {find} from "lodash";

const initialState = {
  tokens: [],
  trxBalance: 0,
  totalTransactions: 0,
  recentTransactions: [],
  frozen: {
    total: 0,
    balances: [],
  },
  accountResource:{}
};

export function accountReducer(state = initialState, action) {

  switch (action.type) {

    case LOGIN: {
      return {
        ...state,
        tokens: [],
      };
    }

    case SET_TOKEN_BALANCES: {
      let {balance: trxBalance = 0} = find(action.tokens, tb => tb.name.toUpperCase() === "TRX") || {};
      return {
        ...state,
        trxBalance,
        tokens: action.tokens,
        frozen: {
          ...action.frozen,
        },
        accountResource:{
          ...action.accountResource,
        }
      }
    }

    case SET_TOTAL_TRANSACTIONS: {
      return {
        ...state,
        totalTransactions: action.totalTransactions,
      }
    }

    case SET_RECENT_TRANSACTIONS: {
      return {
        ...state,
        recentTransactions: action.transactions,
      }
    }

    default:
      return state;
  }
}
