import {trim} from "lodash";
import {Client} from "./api";
import {store} from "../store";
import {enableFlag, setTheme} from "../actions/app";

export async function doSearch(criteria,type) {

  criteria = trim(criteria);

  if (criteria === "") {
    return null;
  }

  let searches = [
    searchBlockNumber,
    searchBlockHash,
    searchTxHash,
    searchToken,
    searchAddress
  ];

  if (criteria.toLowerCase() === "enter the grid") {
    store.dispatch(setTheme("tron"));
    return true;
  }
  if (criteria.toLowerCase() === "scan-trx") {
    store.dispatch(enableFlag("scanTransactionQr"));
    return true;
  }
console.log(type);
  for (let search of searches) {

    try {

      if(type===search.name){
          let result = await search(criteria);
          if (typeof result !== 'undefined') {
              return result;
          }
      }

    } catch(e) {}
  }

  return null;
}



async function searchBlockNumber(criteria) {
  let {blocks} = await Client.getBlocks({
    number: criteria,
    limit: 1,
  });

  if (blocks.length === 1) {
    return `#/block/${blocks[0].number}`;
  }
}

async function searchTxHash(criteria) {
  let {transactions} = await Client.getTransactions({
    hash: criteria,
    limit: 1,
  });

  if (transactions.length === 1) {
    return `#/transaction/${transactions[0].hash}`;
  }

}

async function searchBlockHash(criteria) {

  let {blocks: blocksHash} = await Client.getBlocks({
    hash: criteria,
    limit: 1,
  });

  if (blocksHash.length === 1) {
    return `#/block/${blocksHash[0].number}`;
  }
}

async function searchAddress(criteria) {

  let {accounts} = await Client.getAccounts({
    address: criteria,
    limit: 1,
  });

  if (accounts.length === 1) {
    return `#/address/${accounts[0].address}`;
  }

}

async function searchToken(criteria) {


  let {tokens} = await Client.getTokens({
    name: `%${criteria}%`,
    limit: 1,
  });

  if (tokens.length === 1) {
    return `#/token/${tokens[0].name}`;
  }

}
