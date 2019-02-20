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

import {Client} from "../services/api";
const ledgerTokenList = require('./tokens');
const ledgerExchangeList = require('./exchanges');

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


              try {

                const transactionObj = transactionJsonToProtoBuf(transaction);

                const rawDataHex = byteArray2hexStr(transactionObj.getRawData().serializeBinary());

                let raw = transactionObj.getRawData();

                const contractObj = raw.getContractList()[0];

                let contractType = contractObj.getType();

                let tokenInfo = [];
                let extra = {};
                switch (contractType){
                    case 2: // Transfer Assets
                      const ID = tronWeb.toUtf8(
                        transaction.raw_data.contract[0].parameter.value.asset_name
                      );
                      // get token info
                      extra = await this.getTokenExtraInfo(transaction.raw_data.contract[0].parameter.value.asset_name);
                      tokenInfo.push(this.getLedgerTokenInfo(ID).message);
                      break;
                    case 41: //ExchangeCreateContract
                      console.log(transaction.raw_data.contract[0].parameter.value);
                      const token1 =  await this.getTokenExtraInfo(
                        transaction.raw_data.contract[0].parameter.value.first_token_id
                      );
                      const token2 =  await this.getTokenExtraInfo(
                        transaction.raw_data.contract[0].parameter.value.second_token_id
                      );
                      if (token1!== undefined && token2!== undefined){
                        extra = {
                          token1: token1.token_name,
                          decimals1: token1.decimals,
                          token2: token2.token_name,
                          decimals2: token2.decimals,
                        }
                        if (token1.id!=0)tokenInfo.push(this.getLedgerTokenInfo(token1.id).message);
                        if (token2.id!=0)tokenInfo.push(this.getLedgerTokenInfo(token2.id).message);
                      }
                      break;
                    case 42: //ExchangeInjectContract
                      const exchangeDepositID = transaction.raw_data.contract[0].parameter.value.exchange_id;
                      const exchangeDeposit = this.getLedgerExchangeInfo(exchangeDepositID);
                      const exchangeDepositToken = this.getLedgerTokenInfo(tronWeb.toUtf8(
                        transaction.raw_data.contract[0].parameter.value.token_id)
                      );
                      // get exchange info
                      extra = {
                        pair: exchangeDeposit.pair,
                        token: exchangeDepositToken.token_name,
                        decimals: exchangeDepositToken.decimals,
                      };
                      if (exchangeDepositToken.id!=0) tokenInfo.push(exchangeDepositToken.message);
                      break;
                    case 43: //ExchangeWithdrawContract
                      const exchangeWithdrawID = transaction.raw_data.contract[0].parameter.value.exchange_id;
                      const exchangeWithdraw = this.getLedgerExchangeInfo(exchangeWithdrawID);
                      const exchangeWithdrawToken = this.getLedgerTokenInfo(tronWeb.toUtf8(
                        transaction.raw_data.contract[0].parameter.value.token_id)
                      );
                      // get exchange info
                      extra = {
                        pair: exchangeWithdraw.pair,
                        token: exchangeWithdrawToken.token_name,
                        decimals: exchangeWithdrawToken.decimals,
                      };
                      if (exchangeWithdrawToken.id!=0) tokenInfo.push(exchangeWithdrawToken.message);
                      break;
                    case 44: //ExchangeTransactionContract
                      const exchangeID = transaction.raw_data.contract[0].parameter.value.exchange_id;
                      const exchange = this.getLedgerExchangeInfo(exchangeID);
                      // get exchange info
                      extra = {
                        pair: exchange.pair, decimals1: exchange.decimals1, decimals2: exchange.decimals2,
                        action: ((transaction.raw_data.contract[0].parameter.value.token_id===exchange.firstToken)?"Sell":"Buy"),
                      };
                      tokenInfo.push(exchange.message);
                      break;
                }

                extra.hash = rawDataHex;
                  
                this.setState({
                  modal: await this.buildModal(extra, transaction)
                });

                const ledgerBridge = new LedgerBridge();
                const signedResponse = await ledgerBridge.signTransaction({
                  hex: rawDataHex,
                  info: tokenInfo,
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

    async getTokenExtraInfo(ID){
      let tokenID = ID;
      if (typeof tokenID != "number") {
        tokenID = TronWeb.toUtf8(tokenID);
        if (tokenID==="_")
          return {id: 0, decimals: 6, token_name: "TRX"};
        else
          tokenID = parseInt(tokenID);
      }

      const token = await Client.getTokens({id: tokenID});
      if (token.total==1){
        return {id: tokenID, decimals: token.tokens[0].precision, token_name: token.tokens[0].name};
      }
      return {id: -1, decimals: 0, token_name: ""};;
    }

    getLedgerTokenInfo(ID){
      let tokenID = ID;
      if (typeof tokenID != "number") {
        if (tokenID==="_")
          tokenID = 0;
        else
          tokenID = parseInt(tokenID);
      }
      return ledgerTokenList.tokenList.find(o => o.id === tokenID );
    }

    getLedgerExchangeInfo(ID){
      let exchangeID = ID;
      if (typeof exchangeID != "number") {
        exchangeID = parseInt(exchangeID);
      }
      return ledgerExchangeList.exchangeList.find(o => o.id === exchangeID );
    }

    hideModal = () => {
      this.setState({ modal: null });
    };

    async buildModal(extra, transaction, resolve, error) {

      let cancel = () => {
        error();
        this.hideModal();
      };
      console.log(extra);

      return (
        <Modal isOpen={true} fade={false} keyboard={false} size="lg" className="modal-dialog-centered" zIndex="9999">
          <ModalHeader className="text-center" toggle={cancel}>
            Confirm transaction
          </ModalHeader>
          <ModalBody className="p-0">
            <Contract contract={transaction["raw_data"].contract[0]} extra={extra} />
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
