
import NodeRSA from 'node-rsa';
import { JSENCRYPTKEY } from './../constants';

/**
 * jsencrypt
*/
export const jsencrypt = value => {
    let key = new NodeRSA(JSENCRYPTKEY);
    const encrypted = key.encrypt(value, 'base64');
    return encrypted;
};
