const SHA256 = require("@tronscan/client/src/utils/crypto").SHA256;
const LEDGER_SIGNATURE_RESPONSE = require("./constants").LEDGER_SIGNATURE_RESPONSE;
const LEDGER_SIGNATURE_REQUEST = require("./constants").LEDGER_SIGNATURE_REQUEST;
const byteArray2hexStr = require("@tronscan/client/src/utils/bytes").byteArray2hexStr;
const {Transaction} = require("@tronscan/client/src/protocol/core/Tron_pb");
const {ipcRenderer} = window.require('electron');

export default class LedgerSigner {

  constructor() {
    console.log("LEDGER ACTIVATED");
  }


  serializeTransaction(transaction) {

    let raw = transaction.getRawData();
    let contract = raw.getContractList()[0];
    let contractType = contract.getType();

    switch (contractType) {
      case Transaction.Contract.ContractType.TRANSFERASSETCONTRACT:
      case Transaction.Contract.ContractType.TRANSFERCONTRACT:
        return {
          contractType,
          sha256: false,
          hex: byteArray2hexStr(raw.serializeBinary()),
        };

      default:
        return {
          contractType,
          sha256: true,
          hex: byteArray2hexStr(SHA256(raw.serializeBinary())),
        };
    }
  }

  async signTransaction(transaction) {

    console.log("GOT LEDGER SIGN REQUEST", transaction);

    return new Promise(resolve => {

      ipcRenderer.once(LEDGER_SIGNATURE_RESPONSE, (event, arg) => {

        console.log("LEDGER_SIGNATURE_RESPONSE", arg);

        let raw = transaction.getRawData();
        let uint8Array = Uint8Array.from(arg.hex);
        let count = raw.getContractList().length;
        for (let i = 0; i < count; i++) {
          transaction.addSignature(uint8Array);
        }

        resolve({
          transaction,
          hex: byteArray2hexStr(transaction.serializeBinary()),
        });
      });

      console.log("SENDING TO LEDGER");

      let serializedTransaction = this.serializeTransaction(transaction);

      ipcRenderer.send(LEDGER_SIGNATURE_REQUEST, JSON.stringify({
        transaction: serializedTransaction,
      }));
    });
  }
}
