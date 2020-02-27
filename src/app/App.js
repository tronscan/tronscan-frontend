import {
  API_URL
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
// import { setToken20Map, setTokenMap } from './../actions/account';

export default class App {
  constructor(options = {}) {
    this.options = options;
    // localStorage.setItem('tokensMap', JSON.stringify(tokensMap));
    this.getTokensMap();
    this.getTokens20Map();
    this.setExternalLinkHandler(null);
    this.getTime();
  }

  async getTokensMap() {

    let {
      data
    } = await xhr.get(`${API_URL}/api/token?showAll=1&limit=5000&id_gt=1002828&fields=id,name,precision,abbr,imgUrl`);

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
      `${API_URL}/api/tokens/overview?start=0&limit=1000&filter=trc20&sort=priceInTrx`
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

  // 计算加载时间
getPerformanceTiming () { 
  var performance = window.performance;

  if (!performance) {
      // 当前浏览器不支持
      console.log('你的浏览器不支持 performance 接口');
      return;
  }

  var t = performance.timing;
  var times = {};

  //【重要】页面加载完成的时间
  //【原因】这几乎代表了用户等待页面可用的时间
  times.loadPage = t.loadEventEnd - t.navigationStart;

  //【重要】解析 DOM 树结构的时间
  //【原因】反省下你的 DOM 树嵌套是不是太多了！
  times.domReady = t.domComplete - t.responseEnd;

  //【重要】重定向的时间
  //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
  times.redirect = t.redirectEnd - t.redirectStart;

  //【重要】DNS 查询时间
  //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
  // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)           
  times.lookupDomain = t.domainLookupEnd - t.domainLookupStart;

  //【重要】读取页面第一个字节的时间
  //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
  // TTFB 即 Time To First Byte 的意思
  // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
  times.ttfb = t.responseStart - t.navigationStart;

  //【重要】内容加载完成的时间
  //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
  times.request = t.responseEnd - t.requestStart;

  //【重要】执行 onload 回调函数的时间
  //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
  times.loadEvent = t.loadEventEnd - t.loadEventStart;

  // DNS 缓存时间
  times.appcache = t.domainLookupStart - t.fetchStart;

  // 卸载页面的时间
  times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;

  // TCP 建立连接完成握手的时间
  times.connect = t.connectEnd - t.connectStart;

  return times;
  }

  getTime(){
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
    (function(){
      if (window.performance || window.webkitPerformance) {
          var perf = window.performance || window.webkitPerformance;
          var timing = perf.timing;
          var navi = perf.navigation;
          var timer = setInterval(function() {
              if (0 !== timing.loadEventEnd) {
                  timing = perf.timing;
                  let {loadPage,domReady,redirect,lookupDomain,ttfb,request,loadEvent,unloadEvent,connect} = _this.getPerformanceTiming()
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
                      uninstallPageTime: unloadEvent
                  };
                 
                  ApiClientMonitor.setMonitor(data)
                  return data;
                }
              })
            }
          })()
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