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
    let {balances, trc20token_balances, frozen, accountResource, tokenBalances,exchanges,...wallet} = await Client.getAccountByAddressNew(app.account.address);
   // let result = await xhr.get(API_URL+"/api/token_trc20?sort=issue_time&start=0&limit=50");
    wallet.frozenEnergy = accountResource.frozen_balance_for_energy.frozen_balance?accountResource.frozen_balance_for_energy.frozen_balance:0
    wallet.frozenTrx = frozen.total + (accountResource.frozen_balance_for_energy.frozen_balance?accountResource.frozen_balance_for_energy.frozen_balance: 0)
    wallet.exchanges = rebuildList(exchanges, ['first_token_id','second_token_id'], ['first_token_balance','second_token_balance']);
    wallet.tokenBalances= rebuildList(tokenBalances, 'name', 'balance')
      // wallet.tokenBalances= [
      //        {
      //            address: "TU1LUTYDMG6iihimUpAmdnnBthawPKh1cm",
      //            balance: 22,
      //            map_amount: 22,
      //            map_token_id: "1001090",
      //            map_token_name: "TRONONE",
      //            map_token_precision: 1,
      //            name: "TRONONE"
      //        },
      //     {
      //         address: "TGkTrnr7aBVVJA4rFrA7XdzCGkyFSABGT4",
      //         balance: 1,
      //         map_amount: 1,
      //         map_token_id: "1001466",
      //         map_token_name: "Tronics",
      //         map_token_precision: 2,
      //         name: "Tronics",
      //     },
      //       {
      //           address: "TTbioAsbefqWxtoGk3MsKkUw7jgtFKPH9E",
      //           balance: 8,
      //           map_amount: 8,
      //           map_token_id: "1001377",
      //           map_token_name: "ALLEExchange",
      //           map_token_precision: 3,
      //           name: "ALLEExchange",
      //       },
      // {
      //     address: "TFFFyJ6w6bgDa5tciErgrjWGyTPSyE8qRy",
      //     balance: 99988200,
      //     map_amount: 99988200,
      //     map_token_id: "1001810",
      //     map_token_name: "Colorpop",
      //     map_token_precision: 4,
      //     name: "Colorpop",
      // },
      // {
      //     address: "TN8p9sUqKgdnvWqbE4dCq6bTV6GhkpZhXP",
      //     balance: 842,
      //     map_amount: 842,
      //     map_token_id: "1000526",
      //     map_token_name: "HashCoin",
      //     map_token_precision: 5,
      //     name: "HashCoin",
      // }
      // ]

    // balances =  [
    //     {"name":"TRX","address":"TA561MxvhxM4f81mU7bx9oipGP5zowTbhL","balance":0.018652,"tokenName":"_"},
    //     {"name":"LuckyChipsCoin","address":"TYMmLJeReBpsGT1nA51LkjJf3ipP9JD2ej","balance":1,"tokenName":"1000564"},
    //     {"name":"TronLottery","address":"TGQwBNht8h3zev4gBtDMoQjWE2WJm1Zr9B","balance":10,"tokenName":"1001733"},
    //     {"name":"TRONONE","address":"TU1LUTYDMG6iihimUpAmdnnBthawPKh1cm","balance":13,"tokenName":"1001090"},
    //     {"name":"dice","address":"TUgE94frLY3CPycEmjgHvT9YVPvgCSLcZ4","balance":0,"tokenName":"1001305"}
    //   ]
    let balances_new = rebuildList(balances, 'name', 'balance')
   // wallet.tokens20List = result.data.trc20_tokens;
    dispatch(setActiveWallet(wallet));
    dispatch(setTokenBalances(balances_new, trc20token_balances, frozen, accountResource.frozen_balance_for_energy));
  }
};

export const setWalletLoading = (loading = true) => ({
  type: SET_WALLET_LOADING,
  loading,
});
