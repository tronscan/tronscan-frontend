const Transport = require("@ledgerhq/hw-transport-node-hid").default;
const AppTrx = require("./Trx");
const LEDGER_SIGNATURE_RESPONSE = require("../../../src/hw/ledger/constants").LEDGER_SIGNATURE_RESPONSE;
const LEDGER_SIGNATURE_REQUEST = require("../../../src/hw/ledger/constants").LEDGER_SIGNATURE_REQUEST;
const LEDGER_CONNECTION_STATUS = require("../../../src/hw/ledger/constants").LEDGER_CONNECTION_STATUS;
const LEDGER_CONNECTION_CHECK = require("../../../src/hw/ledger/constants").LEDGER_CONNECTION_CHECK;
const {ipcMain} = require('electron');

class LedgerBridge {

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
        let response = await trx.signTransaction(this.path, transaction.hex);
        resolve(response);
      } catch(e) {
        reject(e);
      } finally {
        transport.close();
      }
    });
  }

  sendToWeb(event, msg) {
    this.win.webContents.send(event, msg);
  }

  startListener() {

    console.log("START LISTENER");

    ipcMain.on(LEDGER_SIGNATURE_REQUEST, async (event, arg) => {
      let {transaction} = JSON.parse(arg);
      let response = await this.signTransaction(transaction);

      this.sendToWeb(LEDGER_SIGNATURE_RESPONSE, {
        hex: response,
      });
    });

    ipcMain.on(LEDGER_CONNECTION_CHECK, async () => {
      try {
        let address = await this.getAddress();
        this.sendToWeb(LEDGER_CONNECTION_STATUS, {
          connected: true,
          address,
        });
      } catch(e) {
        this.sendToWeb(LEDGER_CONNECTION_STATUS, {
          connected: false,
        });
      }
    });
  }
}

module.exports = LedgerBridge;
