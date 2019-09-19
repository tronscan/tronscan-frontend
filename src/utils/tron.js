import {FormattedNumber} from "react-intl";
import React from "react";

export const tronAddresses = [
  '27d3byPxZXKQWfXX7sJvemJJuv5M65F3vjS',
  '27fXgQ46DcjEsZ444tjZPKULcxiUfDrDjqj',
  '27SWXcHuQgFf9uv49FknBBBYBaH3DUk4JPx',
  '27WtBq2KoSy5v8VnVZBZHHJcDuWNiSgjbE3',
];

export async function transactionResultManager(transaction, tronWeb) {
  const signedTransaction = await tronWeb.trx.sign(transaction, tronWeb.defaultPrivateKey).catch(e => {
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


export function FormattedTRX(props) {
  return (
    <FormattedNumber
      maximumFractionDigits={7}
      minimunFractionDigits={7}
      {...props} />
  );
}
