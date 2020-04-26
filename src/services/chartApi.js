import { API_URL_SUNNET, API_URL } from "../constants.js";
import xhr from "axios/index";
class ApiClientChart {
  constructor() {
    this.apiUrl = {
      mainnet: API_URL,
      sunnet: API_URL_SUNNET
    };
  }

  //active account chart
  async getActiveAccount(params) {
    let res = await xhr.get(`${this.apiUrl["mainnet"]}/api/account/active_statistic`, {
      params
    });
    return res && res.data;
  }

  // trx price
  async getTrxPrice(params) {
    let res = await xhr.get(`${this.apiUrl["mainnet"]}/api/trx/volume`, {
      params
    });
    return res && res.data;
  }

}

export default new ApiClientChart();
