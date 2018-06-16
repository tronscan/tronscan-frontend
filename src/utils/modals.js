import React from "react";
import {find} from "lodash";
import SweetAlert from "react-bootstrap-sweetalert";
import {Transaction} from "@tronscan/client/src/protocol/core/Tron_pb";
import {getContractListFromTransaction} from "@tronscan/client/src/utils/serialization";
import Contract from "../components/tools/TransactionConfirmation/Contract";
import {Client} from "../services/api";
import {byteArray2hexStr} from "@tronscan/client/src/utils/bytes";


export function buildTransactionErrorModal(errorCode, errorMessage = '', errorTitle = '') {

  switch (errorCode) {
    case 'SIGERROR':
      return ({hideModal}) => (
        <SweetAlert warning title="Invalid Signature" onConfirm={hideModal}>
          A signature error occurred while trying to send the transaction
        </SweetAlert>
      );
    case 'CONTRACT_VALIDATE_ERROR':
      break;
    case 'CONTRACT_EXE_ERROR':
      break;
    case 'BANDWITH_ERROR':
      return ({hideModal}) => (
        <SweetAlert warning title="Insufficient bandwidth" onConfirm={hideModal}>
          Not enough bandwidth to complete the transaction
        </SweetAlert>
      );

    case 'DUP_TRANSACTION_ERROR':

      break;
    case 'TAPOS_ERROR':

      break;
    case 'TOO_BIG_TRANSACTION_ERROR':

      break;
  }
}



export async function buildTransactionInfoModal(transaction) {
  let {transaction: transactionJson} = await Client.readTransaction(byteArray2hexStr(transaction.serializeBinary()));

  return (
    <Contract contract={transactionJson.contracts[0]} />
  )
}
