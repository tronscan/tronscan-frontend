import {Client} from "../services/api";
import {setTokenBalances} from "./account";

export const SET_ACTIVE_WALLET = 'SET_ACTIVE_WALLET';

export const setActiveWallet = (wallet) => ({
  type: SET_ACTIVE_WALLET,
  wallet,
});


export const loadWallet = (address) => async (dispatch) => {

  let {balances, frozen, ...wallet} = await Client.getAccountByAddress(address);
  wallet.frozenTrx = frozen.total;
  dispatch(setActiveWallet(wallet));
  dispatch(setTokenBalances(balances, frozen));
};


export const reloadWallet = () => async (dispatch, getState) => {

  let {wallet} = getState();

  if (wallet.isOpen) {
    let {balances, frozen, ...wallet} = await Client.getAccountByAddress(wallet.current.address);
    wallet.frozenTrx = frozen.total;
    dispatch(setActiveWallet(wallet));
    dispatch(setTokenBalances(balances, frozen));
  }
};
