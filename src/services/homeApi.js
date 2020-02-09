import { API_URL_SUNNET, API_URL } from "../constants.js";
import xhr from "axios/index";
class ApiClientHome {
  constructor() {
    this.apiUrl = {
      mainnet: API_URL,
      sunnet: API_URL_SUNNET
    };
  }

  async getHomePage(type) {
    let url = this.apiUrl[type || "mainnet"];
    let { data } = await xhr.get(`${url}/api/system/homepage-bundle`);
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

export default new ApiClientHome();
