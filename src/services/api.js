import { Client as ApiClient } from "@tronscan/client";
import io from "socket.io-client";
import TronWeb from "tronweb";
import xhr from "axios/index";
import { API_URL,API_URL_SUNNET } from "../constants.js";
import { setLoginWithAddress } from "../actions/app.js";
const ServerNode = "https://api.trongrid.io";
const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = new HttpProvider(ServerNode); // Full node http endpoint
const solidityNode = new HttpProvider(ServerNode); // Solidity node http endpoint
const eventServer = ServerNode; // Contract events http endpoint
export const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);

export const Client = new ApiClient(API_URL);

export function buildClient(account) {
  return new ApiClient(API_URL);
}

export function channel(path, options) {
  // return io(process.env.API_URL + path, options);
  return io("https://wlcyapi.tronscan.org/socket.io" + path, options);
  //return io('http://172.16.20.207:20110/socket.io' + path, options);
}

class ApiClient20 {
  constructor() {
    this.apiUrl = "https://api.poloniex.org";
    // this.apiUrl = "https://testapi.trx.market";
    // this.apiUrl = "http://13.58.63.31:21111";
    this.ZDUrl = "https://tron274.zendesk.com";
    this.SCANUrl = "https://tronscanorg.zendesk.com";
  }

  async getexchanges20(options = {}) {
    let { data } = await xhr.get(
      `${this.apiUrl}/api/exchange/marketPair/list`,
      {
        params: options
      }
    );
    return data;
  }

  async getRegisterList(id) {
    let { data } = await xhr.get(
      `${this.apiUrl}/api/exchange/common/orderListV2/${id}`
    );

    return data;
  }

  async getCurrentList(query) {
    let { data } = await xhr.get(
      `${this.apiUrl}/api/exchange/user/order`,
      // `http://13.58.63.31:21110/api/exchange/user/order`,
      {
        params: query
      }
    );

    return data;
  }

  async getTransactionList(query) {
    let { data } = await xhr.get(
      `${this.apiUrl}/api/exchange/common/latestOrders`,
      {
        params: query
      }
    );
    return data;
  }
  async getExchangeCalc(query) {
    let { data } = await xhr.get(
      `https://wlcyapi.tronscan.org/api/exchange/calc`,
      {
        params: query
      }
    );
    return data;
  }

  async getCurrentPrice(id) {
    let { data } = await xhr.get(
      `${this.apiUrl}/api/exchange/toppriceV2/${id}`
    );
    return data;
  }

  async getKlineData20(query) {
    let { data } = await xhr.get(`${this.apiUrl}/api/exchange/kchart`, {
      params: query
    });
    return data;
  }

  async gettokenInfo20(query) {
    let { data } = await xhr.get(`${API_URL}/api/token_trc20`, {
      params: {
        sort: "issue_time",
        start: 0,
        limit: 100,
        ...query
      }
    });
    return data;
  }

  async getTokenInfoItem(contract, type) {
    // https://apilist.tronscan.org/api/token_trc20?contract=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
    let params = {};
    let url = `${API_URL}/api/token_trc20`;
    switch (type) {
      case 1:
        params = {
          id: contract
        };
        url = `${API_URL}/api/token`;
        break;
      case 2:
        params = {
          contract: contract
        };
        break;
      case 4:
        params = {
          id: contract
        };
        url = `${API_URL}/api/token`;
        break;
      case 3:
        params = {
          contract: contract
        };
        break;
      default:
        break;
    }
    let { data } = await xhr.get(url, {
      params: params
    });
    return data;
  }

  async getExchanges20SearchList(options = {}) {
    let { data } = await xhr.get(
      // `http://52.15.171.70:21110/api/exchange/marketPair/market/searchList`,
      `${this.apiUrl}/api/exchange/marketPair/market/searchList`,
      {
        params: options
      }
    );
    return data;
  }

  /**
   * 添加订单渠道ID
   */
  async addChannelId(query, headers) {
    let { data } = await xhr({
      method: "post",
      url: `${this.apiUrl}/api/exchange/user/chanIdAdd`,
      // url:'http://172.16.21.24:21110/api/exchange/user/chanIdAdd',
      data: query,
      headers: headers
    });
    return data;
  }

  /**
   * 深度图
   */
  async depthChart(id) {
    let { data } = await xhr({
      method: "get",
      url: `${this.apiUrl}/api/exchange/common/deepgraph/${id}`
      // url: `http://18.222.178.103:3006/dex/exchange/common/deepgraph/${id}`
    });
    return data;
  }

  /**
   * 获取zendesk消息系统
   */
  async getNotice(lan, query) {
    let langauage = "en-us";
    lan == "zh" ? (langauage = "zh-cn") : (langauage = "en-us");
    let { data } = await xhr({
      method: "get",
      url: `${this.ZDUrl}/api/v2/help_center/${langauage}/categories/360001523732/articles.json?sort_by=created_at&sort_order=desc&per_page=${query.page}`
    });
    return data;
  }

  /**
   * 获取zendesk TRONSCAN消息系统
   */
  async getTRONNotice(lan, query) {
    let langauage = "en-us";
    let id = "360001621692";
    lan == "zh" ? (langauage = "zh-cn") : (langauage = "en-us");
    lan == "zh" ? (id = "360001618172") : (id = "360001621692");
    let { data } = await xhr({
      method: "get",
      url: `${this.SCANUrl}/api/v2/help_center/${langauage}/categories/${id}/articles.json?sort_by=created_at&sort_order=desc&per_page=${query.page}`
    });
    return data;
  }

  //币之间的换算
  async coinMarketCap(secend_token, covert) {
    let type = "tronix";
    if (secend_token === "usdt") {
      type = "tether";
    }
    const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=TRX&convert=USD'
    let { data } = await xhr({
      method: "post",
      url: `${API_URL}/api/system/proxy`,
      data: {
        url
      }
    });
    return data;
  }

  //market新接口，sortType=0 24小时交易额 sortType=1 热门 sortType=2 涨跌幅
  async getMarketNew(sortType, pairType) {
    let obj = { sortType, pairType };
    let { data } = await xhr({
      method: "get",
      url: `${this.apiUrl}/api/exchange/marketPair/list`,
      params: obj
    });
    return data;
  }

  /**
   * 异常订单处理
   * @param {string} action_type   挂单"entry" or 撤单"cancel"
   * @param {string} entry_txid   挂单的hash
   * @param {string} cancel_txid   撤单的hash
   * @param {number} order_id 订单ID
   */
  async abnormalOrderStatus(query) {
    let { data } = await xhr({
      method: "get",
      url: `${this.apiUrl}/api/exchange/common/abnormalOrderStatus`,
      params: query
    });
    return data;
  }

  //根据ids去查交易列表
  async marketSearchListById(ids) {
    let obj = { ids };
    let { data } = await xhr({
      method: "get",
      url: `${this.apiUrl}/api/exchange/marketPair/searchListByIds`,
      params: obj
    });
    return data;
  }
}

class ApiProposal{
  constructor() {
    this.apiUrl = {
      mainnet: API_URL,
      sunnet: API_URL_SUNNET
    };
  }
  async getMyProposalList(options = {},type) {
    let url = this.apiUrl[type || "mainnet"];
    let { data } = await xhr.get(
      `${url}/api/account-proposal`,
      {
        params: options
      }
    );
    return data;
  }
}

class ApiAccount{
  constructor() {
    this.apiUrl = {
      mainnet: API_URL,
      sunnet: API_URL_SUNNET
    };
  }

  async getAccountOverviewStats(options = {},type) {
    let url = this.apiUrl[type || "mainnet"];
    let { data } = await xhr.get(
      `${url}/api/stats/overview`,
      {
        params: options
      }
    );
    return data;
  }

  async getAccountFreezeResource(options = {},type) {
    let url = this.apiUrl[type || "mainnet"];
    let { data } = await xhr.get(
      `${url}/api/account/resource`,
      {
        params: options
      }
    );
    return data;
  }
}

export const proposalApi = new ApiProposal();

export const Client20 = new ApiClient20();

export const AccountApi = new ApiAccount();