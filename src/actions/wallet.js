import {Client} from "../services/api";
import {setTokenBalances} from "./account";
import rebuildList from "../utils/rebuildList";
import { FormatNumberByDecimals } from '../utils/number'

export const SET_ACTIVE_WALLET = 'SET_ACTIVE_WALLET';
export const SET_WALLET_LOADING = 'SET_WALLET_LOADING';

export const setActiveWallet = (wallet) => ({
  type: SET_ACTIVE_WALLET,
  wallet,
});

export const reloadWallet = () => async (dispatch, getState) => {
  let {app, account} = getState();

  if (app.account.isLoggedIn) {
      let {balances, trc20token_balances, frozen, accountResource, delegated, tokenBalances, exchanges, ...wallet} = await Client.getAccountByAddressNew(app.account.address);
      // let result = await xhr.get(API_URL+"/api/token_trc20?sort=issue_time&start=0&limit=50");
      wallet.frozenEnergy = accountResource.frozen_balance_for_energy.frozen_balance ? accountResource.frozen_balance_for_energy.frozen_balance : 0;

    let sentDelegateBandwidth = 0;
    if(delegated&&delegated.sentDelegatedBandwidth) {
      for (let i = 0; i < delegated.sentDelegatedBandwidth.length; i++) {
        sentDelegateBandwidth = sentDelegateBandwidth + delegated.sentDelegatedBandwidth[i]['frozen_balance_for_bandwidth'];
      }
    }

    let frozenBandwidth=0;
    if(frozen.balances.length > 0){
      frozenBandwidth=frozen.balances[0].amount;
    }

    let sentDelegateResource=0;
    if(delegated&&delegated.sentDelegatedResource) {
      for (let i = 0; i < delegated.sentDelegatedResource.length; i++) {
        sentDelegateResource = sentDelegateResource + delegated.sentDelegatedResource[i]['frozen_balance_for_energy'];
      }
    }

    let frozenEnergy=0;
    if(accountResource.frozen_balance_for_energy.frozen_balance > 0){
      frozenEnergy=accountResource.frozen_balance_for_energy.frozen_balance;
    }

      wallet.frozenTrx = sentDelegateBandwidth+frozenBandwidth+sentDelegateResource+frozenEnergy;

      wallet.exchanges = rebuildList(exchanges, ['first_token_id', 'second_token_id'], ['first_token_balance', 'second_token_balance']);
      wallet.tokenBalances = rebuildList(tokenBalances, 'name', 'balance');
      let balances_new = rebuildList(balances, 'name', 'balance');
      trc20token_balances && trc20token_balances.map(item => {
          item.token20_name = item.name + '(' + item.symbol + ')';
          item.token20_balance = FormatNumberByDecimals(item.balance, item.decimals);
          return item
      });
      dispatch(setActiveWallet(wallet));
      dispatch(setTokenBalances(balances_new, trc20token_balances, frozen, accountResource.frozen_balance_for_energy, delegated));
  }

};

export const setWalletLoading = (loading = true) => ({
  type: SET_WALLET_LOADING,
  loading,
});
