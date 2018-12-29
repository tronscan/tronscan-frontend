import {Client} from "../services/api";
import {setTokenBalances} from "./account";
import xhr from "axios";
import {API_URL} from "../constants";

export const SET_ACTIVE_WALLET = 'SET_ACTIVE_WALLET';
export const SET_WALLET_LOADING = 'SET_WALLET_LOADING';

export const setActiveWallet = (wallet) => ({
  type: SET_ACTIVE_WALLET,
  wallet,
});

export const reloadWallet = () => async (dispatch, getState) => {
  let {app} = getState();

  if (app.account.isLoggedIn) {
    let {balances, trc20token_balances, frozen, accountResource,...wallet} = await Client.getAccountByAddressNew(app.account.address);
   // let result = await xhr.get(API_URL+"/api/token_trc20?sort=issue_time&start=0&limit=50");
    wallet.frozenEnergy = accountResource.frozen_balance_for_energy.frozen_balance;
    wallet.frozenTrx = frozen.total + accountResource.frozen_balance_for_energy.frozen_balance;
   // wallet.tokens20List = result.data.trc20_tokens;
    dispatch(setActiveWallet(wallet));
    dispatch(setTokenBalances(balances, trc20token_balances, frozen, accountResource.frozen_balance_for_energy));
  }
};

export const setWalletLoading = (loading = true) => ({
  type: SET_WALLET_LOADING,
  loading,
});
