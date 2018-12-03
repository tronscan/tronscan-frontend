import {Client as ApiClient} from "@tronscan/client";
import io from 'socket.io-client';
import TronWeb from 'tronweb';

const ServerNode =  "https://api.trongrid.io";
const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = new HttpProvider(ServerNode); // Full node http endpoint
const solidityNode = new HttpProvider(ServerNode); // Solidity node http endpoint
const eventServer = ServerNode; // Contract events http endpoint
export const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
);


export const Client = new ApiClient();

export function buildClient(account) {
  return new ApiClient();
}

export function channel(path, options) {
   // return io(process.env.API_URL + path, options);
    return io('https://wlcyapi.tronscan.org/socket.io' + path, options);
    //return io('http://172.16.20.207:20110/socket.io' + path, options);
}