import {Client} from "../services/api";
import xhr from "axios/index";
import {setTokenBalances} from "./account";
import rebuildList from "../utils/rebuildList";
import rebuildToken20List from "../utils/rebuildToken20List";
import { FormatNumberByDecimals, FormatNumberByDecimalsBalance } from '../utils/number'
import _, {find} from "lodash";

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
      try {
          let {data: {data}} = await xhr.get("https://list.tronlink.org/api/wallet/multi/trx_record", { 
              params: {
                  "address": app.account.address,
                  "start": 0,
                  "state": 0,
                  "limit": 5000,
                  "netType": "main_net"
              }
          });
          let signatureList = data.data;
          signatureList.map((item) => {
              if (item.state == 0) {
                  item.signatureProgress.map((sign, index) => {
                      if (sign.address == app.account.address) {
                          //0-未签名 1-已签名
                          if (sign.isSign == 0) {
                              item.multiState = 10;
                          } else {
                              item.multiState = 11;
                          }
                      }
                  })
              } else {
                  item.multiState = item.state;
              }
          })
          let list = _(signatureList)
              .filter(signTx => signTx.multiState == 10)
              .value();
          let signatureTotal = list.length || 0
          wallet.signatureTotal = signatureTotal;
      } catch (e) {
          console.log(e)
          wallet.signatureTotal = 0;
      }
      if (wallet.activePermissions.length == 0) {
          let activePermissionsData = {
              "operations": "7fff1fc0033e0300000000000000000000000000000000000000000000000000",
              "keys": [
                  {
                      "address": app.account.address,
                      "weight": 1
                  }
              ],
              "threshold": 1,
              "id": 2,
              "type": "Active",
              "permission_name": "active"
          }
          wallet.activePermissions.push(activePermissionsData)
      }
      if(!wallet.ownerPermission){
          wallet.ownerPermission = {
              "keys": [
                  {
                      "address": app.account.address,
                      "weight": 1
                  }
              ],
              "threshold": 1,
              "permission_name": "owner"
          }
      }
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
      let trc20token_balances_new  = rebuildToken20List(trc20token_balances, 'contract_address', 'balance');


      trc20token_balances_new && trc20token_balances_new.map(item => {
          item.token20_name = item.name + '(' + item.symbol + ')';
          item.token20_balance = FormatNumberByDecimals(item.balance, item.decimals);
          item.token20_balance_decimals = FormatNumberByDecimalsBalance(item.balance, item.decimals);
          return item
      });
      dispatch(setActiveWallet(wallet));
      dispatch(setTokenBalances(balances_new, trc20token_balances_new, frozen, accountResource.frozen_balance_for_energy, delegated));
  }

};

export const setWalletLoading = (loading = true) => ({
  type: SET_WALLET_LOADING,
  loading,
});
