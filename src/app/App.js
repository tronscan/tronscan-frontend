import {API_URL} from "../constants";
import xhr from "axios/index";
import {tokensMap} from "../utils/tokensMap.js";

export default class App {

  constructor(options = {}) {
    this.options = options;
    localStorage.setItem('tokensMap', JSON.stringify(tokensMap));
    this.getTokensMap();
    this.setExternalLinkHandler(null);
  }

  async getTokensMap() {
    let {data} = await xhr.get(`https://apilist.tronscan.org/api/token?limit=3000`);
    for (var i = 0; i < data.length; i++) {
      if (!tokensMap[data[i].id]) {
        tokensMap[data[i].id] = data[i].name + '_' + data[i].id + '_' + data[i].precision;
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
