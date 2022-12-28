import * as qs from "query-string";


export function getQueryParams(location) {
  return qs.parse(location.search);
}
export function getQueryParam(location, key, value) {
  let params = qs.parse(location.search);

  if (typeof params[key] === 'undefined') {
    return value;
  }

  return params[key];
}

export function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  if(window.location.hash.split('?')[1]){
      var r = window.location.hash.split('?')[1].match(reg);
      if (r != null) return unescape(r[2]);
      return null;
  }else{
      return null;
  }

}



