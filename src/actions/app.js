import {Client} from "../services/api";
import xhr from "axios";
import {loadRecentTransactions, setWebsocket} from "./account";
import {reloadWallet, setWalletLoading} from "./wallet";
import Lockr from "lockr";

export const SET_ACCOUNTS = "SET_ACCOUNTS";
export const LOGIN_LEDGER = 'LOGIN_LEDGER';
export const SET_PRICE = "SET_PRICE";
export const SET_CURRENCY = "SET_CURRENCY";
export const SET_LANGUAGE = "SET_LANGUAGE";
export const LOGIN = "LOGIN";
export const LOGIN_PK = "LOGIN_PK";
export const LOGIN_ADDRESS = "LOGIN_ADDRESS";
export const LOGIN_TRONLINK = "LOGIN_TRONLINK";
export const LOGOUT = "LOGOUT";
export const ENABLE_FLAG = "ENABLE_FLAG";
export const DISABLE_FLAG = "DISABLE_FLAG";
export const SET_THEME = "SET_THEME";
export const SET_SYNC_STATUS = "SET_SYNC_STATUS";
export const SET_SIDECHAINS = 'SET_SIDECHAINS';
export const SET_FEES = 'SET_FEES';

export const setLoginWithLedger = (address, tronWeb, pathIndex) => ({
  type: LOGIN_LEDGER,
  address,
  tronWeb,
  pathIndex,
});

export const setLanguage = (language = "en") => ({
  type: SET_LANGUAGE,
  language
});

export const setTheme = theme => ({
  type: SET_THEME,
  theme
});

export const setAccounts = (accounts = []) => ({
  type: SET_ACCOUNTS,
  accounts
});

export const setSyncStatus = status => ({
  type: SET_SYNC_STATUS,
  status
});

export const loginWithPrivateKey = privateKey => ({
  type: LOGIN_PK,
  privateKey
});

export const setLoginWithAddress = address => ({
  type: LOGIN_ADDRESS,
  address
});


export const setLoginWithTronLink = (address,tronWeb,sunWeb) => ({
    type: LOGIN_TRONLINK,
    address,
    tronWeb,
    sunWeb
});

export const setlLogout = () => ({
  type: LOGOUT
});

export const setPrice = (price, percentage) => ({
  type: SET_PRICE,
  price: parseFloat(price),
  percentage: parseFloat(percentage)
});

export const setActiveCurrency = currency => ({
  type: SET_CURRENCY,
  currency
});

export const logout = () => (dispatch, getState) => {
  const { account, app } = getState()
  account.websocket.send('cancel:'+app.account.address)
  Lockr.rm('localAddress')
  window.onbeforeunload();
  dispatch(setlLogout())
}

export const login = privateKey => async (dispatch, getState) => {
  // let accountKey = Lockr.set("account_key", privateKey);
  // if (Lockr.get("account_address")) {
  //   await dispatch(loginWithPrivateKey(privateKey));
  //   return;
  // } else {
    dispatch(setWalletLoading(true));
    await dispatch(loginWithPrivateKey(privateKey));
    await dispatch(reloadWallet());
    dispatch(setWalletLoading(false));
    await dispatch(loadRecentTransactions(getState().app.account.address))
    //await dispatch(setWebsocket());
    await setWebsocketContent(getState, getState().app.account.address)
  // }
};

export const loginWithAddress = address => async (dispatch, getState) => {
  dispatch(setLoginWithAddress(address));

  setTimeout(() => {
    dispatch(reloadWallet());
    dispatch(loadRecentTransactions(address));
   // dispatch(setWebsocket());
    setWebsocketContent(getState, address)
  }, 50);
};

export const loginWithLedger = (address, tronWeb, pathIndex) => async (dispatch, getState) => {

  dispatch(setLoginWithLedger(address, tronWeb, pathIndex));

  setTimeout(() => {
    dispatch(reloadWallet());
    dispatch(loadRecentTransactions(address));
  //.dispatch(setWebsocket());
    setWebsocketContent(getState, address)
  }, 50);
};

export const loginWithTronLink = (address,tronWeb,sunWeb) => async (dispatch, getState) => {

    dispatch(setWalletLoading(true));
    await dispatch(setLoginWithTronLink(address,tronWeb,sunWeb));
    //setTimeout(() => {
    await dispatch(reloadWallet());
    dispatch(setWalletLoading(false));
    await dispatch(loadRecentTransactions(address));
   // await dispatch(setWebsocket());
    await setWebsocketContent(getState, address)
    //},50)
};

export const loadAccounts = () => async dispatch => {
  let accounts = await Client.getAccounts();
  dispatch(setAccounts(accounts));
};

export const loadSyncStatus = () => async dispatch => {
  let status = await Client.getSystemStatus()
  dispatch(setSyncStatus(status));
};

export const loadPrice = () => async dispatch => {
  let { data } = await xhr.get(
    `https://api.coinmarketcap.com/v1/ticker/tronix/`
  );
  dispatch(setPrice(data[0].price_usd, data[0].percent_change_24h));
};

export const enableFlag = flag => ({
  type: ENABLE_FLAG,
  flag
});

export const disableFlag = flag => ({
  type: DISABLE_FLAG,
  flag
});

// Set side link data
export const setSideChains = sideChains => ({
  type: SET_SIDECHAINS,
  sideChains
});

export const loadSideChains = sideChains => (dispatch) => {
  dispatch(setSideChains(sideChains));
};

// set account fee
export const setFees = fees => ({
  type: SET_FEES,
  fees
});

export const loadFees = fees => (dispatch) => {
  dispatch(setFees(fees));
};

async  function setWebsocketContent(getState, address){
  let { account, app } = getState()
  const localAddress = Lockr.get('localAddress')
  // if(!account.websocket && Lockr.get("websocket") === 'open'){
  //     Lockr.set("websocket","close")
  //     setWebsocket()
  // }
  if(app.wallet.type === 'ACCOUNT_TRONLINK' && account.websocket ){
    if(localAddress !== address && account.websocket){
      await account.websocket.send('cancel:'+localAddress)
    }
  }
  if(account.websocket){
      await account.websocket.send(address)
      Lockr.set('localAddress', address)
  }

}