const Transport = require("@ledgerhq/hw-transport-node-hid").default;
const AppTrx = require("./Trx");
const {ipcMain} = require('electron');

class LedgerBridge {

  constructor(win) {
    this.win = win;
    this.transport = null;
    this.path = "44'/195'/0'/0/0";
  }

  startListener() {

    ipcMain.on("ledger-sign-request", async (event, arg) => {
      let {transaction} = JSON.parse(arg);
      let response = await this.transport.signTransaction(this.path, transaction.hex);
      console.log("LEDGER SIGNED RESPONSE", response);

      this.win.webContents.send('ledger-trx-signed', {
        hex: response,
      })
    });


    const sub = Transport.listen({
      next: async e => {

        if (e.type === "add") {
          sub.unsubscribe();

          this.win.webContents.send('ledger', {
            type: 'LEDGER_CONNECTED',
          });

          let poll = () => setTimeout(async () => {
            const transport = await Transport.open(e.descriptor);
            try {
              const trx = new AppTrx(transport);
              let address = await trx.getAddress(this.path, true);
              this.transport = trx;

              this.win.webContents.send('ledger', {
                type: 'LEDGER_ADDRESS',
                address: address.address,
              });

            } catch(e) {
              transport.close();
              poll();
            }
            finally {

            }
          }, 2000);

          poll();
        }
      },
      error: error => {
        console.log("GOT ERROR", error);
      },
      complete: () => {
        console.log("DONE");
      }
    });

  }
}

module.exports = LedgerBridge;
