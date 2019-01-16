import React from "react";
import {connect} from "react-redux";
import TronWeb from "tronweb";
import {TransferAssetContract} from "@tronscan/client/src/protocol/core/Contract_pb";
import LedgerBridge from "../hw/ledger/LedgerBridge";
import {transactionJsonToProtoBuf} from "@tronscan/client/src/utils/tronWeb";
import {byteArray2hexStr} from "@tronscan/client/src/utils/bytes";

import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {PulseLoader} from "react-spinners";
import Contract from "../hw/ledger/TransactionConfirmation";
import {ACCOUNT_LEDGER, ACCOUNT_PRIVATE_KEY, ACCOUNT_TRONLINK} from "../constants";


export function withTronWeb(InnerComponent) {

  const wrappedComponent = class extends React.Component {


    state = {
      modal: null,
    };

    getTronWeb = () => {

      // if (typeof window.tronWeb === 'undefined') {
      const networkUrl = `https://api.trongrid.io`;

      const tronWeb = new TronWeb(
        networkUrl,
        networkUrl,
        networkUrl);

      tronWeb.trx.sign = this.buildTransactionSigner(tronWeb);

      return tronWeb;
      // }

      return window.tronWeb;
    };

    buildTransactionSigner(tronWeb) {
      const {account, wallet} = this.props;

      return async (transaction) => {

        console.log("SIGNING TRANSACTION", transaction);

        if (!wallet.isOpen) {
          throw new Error("wallet is not open");
        }

        try {

          switch (wallet.type) {
            case ACCOUNT_LEDGER:

              this.setState({
                modal: await this.buildModal(transaction)
              });

              try {

                const transactionObj = transactionJsonToProtoBuf(transaction);

                const rawDataHex = byteArray2hexStr(transactionObj.getRawData().serializeBinary());

                let raw = transactionObj.getRawData();

                const contractObj = raw.getContractList()[0];

                let contractType = contractObj.getType();

                const ledgerBridge = new LedgerBridge();

                const signedResponse = await ledgerBridge.signTransaction({
                  hex: rawDataHex,
                  contractType,
                });

                transaction.signature = [Buffer.from(signedResponse).toString('hex')];

                return transaction;
              } finally {
                this.hideModal();
              }

              break;

            case ACCOUNT_PRIVATE_KEY:
              return tronWeb.utils.crypto.signTransaction(account.key, transaction);
            case ACCOUNT_TRONLINK:
              return tronWeb.trx.sign(transaction);

          }


        } catch (e) {
          console.error(e);
        }
      };
    }

    hideModal = () => {
      this.setState({ modal: null });
    };

    async buildModal(transaction, resolve, error) {

      let cancel = () => {
        error();
        this.hideModal();
      };

      return (
        <Modal isOpen={true} fade={false} keyboard={false} size="lg" className="modal-dialog-centered" >
          <ModalHeader className="text-center" toggle={cancel}>
            Confirm transaction
          </ModalHeader>
          <ModalBody className="p-0">
            <Contract contract={transaction["raw_data"].contract[0]} />
            <div className="text-center my-1">
              <img src={require("../hw/ledger/ledger-nano-s.png")} style={{ height: 50 }}/><br/>
              Confirm the transaction on your ledger
            </div>
            <div className="text-center my-1">
              <PulseLoader color="#343a40" loading={true} height={5} width={150} />
            </div>
          </ModalBody>
          <ModalFooter>

          </ModalFooter>
        </Modal>
      )
    }

    render() {

      const {modal} = this.state;

      return (
        <React.Fragment>
          {modal}
          <InnerComponent
            tronWeb={this.getTronWeb}
            {...this.props}
          />
        </React.Fragment>

      );
    }
  };

  return connect(
    state => ({
      account: state.app.account,
      wallet: state.app.wallet,
    }),
    null,
    null,
    {pure: false},
  )(wrappedComponent);
}
