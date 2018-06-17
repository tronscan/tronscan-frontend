import AppTrx from "./Trx";
const Transport = require("@ledgerhq/hw-transport-node-hid").default;
const LEDGER_SIGNATURE_RESPONSE = require("../../../src/hw/ledger/constants").LEDGER_SIGNATURE_RESPONSE;
const LEDGER_SIGNATURE_REQUEST = require("../../../src/hw/ledger/constants").LEDGER_SIGNATURE_REQUEST;
const LEDGER_CONNECTION_STATUS = require("../../../src/hw/ledger/constants").LEDGER_CONNECTION_STATUS;
const LEDGER_CONNECTION_CHECK = require("../../../src/hw/ledger/constants").LEDGER_CONNECTION_CHECK;
const {ipcMain} = require('electron');

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
          transaction.sha256,
          transaction.contractType);
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
      try {
        let response = await this.signTransaction(transaction);

        this.sendToWeb(LEDGER_SIGNATURE_RESPONSE, {
          success: true,
          status: 'ACCEPTED',
          hex: response,
        });
      } catch(e) {
        if (e.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
          this.sendToWeb(LEDGER_SIGNATURE_RESPONSE, {
            success: false,
            status: 'REJECTED',
          });
        } else {
          this.sendToWeb(LEDGER_SIGNATURE_RESPONSE, {
            success: false,
            status: 'UNKNOWN_ERROR',
          });
        }
      }
    });

    ipcMain.on(LEDGER_CONNECTION_CHECK, async () => {
      try {
        let address = await this.getAddress();
        this.sendToWeb(LEDGER_CONNECTION_STATUS, {
          connected: true,
          address,
        });
      } catch(e) {
        console.log("LEDGER_CONNECTION_CHECK", e);
        this.sendToWeb(LEDGER_CONNECTION_STATUS, {
          connected: false,
        });
      }
    });
  }
}

