import xhr from "axios";

export class TronNetworkClient {

  async getMarketInfo() {
    let {data} = await xhr.get(`https://tron.network/api/v1/market_info`);
    return data.data;
  }
}
