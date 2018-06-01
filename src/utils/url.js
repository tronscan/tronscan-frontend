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
