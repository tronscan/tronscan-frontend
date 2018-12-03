import AppTrx from "./Tron";
import Transport from "@ledgerhq/hw-transport-u2f";

export default class LedgerBridge {
  constructor(win) {
    this.win = win;
    this.transport = null;
    this.path = "44'/195'/0'/0/0";
  }

  async listenForConnection() {
    return new Promise(resolve => {
      const sub = Transport.listen({
        next: async e => {
          if (e.type === "add") {
            sub.unsubscribe();
            resolve(e);
          }
        },
        error: error => {
          console.log("GOT ERROR", error);
        },
        complete: () => {
          console.log("DONE");
        }
      });
    });
  }
  async getAddress() {
    return new Promise(async (resolve, reject) => {
      const transport = await Transport.create();
      try {
        const trx = new AppTrx(transport);
        let address = await trx.getAddress(this.path);
        resolve(address.address);
      } catch(e) {
        reject(e);
      } finally {
        transport.close();
      }
    });
  }
  async signTransaction(transaction) {
    return new Promise(async (resolve, reject) => {
      const transport = await Transport.create();
      try {
        const trx = new AppTrx(transport);
        let response = await trx.signTransaction(
          this.path,
          transaction.hex,
          false, //transaction.sha256,
          transaction.contractType);
        resolve(response);
      } catch(e) {
        reject(e);
      } finally {
        transport.close();
      }
    });
  }
}
