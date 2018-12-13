export function Utc2BeijingDateTime(utc_datetime){
    const T_pos = utc_datetime.indexOf('T');
    const Z_pos = utc_datetime.indexOf('Z');
    const year_month_day = utc_datetime.substr(0,T_pos);
    const hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
    const new_datetime = year_month_day.replace(/\-/g,'/')+" "+hour_minute_second;
    let timestamp = new Date(Date.parse(new_datetime));
    timestamp = timestamp.getTime();
    timestamp = timestamp/1000;
    timestamp = timestamp+8*60*60;
    const date = new Date(parseInt(timestamp) * 1000).toLocaleDateString();
    const time = new Date(parseInt(timestamp) * 1000).toString().match(/\d{2}:\d{2}:\d{2}/)[0];
    return date + ' ' + time;
}
