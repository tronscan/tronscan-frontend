import {Client} from "../services/api";
import Lockr from "lockr";
import ReconnectingWebSocket from 'reconnecting-websocket'
import { IS_MAINNET } from "../constants";

export const SET_TOKEN_BALANCES = 'SET_TOKEN_BALANCES';
export const SET_RECENT_TRANSACTIONS = 'SET_RECENT_TRANSACTIONS';
export const SET_TOTAL_TRANSACTIONS = 'SET_TOTAL_TRANSACTIONS';
export const SET_WEBSOCKET = 'SET_WEBSOCKET';
export const SET_WS_DATA = 'SET_WS_DATA';

export const setTokenBalances = (tokens = [], trc20token = [], frozen = {}, accountResource = {}, delegated={} ) => ({
  type: SET_TOKEN_BALANCES,
  tokens,
  trc20token,
  frozen,
  accountResource,
  delegated,
});


export const setRecentTransactions = (transactions = []) => ({
  type: SET_RECENT_TRANSACTIONS,
  transactions,
});

export const setTotalTransactions = (totalTransactions = 0) => ({
  type: SET_TOTAL_TRANSACTIONS,
  totalTransactions,
});

export const setWebsocketFn = (socketData) => ({
  type: SET_WEBSOCKET,
  socketData,
});

export const setWsData = (wsdata) => ({
  type: SET_WS_DATA,
  wsdata,
});

export const loadRecentTransactions = (address) => async (dispatch) => {
  let {transfers, total} = await Client.getTransactions({
    limit: 10,
    address,
    sort: '-timestamp',
  });
  dispatch(setRecentTransactions(transfers));
  dispatch(setTotalTransactions(total));
};


export const setWebsocket = () => async (dispatch) => {
  // if(Lockr.get("websocket") === 'open'){
  //   return;
  // }
  // var wsUri = "wss://apilist.tronscan.org/api/tronsocket";
  // var wsUri = "wss://api.shasta.tronscan.org/api/tronsocket";
  let wsUrl;
  let wsUrlMain = "ws://3.14.14.175:9000/api/tronsocket";
  let wsUrlSun = "ws://3.15.181.169:9000/api/tronsocket";
  if(IS_MAINNET){
      wsUrl = wsUrlMain
  }else{
      wsUrl =  wsUrlSun
  }

  let websocket = new ReconnectingWebSocket(wsUrl, [], {
    minReconnectionDelay: 500
  })
  websocket.onopen = res => {

  }

  websocket.onmessage = res => {
    dispatch(setWsData(JSON.parse(res.data)))
  }

  websocket.onerror = error => {
    console.log(error)
  }

  window.onbeforeunload = function() {
    Lockr.set("websocket", 'close')
    websocket.close();
  }
  dispatch(setWebsocketFn(websocket))
  Lockr.set("websocket", 'open')
};