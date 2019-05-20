import { Client, Client20 } from "../services/api";
import Lockr from "lockr";
import { cloneDeep, map } from "lodash";
import rebuildList from "../utils/rebuildList";

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
export const setExchanges20Search = (searchList = []) => ({
  type: SET_EXCHANGE20SEARCH_LIST,
  searchList
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

export const getSelectData = (data, isSelect = false) => async dispatch => {
  dispatch(setSelectData(data));
  dispatch(setSelectStatus(isSelect));
};

//获取20列表，及对数据整理
export const getExchanges20 = () => async dispatch => {
  // let { data } = await Client20.getexchanges20();
  let { data } = await Client20.getMarketNew(1);

  let f20_list = Lockr.get("dex20") || [];

  let newList = cloneDeep(data.rows).map((item, index) => {
    item.exchange_id = item.id;
    item.exchange_name = item.fTokenName + "/" + item.sTokenName;
    item.exchange_abbr_name = item.fShortName + "/" + item.sShortName;
    item.first_token_id = item.fTokenName;
    item.second_token_id = item.sTokenName;
    item.first_token_abbr = item.fShortName;
    item.second_token_abbr = item.sShortName;
    item.price = Number(
      (item.price / Math.pow(10, item.sPrecision)).toFixed(item.sPrecision)
    );
    item.volume = parseInt(item.volume / Math.pow(10, item.fPrecision));
    item.svolume = parseInt(item.volume24h / Math.pow(10, item.sPrecision));
    item.high = item.highestPrice24h;
    item.low = item.lowestPrice24h;
    item.token_type = "dex20";

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
  dispatch(setExchanges20(newList));
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
    item.exchange_abbr_name = item.exchange_abbr_name;
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
    item.exchange_abbr_name = item.exchange_abbr_name;
    return item;
  });

  dispatch(setExchanges10(newData));
};

//获取20成交额列表，及对数据整理
export const getExchanges20Volume = () => async dispatch => {
  // let { data } = await Client20.getexchanges20();
  let { data } = await Client20.getMarketNew(0);

  let f20_list = Lockr.get("dex20") || [];

  let newList = cloneDeep(data.rows).map((item, index) => {
    item.exchange_id = item.id;
    item.exchange_name = item.fTokenName + "/" + item.sTokenName;
    item.exchange_abbr_name = item.fShortName + "/" + item.sShortName;
    item.first_token_id = item.fTokenName;
    item.second_token_id = item.sTokenName;
    item.first_token_abbr = item.fShortName;
    item.second_token_abbr = item.sShortName;
    item.price = Number(
      (item.price / Math.pow(10, item.sPrecision)).toFixed(item.sPrecision)
    );
    item.volume = parseInt(item.volume / Math.pow(10, item.fPrecision));
    item.svolume = parseInt(item.volume24h / Math.pow(10, item.sPrecision));
    item.high = item.highestPrice24h;
    item.low = item.lowestPrice24h;
    item.token_type = "dex20";

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
  dispatch(setExchanges20Volume(newList));
};

//获取20列表涨幅榜，及对数据整理
export const getExchanges20UpDown = () => async dispatch => {
  // let { data } = await Client20.getexchanges20();
  let { data } = await Client20.getMarketNew(2);

  let f20_list = Lockr.get("dex20") || [];

  let newList = cloneDeep(data.rows).map((item, index) => {
    item.exchange_id = item.id;
    item.exchange_name = item.fTokenName + "/" + item.sTokenName;
    item.exchange_abbr_name = item.fShortName + "/" + item.sShortName;
    item.first_token_id = item.fTokenName;
    item.second_token_id = item.sTokenName;
    item.first_token_abbr = item.fShortName;
    item.second_token_abbr = item.sShortName;
    item.price = Number(
      (item.price / Math.pow(10, item.sPrecision)).toFixed(item.sPrecision)
    );
    item.volume = parseInt(item.volume / Math.pow(10, item.fPrecision));
    item.svolume = parseInt(item.volume24h / Math.pow(10, item.sPrecision));
    item.high = item.highestPrice24h;
    item.low = item.lowestPrice24h;
    item.token_type = "dex20";

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
  dispatch(setExchanges20UpDown(newList));
};

//获取20列表涨幅榜，及对数据整理
export const getExchanges20Search = (query) => async dispatch => {
  let { data } = await Client20.getExchanges20SearchList(query);

  let f20_list = Lockr.get("dex20") || [];
  let newList =[]
  if(data.rows && data.rows.length > 0){
    newList = cloneDeep(data.rows).map((item, index) => {
      item.exchange_id = item.id;
      item.exchange_name = item.fTokenName + "/" + item.sTokenName;
      item.exchange_abbr_name = item.fShortName + "/" + item.sShortName;
      item.first_token_id = item.fTokenName;
      item.second_token_id = item.sTokenName;
      item.first_token_abbr = item.fShortName;
      item.second_token_abbr = item.sShortName;
      item.price = Number(
        (item.price / Math.pow(10, item.sPrecision)).toFixed(item.sPrecision)
      );
      item.volume = parseInt(item.volume / Math.pow(10, item.fPrecision));
      item.svolume = parseInt(item.volume24h / Math.pow(10, item.sPrecision));
      item.high = item.highestPrice24h;
      item.low = item.lowestPrice24h;
      item.token_type = "dex20";

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
  }
  dispatch(setExchanges20Search(newList));
};

export const setWidget = payload => async dispatch => {
  dispatch(setWidgetaBytype(payload));
};
