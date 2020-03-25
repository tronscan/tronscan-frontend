import { API_URL_SUNNET, API_URL } from "../constants.js";
import xhr from "axios/index";
class ApiClientMonitor {
  constructor() {
    this.apiUrl = {
      mainnet: API_URL,
      sunnet: API_URL_SUNNET
    };
  }

  async setMonitor(data) {
    // if (true) {
    //     return;
    // }
    let url = this.apiUrl["mainnet"];
    return  await xhr({
        method: "post",
        url: `${url}/api/monitor`,
        data: data
      });
        
  }

 
}

export default new ApiClientMonitor();
