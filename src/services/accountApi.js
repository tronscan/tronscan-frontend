import { API_URL_SUNNET, API_URL } from "../constants.js";
import xhr from "axios/index";
class ApiClientAccount {
  constructor() {
    this.apiUrl = {
      mainnet: API_URL,
      sunnet: API_URL_SUNNET
    };
  }

  //get tags list
  async getTagsList(params) {
    let res = await xhr.get(`${this.apiUrl["mainnet"]}/external/tag`, {
      params
    });
    return res && res.data;
  }
}

export default new ApiClientAccount();
