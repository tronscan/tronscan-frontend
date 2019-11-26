import {FormattedNumber} from "react-intl";
import React from "react";

export const tronAddresses = [
  '27d3byPxZXKQWfXX7sJvemJJuv5M65F3vjS',
  '27fXgQ46DcjEsZ444tjZPKULcxiUfDrDjqj',
  '27SWXcHuQgFf9uv49FknBBBYBaH3DUk4JPx',
  '27WtBq2KoSy5v8VnVZBZHHJcDuWNiSgjbE3',
];

export async function transactionTrxSign(transaction, tronWeb) {
    console.log('transaction',transaction)
    const signedTransaction = await tronWeb.trx.sign(transaction, tronWeb.defaultPrivateKey, true, true ).catch(e => {
        console.log('e',e)
        return false;
    });
    console.log('tronWeb.defaultPrivateKey',tronWeb.defaultPrivateKey)
    console.log('signedTransaction',signedTransaction)
    return signedTransaction;
}

export async function transactionResultManager(transaction, tronWeb) {
    console.log('transaction222',transaction)
  const signedTransaction = await tronWeb.trx.sign(transaction, tronWeb.defaultPrivateKey).catch(e => {
    return false;
  });
    console.log('signedTransaction222',signedTransaction)
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

export async function transactionMultiResultManager(transaction, tronWeb, permissionId) {
    console.log('permissionId',permissionId)
    console.log('tronWeb',tronWeb)
    const signedTransaction = await tronWeb.trx.multiSign(transaction, tronWeb.defaultPrivateKey , permissionId).catch(e => {
        console.log('e',e)
        return false;
    });
    return signedTransaction;

    // if (signedTransaction) {
    //     const broadcast = await tronWeb.trx.sendRawTransaction(signedTransaction);
    //     if (!broadcast.result) {
    //         broadcast.result = false;
    //     }
    //     return broadcast;
    // } else {
    //     return false;
    // }
}


export function FormattedTRX(props) {
  return (
    <FormattedNumber
      maximumFractionDigits={7}
      minimunFractionDigits={7}
      {...props} />
  );
}
