

export const tronAddresses = [
  '27d3byPxZXKQWfXX7sJvemJJuv5M65F3vjS',
  '27fXgQ46DcjEsZ444tjZPKULcxiUfDrDjqj',
  '27SWXcHuQgFf9uv49FknBBBYBaH3DUk4JPx',
  '27WtBq2KoSy5v8VnVZBZHHJcDuWNiSgjbE3',
];

export async function transactionResultManager(transaction,tronWeb){
    const signedTransaction = await tronWeb.trx.sign(transaction, tronWeb.defaultPrivateKey);
    const broadcast = await tronWeb.trx.sendRawTransaction(signedTransaction);
    return broadcast;
}
