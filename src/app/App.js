import {API_URL} from "../constants";
import xhr from "axios/index";
import {tokensMap, tokens20Map} from "../utils/tokensMap.js";

export default class App {

  constructor(options = {}) {
    this.options = options;
    // localStorage.setItem('tokensMap', JSON.stringify(tokensMap));
    this.getTokensMap();
    this.setExternalLinkHandler(null);
  }

  async getTokensMap() {
    let {data} = await xhr.get(`${API_URL}/api/token?showAll=1&limit=3000`);
    console.log('getTokensMap=======')
    let imgUrl;
    for (var i = 0; i < data.data.length; i++) {
      if (!tokensMap[data.data[i].id]) {
        if(data.data[i].imgUrl){
            imgUrl = data.data[i].imgUrl
        }else{
            imgUrl = 'https://coin.top/production/js/20190509074813.png'
        }
        tokensMap[data.data[i].id] = data.data[i].name + '_' + data.data[i].id + '_' + data.data[i].precision+'_'+data.data[i].abbr+'_'+imgUrl;
      }
    }
    localStorage.setItem('tokensMap', JSON.stringify(tokensMap));
  }

  async getTokens20Map() {
      let {data} = await xhr.get(`${API_URL}/api/tokens/overview?start=0&limit=1000&filter=trc20`);
      let tokensMap = {};
      console.log('getTokensMap20=======')
      let imgUrl;
      for (var i = 0; i < data.data.length; i++) {
          if (!tokens20Map[data.data[i].id]) {
              if(data.data[i].imgUrl){
                  imgUrl = data.data[i].imgUrl
              }else{
                  imgUrl = 'https://coin.top/production/js/20190509074813.png'
              }
              tokensMap[data.data[i].id] = data.data[i].name + '_' + data.data[i].id + '_' + data.data[i].precision+'_'+data.data[i].abbr+'_'+imgUrl;
          }
      }
      localStorage.setItem('tokensMap', JSON.stringify(tokensMap));
  }



  setExternalLinkHandler(handler) {
    this.externalLinkHandler = handler;
  }

  getExternalLinkHandler() {
    return this.externalLinkHandler;
  }
}
