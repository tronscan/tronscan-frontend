import moment from 'moment'
import nattyStorage from 'natty-storage';
import _ from 'lodash'
// import bigDecimal from 'js-big-decimal'
const _storage = nattyStorage({
    type: 'localStorage', // 缓存方式, 默认为'localStorage'
    key: 'Carrera', // !!! 唯一必选的参数, 用于内部存储 !!!
    tag: 'v1.0', // 缓存的标记, 用于判断是否有效
    // duration: 1000*60*10,      // 缓存的有效期长, 以毫秒数指定
    // until:    1464759086797    // 缓存的到期时间, 以具体日期时间的时间戳指定
})

export const storage = {
        set: function(key, value) {
            _storage.set(key, value)
        },
        get: function(key, fallbackValue) {
            if (_storage.has(key).has) {
                return _storage.get(key, fallbackValue)
            }
            return undefined;
        },
        remove: function(key) {
            _storage.remove(key)
        },
        has(key) {
            return _storage.has(key).has;
        }
    }
    //判断两个能否整除
    // export function isDivideAll(num1,num2){
    //     let a = bigDecimal.divide(num1, num2, 1)
    //      if(a.split('.')[1] == '0'){
    //          return true
    //      }
    //      return false
    // }
    //获取对象里面的第一个Key
export function getObjFirstKey(data) {
    for (var key in data) {
        return key
    }
}
//根据key ，把在对象里的序号返回
export function getIndexInObject(obj, param) {
    let i = 0;
    for (var key in obj) {
        if (param == key) {
            return i;
        } else {
            i++;
        }
    }
}
//根据priceTickSize 0.00001 返回保留几位小数
export function getDecimalsNum(priceTickSize) {
    let m = priceTickSize.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    let price = priceTickSize.toFixed(Math.max(0, (m[1] || '').length - m[2]));
    if (price.lastIndexOf(".") == -1) {
        return 0
    } else {
        return price.toString().split('.')[1].length;
    }
}
//科学计数法转字符串
export function scientificToNumber(num) {
    var str = num.toString();
    // eslint-disable-next-line
    var reg = /^(\d+\.?\d*)(e)([\-]?\d+)$/;
    var arr, len,
        zero = '';

    /*6e7或6e+7 都会自动转换数值*/
    if (!reg.test(str)) {
        return num;
    } else {
        /*6e-7 需要手动转换*/
        arr = reg.exec(str);
        len = Math.abs(arr[3]) - 1;
        for (var i = 0; i < len; i++) {
            zero += '0';
        }
        return '0.' + zero + arr[1].replace('.', '');
    }
}

export function getDecimalExNumber(priceTickSize) { //读取科学计数法
    let m = priceTickSize.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    let price = priceTickSize.toFixed(Math.max(0, (m[1] || '').length - m[2]));
    return price.toString().split('.')[1].length;
}


//只能输入 数字小数点 限定小数点位数  第一位不能是小数点        
export function onlyInputNumAndPoint(data, pointLong) {
    var regExp = new RegExp("^(\\-)*(\\d+)\\.(\\d{" + pointLong + "}).*$");
    data = data.replace(/[^\d.]/g, "") //只能输入数字和小数
    data = data.replace(/^\./g, "") //第一位不能输入.
    data = data.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
    data = data.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    data = data.replace(regExp, '$1$2.$3'); //只能输入X个小数  
    return data;
}

export function remove(key) {
    localStorage.removeItem(key);
}
//判断localStorage中签发的tonken是否过期
export function getTokenByKey(key) {
    var data = JSON.parse(localStorage.getItem(key));
    if (data) {
        if (data.time - new Date().getTime() < 60 * 1000) {
            remove(key);
        } else {
            return data.value;
        }
    }
    return null
}
//封装过期控制代码
export function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify({
        value: data.value,
        time: new Date(data["expiredAt"]).getTime()
    }));
}
//判断Token是否过期
export function checkExpiredAble(expiredAble) {
    if (expiredAble) {
        //是否过期
        if (expiredAble["expiredAt"] > new Date().getTime() + 60 * 1000) { //没有过期
            return expiredAble["value"];
        }
    }
    return null;
};
//根据symbol添加分割线
export function addSymbolSplitLine(symbol) {
    let quote = symbol.slice(-3);
    let str = ''
    switch (quote) {
        case "BTC":
            str = symbol.slice(0, -3) + "/" + quote;
            break;
        case "ETH":
            str = symbol.slice(0, -3) + "/" + quote;
            break;
        default:
            str = symbol.slice(0, -4) + "/" + symbol.slice(-4);
            break;
    }
    return str
}
//获取当前时间对应零时区的整天 即零点 毫秒级别
export function getUTCDay(unixDateParams) {
    let unix = moment(moment.unix(unixDateParams).utc().format('YYYY-MM-DD 00:00:00Z')).unix();
    return unix;
}

export function s(unixDateParams) {
    let unix = moment(moment.unix(unixDateParams).utc().format('YYYY-MM-DD 23:59:59Z')).unix();
    return unix;
}

//获取当前时间对应零时区的整小时 即分钟秒数为0  毫秒级别
export function getUTCHour(unixDateParams) {
    let unix = moment(moment.unix(unixDateParams).utc().format('YYYY-MM-DD HH:00:00Z')).unix();
    return unix;
}
//获取当前时间对应零时区的整分钟 即零秒 毫秒级别   unixDateParams （s）
export function getUTCMinutes(unixDateParams) {
    let unix = moment(moment.unix(unixDateParams).utc().format('YYYY-MM-DD HH:mm:00Z')).unix();
    return unix;
}
//获取当前时间的上一分钟取整数 UTC
export function getLastUTCMinutes() {
    let unix = moment(moment().subtract(1, 'minutes').format('YYYY-MM-DD HH:mm:00')).utc().unix();
    return unix;
}
//获取当前时间的当前分钟 一分钟取整数 UTC
export function getCurrentMinutes() {
    let unix = moment(moment().format('YYYY-MM-DD HH:mm:00')).utc().unix()
    return unix;
}
//是否是同一分钟
export function isSameMinutes(unix1, unix2) {
    return moment(unix1).isSame(moment(unix2), 'minutes')
}
//是否是同一小时
export function isSameHours(unix1, unix2) {
    return moment(unix1).isSame(moment(unix2), 'hours')
}
//是否是同一天
export function isSameUTCDay(unix1, unix2) {
    let start = moment(moment(unix1).utc().format('YYYY-MM-DD 00:00:00') + 'Z').unix()
    let end = moment(moment(unix1).utc().format('YYYY-MM-DD 23:59:59') + 'Z').unix()
    if (unix2 >= start && unix2 <= end) {
        return true
    } else {
        return false
    }
}
//根据快照对象数组 返回最新的高开低收快照对象 
export function getHOLCObj(arr) {
    let obj = {}
    if (arr.length > 0) {
        obj.open = arr[0].last
        obj.close = _.last(arr).last
        let sortHOLCArr = _.sortBy(arr, ['last'])
        obj.high = _.last(sortHOLCArr).last
        obj.low = sortHOLCArr[0].last
    }
    return obj
}
//观察者 发布订阅 K线订阅推送行情
function Observer() {
    this.fns = [];
}
Observer.prototype = {
    subscribe: function(fn) {
        this.fns.push(fn);
    },
    unsubscribe: function(fn) {
        if (!fn) {
            this.fns = []
            return
        }
        this.fns = this.fns.filter(
            function(el) {
                if (el !== fn) {
                    return el;
                }
            }
        );
    },
    update: function(o, thisObj) {
        var scope = thisObj || window;
        this.fns.forEach(
            function(el) {
                el.call(scope, o);
            }
        );
    }
};
export const myObserver = new Observer()