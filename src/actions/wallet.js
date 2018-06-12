import {Client} from "../services/api";
import {setTokenBalances} from "./account";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";

export const SET_ACTIVE_WALLET = 'SET_ACTIVE_WALLET';

export const setActiveWallet = (wallet) => ({
  type: SET_ACTIVE_WALLET,
  wallet,
});


export const loadWalletFromAddress = (address) => async (dispatch) => {
  let {balances, frozen, ...wallet} = await Client.getAccountByAddress(address);
  wallet.frozenTrx = frozen.total;
  dispatch(setActiveWallet(wallet));
  dispatch(setTokenBalances(balances, frozen));
};

export const loadWalletWithPrivateKey = (privateKey) => async (dispatch) => {
  let address = pkToAddress(privateKey);
  let {balances, frozen, ...wallet} = await Client.getAccountByAddress(address);
  wallet.frozenTrx = frozen.total;
  wallet.key = privateKey;
  dispatch(setActiveWallet(wallet));
  dispatch(setTokenBalances(balances, frozen));
};

export const reloadWallet = () => async (dispatch, getState) => {

  let {wallet} = getState();
  console.log("reloadWallet", wallet);

  if (wallet.isOpen) {
    let {balances, frozen, ...walletProps} = await Client.getAccountByAddress(wallet.current.address);
    walletProps.frozenTrx = frozen.total;
    dispatch(setActiveWallet(walletProps));
    dispatch(setTokenBalances(balances, frozen));
  }
};
