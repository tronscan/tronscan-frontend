import { API_URL_SUNNET, API_URL } from "../constants.js";
import xhr from "axios/index";
class ApiClientToken {
  constructor() {
    this.apiUrl = {
      mainnet: API_URL,
      sunnet: API_URL_SUNNET
    };
  }

  //get trx/usd price
  async getUsdPrice(){
    // let eurWinkTronbetURL = encodeURI(`https://api.coinmarketcap.com/v1/ticker/tronix/?convert=EUR`);
    // let trxPriceData = await xhr.get(`${API_URL}/api/system/proxy?url=${eurWinkTronbetURL}`);
    // let priceUSD = trxPriceData && trxPriceData.data && trxPriceData.data[0] && trxPriceData.data[0].price_usd;
    const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=TRX&convert=USD'
    let { data } = await xhr({
      method: "post",
      url: `${API_URL}/api/system/proxy`,
      data: {
        url
      }
    });
    let priceUSD = data.data &&
                    data.data.TRX &&
                    data.data.TRX.quote &&
                    data.data.TRX.quote['USD'] && 
                    data.data.TRX.quote['USD'].price
    return priceUSD
  }
  //get coinId
  async getCoinId(address, type) {
    let url = this.apiUrl[type || "mainnet"];
    let obj = { address };
    let { data } = await xhr({
      method: "get",
      url: `${url}/api/token/id-mapper`,
      params: obj
    });
    return data;
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

   //get transfer Number
   async getTransferNumber(params){
    let res = await xhr.get(`${API_URL}/api/token_trc20/transfers`,{
      params:params} );
    return res && res.data
  }

  //get transactioninfo
  async getTransactionInfo(id){
    const param = {
      value: id,
      visible: true
    }
    let res = await xhr.get('https://api.trongrid.io/wallet/gettransactioninfobyid', {params:param});
    return res && res.data
  }
  async getTransaction(id){
    const param = {
      value: id,
      visible: true
    }
    let res = await xhr.get('https://api.trongrid.io/wallet/gettransactionbyid', {params:param});
    return res && res.data
  }

}

export default new ApiClientToken();
