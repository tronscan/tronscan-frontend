import { API_URL_SUNNET, API_URL } from "../constants.js";
import xhr from "axios/index";
class ApiClientToken {
  constructor() {
    this.apiUrl = {
      mainnet: API_URL,
      sunnet: API_URL_SUNNET
    };
  }

  //获取trx/usd价格
  async getUsdPrice(){
    let eurWinkTronbetURL = encodeURI(`http://api.coinmarketcap.com/v1/ticker/tronix/?convert=EUR`);
    let trxPriceData = await xhr.get(`${API_URL}/api/system/proxy?url=${eurWinkTronbetURL}`);
    let priceUSD = trxPriceData && trxPriceData.data && trxPriceData.data[0] && trxPriceData.data[0].price_usd;
    return priceUSD
  }

   // get address number
   async getParticipateassetissue(params){
    let res = await xhr.get(`${API_URL}/api/tokens/participateassetissue`,{
      params:params} );
    let data = res && res.data
    return data
  }

  //get wink total supply
  async getWinkFund(){
    let res = await xhr.get(`${API_URL}/api/wink/fund`);
    return res && res.data
  }
}

export default new ApiClientToken();
