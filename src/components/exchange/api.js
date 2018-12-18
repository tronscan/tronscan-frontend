

import xhr from "axios/index";

class ApiClient {
  constructor(){
    this.apiUrl = 'https://api.trx.market'
  }

  async getexchanges20(options= {}){
    let {data} = await xhr.get(`${this.apiUrl}/api/exchange/marketPair/list`, {
        params: options
    });
    return data
  }
}

export const Client20 = new ApiClient()