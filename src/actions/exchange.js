import {Client} from "../services/api";
import {Client20} from "../services/api";

import { cloneDeep } from 'lodash'


export const SET_SELECT_DATA = 'SET_SELECT_DATA';
export const SET_SELECT_STATUS = 'SET_SELECT_STATUS';
export const SET_EXCHANGE20_LIST = 'SET_EXCHANGE20_LIST';


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


export const getSelectData = (data, isSelect = false) => async (dispatch) => {
    dispatch(setSelectData(data));
    dispatch(setSelectStatus(isSelect))
};

export const getExchange = (data, isSelect = false) => async (dispatch) => {
  dispatch(setSelectData(data));
  dispatch(setSelectStatus(isSelect))
};

export const getExchanges20 = () => async (dispatch,getState) => {
  let { data } = await Client20.getexchanges20();

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
      if (item.gain.indexOf('-') != -1) {
          item.up_down_percent = '-' + Math.abs(Number(item.gain).toFixed(2)) + '%'
          item.isUp = false
      } else {
          item.up_down_percent = '+' + Math.abs(Number(item.gain).toFixed(2)) + '%'
          item.isUp = true
      }
      
     return item
  })
  
  dispatch(setExchanges20(newList))
}