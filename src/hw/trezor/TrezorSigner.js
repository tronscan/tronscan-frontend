import React from "react";
import TrezorConnect from "trezor-connect";
import {byteArray2hexStr} from "@tronscan/client/src/utils/bytes";
import {Client} from "../../services/api";
import {hexStr2byteArray} from "@tronscan/client/src/lib/code";

function toHex(str) {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }
  return hex;
}


export default class TrezorSigner {

  constructor() {

  }

  serializeContract(contract) {

    switch (contract.contractType.toUpperCase()) {

      case "TRANSFERCONTRACT":
        return {
          transfer_contract: {
            owner_address: toHex(contract.from),
            to_address: toHex(contract.to),
            amount: contract.amount,
          }
        };

      case "TRANSFERASSETCONTRACT":
        return {
          transfer_asset_contract: {
            owner_address: toHex(contract.from),
            to_address: toHex(contract.to),
            asset_name: toHex(contract.token),
            amount: contract.amount,
          }
        };


      case "WITNESSCREATECONTRACT":
        return {
          witness_create_contract: {
            owner_address: toHex(contract.ownerAddress),
            url: toHex(contract.from),
          },
        };


      case "WITNESSUPDATECONTRACT":
        return {
          witness_update_contract: {
            owner_address: toHex(contract.ownerAddress),
            url: toHex(contract.from),
          },
        };

      case "ASSETISSUECONTRACT":
        return {
          asset_issue_contract: {
            owner_address: toHex(contract.ownerAddress),
            name: toHex(contract.totalSupply),
            abbr: toHex(contract.abbr),
            total_supply: contract.totalSupply,
            frozen_supply: contract.frozenSupply.map(frozen => ({
              frozen_amount: frozen.amount,
              frozen_days: frozen.days,
            })),
            trx_num: contract.trxNum,
            num: contract.num,
            start_time: contract.startTime,
            end_time: contract.endTime,
            description: toHex(contract.description),
            url: toHex(contract.url),
          },
        };

      case "PARTICIPATEASSETISSUECONTRACT":
        return {
          participate_asset_issue_contract: {
            owner_address: toHex(contract.ownerAddress),
            to_address: toHex(contract.toAddress),
            asset_name: toHex(contract.token),
            amount: contract.amount,
          }
        };


      case "ACCOUNTUPDATECONTRACT":
        return {
          account_update_contract: {
            owner_address: toHex(contract.ownerAddress),
            account_name: toHex(contract.name),
          }
        };

      case "FREEZEBALANCECONTRACT":
        return {
          freeze_balance_contract: {
            owner_address: toHex(contract.ownerAddress),
            frozen_balance: contract.frozenBalance,
            frozen_duration: contract.frozenDuration,
          }
        };

      case "UNFREEZEBALANCECONTRACT":
        return {
          unfreeze_balance_contract: {
            owner_address: toHex(contract.ownerAddress),
          }
        };

      case "WITHDRAWBALANCECONTRACT":
        return {
          withdraw_balance_contract: {
            owner_address: toHex(contract.ownerAddress),

          }
        };

      case "VOTEWITNESSCONTRACT":
        return {
          vote_witness_contract: {
            owner_address: toHex(contract.ownerAddress),
            votes: contract.votes.map(vote => ({
              vote_address: toHex(vote.voteAddress),
              vote_count: vote.voteCount,
            })),
          }
        };

      default:
        return {};
    }
  }

  async serializeTransaction(transaction) {

    // let t = {
    //   ref_block_bytes: "C565",
    //   ref_block_hash: "6CD623DBE83075D8",
    //   expiration: 1528768890000,
    //   timestamp: 1528768831987,
    //   contract: [{
    //     type: 1,
    //     parameter: {
    //       api: "type.googleapis.com/protocol.TransferContract",
    //       payload: {
    //         transfer_contract: {
    //           owner_address: toHex('TUEZSdKsoDHQMeZwihtdoBiN46zxhGWYdH'),
    //           to_address: toHex('TKSXDA8HfE9E1y39RczVQ1ZascUEtaSToF'),
    //           amount: 1000000,
    //         },
    //       },
    //     },
    //   }],
    // };

    // {
    //   "ref_block_bytes": "C565",
    //   "ref_block_hash": "6CD623DBE83075D8",
    //   "expiration": 1528768890000,
    //   "timestamp": 1528768831987,
    //   "contract": {
    //   "transfer_contract": {
    //     "to_address": "41684fdb264c9c65cdac2a7ef0f8b902eadfb4d8d1",
    //       "amount": 1000000
    //   }
    // }
    // }

    // return t;

    let {transaction: transactionJson} = await Client.readTransaction(byteArray2hexStr(transaction.serializeBinary()));
    console.log("JSON RESPONSE", transactionJson);
    let raw = transaction.getRawData();

    let contract = transactionJson.contracts[0];

    // let rawBytes = raw.serializeBinary();
    // console.log("HASHING", rawBytes);
    // let hashBytes = SHA256(rawBytes);
    // console.log("HASH BYTES", byteArray2hexStr(hashBytes));

    return {
      ref_block_bytes: byteArray2hexStr(raw.getRefBlockBytes()),
      ref_block_hash: byteArray2hexStr(raw.getRefBlockHash()),
      expiration: raw.getExpiration(),
      timestamp: raw.getTimestamp(),
      contract: [{
        type: contract.contractTypeId,
        parameter: {
          api: `type.googleapis.com/protocol.${contract.contractType}`,
          payload: {
            ...this.serializeContract(contract),
          }
        }
      }],
    };
  }

  async signTransaction(transaction) {

    console.log("SIGN TREZOR TRANSACTION", transaction);

    try {

      let transactionJson = await this.serializeTransaction(transaction);

      console.log("transactionJson", transactionJson);

      let result = await TrezorConnect.tronSignTx({
        "path": "m/44'/195'/0'/0/0",
        "transaction": transactionJson,
      });

      let {success, payload} = result;
      console.log("RETURN", result);

      if (success) {
        let raw = transaction.getRawData();
        let uint8Array = Uint8Array.from(hexStr2byteArray(payload.signature));
        console.log("SIGNATURE", payload.signature, uint8Array);
        let count = raw.getContractList().length;
        for (let i = 0; i < count; i++) {
          transaction.addSignature(uint8Array);
        }

        return {
          transaction,
          hex: byteArray2hexStr(transaction.serializeBinary()),
        };
      }

    }
    catch(e) {
      console.error(e);
    }
  }
}
