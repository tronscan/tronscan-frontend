import {Client} from "../services/api";
import xhr from "axios";
import {loadRecentTransactions} from "./account";
import {reloadWallet, setWalletLoading} from "./wallet";
import Lockr from "lockr";

export const SET_ACCOUNTS = 'SET_ACCOUNTS';
export const SET_PRICE = 'SET_PRICE';
export const SET_CURRENCY = 'SET_CURRENCY';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const LOGIN = 'LOGIN';
export const LOGIN_PK = 'LOGIN_PK';
export const LOGIN_ADDRESS = 'LOGIN_ADDRESS';
export const LOGOUT = 'LOGOUT';
export const ENABLE_FLAG = 'ENABLE_FLAG';
export const DISABLE_FLAG = 'DISABLE_FLAG';
export const SET_THEME = 'SET_THEME';
export const SET_SYNC_STATUS = 'SET_SYNC_STATUS';

export const setLanguage = (language = 'en') => ({
  type: SET_LANGUAGE,
  language,
});


export const setTheme = (theme) => ({
  type: SET_THEME,
  theme,
});

export const setAccounts = (accounts = []) => ({
  type: SET_ACCOUNTS,
  accounts,
});

export const setSyncStatus = (status) => ({
  type: SET_SYNC_STATUS,
  status,
});


export const loginWithPrivateKey = (privateKey) => ({
  type: LOGIN_PK,
  privateKey,
});

export const setLoginWithAddress = (address) => ({
  type: LOGIN_ADDRESS,
  address,
});

export const logout = () => ({
  type: LOGOUT,
});

export const setPrice = (price, percentage) => ({
  type: SET_PRICE,
  price: parseFloat(price),
  percentage: parseFloat(percentage),
});

export const setActiveCurrency = (currency) => ({
  type: SET_CURRENCY,
  currency
});

export const login = (privateKey) => async (dispatch, getState) => {

  /*if(Lockr.get("account_address")) {
    await dispatch(loginWithPrivateKey(privateKey));
    return
  }
  else {
  */
    dispatch(setWalletLoading(true));
    await dispatch(loginWithPrivateKey(privateKey));
    await dispatch(reloadWallet());
    dispatch(setWalletLoading(false));
    await dispatch(loadRecentTransactions(getState().app.account.address));
 // }
};

export const loginWithAddress = (address) => async (dispatch, getState) => {

  dispatch(setLoginWithAddress(address));

  setTimeout(() => {
    dispatch(reloadWallet());
    dispatch(loadRecentTransactions(address));
  }, 50);
};

export const loadAccounts = () => async (dispatch) => {
  let accounts = await Client.getAccounts();
  dispatch(setAccounts(accounts));
};

export const loadSyncStatus = () => async (dispatch) => {
  let status = await Client.getSystemStatus();
  dispatch(setSyncStatus(status));
};

export const loadPrice = () => async (dispatch) => {
  let {data} = await xhr.get(`https://api.coinmarketcap.com/v1/ticker/tronix/`);
  dispatch(setPrice(data[0].price_usd, data[0].percent_change_24h));
};

export const enableFlag = (flag) => ({
  type: ENABLE_FLAG,
  flag,
});

export const disableFlag = (flag) => ({
  type: DISABLE_FLAG,
  flag,
});
