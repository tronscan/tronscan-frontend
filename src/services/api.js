import {Client as ApiClient} from "@tronscan/client";
import io from 'socket.io-client';
import TronWeb from 'tronweb';
import xhr from "axios/index";
import {API_URL} from '../constants.js'

const ServerNode =  "https://api.trongrid.io";
const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = new HttpProvider(ServerNode); // Full node http endpoint
const solidityNode = new HttpProvider(ServerNode); // Solidity node http endpoint
const eventServer = ServerNode; // Contract events http endpoint
export const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
);


export const Client = new ApiClient();

export function buildClient(account) {
  return new ApiClient();
}

export function channel(path, options) {
   // return io(process.env.API_URL + path, options);
    return io('https://wlcyapi.tronscan.org/socket.io' + path, options);
    //return io('http://172.16.20.207:20110/socket.io' + path, options);
}

class ApiClient20 {
  constructor(){
    this.apiUrl = 'https://api.trx.market'
  }

  async getexchanges20(options= {}){
    let {data} = await xhr.get(`${this.apiUrl}/api/exchange/marketPair/list`, {
        params: options
    });
    return data
  }

  async getRegisterList(id) {
    let {data}  = await xhr.get(`${this.apiUrl}/api/exchange/common/orderListV2/${id}`);

    return data;
  }

  async getCurrentList(query) {
   
    let {data}  = await xhr.get(`${this.apiUrl}/api/exchange/user/order`,{
      params: query
    });

    return data;
  }

  async getTransactionList(query) {
    let {data}  = await xhr.get(`${this.apiUrl}/api/exchange/common/latestOrders`,{
      params: query
    });
    return data;
  }
  async getExchangeCalc(query) {
    let {data}  = await xhr.get(`https://wlcyapi.tronscan.org/api/exchange/calc`,{
      params: query
    });
    return data;
  }

  async  getCurrentPrice(id) {
    let {data} = await xhr.get(`${this.apiUrl}/api/exchange/topprice/${id}`)
    return data;
  }


  async getKlineData20(query) {
    let {data}  = await xhr.get(`${this.apiUrl}/api/exchange/kchart`,{
      params: query
    });
    return data;
  }

  async gettokenInfo20(query) {
    let {data}  = await xhr.get(`${API_URL}/api/token_trc20`,{
      params: {
        sort: 'issue_time',
        start: 0,
        limit: 100,
        ...query
      }
    });
    return data;
  }

    /**
   * 添加订单渠道ID
   */
  async addChannelId(query, headers) {
    let {data} =  await xhr({
      method: 'post',
      url: `${this.apiUrl}/api/exchange/user/chanIdAdd`,
      // url:'http://172.16.21.24:21110/api/exchange/user/chanIdAdd',
      data: query,
      headers:headers
    });
    return data;
  }

}

export const Client20 = new ApiClient20()