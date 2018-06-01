import {sampleSize} from "lodash";


export function alphanumeric(size = 12) {
  return sampleSize('abcdefghijklmnopqrstufwxyzABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890', size).join('');
}

export function alpha(size = 12) {
  return sampleSize('abcdefghijklmnopqrstufwxyzABCDEFGHIJKLMNOPQRSTUFWXYZ', size).join('');
}
