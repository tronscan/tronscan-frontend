import AppTrx from '@ledgerhq/hw-app-trx';
import Transport from "@ledgerhq/hw-transport-u2f";

export default class LedgerBridge {
  constructor(win) {
    this.path = "44'/195'/0'/0/0";
  }

  async checkForConnection(confirm = false) {
    return new Promise(async (resolve, reject) => {
      const transport = await Transport.create();
      try {
        const trx = new AppTrx(transport);
        let {address} = await trx.getAddress(this.path, confirm);
        resolve({
          address,
          connected: true,
        });
      } catch(e) {
        resolve({
          address: false,
          connected: false,
        });
      } finally {
        transport.close();
      }
    });
  }
  async getAddress() {
    return new Promise(async (resolve, reject) => {
      const transport = await Transport.create();
      try {
        const trx = new AppTrx(transport);
        let {address} = await trx.getAddress(this.path);
        resolve(address);
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
        const response = await trx.signTransaction(
          this.path,
          transaction.hex,
          transaction.info
        );
        resolve(response);
      } catch(e) {
        reject(e);
      } finally {
        transport.close();
      }
    });
  }

}
