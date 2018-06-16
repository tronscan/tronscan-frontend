import {signTransaction} from "@tronscan/client/src/utils/crypto";
import {Transaction} from "@tronscan/client/src/protocol/core/Tron_pb";
import {store} from "../store";
import {t, tu} from "../utils/i18n";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import React from "react";
import {closeTransactionPopup, openTransactionPopup} from "../actions/app";
import {buildTransactionInfoModal} from "../utils/modals";

export default class PrivateKeySigner {
  constructor(privateKey) {
    this.privateKey = privateKey;
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
      <Modal isOpen={true} toggle={cancel} fade={false} className="modal-dialog-centered" >
        <ModalHeader className="text-center" toggle={cancel}>
          Transaction
        </ModalHeader>
        <ModalBody className="text-center">
          <h2>Contract</h2>
          {contractInfo}
          <button className="btn btn-success" onClick={resolve}>
            Confirm
          </button>
        </ModalBody>
      </Modal>
    )
  }

  signTransaction(transaction) {

    let privateKey = this.privateKey;

    return new Promise(async (resolve, reject) => {
      store.dispatch(
        openTransactionPopup(
          await this.buildModal(
            transaction,
            () => {
              this.hideModal();
              resolve(signTransaction(privateKey, transaction));
            },
            reject,
          ),
        )
      );
    });
  }
}

