import pbkdf2 from 'pbkdf2';
import aesjs from "aes-js";
import {isAddressValid, pkToAddress} from "@tronscan/client/src/utils/crypto";

export function encryptKey(password, salt) {
  return pbkdf2.pbkdf2Sync(password, salt, 1, 256 / 8, 'sha512');
}

export function encryptString(password, hexString) {
  var textBytes = aesjs.utils.utf8.toBytes(hexString);
  var aesCtr = new aesjs.ModeOfOperation.ctr(password);
  var encrypted = aesCtr.encrypt(textBytes);
  return {
    bytes: encrypted,
    hex: aesjs.utils.hex.fromBytes(encrypted),
  };
}


export function decryptString(password, salt, hexString) {
  let key = encryptKey(password, salt);
  var encryptedBytes = aesjs.utils.hex.toBytes(hexString);
  var aesCtr = new aesjs.ModeOfOperation.ctr(key);
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);
  return aesjs.utils.utf8.fromBytes(decryptedBytes);
}

export function validatePrivateKey(privateKey) {
  try {
    let address = pkToAddress(privateKey);
    return isAddressValid(address);
  } catch (e) {
    return false;
  }
}
