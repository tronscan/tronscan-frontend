import React from "react";
import { connect } from "react-redux";
import TronWeb from "tronweb";
import { TransferAssetContract } from "@tronscan/client/src/protocol/core/Contract_pb";
import LedgerBridge from "../hw/ledger/LedgerBridge";
import { transactionJsonToProtoBuf } from "@tronscan/client/src/utils/tronWeb";
import { byteArray2hexStr } from "@tronscan/client/src/utils/bytes";

import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { PulseLoader } from "react-spinners";
import Contract from "../hw/ledger/TransactionConfirmation";
import { ACCOUNT_LEDGER, ACCOUNT_PRIVATE_KEY, ACCOUNT_TRONLINK, SUNWEBCONFIG } from "../constants";

import { Client } from "../services/api";

import config from '../config/main.config'
const ledgerTokenList = require('./tokens');
const ledgerExchangeList = require('./exchanges');

export function withTronWeb(InnerComponent) {
 
  class wrappedComponent extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        modal: null,
      };
    }
    getTronWeb = () => {

      // if (typeof window.tronWeb === 'undefined') {
      const networkUrl = config.networkUrl

      const tronWeb = new TronWeb(
        networkUrl,
        networkUrl,
        networkUrl);

      tronWeb.trx.sign = this.buildTransactionSigner(tronWeb, false);
      tronWeb.trx.multiSign = this.buildTransactionSigner(tronWeb, true);
      return tronWeb;
      // }

      //return window.tronWeb;
    };


    //  async mutiSign(tronWeb,transaction = false, privateKey = false, permissionId = false, callback = false) {
    //    console.log('this.injectPromise',this.injectPromise);
    //    console.log('tronWeb',tronWeb)
    //   let copyTransaction = transaction;
    //   const utils = tronWeb.utils;
    //   if (utils.isFunction(permissionId)) {
    //     callback = permissionId;
    //     permissionId = 0;
    //   }

    //   if (utils.isFunction(privateKey)) {
    //     callback = privateKey;
    //     privateKey = tronWeb.defaultPrivateKey;
    //     permissionId = 0;
    //   }
    //   // if (!callback)
    //   //   return this.injectPromise(this.multiSign, transaction, privateKey, permissionId);

    //   if (!utils.isObject(transaction) || !transaction.raw_data || !transaction.raw_data.contract)
    //     return callback('Invalid transaction provided');
    //   // If owner permission or permission id exists in transaction, do sign directly
    //   // If no permission id inside transaction or user passes permission id, use old way to reset permission id
    //   if (!transaction.raw_data.contract[0].Permission_id && permissionId > 0) {
    //     // set permission id
    //     transaction.raw_data.contract[0].Permission_id = permissionId;
    //     // check if private key insides permission list
    //     // const address = tronWeb.address.toHex(tronWeb.address.fromPrivateKey(privateKey)).toLowerCase();
    //     const address = tronWeb.address.toHex(this.props.wallet.address).toLowerCase();
    //     console.log('address',address);
    //     const signWeight = await tronWeb.trx.getSignWeight(transaction, permissionId);

    //     if (signWeight.result.code === 'PERMISSION_ERROR') {
    //       // throw new Error('PERMISSION_ERROR')
    //        return callback('PERMISSION_ERROR')
    //     }

    //     let foundKey = false;
    //     signWeight.permission.keys.map(key => {
    //       if (key.address === address)
    //         foundKey = true;
    //     });

    //     if (!foundKey)
    //       return callback(privateKey + ' has no permission to sign');
    //       //throw new Error(privateKey + ' has no permission to sign')

    //     if (signWeight.approved_list && signWeight.approved_list.indexOf(address) != -1) {
    //       return callback(privateKey + ' already sign transaction');
    //       //throw new Error(privateKey + ' already sign transaction')
    //     }

    //     // reset transaction
    //     if (signWeight.transaction && signWeight.transaction.transaction) {
    //       transaction = signWeight.transaction.transaction;
    //       if (permissionId > 0) {
    //         transaction.raw_data.contract[0].Permission_id = permissionId;
    //       }
    //       return transaction;
    //     } else {
    //       //throw new Error('Invalid transaction provided')
    //       return callback('Invalid transaction provided');
    //     }
    //   }
    //   return transaction;
    // }

    buildTransactionSigner(tronWeb, isMulti) {
      const { account, wallet } = this.props;

      return async (transaction, privateKey = false, permissionId = false, callback = false) => {

        if (!wallet.isOpen) {
          throw new Error("wallet is not open");
        }
        try {
          switch (wallet.type) {
            case ACCOUNT_LEDGER:

              try {
                const transactionObj = transactionJsonToProtoBuf(transaction);
                const rawDataHex = byteArray2hexStr(transactionObj.getRawData().serializeBinary());
                console.log('rawDataHex',rawDataHex);
                let raw = transactionObj.getRawData();
                let contractObj = raw.getContractList()[0];
                // if (isMulti) {
                //   transaction = await this.mutiSign(tronWeb, transaction, privateKey, permissionId).catch(e=>{
                //     console.log(e.toString())
                //   });
                // }
                let contractType = contractObj.getType();
                console.log('contractType',contractType);
                let PermissionId = contractObj.getPermissionId();
                let tokenInfo = [];
                let extra = {};
              
                switch (contractType) {
                  case 2: // Transfer Assets
                    const ID = tronWeb.toUtf8(
                      transaction.raw_data.contract[0].parameter.value.asset_name
                    );
                    // get token info
                    extra = await this.getTokenExtraInfo(transaction.raw_data.contract[0].parameter.value.asset_name);
                    tokenInfo.push(this.getLedgerTokenInfo(ID).message);
                    break;
                  case 41: //ExchangeCreateContract
                    const token1 = await this.getTokenExtraInfo(
                      transaction.raw_data.contract[0].parameter.value.first_token_id
                    );
                    const token2 = await this.getTokenExtraInfo(
                      transaction.raw_data.contract[0].parameter.value.second_token_id
                    );
                    if (token1 !== undefined && token2 !== undefined) {
                      extra = {
                        token1: token1.token_name,
                        decimals1: token1.decimals,
                        token2: token2.token_name,
                        decimals2: token2.decimals,
                      }
                      if (token1.id != 0) tokenInfo.push(this.getLedgerTokenInfo(token1.id).message);
                      if (token2.id != 0) tokenInfo.push(this.getLedgerTokenInfo(token2.id).message);
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
                    if (exchangeDepositToken.id != 0) tokenInfo.push(exchangeDepositToken.message);
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
                    if (exchangeWithdrawToken.id != 0) tokenInfo.push(exchangeWithdrawToken.message);
                    break;
                  case 44: //ExchangeTransactionContract
                    const exchangeID = transaction.raw_data.contract[0].parameter.value.exchange_id;
                    const exchange = this.getLedgerExchangeInfo(exchangeID);
                    // get exchange info
                    extra = {
                      pair: exchange.pair, decimals1: exchange.decimals1, decimals2: exchange.decimals2,
                      action: ((transaction.raw_data.contract[0].parameter.value.token_id === exchange.firstToken) ? "Sell" : "Buy"),
                    };
                    tokenInfo.push(exchange.message);
                    break;

                  case 31: //Trigger Smart Contract
                    extra = transaction.extra || {};
                    break;
                  case 46:
                    extra = {};
                    tokenInfo = undefined;
                    break;
                }

                extra.hash = transaction.txID;
                this.setState({
                  modal: await this.buildModal(extra, transaction)
                });

                const ledgerBridge = new LedgerBridge();
                let signedResponse;

                signedResponse = await ledgerBridge.signTransaction({
                  hex: rawDataHex,
                  info: tokenInfo,
                })

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

    async getTokenExtraInfo(ID) {
      let tokenID = ID;
      if (typeof tokenID !== "number") {
        tokenID = TronWeb.toUtf8(tokenID);
        if (tokenID === "_")
          return { id: 0, decimals: 6, token_name: "TRX" };
        else
          tokenID = parseInt(tokenID);
      }

      const token = await Client.getTokens({ id: tokenID });
      if (token.total == 1) {
        return { id: tokenID, decimals: token.tokens[0].precision, token_name: token.tokens[0].name };
      }
      return { id: -1, decimals: 0, token_name: "" };;
    }

    getLedgerTokenInfo(ID) {
      let tokenID = ID;
      if (typeof tokenID !== "number") {
        if (tokenID === "_")
          tokenID = 0;
        else
          tokenID = parseInt(tokenID);
      }
      return ledgerTokenList.tokenList.find(o => o.id === tokenID);
    }

    getLedgerExchangeInfo(ID) {
      let exchangeID = ID;
      if (typeof exchangeID !== "number") {
        exchangeID = parseInt(exchangeID);
      }
      return ledgerExchangeList.exchangeList.find(o => o.id === exchangeID);
    }

    hideModal = () => {
      this.setState({ modal: null });
    };

    async buildModal(extra, transaction, resolve, error) {

      let cancel = () => {
        error();
        this.hideModal();
      };

      return (
        <Modal isOpen={true} fade={false} keyboard={false} size="lg" className="modal-dialog-centered" zIndex="9999">
          <ModalHeader className="text-center" toggle={cancel}>
            Confirm transaction
          </ModalHeader>
          <ModalBody className="p-0">
            <Contract contract={transaction["raw_data"].contract[0]} extra={extra} />
            <div className="text-center my-1">
              <img src={require("../hw/ledger/ledger-nano-s.png")} style={{ height: 50 }} /><br />
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

      const { modal } = this.state;

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
    { pure: false },
  )(wrappedComponent);
}
