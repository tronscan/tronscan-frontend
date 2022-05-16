import {
  API_URL,uuidv4
} from "../constants";
import xhr from "axios/index";
import {
  tokensMap,
  tokens20Map
} from "../utils/tokensMap.js";
// import {
//   store
// } from "./../store";
//import ApiClientMonitor from './../services/monitor'
//import isMobile from "./../utils/isMobile";
//import {
//  getPerformanceTiming
//} from "../utils/DateTime";
//import System from "../components/tools/System";

// import { setToken20Map, setTokenMap } from './../actions/account';

export default class App {
  constructor(options = {}) {
    this.options = options;
    // localStorage.setItem('tokensMap', JSON.stringify(tokensMap));
    this.getTokensMap();
    this.getTokens20Map();
    this.setExternalLinkHandler(null);
    // this.MonitoringParameters();
  }

  async getTokensMap() {
    let {
      data
    } = await xhr.get(`${API_URL}/api/token?uuid=${uuidv4}&showAll=1&limit=5000&id_gt=1002828&fields=id,name,precision,abbr,imgUrl`);
    //var beginTime = +new Date();

      for (let k of Object.keys(tokensMap))  {
        //k,obj[k]
        //https://coin.top/production/js/20190509074813.png   _-_
        //https://coin.top/production/logo/  |_|
        //https://coin.top/tokenLogo/tokenLogo  !_!
        //https://coin.top/production/upload/logo/ #_#
        var value=tokensMap[k];
        if (value.indexOf("_-_") >-1) {
          value=value.replace("_-_","https://coin.top/production/js/20190509074813.png");
        } else if (value.indexOf("|_|") >-1) {
          value=value.replace("|_|","https://coin.top/production/logo/");
        } else if (value.indexOf("!_!") >-1) {
          value=value.replace("!_!","https://coin.top/tokenLogo/tokenLogo");
        } else if (value.indexOf("#_#")>-1) {
          value=value.replace("#_#","https://coin.top/production/upload/logo/");
        }
        tokensMap[k]=value;
      }

    let imgUrl;
    for (var i = 0; i < data.data.length; i++) {
      if (!tokensMap[data.data[i].id]) {
        if (data.data[i].imgUrl) {
          imgUrl = data.data[i].imgUrl;
        } else {
          imgUrl = "https://coin.top/production/js/20190509074813.png";
        }
        tokensMap[data.data[i].id] =
          data.data[i].name +
          "_&&_" +
          data.data[i].id +
          "_&&_" +
          data.data[i].precision +
          "_&&_" +
          data.data[i].abbr +
          "_&&_" +
          imgUrl;
      }
    }

    localStorage.setItem("tokensMap", JSON.stringify(tokensMap));
    // store.dispatch(setTokenMap(tokensMap));
  }

  async getTokens20Map() {
    let {
      data
    } = await xhr.get(
      `${API_URL}/api/tokens/overview?uuid=${uuidv4}&start=0&limit=1000&filter=trc20&sort=priceInTrx`
    );
    let imgUrl;
    if(data.tokens && data.tokens.length){
      for (var i = 0; i < data.tokens.length; i++) {
        if (!tokens20Map[data.tokens[i].contractAddress]) {
          if (data.tokens[i].imgUrl) {
            imgUrl = data.tokens[i].imgUrl;
          } else {
            imgUrl = "https://coin.top/production/js/20190509074813.png";
          }
          tokens20Map[data.tokens[i].contractAddress] =
            data.tokens[i].name +
            "_&&_" +
            data.tokens[i].contractAddress +
            "_&&_" +
            data.tokens[i].decimal +
            "_&&_" +
            data.tokens[i].abbr +
            "_&&_" +
            imgUrl;
        }
      }
    }
    
    localStorage.setItem("tokens20Map", JSON.stringify(tokens20Map));
    // store.dispatch(setToken20Map(tokens20Map));
  }

  setExternalLinkHandler(handler) {
    this.externalLinkHandler = handler;
  }

  getExternalLinkHandler() {
    return this.externalLinkHandler;
  }

} 

// if ('serviceWorker' in navigator) {
//     let version = '1.0.2'
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/service-worker.js').then((registration) => {
//             if (localStorage.getItem('sw_version') !== version) {
//                 registration.update().then(function () {
//                     localStorage.setItem('sw_version', version)
//                 });
//             }
//             console.log('SW registered: ', registration);
//         }).catch((registrationError) => {
//             console.log('SW registration failed: ', registrationError);
//         });
//     });
// }