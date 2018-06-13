import {LEDGER_CONNECTION_CHECK, LEDGER_CONNECTION_STATUS} from "./constants";

const {ipcRenderer} = window.require('electron');

export default class LedgerDevice {

  requestConnectionStatus() {
    console.log("REQUESTED STATUS");
    ipcRenderer.send(LEDGER_CONNECTION_CHECK);
  }

  checkForConnection() {
    return new Promise(resolve => {
      ipcRenderer.once(LEDGER_CONNECTION_STATUS, (event, arg) => {
        console.log("GOT STATUS RESPONSE", arg);
        resolve(arg);
      });

      this.requestConnectionStatus();
    });
  }

  async requestAddress() {

  }

  close() {
    ipcRenderer.removeAllListeners('ledger');
  }

}
