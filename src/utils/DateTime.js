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

    // if(mapTimeValue[key[0]] > 0){   
    //     timeObj = unitTime(dateMap,mapTimeValue,0,key)
    // }else{
    //    if(mapTimeValue[key[1]] >= 1){
    //     timeObj = unitTime(dateMap,mapTimeValue,1,key)
    //    }else{
    //         if(mapTimeValue[key[2]] >=1){ 
    //             timeObj = unitTime(dateMap,mapTimeValue,2,key)

    //         }else{
    //             if(mapTimeValue[key[3]] >= 1){                   
    //                 timeObj = unitTime(dateMap,mapTimeValue,3,key)
    //             }else{
    //                 if(mapTimeValue[key[4]] >= 1){                      
    //                     timeObj = unitTime(dateMap,mapTimeValue,4,key)
    //                 }else{
    //                     firstUnit = mapTimeValue[key[5]] > 1 ? dateMap[key[5]].plural : dateMap[key[5]].odd
    //                     firstTime = mapTimeValue[key[5]]
    //                     timeObj = {firstTime,secondTime:0,firstUnit,secondUnit:null,string:`${firstTime} ${firstUnit}`}
    //                 }
    //             }
    //         }
    //    }
    // }
    if (mapTimeValue[key[0]] >= 1) {
        timeObj = unitTime(dateMap, mapTimeValue, 0, key)
    } else if (mapTimeValue[key[1]] >= 1) {
        timeObj = unitTime(dateMap, mapTimeValue, 1, key)
    } else if (mapTimeValue[key[2]] >= 1) {
        timeObj = unitTime(dateMap, mapTimeValue, 2, key)
    } else {
        firstUnit = mapTimeValue[key[3]] > 1 ? dateMap[key[3]].plural : dateMap[key[3]].odd
        firstTime = mapTimeValue[key[3]]
        timeObj = {
            firstTime,
            secondTime: 0,
            firstUnit,
            secondUnit: null,
            string: `${firstTime}${firstUnit}`
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