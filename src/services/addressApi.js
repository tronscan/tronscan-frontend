import { API_URL_SUNNET, API_URL } from "../constants.js";
import xhr from "axios/index";
class ApiClientAddress {
  constructor() {
    this.apiUrl = {
      tronex:"https://httpapi.tronex.io"
    };
  }

  async getWalletReward(address) {
    let url = this.apiUrl.tronex;
    let { data } = await xhr.get(`${url}/wallet/getReward?address=${address}`);
    return data;
  }

  async getHomeAccounts(type, options = {}) {
    let url = this.apiUrl[type || "mainnet"];
    let { data } = await xhr.get(`${url}/api/account/list`, {
      params: options
    });
    return data;
  }
}

export default new ApiClientAddress();
