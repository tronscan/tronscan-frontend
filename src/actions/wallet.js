import {Client} from "../services/api";
import {setTokenBalances} from "./account";
import xhr from "axios";
import {API_URL} from "../constants";
import rebuildList from "../utils/rebuildList";

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
    balances =  [
        {"name":"TRX","address":"TA561MxvhxM4f81mU7bx9oipGP5zowTbhL","balance":0.018652,"tokenName":"_"},
        {"name":"LuckyChipsCoin","address":"TYMmLJeReBpsGT1nA51LkjJf3ipP9JD2ej","balance":1,"tokenName":"1000564"},
        {"name":"TronLottery","address":"TGQwBNht8h3zev4gBtDMoQjWE2WJm1Zr9B","balance":10,"tokenName":"1001733"},
        {"name":"TRONONE","address":"TU1LUTYDMG6iihimUpAmdnnBthawPKh1cm","balance":13,"tokenName":"1001090"},
        {"name":"dice","address":"TUgE94frLY3CPycEmjgHvT9YVPvgCSLcZ4","balance":0,"tokenName":"1001305"}
      ]
    let balances_new = rebuildList(balances, 'tokenName', 'balance')
   // wallet.tokens20List = result.data.trc20_tokens;
    dispatch(setActiveWallet(wallet));
    dispatch(setTokenBalances(balances_new, trc20token_balances, frozen, accountResource.frozen_balance_for_energy));
  }
};

export const setWalletLoading = (loading = true) => ({
  type: SET_WALLET_LOADING,
  loading,
});
