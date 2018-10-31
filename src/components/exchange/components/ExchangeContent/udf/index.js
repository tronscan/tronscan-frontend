import { storage,getDecimalsNum,getUTCDay,getUTCHour,getUTCMinutes,isSameMinutes,getLastUTCMinutes,getHOLCObj,getCurrentMinutes} from "../utils"
// import { getHistoricalTimeRange,getSummarizedTimeRange} from '_api/exchange'
import xhr from "axios/index";
import _ from 'lodash'

function getHistoricalTimeRange(params){
    // xhr.get('?')
    return new Promise((resolve, reject) => {
        
        xhr.get('http://18.216.57.65:20111/api/exchange/kgraph', {
            params: params
        }).then(response => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}
const Datafeeds = {}
let KlineSSE= null
Datafeeds.UDFCompatibleDatafeed = function() {
    // 默认配置
    // https://b.aistock.ga/books/tradingview/book/JS-Api.html
    this._configuration = undefined;

    // 商品信息
    // this._symbol = symbol;

    // 初始化
    this._initialize();

}

Datafeeds.UDFCompatibleDatafeed.prototype._initialize = function () {
    this._configuration = this._defaultConfiguration();
}

Datafeeds.UDFCompatibleDatafeed.prototype._defaultConfiguration = function() {
    return {
        supports_search: true,
        supports_group_request: false,
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: false,
        supported_resolutions: ['30','60','240','D','W', 'M'],
    };
};

Datafeeds.UDFCompatibleDatafeed.prototype._resolveData = function(response) {
    let bars = [];
    let meta = {
        noData: false,
    };
    if (!response.data || response.data.length == 0) {
        meta.noData = true;
    } else {
        bars =response.data.map(item => {
            let obj = {}
            obj.close = Number(item.c)
            obj.time = Number(item.t*1000)
            obj.open = Number(item.o)
            obj.high = Number(item.h)
            obj.low = Number(item.l)
            obj.volume = Number(item.v)
            return obj
        })
    }
    return ({
        bars: bars.reverse(),
        meta: meta,
    });
}


/* API START */
/* 
 * callback function(configurationData)
 * 此方法旨在提供填充配置数据的对象。这些数据会影响图表的行为表现，所以它被调用在服务端定制。
 * 图表库要求您使用回调函数来传递datafeed的configurationData参数。
 */
Datafeeds.UDFCompatibleDatafeed.prototype.onReady = function(callback) {
    if(this._configuration) {
        setTimeout(() => {
            callback(this._configuration);
        }, 0);
        
    } else {
        // TODO 异步获取
        // wsRequest('kline_config').then(response => {
        //     this._configuration = response.data;
        //     callback(this._configuration);
        // })
    }
}

/* 
 * symbolName <String> 商品名称或ticker
 * onSymbolResolvedCallback function(SymbolInfo)
 * onResolveErrorCallback function(reason)
 */
Datafeeds.UDFCompatibleDatafeed.prototype.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    // let currentSymbolObj = storage.get('currentSymbolObj')
    // if(!currentSymbolObj){
    //     onResolveErrorCallback('unknown_symbol');
    // }else{
    //     setTimeout(() => {
    //         let long = getDecimalsNum(currentSymbolObj.priceTickSize)
    //         let response =  {
    //             description: currentSymbolObj.symbol,
    //             has_intraday: true,//否具有日内（分钟）历史数据
    //             has_no_volume: false,//是否有成交量的数据
    //             has_daily:true,
    //             minmov: 1,
    //             minmov2: 0,
    //             intraday_multipliers:['1'],
    //             name: currentSymbolObj.baseAsset,
    //             // pointvalue: 1,
    //             exchange:'55exchange',
    //             pricescale: Math.pow(10,long),
    //             session: "24x7",
    //             supported_resolutions: ['1','5','30','60','240','D','W'],
    //             ticker: currentSymbolObj.symbol,
    //             timezone: "Asia/Shanghai",
    //             type: 'bitcoin',
    //             has_daily:true,
    //             volume_precision:'3',//成交量精确度
    //             has_empty_bars:false
    //         }
    //         onSymbolResolvedCallback(response);
    //     })
    // }
    let response = {
        name: 'BTC/USDT',
        ticker: 'BTC/USDT',
        description: '描述',
        session: '24x7',
        timezone: "UTC",
        minmov: 1,
        pricescale: 100,
        has_intraday: true,
        has_daily: true,
        has_weekly_and_monthly: false,
        // supported_resolutions: ['1', '5', '10', '30', '1H', '1D'],
    }
    onSymbolResolvedCallback(response);
}

/* 
 * symbolInfo:SymbolInfo 商品信息对象
 * resolution: string （分辨率）
 * from: unix 时间戳, 最左边请求的K线时间
 * to: unix 时间戳, 最右边请求的K线时间
 * onHistoryCallback: function(数组bars,meta={ noData = false })
 * -- bars: Bar对象数组{time, close, open, high, low, volume}[]
 * -- meta: object{noData = true | false, nextTime = unix time}
 * onErrorCallback: function(reason：错误原因)
 * firstDataRequest: 布尔值，以标识是否第一次调用此商品/分辨率的历史记录。当设置为true时 你可以忽略to参数（这取决于浏览器的Date.now()) 并返回K线数组直到当前K线（包括它）。
 * 方法介绍：通过日期范围获取历史K线数据。图表库希望通过onHistoryCallback仅一次调用，接收所有的请求历史。而不是被多次调用。
 * 发生不断自动刷新图表问题时，请检查from与onHistoryCallback方法返回的bars时间是否一致，没有数据时请返回noData = true
 * nextTime历史中下一个K线柱的时间。 只有在请求的时间段内没有数据时，才应该被设置。
 * noData只有在请求的时间段内没有数据时，才应该被设置。
 * bar.time为以毫秒开始的Unix时间戳（UTC标准时区）。
 * bar.time对于日K线预期一个交易日 (未开始交易时) 以 00:00 UTC为起点。 图表库会根据商品的交易（Session）时间进行匹配。
 * bar.time对于月K线为这个月的第一个交易日，除去时间的部分。
 */
Datafeeds.UDFCompatibleDatafeed.prototype.getBars = function(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
    let type = '';
    const typeMap = {
        "30": '30min',
        '60': '1h',
        '240': '4h',
        'D': '1d',
        'W': '1w',
        'M': '1m'
    }
    type = typeMap[resolution];
    let startDate = getUTCDay(from)
    let endDate = getUTCDay(to)
    //日级别以上接口
    getHistoricalTimeRange({
        exchange_id:1,
        granularity:type,
        time_start:from,
        time_end:to
    }).then(response => {
        const data = this._resolveData(response);
       
        onHistoryCallback(data.bars, data.meta);
    })
    // switch (resolution) {
    //     case 'D':
    //         type = '1D';
    //         let startDate = getUTCDay(from)
    //         let endDate = getUTCDay(to)
    //         //日级别以上接口
    //         // exchange_id=2&time_start=1538092800&time_end=1538179200&granularity=1min
    //         getHistoricalTimeRange({
    //             exchange_id:storage.get('currentSymbol'),
    //             granularity:type,
    //             time_start:startDate,
    //             time_end:endDate
    //         }).then(response => {
    //             const data = this._resolveData(response);
    //             onHistoryCallback(data.bars, data.meta);
    //         })
    //         break;
    //     // case '60'://查询小时历史
    //     //     type = 'HOUR_1';
    //     //     getSummarizedTimeRange({
    //     //         symbol:storage.get('currentSymbol'),
    //     //         interval:type,
    //     //         startDateTime:getUTCHour(from),
    //     //         endDateTime:getUTCHour(to)
    //     //     }).then(response => {
    //     //         // console.log('分钟K',response)
    //     //         const data = this._resolveData(response);
    //     //         onHistoryCallback(data.bars, data.meta);
    //     //     })
    //     //     break;
    //     default:
    //         //默认查一个月
    //         type = '1M';
    //         getHistoricalTimeRange({
    //             symbol:storage.get('currentSymbol'),
    //             interval:type,
    //             // startDateTime:getUTCMinutes(to) - 3*24*60*60*1000,
    //             startDateTime:getUTCMinutes(from),
    //             endDateTime:getUTCMinutes(to)
    //         }).then(response => {
    //             const data = this._resolveData(response);
    //             onHistoryCallback(data.bars, data.meta);
    //         })
    //         break;
    // }


    // onErrorCallback(reason)
    // console.log()
    // onHistoryCallback({
    //     "t": [1535644800, 1535644800, 1535644800, 1535644800, 1535644800, 1535644800, 1535644800, 1535644800, 1486339200, 1486425600, 1486512000, 1486598400, 1486684800],
    //     "o": [120.42, 121.67, 122.14, 120.93, 121.15, 127.03, 127.975, 128.31, 129.13, 130.54, 131.35, 131.65, 132.46],
    //     "h": [122.1, 122.44, 122.35, 121.63, 121.39, 130.49, 129.39, 129.19, 130.5, 132.09, 132.22, 132.445, 132.94],
    //     "l": [120.28, 121.6, 121.6, 120.66, 120.62, 127.01, 127.78, 128.16, 128.9, 130.45, 131.22, 131.12, 132.05],
    //     "c": [121.88, 121.94, 121.95, 121.63, 121.35, 128.75, 128.53, 129.08, 130.29, 131.53, 132.04, 132.42, 132.12],
    //     "v": [32586673, 26337576, 20562944, 30377503, 49200993, 111985040, 33710411, 24507301, 26845924, 38183841, 23004072, 28349859, 20065458],
    //     "s": "ok"
    // })
}


Datafeeds.UDFCompatibleDatafeed.prototype.subscribeBars = function(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
    let currentSymbol  = symbolInfo.description
    let SSEcache = null
    //获取上一分钟的整数
    let queryTime = getLastUTCMinutes()
    //获取当前时间正分钟 分钟K 5分钟 5:10
    let currentMinutes = getCurrentMinutes()
    let currentMinutesArr = []//本分钟快照数据
    let currentMinutesVolme = null //本分钟成交量
    let lastMinutesQuote = {
        // volume:0
    } //最近的快照数据
    let lastK = {
        // close: 0,
        // high: 0,
        // isBarClosed: true,
        // low: 0,
        // open: 0,
        // volume: 0,
        // time:minuteTime()//精确到分钟，时间戳
    };
    // KlineSSE && KlineSSE.close()
    // let baseURL = window.location.protocol+'//'+window.location.host
    // KlineSSE = new EventSource(`${baseURL}/quote/realTime.stream?symbol=${currentSymbol}&${currentSymbol}_least=1&${currentSymbol}_startTime=${queryTime}`)
    // KlineSSE.onopen = function(e) {
    //      console.log("K线行情推送连接已经建立：", this.readyState);
    // };
    // KlineSSE.addEventListener('_RESULT', function(e) {
    //     //每次推送一条记录
    //     let data = JSON.parse(e.data)
    //      //快照去重
    //     if(SSEcache && SSEcache.dateTime == data.dateTime && SSEcache.volume == data.volume){
    //         return;
    //     }
    //     switch (resolution) {
    //         case 'D'://日K
    //              lastK = {
    //                 time: data.dateTime,
    //                 close: data.last,
    //                 open: data.open,
    //                 high: data.high,
    //                 low: data.low,
    //                 volume : data.volume
    //             }
    //             onRealtimeCallback(lastK)
    //             break;
    //         default: 
    //             //获取距离当前分钟最近的一个快照 
    //             if(data.dateTime < currentMinutes){
    //                 //不断替换为最近的  准备获取成交量
    //                 lastMinutesQuote = data
    //             }else if (isSameMinutes(data.dateTime,currentMinutes)){//是否同一分钟
    //                 //维护本分钟快照的数组
    //                 currentMinutesArr.push(data)
    //                 //根据最新快照的维护本分钟成交量
    //                 currentMinutesVolme = data.volume - lastMinutesQuote.volume
    //             }else {//新的一分钟
    //                 //记录最近的快照时间 本分钟取整
    //                 currentMinutes = data.dateTime
    //                 //维护上一分钟最后的成交量快照对象
    //                 if(currentMinutesArr.length>0){
    //                     lastMinutesQuote = _.last(currentMinutesArr)
    //                 }
    //                 //第一个快照新的成交量
    //                 currentMinutesVolme = data.volume - lastMinutesQuote.volume
    //                 //数组清空  放入新的快照
    //                 currentMinutesArr = []
    //                 currentMinutesArr.push(data)
    //             }
    //             if(currentMinutesArr.length>0){
    //                 //当前分钟里的快照计算高开低收成交量
    //                 let obj2 = getHOLCObj(currentMinutesArr)
    //                 obj2.volume = currentMinutesVolme
    //                 obj2.time = getUTCMinutes(currentMinutes/1000)
    //                 onRealtimeCallback(obj2)
    //             }
    //             break;
    //         }
    // })
    // KlineSSE.addEventListener('_ERROR', function(e) {
    //     console.log('K线专属推送:',JSON.parse(e.data).error.message)
    // })
}

Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeBars = function (listenerGuid) {
    // socket.off('klineNotify')
    console.log('tuiding------------')
}

Datafeeds.UDFCompatibleDatafeed.prototype.calculateHistoryDepth = function (resolution, resolutionBack, intervalBack) {
    switch(resolution){
        case 'D':
            return {
                resolutionBack: 'D',
                intervalBack: 30
            };
        case 'W':
            return {
                resolutionBack: 'D',
                intervalBack: 100
            };
        case '60':
            return {
                resolutionBack: 'D',
                intervalBack: 3
            };
        default:
            return {
                resolutionBack: 'D',
                intervalBack: 3
            };
    }

};

Datafeeds.UDFCompatibleDatafeed.prototype.getServerTime = function (callback) {
    // console.log(123123,'serverTIme')
    // wsRequest('server_time').then(response => {
    //     callback(response);
    // })
    // callback(moment().utc())
}

/* API END */

export default {
    UDFCompatibleDatafeed: Datafeeds.UDFCompatibleDatafeed
};





