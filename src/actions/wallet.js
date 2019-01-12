import {Client} from "../services/api";
import {setTokenBalances} from "./account";
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
    let {balances, trc20token_balances, frozen, accountResource, tokenBalances, exchanges, ...wallet} = await Client.getAccountByAddressNew(app.account.address);
    // let result = await xhr.get(API_URL+"/api/token_trc20?sort=issue_time&start=0&limit=50");
    wallet.frozenEnergy = accountResource.frozen_balance_for_energy.frozen_balance ? accountResource.frozen_balance_for_energy.frozen_balance : 0;
    wallet.frozenTrx = frozen.total + (accountResource.frozen_balance_for_energy.frozen_balance ? accountResource.frozen_balance_for_energy.frozen_balance : 0);
    wallet.exchanges = rebuildList(exchanges, ['first_token_id', 'second_token_id'], ['first_token_balance', 'second_token_balance']);
    wallet.tokenBalances = rebuildList(tokenBalances, 'name', 'balance');
    let balances_new = rebuildList(balances, 'name', 'balance');
    dispatch(setActiveWallet(wallet));
    dispatch(setTokenBalances(balances_new, trc20token_balances, frozen, accountResource.frozen_balance_for_energy));

    console.log("loaded", wallet);

  }
};

export const setWalletLoading = (loading = true) => ({
  type: SET_WALLET_LOADING,
  loading,
});
