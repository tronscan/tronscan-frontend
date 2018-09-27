import {Client} from "../services/api";

export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const SET_TOTAL_TRANSACTIONS = 'SET_TOTAL_TRANSACTIONS';
export const SET_BLOCKS = 'SET_BLOCKS';

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
  let {transfers} = await Client.getTransfers({
    order: '-timestamp',
    limit: 15,
  });
  dispatch(setTransactions(transfers));
};

export const loadTotalNumberOfTransactions = () => async (dispatch, getState) => {

  // let totalTransactions = await Client.getTotalNumberOfTransactions();
  // dispatch(setTotalNumberOfTransactions(totalTransactions));
};
