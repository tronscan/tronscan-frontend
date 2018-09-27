import {channel} from "./api";
import {byteArray2hexStr} from "@tronscan/client/src/utils/bytes";
import {hexStr2byteArray} from "@tronscan/client/src/lib/code";
import {Transaction} from "@tronscan/client/src/protocol/core/Tron_pb";
import {random} from "lodash";

const uuidv1 = require("uuid/v1");

export class ExternalSigner {

  constructor(cmp) {
    this.cmp = cmp;
    this.uuid = uuidv1().toString().replace(/-/g, "");
    // this.signListener = channel(`/sign-${this.uuid}`);
    // this.signListener.on("device-connected", loginResult => {
    //   this.cmp.onDeviceConneced(loginResult);
    // });

    this.regenerateCode();
  }

  regenerateCode() {
    this.code = random(900000, 999999);
  }

  close() {
    this.signListener.close();
  }

  /**
   * Sign the given transaction
   */
  async signTransaction(transaction) {

    let transactionBytes = transaction.serializeBinary();
    let transactionHex = byteArray2hexStr(transactionBytes);

    return new Promise((resolve, error) => {
      this.cmp.waitForTransaction(error);
      // this.signListener.emit("sign-request", {transaction: {hex: transactionHex}}, signedTransaction => {
      //   let bytesDecode = hexStr2byteArray(signedTransaction.transaction.hex);
      //   let transaction = Transaction.deserializeBinary(bytesDecode);
      //   setTimeout(() => {
      //     this.cmp.hideModal();
      //     resolve({transaction, hex: signedTransaction.transaction.hex});
      //   }, 1200);
      // });
    });
  }
}
