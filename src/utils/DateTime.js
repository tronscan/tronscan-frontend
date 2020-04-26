import moment from 'moment'

export function Utc2BeijingDateTime(utc_datetime) {
    const T_pos = utc_datetime.indexOf('T');
    const Z_pos = utc_datetime.indexOf('Z');
    const year_month_day = utc_datetime.substr(0, T_pos);
    const hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
    // eslint-disable-next-line 
    const new_datetime = year_month_day.replace(/\-/g, '/') + " " + hour_minute_second;
    let timestamp = new Date(Date.parse(new_datetime));
    timestamp = timestamp.getTime();
    timestamp = timestamp / 1000;
    timestamp = timestamp + 8 * 60 * 60;
    const date = new Date(parseInt(timestamp) * 1000).toLocaleDatetimeObj();
    const time = new Date(parseInt(timestamp) * 1000).totimeObj().match(/\d{2}:\d{2}:\d{2}/)[0];
    return date + ' ' + time;
}

export function dateFormat(v) {
    return moment.unix(v / 1000).format('YYYY-MM-DD HH:mm:ss')
}


export function timeDiffFormat(time) {

    let start = moment(time)
    let end = moment();
    let timeObj = ''
    let string = ''
    let dateMap = {
        // year:{
        //     plural:'years',
        //     odd:'year',
        //     unit:12
        // },
        // month:{
        //     plural:'months',
        //     odd:'month',
        //     unit:30.4368
        // },
        day: {
            key: 'days',
            plural: 'days',
            odd: 'day',
            unit: 24
        },
        hour: {
            key: 'hours',
            plural: 'hrs',
            odd: 'hr',
            unit: 60
        },
        minute: {
            key: 'minutes',
            plural: 'mins',
            odd: 'min',
            unit: 60
        },
        second: {
            key: "seconds",
            plural: 'secs',
            odd: 'sec'
        }
    }


    let mapTimeValue = {}

    for (let i in dateMap) {
        mapTimeValue[i] = end.diff(start, dateMap[i].key)
    }

    let key = ['day', 'hour', 'minute', 'second']
        // let key = ['year','month','day','hour','minute','second']

    let firstUnit = ''
    let secondUnit = ''
    let firstTime = ''
    let secondTime = ''

    
    if (mapTimeValue[key[0]] >= 1) {
        timeObj = unitTime(dateMap, mapTimeValue, 0, key)
    } else if (mapTimeValue[key[1]] >= 1) {
        timeObj = unitTime(dateMap, mapTimeValue, 1, key)
    } else if (mapTimeValue[key[2]] >= 1) {
        timeObj = unitTime(dateMap, mapTimeValue, 2, key)
    } else {
        firstUnit = mapTimeValue[key[3]] > 1 ? dateMap[key[3]].plural : dateMap[key[3]].odd
        firstTime = mapTimeValue[key[3]]
        let string = firstTime < 1 ? 'less than 1sec' : `${firstTime}${firstUnit}`
        timeObj = {
            firstTime,
            secondTime: 0,
            firstUnit,
            secondUnit: null,
            string: string
        }
    }
    return timeObj
}

export function unitTime(dateMap, mapTimeValue, number, key) {
    let newSecond = mapTimeValue[key[number + 1]] - dateMap[key[number]].unit * mapTimeValue[key[number]]
    let firstUnit = mapTimeValue[key[number]] > 1 ? dateMap[key[number]].plural : dateMap[key[number]].odd
    let secondUnit = newSecond > 1 ? dateMap[key[number + 1]].plural : dateMap[key[number + 1]].odd
    let firstTime = mapTimeValue[key[number]]
    let secondTime = newSecond
    let string = (secondTime && secondTime > 0) ? `${firstTime}${firstUnit} ${secondTime}${secondUnit}` : `${firstTime} ${firstUnit}`
    return {
        firstTime,
        secondTime,
        firstUnit,
        secondUnit,
        string
    }
}


export function setTimeString(time) {
    let obj = timeDiffFormat(time)
    let string = obj.string + ' ago';
    return string
}


  // 计算加载时间
export function  getPerformanceTiming () { 
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
    times.domReady = t.domContentLoadedEventEnd - t.navigationStart;
  
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


        
 export function getPerformanceTimingEntry(){
    let  entryTimesList = [];
    let entryList = window.performance.getEntries();
    let obj = {loadPage:0,domReady:0,redirect:0,lookupDomain:0,ttfb:0,request:0,loadEvent:0,unloadEvent:0,connect:0};
    entryList.forEach((item,index)=>{
    
       let templeObj = {};
       
    //    let usefulType = ['navigation','script','css','fetch','xmlhttprequest','link','img'];
    //    if(usefulType.indexOf(item.initiatorType)>-1){
    //      templeObj.name = item.name;
        // if(item.nextHopProtocol)
         
         //templeObj.nextHopProtocol = item.nextHopProtocol;
         templeObj.Type=item.initiatorType;
         if (item.name=="first-paint") {
            templeObj.Type="first-paint";
         }
         templeObj.tSize=item.transferSize;
         templeObj.sTime = parseInt(item.startTime);
         templeObj.name=item.name;
         templeObj.dur=parseInt(item.duration);
         templeObj.rStart = parseInt(item.requestStart);

         entryTimesList.push(templeObj);
         
         
    //    }
    
    });
  
    

    return entryTimesList;

  
 }  

