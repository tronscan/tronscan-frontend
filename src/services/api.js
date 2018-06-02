import {Client as ApiClient} from "@tronscan/client";
import {ChromeExtensionSigner} from "@tronscan/client/src/signer/chromeExtensionSigner";
import io from 'socket.io-client';

export const Client = new ApiClient();


setTimeout(async () => {
  let chromeSigner = new ChromeExtensionSigner();
  if (await chromeSigner.isExtensionAvailable()) {
    console.log("ACCOUNT", await chromeSigner.getAccount());
    Client.setSigner(chromeSigner);
  }
}, 1500);

export function buildClient(account) {
  return new ApiClient();
}

export function channel(path, options) {
  return io(process.env.API_URL + path, options);
}
