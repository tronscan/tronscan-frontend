import {Client} from "../services/api";
import {setTokenBalances} from "./account";

export const SET_ACTIVE_WALLET = 'SET_ACTIVE_WALLET';
export const SET_WALLET_LOADING = 'SET_WALLET_LOADING';

export const setActiveWallet = (wallet) => ({
  type: SET_ACTIVE_WALLET,
  wallet,
});

export const reloadWallet = () => async (dispatch, getState) => {
  let {app} = getState();

  if (app.account.isLoggedIn) {
    let {balances, frozen, ...wallet} = await Client.getAccountByAddress(app.account.address);
    wallet.frozenTrx = frozen.total;
    dispatch(setActiveWallet(wallet));
    dispatch(setTokenBalances(balances, frozen));
  }
};

export const setWalletLoading = (loading = true) => ({
  type: SET_WALLET_LOADING,
  loading,
});
