import {Client as ApiClient} from "@tronscan/client";
import io from 'socket.io-client';

export const Client = new ApiClient();

export function buildClient(account) {
  return new ApiClient();
}

export function channel(path, options) {
  // return io(process.env.API_URL + path, options);
    return io('http://18.216.57.65:20110/socket.io' + path, options);



}
