import {FormattedNumber} from "react-intl";
import { cloneDeep } from 'lodash'
import React from "react";

export const tronAddresses = [
  '27d3byPxZXKQWfXX7sJvemJJuv5M65F3vjS',
  '27fXgQ46DcjEsZ444tjZPKULcxiUfDrDjqj',
  '27SWXcHuQgFf9uv49FknBBBYBaH3DUk4JPx',
  '27WtBq2KoSy5v8VnVZBZHHJcDuWNiSgjbE3',
];

export async function transactionResultManager(transaction, tronWeb) {
  
  const signedTransaction = await tronWeb.trx.sign(transaction, tronWeb.defaultPrivateKey).catch(e => {
    console.log(e.toString());
    return false;
  });
  
  if (signedTransaction) {
    const broadcast = await tronWeb.trx.sendRawTransaction(signedTransaction);
    if (!broadcast.result) {
      broadcast.result = false;
    }
    return broadcast;
  } else {
    return false;
  }
}
export async function transactionResultManagerByLedger(transaction, tronWeb) {
  const signedTransaction = await tronWeb.trx.sign(transaction, tronWeb.defaultPrivateKey).catch(e => {
    console.log(e.toString());
    return false;
  });
  if (signedTransaction) {
    const broadcast = await tronWeb.trx.sendRawTransaction(signedTransaction);
    if (!broadcast.result) {
      broadcast.result = false;
    }
    return { broadcast,signedTransaction };
  } else {
    return false;
  }
}

export async function transactionResultManagerSun(transaction, sunWeb) {
    //sign((transaction = false), (privateKey = this.sidechain.defaultPrivateKey), (useTronHeader = true), (multisig = false));
   
    const signedTransaction = await sunWeb.sidechain.trx.sign(transaction, sunWeb.sidechain.defaultPrivateKey).catch(e => {
        return false;
    });
  
    if (signedTransaction) {
        const broadcast = await sunWeb.sidechain.trx.sendRawTransaction(signedTransaction);
        if (!broadcast.result) {
            broadcast.result = false;
        }
        return broadcast;
    } else {
        return false;
    }
}

export async function transactionMultiResultManager(unSignTransaction, tronWeb, permissionId, permissionTime, HexStr) {
    //set transaction expiration time (1H-24H)
    const newTransaction = await tronWeb.transactionBuilder.extendExpiration(unSignTransaction, (3600*permissionTime-60));
    if(unSignTransaction.extra){
      newTransaction.extra = unSignTransaction.extra;
    }
   
    //sign transaction
    const signedTransaction = await tronWeb.trx.multiSign(newTransaction, tronWeb.defaultPrivateKey , permissionId).catch(e => {
        console.log('e',e)
        return false;
    });
    //set transaction hex parameter value
    if(HexStr && signedTransaction){
        signedTransaction.raw_data.contract[0].parameter.value = HexStr;
    }
    // return transaction
    return signedTransaction;
}


export function FormattedTRX(props) {
  return (
    <FormattedNumber
      maximumFractionDigits={7}
      minimunFractionDigits={7}
      {...props} />
  );
}
