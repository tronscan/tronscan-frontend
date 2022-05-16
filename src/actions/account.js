import { Client } from "../services/api";
import Lockr from "lockr";
import ReconnectingWebSocket from "reconnecting-websocket";
import { IS_MAINNET, TORNSOCKET } from "../constants";

export const SET_TOKEN_BALANCES = "SET_TOKEN_BALANCES";
export const SET_RECENT_TRANSACTIONS = "SET_RECENT_TRANSACTIONS";
export const SET_TOTAL_TRANSACTIONS = "SET_TOTAL_TRANSACTIONS";
export const SET_WEBSOCKET = "SET_WEBSOCKET";
export const SET_WS_DATA = "SET_WS_DATA";
export const SET_TOKEN20_MAP = "SET_TOKEN20_MAP";
export const SET_TOKEN_MAP = "SET_TOKEN_MAP";
export const SET_WEBSOCKET_SUN = "SET_WEBSOCKET_SUN";
export const SET_WS_DATA_SUN = "SET_WS_DATA_SUN";
export const SET_PERMISSIONS = "SET_PERMISSIONS";
export const setTokenBalances = (
  tokens = [],
  trc20token = [],
  frozen = {},
  accountResource = {},
  delegated = {},
) => ({
  type: SET_TOKEN_BALANCES,
  tokens,
  trc20token,
  frozen,
  accountResource,
  delegated,
});

export const setRecentTransactions = (transactions = []) => ({
  type: SET_RECENT_TRANSACTIONS,
  transactions
});

export const setTotalTransactions = (totalTransactions = 0) => ({
  type: SET_TOTAL_TRANSACTIONS,
  totalTransactions
});

export const setWebsocketFn = socketData => ({
  type: SET_WEBSOCKET,
  socketData
});

export const setWsData = wsdata => ({
  type: SET_WS_DATA,
  wsdata
});
export const setWebsocketSunFn = socketDataSun => ({
  type: SET_WEBSOCKET_SUN,
  socketDataSun
});

export const setWsDataSun = wsdataSun => ({
  type: SET_WS_DATA_SUN,
  wsdataSun
});

export const loadRecentTransactions = address => async dispatch => {
  let { transfers, total } = await Client.getTransactions({
    limit: 10,
    address,
    sort: "-timestamp"
  });
  dispatch(setRecentTransactions(transfers));
  dispatch(setTotalTransactions(total));
};

export const setWebsocket = () => async dispatch => {
  // if(Lockr.get("websocket") === 'open'){
  //   return;
  // }
  // var wsUri = "wss://apilist.tronscan.org/api/tronsocket";
  let wsUrl;

  if (IS_MAINNET) {
    wsUrl = TORNSOCKET.WSSURLMAIN;
  } else {
    wsUrl = TORNSOCKET.WSSURLSUN;
  }

  let websocket = new ReconnectingWebSocket(wsUrl, [], {
    minReconnectionDelay: 500
  });
  websocket.onopen = res => {};

  websocket.onmessage = res => {
    dispatch(setWsData(JSON.parse(res.data)));
  };

  websocket.onerror = error => {
    console.log(error);
  };

  window.onbeforeunload = function() {
    Lockr.set("websocket", "close");
    websocket.close();
  };
  dispatch(setWebsocketFn(websocket));
  Lockr.set("websocket", "open");
};

export const setWebsocketSun = () => async dispatch => {
  let wsUrl = TORNSOCKET.WSSURLSUN;

  let websocket = new ReconnectingWebSocket(wsUrl, [], {
    minReconnectionDelay: 500
  });
  websocket.onopen = res => {};

  websocket.onmessage = res => {
    dispatch(setWsDataSun(JSON.parse(res.data)));
  };

  websocket.onerror = error => {
    console.log(error);
  };

  window.onbeforeunload = function() {
    Lockr.set("websocketsun", "close");
    websocket.close();
  };
  dispatch(setWebsocketSunFn(websocket));
  Lockr.set("websocketsun", "open");
};

// token20Map
export const setToken20Map = (token20Map = {}) => ({
  type: SET_TOKEN20_MAP,
  token20Map
});

// tokenMap
export const setTokenMap = (tokenMap = {}) => ({
  type: SET_TOKEN_MAP,
  tokenMap
});

//mutiSign permission
export const setPermissions = (permission = {}) => ({
  type: SET_PERMISSIONS,
  permission
});
