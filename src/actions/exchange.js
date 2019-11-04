import { Client, Client20 } from "../services/api";
import Lockr from "lockr";
import { cloneDeep, map } from "lodash";
import rebuildList from "../utils/rebuildList";
import { precisions } from "../components/exchange/dex20/TokenPre";

export const SET_SELECT_DATA = "SET_SELECT_DATA";
export const SET_SELECT_STATUS = "SET_SELECT_STATUS";
export const SET_EXCHANGE20_LIST = "SET_EXCHANGE20_LIST";
export const SET_EXCHANGE10_LIST = "SET_EXCHANGE10_LIST";
export const SET_EXCHANGEALL_LIST = "SET_EXCHANGEALL_LIST";
export const SET_COLLECTION = "SET_COLLECTION";
export const SET_LASTPRICE = "SET_LASTPRICE";
export const SET_QUICKSELCET = "SET_QUICKSELCET";
export const SET_UPDATE_TRAN = "SET_UPDATE_TRAN";
export const SET_10_LOCK = "SET_10_LOCK";
export const SET_WIDGET = "SET_WIDGET";
export const SET_REGISTER = "SET_REGISTER";
export const SET_PRICE_CONVERT = "SET_PRICE_CONVERT";
export const SET_EXCHANGE20VOLUME_LIST = "SET_EXCHANGE20VOLUME_LIST";
export const SET_EXCHANGE20UPDOWN_LIST = "SET_EXCHANGE20UPDOWN_LIST";
export const SET_EXCHANGE20SEARCH_LIST = "SET_EXCHANGE20SEARCH_LIST";
export const SET_UNFIRM_ORDER_LIST = "SET_UNFIRM_ORDER_LIST";
export const SET_CANCEL_ORDER_LIST = "SET_CANCEL_ORDER_LIST";
export const SET_DELEGATE_FAILURE_LIST = "SET_DELEGATE_FAILURE_LIST";
export const SET_REDIRCT_PAIR = "SET_REDIRCT_PAIR";
export const SET_EXCHANGE20BYIDS = "SET_EXCHANGE20BYIDS";

export const setSelectData = data => ({
  type: SET_SELECT_DATA,
  data
});

export const setSelectStatus = status => ({
  type: SET_SELECT_STATUS,
  status
});

export const setExchanges20 = (list = []) => ({
  type: SET_EXCHANGE20_LIST,
  list
});
export const setExchanges20Volume = (volumeList = []) => ({
  type: SET_EXCHANGE20VOLUME_LIST,
  volumeList
});
export const setExchanges20UpDown = (upDownList = []) => ({
  type: SET_EXCHANGE20UPDOWN_LIST,
  upDownList
});
export const setExchanges20Search = (searchList = {}) => ({
  type: SET_EXCHANGE20SEARCH_LIST,
  searchList
});
export const setExchanges20ByIds = searchListByIds => ({
  type: SET_EXCHANGE20BYIDS,
  searchListByIds
});
export const setExchanges10 = (list = []) => ({
  type: SET_EXCHANGE10_LIST,
  list
});
export const setExchangesAll = (list = []) => ({
  type: SET_EXCHANGEALL_LIST,
  list
});

export const setCollection = payload => ({
  type: SET_COLLECTION,
  payload
});

export const setLastprice = obj => ({
  type: SET_LASTPRICE,
  obj
});

export const setQuickSelect = obj => ({
  type: SET_QUICKSELCET,
  obj
});

export const setUpdateTran = is_update_tran => ({
  type: SET_UPDATE_TRAN,
  is_update_tran
});

export const change10lockstatus = type => ({
  type: SET_10_LOCK,
  lock: type
});

export const setWidgetaBytype = payload => ({
  type: SET_WIDGET,
  data: payload
});

export const setRegister = register => ({
  type: SET_REGISTER,
  register
});

export const setPriceConvert = data => ({
  type: SET_PRICE_CONVERT,
  price: data
});

export const change10lock = type => async dispatch => {
  dispatch(change10lockstatus(type));
};

export const setUnfirmOrderlist = list => ({
  type: SET_UNFIRM_ORDER_LIST,
  unConfirmOrderList: list
});

export const setCancelOrderlist = list => ({
  type: SET_CANCEL_ORDER_LIST,
  cancelOrderList: list
});

export const setDelegateFailureList = list => ({
  type: SET_DELEGATE_FAILURE_LIST,
  delegateFailureList: list
});

export const setRedirctPair = obj => ({
  type: SET_REDIRCT_PAIR,
  redirctPair: obj
});

export const getSelectData = (data, isSelect = false) => async dispatch => {
  dispatch(setSelectData(data));
  dispatch(setSelectStatus(isSelect));
};

// 本地存储 未确认订单
export const setUnConfirmOrderObj = (obj, type) => async (
  dispatch,
  getState
) => {
  const { exchange } = getState();
  let unConfirmOrderList = [];
  let localConfirm = Lockr.get("unConfirmOrderList");
  if (type == 1 && localConfirm) {
    unConfirmOrderList = localConfirm;
  } else if (exchange.unConfirmOrderList) {
    unConfirmOrderList = [...exchange.unConfirmOrderList];
  }
  type != 1 && unConfirmOrderList.unshift(obj);
  Lockr.set("unConfirmOrderList", unConfirmOrderList);
  dispatch(setUnfirmOrderlist(unConfirmOrderList));
};

// 本地存储 删除已经存在的订单
export const deleteUnConfirmOrderObj = index => async (dispatch, getState) => {
  const { exchange } = getState();
  let unConfirmOrderList = [...exchange.unConfirmOrderList];
  unConfirmOrderList.splice(index, 1);

  Lockr.set("unConfirmOrderList", unConfirmOrderList);

  dispatch(setUnfirmOrderlist(unConfirmOrderList));
};

// 本地存储 取消但未确认的订单
export const setCancelOrderObj = (obj, type) => async (dispatch, getState) => {
  const { exchange } = getState();
  let cancelOrderList = [];
  let localCancelOrderList = Lockr.get("cancelOrderList");
  if (type == 1 && localCancelOrderList) {
    cancelOrderList = localCancelOrderList;
  } else if (exchange.cancelOrderList) {
    cancelOrderList = [...exchange.cancelOrderList];
  }
  type != 1 && cancelOrderList.push(obj);

  dispatch(setCancelOrderlist(cancelOrderList));

  Lockr.set("cancelOrderList", cancelOrderList);
};

// 本地存储 删除掉已取消确认的订单
export const deleteCancelOrderObj = index => async (dispatch, getState) => {
  const { exchange } = getState();

  let cancelOrderList = [...exchange.cancelOrderList];
  cancelOrderList.splice(index, 1);

  Lockr.set("cancelOrderList", cancelOrderList);

  dispatch(setCancelOrderlist(cancelOrderList));
};

// 本地存储 委托失败一星期内的订单
export const setDelegateFailureObj = (item, type) => async (
  dispatch,
  getState
) => {
  const { exchange } = getState();
  let localDelegate = Lockr.get("delegateFailureList");
  let obj = {};
  if (type == 1) {
    if (localDelegate) {
      obj = localDelegate;
    }
  } else {
    obj = { ...exchange.delegateFailureList };
    obj[item.address] = item.delegateFailureList;
  }

  Lockr.set("delegateFailureList", obj);

  dispatch(setDelegateFailureList(obj));
};

//获取20列表，及对数据整理
export const getExchanges20 = (sortType, pairType) => async dispatch => {
  let { data } = await Client20.getMarketNew(sortType, pairType);

  let newList = organizeData(data.rows || []);

  switch (Number(sortType)) {
    case 1:
      dispatch(setExchanges20(newList));
      break;
    case 0:
      dispatch(setExchanges20Volume(newList));
      break;
    case 2:
      dispatch(setExchanges20UpDown(newList));
      break;
  }
};

//获取10币所有列表，并且对数据整理
export const getExchangesAllList = () => async dispatch => {
  let { exchangesAllList } = await Client.getexchangesAllList();

  let f_list = Lockr.get("optional") || [];
  map(exchangesAllList, item => {
    if (item.up_down_percent.indexOf("-") != -1) {
      item.up_down_percent =
        "-" + Math.abs(Number(item.up_down_percent).toFixed(2)) + "%";
      item.isUp = false;
    } else {
      item.up_down_percent =
        "+" + Math.abs(Number(item.up_down_percent).toFixed(2)) + "%";
      item.isUp = true;
    }
    item.token_type = "dex10";
    item.price = Number(item.price.toFixed(6));

    f_list.map(id => {
      if (item.exchange_id == id) {
        item.isChecked = true;
      }
    });
  });

  const data = rebuildList(
    exchangesAllList,
    ["first_token_id", "second_token_id"],
    ["first_token_balance", "second_token_balance"]
  );

  const newData = data.map(item => {
    item.first_token_id = item.map_token_name;
    item.second_token_id = item.map_token_name1;
    item.exchange_name = item.map_token_name + "/" + item.map_token_name1;
    return item;
  });
  dispatch(setExchangesAll(newData));
};

export const getExchanges = () => async dispatch => {
  let { data } = await Client.getExchangesList();
  let f_list = Lockr.get("optional") || [];

  map(data, item => {
    if (item.up_down_percent.indexOf("-") != -1) {
      item.up_down_percent =
        "-" + Math.abs(Number(item.up_down_percent).toFixed(2)) + "%";
      item.isUp = false;
    } else {
      item.up_down_percent =
        "+" + Math.abs(Number(item.up_down_percent).toFixed(2)) + "%";
      item.isUp = true;
    }
    item.token_type = "dex10";
    item.price = Number(item.price.toFixed(6));

    f_list.map(id => {
      if (item.exchange_id == id) {
        item.isChecked = true;
      }
    });
  });
  const exchange10 = rebuildList(
    data,
    ["first_token_id", "second_token_id"],
    ["first_token_balance", "second_token_balance"]
  );

  const newData = exchange10.map(item => {
    item.first_token_id = item.map_token_name;
    item.second_token_id = item.map_token_name1;
    item.exchange_name = item.map_token_name + "/" + item.map_token_name1;
    return item;
  });

  dispatch(setExchanges10(newData));
};

//获取20币搜索，及对数据整理
export const getExchanges20Search = query => async dispatch => {
  let { data } = await Client20.getExchanges20SearchList(query);
  let { list, hiddenList } = data;

  let recomendList = organizeData(list.rows || []);
  let unRecomendList = organizeData(hiddenList.rows || []);
  let obj = { recomendList, unRecomendList };
  dispatch(setExchanges20Search(obj));
};

//根据ids去查询交易列表
export const getExchangesByIds = ids => async dispatch => {
  // let { data } = await Client20.getexchanges20();
  let { data } = await Client20.marketSearchListById(ids);

  let newList = organizeData(data ? data.rows : []);
  dispatch(setExchanges20ByIds(newList));
};

//根据ids去查询交易列表 但不存储
export const getExchangesByIdsContent = ids => async dispatch => {
  // let { data } = await Client20.getexchanges20();
  let { data } = await Client20.marketSearchListById(ids);

  let newList = organizeData(data ? data.rows : []);
  return newList;
};

// 整理数据封装
export const organizeData = data => {
  let f20_list = Lockr.get("dex20") || [];
  let neData = cloneDeep(data) || [];
  let newList = cloneDeep(neData).map((item, index) => {
    item.exchange_id = item.id;
    item.exchange_name = item.fTokenName + "/" + item.sTokenName;
    item.exchange_abbr_name = item.fShortName + "/" + item.sShortName;
    item.first_token_id = item.fTokenName;
    item.second_token_id = item.sTokenName;
    item.first_token_abbr = item.fShortName;
    item.second_token_abbr = item.sShortName;
    item.first_token_abbr = item.fTokenAddr;
    item.price = Number(
      (item.price / Math.pow(10, item.sPrecision)).toFixed(item.sPrecision)
    );
    item.volume = parseInt(item.volume / Math.pow(10, item.fPrecision));
    item.svolume = parseInt(item.volume24h / Math.pow(10, item.sPrecision));
    item.high = item.highestPrice24h;
    item.low = item.lowestPrice24h;
    item.token_type = "dex20";

    let key =
      item.fShortName.toLowerCase() + "_" + item.sShortName.toLowerCase();

    item.fix_precision = precisions[key] || item.sPrecision;

    if (item.gain.indexOf("-") != -1) {
      item.up_down_percent = Number(item.gain * 100).toFixed(2) + "%";
      item.isUp = false;
    } else {
      item.up_down_percent = "+" + Number(item.gain * 100).toFixed(2) + "%";
      item.isUp = true;
    }

    f20_list.map(id => {
      if (item.exchange_id == id) {
        item.isChecked = true;
      }
    });

    return item;
  });

  return newList;
};

export const setWidget = payload => async dispatch => {
  dispatch(setWidgetaBytype(payload));
};
