import TrezorConnect from "trezor-connect";
import TronWeb from "tronweb";
import { pickBy, pick } from "lodash";

function toHex(str) {
  return TronWeb.address.toHex(str);
}


export default class TrezorSigner {

  serializeContract(contract) {

    const values = contract.parameter.value;

    switch (contract.type.toUpperCase()) {

      case "TRANSFERCONTRACT":
        return {
          transfer_contract: {
            to_address: TronWeb.address.fromHex(values.to_address),
            amount: values.amount,
          },
        };

      case "TRANSFERASSETCONTRACT":
        return {
          transfer_asset_contract: {
            to_address: TronWeb.address.fromHex(values.to_address),
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

        // "parameter": {
        // "value": {
        //   "resource": "ENERGY",
        //     "frozen_duration": 3,
        //     "frozen_balance": 1000000,
        //     "receiver_address": "41fa63d2b302d8186abebac68c5ae0344a58aeb5a4",
        //     "owner_address": "4182dd6b9966724ae2fdc79b416c7588da67ff1b35"
        // },

      case "FREEZEBALANCECONTRACT":



        return {
          freeze_balance_contract: pickBy({
            frozen_balance: values.frozen_balance,
            frozen_duration: values.frozen_duration,
            resource: values.resource === "ENERGY" ? 1 : null,
            receiver_address: values.receiver_address || null,
          }, (value) => value !== null),
        };

      case "UNFREEZEBALANCECONTRACT":
        return {
          unfreeze_balance_contract: {
            resource: values.resource === "ENERGY" ? 1 : 0,
            ...pick(values, ['receiver_address']),
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
            votes: values.votes.map(vote => ({
              vote_address: TronWeb.address.fromHex(vote.vote_address),
              vote_count: vote.vote_count,
            })),
          }
        };

      default:
        return {};
    }
  }

  async serializeTransaction(transaction) {

    return {
      ref_block_bytes: transaction.raw_data.ref_block_bytes,
      ref_block_hash: transaction.raw_data.ref_block_hash,
      expiration: transaction.raw_data.expiration,
      timestamp: transaction.raw_data.timestamp,
      contract: this.serializeContract(transaction.raw_data.contract[0]),
    };
  }

  async signTransaction(transaction) {

    console.log("SIGN TREZOR TRANSACTION", transaction);

    try {

      let transactionJson = await this.serializeTransaction(transaction);

      console.log("transactionJson", transactionJson);

      let result = await TrezorConnect.tronSignTransaction({
        "path": "m/44'/195'/0'/0/0",
        "transaction": transactionJson,
      });

      console.log("RETURN", result);

      let {success, payload} = result;

      if (success) {
        // let raw = transaction.getRawData();
        // let uint8Array = Uint8Array.from(hexStr2byteArray(payload.signature));
        // console.log("SIGNATURE", payload.signature, uint8Array);
        // let count = raw.getContractList().length;
        // for (let i = 0; i < count; i++) {
        //   transaction.addSignature(uint8Array);
        // }

        return {
          ...transaction,
          signature: [payload.signature],
          // hex: byteArray2hexStr(transaction.serializeBinary()),
        };
      }

    }
    catch(e) {
      console.error(e);
    }
  }
}
