import {
  API_URL,uuidv4
} from "../constants";
import xhr from "axios/index";
import {
  tokensMap,
  tokens20Map
} from "../utils/tokensMap.js";
import {
  store
} from "./../store";
import ApiClientMonitor from './../services/monitor'
import isMobile from "./../utils/isMobile";
import {
  getPerformanceTiming
} from "../utils/DateTime";

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
    } = await xhr.get(`${API_URL}/api/token?uuid=${uuidv4}&showAll=1&limit=5000&id_gt=1000000&fields=id,name,precision,abbr,imgUrl`);

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


  MonitoringParameters(){
    let _this = this;
    // 1.时区  timezone
    // 2.浏览器 browser
    // 3.页面URL  url
    // 5.页面加载完成的时间  pageLoadTime
    // 6.内容加载完成的时间  contentLoadTime
    // 7.DNS 查询时间  dnsSearchTime
    // 8.dom解析时间		domAnalyzeTime
    // 9.ttfb读取页面第一个字节的时间	ttfbReadTime
    // 10.TCP 建立连接完成握手的时间	tcpBuildTime
    // 11.重定向的时间	redirectTime
    // 12.执行 onload 回调函数的时间	onloadCallbackTime
    // 13.卸载页面的时间	uninstallPageTime
      if (window.performance || window.webkitPerformance) {
          var perf = window.performance || window.webkitPerformance;
          var timing = perf.timing;
          var navi = perf.navigation;
          var timer = setInterval(function() {
              if (0 !== timing.loadEventEnd) {
                  timing = perf.timing;
                  let {loadPage,domReady,redirect,lookupDomain,ttfb,request,loadEvent,unloadEvent,connect} = getPerformanceTiming()
                  clearInterval(timer);
                  var data = {
                      url: window.location.href,
                      timezone: new Date().getTimezoneOffset()/60,
                      browser:window.navigator.userAgent,
                      pageLoadTime:loadPage,
                      contentLoadTime:request,
                      dnsSearchTime:lookupDomain,
                      domAnalyzeTime:domReady,
                      ttfbReadTime:ttfb,
                      tcpBuildTime:connect,
                      redirectTime:redirect,
                      onloadCallbackTime:loadEvent,
                      uninstallPageTime: unloadEvent,
                      isMobile:isMobile && isMobile[0],
                      isRefresh:true
                  };
                 
                  ApiClientMonitor.setMonitor(data)
                  return data;
                }
              })
            }         
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