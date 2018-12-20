import { storage,getDecimalsNum,getUTCDay,getUTCCurrentDay,getUTCHour,getUTCMinutes,isSameMinutes,getLastUTCMinutes,getHOLCObj,getCurrentMinutes} from "../utils"

import {Client20} from "../../../../../../services/api";

import _ from 'lodash'

const Datafeeds = {}
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
        supported_resolutions: ['5','30','60','240','D','W', 'M'],
    };
};

Datafeeds.UDFCompatibleDatafeed.prototype._resolveData = function(response) {
    let bars = [];
    let meta = {
        noData: false,
    };
    if (!response || !response.data || response.data.length == 0) {
        meta.noData = true;
    } else {
        bars =response.data.map(item => {
            let obj = {}
            obj.time = Number(item.t*1000)
            obj.close = Number(item.c)
            obj.open = Number(item.o)
            obj.high = Number(item.h)
            obj.low = Number(item.l)
            obj.volume = Number(item.v)
            return obj
        })
    }
    return ({
        bars: bars,
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
    let response = {
        name: symbolName,
        ticker: symbolName,
        // description: '描述',
        session: '24x7',
        timezone: "Etc/UTC",
        minmov: 1,
        minmov2: 0,
        pricescale: Math.pow(10,6),
        type: 'bitcoin',
        has_intraday: true,
        has_daily: true,
        has_weekly_and_monthly: true, //是否具有以W和M为单位的历史数据
        supported_resolutions: ['5','30','60','240','D','W', 'M'],
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
        "5": {
            type: '5min',
            getutc: getUTCDay
        },
        "30": {
            type: '30min',
            getutc: getUTCDay
        },
        '60': {
            type: '1h',
            getutc: getUTCDay
        },
        '240': {
            type: '4h',
            getutc: getUTCDay
        },
        'D': {
            type: '1d',
            getutc: getUTCDay
        },
        'W': {
            type: '1w',
            getutc: getUTCDay
        },
        'M': {
            type: '1m',
            getutc: getUTCDay
        }

    }
    type = typeMap[resolution].type;
    let startDate = typeMap[resolution].getutc(from)
    let endDate =  typeMap[resolution].getutc(to)
    //日级别以上接口
    Client20.getKlineData20({
        exchange_id: symbolInfo.ticker,
        granularity:type,
        time_start:startDate,
        time_end:to
    }).then(response => {
        const data = this._resolveData(response);
        onHistoryCallback(data.bars, data.meta);
    })
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
    // })
}

Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeBars = function (listenerGuid) {
    // socket.off('klineNotify')
}

Datafeeds.UDFCompatibleDatafeed.prototype.calculateHistoryDepth = function (resolution, resolutionBack, intervalBack) {
    switch (resolution) {
        case 'D':
            return {
                resolutionBack: 'D',
                intervalBack: 120
            }
        case 'W':
            return {
                resolutionBack: 'M',
                intervalBack: 12
            }
        case 'M':
            return {
                resolutionBack: 'M',
                intervalBack: 12
            }
        case '240':
            return {
                resolutionBack: 'D',
                intervalBack: 25
            }
        case '60':
            return {
                resolutionBack: 'D',
                intervalBack: 6
            }
        case '30':
            return {
                resolutionBack: 'D',
                intervalBack: 3
            }
        case '5':
            return {
                resolutionBack: 'D',
                intervalBack: 0.6
            }
        default:
            return {
                resolutionBack: 'D',
                intervalBack: 1
            }
    }
};

Datafeeds.UDFCompatibleDatafeed.prototype.getServerTime = function (callback) {
    // wsRequest('server_time').then(response => {
    //     callback(response);
    // })
    // callback(moment().utc())
}

/* API END */

export default {
    UDFCompatibleDatafeed: Datafeeds.UDFCompatibleDatafeed
};





