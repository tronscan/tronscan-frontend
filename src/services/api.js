import {Client as ApiClient} from "@tronscan/client";
import io from 'socket.io-client';

export const Client = new ApiClient();

export function buildClient(account) {
  return new ApiClient();
}

export function channel(path, options) {
  return io(process.env.API_URL + path, options);
}
