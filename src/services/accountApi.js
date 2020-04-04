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

  //remove tag
  async removeTag(data) {
    let res = await xhr.post(
      `${this.apiUrl["mainnet"]}/external/tag/delete`,
      data
    );
    return res && res.data;
  }

  //add tag
  async addTag(data) {
    let res = await xhr.post(
      `${this.apiUrl["mainnet"]}/external/tag/insert`,
      data
    );
    return res && res.data;
  }

   //edit tag
   async editTag(data) {
    let res = await xhr.post(
      `${this.apiUrl["mainnet"]}/external/tag/update`,
      data
    );
    return res && res.data;
  }

  //recomend tag
  async recTag(params) {
    let res = await xhr.get(
      `${this.apiUrl["mainnet"]}/external/tag/recommend`,
      {params}
    );
    return res && res.data;
  }

}

export default new ApiClientAccount();
