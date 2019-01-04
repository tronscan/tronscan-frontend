import {Client} from "../services/api";
import {Client20} from "../services/api";
import Lockr from "lockr";
import { remove,map } from 'lodash';
import rebuildList from "../utils/rebuildList";

import { cloneDeep,concat } from 'lodash'


export const SET_SELECT_DATA = 'SET_SELECT_DATA';
export const SET_SELECT_STATUS = 'SET_SELECT_STATUS';
export const SET_EXCHANGE20_LIST = 'SET_EXCHANGE20_LIST';
export const SET_EXCHANGE10_LIST = 'SET_EXCHANGE10_LIST';
export const SET_EXCHANGEALL_LIST = 'SET_EXCHANGEALL_LIST';
export const SET_COLLECTION = 'SET_COLLECTION';
export const SET_LASTPRICE = 'SET_LASTPRICE';
export const SET_QUICKSELCET = 'SET_QUICKSELCET'
export const SET_UPDATE_TRAN = 'SET_UPDATE_TRAN'
export const SET_10_LOCK = 'SET_10_LOCK'




export const setSelectData = (data) => ({
  type: SET_SELECT_DATA,
  data,
});

export const setSelectStatus = (status) => ({
  type: SET_SELECT_STATUS,
  status,
});

export const setExchanges20 = (list = []) => ({
  type: SET_EXCHANGE20_LIST,
  list,
});
export const setExchanges10 = (list = []) => ({
  type: SET_EXCHANGE10_LIST,
  list,
});
export const setExchangesAll = (list = []) => ({
  type: SET_EXCHANGEALL_LIST,
  list,
});



export const setCollection = (payload) => ({
  type: SET_COLLECTION,
  payload,
});

export const setLastprice = (obj) => ({
  type: SET_LASTPRICE,
  obj,
});

export const setQuickSelect = (obj) => ({
  type: SET_QUICKSELCET,
  obj,
});

export const setUpdateTran = (is_update_tran)=>({
  type: SET_UPDATE_TRAN,
  is_update_tran,
})

export const change10lockstatus = (type)=>({
  type: SET_10_LOCK,
  lock: type
})

export const change10lock = (type) => async (dispatch) => {
  dispatch(change10lockstatus(type))
}


export const getSelectData = (data, isSelect = false) => async (dispatch) => {
    dispatch(setSelectData(data));
    dispatch(setSelectStatus(isSelect))
};

export const getExchanges20 = () => async (dispatch) => {
  let { data } = await Client20.getexchanges20();
  let f20_list =  Lockr.get('dex20')|| []

  let newList =  cloneDeep(data.rows).map((item, index) => {
      item.exchange_id = item.id
      item.exchange_name = item.fTokenName+'/'+item.sTokenName
      item.exchange_abbr_name = item.fShortName+'/'+item.sShortName
      item.first_token_id = item.fTokenName
      item.second_token_id = item.sTokenName
      item.first_token_abbr = item.fShortName
      item.second_token_abbr = item.sShortName
      item.price = Number((item.price / Math.pow(10,item.sPrecision)).toFixed(item.sPrecision))
      item.volume = parseInt(item.volume / Math.pow(10,item.fPrecision))
      item.svolume = parseInt(item.volume24h / Math.pow(10,item.sPrecision))
      item.high = item.highestPrice24h
      item.low = item.lowestPrice24h
      item.token_type = 'dex20'
      if (item.gain.indexOf('-') != -1) {
          item.up_down_percent = '-' + Math.abs(Number(item.gain*100).toFixed(2)) + '%'
          item.isUp = false
      } else {
          item.up_down_percent = '+' + Math.abs(Number(item.gain*100).toFixed(2)) + '%'
          item.isUp = true
      }
      f20_list.map(id => {
        if(item.exchange_id == id){
          item.isChecked = true
        }
      })
      
     return item
  })
  dispatch(setExchanges20(newList))
}


export const getExchangesAllList = () => async (dispatch) => {
  let { exchangesAllList }= await Client.getexchangesAllList();
  let f_list =  Lockr.get('optional')|| []
  map(exchangesAllList, item => {
    if (item.up_down_percent.indexOf('-') != -1) {
      item.up_down_percent = '-' + Math.abs(Number(item.up_down_percent).toFixed(2)) + '%'
      item.isUp = false
    } else {
        item.up_down_percent = '+' + Math.abs(Number(item.up_down_percent).toFixed(2)) + '%'
        item.isUp = true
    }
    item.token_type = 'dex10'

    f_list.map(id => {
      if(item.exchange_id == id){
        item.isChecked = true
      }
    })
  })

  
  const data = rebuildList(exchangesAllList, ['first_token_id','second_token_id'], ['first_token_balance','second_token_balance'])
  
  const newData = data.map(item => {
    item.first_token_id = item.map_token_name
    item.second_token_id = item.map_token_name1
    return item
  })
  dispatch(setExchangesAll(newData))
}

export const getExchanges = () => async (dispatch) => {
  let { data } = await Client.getExchangesList();
  let f_list =  Lockr.get('optional')|| []
  map(data, item => {
    if (item.up_down_percent.indexOf('-') != -1) {
      item.up_down_percent = '-' + Math.abs(Number(item.up_down_percent).toFixed(2)) + '%'
      item.isUp = false
    } else {
        item.up_down_percent = '+' + Math.abs(Number(item.up_down_percent).toFixed(2)) + '%'
        item.isUp = true
    }
    item.token_type = 'dex10'

    f_list.map(id => {
      if(item.exchange_id == id){
        item.isChecked = true
      }
    })
  })
  const exchange10 = rebuildList(data, ['first_token_id','second_token_id'], ['first_token_balance','second_token_balance'])
  
  const newData = exchange10.map(item => {
    item.first_token_id = item.map_token_name
    item.second_token_id = item.map_token_name1
    return item
  })
  
  dispatch(setExchanges10(newData))
}

