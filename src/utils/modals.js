import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

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
