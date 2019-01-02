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
    let {data} = await xhr.get(`https://apilist.tronscan.org/asset_issue_contract/asset_issue_contract/_search`);
    for (var i = 0; i < data.hits.hits.length; i++) {
      if (!tokensMap[data.hits.hits[i]['_source'].id]) {
        tokensMap[data.hits.hits[i]['_source'].id] = data.hits.hits[i]['_source'].name + '_' + data.hits.hits[i]['_source'].id + '_' + data.hits.hits[i]['_source'].precision;
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
