import {Client, Client20} from "../services/api";
import ClientToken from "../services/tokenApi";
import rebuildList from "../utils/rebuildList";

export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const SET_TOTAL_TRANSACTIONS = 'SET_TOTAL_TRANSACTIONS';
export const SET_BLOCKS = 'SET_BLOCKS';
export const SET_USD_PRICE = 'SET_USD_PRICE';

export const SET_ACCOUNT_TAB = 'SET_ACCOUNT_TAB'; // account tab info



export const setUsdPrice = (price = 0) => ({
  type: SET_USD_PRICE,
  price
})
export const setTransactions = (transactions = []) => ({
  type: SET_TRANSACTIONS,
  transactions,
});

export const setTotalNumberOfTransactions = (numberOfTransactions = 0) => ({
  type: SET_TOTAL_TRANSACTIONS,
  numberOfTransactions,
});

export const setBlocks = (blocks = []) => ({
  type: SET_BLOCKS,
  blocks,
});

export const loadBlocks = () => async (dispatch) => {
    let {blocks} = await Client.getBlocks({
        order: '-timestamp',
        limit: 15,
    });
    dispatch(setBlocks(blocks));
};




export const loadTransactions = () => async (dispatch) => {
  let {transfers: list} = await Client.getTransfers({
    order: '-timestamp',
    limit: 15,
  });
  
  const transfers = rebuildList(list, 'tokenName', 'amount')
  dispatch(setTransactions(transfers));
};

export const loadTotalNumberOfTransactions = () => async (dispatch, getState) => {

  // let totalTransactions = await Client.getTotalNumberOfTransactions();
  // dispatch(setTotalNumberOfTransactions(totalTransactions));
};

export const loadUsdPrice = () => async (dispatch) => {
  let price = await ClientToken.getUsdPrice();
  dispatch(setUsdPrice(price));
};


export const updateAccountTabInfo = (data) => ({
  type: SET_ACCOUNT_TAB,
  payload: data
})