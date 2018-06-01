import {Client} from "../services/api";

export const SET_TOKEN_BALANCES = 'SET_TOKEN_BALANCES';
export const SET_RECENT_TRANSACTIONS = 'SET_RECENT_TRANSACTIONS';
export const SET_TOTAL_TRANSACTIONS = 'SET_TOTAL_TRANSACTIONS';

export const setTokenBalances = (tokens = [], frozen = {}) => ({
  type: SET_TOKEN_BALANCES,
  tokens,
  frozen,
});


export const setRecentTransactions = (transactions = []) => ({
  type: SET_RECENT_TRANSACTIONS,
  transactions,
});

export const setTotalTransactions = (totalTransactions = 0) => ({
  type: SET_TOTAL_TRANSACTIONS,
  totalTransactions,
});

export const loadRecentTransactions = (address) => async (dispatch) => {
  let {transfers, total} = await Client.getTransfers({
    limit: 10,
    address,
    sort: '-timestamp',
  });
  dispatch(setRecentTransactions(transfers));
  dispatch(setTotalTransactions(total));
};
