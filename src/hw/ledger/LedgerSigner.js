import {signTransaction} from "@tronscan/client/src/utils/crypto";
import {store} from "../../store";
import {closeTransactionPopup, openTransactionPopup} from "../../actions/app";
import {buildTransactionInfoModal} from "../../utils/modals";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import React from "react";
import {PulseLoader} from "react-spinners";

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


  hideModal = () => {
    store.dispatch(closeTransactionPopup());
  };

  async buildModal(transaction, resolve, error) {

    let cancel = () => {
      error();
      this.hideModal();
    };

    let contractInfo = await buildTransactionInfoModal(transaction);

    return (
      <Modal isOpen={true} toggle={cancel} fade={false} size="lg" className="modal-dialog-centered" >
        <ModalHeader className="text-center" toggle={cancel}>
          Confirm transaction
        </ModalHeader>
        <ModalBody className="p-0">
          {contractInfo}
          <div className="text-center my-1">
            <img src={require("../../images/ledger-nano-s.png")} style={{ height: 50 }}/><br/>
            Confirm the transaction on your ledger
          </div>
          <div className="text-center my-1">
            <PulseLoader color="#343a40" loading={true} height={5} width={150} />
          </div>
        </ModalBody>
        <ModalFooter>

          {/*<button className="btn btn-outline-secondary" onClick={cancel}>*/}
            {/*Cancel*/}
          {/*</button>*/}
          {/*<button className="btn btn-success" onClick={resolve}>*/}
            {/*Confirm*/}
          {/*</button>*/}
        </ModalFooter>
      </Modal>
    )
  }

  async confirm(transaction) {

    store.dispatch(
      openTransactionPopup(
        await this.buildModal(
          transaction,
          () => {
            this.hideModal();
          },
          () => this.hideModal()
        ),
      )
    );
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

  async signTransactionWithLedger(transaction) {

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

  async signTransaction(transaction) {

    try {
      this.confirm(transaction);
      return await this.signTransactionWithLedger(transaction);
    }
    finally {
      this.hideModal();
    }
  }
}
