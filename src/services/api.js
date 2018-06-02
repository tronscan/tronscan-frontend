import {Client as ApiClient} from "@tronscan/client";
import {ChromeExtensionSigner} from "@tronscan/client/src/signer/chromeExtensionSigner";
import io from 'socket.io-client';

export const Client = new ApiClient();

Client.setSigner(new ChromeExtensionSigner());


export function buildClient(account) {
  return new ApiClient();
}

export function channel(path, options) {
  return io(process.env.API_URL + path, options);
}
